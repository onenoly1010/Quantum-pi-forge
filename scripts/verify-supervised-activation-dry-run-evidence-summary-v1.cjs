#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL supervised-activation-dry-run-evidence-summary-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/autonomous/SUPERVISED_ACTIVATION_DRY_RUN_EVIDENCE_SUMMARY_V1.md";
const receiptPath = "receipts/autonomous/supervised-activation-dry-run-evidence-summary-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == e310b25",
  "PR #217: Seal supervised activation dry-run 1 evidence v1",
  "PR #220: Seal supervised activation dry-run 2 evidence v1",
  "PR #221: Seal PR 220 post-merge governance receipt v1",
  "dry_run_1_evidence_on_main == true",
  "dry_run_2_evidence_on_main == true",
  "dry_run_1_runtime_receipt_disk_sha256 == 3563ac7996b1f92479b7d95bfce3bad68632273a3bb1b65e1cc8d8277afd0941",
  "dry_run_2_runtime_receipt_disk_sha256 == fde9cd7f7029c844fc1f8ffe308ace886500d305159b2e57502e7053a521b477",
  "dry_run_2_runtime_receipt_internal_sha256 == 4b285fc472355896c3b356d0ddc59ec666c3d74bcc22ce2437b8d13f93b4c863",
  "disk_sha256_is_governed_artifact_hash == true",
  "internal_receipt_sha256_is_recorded_as_receipt_field == true",
  "hash_mismatch_must_be_disclosed == true",
  "raw_runtime_receipts_committed == false",
  "runtime_receipts_git_ignored == true",
  "activation_mode == dry-run-only",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "private_key_access_authorized == false",
  "irreversible_network_action_authorized == false",
  "full_autonomy_claimed == false",
  "authority_expanded == false",
  "dry_run_3_allowed == true",
  "live_activation_preparation_allowed == false",
  "live_activation_allowed == false",
  "reviewer_consensus_required_before_live_prep == true",
  "new_live_activation_governance_lane_required == true"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "supervised-activation-dry-run-evidence-summary-v1",
  status: "sealed",
  main_commit: "e310b25",
  dry_run_1_evidence_on_main: true,
  dry_run_1_status: "dry_run_complete",
  dry_run_1_runtime_receipt_disk_sha256: "3563ac7996b1f92479b7d95bfce3bad68632273a3bb1b65e1cc8d8277afd0941",
  dry_run_1_live_execution_performed: false,
  dry_run_1_wallet_mutation_performed: false,
  dry_run_1_network_mutation_performed: false,
  dry_run_2_evidence_on_main: true,
  dry_run_2_status: "dry_run_complete",
  dry_run_2_runtime_receipt_disk_sha256: "fde9cd7f7029c844fc1f8ffe308ace886500d305159b2e57502e7053a521b477",
  dry_run_2_runtime_receipt_internal_sha256: "4b285fc472355896c3b356d0ddc59ec666c3d74bcc22ce2437b8d13f93b4c863",
  dry_run_2_live_execution_performed: false,
  dry_run_2_wallet_mutation_performed: false,
  dry_run_2_network_mutation_performed: false,
  disk_sha256_is_governed_artifact_hash: true,
  internal_receipt_sha256_is_recorded_as_receipt_field: true,
  hash_mismatch_must_be_disclosed: true,
  raw_runtime_receipts_committed: false,
  runtime_receipts_git_ignored: true,
  activation_mode: "dry-run-only",
  operator_intent_required: true,
  operator_supervision_required: true,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  private_key_access_authorized: false,
  irreversible_network_action_authorized: false,
  full_autonomy_claimed: false,
  authority_expanded: false,
  dry_run_3_allowed: true,
  live_activation_preparation_allowed: false,
  live_activation_allowed: false,
  reviewer_consensus_required_before_live_prep: true,
  new_live_activation_governance_lane_required: true
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

if (!Array.isArray(receipt.covered_prs) || receipt.covered_prs.join(",") !== "217,218,219,220,221") {
  fail("covered_prs mismatch");
}

console.log("PASS supervised-activation-dry-run-evidence-summary-v1");
