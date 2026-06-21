const fs = require("fs");
const cp = require("child_process");
const crypto = require("crypto");

const contractPath = "docs/governance/BOUNDED_ACTIVATION_READINESS_GATE_V1.json";
const receiptPath = "receipts/governance/bounded-activation-readiness-gate-v1.json";

const sh = (cmd) => {
  try {
    return cp.execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (e) {
    return String((e.stdout || "") + (e.stderr || "") || e.message).trim();
  }
};

const exists = (p) => fs.existsSync(p);
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

if (!exists(contractPath)) {
  throw new Error(`Missing contract: ${contractPath}`);
}

const raw = fs.readFileSync(contractPath, "utf8");
const contract = JSON.parse(raw);

const checks = {
  contract_schema_valid: contract.schema === "qpf.bounded_activation_readiness_gate.v1",
  classification_only: contract.classification_only === true,
  execution_not_authorized: contract.authorizes_execution === false,
  wallet_actions_not_authorized: contract.authorizes_wallet_actions === false,
  private_key_access_not_authorized: contract.authorizes_private_key_access === false,
  signing_not_authorized: contract.authorizes_signing === false,
  transaction_broadcast_not_authorized: contract.authorizes_transaction_broadcast === false,
  deploy_not_authorized: contract.authorizes_deploy === false,
  stake_not_authorized: contract.authorizes_stake === false,
  mint_not_authorized: contract.authorizes_mint === false,
  participant_growth_not_authorized: contract.authorizes_participant_growth === false,
  covered_action_classes_present: Array.isArray(contract.covered_action_classes) && contract.covered_action_classes.length >= 9,
  required_global_preconditions_present: Array.isArray(contract.required_preconditions?.global),
  required_evidence_preconditions_present: Array.isArray(contract.required_preconditions?.evidence),
  required_safety_preconditions_present: Array.isArray(contract.required_preconditions?.safety),
  required_deploy_preconditions_present: Array.isArray(contract.required_preconditions?.deploy),
  required_stake_preconditions_present: Array.isArray(contract.required_preconditions?.stake),
  required_mint_preconditions_present: Array.isArray(contract.required_preconditions?.mint),
  required_participant_preconditions_present: Array.isArray(contract.required_preconditions?.participant_action),
  status_rules_present: !!contract.status_rules?.ready && !!contract.status_rules?.not_ready,
  mainnet_finalization_gate_checker_present: exists("scripts/check-mainnet-finalization-gate-v1.cjs")
};

let mainnetFinalizationOutput = "";
if (exists("scripts/check-mainnet-finalization-gate-v1.cjs")) {
  mainnetFinalizationOutput = sh("node scripts/check-mainnet-finalization-gate-v1.cjs");
  checks.mainnet_finalization_gate_v1_passed = /PASS/i.test(mainnetFinalizationOutput) && !/FAIL/i.test(mainnetFinalizationOutput);
} else {
  checks.mainnet_finalization_gate_v1_passed = false;
}

let evidenceOutput = "";
if (exists("package.json")) {
  evidenceOutput = sh("npm run verify:evidence");
  checks.npm_verify_evidence_passes = /PASS|OK|passed/i.test(evidenceOutput) && !/FAIL|ERROR/i.test(evidenceOutput);
} else {
  checks.npm_verify_evidence_passes = false;
}

const intentionallyMissingUntilSupervisedExecution = [
  "named_action_plan_exists",
  "named_action_scope_declared",
  "explicit_human_operator_approval_exists",
  "execution_lane_separate_from_classification_lane",
  "irreversible_zone_review_completed",
  "target_contracts_named_or_action_specific_scope_declared",
  "dry_run_or_simulation_receipt_present_for_named_action",
  "gas_funding_or_quantity_limits_declared_for_named_action"
];

for (const k of intentionallyMissingUntilSupervisedExecution) {
  checks[k] = false;
}

const missing = Object.entries(checks).filter(([, v]) => v !== true).map(([k]) => k);
const ready = missing.length === 0;

const receipt = {
  schema: "qpf.bounded_activation_readiness_gate.receipt.v1",
  created_at: new Date().toISOString(),
  gate: "Bounded Activation Readiness Gate v1",
  status: ready ? "ready" : "not_ready",
  ready,
  missing_conditions: missing,
  checks,
  classification_only: true,
  authorizes_execution: false,
  authorizes_wallet_actions: false,
  authorizes_private_key_access: false,
  authorizes_signing: false,
  authorizes_transaction_broadcast: false,
  authorizes_deploy: false,
  authorizes_stake: false,
  authorizes_mint: false,
  authorizes_participant_growth: false,
  private_key_present: false,
  wallet_actions: false,
  signing_attempted: false,
  transaction_broadcast: false,
  live_execution: false,
  contract_path: contractPath,
  contract_sha256: sha256(raw),
  git_head: sh("git rev-parse HEAD"),
  git_status_short: sh("git status --short"),
  observed_outputs: {
    mainnet_finalization_gate_v1: mainnetFinalizationOutput,
    verify_evidence: evidenceOutput
  }
};

fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");

console.log("BOUNDED_ACTIVATION_READINESS_GATE_V1_SEALED");
console.log(`file=${receiptPath}`);
console.log(`status=${receipt.status}`);
console.log(`ready=${receipt.ready}`);
console.log(`missing_conditions=${JSON.stringify(receipt.missing_conditions)}`);
console.log(`contract_sha256=${receipt.contract_sha256}`);
console.log("classification_only=true");
console.log("authorizes_execution=false");
