const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/mainnet-final-state-seal-v1.json";
const docPath = "docs/governance/MAINNET_FINAL_STATE_SEAL_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-final-state-seal-v1: ${message}`);
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
if (receipt.receipt !== "mainnet-final-state-seal-v1") fail("receipt name mismatch");

const lifecycle = receipt.lifecycle || {};
if (lifecycle.cycle_completed !== true) fail("cycle_completed must be true");
if (lifecycle.execution_window_consumed !== true) fail("execution_window_consumed must be true");
if (lifecycle.execution_result_sealed !== true) fail("execution_result_sealed must be true");
if (lifecycle.single_use_execution_window_replay_allowed !== false) fail("single_use_execution_window_replay_allowed must be false");
if (lifecycle.next_allowed_state_action !== "none_under_v1_cycle") fail("next_allowed_state_action mismatch");

const artifacts = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(artifacts)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sha256 mismatch for ${path}`);
}

console.log("PASS mainnet-final-state-seal-v1");
