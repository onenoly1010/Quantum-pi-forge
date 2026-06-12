const fs = require("fs");
const crypto = require("crypto");
const path = "receipts/governance/pr-298-post-merge-governance-receipt-v1.json";
function fail(message) { console.error("FAIL pr-298-post-merge-governance-receipt-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing receipt");
const receipt = JSON.parse(fs.readFileSync(path,"utf8"));
if (receipt.receipt !== "pr-298-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.pr !== 298) fail("wrong PR number");
if (receipt.merged_commit !== "061de3c") fail("wrong merged commit");
if (receipt.merged_commit_full !== "061de3cf004a66abdaf0afb83ff484cf7e35e379") fail("wrong full merged commit");
if (receipt.execution_evidence_merged !== true) fail("execution evidence must be merged");
if (receipt.post_merge_receipt_for_execution_only !== true) fail("must be post-merge receipt only");
if (receipt.additional_execution_performed_by_this_receipt !== false) fail("must not perform additional execution");
if (!fs.existsSync(receipt.execution_wrapper_receipt_path)) fail("missing execution wrapper receipt path");
const actualWrapperSha = crypto.createHash("sha256").update(fs.readFileSync(receipt.execution_wrapper_receipt_path)).digest("hex");
if (receipt.execution_wrapper_receipt_sha256 !== actualWrapperSha) fail("execution wrapper sha mismatch");
for (const key of ["final_operator_unpark_approval_created","final_operator_unpark_approval_granted","mainnet_cutover_approval_granted"]) { if (receipt[key] !== true) fail(`${key} must be true`); }
if (receipt.execution_command_executed !== true) fail("execution command must have been recorded by PR 298 evidence");
if (typeof receipt.execution_command_exit_code !== "number") fail("missing numeric execution exit code");
console.log("PASS pr-298-post-merge-governance-receipt-v1");
