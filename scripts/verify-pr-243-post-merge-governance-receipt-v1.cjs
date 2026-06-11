#!/usr/bin/env node
const fs = require("fs");

function fail(message) {
  console.error("FAIL pr-243-post-merge-governance-receipt-v1: " + message);
  process.exit(1);
}

const receipt = JSON.parse(fs.readFileSync("receipts/governance/pr-243-post-merge-governance-receipt-v1.json", "utf8"));
const doc = fs.readFileSync("docs/governance/PR_243_POST_MERGE_GOVERNANCE_RECEIPT_V1.md", "utf8");

if (receipt.schema !== "qpf.governance.pr_243_post_merge_receipt.v1") fail("schema mismatch");
if (receipt.status !== "SEALED") fail("status mismatch");
if (receipt.pr !== 243) fail("PR mismatch");
if (receipt.merged_commit !== "301daf2") fail("merged commit mismatch");
if (receipt.mainnet_cutover_approval_granted !== false) fail("approval must remain false");
if (receipt.mainnet_cutover_executed !== false) fail("cutover must remain false");
if (receipt.deployment_executed !== false) fail("deployment must remain false");
if (receipt.broadcast_executed !== false) fail("broadcast must remain false");
if (receipt.state_changing_transaction_executed !== false) fail("state-changing transaction must remain false");
if (receipt.post_merge_checks_observed_pass !== true) fail("post-merge checks not marked pass");

for (const phrase of [
  "PR #243",
  "301daf2",
  "does not grant mainnet cutover approval",
  "does not execute cutover",
  "system remains parked"
]) {
  if (!doc.includes(phrase)) fail("doc missing phrase: " + phrase);
}

console.log("PASS pr-243-post-merge-governance-receipt-v1");
