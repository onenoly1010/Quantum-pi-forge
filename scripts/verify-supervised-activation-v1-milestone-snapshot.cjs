#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/governance/supervised-activation-v1-milestone-snapshot.json";
const docPath = "docs/governance/SUPERVISED_ACTIVATION_V1_MILESTONE_SNAPSHOT.md";

function fail(message) {
  console.error(`FAIL supervised-activation-v1-milestone-snapshot: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.governance.supervised_activation_v1_milestone_snapshot.v1") fail("schema mismatch");
if (receipt.status !== "SEALED") fail("status must be SEALED");
if (receipt.milestone !== "supervised-activation-v1") fail("milestone mismatch");
if (receipt.sealed_main_commit !== "b0faa80") fail("sealed main commit mismatch");
if (receipt.annotated_tag !== "supervised-activation-v1") fail("tag mismatch");
if (receipt.tag_object_sha !== "9e922cf9eaa9166872d8b816823273c482ca81c8") fail("tag object sha mismatch");
if (receipt.tag_target_commit !== "b0faa80") fail("tag target mismatch");

if (receipt.merge_boundary.pr !== 227) fail("merge boundary PR mismatch");
if (receipt.merge_boundary.merge_method !== "squash") fail("merge method mismatch");
if (receipt.merge_boundary.bypass_used !== false) fail("bypass boundary mismatch");
if (receipt.merge_boundary.branch_deleted !== true) fail("branch deletion mismatch");

for (const [name, status] of Object.entries(receipt.verification_chain || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const requiredDocTerms = [
  "b0faa80",
  "supervised-activation-v1",
  "9e922cf9eaa9166872d8b816823273c482ca81c8",
  "No bypass was used",
  "Telegram and Twitter credentials remain missing or empty",
  "unsupervised_autonomy == active",
  "mainnet_cutover == complete"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS supervised-activation-v1-milestone-snapshot");
