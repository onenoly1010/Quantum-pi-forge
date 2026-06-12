const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-activation-command-hash-readiness-v1.json";
const docPath = "docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md";
const candidatePath = "receipts/governance/mainnet-activation-command-candidate-v1.txt";

function fail(message) {
  console.error(`FAIL mainnet-activation-command-hash-readiness-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

if (!fs.existsSync(receiptPath)) fail(`missing required file: ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing required file: ${docPath}`);
if (!fs.existsSync(candidatePath)) fail(`missing required file: ${candidatePath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.governance_version !== "v1") fail("governance_version must be v1");
if (receipt.receipt !== "mainnet-activation-command-hash-readiness-v1") fail("receipt name mismatch");

const model = receipt.governance_model || {};
if (model.outside_reviewer_required !== false) fail("outside_reviewer_required must be false");
if (model.outside_review_welcome !== true) fail("outside_review_welcome must be true");
if (model.open_verification_required !== true) fail("open_verification_required must be true");
if (model.operator_approval_required_for_mainnet !== true) fail("operator_approval_required_for_mainnet must be true");

const readiness = receipt.readiness || {};
if (readiness.activation_preflight_ready !== true) fail("activation_preflight_ready must be true");
if (readiness.command_hash_readiness_ready !== true) fail("command_hash_readiness_ready must be true");
if (readiness.command_candidate_hashed !== true) fail("command_candidate_hashed must be true");
if (readiness.final_operator_command_selected !== false) fail("final_operator_command_selected must be false");
if (readiness.final_operator_command_approved !== false) fail("final_operator_command_approved must be false");

const candidate = receipt.command_candidate || {};
if (candidate.file !== candidatePath) fail("command candidate file path mismatch");
if (candidate.sha256 !== sha256(candidatePath)) fail("command candidate sha256 mismatch");
if (candidate.status !== "HASHED_FOR_READINESS_ONLY") fail("command candidate status mismatch");
if (candidate.candidate_command_text !== "PENDING_FINAL_OPERATOR_SELECTION") fail("candidate command must remain pending");
if (candidate.candidate_command_allowed_now !== false) fail("candidate command must not be allowed now");

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

if (receipt.next_valid_boundary !== "mainnet-operator-approval-preparation-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS mainnet-activation-command-hash-readiness-v1");
