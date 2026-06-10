#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/autonomous-network-readiness-v1.json";
const docPath = "docs/autonomous/AUTONOMOUS_NETWORK_READINESS_V1.md";

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing readiness receipt");
if (!fs.existsSync(docPath)) fail("missing readiness doc");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "autonomous-network-readiness-v1") fail("wrong schema");
if (receipt.status !== "sealed") fail("receipt not sealed");

const claims = receipt.claims || {};

const requiredTrue = [
  "autonomous_network_ready_for_next_attempt",
  "operator_override_required",
  "local_verification_required",
  "required_review_boundary_active"
];

const requiredFalse = [
  "full_autonomous_network_live",
  "false_authority_claimed",
  "hosted_github_ci_authoritative"
];

for (const key of requiredTrue) {
  if (claims[key] !== true) fail(`${key} must be true`);
}

for (const key of requiredFalse) {
  if (claims[key] !== false) fail(`${key} must be false`);
}

if (!doc.includes("This receipt does not claim that a full autonomous network is live.")) {
  fail("doc missing non-claim boundary");
}

if (!doc.includes("operator_override_required == true")) {
  fail("doc missing operator override boundary");
}

if (!doc.includes("full_autonomous_network_live == false")) {
  fail("doc missing full autonomy false boundary");
}

console.log("PASS autonomous-network-readiness-v1");
