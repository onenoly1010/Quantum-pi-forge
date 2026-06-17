#!/usr/bin/env bash
set -euo pipefail
CONTRACT="receipts/security/evidence/command-parser-contract-v1.json"
NEGATIVE="receipts/security/evidence/command-parser-negative-test-v1.json"
DRYRUN="receipts/security/evidence/command-parser-dry-run-v1.json"
OUT="receipts/security/evidence/command-parser-final-status-v1.json"
DOC="docs/security/COMMAND_PARSER_FINAL_STATUS_V1.md"
test -f "$CONTRACT"
test -f "$NEGATIVE"
test -f "$DRYRUN"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"command-parser-contract-v1\"" "$CONTRACT" >/dev/null
jq -e ".result == \"PASS\"" "$CONTRACT" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION\"" "$CONTRACT" >/dev/null
jq -e ".runtime_parser_implemented == false" "$CONTRACT" >/dev/null
jq -e ".real_execution_enabled == false" "$CONTRACT" >/dev/null
jq -e ".id == \"command-parser-negative-test-v1\"" "$NEGATIVE" >/dev/null
jq -e ".result == \"PASS\"" "$NEGATIVE" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_NEGATIVE_TEST_FAIL_CLOSED_NO_RUNTIME\"" "$NEGATIVE" >/dev/null
jq -e ".all_negative_cases_rejected == true" "$NEGATIVE" >/dev/null
jq -e ".real_execution_enabled == false" "$NEGATIVE" >/dev/null
jq -e ".id == \"command-parser-dry-run-v1\"" "$DRYRUN" >/dev/null
jq -e ".result == \"PASS\"" "$DRYRUN" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_DRY_RUN_INERT_INTENT_ONLY\"" "$DRYRUN" >/dev/null
jq -e ".allowlisted_intent_mapped == true" "$DRYRUN" >/dev/null
jq -e ".unsafe_input_rejected == true" "$DRYRUN" >/dev/null
jq -e ".real_execution_enabled == false" "$DRYRUN" >/dev/null
jq -e ".id == \"command-parser-final-status-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$OUT" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_FINAL_STATUS_SEALED\"" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.contract.verified == true" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.negative_test.verified == true" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.dry_run.verified == true" "$OUT" >/dev/null
jq -e ".parser_lane_sealed == true" "$OUT" >/dev/null
jq -e ".final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$OUT" >/dev/null
jq -e ".runtime_parser_executes_commands == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$OUT" >/dev/null
jq -e ".real_execution_enabled == false" "$OUT" >/dev/null
jq -e ".operational_mode_enabled == false" "$OUT" >/dev/null
jq -e ".private_key_used == false" "$OUT" >/dev/null
jq -e ".transaction_signed == false" "$OUT" >/dev/null
jq -e ".transaction_broadcast == false" "$OUT" >/dev/null
jq -e ".storage_write_attempted == false" "$OUT" >/dev/null
jq -e ".chain_state_mutated == false" "$OUT" >/dev/null
jq -e ".future_bridge_required_before_orchestrator_connection == true" "$OUT" >/dev/null
jq -e ".final_status == \"COMMAND_PARSER_FINAL_STATUS_SEALED\"" "$OUT" >/dev/null
grep -q "COMMAND_PARSER_FINAL_STATUS_SEALED" "$DOC"
grep -q "SEALED_VERIFIED_NON_EXECUTION" "$DOC"
grep -q "No orchestrator runtime is connected" "$DOC"
npm run verify:evidence
echo "COMMAND_PARSER_FINAL_STATUS_V1_CHECK=PASS"
