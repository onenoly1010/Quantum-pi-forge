const fs = require("fs");

const receiptPath = "receipts/governance/pr-205-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_205.md";

function fail(message) {
  console.error("FAIL pr-205-post-merge-governance-receipt-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing document");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

const checks = [
  ["schema", receipt.schema === "qpf.governance.post_merge_receipt.v1"],
  ["status sealed", receipt.status === "sealed"],
  ["pr number", receipt.pr && receipt.pr.number === 205],
  ["merge commit", receipt.pr && receipt.pr.merge_commit === "71e4d03"],
  ["source branch", receipt.pr && receipt.pr.source_branch === "ops/selfhosted-runner-live-attempt-v2"],
  ["branch deleted", receipt.pr && receipt.pr.branch_deleted === true],
  ["squash merge", receipt.pr && receipt.pr.merge_method === "squash"],
  ["zero reviews", receipt.protection && receipt.protection.required_approving_review_count === 0],
  ["no required status checks", receipt.protection && receipt.protection.required_status_checks === null],
  ["no bypass", receipt.protection && receipt.protection.github_hosted_bypass_used === false],
  ["linear history", receipt.protection && receipt.protection.required_linear_history === true],
  ["conversation resolution", receipt.protection && receipt.protection.required_conversation_resolution === true],
  ["admin enforcement", receipt.protection && receipt.protection.enforce_admins === true],
  ["main sync", receipt.mainline && receipt.mainline.main_equals_origin_main === true],
  ["main head", receipt.mainline && receipt.mainline.head_commit === "71e4d03"],
  ["live attempt on main", receipt.mainline && receipt.mainline.selfhosted_runner_live_attempt_v2_on_main === true],
  ["live pass on main", receipt.mainline && receipt.mainline.selfhosted_runner_live_pass_v2_on_main === true],
  ["verification green", receipt.mainline && receipt.mainline.verification_green_on_main === true],
  ["no runner code changes authorized", receipt.governance_boundary && receipt.governance_boundary.runner_code_changes_authorized === false],
  ["execution truth advanced", receipt.invariants && receipt.invariants.execution_truth_advanced === true]
];

for (const [name, ok] of checks) {
  if (!ok) fail("invalid field: " + name);
}

const docNeedles = [
  "PR #205 merged cleanly into main.",
  "Merge commit: 71e4d03",
  "Bypass used: false",
  "No further self-hosted runner implementation changes are authorized"
];

for (const needle of docNeedles) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

console.log("PASS pr-205-post-merge-governance-receipt-v1");
