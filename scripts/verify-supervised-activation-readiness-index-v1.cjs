const fs = require("fs");

const docPath = "docs/autonomous/SUPERVISED_ACTIVATION_READINESS_INDEX_V1.md";
const receiptPath = "receipts/autonomous/supervised-activation-readiness-index-v1.json";

function fail(message) {
  console.error("FAIL supervised-activation-readiness-index-v1: " + message);
  process.exit(1);
}

for (const file of [docPath, receiptPath]) {
  if (!fs.existsSync(file)) fail("missing file: " + file);
}

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const docNeedles = [
  "main == origin/main == 8653772",
  "PR #209: supervised autonomous activation command v1",
  "PR #210: supervised activation runtime hygiene v1",
  "PR #211: supervised activation refusal tests v1",
  "PR #212: combined post-merge governance receipt",
  "This index does not claim full autonomous network operation.",
  "This index does not authorize live deployment.",
  "This index does not authorize wallet use.",
  "This index does not authorize private-key access.",
  "This index does not modify self-hosted runner implementation."
];

for (const needle of docNeedles) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

const checks = [
  ["schema", receipt.schema === "qpf.autonomous.supervised_activation_readiness_index.v1"],
  ["status", receipt.status === "prepared"],
  ["head", receipt.mainline && receipt.mainline.head_commit === "8653772"],
  ["prs", Array.isArray(receipt.covered_prs) && receipt.covered_prs.join(",") === "207,208,209,210,211,212"],
  ["dry run", receipt.safety_state && receipt.safety_state.dry_run_default === true],
  ["runtime ignored", receipt.safety_state && receipt.safety_state.runtime_receipts_ignored === true],
  ["live refused", receipt.safety_state && receipt.safety_state.live_mode_refused === true],
  ["key refused", receipt.safety_state && receipt.safety_state.private_key_context_refused === true],
  ["no irreversible", receipt.safety_state && receipt.safety_state.irreversible_network_action_executed === false],
  ["no wallet", receipt.safety_state && receipt.safety_state.wallet_use_authorized === false],
  ["no key auth", receipt.safety_state && receipt.safety_state.private_key_access_authorized === false],
  ["no live auth", receipt.safety_state && receipt.safety_state.live_deployment_authorized === false],
  ["no autonomy claim", receipt.safety_state && receipt.safety_state.full_autonomy_claimed === false],
  ["runner frozen", receipt.safety_state && receipt.safety_state.runner_implementation_frozen === true]
];

for (const [name, ok] of checks) {
  if (!ok) fail("invalid field: " + name);
}

console.log("PASS supervised-activation-readiness-index-v1");
