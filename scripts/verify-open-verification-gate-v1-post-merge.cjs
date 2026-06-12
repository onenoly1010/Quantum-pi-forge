const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/open-verification-gate-v1-post-merge.json";
const docPath = "docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md";

function fail(message) {
  console.error(`FAIL open-verification-gate-v1-post-merge: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

if (!fs.existsSync(receiptPath)) fail(`missing required file: ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing required file: ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.governance_version !== "v1") fail("governance_version must be v1");
if (receipt.seal !== "open-verification-gate-v1-post-merge") fail("seal mismatch");

const posture = receipt.posture || {};
const requiredFalse = [
  "outside_reviewer_required",
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

for (const flag of requiredFalse) {
  if (posture[flag] !== false) fail(`${flag} must be false`);
}

if (posture.outside_review_welcome !== true) fail("outside_review_welcome must be true");
if (posture.open_verification_required !== true) fail("open_verification_required must be true");

const auth = receipt.authorization || {};
for (const [key, value] of Object.entries(auth)) {
  if (value !== false) fail(`${key} must be false`);
}

const artifacts = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(artifacts)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sha256 mismatch for ${path}`);
}

console.log("PASS open-verification-gate-v1-post-merge");
