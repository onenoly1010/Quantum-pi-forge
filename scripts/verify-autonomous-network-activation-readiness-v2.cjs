const fs = require("fs");

const receiptPath = "receipts/autonomous/network-activation-readiness-v2.json";
const docPath = "docs/autonomous/AUTONOMOUS_NETWORK_ACTIVATION_READINESS_V2.md";

function fail(message) {
  console.error("FAIL autonomous-network-activation-readiness-v2: " + message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing document");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

const checks = [
  ["schema", receipt.schema === "qpf.autonomous.network_activation_readiness.v2"],
  ["status", receipt.status === "prepared"],
  ["baseline head", receipt.baseline && receipt.baseline.main_head_at_lane_creation === "e943a12"],
  ["pr205 on main", receipt.baseline && receipt.baseline.pr_205_selfhosted_runner_live_execution_on_main === true],
  ["pr206 on main", receipt.baseline && receipt.baseline.pr_206_post_merge_governance_receipt_on_main === true],
  ["runner frozen", receipt.baseline && receipt.baseline.runner_implementation_frozen === true],
  ["operator override", receipt.activation_boundary && receipt.activation_boundary.operator_override_required === true],
  ["dry run", receipt.activation_boundary && receipt.activation_boundary.dry_run_supported === true],
  ["no key exposure", receipt.activation_boundary && receipt.activation_boundary.private_key_exposure_allowed === false],
  ["no irreversible action without confirmation", receipt.activation_boundary && receipt.activation_boundary.irreversible_network_action_without_confirmation_allowed === false],
  ["no unsupported autonomy claim", receipt.activation_boundary && receipt.activation_boundary.full_autonomy_claim_allowed_without_evidence === false],
  ["invariant prepared", receipt.invariants && receipt.invariants.autonomous_activation_prepared === true],
  ["invariant evidence required", receipt.invariants && receipt.invariants.evidence_required_before_full_autonomy_claim === true]
];

for (const [name, ok] of checks) {
  if (!ok) fail("invalid field: " + name);
}

const needles = [
  "This lane does not modify self-hosted runner implementation.",
  "main == origin/main == e943a12",
  "operator override remains available",
  "no irreversible network action is executed without explicit operator confirmation",
  "claim full autonomy before evidence exists"
];

for (const needle of needles) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

console.log("PASS autonomous-network-activation-readiness-v2");
