#!/usr/bin/env bash
set -euo pipefail
BOUNDARY="receipts/security/evidence/operator-command-boundary-status-v1.json"
OUT="receipts/security/evidence/runtime-activation-gate-policy-v1.json"
DOC="docs/security/RUNTIME_ACTIVATION_GATE_POLICY_V1.md"
test -f "$BOUNDARY"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"operator-command-boundary-status-v1\"" "$BOUNDARY" >/dev/null
jq -e ".result == \"PASS\"" "$BOUNDARY" >/dev/null
jq -e ".posture == \"OPERATOR_COMMAND_BOUNDARY_STATUS_SEALED\"" "$BOUNDARY" >/dev/null
jq -e ".status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$BOUNDARY" >/dev/null
jq -e ".runtime_execution_gated == true" "$BOUNDARY" >/dev/null
jq -e ".operator_runtime_execution_authorized == false" "$BOUNDARY" >/dev/null
jq -e ".id == \"runtime-activation-gate-policy-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"SEALED_POLICY_ONLY\"" "$OUT" >/dev/null
jq -e ".posture == \"RUNTIME_ACTIVATION_GATE_POLICY_SEALED\"" "$OUT" >/dev/null
jq -e ".operator_command_boundary.verified == true" "$OUT" >/dev/null
jq -e ".required_future_gates.explicit_human_operator_approval == true" "$OUT" >/dev/null
jq -e ".required_future_gates.dedicated_runtime_activation_branch == true" "$OUT" >/dev/null
jq -e ".required_future_gates.dedicated_runtime_activation_pr == true" "$OUT" >/dev/null
jq -e ".required_future_gates.fresh_clean_main_preflight == true" "$OUT" >/dev/null
jq -e ".required_future_gates.fresh_runtime_dry_run == true" "$OUT" >/dev/null
jq -e ".required_future_gates.fresh_runtime_negative_test == true" "$OUT" >/dev/null
jq -e ".required_future_gates.explicit_key_use_policy == true" "$OUT" >/dev/null
jq -e ".required_future_gates.explicit_signing_policy == true" "$OUT" >/dev/null
jq -e ".required_future_gates.explicit_broadcast_policy == true" "$OUT" >/dev/null
jq -e ".required_future_gates.explicit_rollback_or_abort_policy == true" "$OUT" >/dev/null
jq -e ".required_future_gates.explicit_runtime_receipt_path == true" "$OUT" >/dev/null
jq -e ".required_future_gates.explicit_runtime_activation_verifier == true" "$OUT" >/dev/null
jq -e ".runtime_activation_enabled == false" "$OUT" >/dev/null
jq -e ".runtime_execution_authorized == false" "$OUT" >/dev/null
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
jq -e ".future_runtime_gate_required == true" "$OUT" >/dev/null
jq -e ".final_policy_status == \"RUNTIME_ACTIVATION_GATE_POLICY_SEALED\"" "$OUT" >/dev/null
grep -q "RUNTIME_ACTIVATION_GATE_POLICY_SEALED" "$DOC"
grep -q "SEALED_POLICY_ONLY" "$DOC"
grep -q "This policy does not activate runtime execution" "$DOC"
npm run verify:evidence
echo "RUNTIME_ACTIVATION_GATE_POLICY_V1_CHECK=PASS"
