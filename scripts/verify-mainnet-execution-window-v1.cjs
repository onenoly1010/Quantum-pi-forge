const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-execution-window-v1.json";
const docPath = "docs/governance/MAINNET_EXECUTION_WINDOW_V1.md";
const noticePath = "receipts/governance/mainnet-execution-window-notice-v1.txt";
const finalCommandPath = "receipts/governance/mainnet-final-command-text-v1.txt";
const approvalReceiptPath = "receipts/governance/mainnet-operator-approval-v1.json";

function fail(message) {
  console.error(`FAIL mainnet-execution-window-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

for (const path of [receiptPath, docPath, noticePath, finalCommandPath, approvalReceiptPath]) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.governance_version !== "v1") fail("governance_version must be v1");
if (receipt.receipt !== "mainnet-execution-window-v1") fail("receipt name mismatch");

const window = receipt.execution_window || {};
if (window.execution_window_open !== true) fail("execution_window_open must be true");
if (window.single_use_execution_window !== true) fail("single_use_execution_window must be true");
if (window.post_execution_receipt_required !== true) fail("post_execution_receipt_required must be true");
if (window.automatic_execution_performed_by_this_receipt !== false) fail("this receipt must not perform automatic execution");

const approval = receipt.approval || {};
if (approval.operator_approval_granted !== true) fail("operator_approval_granted must be true");
if (approval.final_operator_command_approved !== true) fail("final_operator_command_approved must be true");
if (approval.mainnet_cutover_approval_granted !== true) fail("mainnet_cutover_approval_granted must be true");

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

const before = receipt.execution_state_before_run || {};
const requiredBeforeFalse = [
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

for (const flag of requiredBeforeFalse) {
  if (before[flag] !== false) fail(`${flag} must be false before run`);
}

const command = receipt.approved_final_command || {};
if (command.file !== finalCommandPath) fail("approved final command path mismatch");
if (command.sha256 !== sha256(finalCommandPath)) fail("approved final command sha256 mismatch");

const approvalReceipt = receipt.operator_approval_receipt || {};
if (approvalReceipt.file !== approvalReceiptPath) fail("operator approval receipt path mismatch");
if (approvalReceipt.sha256 !== sha256(approvalReceiptPath)) fail("operator approval receipt sha256 mismatch");

const artifacts = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(artifacts)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sha256 mismatch for ${path}`);
}

if (receipt.next_valid_boundary !== "mainnet-execution-result-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS mainnet-execution-window-v1");
