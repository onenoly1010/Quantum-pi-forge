#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
RECEIPT="receipts/security/wallet-preflight-verifier-v1.json"
cleanup() { git restore "$RECEIPT" >/dev/null 2>&1 || true; }
trap cleanup EXIT
echo "=== wallet preflight gate v1 ==="
node scripts/security/wallet-preflight-verifier-v1.cjs
jq -e '.result == "PASS" and .posture == "non_executing_wallet_preflight" and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and (.failures | type == "array") and (.failures | length == 0)' "$RECEIPT" >/dev/null
npm run verify:evidence-index
cleanup
if [ "$#" -eq 0 ]; then echo "WALLET_PREFLIGHT_GATE_V1_PASS=TRUE"; exit 0; fi
echo "WALLET_PREFLIGHT_GATE_V1_PASS=TRUE"
echo "=== executing gated command ==="
exec "$@"
