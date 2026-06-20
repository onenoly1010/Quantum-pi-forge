#!/usr/bin/env bash
set -euo pipefail

DOC="docs/spiral-return/SPIRAL_RETURN_TRAVEL_READINESS_GATE_V1.md"
RECEIPT="receipts/spiral-return/spiral-return-travel-readiness-gate-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "Wallet actions: FALSE" "$DOC"
grep -q "Funding movement: FALSE" "$DOC"
grep -q "Departure is not considered ready" "$DOC"
jq -e '.wallet_actions == false and .funding_movement == false and .departure_ready == false' "$RECEIPT" >/dev/null

echo "PASS spiral-return-travel-readiness-gate-v1"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
