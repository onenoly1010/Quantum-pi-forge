const fs = require("fs");
const crypto = require("crypto");
function fail(msg) { console.error("FAIL pr-300-post-merge-governance-receipt-v1: " + msg); process.exit(1); }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
const receiptPath = "receipts/governance/pr-300-post-merge-governance-receipt-v1.json";
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
if (receipt.schema !== "qpf.governance.pr-300-post-merge-receipt.v1") fail("bad schema");
if (receipt.posture !== "post_merge_receipt_only") fail("bad posture");
if (receipt.pr !== 300) fail("bad pr");
if (receipt.merged !== true) fail("merged must be true");
if (receipt.wrapper_status !== "failed_or_missing") fail("wrapper_status must remain failed_or_missing");
if (receipt.exit_code !== 1) fail("exit_code must remain 1");
if (receipt.successful_exit_artifact_present !== false) fail("successful artifact must remain false");
if (receipt.stash_applied !== false) fail("stash_applied must be false");
if (receipt.wrapper_executed_during_receipt !== false) fail("wrapper_executed_during_receipt must be false");
if (receipt.deployment_executed !== false) fail("deployment_executed must be false");
if (receipt.broadcast_executed !== false) fail("broadcast_executed must be false");
if (receipt.state_changing_transaction_executed !== false) fail("state_changing_transaction_executed must be false");
const reviewReceiptRaw = fs.readFileSync(receipt.sealed_review_receipt, "utf8");
if (sha256(reviewReceiptRaw) !== receipt.sealed_review_receipt_sha256) fail("sealed review receipt hash mismatch");
const reviewDocRaw = fs.readFileSync(receipt.sealed_review_document, "utf8");
if (sha256(reviewDocRaw) !== receipt.sealed_review_document_sha256) fail("sealed review document hash mismatch");
const postDocRaw = fs.readFileSync(receipt.evidence.post_merge_document, "utf8");
if (sha256(postDocRaw) !== receipt.evidence.post_merge_document_sha256) fail("post-merge document hash mismatch");
if (!postDocRaw.includes("wrapper_status: failed_or_missing")) fail("missing wrapper_status evidence");
if (!postDocRaw.includes("exit_code: 1")) fail("missing exit_code evidence");
console.log("PASS pr-300-post-merge-governance-receipt-v1");
