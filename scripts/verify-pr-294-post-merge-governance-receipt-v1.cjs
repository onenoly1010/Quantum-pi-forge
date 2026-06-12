const fs = require("fs");
const path = "receipts/governance/pr-294-post-merge-governance-receipt-v1.json";
function fail(message) { console.error("FAIL pr-294-post-merge-governance-receipt-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing receipt");
const receipt = JSON.parse(fs.readFileSync(path,"utf8"));
if (receipt.receipt !== "pr-294-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.pr !== 294) fail("wrong PR number");
if (receipt.merged_commit !== "0f9cff0") fail("wrong merged commit");
if (receipt.merged_commit_full !== "0f9cff01cd8ee915e61d5112332dd5977c6531a9") fail("wrong full merged commit");
for (const key of ["final_operator_unpark_approval_created","final_operator_unpark_approval_granted","mainnet_cutover_approval_granted"]) { if (receipt[key] !== true) fail(`${key} must be true`); }
for (const key of ["mainnet_cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_executed","wallet_signing_executed","liquidity_action_executed","staking_action_executed","relayer_action_executed","execution_lane_created","execution_authorized_by_this_receipt"]) { if (receipt[key] !== false) fail(`${key} must remain false`); }
console.log("PASS pr-294-post-merge-governance-receipt-v1");
