#!/usr/bin/env bash
set -euo pipefail

DOC="docs/spiral-return/SPIRAL_RETURN_FUNDING_ACTION_PLAN_V1.md"
RECEIPT="receipts/spiral-return/spiral-return-funding-action-plan-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "Estimated minimum need: 4550 CAD" "$DOC"
grep -q "Remaining gap: 4550 CAD" "$DOC"
grep -q "SPIRAL_RETURN_TRAVEL_READY=false" "$DOC"
grep -q "Do not move wallet or crypto funds inside this plan" "$DOC"

jq -e '
  .currency == "CAD" and
  .estimated_minimum_need == 4550 and
  .confirmed_secured_total == 0 and
  .remaining_gap == 4550 and
  .travel_ready == false and
  .wallet_actions == false and
  .private_key_access == false and
  .funding_movement == false and
  .debt_pressure == false
' "$RECEIPT" >/dev/null

echo "PASS spiral-return-funding-action-plan-v1"
echo "ESTIMATED_MINIMUM_NEED_CAD 4550"
echo "CONFIRMED_SECURED_TOTAL_CAD 0"
echo "REMAINING_GAP_CAD 4550"
echo "TRAVEL_READY false"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
