#!/usr/bin/env bash
set -Eeuo pipefail

PORT="${1:-3000}"
HOST="127.0.0.1"

if [[ ! -x ./scripts/forge-evidence-packet.sh ]]; then
  echo "ERROR: ./scripts/forge-evidence-packet.sh is missing or not executable" >&2
  exit 2
fi

echo "Starting Quantum Pi Forge local verify server"
echo "URL: http://${HOST}:${PORT}"
echo "GET  /health"
echo "POST /api/forge/verify"
echo "Authority boundary: read-only; no wallet signing, deployment, funds movement, governance execution, or chain mutation."

export FORGE_PORT="$PORT"
export FORGE_HOST="$HOST"

python3 -c '
import json, os, subprocess, time
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler

HOST = os.environ.get("FORGE_HOST", "127.0.0.1")
PORT = int(os.environ.get("FORGE_PORT", "3000"))

def safe_id(value):
    out = []
    for ch in str(value):
        out.append(ch if ch.isalnum() or ch in "._-" else "-")
    return "".join(out).strip("-") or "http-request"

def send_json(handler, status, payload):
    body = json.dumps(payload, indent=2).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)

class ForgeHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args))

    def do_GET(self):
        if self.path == "/health":
            return send_json(self, 200, {
                "status": "ok",
                "skill": "quantum-pi-forge",
                "mode": "local-first",
                "authority": "read-only",
                "wallet_signing": False,
                "deployment": False,
                "chain_mutation": False
            })
        return send_json(self, 404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/api/forge/verify":
            return send_json(self, 404, {"error": "not found"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 20000:
                return send_json(self, 413, {"error": "request too large"})
            req = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            claim_id = safe_id(req.get("claim_id") or ("http-" + str(int(time.time()))))
            target_file = req.get("file") or ""
            pattern = req.get("pattern") or ""
            description = req.get("description") or "No description"
            if not target_file or not pattern:
                return send_json(self, 400, {"error": "missing file or pattern"})
            if Path(target_file).is_absolute() or ".." in Path(target_file).parts:
                return send_json(self, 400, {"error": "file must be a relative path inside the repo"})
            result = subprocess.run([
                "./scripts/forge-evidence-packet.sh",
                claim_id,
                target_file,
                pattern,
                description
            ], capture_output=True, text=True, timeout=30)
            packet_path = Path("examples") / ("verification-packet-" + claim_id + ".json")
            if result.returncode != 0:
                return send_json(self, 500, {"error": "verification command failed", "stderr": result.stderr, "stdout": result.stdout})
            if not packet_path.exists():
                return send_json(self, 500, {"error": "packet was not generated", "expected": str(packet_path)})
            packet = json.loads(packet_path.read_text())
            return send_json(self, 200, packet)
        except Exception as exc:
            return send_json(self, 500, {"error": str(exc)})

server = HTTPServer((HOST, PORT), ForgeHandler)
print(f"Serving on http://{HOST}:{PORT}")
server.serve_forever()
'
