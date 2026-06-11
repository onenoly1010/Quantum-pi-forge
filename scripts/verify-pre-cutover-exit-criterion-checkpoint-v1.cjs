#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

const receiptPath = "receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json";

function fail(msg) {
  console.error("FAIL pre-cutover-exit-criterion-checkpoint-v1: " + msg);
  process.exit(1);
}

function sha256File(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

function sh(cmd) {
  return cp.execSync(cmd, { encoding: "utf8" }).trim();
}

function runCheck(label, cmd) {
  try {
    sh(cmd);
  } catch {
    fail("delegated check failed: " + label);
  }
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");

const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (r.schema !== "qpf.pre_cutover_exit_criterion_checkpoint.v1") fail("bad schema");
if (r.checkpoint !== "pre-cutover-exit-criterion-checkpoint-v1") fail("bad checkpoint id");
if (r.exit_criterion_closed !== "cross_platform_determinism_receipt") fail("bad exit criterion");
if (r.exit_criterion_index !== 1) fail("bad exit criterion index");
if (r.phase !== "PRE_CUTOVER_REVIEW_LOCK") fail("bad phase");
if (r.verification_anchor !== "canonical_local_surrogate_only") fail("bad verification anchor");
if (r.review_window_active !== true) fail("review window must be active");

if (r.posture.non_executing !== true) fail("non_executing must be true");
for (const key of [
  "approval_granted",
  "cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
]) {
  if (r.posture[key] !== false) fail(key + " must be false");
}

if (r.exit_criteria_status.cross_platform_determinism_receipt !== "closed") {
  fail("exit criterion #1 must be closed");
}

const current = sh("git rev-parse HEAD");
for (const link of r.canonical_chain) {
  try {
    sh("git merge-base --is-ancestor " + link.commit + " " + current);
  } catch {
    fail("canonical chain commit " + link.short_commit + " is not reachable from HEAD");
  }
}

try {
  sh("git merge-base --is-ancestor " + r.anchored_at_commit + " " + current);
} catch {
  fail("anchored_at_commit is not reachable from current HEAD");
}

const anchored = r.anchored_receipts;
const hashes = {
  pre_cutover_review_window_sha256: sha256File("receipts/rcpt-pre-cutover-review-window-v1.json"),
  pr_258_post_merge_receipt_sha256: sha256File("receipts/governance/pr-258-post-merge-governance-receipt-v1.json"),
  cross_platform_determinism_receipt_sha256: sha256File("receipts/governance/cross-platform-determinism-v1.json"),
  cross_platform_determinism_manifest_file_sha256: sha256File("receipts/governance/cross-platform-determinism-manifest-v1.json"),
  pr_260_post_merge_receipt_sha256: sha256File("receipts/governance/pr-260-post-merge-governance-receipt-v1.json"),
  pr_260_post_merge_verifier_sha256: sha256File("scripts/verify-pr-260-post-merge-governance-receipt-v1.cjs")
};

for (const [key, value] of Object.entries(anchored)) {
  if (hashes[key] !== value) fail("anchored hash mismatch: " + key);
}

const verifierSource = fs.readFileSync("scripts/verify-pr-260-post-merge-governance-receipt-v1.cjs", "utf8");
if (!verifierSource.includes("git merge-base --is-ancestor")) {
  fail("pr-260 post-merge verifier must use historical ancestor check");
}
if (verifierSource.includes("current !== r.merged_main_commit") || verifierSource.includes("current != r.merged_main_commit")) {
  fail("pr-260 post-merge verifier must not require HEAD equality");
}

runCheck("pre-cutover-review-window", "npm run governance:pre-cutover-review-window:v1:check");
runCheck("pr-258-post-merge", "npm run governance:pr-258-post-merge:v1:check");
runCheck("cross-platform-determinism", "npm run governance:cross-platform-determinism:v1:check");
runCheck("pr-260-post-merge", "npm run governance:pr-260-post-merge:v1:check");

console.log("PASS pre-cutover-exit-criterion-checkpoint-v1");