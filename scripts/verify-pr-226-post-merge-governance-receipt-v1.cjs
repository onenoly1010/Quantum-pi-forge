#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL pr-226-post-merge-governance-receipt-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_226.md";
const receiptPath = "receipts/governance/pr-226-post-merge-governance-receipt-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == 8e66ada",
  "PR #226: Define supervised activation receipt hash semantics v1",
  "github_hosted_bypass_used == false",
  "receipt_hash_semantics_v1_on_main == true",
  "disk_sha256_is_governed_artifact_hash == true",
  "receipt_sha256_is_legacy_internal_field == true",
  "receipt_sha256_is_not_assumed_to_equal_disk_sha256 == true",
  "payload_sha256_reserved_for_future_runtime_semantics == true",
  "false_hash_equivalence_claim_forbidden == true",
  "hash_mismatch_disclosure_required == true",
  "dry_run_1_hash_distinction_preserved == true",
  "dry_run_2_hash_distinction_preserved == true",
  "dry_run_3_hash_distinction_preserved == true",
  "dry_run_1_2_3_evidence_on_main == true",
  "no_new_autonomous_capability == true",
  "activation_mode_remains_dry_run_only == true",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "private_key_access_authorized == false",
  "irreversible_network_action_authorized == false",
  "full_autonomy_claimed == false",
  "authority_expanded == false",
  "autonomous:supervised-activation-receipt-hash-semantics:v1:check == PASS",
  "autonomous:network-activation-readiness:v2:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "pr-226-post-merge-governance-receipt-v1",
  status: "sealed",
  subject_pr: 226,
  subject_title: "Define supervised activation receipt hash semantics v1",
  main_commit: "8e66ada",
  merge_method: "squash",
  github_hosted_bypass_used: false,
  branch_protection_respected: true,
  branch_deleted_after_merge: true,
  main_fast_forwarded: true,
  receipt_hash_semantics_v1_on_main: true,
  disk_sha256_is_governed_artifact_hash: true,
  receipt_sha256_is_legacy_internal_field: true,
  receipt_sha256_is_not_assumed_to_equal_disk_sha256: true,
  payload_sha256_reserved_for_future_runtime_semantics: true,
  false_hash_equivalence_claim_forbidden: true,
  hash_mismatch_disclosure_required: true,
  dry_run_1_hash_distinction_preserved: true,
  dry_run_2_hash_distinction_preserved: true,
  dry_run_3_hash_distinction_preserved: true,
  dry_run_1_2_3_evidence_on_main: true,
  no_new_autonomous_capability: true,
  activation_mode_remains_dry_run_only: true,
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

console.log("PASS pr-226-post-merge-governance-receipt-v1");
