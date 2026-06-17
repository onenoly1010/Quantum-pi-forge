#!/usr/bin/env bash
set -euo pipefail
PARSER_FINAL="receipts/security/evidence/command-parser-final-status-v1.json"
PARSER_DRYRUN="receipts/security/evidence/command-parser-dry-run-v1.json"
BRIDGE="receipts/security/evidence/parser-orchestrator-bridge-dry-run-v1.json"
DOC="docs/security/PARSER_ORCHESTRATOR_BRIDGE_DRY_RUN_V1.md"
ORCH_FINAL="$(find receipts/security/evidence -maxdepth 1 -type f -iname "*orchestrator*final*status*.json" | sort | head -1)"
test -n "$ORCH_FINAL"
test -f "$PARSER_FINAL"
test -f "$PARSER_DRYRUN"
test -f "$ORCH_FINAL"
test -f "$BRIDGE"
test -f "$DOC"
jq -e ".id == \"command-parser-final-status-v1\"" "$PARSER_FINAL" >/dev/null
jq -e ".result == \"PASS\"" "$PARSER_FINAL" >/dev/null
jq -e ".posture == \"COMMAND_PARSER_FINAL_STATUS_SEALED\"" "$PARSER_FINAL" >/dev/null
jq -e ".final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$PARSER_FINAL" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$PARSER_FINAL" >/dev/null
jq -e ".id == \"command-parser-dry-run-v1\"" "$PARSER_DRYRUN" >/dev/null
jq -e ".result == \"PASS\"" "$PARSER_DRYRUN" >/dev/null
jq -e ".accepted_case.input == \"READ_STATUS\"" "$PARSER_DRYRUN" >/dev/null
jq -e ".accepted_case.intent_type == \"INERT_READ_ONLY_STATUS_QUERY\"" "$PARSER_DRYRUN" >/dev/null
jq -e ".accepted_case.execution_authorized == false" "$PARSER_DRYRUN" >/dev/null
jq -e ".accepted_case.side_effects_authorized == false" "$PARSER_DRYRUN" >/dev/null
jq -e ".result == \"PASS\"" "$ORCH_FINAL" >/dev/null
jq -e "(.final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\") or (.status == \"SEALED_VERIFIED_NON_EXECUTION\")" "$ORCH_FINAL" >/dev/null
jq -e ".id == \"parser-orchestrator-bridge-dry-run-v1\"" "$BRIDGE" >/dev/null
jq -e ".result == \"PASS\"" "$BRIDGE" >/dev/null
jq -e ".status == \"BRIDGE_DRY_RUN_INERT_ONLY\"" "$BRIDGE" >/dev/null
jq -e ".posture == \"PARSER_ORCHESTRATOR_BRIDGE_DRY_RUN_INERT_ONLY\"" "$BRIDGE" >/dev/null
jq -e ".parser_final_status.verified == true" "$BRIDGE" >/dev/null
jq -e ".orchestrator_final_status.verified == true" "$BRIDGE" >/dev/null
jq -e ".bridge_input.input == \"READ_STATUS\"" "$BRIDGE" >/dev/null
jq -e ".bridge_input.intent_type == \"INERT_READ_ONLY_STATUS_QUERY\"" "$BRIDGE" >/dev/null
jq -e ".bridge_input.execution_authorized == false" "$BRIDGE" >/dev/null
jq -e ".bridge_input.side_effects_authorized == false" "$BRIDGE" >/dev/null
jq -e ".bridge_output.accepted_by_bridge == true" "$BRIDGE" >/dev/null
jq -e ".bridge_output.accepted_as_inert_orchestrator_input == true" "$BRIDGE" >/dev/null
jq -e ".bridge_output.execution_authorized == false" "$BRIDGE" >/dev/null
jq -e ".bridge_output.side_effects_authorized == false" "$BRIDGE" >/dev/null
jq -e ".bridge_output.runtime_connection_created == false" "$BRIDGE" >/dev/null
jq -e ".parser_runtime_execution == false" "$BRIDGE" >/dev/null
jq -e ".orchestrator_runtime_execution == false" "$BRIDGE" >/dev/null
jq -e ".orchestrator_runtime_connected == false" "$BRIDGE" >/dev/null
jq -e ".real_execution_enabled == false" "$BRIDGE" >/dev/null
jq -e ".operational_mode_enabled == false" "$BRIDGE" >/dev/null
jq -e ".private_key_used == false" "$BRIDGE" >/dev/null
jq -e ".transaction_signed == false" "$BRIDGE" >/dev/null
jq -e ".transaction_broadcast == false" "$BRIDGE" >/dev/null
jq -e ".storage_write_attempted == false" "$BRIDGE" >/dev/null
jq -e ".chain_state_mutated == false" "$BRIDGE" >/dev/null
jq -e ".future_runtime_gate_required == true" "$BRIDGE" >/dev/null
jq -e ".final_bridge_status == \"PARSER_ORCHESTRATOR_BRIDGE_DRY_RUN_INERT_ONLY\"" "$BRIDGE" >/dev/null
grep -q "PARSER_ORCHESTRATOR_BRIDGE_DRY_RUN_INERT_ONLY" "$DOC"
grep -q "No orchestrator runtime connection is created" "$DOC"
npm run verify:evidence
echo "PARSER_ORCHESTRATOR_BRIDGE_DRY_RUN_V1_CHECK=PASS"
