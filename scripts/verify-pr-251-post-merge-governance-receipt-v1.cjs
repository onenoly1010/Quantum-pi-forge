const fs = require("fs");

const receiptPath = "receipts/governance/pr-251-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md";

function fail(message) {
  console.error("FAIL pr-251-post-merge-governance-receipt-v1:", message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing doc");
if (!fs.existsSync("docs/governance/AUDIT_HARDENING_READINESS_V1.md")) fail("missing audit hardening doc on main");
if (!fs.existsSync("docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md")) fail("missing hosted CI opacity doc on main");
if (!fs.existsSync("scripts/verify-audit-hardening-readiness-v1.cjs")) fail("missing audit verifier on main");
if (!fs.existsSync("scripts/verify-pr-251-hosted-ci-failure-opacity-boundary-v1.cjs")) fail("missing opacity verifier on main");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.receipt !== "pr-251-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.pr !== 251) fail("wrong PR number");
if (receipt.post_merge_main_anchor !== "181e214") fail("wrong post-merge anchor");
if (receipt.audit_hardening_readiness_present !== true) fail("audit readiness not present");
if (receipt.hosted_ci_opacity_boundary_present !== true) fail("hosted CI opacity boundary not present");
if (receipt.hosted_ci_success_claimed !== false) fail("must not claim hosted CI success");
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
  "181e214",
  "Hosted CI success is not claimed",
  "mainnet_cutover_approval_granted = false",
  "state_changing_transaction_executed = false"
];

for (const needle of requiredDoc) {
  if (!doc.includes(needle)) fail(`doc missing: ${needle}`);
}

console.log("PASS pr-251-post-merge-governance-receipt-v1");
