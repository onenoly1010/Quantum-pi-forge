const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-execution-result-v1.json";
const docPath = "docs/governance/MAINNET_EXECUTION_RESULT_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-execution-result-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

for (const path of [receiptPath, docPath]) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.governance_version !== "v1") fail("governance_version must be v1");
if (receipt.receipt !== "mainnet-execution-result-v1") fail("receipt name mismatch");

const attempt = receipt.execution_attempt || {};
if (attempt.execution_attempted !== true) fail("execution_attempted must be true");
if (typeof attempt.exit_code !== "number") fail("exit_code must be numeric");

const execution = receipt.execution_state || {};
if (execution.command_executed !== true) fail("command_executed must be true");

const evidence = receipt.evidence || {};
if (evidence.stdout_sha256 !== sha256(evidence.stdout_log)) fail("stdout sha256 mismatch");
if (evidence.stderr_sha256 !== sha256(evidence.stderr_log)) fail("stderr sha256 mismatch");

const artifacts = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(artifacts)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sha256 mismatch for ${path}`);
}

console.log("PASS mainnet-execution-result-v1");
