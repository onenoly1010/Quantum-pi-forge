#!/usr/bin/env bash
set -euo pipefail

DOC="docs/spiral-return/SPIRAL_RETURN_ACTIVATION_INDEX_V1.md"
RECEIPT="receipts/spiral-return/spiral-return-activation-index-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

for f in \
  docs/spiral-return/SPIRAL_RETURN_TRAVEL_READINESS_GATE_V1.md \
  docs/spiral-return/SPIRAL_RETURN_TRAVEL_LEDGER_V1.md \
  docs/spiral-return/SPIRAL_RETURN_TRAVEL_BUDGET_MODEL_V1.md \
  docs/spiral-return/SPIRAL_RETURN_SECURED_SOURCE_LEDGER_V1.md \
  docs/spiral-return/SPIRAL_RETURN_FUNDING_ACTION_PLAN_V1.md
do
  test -f "$f"
done

grep -q "Activation does not mean departure" "$DOC"
grep -q "SPIRAL_RETURN_READINESS_LANE_ACTIVE=true" "$DOC"
grep -q "SPIRAL_RETURN_TRAVEL_READY=false" "$DOC"
grep -q "SPIRAL_RETURN_DEPARTURE_AUTHORIZED=false" "$DOC"

jq -e '
  .readiness_lane_active == true and
  .travel_ready == false and
  .departure_authorized == false and
  .wallet_actions == false and
  .private_key_access == false and
  .funding_movement == false and
  .network_execution == false and
  .estimated_minimum_need_cad == 4550 and
  .confirmed_secured_total_cad == 0 and
  .remaining_gap_cad == 4550
' "$RECEIPT" >/dev/null

echo "PASS spiral-return-activation-index-v1"
echo "READINESS_LANE_ACTIVE true"
echo "TRAVEL_READY false"
echo "DEPARTURE_AUTHORIZED false"
echo "ESTIMATED_MINIMUM_NEED_CAD 4550"
echo "CONFIRMED_SECURED_TOTAL_CAD 0"
echo "REMAINING_GAP_CAD 4550"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
