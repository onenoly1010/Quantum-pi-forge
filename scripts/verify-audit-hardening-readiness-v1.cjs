const fs = require("fs");

const receiptPath = "receipts/governance/audit-hardening-readiness-v1.json";
const docPath = "docs/governance/AUDIT_HARDENING_READINESS_V1.md";

function fail(message) {
  console.error("FAIL audit-hardening-readiness-v1:", message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing governance doc");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

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

if (receipt.receipt !== "audit-hardening-readiness-v1") fail("wrong receipt id");
if (receipt.status !== "sealed") fail("receipt not sealed");
if (receipt.non_execution_boundary !== true) fail("non-execution boundary missing");
if (receipt.allowed_outcome !== "review_hardening_only") fail("wrong allowed outcome");

const requiredImperatives = [
  "non_transferable_state_transition_truth",
  "local_first_ci_surrogate_integrity",
  "no_unauthorized_cloud_fallback",
  "dependency_pinning_required_before_unseal",
  "telemetry_alignment_required_before_unseal",
  "audit_onboarding_required_before_unseal"
];

for (const key of requiredImperatives) {
  if (!receipt.imperatives || receipt.imperatives[key] !== true) {
    fail(`imperative not sealed: ${key}`);
  }
}

const forbidden = [
  "mainnet_execution",
  "deployment",
  "broadcast",
  "state_changing_transaction",
  "approval_flag_flip",
  "silent_cloud_fallback"
];

for (const item of forbidden) {
  if (!Array.isArray(receipt.forbidden_outcomes) || !receipt.forbidden_outcomes.includes(item)) {
    fail(`forbidden outcome not declared: ${item}`);
  }
}

const docNeedles = [
  "Non-transferable State-Transition Truth",
  "Local-First CI Surrogate",
  "Unauthorized Cloud Fallback Boundary",
  "mainnet_cutover_approval_granted = false",
  "state_changing_transaction_executed = false"
];

for (const needle of docNeedles) {
  if (!doc.includes(needle)) fail(`doc missing: ${needle}`);
}

console.log("PASS audit-hardening-readiness-v1");
