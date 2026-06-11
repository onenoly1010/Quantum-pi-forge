#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

function fail(msg) {
  console.error("FAIL supervised-activation-dry-run-1-evidence-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_1_EVIDENCE_V1.md";
const receiptPath = "receipts/governance/supervised-activation-dry-run-1-evidence-v1.json";
const runtimePath = "runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-59-905Z.json";
const expectedSha = "3563ac7996b1f92479b7d95bfce3bad68632273a3bb1b65e1cc8d8277afd0941";

for (const p of [docPath, receiptPath, runtimePath]) {
  if (!fs.existsSync(p)) fail("missing " + p);
}

const actualSha = crypto.createHash("sha256").update(fs.readFileSync(runtimePath)).digest("hex");
if (actualSha !== expectedSha) fail("runtime sha mismatch: " + actualSha);

try {
  cp.execFileSync("git", ["check-ignore", "-q", runtimePath], {stdio:"ignore"});
} catch {
  fail("runtime receipt is not git-ignored");
}

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const required = [
  "main == origin/main == be89e4c",
  "runtime_receipt_path == " + runtimePath,
  "runtime_receipt_sha256 == " + expectedSha,
  "runtime_receipt_git_ignored == true",
  "activation_status == dry_run_complete",
  "activation_mode == dry-run-only",
  "live_execution_performed == false",
  "wallet_mutation_performed == false",
  "network_mutation_performed == false",
  "unsupervised_execution_performed == false",
  "does_not_commit_runtime_receipt == true",
  "does_not_expand_activation_authority == true",
  "does_not_claim_live_execution == true"
];

for (const x of required) {
  if (!doc.includes(x)) fail("document missing: " + x);
}

const expected = {
  receipt: "supervised-activation-dry-run-1-evidence-v1",
  status: "sealed",
  main_commit: "be89e4c",
  runtime_receipt_path: runtimePath,
  runtime_receipt_sha256: expectedSha,
  runtime_receipt_git_ignored: true,
  activation_command_executed: true,
  activation_status: "dry_run_complete",
  activation_mode: "dry-run-only",
  operator_intent_required: true,
  operator_supervision_required: true,
  live_execution_performed: false,
  wallet_mutation_performed: false,
  network_mutation_performed: false,
  unsupervised_execution_performed: false,
  persistent_state_mutation_performed: false,
  does_not_commit_runtime_receipt: true,
  does_not_expand_activation_authority: true,
  does_not_claim_live_execution: true
};

for (const [k, v] of Object.entries(expected)) {
  if (receipt[k] !== v) fail();
}

console.log("PASS supervised-activation-dry-run-1-evidence-v1");
