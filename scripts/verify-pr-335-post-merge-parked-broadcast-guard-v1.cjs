#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/governance/pr-335-post-merge-parked-broadcast-guard-v1.json";

function fail(msg) {
  console.error(`FAIL pr-335-post-merge-parked-broadcast-guard-v1: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (r.schema !== "qpf.governance.pr_335_post_merge_parked_broadcast_guard_v1") fail("schema mismatch");
if (r.pr !== 335) fail("PR mismatch");
if (r.canonical_branch !== "main") fail("canonical branch mismatch");

for (const p of [
  r.evidence.guard_receipt,
  r.evidence.prepared_message,
  r.evidence.send_refusal,
  r.evidence.guard_doc,
  r.evidence.guard_verifier
]) {
  if (!fs.existsSync(p)) fail(`missing evidence path: ${p}`);
}

for (const [key, value] of Object.entries(r.verified_checks || {})) {
  if (value !== "PASS") fail(`check not PASS: ${key}`);
}

const posture = r.posture || {};
if (posture.evidence_only !== true) fail("evidence_only mismatch");
if (posture.parked !== true) fail("parked mismatch");
if (posture.runtime_send_authorized !== false) fail("runtime_send_authorized must be false");
if (posture.discord_send_attempted !== false) fail("discord_send_attempted must be false");
if (posture.network_post_attempted !== false) fail("network_post_attempted must be false");
if (posture.deployments !== false) fail("deployments must be false");
if (posture.chain_actions !== false) fail("chain_actions must be false");
if (posture.keys_used !== false) fail("keys_used must be false");
if (posture.execution_receipt_present !== false) fail("execution receipt posture must be false");
if (posture.requires_explicit_unpark_receipt !== true) fail("unpark requirement missing");

if (fs.existsSync("receipts/execution/v2-mainnet-cutover-execution-v1.json")) {
  fail("execution receipt present");
}

console.log("PASS pr-335-post-merge-parked-broadcast-guard-v1");
console.log(`receipt=${receiptPath}`);
console.log(`merged_head=${r.merged_head_commit_short}`);
