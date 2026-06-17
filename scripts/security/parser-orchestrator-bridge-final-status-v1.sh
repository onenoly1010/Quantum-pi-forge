#!/usr/bin/env bash
set -euo pipefail
DRYRUN="receipts/security/evidence/parser-orchestrator-bridge-dry-run-v1.json"
NEGATIVE="receipts/security/evidence/parser-orchestrator-bridge-negative-test-v1.json"
OUT="receipts/security/evidence/parser-orchestrator-bridge-final-status-v1.json"
DOC="docs/security/PARSER_ORCHESTRATOR_BRIDGE_FINAL_STATUS_V1.md"
test -f "$DRYRUN"
test -f "$NEGATIVE"
test -f "$OUT"
test -f "$DOC"
jq -e ".id == \"parser-orchestrator-bridge-dry-run-v1\"" "$DRYRUN" >/dev/null
jq -e ".result == \"PASS\"" "$DRYRUN" >/dev/null
jq -e ".posture == \"PARSER_ORCHESTRATOR_BRIDGE_DRY_RUN_INERT_ONLY\"" "$DRYRUN" >/dev/null
jq -e ".bridge_output.runtime_connection_created == false" "$DRYRUN" >/dev/null
jq -e ".real_execution_enabled == false" "$DRYRUN" >/dev/null
jq -e ".id == \"parser-orchestrator-bridge-negative-test-v1\"" "$NEGATIVE" >/dev/null
jq -e ".result == \"PASS\"" "$NEGATIVE" >/dev/null
jq -e ".posture == \"PARSER_ORCHESTRATOR_BRIDGE_NEGATIVE_TEST_FAIL_CLOSED\"" "$NEGATIVE" >/dev/null
jq -e ".all_negative_cases_rejected == true" "$NEGATIVE" >/dev/null
jq -e ".real_execution_enabled == false" "$NEGATIVE" >/dev/null
jq -e ".id == \"parser-orchestrator-bridge-final-status-v1\"" "$OUT" >/dev/null
jq -e ".result == \"PASS\"" "$OUT" >/dev/null
jq -e ".status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$OUT" >/dev/null
jq -e ".posture == \"PARSER_ORCHESTRATOR_BRIDGE_FINAL_STATUS_SEALED\"" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.bridge_dry_run.verified == true" "$OUT" >/dev/null
jq -e ".canonical_checkpoints.bridge_negative_test.verified == true" "$OUT" >/dev/null
jq -e ".bridge_lane_sealed == true" "$OUT" >/dev/null
jq -e ".final_lane_status == \"SEALED_VERIFIED_NON_EXECUTION\"" "$OUT" >/dev/null
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
jq -e ".final_status == \"PARSER_ORCHESTRATOR_BRIDGE_FINAL_STATUS_SEALED\"" "$OUT" >/dev/null
grep -q "PARSER_ORCHESTRATOR_BRIDGE_FINAL_STATUS_SEALED" "$DOC"
grep -q "SEALED_VERIFIED_NON_EXECUTION" "$DOC"
grep -q "No orchestrator runtime connection is created" "$DOC"
npm run verify:evidence
echo "PARSER_ORCHESTRATOR_BRIDGE_FINAL_STATUS_V1_CHECK=PASS"
