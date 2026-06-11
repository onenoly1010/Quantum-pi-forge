#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

function fail(msg) {
  console.error("FAIL supervised-activation-dry-run-2-evidence-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md";
const receiptPath = "receipts/governance/supervised-activation-dry-run-2-evidence-v1.json";
const runtimePath = "runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-22-917Z.json";
const expectedDiskSha = "fde9cd7f7029c844fc1f8ffe308ace886500d305159b2e57502e7053a521b477";
const expectedInternalSha = "4b285fc472355896c3b356d0ddc59ec666c3d74bcc22ce2437b8d13f93b4c863";

for (const p of [docPath, receiptPath, runtimePath]) {
  if (!fs.existsSync(p)) fail("missing " + p);
}

const actualDiskSha = crypto.createHash("sha256").update(fs.readFileSync(runtimePath)).digest("hex");
if (actualDiskSha !== expectedDiskSha) fail(`disk sha mismatch ${actualDiskSha}`);

const runtime = JSON.parse(fs.readFileSync(runtimePath, "utf8"));
if (runtime.receipt_sha256 !== expectedInternalSha) fail("internal receipt sha mismatch");
if (runtime.status !== "dry_run_complete") fail("runtime status mismatch");
if (runtime.mode !== "dry-run") fail("runtime mode mismatch");
if (runtime.live_requested !== false) fail("live_requested must be false");
if (runtime.private_key_present !== false) fail("private_key_present must be false");

const safety = runtime.safety || {};
const expectedSafety = {
  irreversible_network_action_executed: false,
  irreversible_network_action_refused: true,
  private_key_access_refused: true,
  operator_override_preserved: true,
  full_autonomy_claimed: false
};

for (const [k, v] of Object.entries(expectedSafety)) {
  if (safety[k] !== v) fail(`runtime.safety.${k} expected ${v} got ${safety[k]}`);
}

try {
  cp.execFileSync("git", ["check-ignore", "-q", runtimePath], { stdio: "ignore" });
} catch {
  fail("runtime receipt is not git-ignored");
}

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDoc = [
  "main == origin/main == 19cc746",
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
  "internal_receipt_sha256_recorded_as_receipt_field == true",
  "raw_runtime_receipt_committed == false",
  "runtime_receipt_remains_git_ignored == true"
];

for (const x of requiredDoc) {
  if (!doc.includes(x)) fail("document missing: " + x);
}

const expected = {
  receipt: "supervised-activation-dry-run-2-evidence-v1",
  status: "sealed",
  main_commit: "19cc746",
  runtime_receipt_path: runtimePath,
  runtime_receipt_disk_sha256: expectedDiskSha,
  runtime_receipt_internal_sha256: expectedInternalSha,
  runtime_receipt_git_ignored: true,
  activation_command_executed: true,
  activation_status: "dry_run_complete",
  activation_mode: "dry-run",
  live_requested: false,
  private_key_present: false,
  irreversible_network_action_executed: false,
  irreversible_network_action_refused: true,
  private_key_access_refused: true,
  operator_override_preserved: true,
  full_autonomy_claimed: false,
  readiness_v2_required: true,
  runner_implementation_frozen: true,
  disk_sha256_is_governed_artifact_hash: true,
  internal_receipt_sha256_recorded_as_receipt_field: true,
  raw_runtime_receipt_committed: false,
  runtime_receipt_remains_git_ignored: true
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail(`receipt.${k} expected ${JSON.stringify(v)} got ${JSON.stringify(receipt[k])}`);
}

console.log("PASS supervised-activation-dry-run-2-evidence-v1");
