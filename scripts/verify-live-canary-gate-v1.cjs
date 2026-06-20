const fs = require("fs");
function fail(msg){ console.error("FAIL live-canary-gate-v1: " + msg); process.exit(1); }
const docPath = "docs/governance/LIVE_CANARY_GATE_V1.md";
const receiptPath = "receipts/runtime/live-canary-gate-v1.json";
if (!fs.existsSync(docPath)) fail("missing governance doc");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
function eq(k,v){ if (receipt[k] !== v) fail(k + " expected " + v + " got " + receipt[k]); }
eq("gate","LIVE_CANARY_GATE_V1");
eq("status","SEALED");
eq("live_scope","read_only_chain_canary");
eq("chain_id_expected",16661);
eq("wallet_required",false);
eq("private_key_required",false);
eq("funding_required",false);
eq("transaction_broadcast_allowed",false);
eq("storage_upload_allowed",false);
eq("compute_inference_allowed",false);
eq("liquidity_action_allowed",false);
eq("staking_action_allowed",false);
eq("approval_action_allowed",false);
eq("deployment_allowed",false);
eq("operator_approval_required_for_next_gate",true);
eq("live_execution",false);
for (const phrase of ["read-only 0G Aristotle chain canary","does not authorize live execution","private-key access","transaction broadcast","storage upload","compute inference execution"]) {
  if (!doc.includes(phrase)) fail("doc missing phrase: " + phrase);
}
console.log("PASS live-canary-gate-v1");
