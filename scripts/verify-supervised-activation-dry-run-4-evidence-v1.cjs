#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/supervised-activation-dry-run-4-evidence-v1.json";
const docPath = "docs/autonomous/SUPERVISED_ACTIVATION_DRY_RUN_4_EVIDENCE_V1.md";

function fail(message) {
  console.error(`FAIL supervised-activation-dry-run-4-evidence-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.supervised_activation_dry_run_4_evidence.v1") fail("schema mismatch");
if (receipt.status !== "SEALED") fail("status mismatch");
if (receipt.branch !== "autonomous/supervised-activation-dry-run-4-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "5a57a4c") fail("base commit mismatch");
if (receipt.activation_mode !== "supervised_dry_run") fail("activation mode mismatch");

const runtime = receipt.runtime_receipt || {};
if (runtime.path !== "runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-14-10-215Z.json") fail("runtime path mismatch");
if (runtime.committed !== false) fail("runtime receipt must not be committed");
if (runtime.sha256 !== "8bace7a932b3d488f4d783264954d243173bdb89191dc5f9a9596d8265b2d2bf") fail("runtime sha mismatch");

if (receipt.command_result?.script !== "autonomous:supervised-activation:v1") fail("command script mismatch");
if (receipt.command_result?.status !== "dry_run_complete") fail("command status mismatch");

for (const [name, status] of Object.entries(receipt.baseline_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const press = receipt.press_agent_boundary || {};
if (press.discord_only !== true) fail("discord-only boundary mismatch");
if (press.telegram_ready !== false) fail("telegram boundary mismatch");
if (press.twitter_ready !== false) fail("twitter boundary mismatch");
if (press.full_multichannel_live_claim !== false) fail("multichannel claim boundary mismatch");

const claims = receipt.claim_boundary || {};
if (claims.supervised_dry_run_4_complete !== true) fail("dry-run completion claim mismatch");
if (claims.runtime_receipt_hash_recorded !== true) fail("runtime hash claim mismatch");
if (claims.runtime_receipt_committed !== false) fail("runtime committed claim mismatch");
if (claims.mainnet_cutover_complete !== false) fail("mainnet cutover boundary mismatch");
if (claims.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");
if (claims.external_multichannel_broadcast_proven !== false) fail("broadcast boundary mismatch");

const requiredDocTerms = [
  "5a57a4c",
  "supervised-activation-v1-2026-06-11T07-14-10-215Z.json",
  "8bace7a932b3d488f4d783264954d243173bdb89191dc5f9a9596d8265b2d2bf",
  "dry_run_complete",
  "Runtime files remain transient and must not be committed",
  "Press Agent remains Discord-only",
  "does not claim",
  "mainnet cutover complete",
  "unsupervised autonomy active"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS supervised-activation-dry-run-4-evidence-v1");
