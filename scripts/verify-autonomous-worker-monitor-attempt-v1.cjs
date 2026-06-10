#!/usr/bin/env node
const fs = require("fs");

const docPath = "docs/autonomous/AUTONOMOUS_WORKER_MONITOR_ATTEMPT_V1.md";
const receiptPath = "receipts/autonomous/autonomous-worker-monitor-attempt-v1.json";

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

if (!fs.existsSync(docPath)) fail("missing worker monitor attempt doc");
if (!fs.existsSync(receiptPath)) fail("missing worker monitor attempt receipt");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.schema !== "autonomous-worker-monitor-attempt-v1") fail("wrong schema");
if (receipt.status !== "sealed") fail("receipt not sealed");

const claims = receipt.claims || {};

const requiredTrue = [
  "worker_monitor_attempt_recorded",
  "local_observation_only",
  "operator_override_required",
  "receipt_written"
];

const requiredFalse = [
  "protected_state_mutated",
  "autonomous_push_performed",
  "autonomous_merge_performed",
  "wallet_or_chain_transaction_performed",
  "full_autonomous_network_live",
  "false_authority_claimed",
  "hosted_ci_authoritative"
];

for (const key of requiredTrue) {
  if (claims[key] !== true) fail(`${key} must be true`);
}

for (const key of requiredFalse) {
  if (claims[key] !== false) fail(`${key} must be false`);
}

if (!doc.includes("This receipt does not claim that a full autonomous network is live.")) {
  fail("doc missing full autonomy non-claim");
}

if (!doc.includes("protected_state_mutated == false")) {
  fail("doc missing protected state boundary");
}

if (!doc.includes("autonomous_merge_performed == false")) {
  fail("doc missing autonomous merge boundary");
}

console.log("PASS autonomous-worker-monitor-attempt-v1");
