const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/v2-read-only-status-dashboard-v1.json";
const dashboardPath = "docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md";
const statusJsonPath = "docs/public/status-dashboard-v1.json";

function fail(message) {
  console.error(`FAIL v2-read-only-status-dashboard-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

for (const path of [receiptPath, dashboardPath, statusJsonPath]) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const status = JSON.parse(fs.readFileSync(statusJsonPath, "utf8"));

if (receipt.governance_version !== "v2") fail("governance_version must be v2");
if (receipt.receipt !== "v2-read-only-status-dashboard-v1") fail("receipt name mismatch");

const scope = receipt.scope || {};
if (scope.visibility_layer !== true) fail("visibility_layer must be true");
if (scope.read_only_dashboard !== true) fail("read_only_dashboard must be true");
if (scope.public_review_support !== true) fail("public_review_support must be true");
if (scope.mainnet_mutation_authorized !== false) fail("mainnet_mutation_authorized must be false");
if (scope.execution_authorized !== false) fail("execution_authorized must be false");

const v1 = receipt.v1_lifecycle_reference || {};
if (v1.cycle_completed !== true) fail("v1 cycle must be completed");
if (v1.execution_window_consumed !== true) fail("execution window must be consumed");
if (v1.execution_result_sealed !== true) fail("execution result must be sealed");
if (v1.single_use_execution_window_replay_allowed !== false) fail("execution window replay must be false");
if (v1.next_allowed_state_action !== "none_under_v1_cycle") fail("v1 next allowed action mismatch");

const dash = receipt.dashboard_artifacts || {};
for (const [path, expected] of Object.entries(dash)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`dashboard sha256 mismatch for ${path}`);
}

const sealed = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(sealed)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sealed artifact sha256 mismatch for ${path}`);
}

if (status.v2_visibility_layer?.read_only_status_dashboard_available !== true) {
  fail("status json must report dashboard available");
}

if (status.v2_visibility_layer?.live_mainnet_mutation_authorized !== false) {
  fail("status json must not authorize live mutation");
}

if (receipt.next_valid_boundary !== "v2-public-status-endpoint-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS v2-read-only-status-dashboard-v1");
