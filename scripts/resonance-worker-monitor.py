#!/usr/bin/env python3
import datetime
import hashlib
import json
import subprocess
from pathlib import Path

def run(cmd):
    p = subprocess.run(
        cmd,
        shell=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    return p.returncode, p.stdout.strip()

root_code, root_out = run("git rev-parse --show-toplevel 2>/dev/null || pwd")
root = Path(root_out)
receipt_dir = root / "receipts" / "resonance-workers"
receipt_dir.mkdir(parents=True, exist_ok=True)

ts = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

_, branch = run("git branch --show-current 2>/dev/null || echo unknown")
_, commit = run("git rev-parse HEAD 2>/dev/null || echo unknown")
_, status_short = run("git status --short 2>/dev/null || true")
_, node_version = run("node --version 2>/dev/null || echo unavailable")
_, npm_version = run("npm --version 2>/dev/null || echo unavailable")
_, process_snapshot = run(
    "ps -eo pid,comm,args 2>/dev/null "
    "| grep -Ei 'resonance|worker|ollama|node|python' "
    "| grep -v grep "
    "| head -n 40 || true"
)

check_code, _ = run("npm run 2>/dev/null | grep -q 'verify:evidence'")
if check_code == 0:
    verify_exit, verify_output = run("npm run verify:evidence")
    verify_command = "npm run verify:evidence"
else:
    verify_exit, verify_output = "missing_script", "verify:evidence script not found"
    verify_command = "npm run verify:evidence"

data = {
    "schema": "qpf.resonance_worker_monitor.v1",
    "timestamp_utc": ts,
    "branch": branch,
    "commit": commit,
    "working_tree_status_short": status_short,
    "runtime": {
        "node": node_version,
        "npm": npm_version,
    },
    "observations": {
        "process_snapshot": process_snapshot,
    },
    "verification": {
        "command": verify_command,
        "exit": str(verify_exit),
        "result_tail": "\n".join(str(verify_output).splitlines()[-80:]),
    },
    "boundary": {
        "claim": "This receipt records local observation only.",
        "does_not_prove": [
            "external funding",
            "third-party review approval",
            "wallet custody",
            "mainnet authority",
            "autonomous external execution",
        ],
    },
}

canonical = json.dumps(data, indent=2, sort_keys=True)
data["sha256"] = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

out = receipt_dir / f"resonance-worker-{ts}.json"
out.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")

print(out)
print("sha256=" + data["sha256"])
