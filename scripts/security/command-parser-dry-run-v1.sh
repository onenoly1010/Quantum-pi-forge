#!/usr/bin/env bash
set -euo pipefail
CONTRACT="receipts/security/evidence/command-parser-contract-v1.json"
NEGATIVE="receipts/security/evidence/command-parser-negative-test-v1.json"
OUT="receipts/security/evidence/command-parser-dry-run-v1.json"
DOC="docs/security/COMMAND_PARSER_DRY_RUN_V1.md"
test -f "$CONTRACT"
test -f "$NEGATIVE"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"command-parser-contract-v1\"" "$CONTRACT" >/dev/null
jq -e ".result == \"PASS\"" "$CONTRACT" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION\"" "$CONTRACT" >/dev/null
jq -e ".allowed_inert_command_classes | index(\"READ_STATUS\")" "$CONTRACT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"SEND_TRANSACTION\")" "$CONTRACT" >/dev/null
jq -e ".id == \"command-parser-negative-test-v1\"" "$NEGATIVE" >/dev/null
jq -e ".result == \"PASS\"" "$NEGATIVE" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_NEGATIVE_TEST_FAIL_CLOSED_NO_RUNTIME\"" "$NEGATIVE" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"SEND_TRANSACTION\" and .actual_result == \"rejected\")" "$NEGATIVE" >/dev/null
jq -e ".id == \"command-parser-dry-run-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"DRY_RUN_INERT_INTENT_ONLY\"" "$OUT" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_DRY_RUN_INERT_INTENT_ONLY\"" "$OUT" >/dev/null
jq -e ".contract.status == \"VALIDATED\"" "$OUT" >/dev/null
jq -e ".negative_test.status == \"VALIDATED\"" "$OUT" >/dev/null
jq -e ".accepted_case.input == \"READ_STATUS\"" "$OUT" >/dev/null
jq -e ".accepted_case.accepted == true" "$OUT" >/dev/null
jq -e ".accepted_case.command_class == \"READ_STATUS\"" "$OUT" >/dev/null
jq -e ".accepted_case.intent_type == \"INERT_READ_ONLY_STATUS_QUERY\"" "$OUT" >/dev/null
jq -e ".accepted_case.execution_authorized == false" "$OUT" >/dev/null
jq -e ".accepted_case.side_effects_authorized == false" "$OUT" >/dev/null
jq -e ".rejected_case.input == \"SEND_TRANSACTION\"" "$OUT" >/dev/null
jq -e ".rejected_case.accepted == false" "$OUT" >/dev/null
jq -e ".rejected_case.rejection_reason == \"mandatory_rejection_class\"" "$OUT" >/dev/null
jq -e ".rejected_case.execution_authorized == false" "$OUT" >/dev/null
jq -e ".rejected_case.side_effects_authorized == false" "$OUT" >/dev/null
jq -e ".allowlisted_intent_mapped == true" "$OUT" >/dev/null
jq -e ".unsafe_input_rejected == true" "$OUT" >/dev/null
jq -e ".runtime_parser_executes_commands == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$OUT" >/dev/null
jq -e ".real_execution_enabled == false" "$OUT" >/dev/null
jq -e ".operational_mode_enabled == false" "$OUT" >/dev/null
jq -e ".private_key_used == false" "$OUT" >/dev/null
jq -e ".transaction_signed == false" "$OUT" >/dev/null
jq -e ".transaction_broadcast == false" "$OUT" >/dev/null
jq -e ".storage_write_attempted == false" "$OUT" >/dev/null
jq -e ".chain_state_mutated == false" "$OUT" >/dev/null
jq -e ".final_dry_run_status == \"INERT_INTENT_ONLY_NO_EXECUTION\"" "$OUT" >/dev/null
grep -q "COMMAND_PARSER_DRY_RUN_INERT_INTENT_ONLY" "$DOC"
grep -q "READ_STATUS" "$DOC"
grep -q "SEND_TRANSACTION" "$DOC"
grep -q "No runtime command execution occurs" "$DOC"
npm run verify:evidence
echo "COMMAND_PARSER_DRY_RUN_V1_CHECK=PASS"
