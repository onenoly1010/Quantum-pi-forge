#!/usr/bin/env bash
set -euo pipefail

DOC="docs/spiral-return/SPIRAL_RETURN_TRAVEL_LEDGER_V1.md"
RECEIPT="receipts/spiral-return/spiral-return-travel-ledger-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "SPIRAL_RETURN_TRAVEL_READY=false" "$DOC"
grep -q "Nothing is treated as secured unless it is named, counted" "$DOC"
jq -e '.wallet_actions == false and .funding_movement == false and .travel_ready == false' "$RECEIPT" >/dev/null

echo "PASS spiral-return-travel-ledger-v1"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
