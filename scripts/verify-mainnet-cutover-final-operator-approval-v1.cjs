#!/usr/bin/env node
const fs = require("fs");

function fail(message) {
  console.error("FAIL mainnet-cutover-final-operator-approval-v1: " + message);
  process.exit(1);
}

const r = JSON.parse(fs.readFileSync("receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json", "utf8"));
const c = JSON.parse(fs.readFileSync("receipts/autonomous/mainnet-cutover-command-hash-v1.json", "utf8"));
const d = fs.readFileSync("docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md", "utf8");

if (r.schema !== "qpf.autonomous.mainnet_cutover_final_operator_approval.v1") fail("schema mismatch");
if (r.status !== "SEALED_APPROVAL_NOT_GRANTED") fail("status mismatch");
if (r.branch !== "autonomous/mainnet-cutover-final-operator-approval-v1") fail("branch mismatch");
if (r.base_main_commit !== "a98c652") fail("base main mismatch");
if (r.referenced_command !== c.command) fail("command mismatch");
if (r.referenced_command_sha256 !== c.command_sha256) fail("hash mismatch");

for (const k of [
  "operator_approval_currently_granted",
  "approval_receipt_present",
  "approval_references_exact_command_hash",
  "command_executed",
  "cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_sent",
  "secret_values_printed",
  "mainnet_cutover_ready_to_execute"
]) {
  if (r[k] !== false) fail(k + " must be false");
}

if (!r.claim_boundary || r.claim_boundary.final_operator_approval_boundary_defined !== true) fail("claim boundary missing");
if (r.next_authorized_lane !== "mainnet-cutover-secret-remediation-execution-v1") fail("next lane mismatch");

for (const term of [
  "SEALED_APPROVAL_NOT_GRANTED",
  r.referenced_command,
  r.referenced_command_sha256,
  "operator_approval_currently_granted == false",
  "mainnet_cutover_ready_to_execute == false",
  "No mainnet cutover",
  "No contract deployment",
  "No state-changing transaction",
  "No secret printing",
  "mainnet-cutover-secret-remediation-execution-v1"
]) {
  if (!d.includes(term)) fail("doc missing term: " + term);
}

console.log("PASS mainnet-cutover-final-operator-approval-v1");
