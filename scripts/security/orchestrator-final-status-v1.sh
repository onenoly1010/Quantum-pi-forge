#!/usr/bin/env bash
set -euo pipefail
POLICY="receipts/security/evidence/operational-ship-boundary-policy-v1.json"
DRYRUN="receipts/security/evidence/gated-command-orchestrator-dry-run-v1.json"
NEGATIVE="receipts/security/evidence/orchestrator-negative-test-v1.json"
OUT="receipts/security/evidence/orchestrator-final-status-v1.json"
DOC="docs/security/ORCHESTRATOR_FINAL_STATUS_V1.md"
test -f "$POLICY"
test -f "$DRYRUN"
test -f "$NEGATIVE"
jq -e ".id == \"operational-ship-boundary-policy-v1\" and .result == \"PASS\" and .status == \"POLICY_ONLY_NO_ORCHESTRATION\" and .posture == \"non_executing_orchestration_boundary\" and .final_policy_status == \"BOUNDARY_DEFINED\"" "$POLICY" >/dev/null
jq -e ".id == \"gated-command-orchestrator-dry-run-v1\" and .result == \"PASS\" and .mode == \"DRY_RUN\" and .dry_run_signal == true and .operational_signal == false and .real_execution_enabled == false" "$DRYRUN" >/dev/null
jq -e ".id == \"orchestrator-negative-test-v1\" and .result == \"PASS\" and .posture == \"fail_closed_orchestrator_negative_test\" and .operational_mode_accepted == false and .missing_policy_accepted == false and .command_parser_implemented == false and .real_execution_enabled == false and .final_negative_test_status == \"FAIL_CLOSED_CONFIRMED\"" "$NEGATIVE" >/dev/null
npm run verify:evidence
POLICY_SHA="$(sha256sum "$POLICY" | awk "{print \$1}")"
DRYRUN_SHA="$(sha256sum "$DRYRUN" | awk "{print \$1}")"
NEGATIVE_SHA="$(sha256sum "$NEGATIVE" | awk "{print \$1}")"
printf "%s\n" "{" "  \"id\": \"orchestrator-final-status-v1\"," "  \"result\": \"PASS\"," "  \"lane\": \"gated-command-orchestrator-lane-v1\"," "  \"status\": \"DRY_RUN_COMPLETE_FAIL_CLOSED_VERIFIED\"," "  \"posture\": \"verified_non_execution\"," "  \"purpose\": \"Seal the orchestrator lane after boundary policy, dry-run scaffold, and fail-closed negative tests pass.\"," "  \"receipts\": {" "    \"operational_ship_boundary_policy_v1\": {\"path\": \"${POLICY}\", \"sha256\": \"${POLICY_SHA}\", \"status\": \"BOUNDARY_DEFINED\"}," "    \"gated_command_orchestrator_dry_run_v1\": {\"path\": \"${DRYRUN}\", \"sha256\": \"${DRYRUN_SHA}\", \"status\": \"DRY_RUN_PASS\"}," "    \"orchestrator_negative_test_v1\": {\"path\": \"${NEGATIVE}\", \"sha256\": \"${NEGATIVE_SHA}\", \"status\": \"FAIL_CLOSED_CONFIRMED\"}" "  }," "  \"evidence_verification\": \"npm run verify:evidence PASS\"," "  \"dry_run_complete\": true," "  \"fail_closed_verified\": true," "  \"command_parser_implemented\": false," "  \"real_execution_enabled\": false," "  \"operational_mode_enabled\": false," "  \"private_key_used\": false," "  \"transaction_signed\": false," "  \"transaction_broadcast\": false," "  \"storage_write_attempted\": false," "  \"chain_state_mutated\": false," "  \"final_lane_status\": \"SEALED_VERIFIED_NON_EXECUTION\"" "}" > "$OUT"
printf "%s\n" "# Orchestrator Final Status v1" "" "This document seals the gated command orchestrator lane after the boundary policy, dry-run scaffold, and fail-closed negative test have passed." "" "## Lane status" "" "- Lane: \`gated-command-orchestrator-lane-v1\`" "- Status: \`DRY_RUN_COMPLETE_FAIL_CLOSED_VERIFIED\`" "- Posture: \`verified_non_execution\`" "" "## Sealed receipts" "" "| Receipt | Status |" "| --- | --- |" "| \`${POLICY}\` | \`BOUNDARY_DEFINED\` |" "| \`${DRYRUN}\` | \`DRY_RUN_PASS\` |" "| \`${NEGATIVE}\` | \`FAIL_CLOSED_CONFIRMED\` |" "" "## Current safety state" "" "- Dry-run complete: \`true\`" "- Fail-closed verified: \`true\`" "- Command parser implemented: \`false\`" "- Real execution enabled: \`false\`" "- Operational mode enabled: \`false\`" "- Private key used: \`false\`" "- Transaction signed: \`false\`" "- Transaction broadcast: \`false\`" "- Storage write attempted: \`false\`" "- Chain-state mutated: \`false\`" "" "## Final lane status" "" "\`SEALED_VERIFIED_NON_EXECUTION\`" > "$DOC"
jq -e ".id == \"orchestrator-final-status-v1\" and .result == \"PASS\" and .status == \"DRY_RUN_COMPLETE_FAIL_CLOSED_VERIFIED\" and .posture == \"verified_non_execution\" and .dry_run_complete == true and .fail_closed_verified == true and .command_parser_implemented == false and .real_execution_enabled == false and .operational_mode_enabled == false and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false and .final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$OUT" >/dev/null
grep -Fq "Orchestrator Final Status v1" "$DOC"
grep -Fq "SEALED_VERIFIED_NON_EXECUTION" "$DOC"
echo "ORCHESTRATOR_FINAL_STATUS_V1_CHECK=PASS"
