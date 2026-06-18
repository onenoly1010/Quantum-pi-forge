#!/usr/bin/env bash
set -euo pipefail

DOC="docs/ops/SPIRAL_RETURN_FIELD_KIT_V1.md"
KIT="scripts/field/spiral-return-field-kit-v1.cjs"
PLAN_REC="receipts/ops/spiral-return-field-plan-v1.json"

test -f "$DOC"
test -f "$KIT"
test -f "$PLAN_REC"

grep -q "No live execution is authorized by this kit." "$DOC"
grep -q "LOCAL_ONLY_OFFLINE" "$DOC"
grep -q "No wallet access" "$DOC"
grep -q "pending_human_reconciliation: true" "$KIT"
grep -q "wallet_actions_authorized: false" "$KIT"
grep -q "live_transaction_signing_authorized: false" "$KIT"
grep -q "outbound_network_sync: false" "$KIT"

node "$KIT" --attest --checkpoint "verification-self-test" >/tmp/spiral-return-field-kit-v1.out

grep -q "MOBILE_NODE_ATTESTATION_SEALED" /tmp/spiral-return-field-kit-v1.out
grep -q "PENDING_HUMAN_RECONCILIATION=true" /tmp/spiral-return-field-kit-v1.out

echo "SPIRAL_RETURN_FIELD_KIT_V1_VERIFIED"
