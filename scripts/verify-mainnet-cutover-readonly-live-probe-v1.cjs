#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_READONLY_LIVE_PROBE_V1.md";

function fail(msg) {
  console.error();
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing doc");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_readonly_live_probe.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_READONLY_LIVE_PROBE") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-readonly-live-probe-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "b9568e0") fail("base main mismatch");
if (receipt.runtime_receipt_committed !== false) fail("runtime receipt must not be committed");
if (!/^[a-f0-9]{64}$/.test(receipt.runtime_receipt_sha256)) fail("runtime sha256 invalid");

for (const key of [
  "cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_sent",
  "secret_values_printed"
]) {
  if (receipt[key] !== false) fail();
}

for (const method of ["eth_chainId", "eth_blockNumber"]) {
  if (!receipt.probe_scope.includes(method)) fail();
  if (!doc.includes(method)) fail();
}

const claims = receipt.claim_boundary || {};
if (claims.readonly_live_probe_defined !== true) fail("probe defined claim mismatch");
if (claims.readonly_live_probe_executed !== true) fail("probe executed claim mismatch");

for (const key of [
  "mainnet_cutover_ready_to_execute",
  "mainnet_cutover_complete",
  "deployment_complete",
  "broadcast_complete",
  "unsupervised_autonomy_active"
]) {
  if (claims[key] !== false) fail();
}

if (receipt.next_authorized_lane !== "mainnet-cutover-command-hash-v1") fail("next lane mismatch");

for (const term of [
  "SEALED_READONLY_LIVE_PROBE",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "No state-changing transaction was sent",
  "No secret values were printed",
  
  "mainnet-cutover-command-hash-v1",
  "must not perform mainnet cutover"
]) {
  if (!doc.includes(term)) fail();
}

console.log("PASS mainnet-cutover-readonly-live-probe-v1");
