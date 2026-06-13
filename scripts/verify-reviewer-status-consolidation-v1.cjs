#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/reviewer-status-consolidation-v1.json";
const docPath = "docs/governance/REVIEWER_STATUS_CONSOLIDATION_V1.md";

function fail(msg) {
  console.error(`FAIL reviewer-status-consolidation-v1: ${msg}`);
  process.exit(1);
}

function sha256(path) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.governance.reviewer_status_consolidation_v1") fail("schema mismatch");
if (receipt.canonical_branch !== "main") fail("canonical branch mismatch");
if (!receipt.canonical_main || !receipt.canonical_main_short) fail("missing canonical main");
if (receipt.document.path !== docPath) fail("doc path mismatch");
if (receipt.document.sha256 !== sha256(docPath)) fail("doc sha256 mismatch");

for (const [key, value] of Object.entries(receipt.verified_checks || {})) {
  if (value !== "PASS") fail(`verified check not PASS: ${key}`);
}

for (const [key, path] of Object.entries(receipt.evidence_paths || {})) {
  if (!fs.existsSync(path)) fail(`missing evidence path ${key}: ${path}`);
}

const posture = receipt.posture || {};
if (posture.evidence_only !== true) fail("evidence_only must be true");
if (posture.execution_receipt_present !== false) fail("execution receipt posture must be false");
if (posture.send_authorized !== false) fail("send_authorized must be false");
if (posture.network_post_attempted !== false) fail("network_post_attempted must be false");
if (posture.discord_send_attempted !== false) fail("discord_send_attempted must be false");
if (posture.deployments !== false) fail("deployments must be false");
if (posture.chain_actions !== false) fail("chain_actions must be false");
if (posture.keys_used !== false) fail("keys_used must be false");
if (posture.unparked !== false) fail("unparked must be false");

for (const needle of [
  "cross-platform-determinism-v1=PASS",
  "current-public-status-handoff-v1=PASS",
  "current-funder-audit-handoff-v1=PASS",
  "targeted-review-outreach-receipt-v1=PASS",
  "press-agent-local-runtime-health-v2=PASS",
  "pr-333-post-merge-press-agent-local-runtime-health-v2=PASS",
  "press-agent-parked-broadcast-guard-v1=PASS",
  "pr-335-post-merge-parked-broadcast-guard-v1=PASS",
  "press-agent-readonly-readiness-v1=PASS",
  "discord-webhook-diagnostic-v1=PASS",
  "EVIDENCE_ONLY=true",
  "EXECUTION_RECEIPT_PRESENT=false",
  "SEND_AUTHORIZED=false",
  "NETWORK_POST_ATTEMPTED=false",
  "DISCORD_SEND_ATTEMPTED=false",
  "DEPLOYMENTS=false",
  "CHAIN_ACTIONS=false",
  "KEYS_USED=false",
  "UNPARKED=false"
]) {
  if (!doc.includes(needle)) fail(`doc missing ${needle}`);
}

if (fs.existsSync("receipts/execution/v2-mainnet-cutover-execution-v1.json")) {
  fail("execution receipt present");
}

console.log("PASS reviewer-status-consolidation-v1");
console.log(`receipt=${receiptPath}`);
console.log(`document_sha256=${receipt.document.sha256}`);
console.log(`canonical_main=${receipt.canonical_main_short}`);
