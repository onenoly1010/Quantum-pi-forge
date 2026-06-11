#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL pr-222-post-merge-governance-receipt-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_222.md";
const receiptPath = "receipts/governance/pr-222-post-merge-governance-receipt-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == fd0aba1",
  "PR #222: Add supervised activation dry-run evidence summary v1",
  "github_hosted_bypass_used == false",
  "supervised_activation_dry_run_evidence_summary_on_main == true",
  "dry_run_1_evidence_on_main == true",
  "dry_run_2_evidence_on_main == true",
  "disk_sha256_rule_documented == true",
  "hash_mismatch_disclosure_rule_documented == true",
  "live_activation_preparation_allowed == false",
  "live_activation_allowed == false",
  "no_new_autonomous_capability == true",
  "activation_mode == dry-run-only",
  "operator_intent_required == true",
  "operator_supervision_required == true",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "private_key_access_authorized == false",
  "irreversible_network_action_authorized == false",
  "full_autonomy_claimed == false",
  "authority_expanded == false",
  "autonomous:supervised-activation-dry-run-evidence-summary:v1:check == PASS",
  "autonomous:network-activation-readiness:v2:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "pr-222-post-merge-governance-receipt-v1",
  status: "sealed",
  subject_pr: 222,
  subject_title: "Add supervised activation dry-run evidence summary v1",
  main_commit: "fd0aba1",
  merge_method: "squash",
  github_hosted_bypass_used: false,
  branch_protection_respected: true,
  branch_deleted_after_merge: true,
  main_fast_forwarded: true,
  supervised_activation_dry_run_evidence_summary_on_main: true,
  dry_run_1_evidence_on_main: true,
  dry_run_2_evidence_on_main: true,
  disk_sha256_rule_documented: true,
  hash_mismatch_disclosure_rule_documented: true,
  live_activation_preparation_allowed: false,
  live_activation_allowed: false,
  no_new_autonomous_capability: true,
  activation_mode: "dry-run-only",
  operator_intent_required: true,
  operator_supervision_required: true,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  private_key_access_authorized: false,
  irreversible_network_action_authorized: false,
  full_autonomy_claimed: false,
  authority_expanded: false
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

console.log("PASS pr-222-post-merge-governance-receipt-v1");
