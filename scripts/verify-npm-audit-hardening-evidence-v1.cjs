const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/npm-audit-hardening-evidence-v1.json";
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

function sha256(path) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

function fail(msg) {
  console.error("FAIL npm-audit-hardening-evidence-v1: " + msg);
  process.exit(1);
}

if (receipt.schema !== "qpf.governance.npm_audit_hardening_evidence.v1") {
  fail("bad schema");
}

if (receipt.posture !== "EVIDENCE_ONLY_NO_DEPLOY_NO_UNPARK_NO_BROADCAST_NO_KEYS_NO_EXECUTION") {
  fail("bad posture");
}

if (receipt.committed_dependency_mutation !== false) {
  fail("dependency mutation must be false");
}

if (receipt.execution_receipt_present !== false) {
  fail("execution receipt must be false");
}

if (!fs.existsSync(receipt.document_path)) {
  fail("missing document");
}

const actualDocSha = sha256(receipt.document_path);
if (actualDocSha !== receipt.document_sha256) {
  fail("document sha mismatch");
}

if (!Array.isArray(receipt.affected_packages) || receipt.affected_packages.length !== 3) {
  fail("expected 3 affected packages");
}

if (!receipt.audit_summary || receipt.audit_summary.high !== 3 || receipt.audit_summary.total !== 3) {
  fail("unexpected audit summary");
}

console.log("PASS npm-audit-hardening-evidence-v1");
console.log("document_sha256=" + receipt.document_sha256);
console.log("canonical_head=" + receipt.canonical_head_short);
