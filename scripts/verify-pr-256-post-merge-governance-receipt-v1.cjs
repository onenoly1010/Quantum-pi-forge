const fs = require("fs");

function fail(message) {
  console.error("FAIL pr-256-post-merge-governance-receipt-v1:", message);
  process.exit(1);
}

const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md";
const receiptPath = "receipts/governance/pr-256-post-merge-governance-receipt-v1.json";

if (!fs.existsSync(docPath)) fail("missing PR 256 post-merge doc");
if (!fs.existsSync(receiptPath)) fail("missing PR 256 receipt");
if (!fs.existsSync("STATUS.md")) fail("missing STATUS.md");
if (!fs.existsSync("AUDIT.md")) fail("missing AUDIT.md");
if (!fs.existsSync("README.md")) fail("missing README.md");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const status = fs.readFileSync("STATUS.md", "utf8");
const readme = fs.readFileSync("README.md", "utf8");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

if (receipt.receipt !== "pr-256-post-merge-governance-receipt-v1") fail("wrong receipt id");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.pr !== 256) fail("wrong PR number");
if (receipt.post_merge_main_anchor !== "8913a37") fail("wrong post-merge anchor");
if (receipt.public_status_present !== true) fail("public status not marked present");
if (receipt.readme_status_link_present !== true) fail("README status link not marked present");
if (receipt.audit_runbook_present !== true) fail("audit runbook not marked present");
if (receipt.one_command_audit_present !== true) fail("one-command audit not marked present");
if (receipt.hosted_ci_success_claimed !== false) fail("must not claim hosted CI success");
if (receipt.non_execution_boundary !== true) fail("non-execution boundary missing");

const falseFlags = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

for (const key of falseFlags) {
  if (receipt[key] !== false) fail(`${key} must remain false`);
}

const requiredDoc = [
  "PR #256",
  "8913a37",
  "STATUS.md centralizes current parked public status",
  "deployment_executed = false",
  "state_changing_transaction_executed = false",
  "ready for deeper external review"
];

for (const needle of requiredDoc) {
  if (!doc.includes(needle)) fail(`doc missing: ${needle}`);
}

if (!status.includes("Parked. Locally auditable. Non-executing.")) fail("STATUS.md missing parked posture");
if (!status.includes("npm run audit:full-local")) fail("STATUS.md missing one-command audit");
if (!readme.includes("STATUS.md")) fail("README.md missing STATUS.md link");
if (!pkg.scripts || pkg.scripts["governance:pr-256-post-merge:v1:check"] !== "node scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs") fail("missing package script");

console.log("PASS pr-256-post-merge-governance-receipt-v1");
