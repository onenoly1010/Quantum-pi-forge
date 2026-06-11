const fs = require("fs");
const path = "receipts/governance/pr-258-post-merge-governance-receipt-v1.json";
function fail(message) { console.error("FAIL pr-258-post-merge-governance-receipt-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing receipt");
const receipt = JSON.parse(fs.readFileSync(path,"utf8"));
if (receipt.receipt !== "pr-258-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.pr !== 258) fail("wrong PR number");
if (receipt.merged_commit !== "f03eeaf") fail("wrong merged commit");
if (receipt.pre_cutover_review_window_active !== true) fail("review window must be active");
if (receipt.anchored_receipt_sha256 !== "6d4c24f9c3e61cc9142c49a945c5e39ccb5b40f0833ba2d6c2b35a2f37145347") fail("wrong anchored receipt sha256");
for (const key of ["mainnet_cutover_approval_granted","mainnet_cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_executed"]) { if (receipt[key] !== false) fail(`${key} must remain false`); }
console.log("PASS pr-258-post-merge-governance-receipt-v1");
