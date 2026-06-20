#!/usr/bin/env bash
set -euo pipefail

DOC="docs/mainnet/MAINNET_WORKER_EARNINGS_READINESS_GATE_V1.md"
RECEIPT="receipts/mainnet/mainnet-worker-earnings-readiness-gate-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "MAINNET_WORKER_EARNINGS_LANE_ACTIVE=true" "$DOC"
grep -q "MAINNET_LIVE_EARNING_AUTHORIZED=false" "$DOC"
grep -q "MAINNET_WALLET_ACTIONS=false" "$DOC"
grep -q "MAINNET_PRIVATE_KEY_ACCESS=false" "$DOC"

jq -e '
  .mainnet_worker_earnings_lane_active == true and
  .mainnet_live_earning_authorized == false and
  .wallet_actions == false and
  .private_key_access == false and
  .automatic_spending == false and
  .automatic_staking == false and
  .automatic_transfers == false
' "$RECEIPT" >/dev/null

echo "PASS mainnet-worker-earnings-readiness-gate-v1"
echo "MAINNET_WORKER_EARNINGS_LANE_ACTIVE true"
echo "MAINNET_LIVE_EARNING_AUTHORIZED false"
echo "WALLET_ACTIONS false"
echo "PRIVATE_KEY_ACCESS false"
echo "AUTOMATIC_SPENDING false"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
