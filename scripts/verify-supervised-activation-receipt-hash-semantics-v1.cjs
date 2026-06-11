#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL supervised-activation-receipt-hash-semantics-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/autonomous/SUPERVISED_ACTIVATION_RECEIPT_HASH_SEMANTICS_V1.md";
const receiptPath = "receipts/autonomous/supervised-activation-receipt-hash-semantics-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == 10fce10",
  "disk_sha256_is_governed_artifact_hash == true",
  "receipt_sha256_is_legacy_internal_field == true",
  "receipt_sha256_is_not_assumed_to_equal_disk_sha256 == true",
  "payload_sha256_reserved_for_future_runtime_semantics == true",
  "dry_run_1_hash_distinction_preserved == true",
  "dry_run_2_hash_distinction_preserved == true",
  "dry_run_3_hash_distinction_preserved == true",
  "governed_evidence_uses_disk_sha256 == true",
  "internal_receipt_sha256_recorded_separately == true",
  "hash_mismatch_disclosure_required == true",
  "false_hash_equivalence_claim_forbidden == true",
  "no_new_autonomous_capability == true",
  "activation_mode_remains_dry_run_only == true",
  "live_execution_authorized == false",
  "wallet_mutation_authorized == false",
  "network_mutation_authorized == false",
  "private_key_access_authorized == false",
  "irreversible_network_action_authorized == false",
  "full_autonomy_claimed == false",
  "authority_expanded == false",
  "live_activation_preparation_allowed == false",
  "live_activation_allowed == false",
  "governance:pr-224-post-merge:v1:check == PASS",
  "governance:supervised-activation-dry-run-3-evidence:v1:check == PASS",
  "autonomous:network-activation-readiness:v2:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "supervised-activation-receipt-hash-semantics-v1",
  status: "sealed",
  main_commit: "10fce10",
  disk_sha256_is_governed_artifact_hash: true,
  receipt_sha256_is_legacy_internal_field: true,
  receipt_sha256_is_not_assumed_to_equal_disk_sha256: true,
  payload_sha256_reserved_for_future_runtime_semantics: true,
  dry_run_1_hash_distinction_preserved: true,
  dry_run_2_hash_distinction_preserved: true,
  dry_run_3_hash_distinction_preserved: true,
  governed_evidence_uses_disk_sha256: true,
  internal_receipt_sha256_recorded_separately: true,
  hash_mismatch_disclosure_required: true,
  false_hash_equivalence_claim_forbidden: true,
  no_new_autonomous_capability: true,
  activation_mode_remains_dry_run_only: true,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  private_key_access_authorized: false,
  irreversible_network_action_authorized: false,
  full_autonomy_claimed: false,
  authority_expanded: false,
  live_activation_preparation_allowed: false,
  live_activation_allowed: false
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

if (!Array.isArray(receipt.next_allowed_lanes)) fail("next_allowed_lanes must be array");
if (!receipt.next_allowed_lanes.includes("runtime receipt format v2")) fail("missing runtime receipt format v2 next lane");

console.log("PASS supervised-activation-receipt-hash-semantics-v1");
