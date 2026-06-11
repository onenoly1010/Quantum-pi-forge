#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL pr-218-post-merge-governance-receipt-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_218.md";
const receiptPath = "receipts/governance/pr-218-post-merge-governance-receipt-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == fae969c",
  "PR #218: Add supervised activation operations index v1",
  "github_hosted_bypass_used == false",
  "supervised_activation_operations_index_v1_on_main == true",
  "prs_209_to_217_indexed == true",
  "dry_run_1_evidence_referenced == true",
  "no_new_autonomous_capability == true",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "unsupervised_execution_authorized == false",
  "authority_expanded == false",
  "autonomous:supervised-activation-operations-index:v1:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "pr-218-post-merge-governance-receipt-v1",
  status: "sealed",
  subject_pr: 218,
  subject_title: "Add supervised activation operations index v1",
  main_commit: "fae969c",
  merge_method: "squash",
  github_hosted_bypass_used: false,
  branch_protection_respected: true,
  branch_deleted_after_merge: true,
  supervised_activation_operations_index_v1_on_main: true,
  prs_209_to_217_indexed: true,
  dry_run_1_evidence_referenced: true,
  reviewer_facing_operations_index: true,
  no_new_autonomous_capability: true,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  unsupervised_execution_authorized: false,
  authority_expanded: false
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

console.log("PASS pr-218-post-merge-governance-receipt-v1");
