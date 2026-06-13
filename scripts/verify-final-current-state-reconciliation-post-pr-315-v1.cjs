#!/usr/bin/env node
const fs = require("fs");
const p = "receipts/governance/final-current-state-reconciliation-post-pr-315-v1.json";
function fail(msg) { console.error("FAIL final-current-state-reconciliation-post-pr-315-v1: " + msg); process.exit(1); }
if (!fs.existsSync(p)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(p, "utf8"));
if (r.schema !== "qpf.governance.final_current_state_reconciliation_post_pr_315.v1") fail("bad schema");
if (r.approval_state.final_operator_unpark_approval_granted !== true) fail("approval not granted");
if (r.command_hash_state.command_hash_sealed !== true) fail("command hash not sealed");
if (r.execution_state.execution_receipt_present !== false) fail("execution receipt unexpectedly present");
for (const k of ["execution_command_executed", "mainnet_cutover_executed", "unpark_executed", "deployment_executed", "broadcast_executed", "state_changing_transaction_executed", "wallet_signing_executed", "liquidity_action_executed", "staking_action_executed", "relayer_action_executed", "key_access_performed", "zero_g_action_performed"]) {
  if (r.execution_state[k] !== false) fail("execution flag must be false: " + k);
}
if (r.determinism.file_count !== 2282) fail("bad file count");
if (r.evidence.lanes !== 3 || r.evidence.paths !== 6 || r.evidence.claims !== 3) fail("bad evidence counts");
console.log("PASS final-current-state-reconciliation-post-pr-315-v1");
