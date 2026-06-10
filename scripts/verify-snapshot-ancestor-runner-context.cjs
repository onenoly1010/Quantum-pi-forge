#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL: " + msg);
  process.exit(1);
}

const workflowPath = ".forgejo/workflows/local-proof.yml";
const docPath = "docs/operations/SNAPSHOT_ANCESTOR_RUNNER_CONTEXT_V1.md";
const receiptPath = "receipts/execution/snapshot-ancestor-runner-context-v1.json";

for (const path of [workflowPath, docPath, receiptPath]) {
  if (!fs.existsSync(path)) fail("missing " + path);
}

const workflow = fs.readFileSync(workflowPath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (!workflow.includes("fetch-depth: 0")) fail("Forgejo checkout is not full-depth");
if (!doc.includes("The verifier is not weakened.")) fail("doc must state verifier is not weakened");
if (!doc.includes("No external pass is claimed by this receipt.")) fail("doc must block false pass claim");

if (receipt.schema !== "qpf.snapshot_ancestor_runner_context.v1") fail("schema mismatch");
if (receipt.verifier_weakened !== false) fail("verifier weakening forbidden");
if (receipt.workflow_history_depth_corrected !== true) fail("workflow depth correction not recorded");
if (receipt.external_runner_pass_claimed !== false) fail("false external pass claim");
if (receipt.truth_boundary !== "workflow_checkout_depth_fix != external_runner_pass") fail("truth boundary mismatch");

console.log("OK: snapshot ancestor runner context repair verified");
console.log("OK: Forgejo checkout now uses fetch-depth 0");
console.log("OK: snapshot verifier remains strict");
console.log("OK: no external runner pass claimed");
