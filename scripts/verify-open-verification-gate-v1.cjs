const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/open-verification-gate-v1.json";
const docPath = "docs/governance/OPEN_VERIFICATION_GATE_V1.md";

function fail(message) {
  console.error(`FAIL open-verification-gate-v1: ${message}`);
  process.exit(1);
}

function requireFile(path) {
  if (!fs.existsSync(path)) {
    fail(`missing required file: ${path}`);
  }
}

requireFile(receiptPath);
requireFile(docPath);

const gate = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const docBytes = fs.readFileSync(docPath);
const actualDocHash = crypto.createHash("sha256").update(docBytes).digest("hex");

if (gate.governance_version !== "v1") {
  fail("governance_version must be v1");
}

if (gate.gate !== "open-verification-gate-v1") {
  fail("gate must equal open-verification-gate-v1");
}

if (gate.outside_reviewer_required !== false) {
  fail("outside_reviewer_required must be false");
}

if (gate.outside_review_welcome !== true) {
  fail("outside_review_welcome must be true");
}

if (gate.open_verification_required !== true) {
  fail("open_verification_required must be true");
}

if (!gate.status || typeof gate.status !== "object") {
  fail("status object is required");
}

const requiredFalseFlags = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

for (const flag of requiredFalseFlags) {
  if (gate.status[flag] !== false) {
    fail(`${flag} must be false`);
  }
}

if (!gate.verification_metadata || typeof gate.verification_metadata !== "object") {
  fail("verification_metadata object is required");
}

if (gate.verification_metadata.open_verification_document !== docPath) {
  fail("verification_metadata.open_verification_document mismatch");
}

if (gate.verification_metadata.open_verification_document_sha256 !== actualDocHash) {
  fail("open verification document sha256 mismatch");
}

if (gate.verification_metadata.mainnet_authorization !== "not_granted") {
  fail("mainnet_authorization must be not_granted");
}

console.log("PASS open-verification-gate-v1");
