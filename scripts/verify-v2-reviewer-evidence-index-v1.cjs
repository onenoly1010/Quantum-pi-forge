const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/v2-reviewer-evidence-index-v1.json";
const docPath = "docs/public/REVIEWER_EVIDENCE_INDEX_V1.md";
const jsonPath = "docs/public/reviewer-evidence-index-v1.json";

function fail(message) {
  console.error(`FAIL v2-reviewer-evidence-index-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

for (const path of [receiptPath, docPath, jsonPath]) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const idx = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

if (receipt.governance_version !== "v2") fail("governance_version must be v2");
if (receipt.receipt !== "v2-reviewer-evidence-index-v1") fail("receipt name mismatch");

const scope = receipt.scope || {};
if (scope.visibility_layer !== true) fail("visibility_layer must be true");
if (scope.reviewer_evidence_index !== true) fail("reviewer_evidence_index must be true");
if (scope.public_review_support !== true) fail("public_review_support must be true");
if (scope.mainnet_mutation_authorized !== false) fail("mainnet_mutation_authorized must be false");
if (scope.execution_authorized !== false) fail("execution_authorized must be false");

const claims = idx.claims || [];
const requiredClaims = [
  "v1 lifecycle is closed",
  "Open Verification replaced outside reviewer bottleneck",
  "Current governance state is sealed",
  "Execution window was single-use",
  "Execution result was recorded",
  "v2 visibility layer is read-only",
  "No live mutation is authorized by v2 artifacts"
];
for (const rc of requiredClaims) {
  if (!claims.find(c => c.claim === rc)) fail(`missing required claim: ${rc}`);
}

for (const group of [receipt.index_artifacts || {}, receipt.sealed_artifacts || {}]) {
  for (const [path, expected] of Object.entries(group)) {
    const actual = sha256(path);
    if (actual !== expected) fail(`sha256 mismatch for ${path}`);
  }
}

if (receipt.next_valid_boundary !== "v2-funder-review-packet-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS v2-reviewer-evidence-index-v1");
