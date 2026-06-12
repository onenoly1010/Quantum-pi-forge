const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-activation-preflight-v1.json";
const docPath = "docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-activation-preflight-v1: ${message}`);
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
if (receipt.receipt !== "mainnet-activation-preflight-v1") fail("receipt name mismatch");

const model = receipt.governance_model || {};
if (model.outside_reviewer_required !== false) fail("outside_reviewer_required must be false");
if (model.outside_review_welcome !== true) fail("outside_review_welcome must be true");
if (model.open_verification_required !== true) fail("open_verification_required must be true");
if (model.operator_approval_required_for_mainnet !== true) fail("operator_approval_required_for_mainnet must be true");

const preflight = receipt.preflight || {};
const requiredPreflightTrue = [
  "activation_preflight_ready",
  "proof_packaging_allowed",
  "command_hash_preparation_allowed",
  "wallet_readiness_inspection_allowed",
  "network_readiness_inspection_allowed",
  "dry_run_simulation_allowed"
];

for (const flag of requiredPreflightTrue) {
  if (preflight[flag] !== true) fail(`${flag} must be true`);
}

const execution = receipt.execution_state || {};
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

if (receipt.next_valid_boundary !== "mainnet-activation-command-hash-readiness-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS mainnet-activation-preflight-v1");
