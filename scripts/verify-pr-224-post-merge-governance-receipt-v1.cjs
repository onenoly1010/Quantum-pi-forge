#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL pr-224-post-merge-governance-receipt-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_224.md";
const receiptPath = "receipts/governance/pr-224-post-merge-governance-receipt-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == c33915f",
  "PR #224: Seal supervised activation dry-run 3 evidence v1",
  "github_hosted_bypass_used == false",
  "supervised_activation_dry_run_3_evidence_on_main == true",
  "runtime_receipt_committed == false",
  "runtime_receipt_git_ignored == true",
  "disk_sha256_governed == true",
  "internal_receipt_sha_recorded == true",
  "hash_mismatch_disclosed == true",
  "activation_status == dry_run_complete",
  "activation_mode == dry-run",
  "live_execution_performed == false",
  "wallet_mutation_performed == false",
  "network_mutation_performed == false",
  "private_key_accessed == false",
  "full_autonomy_claimed == false",
  "no_new_autonomous_capability == true",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "private_key_access_authorized == false",
  "irreversible_network_action_authorized == false",
  "authority_expanded == false",
  "governance:supervised-activation-dry-run-3-evidence:v1:check == PASS",
  "autonomous:network-activation-readiness:v2:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "pr-224-post-merge-governance-receipt-v1",
  status: "sealed",
  subject_pr: 224,
  subject_title: "Seal supervised activation dry-run 3 evidence v1",
  main_commit: "c33915f",
  merge_method: "squash",
  github_hosted_bypass_used: false,
  branch_protection_respected: true,
  branch_deleted_after_merge: true,
  main_fast_forwarded: true,
  supervised_activation_dry_run_3_evidence_on_main: true,
  runtime_receipt_committed: false,
  runtime_receipt_git_ignored: true,
  disk_sha256_governed: true,
  internal_receipt_sha_recorded: true,
  hash_mismatch_disclosed: true,
  activation_status: "dry_run_complete",
  activation_mode: "dry-run",
  live_execution_performed: false,
  wallet_mutation_performed: false,
  network_mutation_performed: false,
  private_key_accessed: false,
  full_autonomy_claimed: false,
  no_new_autonomous_capability: true,
  operator_intent_required: true,
  operator_supervision_required: true,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  private_key_access_authorized: false,
  irreversible_network_action_authorized: false,
  authority_expanded: false
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

console.log("PASS pr-224-post-merge-governance-receipt-v1");
