#!/usr/bin/env node
const fs = require("fs");
function fail(msg) { console.error(`FAIL: ${msg}`); process.exit(1); }
const doc = fs.readFileSync("docs/operations/SELFHOSTED_FORGEJO_RUNNER_TASK_OBSERVATION_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/execution/selfhosted-forgejo-runner-task-observation-v1.json", "utf8"));
if (receipt.codeberg_task_id !== 6284723) fail("task id mismatch");
if (receipt.task_pickup_observed !== true) fail("task pickup must be observed");
if (receipt.job_network_cleanup_observed !== true) fail("network cleanup must be observed");
if (receipt.codeberg_terminal_result_claimed !== false) fail("terminal result must not be claimed");
if (receipt.external_runner_pass_claimed !== false) fail("external runner PASS must not be claimed");
if (receipt.external_runner_failure_claimed !== false) fail("external runner FAILURE must not be claimed");
if (receipt.verifier_weakened !== false) fail("verifier_weakened must remain false");
for (const needle of [
  "self_hosted_runner_task_seen == true",
  "self_hosted_runner_job_cleanup_seen == true",
  "codeberg_terminal_result_claimed == false",
  "external_runner_pass_claimed == false",
  "external_runner_failure_claimed == false",
  "verifier_weakened == false"
]) {
  if (!doc.includes(needle)) fail(`missing invariant: ${needle}`);
}
console.log("OK: self-hosted Forgejo runner task observation verified without PASS/FAIL claim");
