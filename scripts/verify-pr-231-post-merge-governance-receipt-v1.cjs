#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/governance/pr-231-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_231.md";

function fail(message) {
  console.error(`FAIL pr-231-post-merge-governance-receipt-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.governance.pr_231_post_merge_receipt.v1") fail("schema mismatch");
if (receipt.status !== "SEALED") fail("status mismatch");
if (receipt.pr !== 231) fail("PR mismatch");
if (receipt.merge_method !== "squash") fail("merge method mismatch");
if (receipt.bypass_used !== false) fail("bypass boundary mismatch");
if (receipt.source_branch_deleted !== true) fail("source branch deletion mismatch");
if (receipt.main_commit_after_merge !== "e79e82a") fail("main commit mismatch");
if (receipt.previous_main_commit !== "5a57a4c") fail("previous main commit mismatch");

const evidence = receipt.dry_run_4_evidence || {};
if (evidence.runtime_receipt_path !== "runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-14-10-215Z.json") fail("runtime path mismatch");
if (evidence.runtime_receipt_committed !== false) fail("runtime committed boundary mismatch");
if (evidence.runtime_receipt_sha256 !== "8bace7a932b3d488f4d783264954d243173bdb89191dc5f9a9596d8265b2d2bf") fail("runtime sha mismatch");

for (const [name, status] of Object.entries(receipt.post_merge_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const boundary = receipt.claim_boundary || {};
if (boundary.supervised_dry_run_4_landed_on_main !== true) fail("dry-run landed boundary mismatch");
if (boundary.mainnet_cutover_complete !== false) fail("mainnet cutover boundary mismatch");
if (boundary.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");
if (boundary.external_multichannel_broadcast_proven !== false) fail("broadcast boundary mismatch");
if (boundary.press_agent_discord_only_boundary_preserved !== true) fail("press agent boundary mismatch");

if (receipt.next_authorized_lane !== "mainnet-cutover-readiness-v1") fail("next lane mismatch");

const requiredDocTerms = [
  "e79e82a",
  "5a57a4c",
  "supervised-activation-v1",
  "b0faa80",
  "8bace7a932b3d488f4d783264954d243173bdb89191dc5f9a9596d8265b2d2bf",
  "No bypass was used",
  "mainnet cutover complete",
  "unsupervised autonomy active",
  "mainnet-cutover-readiness-v1",
  "must not perform mainnet cutover"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS pr-231-post-merge-governance-receipt-v1");
