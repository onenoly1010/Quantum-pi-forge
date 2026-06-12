const fs = require("fs");
const crypto = require("crypto");
function fail(msg) { console.error("FAIL execution-wrapper-readiness-corrective-v1: " + msg); process.exit(1); }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
const receipt = JSON.parse(fs.readFileSync("receipts/governance/execution-wrapper-readiness-corrective-v1.json", "utf8"));
if (receipt.schema !== "qpf.governance.execution-wrapper-readiness-corrective.v1") fail("bad schema");
if (receipt.posture !== "corrective_readiness_only") fail("bad posture");
if (receipt.prior_failed_attempt_pr !== 298) fail("bad prior_failed_attempt_pr");
if (receipt.prior_failed_attempt_review_pr !== 300) fail("bad prior_failed_attempt_review_pr");
if (receipt.prior_post_merge_receipt_pr !== 301) fail("bad prior_post_merge_receipt_pr");
if (receipt.prior_wrapper_status !== "failed_or_missing") fail("bad prior_wrapper_status");
if (receipt.prior_exit_code !== 1) fail("bad prior_exit_code");
if (receipt.successful_exit_artifact_present !== false) fail("successful_exit_artifact_present must be false");
if (receipt.stash_applied !== false) fail("stash_applied must be false");
if (receipt.wrapper_executed !== false) fail("wrapper_executed must be false");
if (receipt.deployment_executed !== false) fail("deployment_executed must be false");
if (receipt.broadcast_executed !== false) fail("broadcast_executed must be false");
if (receipt.state_changing_transaction_executed !== false) fail("state_changing_transaction_executed must be false");
const doc = fs.readFileSync(receipt.evidence.document, "utf8");
if (sha256(doc) !== receipt.evidence.document_sha256) fail("document hash mismatch");
const helper = fs.readFileSync(receipt.corrective_helper, "utf8");
if (sha256(helper) !== receipt.evidence.helper_sha256) fail("helper hash mismatch");
if (!doc.includes("This is not an execution lane.")) fail("missing non-execution boundary");
if (!doc.includes("wrapper_executed: false")) fail("missing wrapper false boundary");
if (!helper.includes("wrapper_executed: false")) fail("helper missing wrapper false posture");
console.log("PASS execution-wrapper-readiness-corrective-v1");
