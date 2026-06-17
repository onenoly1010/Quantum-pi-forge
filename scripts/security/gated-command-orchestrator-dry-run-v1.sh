#!/usr/bin/env bash
set -euo pipefail
MODE="${1:-DRY_RUN}"
POLICY="receipts/security/evidence/operational-ship-boundary-policy-v1.json"
WALKTHROUGH="receipts/security/evidence/security-evidence-walkthrough-v1.json"
OUT="receipts/security/evidence/gated-command-orchestrator-dry-run-v1.json"
DOC="docs/security/GATED_COMMAND_ORCHESTRATOR_DRY_RUN_V1.md"
test "$MODE" = "DRY_RUN"
test -f "$POLICY"
test -f "$WALKTHROUGH"
jq -e ".id == \"operational-ship-boundary-policy-v1\" and .result == \"PASS\" and .status == \"POLICY_ONLY_NO_ORCHESTRATION\" and .posture == \"non_executing_orchestration_boundary\" and .orchestrator_implemented == false and .final_policy_status == \"BOUNDARY_DEFINED\"" "$POLICY" >/dev/null
jq -e ".id == \"security-evidence-walkthrough-v1\" and .result == \"PASS\" and .posture == \"read_only_reviewer_walkthrough\" and .lanes.wallet_access.status == \"VALIDATED\" and .lanes.storage_da.final_status == \"SEALED\"" "$WALKTHROUGH" >/dev/null
npm run verify:evidence
POLICY_SHA="$(sha256sum "$POLICY" | awk "{print \$1}")"
WALKTHROUGH_SHA="$(sha256sum "$WALKTHROUGH" | awk "{print \$1}")"
printf "%s\n" "{" "  \"id\": \"gated-command-orchestrator-dry-run-v1\"," "  \"result\": \"PASS\"," "  \"mode\": \"DRY_RUN\"," "  \"posture\": \"non_executing_orchestrator_scaffold\"," "  \"policy\": \"ship-boundary-policy-v1\"," "  \"policy_receipt\": {\"path\": \"${POLICY}\", \"sha256\": \"${POLICY_SHA}\", \"status\": \"VALIDATED\"}," "  \"security_evidence_walkthrough\": {\"path\": \"${WALKTHROUGH}\", \"sha256\": \"${WALKTHROUGH_SHA}\", \"status\": \"VALIDATED\"}," "  \"policy_read\": true," "  \"walkthrough_read\": true," "  \"evidence_verified\": true," "  \"dry_run_signal\": true," "  \"operational_signal\": false," "  \"orchestrator_implemented\": true," "  \"real_execution_enabled\": false," "  \"private_key_used\": false," "  \"transaction_signed\": false," "  \"transaction_broadcast\": false," "  \"storage_write_attempted\": false," "  \"chain_state_mutated\": false" "}" > "$OUT"
printf "%s\n" "# Gated Command Orchestrator Dry-Run v1" "" "This document introduces the first \`ship\` orchestrator scaffold in dry-run mode only." "" "## Mode" "" "- Mode: \`DRY_RUN\`" "- Operational signal: \`false\`" "- Real execution enabled: \`false\`" "" "## Verified prerequisites" "" "- Operational Ship Boundary Policy v1: \`${POLICY}\`" "- Security Evidence Walkthrough v1: \`${WALKTHROUGH}\`" "- Evidence verification: \`npm run verify:evidence PASS\`" "" "## Safety posture" "" "- Private key used: \`false\`" "- Transaction signed: \`false\`" "- Transaction broadcast: \`false\`" "- Storage write attempted: \`false\`" "- Chain-state mutated: \`false\`" "" "## Final dry-run status" "" "\`DRY_RUN_PASS\`" > "$DOC"
jq -e ".id == \"gated-command-orchestrator-dry-run-v1\" and .result == \"PASS\" and .mode == \"DRY_RUN\" and .dry_run_signal == true and .operational_signal == false and .real_execution_enabled == false and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false" "$OUT" >/dev/null
grep -Fq "Gated Command Orchestrator Dry-Run v1" "$DOC"
grep -Fq "Operational signal: \`false\`" "$DOC"
echo "GATED_COMMAND_ORCHESTRATOR_DRY_RUN_V1_CHECK=PASS"
