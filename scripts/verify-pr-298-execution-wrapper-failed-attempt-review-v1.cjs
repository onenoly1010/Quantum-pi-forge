const fs = require("fs");
const crypto = require("crypto");
function fail(msg) { console.error("FAIL pr-298-execution-wrapper-failed-attempt-review-v1: " + msg); process.exit(1); }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
const receiptPath = "receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json";
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
if (receipt.schema !== "qpf.governance.pr-298-execution-wrapper-failed-attempt-review.v1") fail("bad schema");
if (receipt.posture !== "failed_attempt_review_only") fail("bad posture");
if (receipt.pr_under_review !== 298) fail("bad pr_under_review");
if (receipt.post_merge_receipt_pr !== 299) fail("bad post_merge_receipt_pr");
if (receipt.wrapper_status !== "failed_or_missing") fail("wrapper_status must be failed_or_missing");
if (receipt.exit_code !== 1) fail("exit_code must be 1");
if (receipt.successful_exit_artifact_present !== false) fail("successful artifact must be false");
if (receipt.stash_applied !== false) fail("stash_applied must be false");
if (receipt.wrapper_executed_during_review !== false) fail("wrapper_executed_during_review must be false");
if (receipt.deployment_executed !== false) fail("deployment_executed must be false");
if (receipt.broadcast_executed !== false) fail("broadcast_executed must be false");
if (receipt.state_changing_transaction_executed !== false) fail("state_changing_transaction_executed must be false");
const doc = fs.readFileSync(receipt.evidence.review_document, "utf8");
if (sha256(doc) !== receipt.evidence.review_document_sha256) fail("review document hash mismatch");
if (!doc.includes("wrapper_status: failed_or_missing")) fail("missing failed_or_missing conclusion");
if (!doc.includes("exit_code: 1")) fail("missing exit_code conclusion");
console.log("PASS pr-298-execution-wrapper-failed-attempt-review-v1");
