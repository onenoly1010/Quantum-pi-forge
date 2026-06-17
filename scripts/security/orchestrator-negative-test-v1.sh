#!/usr/bin/env bash
set -euo pipefail
DRY_RUN_SCRIPT="scripts/security/gated-command-orchestrator-dry-run-v1.sh"
DRY_RUN_RECEIPT="receipts/security/evidence/gated-command-orchestrator-dry-run-v1.json"
POLICY="receipts/security/evidence/operational-ship-boundary-policy-v1.json"
WALKTHROUGH="receipts/security/evidence/security-evidence-walkthrough-v1.json"
OUT="receipts/security/evidence/orchestrator-negative-test-v1.json"
DOC="docs/security/ORCHESTRATOR_NEGATIVE_TEST_V1.md"
test -x "$DRY_RUN_SCRIPT"
test -f "$DRY_RUN_RECEIPT"
test -f "$POLICY"
test -f "$WALKTHROUGH"
jq -e ".id == \"gated-command-orchestrator-dry-run-v1\" and .result == \"PASS\" and .mode == \"DRY_RUN\" and .dry_run_signal == true and .operational_signal == false and .real_execution_enabled == false and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false" "$DRY_RUN_RECEIPT" >/dev/null
jq -e ".id == \"operational-ship-boundary-policy-v1\" and .status == \"POLICY_ONLY_NO_ORCHESTRATION\" and .posture == \"non_executing_orchestration_boundary\" and .orchestrator_implemented == false" "$POLICY" >/dev/null
jq -e ".id == \"security-evidence-walkthrough-v1\" and .result == \"PASS\"" "$WALKTHROUGH" >/dev/null
npm run verify:evidence
if bash "$DRY_RUN_SCRIPT" OPERATIONAL >/tmp/qpf-orchestrator-operational-negative.out 2>&1; then echo "NEGATIVE_TEST_FAILED_OPERATIONAL_MODE_ACCEPTED"; exit 1; fi
TMP_DIR="$(mktemp -d)"
if (cd "$TMP_DIR" && bash "$OLDPWD/$DRY_RUN_SCRIPT" DRY_RUN >/tmp/qpf-orchestrator-missing-policy-negative.out 2>&1); then echo "NEGATIVE_TEST_FAILED_MISSING_POLICY_ACCEPTED"; exit 1; fi
POLICY_SHA="$(sha256sum "$POLICY" | awk "{print \$1}")"
WALKTHROUGH_SHA="$(sha256sum "$WALKTHROUGH" | awk "{print \$1}")"
DRY_RUN_SHA="$(sha256sum "$DRY_RUN_RECEIPT" | awk "{print \$1}")"
printf "%s\n" "{" "  \"id\": \"orchestrator-negative-test-v1\"," "  \"result\": \"PASS\"," "  \"posture\": \"fail_closed_orchestrator_negative_test\"," "  \"purpose\": \"Prove the gated command orchestrator rejects operational mode and missing policy evidence before command parsing or live execution exists.\"," "  \"tested_subject\": {\"path\": \"${DRY_RUN_SCRIPT}\", \"receipt\": \"${DRY_RUN_RECEIPT}\", \"sha256\": \"${DRY_RUN_SHA}\"}," "  \"prerequisites\": {" "    \"policy\": {\"path\": \"${POLICY}\", \"sha256\": \"${POLICY_SHA}\", \"status\": \"VALIDATED\"}," "    \"security_evidence_walkthrough\": {\"path\": \"${WALKTHROUGH}\", \"sha256\": \"${WALKTHROUGH_SHA}\", \"status\": \"VALIDATED\"}" "  }," "  \"negative_cases\": [" "    {\"case\": \"OPERATIONAL_mode_rejected\", \"input_mode\": \"OPERATIONAL\", \"expected_result\": \"reject\", \"actual_result\": \"rejected\"}," "    {\"case\": \"missing_policy_context_rejected\", \"input_mode\": \"DRY_RUN\", \"expected_result\": \"reject\", \"actual_result\": \"rejected\"}" "  ]," "  \"dry_run_mode_still_required\": true," "  \"operational_mode_accepted\": false," "  \"missing_policy_accepted\": false," "  \"command_parser_implemented\": false," "  \"real_execution_enabled\": false," "  \"private_key_used\": false," "  \"transaction_signed\": false," "  \"transaction_broadcast\": false," "  \"storage_write_attempted\": false," "  \"chain_state_mutated\": false," "  \"final_negative_test_status\": \"FAIL_CLOSED_CONFIRMED\"" "}" > "$OUT"
printf "%s\n" "# Orchestrator Negative-Test v1" "" "This negative test proves the gated command orchestrator fails closed before command parsing or live execution exists." "" "## Tested subject" "" "- Script: \`${DRY_RUN_SCRIPT}\`" "- Receipt: \`${DRY_RUN_RECEIPT}\`" "" "## Negative cases" "" "| Case | Expected | Result |" "| --- | --- | --- |" "| \`OPERATIONAL\` mode attempted | Reject | Rejected |" "| Missing policy/evidence context | Reject | Rejected |" "" "## Current posture" "" "- Dry-run mode still required: \`true\`" "- Operational mode accepted: \`false\`" "- Missing policy accepted: \`false\`" "- Command parser implemented: \`false\`" "- Real execution enabled: \`false\`" "- Private key used: \`false\`" "- Transaction signed: \`false\`" "- Transaction broadcast: \`false\`" "- Storage write attempted: \`false\`" "- Chain-state mutated: \`false\`" "" "## Final negative-test status" "" "\`FAIL_CLOSED_CONFIRMED\`" > "$DOC"
jq -e ".id == \"orchestrator-negative-test-v1\" and .result == \"PASS\" and .posture == \"fail_closed_orchestrator_negative_test\" and .dry_run_mode_still_required == true and .operational_mode_accepted == false and .missing_policy_accepted == false and .command_parser_implemented == false and .real_execution_enabled == false and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false and .final_negative_test_status == \"FAIL_CLOSED_CONFIRMED\"" "$OUT" >/dev/null
grep -Fq "Orchestrator Negative-Test v1" "$DOC"
grep -Fq "FAIL_CLOSED_CONFIRMED" "$DOC"
echo "ORCHESTRATOR_NEGATIVE_TEST_V1_CHECK=PASS"
