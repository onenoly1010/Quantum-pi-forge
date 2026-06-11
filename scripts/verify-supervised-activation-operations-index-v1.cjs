#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL supervised-activation-operations-index-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/autonomous/SUPERVISED_ACTIVATION_OPERATIONS_INDEX_V1.md";
const receiptPath = "receipts/autonomous/supervised-activation-operations-index-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == 4e1f72c",
  "PR #209: Define supervised autonomous activation command v1",
  "PR #217: Seal supervised activation dry-run 1 evidence v1",
  "activation_mode == dry-run-only",
  "operator_intent_required == true",
  "runtime_receipts_ignored_by_git == true",
  "dry_run_1_status == dry_run_complete",
  "dry_run_1_runtime_receipt_sha256 == 3563ac7996b1f92479b7d95bfce3bad68632273a3bb1b65e1cc8d8277afd0941",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "unsupervised_execution_authorized == false",
  "authority_expanded == false",
  "additional_dry_runs_required == true",
  "reviewer_consensus_required == true",
  "new_live_activation_governance_lane_required == true"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "supervised-activation-operations-index-v1",
  status: "sealed",
  main_commit: "4e1f72c",
  activation_mode: "dry-run-only",
  operator_intent_required: true,
  operator_supervision_required: true,
  runtime_receipts_ignored_by_git: true,
  raw_runtime_receipts_not_committed: true,
  governed_evidence_receipts_committed: true,
  dry_run_1_status: "dry_run_complete",
  dry_run_1_runtime_receipt_sha256: "3563ac7996b1f92479b7d95bfce3bad68632273a3bb1b65e1cc8d8277afd0941",
  dry_run_1_evidence_pr: 217,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  unsupervised_execution_authorized: false,
  authority_expanded: false,
  additional_dry_runs_required: true,
  reviewer_consensus_required: true,
  new_live_activation_governance_lane_required: true
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

if (!Array.isArray(receipt.covers_prs) || receipt.covers_prs.join(",") !== "209,210,211,212,213,214,215,216,217") {
  fail("covers_prs mismatch");
}

const forbiddenLines = [
  "live_execution_authorized == true",
  "wallet_mutation_authorized == true",
  "network_mutation_authorized == true",
  "unsupervised_execution_authorized == true",
  "authority_expanded == true"
];

const docLines = doc.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
for (const line of forbiddenLines) {
  if (docLines.includes(line)) fail("forbidden line present: " + line);
}

console.log("PASS supervised-activation-operations-index-v1");
