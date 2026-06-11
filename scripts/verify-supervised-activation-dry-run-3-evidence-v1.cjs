#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

function fail(msg) {
  console.error("FAIL supervised-activation-dry-run-3-evidence-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_3_EVIDENCE_V1.md";
const receiptPath = "receipts/governance/supervised-activation-dry-run-3-evidence-v1.json";

if (!fs.existsSync(docPath)) fail("missing " + docPath);
if (!fs.existsSync(receiptPath)) fail("missing " + receiptPath);

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == a48716f",
  "runtime_receipt_path == runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-12-949Z.json",
  "runtime_receipt_disk_sha256 == bc53eda7675ef47d044626e561168e6b8ef4fedcc9faac52295c0915d1793200",
  "runtime_receipt_internal_sha256 == 92db5db439fbc5f01d9125d0864880ed8de641f438173ae8ddcdd63e2afd52ce",
  "runtime_receipt_committed == false",
  "runtime_receipt_git_ignored == true",
  "activation_status == dry_run_complete",
  "activation_mode == dry-run",
  "live_requested == false",
  "private_key_present == false",
  "irreversible_network_action_executed == false",
  "irreversible_network_action_refused == true",
  "private_key_access_refused == true",
  "operator_override_preserved == true",
  "full_autonomy_claimed == false",
  "disk_sha256_is_governed_artifact_hash == true",
  "internal_receipt_sha256_is_recorded_as_receipt_field == true",
  "hash_mismatch_disclosed == true",
  "autonomous:network-activation-readiness:v2:check == PASS",
  "build == PASS"
];

for (const fragment of requiredDoc) {
  if (!doc.includes(fragment)) fail("document missing: " + fragment);
}

const expected = {
  receipt: "supervised-activation-dry-run-3-evidence-v1",
  status: "sealed",
  main_commit: "a48716f",
  runtime_receipt_path: "runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-12-949Z.json",
  runtime_receipt_disk_sha256: "bc53eda7675ef47d044626e561168e6b8ef4fedcc9faac52295c0915d1793200",
  runtime_receipt_internal_sha256: "92db5db439fbc5f01d9125d0864880ed8de641f438173ae8ddcdd63e2afd52ce",
  runtime_receipt_committed: false,
  runtime_receipt_git_ignored: true,
  activation_status: "dry_run_complete",
  activation_mode: "dry-run",
  live_requested: false,
  private_key_present: false,
  irreversible_network_action_executed: false,
  irreversible_network_action_refused: true,
  private_key_access_refused: true,
  operator_override_preserved: true,
  full_autonomy_claimed: false,
  disk_sha256_is_governed_artifact_hash: true,
  internal_receipt_sha256_is_recorded_as_receipt_field: true,
  hash_mismatch_disclosed: true,
  wallet_mutation_occurred: false,
  network_mutation_occurred: false,
  private_key_accessed: false
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

const runtimePath = receipt.runtime_receipt_path;
if (!fs.existsSync(runtimePath)) fail("runtime receipt missing locally: " + runtimePath);

const runtimeRaw = fs.readFileSync(runtimePath);
const diskSha = crypto.createHash("sha256").update(runtimeRaw).digest("hex");
if (diskSha !== receipt.runtime_receipt_disk_sha256) {
  fail(`runtime disk sha mismatch expected ${receipt.runtime_receipt_disk_sha256} got ${diskSha}`);
}

const runtime = JSON.parse(runtimeRaw.toString("utf8"));
if (runtime.status !== "dry_run_complete") fail("runtime.status mismatch");
if (runtime.mode !== "dry-run") fail("runtime.mode mismatch");
if (runtime.live_requested !== false) fail("runtime.live_requested mismatch");
if (runtime.private_key_present !== false) fail("runtime.private_key_present mismatch");
if (runtime.receipt_sha256 !== receipt.runtime_receipt_internal_sha256) fail("runtime internal sha mismatch");
if (runtime.safety.irreversible_network_action_executed !== false) fail("runtime irreversible action executed");
if (runtime.safety.irreversible_network_action_refused !== true) fail("runtime irreversible action not refused");
if (runtime.safety.private_key_access_refused !== true) fail("runtime private key access not refused");
if (runtime.safety.operator_override_preserved !== true) fail("runtime operator override not preserved");
if (runtime.safety.full_autonomy_claimed !== false) fail("runtime full autonomy claimed");

try {
  cp.execFileSync("git", ["check-ignore", "-q", runtimePath], { stdio: "ignore" });
} catch {
  fail("runtime receipt is not git-ignored: " + runtimePath);
}

console.log("PASS supervised-activation-dry-run-3-evidence-v1");
