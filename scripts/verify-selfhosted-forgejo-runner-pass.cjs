#!/usr/bin/env node
const fs = require("fs");
function fail(msg) { console.error(`FAIL: ${msg}`); process.exit(1); }
const doc = fs.readFileSync("docs/operations/SELFHOSTED_FORGEJO_RUNNER_PASS_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/execution/selfhosted-forgejo-runner-pass-v1.json", "utf8"));
if (receipt.external_selfhosted_runner_execution !== true) fail("external execution must be true");
if (receipt.external_selfhosted_runner_pass !== true) fail("external self-hosted PASS must be true");
if (receipt.codeberg_task_id !== 6285194) fail("task id mismatch");
if (receipt.runner_name !== "quantum-pi-selfhosted-01") fail("runner name mismatch");
if (receipt.commit !== "d792c6895b2284a10b27bfb88dd7f3109318af44") fail("commit mismatch");
if (receipt.forgejo_proof_receipt_status !== "completed") fail("proof receipt status mismatch");
if (receipt.job_result !== "succeeded") fail("job result mismatch");
if (receipt.github_hosted_checks_pass_claimed !== false) fail("must not claim GitHub hosted checks passed");
if (receipt.hosted_runner_root_cause_claimed !== false) fail("must not claim hosted runner root cause");
if (receipt.verifier_weakened !== false) fail("verifier_weakened must remain false");
for (const needle of [
  "external_selfhosted_runner_execution == true",
  "external_selfhosted_runner_pass == true",
  "codeberg_task_id == 6285194",
  "github_hosted_checks_pass_claimed == false",
  "hosted_runner_root_cause_claimed == false",
  "verifier_weakened == false"
]) {
  if (!doc.includes(needle)) fail(`missing invariant: ${needle}`);
}
console.log("OK: self-hosted Forgejo runner PASS receipt verified");
