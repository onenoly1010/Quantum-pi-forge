#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/journal/intent.log"
SIG="$ROOT/journal/intent.log.sig"
PUBLIC_KEY="$ROOT/keys/public.pem"
STATE_ROOT="$ROOT/journal/state-root.cache"

fail() {
  echo "VERIFY-FAIL: $*" >&2
  exit 1
}

ok() {
  echo "OK: $*"
}

[[ -f "$LOG" ]] || fail "missing journal/intent.log"
[[ -s "$LOG" ]] || fail "journal/intent.log is empty"
[[ -f "$SIG" ]] || fail "missing journal/intent.log.sig"
[[ -f "$PUBLIC_KEY" ]] || fail "missing keys/public.pem"
[[ -f "$STATE_ROOT" ]] || fail "missing journal/state-root.cache"

echo "Verifying journal hash chain..."

latest_hash="$(
python3 - "$LOG" <<'PY'
import hashlib
import json
import sys

path = sys.argv[1]
prev = None
latest = None
count = 0

ZERO_HASH = "0" * 64

def canonical_hash(obj):
    unsigned = dict(obj)
    unsigned.pop("hash", None)

    payload = json.dumps(
        unsigned,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")

    return hashlib.sha256(payload).hexdigest()

with open(path, "r", encoding="utf-8") as f:
    for line_no, raw in enumerate(f, 1):
        line = raw.strip()

        if not line:
            continue

        try:
            obj = json.loads(line)
        except Exception as e:
            raise SystemExit(f"line {line_no}: invalid JSON: {e}")

        if not isinstance(obj, dict):
            raise SystemExit(f"line {line_no}: entry must be a JSON object")

        entry_hash = obj.get("hash")
        prev_hash = obj.get("prev_hash")

        if not isinstance(entry_hash, str) or len(entry_hash) != 64:
            raise SystemExit(f"line {line_no}: missing or invalid hash")

        if not isinstance(prev_hash, str) or len(prev_hash) != 64:
            raise SystemExit(f"line {line_no}: missing or invalid prev_hash")

        expected_hash = canonical_hash(obj)

        if entry_hash != expected_hash:
            raise SystemExit(
                f"line {line_no}: hash mismatch\n"
                f"  expected: {expected_hash}\n"
                f"  actual:   {entry_hash}"
            )

        if prev is None:
            if prev_hash != ZERO_HASH:
                raise SystemExit(
                    f"line {line_no}: genesis prev_hash must be {ZERO_HASH}, got {prev_hash}"
                )
        else:
            if prev_hash != prev:
                raise SystemExit(
                    f"line {line_no}: broken prev_hash link\n"
                    f"  expected previous hash: {prev}\n"
                    f"  actual prev_hash:       {prev_hash}"
                )

        prev = entry_hash
        latest = entry_hash
        count += 1

if count == 0:
    raise SystemExit("no journal entries found")

print(latest)
PY
)"

ok "hash chain valid"
echo "Latest computed state root: $latest_hash"

cached_root="$(tr -d '[:space:]' < "$STATE_ROOT")"

if [[ "$cached_root" != "$latest_hash" ]]; then
  fail "state-root.cache mismatch. expected latest hash $latest_hash but found $cached_root"
fi

ok "state-root.cache matches latest journal hash"

echo "Verifying detached signature..."

if ! openssl dgst -sha256 \
  -verify "$PUBLIC_KEY" \
  -signature "$SIG" \
  "$LOG" >/dev/null; then
  fail "signature mismatch; journal may have been modified after signing"
fi

ok "signature valid"
echo "Execution Truth verified."
