#!/usr/bin/env bash
set -euo pipefail
BRIDGE_DRYRUN="receipts/security/evidence/parser-orchestrator-bridge-dry-run-v1.json"
OUT="receipts/security/evidence/parser-orchestrator-bridge-negative-test-v1.json"
DOC="docs/security/PARSER_ORCHESTRATOR_BRIDGE_NEGATIVE_TEST_V1.md"
test -f "$BRIDGE_DRYRUN"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"parser-orchestrator-bridge-dry-run-v1\"" "$BRIDGE_DRYRUN" >/dev/null
jq -e ".result == \"PASS\"" "$BRIDGE_DRYRUN" >/dev/null
jq -e ".posture == \"PARSER_ORCHESTRATOR_BRIDGE_DRY_RUN_INERT_ONLY\"" "$BRIDGE_DRYRUN" >/dev/null
jq -e ".bridge_output.runtime_connection_created == false" "$BRIDGE_DRYRUN" >/dev/null
jq -e ".real_execution_enabled == false" "$BRIDGE_DRYRUN" >/dev/null
jq -e ".id == \"parser-orchestrator-bridge-negative-test-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"FAIL_CLOSED_CONFIRMED_NO_RUNTIME_BRIDGE\"" "$OUT" >/dev/null
jq -e ".posture == \"PARSER_ORCHESTRATOR_BRIDGE_NEGATIVE_TEST_FAIL_CLOSED\"" "$OUT" >/dev/null
jq -e ".bridge_dry_run.verified == true" "$OUT" >/dev/null
jq -e ".negative_cases | length == 10" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"EXECUTE\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"SEND_TRANSACTION\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"USE_PRIVATE_KEY\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"BROADCAST\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"WRITE_STORAGE\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"MUTATE_CHAIN\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"MALFORMED_INTENT\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"MISSING_INTENT_TYPE\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"SIDE_EFFECTS_TRUE\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".negative_cases[] | select(.case == \"EXECUTION_AUTHORIZED_TRUE\" and .accepted_by_bridge == false)" "$OUT" >/dev/null
jq -e ".all_negative_cases_rejected == true" "$OUT" >/dev/null
jq -e ".unsafe_parser_outputs_rejected == true" "$OUT" >/dev/null
jq -e ".malformed_bridge_payloads_rejected == true" "$OUT" >/dev/null
jq -e ".execution_like_intents_rejected == true" "$OUT" >/dev/null
jq -e ".parser_runtime_execution == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_execution == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$OUT" >/dev/null
jq -e ".real_execution_enabled == false" "$OUT" >/dev/null
jq -e ".operational_mode_enabled == false" "$OUT" >/dev/null
jq -e ".private_key_used == false" "$OUT" >/dev/null
jq -e ".transaction_signed == false" "$OUT" >/dev/null
jq -e ".transaction_broadcast == false" "$OUT" >/dev/null
jq -e ".storage_write_attempted == false" "$OUT" >/dev/null
jq -e ".chain_state_mutated == false" "$OUT" >/dev/null
jq -e ".final_negative_status == \"FAIL_CLOSED_CONFIRMED_NO_RUNTIME_BRIDGE\"" "$OUT" >/dev/null
grep -q "PARSER_ORCHESTRATOR_BRIDGE_NEGATIVE_TEST_FAIL_CLOSED" "$DOC"
grep -q "FAIL_CLOSED_CONFIRMED_NO_RUNTIME_BRIDGE" "$DOC"
grep -q "No orchestrator runtime connection is created" "$DOC"
npm run verify:evidence
echo "PARSER_ORCHESTRATOR_BRIDGE_NEGATIVE_TEST_V1_CHECK=PASS"
