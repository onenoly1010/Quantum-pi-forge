#!/usr/bin/env bash
set -euo pipefail
POLICY="receipts/security/evidence/runtime-activation-gate-policy-v1.json"
DRYRUN="receipts/security/evidence/runtime-activation-dry-run-plan-v1.json"
NEGATIVE="receipts/security/evidence/runtime-activation-negative-test-plan-v1.json"
OUT="receipts/security/evidence/runtime-activation-final-status-v1.json"
DOC="docs/security/RUNTIME_ACTIVATION_FINAL_STATUS_V1.md"
test -f "$POLICY"
test -f "$DRYRUN"
test -f "$NEGATIVE"
test -f "$OUT"
test -f "$DOC"
jq -e ".posture == \"RUNTIME_ACTIVATION_GATE_POLICY_SEALED\"" "$POLICY" >/dev/null
jq -e ".status == \"SEALED_POLICY_ONLY\"" "$POLICY" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_DRY_RUN_PLAN_SEALED\"" "$DRYRUN" >/dev/null
jq -e ".status == \"DRY_RUN_PLAN_ONLY\"" "$DRYRUN" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_NEGATIVE_TEST_PLAN_SEALED\"" "$NEGATIVE" >/dev/null
jq -e ".status == \"NEGATIVE_TEST_PLAN_ONLY\"" "$NEGATIVE" >/dev/null
jq -e ".id == \"runtime-activation-final-status-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"RUNTIME_ACTIVATION_BLOCKED_UNTIL_EXPLICIT_FUTURE_GATE\"" "$OUT" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_FINAL_STATUS_SEALED\"" "$OUT" >/dev/null
jq -e ".runtime_activation_enabled == false" "$OUT" >/dev/null
jq -e ".runtime_execution_authorized == false" "$OUT" >/dev/null
jq -e ".parser_runtime_execution == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_execution == false" "$OUT" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$OUT" >/dev/null
jq -e ".private_key_loaded == false" "$OUT" >/dev/null
jq -e ".private_key_used == false" "$OUT" >/dev/null
jq -e ".transaction_signed == false" "$OUT" >/dev/null
jq -e ".transaction_broadcast == false" "$OUT" >/dev/null
jq -e ".storage_write_attempted == false" "$OUT" >/dev/null
jq -e ".chain_state_mutated == false" "$OUT" >/dev/null
jq -e ".future_explicit_activation_gate_required == true" "$OUT" >/dev/null
grep -q "RUNTIME_ACTIVATION_FINAL_STATUS_SEALED" "$DOC"
grep -q "RUNTIME_ACTIVATION_BLOCKED_UNTIL_EXPLICIT_FUTURE_GATE" "$DOC"
grep -q "No runtime activation has occurred" "$DOC"
npm run verify:evidence
echo "RUNTIME_ACTIVATION_FINAL_STATUS_V1_CHECK=PASS"
