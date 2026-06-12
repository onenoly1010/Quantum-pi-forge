const fs = require("fs");
const path = "receipts/governance/pr-296-post-merge-governance-receipt-v1.json";
function fail(message) { console.error("FAIL pr-296-post-merge-governance-receipt-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing receipt");
const receipt = JSON.parse(fs.readFileSync(path,"utf8"));
if (receipt.receipt !== "pr-296-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.pr !== 296) fail("wrong PR number");
if (receipt.merged_commit !== "af391d8") fail("wrong merged commit");
if (receipt.merged_commit_full !== "af391d8e3f9a84ae3d1e30ac0a3b2adc31507c54") fail("wrong full merged commit");
for (const key of ["final_operator_unpark_approval_created","final_operator_unpark_approval_granted","mainnet_cutover_approval_granted","execution_command_hash_bound"]) { if (receipt[key] !== true) fail(`${key} must be true`); }
for (const key of ["execution_command_executed","mainnet_cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_executed","wallet_signing_executed","liquidity_action_executed","staking_action_executed","relayer_action_executed","execution_lane_created","execution_authorized_by_this_receipt"]) { if (receipt[key] !== false) fail(`${key} must remain false`); }
if (!receipt.cutover_command_sha256 || typeof receipt.cutover_command_sha256 !== "string") fail("missing command hash");
console.log("PASS pr-296-post-merge-governance-receipt-v1");
