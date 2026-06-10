#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL: " + msg);
  process.exit(1);
}
function ok(msg) {
  console.log("OK: " + msg);
}

const doc = fs.readFileSync("docs/operations/EXTERNAL_RUNNER_PROOF_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/execution/external-runner-proof-v1.json", "utf8"));

for (const term of [
  "runner_log_missing != runner_pass",
  "github_ci_blocked != execution_blocked",
  "external_runner_receipt_required == true",
  "This lane does not claim a live external runner passed"
]) {
  if (!doc.includes(term)) fail("missing doc term: " + term);
}

if (receipt.schema !== "qpf.external_runner_proof.v1") fail("schema mismatch");
if (receipt.status !== "prepared") fail("status must be prepared");
if (receipt.live_runner_pass_claimed !== false) fail("false live runner claim");
if (receipt.github_hosted_ci_required !== false) fail("GitHub CI dependency boundary mismatch");

ok("external runner proof boundary verified");
ok("no false runner pass claimed");
ok("GitHub CI dependency boundary preserved");
ok("live log attachment requirement recorded");
