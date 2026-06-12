const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/current-governance-state-v1.json";
const docPath = "docs/governance/CURRENT_GOVERNANCE_STATE_V1.md";

function fail(message) {
  console.error(`FAIL current-governance-state-v1: ${message}`);
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
if (receipt.receipt !== "current-governance-state-v1") fail("receipt name mismatch");

const model = receipt.current_governance_model || {};
if (model.outside_reviewer_required !== false) fail("outside_reviewer_required must be false");
if (model.outside_review_welcome !== true) fail("outside_review_welcome must be true");
if (model.open_verification_required !== true) fail("open_verification_required must be true");
if (model.operator_approval_required_for_mainnet !== true) fail("operator_approval_required_for_mainnet must be true");

const execution = receipt.current_execution_state || {};
const requiredExecutionFalse = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

for (const flag of requiredExecutionFalse) {
  if (execution[flag] !== false) fail(`${flag} must be false`);
}

const auth = receipt.authorization || {};
const requiredAuthFalse = [
  "deployment_authorized",
  "broadcast_authorized",
  "mainnet_cutover_authorized",
  "state_changing_transaction_authorized"
];

for (const flag of requiredAuthFalse) {
  if (auth[flag] !== false) fail(`${flag} must be false`);
}

const artifacts = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(artifacts)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sha256 mismatch for ${path}`);
}

const next = receipt.next_valid_boundaries || [];
const requiredNext = [
  "additional_verification_hardening",
  "public_proof_packaging",
  "explicit_operator_approval_preparation",
  "mainnet_cutover_approval_receipt"
];

for (const boundary of requiredNext) {
  if (!next.includes(boundary)) fail(`missing next valid boundary: ${boundary}`);
}

console.log("PASS current-governance-state-v1");
