#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function fail(msg) {
  console.error("FAIL live-canary-gate-v1:", msg);
  process.exit(1);
}

const ROOT = process.cwd();
const RECEIPT_PATH = path.join(ROOT, "receipts/runtime/live-canary-gate-v1.json");

if (!fs.existsSync(RECEIPT_PATH)) fail("missing receipt: receipts/runtime/live-canary-gate-v1.json");

const receipt = JSON.parse(fs.readFileSync(RECEIPT_PATH, "utf8"));

if (receipt.schema !== "qpf.live_canary_gate.v1") fail("bad schema");
if (receipt.live_scope !== "read_only_chain_canary") fail("bad live_scope");
if (receipt.chain_id_expected !== 16661) fail("bad chain_id_expected");
if (receipt.rpc_checked !== true) fail("rpc not checked");
if (receipt.wallet_required !== false) fail("wallet must not be required");
if (receipt.private_key_required !== false) fail("private key must not be required");
if (receipt.funding_required !== false) fail("funding must not be required");
if (receipt.transaction_broadcast_allowed !== false) fail("broadcast must not be allowed");
if (receipt.storage_upload_allowed !== false) fail("storage upload must not be allowed");
if (receipt.compute_inference_allowed !== false) fail("compute inference must not be allowed");
if (receipt.operator_approval_required_for_next_gate !== true) fail("operator approval required for next gate");
if (!Array.isArray(receipt.next_live_lanes) || receipt.next_live_lanes.length === 0) fail("next live lanes missing");

const docPath = path.join(ROOT, "docs/governance/LIVE_CANARY_GATE_V1.md");
if (!fs.existsSync(docPath)) fail("missing governance doc: docs/governance/LIVE_CANARY_GATE_V1.md");

console.log("PASS live-canary-gate-v1");
console.log("LIVE_SCOPE " + receipt.live_scope);
console.log("NEXT_LIVE_LANES " + receipt.next_live_lanes.join(","));