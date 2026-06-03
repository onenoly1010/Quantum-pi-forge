#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/journal/intent.log"
SIG="$ROOT/journal/intent.log.sig"
STATE_ROOT="$ROOT/journal/state-root.cache"
VERIFY_SCRIPT="$ROOT/scripts/journal-verify.sh"
OUT_DIR="$ROOT/journal/sync-out"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BUNDLE_DIR="$OUT_DIR/batch-$STAMP"

fail() {
  echo "SYNC-FAIL: $*" >&2
  exit 1
}

echo "=== Execution Truth Batch Export ==="
echo "Mode: READ-ONLY / EXPORT-ONLY"
echo "No network broadcast will be performed."
echo

[[ -f "$LOG" ]] || fail "missing journal/intent.log"
[[ -f "$SIG" ]] || fail "missing journal/intent.log.sig"
[[ -f "$STATE_ROOT" ]] || fail "missing journal/state-root.cache"
[[ -x "$VERIFY_SCRIPT" ]] || fail "missing executable scripts/journal-verify.sh"

echo "Running local deterministic verification..."
"$VERIFY_SCRIPT"

mkdir -p "$BUNDLE_DIR"

cp "$LOG" "$BUNDLE_DIR/intent.log"
cp "$SIG" "$BUNDLE_DIR/intent.log.sig"
cp "$STATE_ROOT" "$BUNDLE_DIR/state-root.cache"

python3 - "$BUNDLE_DIR" <<'PY'
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

bundle = Path(sys.argv[1])
log = bundle / "intent.log"
sig = bundle / "intent.log.sig"
state_root = bundle / "state-root.cache"
manifest = bundle / "manifest.json"

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

entries = []
with log.open("r", encoding="utf-8") as f:
    for line_no, raw in enumerate(f, 1):
        line = raw.strip()
        if not line:
            continue
        obj = json.loads(line)
        entries.append({
            "line": line_no,
            "hash": obj.get("hash"),
            "prev_hash": obj.get("prev_hash"),
            "ts": obj.get("ts"),
            "intent": obj.get("intent"),
        })

latest_root = state_root.read_text(encoding="utf-8").strip()

doc = {
    "schema": "qpf.execution_truth.batch.v1",
    "created_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    "mode": "read-only-export",
    "network_broadcast": False,
    "journal_entries": len(entries),
    "latest_state_root": latest_root,
    "files": {
        "intent.log": sha256_file(log),
        "intent.log.sig": sha256_file(sig),
        "state-root.cache": sha256_file(state_root),
    },
    "entries": entries,
    "notice": "This bundle is an offline verification/export artifact only. It does not prove on-chain publication.",
}

manifest.write_text(
    json.dumps(doc, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
    encoding="utf-8",
)

print(f"Created manifest: {manifest}")
print(f"Entries: {len(entries)}")
print(f"Latest state root: {latest_root}")
PY

tarball="$OUT_DIR/batch-$STAMP.tar.gz"
tar -C "$OUT_DIR" -czf "$tarball" "batch-$STAMP"

echo
echo "Batch export complete."
echo "Bundle directory: $BUNDLE_DIR"
echo "Tarball: $tarball"
echo
echo "No journal rotation performed."
echo "No on-chain transaction performed."
echo "Execution Truth export is ready for later review or manual sync."
