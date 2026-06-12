const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/v2-public-status-endpoint-v1.json";
const docPath = "docs/public/PUBLIC_STATUS_ENDPOINT_V1.md";
const publicJsonPath = "public/status-dashboard-v1.json";
const indexJsonPath = "public/status/index.json";
const htmlPath = "public/status/index.html";
const sourceJsonPath = "docs/public/status-dashboard-v1.json";

function fail(message) {
  console.error(`FAIL v2-public-status-endpoint-v1: ${message}`);
  process.exit(1);
}

function sha256(path) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

for (const path of [receiptPath, docPath, publicJsonPath, indexJsonPath, htmlPath, sourceJsonPath]) {
  if (!fs.existsSync(path)) fail(`missing required file: ${path}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const publicStatus = JSON.parse(fs.readFileSync(publicJsonPath, "utf8"));
const indexStatus = JSON.parse(fs.readFileSync(indexJsonPath, "utf8"));

if (receipt.governance_version !== "v2") fail("governance_version must be v2");
if (receipt.receipt !== "v2-public-status-endpoint-v1") fail("receipt name mismatch");

if (sha256(publicJsonPath) !== sha256(sourceJsonPath)) {
  fail("public status json must match docs/public/status-dashboard-v1.json");
}

if (sha256(indexJsonPath) !== sha256(sourceJsonPath)) {
  fail("status index json must match docs/public/status-dashboard-v1.json");
}

const scope = receipt.scope || {};
if (scope.visibility_layer !== true) fail("visibility_layer must be true");
if (scope.public_status_endpoint !== true) fail("public_status_endpoint must be true");
if (scope.read_only_endpoint !== true) fail("read_only_endpoint must be true");
if (scope.public_review_support !== true) fail("public_review_support must be true");
if (scope.mainnet_mutation_authorized !== false) fail("mainnet_mutation_authorized must be false");
if (scope.execution_authorized !== false) fail("execution_authorized must be false");
if (scope.fund_movement_authorized !== false) fail("fund_movement_authorized must be false");

const v1 = receipt.v1_lifecycle_reference || {};
if (v1.cycle_completed !== true) fail("v1 cycle must be completed");
if (v1.execution_window_consumed !== true) fail("execution window must be consumed");
if (v1.execution_result_sealed !== true) fail("execution result must be sealed");
if (v1.single_use_execution_window_replay_allowed !== false) fail("execution window replay must be false");
if (v1.next_allowed_state_action !== "none_under_v1_cycle") fail("v1 next allowed action mismatch");

if (publicStatus.v2_visibility_layer?.live_mainnet_mutation_authorized !== false) {
  fail("public status json must not authorize live mutation");
}

if (indexStatus.v2_visibility_layer?.live_mainnet_mutation_authorized !== false) {
  fail("status index json must not authorize live mutation");
}

for (const group of [receipt.endpoint_artifacts || {}, receipt.sealed_artifacts || {}]) {
  for (const [path, expected] of Object.entries(group)) {
    const actual = sha256(path);
    if (actual !== expected) fail(`sha256 mismatch for ${path}`);
  }
}

if (receipt.next_valid_boundary !== "v2-reviewer-evidence-index-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS v2-public-status-endpoint-v1");
