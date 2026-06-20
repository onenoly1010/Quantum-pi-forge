#!/usr/bin/env bash
set -euo pipefail

DOC="docs/spiral-return/SPIRAL_RETURN_TRAVEL_BUDGET_MODEL_V1.md"
RECEIPT="receipts/spiral-return/spiral-return-travel-budget-model-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "Estimated minimum need: 4550 CAD" "$DOC"
grep -q "SPIRAL_RETURN_TRAVEL_READY=false" "$DOC"
grep -q "No category becomes real until the secured amount is tied to an actual source" "$DOC"

jq -e '
  .currency == "CAD" and
  .estimated_minimum_need == 4550 and
  .secured == 0 and
  .missing == 4550 and
  .travel_ready == false and
  .wallet_actions == false and
  .funding_movement == false
' "$RECEIPT" >/dev/null

echo "PASS spiral-return-travel-budget-model-v1"
echo "ESTIMATED_MINIMUM_NEED_CAD 4550"
echo "SECURED_CAD 0"
echo "MISSING_CAD 4550"
echo "TRAVEL_READY false"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
