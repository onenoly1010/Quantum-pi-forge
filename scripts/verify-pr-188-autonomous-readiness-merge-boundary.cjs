#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/governance/pr-188-autonomous-readiness-merge-boundary-v1.json";
const docPath = "docs/governance/PR_188_AUTONOMOUS_READINESS_MERGE_BOUNDARY_V1.md";

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing PR 188 governance receipt");
if (!fs.existsSync(docPath)) fail("missing PR 188 governance doc");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "pr-188-autonomous-readiness-merge-boundary-v1") fail("wrong schema");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.pr !== 188) fail("wrong PR number");
if (receipt.merge_commit !== "1f82aa466225d3ce5f0e22dc95abd2e122ef266a") fail("wrong merge commit");
if (receipt.merge_method !== "squash") fail("wrong merge method");

const claims = receipt.claims || {};

const requiredTrue = [
  "pr_188_merged",
  "bounded_admin_override_used",
  "required_review_gate_restored",
  "local_verification_passed"
];

const requiredFalse = [
  "full_autonomous_network_live",
  "false_reviewer_claimed",
  "hosted_ci_authoritative"
];

for (const key of requiredTrue) {
  if (claims[key] !== true) fail(`${key} must be true`);
}

for (const key of requiredFalse) {
  if (claims[key] !== false) fail(`${key} must be false`);
}

if (!doc.includes("This merge records readiness only.")) fail("doc missing readiness-only boundary");
if (!doc.includes("full_autonomous_network_live == false")) fail("doc missing false autonomy boundary");
if (!doc.includes("false_reviewer_claimed == false")) fail("doc missing false reviewer boundary");

console.log("PASS pr-188-autonomous-readiness-merge-boundary-v1");
