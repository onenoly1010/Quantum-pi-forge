#!/usr/bin/env bash
set -euo pipefail
POLICY="receipts/security/evidence/runtime-activation-gate-policy-v1.json"
OUT="receipts/security/evidence/runtime-activation-dry-run-plan-v1.json"
DOC="docs/security/RUNTIME_ACTIVATION_DRY_RUN_PLAN_V1.md"
test -f "$POLICY"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"runtime-activation-gate-policy-v1\"" "$POLICY" >/dev/null
jq -e ".result == \"PASS\"" "$POLICY" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_GATE_POLICY_SEALED\"" "$POLICY" >/dev/null
jq -e ".status == \"SEALED_POLICY_ONLY\"" "$POLICY" >/dev/null
jq -e ".runtime_activation_enabled == false" "$POLICY" >/dev/null
jq -e ".runtime_execution_authorized == false" "$POLICY" >/dev/null
jq -e ".future_runtime_gate_required == true" "$POLICY" >/dev/null
jq -e ".id == \"runtime-activation-dry-run-plan-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"DRY_RUN_PLAN_ONLY\"" "$OUT" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_DRY_RUN_PLAN_SEALED\"" "$OUT" >/dev/null
jq -e ".runtime_activation_gate_policy.verified == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_clean_main == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_gate_policy_receipt == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_human_operator_approval_required == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_side_effect_free_mode == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_parser_runtime_disabled == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_orchestrator_runtime_disabled == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_runtime_connection_disabled == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_no_private_key_loaded == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_no_signing == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_no_broadcast == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_no_storage_write == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.validate_no_chain_mutation == true" "$OUT" >/dev/null
jq -e ".dry_run_shape.emit_dry_run_receipt_only == true" "$OUT" >/dev/null
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
jq -e ".final_plan_status == \"RUNTIME_ACTIVATION_DRY_RUN_PLAN_SEALED\"" "$OUT" >/dev/null
grep -q "RUNTIME_ACTIVATION_DRY_RUN_PLAN_SEALED" "$DOC"
grep -q "DRY_RUN_PLAN_ONLY" "$DOC"
grep -q "It does not activate runtime execution" "$DOC"
npm run verify:evidence
echo "RUNTIME_ACTIVATION_DRY_RUN_PLAN_V1_CHECK=PASS"
