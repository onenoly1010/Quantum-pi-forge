const fs = require("fs");

const receiptPath = "receipts/governance/pr-207-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_207.md";

function fail(message) {
  console.error("FAIL pr-207-post-merge-governance-receipt-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing document");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

const checks = [
  ["schema", receipt.schema === "qpf.governance.post_merge_receipt.v1"],
  ["status", receipt.status === "sealed"],
  ["pr number", receipt.pr && receipt.pr.number === 207],
  ["merge commit", receipt.pr && receipt.pr.merge_commit === "b072617"],
  ["source branch", receipt.pr && receipt.pr.source_branch === "autonomous/network-activation-readiness-v2"],
  ["branch deleted", receipt.pr && receipt.pr.branch_deleted === true],
  ["squash merge", receipt.pr && receipt.pr.merge_method === "squash"],
  ["no bypass", receipt.protection && receipt.protection.github_hosted_bypass_used === false],
  ["protection respected", receipt.protection && receipt.protection.branch_protection_respected === true],
  ["main sync", receipt.mainline && receipt.mainline.main_equals_origin_main === true],
  ["main head", receipt.mainline && receipt.mainline.head_commit === "b072617"],
  ["readiness on main", receipt.mainline && receipt.mainline.autonomous_network_activation_readiness_v2_on_main === true],
  ["verification green", receipt.mainline && receipt.mainline.verification_green_on_main === true],
  ["no runner changes", receipt.governance_boundary && receipt.governance_boundary.runner_implementation_changes_authorized === false],
  ["no unsupervised deployment", receipt.governance_boundary && receipt.governance_boundary.unsupervised_autonomous_deployment_authorized === false],
  ["execution truth advanced", receipt.invariants && receipt.invariants.execution_truth_advanced === true]
];

for (const [name, ok] of checks) {
  if (!ok) fail("invalid field: " + name);
}

const needles = [
  "PR #207 merged cleanly into main.",
  "Merge commit: b072617",
  "Bypass used: false",
  "No self-hosted runner implementation changes are authorized by this receipt.",
  "No unsupervised autonomous deployment is authorized by this receipt."
];

for (const needle of needles) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

console.log("PASS pr-207-post-merge-governance-receipt-v1");
