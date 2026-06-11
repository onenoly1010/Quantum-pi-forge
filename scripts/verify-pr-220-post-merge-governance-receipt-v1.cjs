#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL pr-220-post-merge-governance-receipt-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_220.md";
const receiptPath = "receipts/governance/pr-220-post-merge-governance-receipt-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == fd42e12",
  "PR #220: Seal supervised activation dry-run 2 evidence v1",
  "github_hosted_bypass_used == false",
  "supervised_activation_dry_run_2_evidence_on_main == true",
  "runtime_receipt_disk_sha_governed == true",
  "internal_receipt_sha_recorded == true",
  "runtime_receipt_committed == false",
  "runtime_receipt_git_ignored == true",
  "activation_status == dry_run_complete",
  "no_new_autonomous_capability == true",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "private_key_accessed == false",
  "irreversible_network_action_executed == false",
  "full_autonomy_claimed == false",
  "authority_expanded == false",
  "governance:supervised-activation-dry-run-2-evidence:v1:check == PASS",
  "autonomous:network-activation-readiness:v2:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "pr-220-post-merge-governance-receipt-v1",
  status: "sealed",
  subject_pr: 220,
  subject_title: "Seal supervised activation dry-run 2 evidence v1",
  main_commit: "fd42e12",
  merge_method: "squash",
  github_hosted_bypass_used: false,
  branch_protection_respected: true,
  branch_deleted_after_merge: true,
  supervised_activation_dry_run_2_evidence_on_main: true,
  runtime_receipt_disk_sha_governed: true,
  internal_receipt_sha_recorded: true,
  runtime_receipt_committed: false,
  runtime_receipt_git_ignored: true,
  runtime_receipt_path: "runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-22-917Z.json",
  runtime_receipt_disk_sha256: "fde9cd7f7029c844fc1f8ffe308ace886500d305159b2e57502e7053a521b477",
  runtime_receipt_internal_sha256: "4b285fc472355896c3b356d0ddc59ec666c3d74bcc22ce2437b8d13f93b4c863",
  activation_status: "dry_run_complete",
  no_new_autonomous_capability: true,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  private_key_accessed: false,
  irreversible_network_action_executed: false,
  full_autonomy_claimed: false,
  authority_expanded: false
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

console.log("PASS pr-220-post-merge-governance-receipt-v1");
