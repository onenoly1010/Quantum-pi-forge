#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_OPERATOR_APPROVAL_GATE_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-cutover-operator-approval-gate-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_operator_approval_gate.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_OPERATOR_APPROVAL_GATE") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-operator-approval-gate-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "b7f90f2") fail("base main commit mismatch");

if (receipt.cutover_executed !== false) fail("cutover boundary mismatch");
if (receipt.deployment_executed !== false) fail("deployment boundary mismatch");
if (receipt.broadcast_executed !== false) fail("broadcast boundary mismatch");
if (receipt.operator_approval_currently_granted !== false) fail("approval must not be currently granted");
if (receipt.approval_required_before_cutover !== true) fail("approval must be required before cutover");

for (const [name, status] of Object.entries(receipt.baseline_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const approval = receipt.approval_requirements || {};
if (approval.explicit_operator_phrase_required !== true) fail("explicit phrase requirement mismatch");
if (approval.required_phrase !== "I APPROVE MAINNET CUTOVER EXECUTION FOR THIS EXACT HASHED COMMAND") fail("required phrase mismatch");
if (approval.exact_command_hash_required !== true) fail("command hash requirement mismatch");
if (approval.receipt_required !== true) fail("receipt requirement mismatch");
if (approval.approval_must_be_single_use !== true) fail("single-use approval requirement mismatch");
if (approval.approval_expires_on_any_command_change !== true) fail("command-change expiry mismatch");
if (approval.approval_expires_on_any_mainline_change !== true) fail("mainline-change expiry mismatch");
if (approval.approval_expires_on_any_failed_verifier !== true) fail("failed-verifier expiry mismatch");

for (const item of [
  "mainnet cutover",
  "contract deployment",
  "state-changing transaction",
  "external multichannel broadcast",
  "automatic retry",
  "secret printing",
  "runtime receipt commit"
]) {
  if (!receipt.forbidden_without_approval.includes(item)) fail(`missing forbidden action: ${item}`);
}

const claims = receipt.claim_boundary || {};
if (claims.operator_approval_gate_defined !== true) fail("operator gate claim mismatch");
if (claims.operator_approval_granted !== false) fail("operator approval claim mismatch");
if (claims.mainnet_cutover_ready_to_execute !== false) fail("ready-to-execute boundary mismatch");
if (claims.mainnet_cutover_complete !== false) fail("cutover complete boundary mismatch");
if (claims.deployment_complete !== false) fail("deployment boundary mismatch");
if (claims.broadcast_complete !== false) fail("broadcast boundary mismatch");
if (claims.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");

if (receipt.next_authorized_lane !== "mainnet-cutover-secret-completion-gate-v1") fail("next lane mismatch");

for (const term of [
  "SEALED_OPERATOR_APPROVAL_GATE",
  "b7f90f2",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "Operator approval is not currently granted",
  "I APPROVE MAINNET CUTOVER EXECUTION FOR THIS EXACT HASHED COMMAND",
  "single use",
  "bound to an exact command hash",
  "Forbidden Without Approval",
  "mainnet-cutover-secret-completion-gate-v1",
  "must not perform mainnet cutover"
]) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS mainnet-cutover-operator-approval-gate-v1");
