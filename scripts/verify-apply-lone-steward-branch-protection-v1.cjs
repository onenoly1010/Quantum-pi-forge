#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

const docPath = "docs/governance/APPLY_LONE_STEWARD_BRANCH_PROTECTION_V1.md";
const receiptPath = "receipts/governance/apply-lone-steward-branch-protection-v1.json";

if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);
if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.schema !== "apply-lone-steward-branch-protection-v1") fail("wrong schema");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.baseline_required !== "lone-steward-governance-baseline-v1") fail("wrong baseline");
if (receipt.eligible_independent_reviewer_count !== 0) fail("eligible reviewer count must be 0");
if (receipt.required_approving_review_count_target !== 0) fail("review target must be 0");
if (receipt.require_code_owner_reviews_target !== false) fail("code owner review target must be false");

for (const key of [
  "pull_request_flow_required",
  "linear_history_required",
  "branch_protection_required",
  "local_verifier_gate_required",
  "receipt_gate_required"
]) {
  if (receipt[key] !== true) fail(`${key} must be true`);
}

for (const key of [
  "fake_review_allowed",
  "full_autonomous_network_live"
]) {
  if (receipt[key] !== false) fail(`${key} must be false`);
}

for (const text of [
  "required approving review count is reduced to zero",
  "pull_request_flow_required == true",
  "local_verifier_gate_required == true",
  "fake_review_allowed == false",
  "eligible_independent_reviewer_count >= 1",
  "This lane does not claim full autonomy."
]) {
  if (!doc.includes(text)) fail(`doc missing required text: ${text}`);
}

console.log("PASS apply-lone-steward-branch-protection-v1");
