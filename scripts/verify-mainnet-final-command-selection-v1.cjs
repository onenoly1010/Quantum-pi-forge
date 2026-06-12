const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-final-command-selection-v1.json";
const docPath = "docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md";
const finalCommandPath = "receipts/governance/mainnet-final-command-text-v1.txt";

function fail(message) {
  console.error(`FAIL mainnet-final-command-selection-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

if (!fs.existsSync(receiptPath)) fail(`missing required file: ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing required file: ${docPath}`);
if (!fs.existsSync(finalCommandPath)) fail(`missing required file: ${finalCommandPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.governance_version !== "v1") fail("governance_version must be v1");
if (receipt.receipt !== "mainnet-final-command-selection-v1") fail("receipt name mismatch");

const model = receipt.governance_model || {};
if (model.outside_reviewer_required !== false) fail("outside_reviewer_required must be false");
if (model.outside_review_welcome !== true) fail("outside_review_welcome must be true");
if (model.open_verification_required !== true) fail("open_verification_required must be true");
if (model.operator_approval_required_for_mainnet !== true) fail("operator_approval_required_for_mainnet must be true");

const selection = receipt.selection || {};
if (selection.final_operator_command_selected !== true) fail("final_operator_command_selected must be true");
if (selection.final_operator_command_hash_sealed !== true) fail("final_operator_command_hash_sealed must be true");
if (selection.final_operator_command_approved !== false) fail("final_operator_command_approved must be false");
if (selection.operator_approval_granted !== false) fail("operator_approval_granted must be false");

const finalCommand = receipt.final_command || {};
if (finalCommand.file !== finalCommandPath) fail("final command file path mismatch");
if (finalCommand.sha256 !== sha256(finalCommandPath)) fail("final command sha256 mismatch");
if (finalCommand.status !== "SELECTED_NOT_APPROVED") fail("final command status mismatch");
if (finalCommand.allowed_now !== false) fail("final command must not be allowed now");
if (finalCommand.approval_status !== "not_approved") fail("final command approval status must be not_approved");

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

if (receipt.next_valid_boundary !== "mainnet-operator-approval-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS mainnet-final-command-selection-v1");
