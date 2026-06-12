const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-operator-approval-v1.json";
const docPath = "docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md";
const statementPath = "receipts/governance/mainnet-operator-approval-statement-v1.txt";
const finalCommandPath = "receipts/governance/mainnet-final-command-text-v1.txt";

function fail(message) {
  console.error(`FAIL mainnet-operator-approval-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

for (const path of [receiptPath, docPath, statementPath, finalCommandPath]) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.governance_version !== "v1") fail("governance_version must be v1");
if (receipt.receipt !== "mainnet-operator-approval-v1") fail("receipt name mismatch");

const model = receipt.governance_model || {};
if (model.outside_reviewer_required !== false) fail("outside_reviewer_required must be false");
if (model.outside_review_welcome !== true) fail("outside_review_welcome must be true");
if (model.open_verification_required !== true) fail("open_verification_required must be true");
if (model.operator_approval_required_for_mainnet !== true) fail("operator_approval_required_for_mainnet must be true");

const approval = receipt.approval || {};
if (approval.operator_approval_granted !== true) fail("operator_approval_granted must be true");
if (approval.final_operator_command_approved !== true) fail("final_operator_command_approved must be true");
if (approval.mainnet_cutover_approval_granted !== true) fail("mainnet_cutover_approval_granted must be true");
if (approval.direct_execution_from_this_receipt_allowed !== false) fail("direct execution from approval receipt must remain false");
if (approval.next_execution_boundary_required !== true) fail("next execution boundary must be required");

const auth = receipt.authorization || {};
const requiredAuthTrue = [
  "deployment_authorized",
  "broadcast_authorized",
  "mainnet_cutover_authorized",
  "state_changing_transaction_authorized"
];

for (const flag of requiredAuthTrue) {
  if (auth[flag] !== true) fail(`${flag} must be true`);
}

const execution = receipt.execution_state || {};
const requiredExecutionFalse = [
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

for (const flag of requiredExecutionFalse) {
  if (execution[flag] !== false) fail(`${flag} must be false`);
}

const command = receipt.approved_final_command || {};
if (command.file !== finalCommandPath) fail("approved final command path mismatch");
if (command.sha256 !== sha256(finalCommandPath)) fail("approved final command sha256 mismatch");
if (command.selection_receipt !== "receipts/governance/mainnet-final-command-selection-v1.json") fail("selection receipt mismatch");

const statement = receipt.operator_approval_statement || {};
if (statement.file !== statementPath) fail("operator approval statement path mismatch");
if (statement.sha256 !== sha256(statementPath)) fail("operator approval statement sha256 mismatch");

const artifacts = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(artifacts)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sha256 mismatch for ${path}`);
}

if (receipt.next_valid_boundary !== "mainnet-execution-window-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS mainnet-operator-approval-v1");
