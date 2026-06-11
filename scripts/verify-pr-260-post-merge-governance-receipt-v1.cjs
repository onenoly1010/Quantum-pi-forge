#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

function fail(msg) {
  console.error("FAIL pr-260-post-merge-governance-receipt-v1: " + msg);
  process.exit(1);
}

function sha256File(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

function sh(cmd) {
  return cp.execSync(cmd, { encoding: "utf8" }).trim();
}

const receiptPath = "receipts/governance/pr-260-post-merge-governance-receipt-v1.json";
if (!fs.existsSync(receiptPath)) fail("missing receipt");

const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (r.schema !== "qpf.pr_260_post_merge_governance_receipt.v1") fail("bad schema");
if (r.pr !== 260) fail("bad PR number");
if (r.phase !== "PRE_CUTOVER_REVIEW_LOCK") fail("bad phase");
if (r.verification_anchor !== "canonical_local_surrogate_only") fail("bad verification anchor");

if (r.posture.non_executing !== true) fail("non_executing must be true");
for (const key of ["approval_granted", "cutover_executed", "deployment_executed", "broadcast_executed", "state_changing_transaction_executed"]) {
  if (r.posture[key] !== false) fail(key + " must be false");
}

const current = sh("git rev-parse HEAD");
try {
  sh("git merge-base --is-ancestor " + r.merged_main_commit + " " + current);
} catch {
  fail("merged main commit is not reachable from current HEAD");
}

const receiptHash = sha256File("receipts/governance/cross-platform-determinism-v1.json");
const manifestHash = sha256File("receipts/governance/cross-platform-determinism-manifest-v1.json");

if (r.anchored_receipts.cross_platform_determinism_receipt_sha256 !== receiptHash) fail("determinism receipt hash mismatch");
if (r.anchored_receipts.cross_platform_determinism_manifest_file_sha256 !== manifestHash) fail("determinism manifest hash mismatch");

console.log("PASS pr-260-post-merge-governance-receipt-v1");
