#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL: " + msg);
  process.exit(1);
}

const docPath = "docs/operations/EXTERNAL_RUNNER_FIXED_RUN_OBSERVATION_V1.md";
const receiptPath = "receipts/execution/external-runner-fixed-run-observation-v1.json";

if (!fs.existsSync(docPath)) fail("missing doc");
if (!fs.existsSync(receiptPath)) fail("missing receipt");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

for (const phrase of [
  "INACCESSIBLE",
  "No PASS is claimed by this receipt.",
  "This receipt does not supersede the prior FAILURE receipt",
  "No assumption is permitted."
]) {
  if (!doc.includes(phrase)) fail("doc missing: " + phrase);
}

if (receipt.schema !== "qpf.external_runner_fixed_run_observation.v1") fail("schema mismatch");
if (receipt.fixed_commit_short !== "fd8164f") fail("fixed commit mismatch");
if (receipt.classification !== "INACCESSIBLE") fail("classification mismatch");
if (receipt.external_runner_pass !== false) fail("external runner pass must be false");
if (receipt.external_pass_claimed !== false) fail("false pass claim");
if (receipt.supersedes_external_runner_failure !== false) fail("must not supersede prior failure yet");
if (receipt.truth_boundary !== "fixed_run_visible_waiting != external_runner_pass") fail("truth boundary mismatch");

for (const p of [receipt.trigger_log_path, receipt.observation_log_path]) {
  if (!fs.existsSync(p)) fail("missing referenced log: " + p);
}

const obs = fs.readFileSync(receipt.observation_log_path, "utf8");
if (!obs.includes("classification=INACCESSIBLE")) fail("observation log classification mismatch");
if (!obs.includes("external_pass_claimed=false")) fail("observation log false pass boundary missing");

console.log("OK: external runner fixed-run observation verified");
console.log("OK: fixed commit fd8164f recorded");
console.log("OK: classification INACCESSIBLE recorded");
console.log("OK: no external runner pass claimed");
