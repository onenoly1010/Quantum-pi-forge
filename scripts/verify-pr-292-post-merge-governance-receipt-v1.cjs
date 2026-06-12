const fs = require("fs");
const path = "receipts/governance/pr-292-post-merge-governance-receipt-v1.json";
function fail(message) { console.error("FAIL pr-292-post-merge-governance-receipt-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing receipt");
const receipt = JSON.parse(fs.readFileSync(path,"utf8"));
if (receipt.receipt !== "pr-292-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.pr !== 292) fail("wrong PR number");
if (receipt.merged_commit !== "4fd0df0") fail("wrong merged commit");
if (receipt.merged_commit_full !== "4fd0df040225daeece4e5109b613e64e255ba174") fail("wrong full merged commit");
if (receipt.pre_cutover_review_window_active !== true) fail("pre-cutover review window must remain active");
if (receipt.final_operator_unpark_approval_created !== false) fail("final approval lane must not be created by this receipt");
if (receipt.final_operator_unpark_approval_granted !== false) fail("final approval must remain false");
for (const key of ["mainnet_cutover_approval_granted","mainnet_cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_executed"]) { if (receipt[key] !== false) fail(`${key} must remain false`); }
console.log("PASS pr-292-post-merge-governance-receipt-v1");
