#!/usr/bin/env node
const fs = require("fs");

const docPath = "docs/operations/EXTERNAL_RUNNER_LIVE_RESULT_V1.md";
const receiptPath = "receipts/execution/external-runner-live-result-v1.json";

for (const path of [docPath, receiptPath]) {
  if (!fs.existsSync(path)) {
    console.error(`FAIL: missing ${path}`);
    process.exit(1);
  }
}

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const valid = ["PASS", "FAILURE", "ABSENT", "INACCESSIBLE"];

if (receipt.schema !== "qpf.external_runner_live_result.v1") {
  console.error("FAIL: invalid schema");
  process.exit(1);
}

if (!valid.includes(receipt.result)) {
  console.error(`FAIL: invalid result ${receipt.result}`);
  process.exit(1);
}

if (receipt.truth_boundary !== "local_verifier_pass != external_runner_pass") {
  console.error("FAIL: truth boundary mismatch");
  process.exit(1);
}

if (receipt.result === "PASS") {
  if (receipt.external_runner_pass_claimed !== true) {
    console.error("FAIL: PASS result must explicitly claim external_runner_pass_claimed=true");
    process.exit(1);
  }
  if (!receipt.run_url || receipt.run_url === "NONE") {
    console.error("FAIL: PASS requires real run_url");
    process.exit(1);
  }
} else {
  if (receipt.external_runner_pass_claimed !== false) {
    console.error("FAIL: non-PASS result cannot claim external runner pass");
    process.exit(1);
  }
}

for (const phrase of [
  "local_verifier_pass != external_runner_pass",
  "No result other than PASS may be described as an external runner pass.",
  "ABSENT",
  "FAILURE",
  "INACCESSIBLE"
]) {
  if (!doc.includes(phrase)) {
    console.error(`FAIL: doc missing phrase: ${phrase}`);
    process.exit(1);
  }
}

console.log("OK: external runner live result receipt verified");
console.log(`OK: result recorded as ${receipt.result}`);
console.log("OK: false external runner pass claims blocked");
