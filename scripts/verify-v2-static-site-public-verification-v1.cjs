const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/v2-static-site-public-verification-v1.json";
const docPath = "docs/public/STATIC_SITE_PUBLIC_VERIFICATION_V1.md";

function fail(message) {
  console.error(`FAIL v2-static-site-public-verification-v1: ${message}`);
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

if (receipt.governance_version !== "v2") fail("governance_version must be v2");
if (receipt.receipt !== "v2-static-site-public-verification-v1") fail("receipt name mismatch");

const scope = receipt.scope || {};
if (scope.visibility_layer !== true) fail("visibility_layer must be true");
if (scope.static_site_public_verification !== true) fail("static_site_public_verification must be true");
if (scope.read_only_endpoint !== true) fail("read_only_endpoint must be true");
if (scope.public_review_support !== true) fail("public_review_support must be true");
if (scope.mainnet_mutation_authorized !== false) fail("mainnet_mutation_authorized must be false");
if (scope.execution_authorized !== false) fail("execution_authorized must be false");
if (scope.fund_movement_authorized !== false) fail("fund_movement_authorized must be false");

const evidence = receipt.runtime_evidence || {};
for (const item of Object.values(evidence)) {
  if (!item.file || !item.sha256) fail("runtime evidence item missing file or sha256");
  if (sha256(item.file) !== item.sha256) fail(`runtime evidence sha256 mismatch for ${item.file}`);
}

const local = JSON.parse(fs.readFileSync("runtime/static-site-verification-v1/local-static-verification.json", "utf8"));
if (local.local_static_artifacts_present !== true) fail("local static artifacts must be present");
if (local.json_files_parse !== true) fail("json files must parse");
if (local.status_json_matches_index_json !== true) fail("status json must match index json");
if (local.read_only_assertions?.live_mainnet_mutation_authorized !== false) fail("live mainnet mutation must not be authorized");

const sealed = receipt.sealed_artifacts || {};
for (const [path, expected] of Object.entries(sealed)) {
  const actual = sha256(path);
  if (actual !== expected) fail(`sealed artifact sha256 mismatch for ${path}`);
}

if (receipt.next_valid_boundary !== "v2-funder-review-packet-v1") {
  fail("next_valid_boundary mismatch");
}

console.log("PASS v2-static-site-public-verification-v1");
