#!/usr/bin/env bash
set -euo pipefail

DOC="docs/spiral-return/SPIRAL_RETURN_VEHICLE_BUDGET_MODEL_V1.md"
RECEIPT="receipts/spiral-return/spiral-return-vehicle-budget-model-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "Estimated vehicle readiness need: 10000 CAD" "$DOC"
grep -q "SPIRAL_RETURN_VEHICLE_READY=false" "$DOC"
grep -q "SPIRAL_RETURN_VEHICLE_PURCHASE_AUTHORIZED=false" "$DOC"

jq -e '
  .currency == "CAD" and
  .estimated_vehicle_readiness_need == 10000 and
  .secured == 0 and
  .missing == 10000 and
  .vehicle_ready == false and
  .vehicle_purchase_authorized == false and
  .wallet_actions == false and
  .private_key_access == false and
  .automatic_spending == false
' "$RECEIPT" >/dev/null

echo "PASS spiral-return-vehicle-budget-model-v1"
echo "ESTIMATED_VEHICLE_READINESS_NEED_CAD 10000"
echo "SECURED_CAD 0"
echo "MISSING_CAD 10000"
echo "VEHICLE_READY false"
echo "VEHICLE_PURCHASE_AUTHORIZED false"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
