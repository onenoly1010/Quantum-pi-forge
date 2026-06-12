const fs = require("fs");
const path = "receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json";
function fail(message) { console.error("FAIL v2-final-operator-unpark-approval-receipt-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing receipt");
const receipt = JSON.parse(fs.readFileSync(path,"utf8"));
if (receipt.receipt !== "v2-final-operator-unpark-approval-receipt-v1") fail("wrong receipt id");
if (receipt.status !== "operator_approval_granted") fail("wrong status");
if (receipt.canonical_base_commit !== "4f05c24") fail("wrong canonical base short commit");
if (receipt.canonical_base_commit_full !== "4f05c248b85a19b91713de0cb9ba6cb20c4b1d27") fail("wrong canonical base full commit");
if (receipt.pre_cutover_review_window_active !== true) fail("pre-cutover review window must remain active");
if (receipt.pr_258_post_merge_receipt_sealed !== true) fail("PR 258 post-merge receipt must be sealed");
if (receipt.pr_292_post_merge_receipt_sealed !== true) fail("PR 292 post-merge receipt must be sealed");
if (receipt.final_operator_unpark_approval_created !== true) fail("final approval receipt must be created");
if (receipt.final_operator_unpark_approval_granted !== true) fail("final approval must be granted");
if (receipt.mainnet_cutover_approval_granted !== true) fail("mainnet cutover approval must be granted by this receipt");
for (const key of ["mainnet_cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_executed","wallet_signing_executed","liquidity_action_executed","staking_action_executed","relayer_action_executed"]) { if (receipt[key] !== false) fail(`${key} must remain false`); }
if (receipt.rollback_required_if_any_execution_occurs_without_separate_execution_receipt !== true) fail("rollback guard must be true");
console.log("PASS v2-final-operator-unpark-approval-receipt-v1");
