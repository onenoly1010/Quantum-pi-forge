#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL: " + msg);
  process.exit(1);
}

const docPath = "docs/operations/EXTERNAL_RUNNER_3C32F91_INACCESSIBLE_V1.md";
const receiptPath = "receipts/execution/external-runner-3c32f91-inaccessible-v1.json";

if (!fs.existsSync(docPath)) fail("missing doc");
if (!fs.existsSync(receiptPath)) fail("missing receipt");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

for (const phrase of [
  "INACCESSIBLE",
  "No PASS is claimed by this receipt.",
  "This receipt does not supersede the prior external runner FAILURE receipt.",
  "No assumption is permitted."
]) {
  if (!doc.includes(phrase)) fail("doc missing: " + phrase);
}

if (receipt.schema !== "qpf.external_runner_3c32f91_inaccessible.v1") fail("schema mismatch");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.commit_short !== "3c32f91") fail("commit mismatch");
if (receipt.classification !== "INACCESSIBLE") fail("classification mismatch");
if (receipt.external_runner_pass !== false) fail("external runner pass must remain false");
if (receipt.external_pass_claimed !== false) fail("external pass claim must remain false");
if (receipt.supersedes_external_runner_failure !== false) fail("must not supersede prior failure");
if (receipt.supersedes_fixed_run_observation !== false) fail("must not supersede prior inaccessible observation");
if (receipt.root_cause_claimed !== false) fail("root cause must not be claimed as fact");
if (receipt.truth_boundary !== "inaccessible_or_pending_codeberg_run != external_runner_pass") fail("truth boundary mismatch");

for (const p of [receipt.trigger_log_path, receipt.observation_log_path]) {
  if (!fs.existsSync(p)) fail("missing referenced log: " + p);
}

const trigger = fs.readFileSync(receipt.trigger_log_path, "utf8");
const obs = fs.readFileSync(receipt.observation_log_path, "utf8");

if (!trigger.includes("github_main_short=3c32f91")) fail("trigger log commit mismatch");
if (!trigger.includes("external_pass_claimed=false")) fail("trigger log false pass boundary missing");
if (!obs.includes("commit_short=3c32f91")) fail("observation log commit mismatch");
if (!obs.includes("classification=INACCESSIBLE")) fail("observation log classification mismatch");
if (!obs.includes("job_id=")) fail("observation log normalized job_id missing");
if (!obs.includes("external_pass_claimed=false")) fail("observation log false pass boundary missing");

console.log("OK: external runner 3c32f91 INACCESSIBLE observation verified");
console.log("OK: no external runner pass claimed");
console.log("OK: trigger and observation logs attached");
console.log("OK: timeout/root-cause theory not claimed as fact");
