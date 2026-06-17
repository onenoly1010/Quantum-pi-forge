#!/usr/bin/env bash
set -euo pipefail
CONTRACT="receipts/security/evidence/command-parser-contract-v1.json"
OUT="receipts/security/evidence/command-parser-negative-test-v1.json"
DOC="docs/security/COMMAND_PARSER_NEGATIVE_TEST_V1.md"
test -f "$CONTRACT"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"command-parser-contract-v1\"" "$CONTRACT" >/dev/null
jq -e ".result == \"PASS\"" "$CONTRACT" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION\"" "$CONTRACT" >/dev/null
jq -e ".runtime_parser_implemented == false" "$CONTRACT" >/dev/null
jq -e ".real_execution_enabled == false" "$CONTRACT" >/dev/null
jq -e ".id == \"command-parser-negative-test-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"NEGATIVE_TEST_FAIL_CLOSED_NO_RUNTIME_PARSER\"" "$OUT" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_NEGATIVE_TEST_FAIL_CLOSED_NO_RUNTIME\"" "$OUT" >/dev/null
jq -e ".contract.status == \"VALIDATED\"" "$OUT" >/dev/null
jq -e ".all_negative_cases_rejected == true" "$OUT" >/dev/null
jq -e ".unknown_commands_accepted == false" "$OUT" >/dev/null
jq -e ".ambiguous_commands_accepted == false" "$OUT" >/dev/null
jq -e ".operational_commands_accepted == false" "$OUT" >/dev/null
jq -e ".wallet_interaction_accepted == false" "$OUT" >/dev/null
jq -e ".runtime_parser_implemented == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$OUT" >/dev/null
jq -e ".real_execution_enabled == false" "$OUT" >/dev/null
jq -e ".private_key_used == false" "$OUT" >/dev/null
jq -e ".transaction_signed == false" "$OUT" >/dev/null
jq -e ".transaction_broadcast == false" "$OUT" >/dev/null
jq -e ".storage_write_attempted == false" "$OUT" >/dev/null
jq -e ".chain_state_mutated == false" "$OUT" >/dev/null
jq -e ".final_negative_test_status == \"FAIL_CLOSED_CONFIRMED_NO_RUNTIME_PARSER\"" "$OUT" >/dev/null
jq -e ".negative_cases | length == 11" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"UNKNOWN\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"AMBIGUOUS\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"EXECUTE\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"DEPLOY\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"UPLOAD\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"BROADCAST\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"SIGN\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"USE_PRIVATE_KEY\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"SEND_TRANSACTION\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"WRITE_STORAGE\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.semantic_class == \"MUTATE_CHAIN\" and .actual_result == \"rejected\")" "$OUT" >/dev/null
grep -q "COMMAND_PARSER_NEGATIVE_TEST_FAIL_CLOSED_NO_RUNTIME" "$DOC"
grep -q "No runtime parser is implemented" "$DOC"
grep -q "No command string is executed" "$DOC"
npm run verify:evidence
echo "COMMAND_PARSER_NEGATIVE_TEST_V1_CHECK=PASS"
