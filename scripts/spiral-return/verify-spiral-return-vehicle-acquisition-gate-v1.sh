#!/usr/bin/env bash
set -euo pipefail

DOC="docs/spiral-return/SPIRAL_RETURN_VEHICLE_ACQUISITION_GATE_V1.md"
RECEIPT="receipts/spiral-return/spiral-return-vehicle-acquisition-gate-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "Reliable used vehicle purchase" "$DOC"
grep -q "Insurance" "$DOC"
grep -q "Registration / plates" "$DOC"
grep -q "SPIRAL_RETURN_VEHICLE_READY=false" "$DOC"
grep -q "SPIRAL_RETURN_VEHICLE_PURCHASE_AUTHORIZED=false" "$DOC"

jq -e '
  .vehicle_ready == false and
  .vehicle_purchase_authorized == false and
  .wallet_actions == false and
  .private_key_access == false and
  .automatic_spending == false and
  .debt_pressure == false
' "$RECEIPT" >/dev/null

echo "PASS spiral-return-vehicle-acquisition-gate-v1"
echo "VEHICLE_READY false"
echo "VEHICLE_PURCHASE_AUTHORIZED false"
echo "WALLET_ACTIONS false"
echo "PRIVATE_KEY_ACCESS false"
echo "AUTOMATIC_SPENDING false"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
