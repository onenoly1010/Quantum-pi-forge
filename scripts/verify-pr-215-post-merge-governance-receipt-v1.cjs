#!/usr/bin/env node
const fs = require("fs");

function fail(message) {
  console.error(`FAIL pr-215-post-merge-governance-receipt-v1: ${message}`);
  process.exit(1);
}

const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_215.md";
const receiptPath = "receipts/governance/pr-215-post-merge-governance-receipt-v1.json";

if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);
if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "Sealed post-merge governance receipt.",
  "PR #215: Define supervised activation runbook v1",
  "main == origin/main == b7e6697",
  "github_hosted_bypass_used == false",
  "branch_protection_respected == true",
  "branch_deleted_after_merge == true",
  "supervised_activation_runbook_v1_on_main == true",
  "activation_requires_operator_intent == true",
  "activation_remains_dry_run_only == true",
  "refusal_cases_documented == true",
  "runtime_receipts_ignored_by_git == true",
  "historical_receipts_preserved == true",
  "no_new_autonomous_capability == true",
  "no_live_execution_authorized == true",
  "no_wallet_mutation_authorized == true",
  "no_network_mutation_authorized == true",
  "no_unsupervised_execution_authorized == true",
  "autonomous:supervised-activation-runbook:v1:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail(`document missing required fragment: ${fragment}`);
}

const expected = {
  receipt: "pr-215-post-merge-governance-receipt-v1",
  status: "sealed",
  subject_pr: 215,
  subject_title: "Define supervised activation runbook v1",
  main_commit: "b7e6697",
  merge_method: "squash",
  github_hosted_bypass_used: false,
  branch_protection_respected: true,
  branch_deleted_after_merge: true,
  supervised_activation_runbook_v1_on_main: true,
  activation_requires_operator_intent: true,
  activation_remains_dry_run_only: true,
  refusal_cases_documented: true,
  runtime_receipts_ignored_by_git: true,
  historical_receipts_preserved: true,
  no_new_autonomous_capability: true,
  no_live_execution_authorized: true,
  no_wallet_mutation_authorized: true,
  no_network_mutation_authorized: true,
  no_unsupervised_execution_authorized: true
};

for (const [key, value] of Object.entries(expected)) {
  if (receipt[key] !== value) {
    fail(`receipt.${key} expected ${JSON.stringify(value)} got ${JSON.stringify(receipt[key])}`);
  }
}

const forbiddenDoc = [
  "github_hosted_bypass_used == true",
  "activation_remains_dry_run_only == false",
  "no_new_autonomous_capability == false",
  "live_execution_authorized == true",
  "wallet_mutation_authorized == true",
  "network_mutation_authorized == true",
  "unsupervised_execution_authorized == true"
];

const docLines = doc.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
for (const fragment of forbiddenDoc) {
  if (docLines.includes(fragment)) fail(`document contains forbidden fragment: ${fragment}`);
}

console.log("PASS pr-215-post-merge-governance-receipt-v1");
