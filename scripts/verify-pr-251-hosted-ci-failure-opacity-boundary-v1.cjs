const fs = require("fs");

const receiptPath = "receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json";
const docPath = "docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md";

function fail(message) {
  console.error("FAIL pr-251-hosted-ci-failure-opacity-boundary-v1:", message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing doc");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.receipt !== "pr-251-hosted-ci-failure-opacity-boundary-v1") fail("wrong receipt id");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.pr !== 251) fail("wrong PR number");
if (receipt.local_verifier_passed !== true) fail("local verifier pass not sealed");
if (receipt.local_build_passed !== true) fail("local build pass not sealed");
if (receipt.hosted_ci_success_claimed !== false) fail("must not claim hosted CI success");
if (receipt.hosted_ci_failure_observed !== true) fail("hosted CI failure observation missing");
if (receipt.failed_log_output_actionable !== false) fail("log opacity not sealed");
if (receipt.non_execution_boundary !== true) fail("non-execution boundary missing");

const requiredFalse = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

for (const key of requiredFalse) {
  if (receipt[key] !== false) fail(`${key} must remain false`);
}

const requiredDoc = [
  "PR #251",
  "locally verified",
  "hosted GitHub Actions checks failed",
  "does not claim hosted CI success",
  "mainnet_cutover_approval_granted = false",
  "state_changing_transaction_executed = false"
];

for (const needle of requiredDoc) {
  if (!doc.includes(needle)) fail(`doc missing: ${needle}`);
}

console.log("PASS pr-251-hosted-ci-failure-opacity-boundary-v1");
