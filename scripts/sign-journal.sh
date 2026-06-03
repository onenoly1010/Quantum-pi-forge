#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/journal/intent.log"
SIG="$ROOT/journal/intent.log.sig"
PRIVATE_KEY="$ROOT/keys/private.pem"
PUBLIC_KEY="$ROOT/keys/public.pem"
STATE_ROOT="$ROOT/journal/state-root.cache"

fail() {
  echo "SIGN-FAIL: $*" >&2
  exit 1
}

[[ -f "$LOG" ]] || fail "missing journal/intent.log"

if [[ ! -s "$LOG" ]]; then
  fail "journal/intent.log is empty"
fi

if [[ ! -f "$PRIVATE_KEY" || ! -f "$PUBLIC_KEY" ]]; then
  echo "No signing keypair found. Generating local RSA keypair..."
  openssl genrsa -out "$PRIVATE_KEY" 4096 >/dev/null 2>&1
  chmod 600 "$PRIVATE_KEY"
  openssl rsa -in "$PRIVATE_KEY" -pubout -out "$PUBLIC_KEY" >/dev/null 2>&1
  chmod 644 "$PUBLIC_KEY"
  echo "Generated:"
  echo "  $PRIVATE_KEY"
  echo "  $PUBLIC_KEY"
fi

latest_hash="$(
python3 - "$LOG" <<'PY'
import json
import sys

path = sys.argv[1]
latest = None

with open(path, "r", encoding="utf-8") as f:
    for line_no, line in enumerate(f, 1):
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception as e:
            raise SystemExit(f"invalid JSON on line {line_no}: {e}")
        h = obj.get("hash")
        if not isinstance(h, str) or not h:
            raise SystemExit(f"missing hash on line {line_no}")
        latest = h

if not latest:
    raise SystemExit("no journal entries found")

print(latest)
PY
)"

printf '%s\n' "$latest_hash" > "$STATE_ROOT"

openssl dgst -sha256 \
  -sign "$PRIVATE_KEY" \
  -out "$SIG" \
  "$LOG" >/dev/null

echo "Journal signed."
echo "Latest state root: $latest_hash"
echo "Signature: journal/intent.log.sig"
