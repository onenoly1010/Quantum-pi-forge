#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-gate-definition-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_GATE_DEFINITION_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-cutover-gate-definition-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_gate_definition.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_GATE_DEFINITION") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-gate-definition-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "939f0b5") fail("base main commit mismatch");

if (receipt.cutover_executed !== false) fail("cutover boundary mismatch");
if (receipt.deployment_executed !== false) fail("deployment boundary mismatch");
if (receipt.broadcast_executed !== false) fail("broadcast boundary mismatch");

for (const [name, status] of Object.entries(receipt.baseline_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const gates = receipt.go_no_go_gates || {};
for (const gate of [
  "gate_0_mainline_clean",
  "gate_1_local_verifiers_green",
  "gate_2_secret_completion",
  "gate_3_operator_approval",
  "gate_4_rollback_plan",
  "gate_5_dry_run_replay",
  "gate_6_live_surface_probe",
  "gate_7_cutover_command_hash"
]) {
  if (!gates[gate] || gates[gate].required !== true) fail(`missing required ${gate}`);
}

const rollback = receipt.rollback_requirements || {};
if (rollback.required_before_cutover !== true) fail("rollback must be required before cutover");

for (const item of [
  "stop condition",
  "revert command or disable path",
  "post-rollback verification",
  "operator notification",
  "receipt path",
  "no-secret logging policy"
]) {
  if (!rollback.must_define.includes(item)) fail(`rollback missing ${item}`);
}

for (const item of [
  "secret completion receipt",
  "operator approval receipt",
  "rollback plan receipt",
  "read-only live surface probe receipt",
  "cutover command hash receipt"
]) {
  if (!receipt.blocked_until.includes(item)) fail(`blocked_until missing ${item}`);
}

const claims = receipt.claim_boundary || {};
if (claims.gate_definition_complete !== true) fail("gate definition claim mismatch");
if (claims.mainnet_cutover_ready_to_execute !== false) fail("ready-to-execute boundary mismatch");
if (claims.mainnet_cutover_complete !== false) fail("cutover complete boundary mismatch");
if (claims.deployment_complete !== false) fail("deployment complete boundary mismatch");
if (claims.broadcast_complete !== false) fail("broadcast complete boundary mismatch");
if (claims.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");

if (receipt.next_authorized_lane !== "mainnet-cutover-rollback-plan-v1") fail("next lane mismatch");

for (const term of [
  "SEALED_GATE_DEFINITION",
  "939f0b5",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "Gate 0",
  "Gate 1",
  "Gate 2",
  "Gate 3",
  "Gate 4",
  "Gate 5",
  "Gate 6",
  "Gate 7",
  "mainnet-cutover-rollback-plan-v1",
  "must not perform mainnet cutover"
]) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS mainnet-cutover-gate-definition-v1");
