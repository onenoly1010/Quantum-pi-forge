const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-operator-approval-preparation-v1.json";
const docPath = "docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md";
const checklistPath = "receipts/governance/mainnet-operator-approval-checklist-v1.txt";

function fail(message) {
  console.error(`FAIL mainnet-operator-approval-preparation-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

if (!fs.existsSync(receiptPath)) fail(`missing required file: ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing required file: ${docPath}`);
if (!fs.existsSync(checklistPath)) fail(`missing required file: ${checklistPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.governance_version !== "v1") fail("governance_version must be v1");
if (receipt.receipt !== "mainnet-operator-approval-preparation-v1") fail("receipt name mismatch");

const model = receipt.governance_model || {};
if (model.outside_reviewer_required !== false) fail("outside_reviewer_required must be false");
if (model.outside_review_welcome !== true) fail("outside_review_welcome must be true");
if (model.open_verification_required !== true) fail("open_verification_required must be true");
if (model.operator_approval_required_for_mainnet !== true) fail("operator_approval_required_for_mainnet must be true");

const prep = receipt.preparation || {};
const requiredPrepTrue = [
  "operator_approval_preparation_ready",
  "approval_checklist_prepared",
  "approval_text_prepared"
];

for (const flag of requiredPrepTrue) {
  if (prep[flag] !== true) fail(`${flag} must be true`);
}

const requiredPrepFalse = [
  "operator_approval_granted",
  "final_operator_command_selected",
  "final_operator_command_approved"
];

for (const flag of requiredPrepFalse) {
  if (prep[flag] !== false) fail(`${flag} must be false`);
}

const checklist = receipt.approval_checklist || {};
if (checklist.file !== checklistPath) fail("approval checklist file path mismatch");
if (checklist.sha256 !== sha256(checklistPath)) fail("approval checklist sha256 mismatch");
if (checklist.status !== "PREPARATION_ONLY") fail("approval checklist status mismatch");

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

if (receipt.next_valid_boundary !== "mainnet-final-command-selection-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS mainnet-operator-approval-preparation-v1");
