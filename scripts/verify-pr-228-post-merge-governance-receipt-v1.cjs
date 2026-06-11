#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/governance/pr-228-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_228.md";

function fail(message) {
  console.error(`FAIL pr-228-post-merge-governance-receipt-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.governance.pr_228_post_merge_receipt.v1") fail("schema mismatch");
if (receipt.status !== "SEALED") fail("status must be SEALED");
if (receipt.pr !== 228) fail("PR mismatch");
if (receipt.merge_method !== "squash") fail("merge method mismatch");
if (receipt.bypass_used !== false) fail("bypass boundary mismatch");
if (receipt.source_branch_deleted !== true) fail("source branch deletion mismatch");
if (receipt.main_commit_after_merge !== "9e7bc06") fail("main commit mismatch");
if (receipt.previous_main_commit !== "b0faa80") fail("previous main commit mismatch");

if (!receipt.sealed_tag) fail("missing sealed tag");
if (receipt.sealed_tag.name !== "supervised-activation-v1") fail("tag name mismatch");
if (receipt.sealed_tag.target_commit !== "b0faa80") fail("tag target mismatch");
if (receipt.sealed_tag.tag_object_sha !== "9e922cf9eaa9166872d8b816823273c482ca81c8") fail("tag object mismatch");

for (const [name, status] of Object.entries(receipt.post_merge_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const boundary = receipt.claim_boundary || {};
if (boundary.supervised_activation_v1_tag_sealed !== true) fail("tag sealed boundary mismatch");
if (boundary.milestone_snapshot_landed_on_main !== true) fail("snapshot landed boundary mismatch");
if (boundary.press_agent_fully_configured !== false) fail("press agent claim boundary mismatch");
if (boundary.mainnet_cutover_complete !== false) fail("mainnet cutover claim boundary mismatch");
if (boundary.unsupervised_autonomy_active !== false) fail("unsupervised autonomy claim boundary mismatch");

const requiredDocTerms = [
  "9e7bc06",
  "b0faa80",
  "supervised-activation-v1",
  "No bypass was used",
  "press agent fully configured",
  "mainnet cutover complete",
  "unsupervised autonomy active"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS pr-228-post-merge-governance-receipt-v1");
