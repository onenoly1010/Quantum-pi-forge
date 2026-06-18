#!/usr/bin/env node
const fs = require("fs");

const DOC = "docs/governance/0G_COMPUTE_INFERENCE_EVIDENCE_DRY_RUN_GATE_V1.md";
const RECEIPT = "receipts/runtime/0g-compute-inference-evidence-dry-run-gate-v1.json";

function fail(msg) {
  console.error("FAIL 0g-compute-inference-evidence-dry-run-gate-v1: " + msg);
  process.exit(1);
}

// 1. Required files exist
if (!fs.existsSync(DOC)) fail("missing doc: " + DOC);
if (!fs.existsSync(RECEIPT)) fail("missing receipt: " + RECEIPT);

// 2. Receipt schema and required assertions
const receipt = JSON.parse(fs.readFileSync(RECEIPT, "utf8"));

if (receipt.schema !== "qpf.0g_compute_inference_evidence_dry_run_gate.v1") {
  fail("incorrect schema");
}
if (receipt.status !== "sealed") fail("status must be sealed");

const requiredTrue = [
  "compute_path_reviewed",
  "router_recommended_for_qpf",
  "direct_requires_wallet_signing",
  "tee_verification_path_identified"
];

const requiredFalse = [
  "private_key_requested",
  "wallet_signature_requested",
  "funding_attempted",
  "provider_transfer_attempted",
  "inference_request_attempted",
  "live_execution"
];

for (const key of requiredTrue) {
  if (receipt[key] !== true) fail("receipt." + key + " must be true");
}
for (const key of requiredFalse) {
  if (receipt[key] !== false) fail("receipt." + key + " must be false");
}

if (receipt.network !== "0G Aristotle Mainnet") fail("network must be 0G Aristotle Mainnet");
if (receipt.chain_id_expected !== 16661) fail("chain_id_expected must be 16661");
if (!Array.isArray(receipt.blocked_commands) || receipt.blocked_commands.length < 3) {
  fail("blocked_commands must include at least 3 entries");
}

// 3. Doc contains required assertions
const doc = fs.readFileSync(DOC, "utf8");

const requiredDocTerms = [
  "non-executing",
  "Router",
  "Direct",
  "private key",
  "wallet signing",
  "TEE verification",
  "0g-compute-cli login",
  "0g-compute-cli deposit",
  "0g-compute-cli transfer-fund"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail("document missing required term: " + term);
}

console.log("PASS 0g-compute-inference-evidence-dry-run-gate-v1");
console.log("RECEIPT " + RECEIPT);
console.log("DOC " + DOC);