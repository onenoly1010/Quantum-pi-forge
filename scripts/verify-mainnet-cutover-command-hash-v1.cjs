#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

function fail(message) {
  console.error("FAIL mainnet-cutover-command-hash-v1: " + message);
  process.exit(1);
}

const receipt = JSON.parse(fs.readFileSync("receipts/autonomous/mainnet-cutover-command-hash-v1.json", "utf8"));
const doc = fs.readFileSync("docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md", "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_command_hash.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_COMMAND_HASH") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-command-hash-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "d4251bc") fail("base main mismatch");

const expected = crypto.createHash("sha256").update(receipt.command, "utf8").digest("hex");
if (receipt.command_sha256 !== expected) fail("command hash mismatch");
if (receipt.approval_must_reference_command_sha256 !== expected) fail("approval hash mismatch");

for (const key of [
  "command_executed",
  "cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_sent",
  "secret_values_printed",
  "operator_approval_currently_granted"
]) {
  if (receipt[key] !== false) fail(key + " must be false");
}

if (receipt.exact_command_hash_required !== true) fail("exact command hash must be required");

const claim = receipt.claim_boundary || {};
if (claim.command_hash_defined !== true) fail("command hash claim missing");
for (const key of [
  "command_executed",
  "mainnet_cutover_ready_to_execute",
  "mainnet_cutover_complete",
  "deployment_complete",
  "broadcast_complete",
  "unsupervised_autonomy_active"
]) {
  if (claim[key] !== false) fail("claim " + key + " must be false");
}

for (const term of [
  "SEALED_COMMAND_HASH",
  receipt.command,
  receipt.command_sha256,
  "No mainnet cutover",
  "No contract deployment",
  "No state-changing transaction",
  "No external multichannel broadcast",
  "No secret printing",
  "mainnet-cutover-final-operator-approval-v1"
]) {
  if (!doc.includes(term)) fail("doc missing term: " + term);
}

console.log("PASS mainnet-cutover-command-hash-v1");
