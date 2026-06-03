#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/journal/intent.log"
SIGN="$ROOT/scripts/sign-journal.sh"

fail() {
  echo "APPEND-FAIL: $*" >&2
  exit 1
}

intent="${*:-}"

[[ -n "$intent" ]] || fail "usage: ./scripts/journal-append.sh \"intent text\""
[[ -f "$LOG" ]] || fail "missing journal/intent.log; create genesis first"
[[ -s "$LOG" ]] || fail "journal/intent.log is empty"
[[ -x "$SIGN" ]] || fail "missing executable scripts/sign-journal.sh"

python3 - "$LOG" "$intent" <<'PY'
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

log = Path(sys.argv[1])
intent = sys.argv[2]

last_hash = None

with log.open("r", encoding="utf-8") as f:
    for line_no, raw in enumerate(f, 1):
        line = raw.strip()
        if not line:
            continue
        obj = json.loads(line)
        h = obj.get("hash")
        if not isinstance(h, str) or len(h) != 64:
            raise SystemExit(f"line {line_no}: invalid prior hash")
        last_hash = h

if last_hash is None:
    raise SystemExit("no previous journal entry found")

entry = {
    "ts": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    "intent": intent,
    "prev_hash": last_hash,
}

payload = json.dumps(
    entry,
    sort_keys=True,
    separators=(",", ":"),
    ensure_ascii=False,
).encode("utf-8")

entry["hash"] = hashlib.sha256(payload).hexdigest()

with log.open("a", encoding="utf-8") as f:
    f.write(json.dumps(entry, sort_keys=True, separators=(",", ":"), ensure_ascii=False))
    f.write("\n")

print(f"Appended entry. New state root: {entry['hash']}")
PY

"$SIGN"
