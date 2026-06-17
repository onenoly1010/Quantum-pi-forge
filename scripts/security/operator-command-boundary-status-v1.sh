#!/usr/bin/env bash
set -euo pipefail
PARSER="receipts/security/evidence/command-parser-final-status-v1.json"
BRIDGE="receipts/security/evidence/parser-orchestrator-bridge-final-status-v1.json"
OUT="receipts/security/evidence/operator-command-boundary-status-v1.json"
DOC="docs/security/OPERATOR_COMMAND_BOUNDARY_STATUS_V1.md"
ORCH="$(find receipts/security/evidence -maxdepth 1 -type f -iname "*orchestrator*final*status*.json" | sort | head -1)"
test -n "$ORCH"
test -f "$PARSER"
test -f "$ORCH"
test -f "$BRIDGE"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"command-parser-final-status-v1\"" "$PARSER" >/dev/null
jq -e ".result == \"PASS\"" "$PARSER" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_FINAL_STATUS_SEALED\"" "$PARSER" >/dev/null
jq -e ".final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$PARSER" >/dev/null
jq -e ".result == \"PASS\"" "$ORCH" >/dev/null
jq -e "(.final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\") or (.status == \"SEALED_VERIFIED_NON_EXECUTION\")" "$ORCH" >/dev/null
jq -e ".id == \"parser-orchestrator-bridge-final-status-v1\"" "$BRIDGE" >/dev/null
jq -e ".result == \"PASS\"" "$BRIDGE" >/dev/null
jq -e ".posture == \"PARSER_ORCHESTRATOR_BRIDGE_FINAL_STATUS_SEALED\"" "$BRIDGE" >/dev/null
jq -e ".final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$BRIDGE" >/dev/null
jq -e ".id == \"operator-command-boundary-status-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$OUT" >/dev/null
jq -e ".posture == \"OPERATOR_COMMAND_BOUNDARY_STATUS_SEALED\"" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.command_parser_final_status.verified == true" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.command_orchestrator_final_status.verified == true" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.parser_orchestrator_bridge_final_status.verified == true" "$OUT" >/dev/null
jq -e ".command_parser_sealed == true" "$OUT" >/dev/null
jq -e ".command_orchestrator_sealed == true" "$OUT" >/dev/null
jq -e ".parser_orchestrator_bridge_sealed == true" "$OUT" >/dev/null
jq -e ".runtime_execution_gated == true" "$OUT" >/dev/null
jq -e ".operator_status_read_allowed == true" "$OUT" >/dev/null
jq -e ".operator_receipt_verification_allowed == true" "$OUT" >/dev/null
jq -e ".operator_runtime_execution_authorized == false" "$OUT" >/dev/null
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
jq -e ".final_boundary_status == \"OPERATOR_COMMAND_BOUNDARY_STATUS_SEALED\"" "$OUT" >/dev/null
grep -q "OPERATOR_COMMAND_BOUNDARY_STATUS_SEALED" "$DOC"
grep -q "SEALED_VERIFIED_NON_EXECUTION" "$DOC"
grep -q "No runtime command execution path is enabled" "$DOC"
npm run verify:evidence
echo "OPERATOR_COMMAND_BOUNDARY_STATUS_V1_CHECK=PASS"
