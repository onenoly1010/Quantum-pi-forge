#!/usr/bin/env bash
set -euo pipefail
DRYRUN="receipts/security/evidence/runtime-activation-dry-run-plan-v1.json"
OUT="receipts/security/evidence/runtime-activation-negative-test-plan-v1.json"
DOC="docs/security/RUNTIME_ACTIVATION_NEGATIVE_TEST_PLAN_V1.md"
test -f "$DRYRUN"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"runtime-activation-dry-run-plan-v1\"" "$DRYRUN" >/dev/null
jq -e ".result == \"PASS\"" "$DRYRUN" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_DRY_RUN_PLAN_SEALED\"" "$DRYRUN" >/dev/null
jq -e ".status == \"DRY_RUN_PLAN_ONLY\"" "$DRYRUN" >/dev/null
jq -e ".runtime_activation_enabled == false" "$DRYRUN" >/dev/null
jq -e ".runtime_execution_authorized == false" "$DRYRUN" >/dev/null
jq -e ".future_runtime_gate_required == true" "$DRYRUN" >/dev/null
jq -e ".id == \"runtime-activation-negative-test-plan-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"NEGATIVE_TEST_PLAN_ONLY\"" "$OUT" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_NEGATIVE_TEST_PLAN_SEALED\"" "$OUT" >/dev/null
jq -e ".runtime_activation_dry_run_plan.verified == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_without_explicit_human_operator_approval == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_without_dedicated_activation_branch == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_without_dedicated_activation_pr == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_without_clean_main_preflight == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_without_dry_run_receipt == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_without_negative_test_receipt == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_parser_runtime_execution == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_orchestrator_runtime_execution == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_runtime_connection_creation == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_private_key_loading == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_signing_attempt == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_broadcast_attempt == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_storage_write_attempt == true" "$OUT" >/dev/null
jq -e ".required_negative_tests.reject_chain_mutation_attempt == true" "$OUT" >/dev/null
jq -e ".runtime_activation_enabled == false" "$OUT" >/dev/null
jq -e ".runtime_execution_authorized == false" "$OUT" >/dev/null
jq -e ".parser_runtime_execution == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_execution == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$OUT" >/dev/null
jq -e ".real_execution_enabled == false" "$OUT" >/dev/null
jq -e ".operational_mode_enabled == false" "$OUT" >/dev/null
jq -e ".private_key_loaded == false" "$OUT" >/dev/null
jq -e ".private_key_used == false" "$OUT" >/dev/null
jq -e ".transaction_signed == false" "$OUT" >/dev/null
jq -e ".transaction_broadcast == false" "$OUT" >/dev/null
jq -e ".storage_write_attempted == false" "$OUT" >/dev/null
jq -e ".chain_state_mutated == false" "$OUT" >/dev/null
jq -e ".future_runtime_gate_required == true" "$OUT" >/dev/null
jq -e ".final_plan_status == \"RUNTIME_ACTIVATION_NEGATIVE_TEST_PLAN_SEALED\"" "$OUT" >/dev/null
grep -q "RUNTIME_ACTIVATION_NEGATIVE_TEST_PLAN_SEALED" "$DOC"
grep -q "NEGATIVE_TEST_PLAN_ONLY" "$DOC"
grep -q "It does not activate runtime execution" "$DOC"
npm run verify:evidence
echo "RUNTIME_ACTIVATION_NEGATIVE_TEST_PLAN_V1_CHECK=PASS"
