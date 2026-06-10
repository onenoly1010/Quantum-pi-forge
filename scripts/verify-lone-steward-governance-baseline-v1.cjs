#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

const docPath = "docs/governance/LONE_STEWARD_GOVERNANCE_BASELINE_V1.md";
const receiptPath = "receipts/governance/lone-steward-governance-baseline-v1.json";

if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);
if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredFalse = [
  "required_review_gate_is_meaningful",
  "fake_review_allowed",
  "full_autonomous_network_live"
];

const requiredTrue = [
  "single_steward_mode",
  "bounded_admin_override_previously_required",
  "local_verifier_gate_required",
  "receipt_gate_required",
  "branch_protection_required",
  "linear_history_required",
  "pull_request_flow_required"
];

if (receipt.schema !== "lone-steward-governance-baseline-v1") fail("wrong schema");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.eligible_independent_reviewer_count !== 0) fail("eligible reviewer count must be 0");

for (const key of requiredFalse) {
  if (receipt[key] !== false) fail(`${key} must be false`);
}

for (const key of requiredTrue) {
  if (receipt[key] !== true) fail(`${key} must be true`);
}

for (const text of [
  "required_review_gate_is_meaningful == false",
  "fake_review_allowed == false",
  "local_verifier_gate_required == true",
  "eligible_independent_reviewer_count >= 1",
  "This baseline does not claim the system is fully autonomous."
]) {
  if (!doc.includes(text)) fail(`doc missing required text: ${text}`);
}

console.log("PASS lone-steward-governance-baseline-v1");
