#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-rollback-plan-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_ROLLBACK_PLAN_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-cutover-rollback-plan-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_rollback_plan.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_ROLLBACK_PLAN") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-rollback-plan-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "2da4ebe") fail("base main commit mismatch");

if (receipt.cutover_executed !== false) fail("cutover boundary mismatch");
if (receipt.deployment_executed !== false) fail("deployment boundary mismatch");
if (receipt.broadcast_executed !== false) fail("broadcast boundary mismatch");

for (const [name, status] of Object.entries(receipt.baseline_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const plan = receipt.rollback_plan || {};
if (plan.required_before_cutover !== true) fail("rollback must be required before cutover");

for (const item of [
  "any verifier fails",
  "working tree becomes dirty during preflight",
  "unexpected network mutation is detected",
  "secret presence check fails",
  "operator approval receipt is missing",
  "runtime receipt cannot be written",
  "broadcast target is unavailable",
  "deployment verification fails"
]) {
  if (!plan.stop_conditions.includes(item)) fail(`missing stop condition: ${item}`);
}

for (const item of [
  "stop cutover sequence",
  "do not retry automatically",
  "preserve logs",
  "write runtime rollback observation receipt",
  "return to main without committing runtime artifacts",
  "run local verifier stack"
]) {
  if (!plan.immediate_actions.includes(item)) fail(`missing immediate action: ${item}`);
}

for (const item of [
  "force push",
  "secret printing",
  "unreviewed deploy retry",
  "unbounded broadcast retry",
  "mainnet transaction retry without new operator approval",
  "committing runtime receipts"
]) {
  if (!plan.forbidden_actions.includes(item)) fail(`missing forbidden action: ${item}`);
}

const policy = plan.receipt_policy || {};
if (policy.runtime_receipts_directory !== "runtime/autonomous/runs/") fail("runtime receipt directory mismatch");
if (policy.runtime_receipts_committed !== false) fail("runtime receipts must not be committed");
if (policy.governed_summary_required_for_commit !== true) fail("governed summary requirement mismatch");
if (policy.no_secret_logging !== true) fail("no secret logging policy mismatch");

const claims = receipt.claim_boundary || {};
if (claims.rollback_plan_defined !== true) fail("rollback plan claim mismatch");
if (claims.mainnet_cutover_ready_to_execute !== false) fail("ready-to-execute boundary mismatch");
if (claims.mainnet_cutover_complete !== false) fail("cutover complete boundary mismatch");
if (claims.deployment_complete !== false) fail("deployment complete boundary mismatch");
if (claims.broadcast_complete !== false) fail("broadcast complete boundary mismatch");
if (claims.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");

if (receipt.next_authorized_lane !== "mainnet-cutover-operator-approval-gate-v1") fail("next lane mismatch");

for (const term of [
  "SEALED_ROLLBACK_PLAN",
  "2da4ebe",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "Stop Conditions",
  "Immediate Actions",
  "Post-Stop Verification",
  "Forbidden Actions",
  "runtime/autonomous/runs/",
  "must not be committed",
  "No secret values may be logged",
  "mainnet-cutover-operator-approval-gate-v1",
  "must not perform mainnet cutover"
]) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS mainnet-cutover-rollback-plan-v1");
