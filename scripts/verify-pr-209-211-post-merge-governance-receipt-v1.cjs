const fs = require("fs");

const receiptPath = "receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_209_211.md";

function fail(message) {
  console.error("FAIL pr-209-211-post-merge-governance-receipt-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing document");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

const prs = receipt.covered_prs || [];
const prNumbers = prs.map((pr) => pr.number).join(",");

const checks = [
  ["schema", receipt.schema === "qpf.governance.combined_post_merge_receipt.v1"],
  ["status", receipt.status === "sealed"],
  ["main head", receipt.mainline && receipt.mainline.head_commit === "a1c57db"],
  ["main synced", receipt.mainline && receipt.mainline.main_equals_origin_main === true],
  ["covered prs", prNumbers === "209,210,211"],
  ["pr209 commit", prs[0] && prs[0].merge_commit === "007448b"],
  ["pr210 commit", prs[1] && prs[1].merge_commit === "293d70c"],
  ["pr211 commit", prs[2] && prs[2].merge_commit === "a1c57db"],
  ["no bypass", receipt.protection && receipt.protection.github_hosted_bypass_used === false],
  ["activation command", receipt.verified_safety && receipt.verified_safety.supervised_activation_command_on_main === true],
  ["runtime hygiene", receipt.verified_safety && receipt.verified_safety.runtime_hygiene_on_main === true],
  ["refusal tests", receipt.verified_safety && receipt.verified_safety.refusal_tests_on_main === true],
  ["dry run default", receipt.verified_safety && receipt.verified_safety.dry_run_default === true],
  ["runtime ignored", receipt.verified_safety && receipt.verified_safety.runtime_receipts_ignored === true],
  ["live refused", receipt.verified_safety && receipt.verified_safety.live_mode_refused === true],
  ["private key refused", receipt.verified_safety && receipt.verified_safety.private_key_context_refused === true],
  ["no irreversible action", receipt.verified_safety && receipt.verified_safety.irreversible_network_action_executed === false],
  ["no full autonomy", receipt.verified_safety && receipt.verified_safety.full_autonomy_claimed === false],
  ["no live authorization", receipt.governance_boundary && receipt.governance_boundary.live_deployment_authorized === false],
  ["no wallet authorization", receipt.governance_boundary && receipt.governance_boundary.wallet_use_authorized === false],
  ["no key authorization", receipt.governance_boundary && receipt.governance_boundary.private_key_access_authorized === false],
  ["runner frozen", receipt.invariants && receipt.invariants.runner_implementation_frozen === true],
  ["verification green", receipt.invariants && receipt.invariants.verification_green_on_main === true]
];

for (const [name, ok] of checks) {
  if (!ok) fail("invalid field: " + name);
}

const needles = [
  "main == origin/main == a1c57db",
  "PR #209: Define supervised autonomous activation command v1",
  "PR #210: Fix supervised activation runtime receipt hygiene v1",
  "PR #211: Prove supervised activation refusal tests v1",
  "This receipt does not authorize live deployment.",
  "This receipt does not authorize wallet use.",
  "This receipt does not authorize private-key access.",
  "This receipt does not modify self-hosted runner implementation."
];

for (const needle of needles) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

console.log("PASS pr-209-211-post-merge-governance-receipt-v1");
