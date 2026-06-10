#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL: " + msg);
  process.exit(1);
}

function ok(msg) {
  console.log("OK: " + msg);
}

const docPath = "docs/operations/CONSOLIDATED_EXECUTION_EVIDENCE_INDEX_V1.md";
const receiptPath = "receipts/execution/consolidated-execution-evidence-index-v1.json";

if (!fs.existsSync(docPath)) fail("missing consolidated evidence index doc");
if (!fs.existsSync(receiptPath)) fail("missing consolidated evidence index receipt");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

for (const term of [
  "temporary_override != governance_removal",
  "github_ci_blocked != execution_blocked",
  "runner_log_missing != runner_pass",
  "prepared_receipt != live_runner_pass",
  "live_log_absent != live_runner_pass",
  "local_workflow_log != external_runner_pass",
  "does not claim a live Codeberg, Forgejo, self-hosted, or local-isolated external runner pass"
]) {
  if (!doc.includes(term)) fail("missing doc term: " + term);
}

if (receipt.schema !== "qpf.consolidated_execution_evidence_index.v1") fail("schema mismatch");
if (receipt.status !== "sealed") fail("status must be sealed");
if (receipt.live_external_runner_pass_claimed !== false) fail("must not claim live external runner pass");
if (receipt.github_hosted_ci_required_for_truth !== false) fail("GitHub hosted CI truth dependency must be false");
if (!Array.isArray(receipt.receipt_chain) || receipt.receipt_chain.length !== 4) fail("receipt chain must contain four entries");

for (const pr of [175, 176, 177, 178]) {
  if (!receipt.receipt_chain.some((entry) => entry.pr === pr && entry.status === "sealed")) {
    fail("missing sealed PR entry: " + pr);
  }
}

ok("consolidated execution evidence index verified");
ok("receipt chain 175-178 recorded");
ok("no false external runner pass claimed");
ok("GitHub CI dependency boundary preserved");
