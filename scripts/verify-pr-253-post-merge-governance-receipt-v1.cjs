const fs = require("fs");

const receiptPath = "receipts/governance/pr-253-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md";

function fail(message) {
  console.error("FAIL pr-253-post-merge-governance-receipt-v1:", message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing doc");
if (!fs.existsSync("AUDIT.md")) fail("missing AUDIT.md on main");
if (!fs.existsSync("scripts/audit-full-local.cjs")) fail("missing audit full local runner on main");
if (!fs.existsSync("scripts/verify-root-audit-runbook-v1.cjs")) fail("missing root audit verifier on main");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");
const audit = fs.readFileSync("AUDIT.md", "utf8");

if (receipt.receipt !== "pr-253-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.pr !== 253) fail("wrong PR number");
if (receipt.post_merge_main_anchor !== "0c0d060") fail("wrong post-merge anchor");
if (receipt.root_audit_runbook_present !== true) fail("root audit runbook not present");
if (receipt.full_local_audit_runner_present !== true) fail("full local audit runner not present");
if (receipt.root_audit_runbook_verifier_present !== true) fail("root audit verifier not present");
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
  "PR #253",
  "0c0d060",
  "Hosted CI success is not claimed",
  "mainnet_cutover_approval_granted = false",
  "state_changing_transaction_executed = false"
];

for (const needle of requiredDoc) {
  if (!doc.includes(needle)) fail(`doc missing: ${needle}`);
}

if (!audit.includes("npm run audit:full-local")) fail("AUDIT.md missing audit command");
if (!audit.includes("This runbook is non-executing")) fail("AUDIT.md missing non-execution language");

console.log("PASS pr-253-post-merge-governance-receipt-v1");
