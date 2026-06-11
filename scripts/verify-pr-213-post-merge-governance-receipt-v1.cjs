const fs = require("fs");

const receiptPath = "receipts/governance/pr-213-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_213.md";

function fail(message) {
  console.error("FAIL pr-213-post-merge-governance-receipt-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing document");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

const checks = [
  ["schema", receipt.schema === "qpf.governance.post_merge_receipt.v1"],
  ["status", receipt.status === "sealed"],
  ["covered pr", receipt.covered_pr && receipt.covered_pr.number === 213],
  ["merge commit", receipt.covered_pr && receipt.covered_pr.merge_commit === "d6a3c28"],
  ["main head", receipt.mainline && receipt.mainline.head_commit === "d6a3c28"],
  ["main synced", receipt.mainline && receipt.mainline.main_equals_origin_main === true],
  ["no bypass", receipt.protection && receipt.protection.github_hosted_bypass_used === false],
  ["index on main", receipt.verified_state && receipt.verified_state.supervised_activation_readiness_index_on_main === true],
  ["operator map", receipt.verified_state && receipt.verified_state.operator_reviewer_activation_map_on_main === true],
  ["dry run", receipt.verified_state && receipt.verified_state.dry_run_default === true],
  ["live refused", receipt.verified_state && receipt.verified_state.live_mode_refused === true],
  ["key refused", receipt.verified_state && receipt.verified_state.private_key_context_refused === true],
  ["no irreversible action", receipt.verified_state && receipt.verified_state.irreversible_network_action_executed === false],
  ["no full autonomy", receipt.verified_state && receipt.verified_state.full_autonomy_claimed === false],
  ["runner frozen", receipt.verified_state && receipt.verified_state.runner_implementation_frozen === true],
  ["no live auth", receipt.governance_boundary && receipt.governance_boundary.live_deployment_authorized === false],
  ["no wallet auth", receipt.governance_boundary && receipt.governance_boundary.wallet_use_authorized === false],
  ["no key auth", receipt.governance_boundary && receipt.governance_boundary.private_key_access_authorized === false]
];

for (const [name, ok] of checks) {
  if (!ok) fail("invalid field: " + name);
}

const needles = [
  "main == origin/main == d6a3c28",
  "PR #213: Add supervised activation readiness index v1",
  "This receipt does not authorize live deployment.",
  "This receipt does not authorize wallet use.",
  "This receipt does not authorize private-key access.",
  "This receipt does not claim full autonomous network operation.",
  "This receipt does not modify self-hosted runner implementation."
];

for (const needle of needles) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

console.log("PASS pr-213-post-merge-governance-receipt-v1");
