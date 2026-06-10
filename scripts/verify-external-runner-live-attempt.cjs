#!/usr/bin/env node
const fs = require("fs");

const doc = "docs/operations/EXTERNAL_RUNNER_LIVE_ATTEMPT_V1.md";
const receipt = "receipts/execution/external-runner-live-attempt-v1.json";

for (const path of [doc, receipt]) {
  if (!fs.existsSync(path)) {
    console.error(`FAIL: missing ${path}`);
    process.exit(1);
  }
}

const text = fs.readFileSync(doc, "utf8");
const json = JSON.parse(fs.readFileSync(receipt, "utf8"));

const requiredDoc = [
  "local_verifier_pass != external_runner_pass",
  "external platform run identifier",
  "live_external_runner_pass",
  "live_external_runner_failure",
  "live_external_runner_absent",
  "live_external_runner_log_inaccessible",
  "No other outcome is valid."
];

for (const item of requiredDoc) {
  if (!text.includes(item)) {
    console.error(`FAIL: doc missing required boundary: ${item}`);
    process.exit(1);
  }
}

if (json.receipt_type !== "external_runner_live_attempt_v1") {
  console.error("FAIL: invalid receipt_type");
  process.exit(1);
}

if (json.truth_boundary !== "local_verifier_pass != external_runner_pass") {
  console.error("FAIL: truth boundary mismatch");
  process.exit(1);
}

if (json.false_claims_forbidden !== true) {
  console.error("FAIL: false claim guard missing");
  process.exit(1);
}

for (const outcome of [
  "live_external_runner_pass",
  "live_external_runner_failure",
  "live_external_runner_absent",
  "live_external_runner_log_inaccessible"
]) {
  if (!json.valid_outcomes.includes(outcome)) {
    console.error(`FAIL: missing valid outcome ${outcome}`);
    process.exit(1);
  }
}

console.log("OK: external runner live attempt receipt verified");
console.log("OK: no live runner success claimed yet");
console.log("OK: valid outcome set recorded");
console.log("OK: false external pass claims forbidden");
