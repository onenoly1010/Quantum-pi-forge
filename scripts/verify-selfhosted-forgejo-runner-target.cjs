#!/usr/bin/env node
const fs = require("fs");
function fail(msg) { console.error(`FAIL: ${msg}`); process.exit(1); }
const workflow = fs.readFileSync(".forgejo/workflows/local-proof.yml", "utf8");
const doc = fs.readFileSync("docs/operations/SELFHOSTED_FORGEJO_RUNNER_TARGET_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/execution/selfhosted-forgejo-runner-target-v1.json", "utf8"));
if (!workflow.includes("runs-on: quantum-pi-selfhosted")) fail("workflow does not target quantum-pi-selfhosted");
if (workflow.includes("runs-on: codeberg-medium-lazy")) fail("workflow still targets codeberg-medium-lazy");
if (!workflow.includes("ops/selfhosted-forgejo-runner-target-v1")) fail("workflow does not trigger on target branch");
if (receipt.workflow_target !== "quantum-pi-selfhosted") fail("receipt workflow_target mismatch");
if (receipt.external_runner_pass_claimed !== false) fail("external_runner_pass_claimed must remain false");
if (receipt.hosted_timeout_root_cause_claimed !== false) fail("hosted_timeout_root_cause_claimed must remain false");
if (receipt.verifier_weakened !== false) fail("verifier_weakened must remain false");
for (const needle of ["self_hosted_runner_target_configured == true","external_runner_pass_claimed == false","hosted_timeout_root_cause_claimed == false","verifier_weakened == false"]) {
  if (!doc.includes(needle)) fail(`missing invariant in doc: ${needle}`);
}
console.log("OK: self-hosted Forgejo runner target receipt verified");
