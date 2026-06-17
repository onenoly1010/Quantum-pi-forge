#!/usr/bin/env bash
set -euo pipefail
RECEIPT="receipts/security/evidence/security-evidence-walkthrough-v1.json"
DOC="docs/security/SECURITY_EVIDENCE_WALKTHROUGH_V1.md"
test -f "$RECEIPT"
test -f "$DOC"
jq -e ".id == \"security-evidence-walkthrough-v1\" and .result == \"PASS\" and .posture == \"read_only_reviewer_walkthrough\" and .lanes.wallet_access.status == \"VALIDATED\" and .lanes.wallet_access.receipt_count >= 2 and .lanes.storage_da.status == \"VALIDATED\" and .lanes.storage_da.final_status == \"SEALED\" and .evidence_verification == \"npm run verify:evidence PASS\" and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false" "$RECEIPT" >/dev/null
grep -Fq "Security Evidence Walkthrough v1" "$DOC"
grep -Fq "Wallet/preflight evidence" "$DOC"
grep -Fq "Storage/DA evidence" "$DOC"
grep -Fq "Chain-state mutation: `false`" "$DOC"
npm run verify:evidence
echo "SECURITY_EVIDENCE_WALKTHROUGH_V1_CHECK=PASS"
