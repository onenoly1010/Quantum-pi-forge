#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/press-agent/parked-broadcast-guard-v1.json";
const preparedPath = "receipts/press-agent/parked-broadcast-guard-v1-prepared-message.json";
const refusalPath = "receipts/press-agent/parked-broadcast-guard-v1-send-refusal.json";
const docPath = "docs/press-agent/PARKED_BROADCAST_GUARD_V1.md";

function fail(msg) {
  console.error(`FAIL press-agent-parked-broadcast-guard-v1: ${msg}`);
  process.exit(1);
}

function readJson(path) {
  if (!fs.existsSync(path)) fail(`missing ${path}`);
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function sha256(path) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

const receipt = readJson(receiptPath);
const prepared = readJson(preparedPath);
const refusal = readJson(refusalPath);

if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.press_agent.parked_broadcast_guard_v1") fail("receipt schema mismatch");
if (prepared.schema !== "qpf.press_agent.parked_broadcast_guard_v1.prepared_message") fail("prepared schema mismatch");
if (refusal.schema !== "qpf.press_agent.parked_broadcast_guard_v1.send_refusal") fail("refusal schema mismatch");

if (receipt.canonical_branch !== "main") fail("canonical branch mismatch");

if (receipt.prepared_message.path !== preparedPath) fail("prepared path mismatch");
if (receipt.send_refusal.path !== refusalPath) fail("refusal path mismatch");

if (sha256(preparedPath) !== receipt.prepared_message.sha256) fail("prepared sha256 mismatch");
if (sha256(refusalPath) !== receipt.send_refusal.sha256) fail("refusal sha256 mismatch");

if (prepared.mode !== "manual_review_only") fail("prepared mode mismatch");
if (prepared.send_allowed !== false) fail("prepared send_allowed must be false");
if (prepared.network_post_allowed !== false) fail("prepared network_post_allowed must be false");
if (prepared.discord_webhook_delivery_allowed !== false) fail("prepared discord delivery must be false");
if (prepared.requires_explicit_unpark_receipt !== true) fail("prepared unpark requirement missing");

if (refusal.result !== "REFUSED") fail("refusal result mismatch");
if (refusal.send_attempted !== false) fail("refusal send_attempted must be false");
if (refusal.network_post_attempted !== false) fail("refusal network_post_attempted must be false");
if (refusal.discord_webhook_called !== false) fail("refusal discord_webhook_called must be false");
if (refusal.deployments !== false) fail("refusal deployments must be false");
if (refusal.chain_actions !== false) fail("refusal chain_actions must be false");
if (refusal.keys_used !== false) fail("refusal keys_used must be false");
if (refusal.execution_receipt_present !== false) fail("refusal execution receipt must be false");

for (const [key, value] of Object.entries(receipt.verified_inputs || {})) {
  if (value !== "PASS") fail(`verified input not PASS: ${key}`);
}

const posture = receipt.posture || {};
if (posture.evidence_only !== true) fail("evidence_only posture mismatch");
if (posture.parked !== true) fail("parked posture mismatch");
if (posture.runtime_send_authorized !== false) fail("runtime_send_authorized must be false");
if (posture.discord_send_attempted !== false) fail("discord_send_attempted must be false");
if (posture.network_post_attempted !== false) fail("network_post_attempted must be false");
if (posture.deployments !== false) fail("deployments must be false");
if (posture.chain_actions !== false) fail("chain_actions must be false");
if (posture.keys_used !== false) fail("keys_used must be false");
if (posture.execution_receipt_present !== false) fail("execution receipt posture must be false");
if (posture.requires_explicit_unpark_receipt !== true) fail("unpark receipt requirement missing");

for (const needle of [
  "PARKED=true",
  "SEND_ALLOWED=false",
  "RUNTIME_SEND_AUTHORIZED=false",
  "DISCORD_SEND_ATTEMPTED=false",
  "NETWORK_POST_ATTEMPTED=false",
  "DEPLOYMENTS=false",
  "CHAIN_ACTIONS=false",
  "KEYS_USED=false",
  "EXECUTION_RECEIPT_PRESENT=false",
  "REQUIRES_EXPLICIT_UNPARK_RECEIPT=true"
]) {
  if (!doc.includes(needle)) fail(`doc missing ${needle}`);
}

if (fs.existsSync("receipts/execution/v2-mainnet-cutover-execution-v1.json")) {
  fail("execution receipt present");
}

console.log("PASS press-agent-parked-broadcast-guard-v1");
console.log(`receipt=${receiptPath}`);
console.log(`canonical_main=${receipt.canonical_main_short}`);
console.log(`prepared_sha256=${receipt.prepared_message.sha256}`);
console.log(`refusal_sha256=${receipt.send_refusal.sha256}`);
