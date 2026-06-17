#!/usr/bin/env bash
set -euo pipefail
DOC="docs/security/COMMAND_PARSER_CONTRACT_V1.md"
OUT="receipts/security/evidence/command-parser-contract-v1.json"
test -f "$DOC"
test -f "$OUT"
grep -q "COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION" "$DOC"
grep -q "Runtime parser implemented: false" "$DOC"
grep -q "Execution enabled: false" "$DOC"
grep -q "Private key use: forbidden" "$DOC"
grep -q "Transaction broadcast: forbidden" "$DOC"
grep -q "Chain mutation: forbidden" "$DOC"
jq -e ".id == \"command-parser-contract-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"SPEC_ONLY_NO_RUNTIME_PARSER\"" "$OUT" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION\"" "$OUT" >/dev/null
jq -e ".allowlist_required == true" "$OUT" >/dev/null
jq -e ".unknown_commands_rejected == true" "$OUT" >/dev/null
jq -e ".ambiguous_commands_rejected == true" "$OUT" >/dev/null
jq -e ".operational_commands_rejected == true" "$OUT" >/dev/null
jq -e ".wallet_interaction_forbidden == true" "$OUT" >/dev/null
jq -e ".private_key_used == false" "$OUT" >/dev/null
jq -e ".transaction_signed == false" "$OUT" >/dev/null
jq -e ".transaction_broadcast == false" "$OUT" >/dev/null
jq -e ".storage_write_attempted == false" "$OUT" >/dev/null
jq -e ".chain_state_mutated == false" "$OUT" >/dev/null
jq -e ".runtime_parser_implemented == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$OUT" >/dev/null
jq -e ".real_execution_enabled == false" "$OUT" >/dev/null
jq -e ".final_contract_status == \"COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION\"" "$OUT" >/dev/null
jq -e ".allowed_inert_command_classes | index(\"READ_STATUS\")" "$OUT" >/dev/null
jq -e ".allowed_inert_command_classes | index(\"QUERY_LANE\")" "$OUT" >/dev/null
jq -e ".allowed_inert_command_classes | index(\"VERIFY_HASH\")" "$OUT" >/dev/null
jq -e ".allowed_inert_command_classes | index(\"READ_RECEIPT\")" "$OUT" >/dev/null
jq -e ".allowed_inert_command_classes | index(\"READ_DOC\")" "$OUT" >/dev/null
jq -e ".allowed_inert_command_classes | index(\"LIST_ALLOWED_COMMANDS\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"UNKNOWN\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"AMBIGUOUS\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"EXECUTE\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"DEPLOY\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"UPLOAD\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"BROADCAST\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"SIGN\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"USE_PRIVATE_KEY\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"SEND_TRANSACTION\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"WRITE_STORAGE\")" "$OUT" >/dev/null
jq -e ".mandatory_rejection_classes | index(\"MUTATE_CHAIN\")" "$OUT" >/dev/null
npm run verify:evidence
echo "COMMAND_PARSER_CONTRACT_V1_CHECK=PASS"
