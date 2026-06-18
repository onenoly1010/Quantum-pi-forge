const fs = require("fs");
const path = require("path");
const { normalize } = require("../../scripts/normalization/normalization-engine-v0_1.cjs");
const { classifyIntent } = require("../../scripts/classifier/protocol-intent-classifier-v0_1.cjs");

const receiptPath = path.join("receipts", "classifier", "protocol-intent-classifier-v0_1-tests.json");

function normalizedInput(kind, payload) {
  const result = normalize({ kind, version: "v0.1", payload });
  if (result.accepted !== true) {
    console.error("FAIL protocol-intent-classifier-v0.1: normalization failed");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  return result.normalized;
}

const cases = [
  {
    name: "allow-read-only-evidence",
    input: normalizedInput("evidence_receipt", { receipt: "local-read", action: "read_status" }),
    accepted: true,
    intent_type: "read_only"
  },
  {
    name: "allow-governance-simulation",
    input: normalizedInput("gate_state_transition", { from: "CLOSED", to: "ACTIVE_DEVELOPMENT" }),
    accepted: true,
    intent_type: "governance"
  },
  {
    name: "allow-resonance-oracle-simulation",
    input: normalizedInput("resonance_oracle_io", { input: "signal", output: "coherent" }),
    accepted: true,
    intent_type: "resonance_oracle"
  },
  {
    name: "allow-soul-data-simulation",
    input: normalizedInput("qualia_fragment_minimal", { fragment: "minimal", source: "local" }),
    accepted: true,
    intent_type: "soul_data"
  },
  {
    name: "reject-deploy-action",
    input: normalizedInput("evidence_receipt", { action: "deploy_contract_dry_request" }),
    accepted: false,
    intent_type: "write_mutation"
  },
  {
    name: "reject-execute-action",
    input: normalizedInput("evidence_receipt", { action: "execute_live_request" }),
    accepted: false,
    intent_type: "execution"
  },
  {
    name: "reject-forced-live-flag",
    input: {
      kind: "evidence_receipt",
      version: "v0.1",
      payload: { action: "read_status" },
      normalization: { engine: "normalization-engine-v0.1", mode: "LOCAL_DRY_RUN_ONLY", signing_attempted: false },
      live_execution_authorized: true
    },
    accepted: false,
    intent_type: "read_only"
  },
  {
    name: "reject-unsupported-normalization-mode",
    input: {
      kind: "evidence_receipt",
      version: "v0.1",
      payload: { action: "read_status" },
      normalization: { engine: "normalization-engine-v0.1", mode: "LIVE" }
    },
    accepted: false,
    intent_type: "read_only"
  }
];

const results = cases.map((item) => {
  const result = classifyIntent(item.input);
  if (result.accepted !== item.accepted) {
    console.error("FAIL protocol-intent-classifier-v0.1:", item.name, "acceptance mismatch");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  if (result.classification.intent_type !== item.intent_type) {
    console.error("FAIL protocol-intent-classifier-v0.1:", item.name, "intent mismatch");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  return {
    name: item.name,
    accepted: result.accepted,
    quarantine: result.quarantine,
    classification: result.classification
  };
});

const receipt = {
  receipt: "protocol-intent-classifier-v0.1-tests",
  mode: "LOCAL_DRY_RUN_ONLY",
  gate_mode: "ACTIVE_DEVELOPMENT",
  total_cases: results.length,
  accepted_cases: results.filter((item) => item.accepted).length,
  quarantined_cases: results.filter((item) => item.quarantine).length,
  rpc_mutation_attempted: false,
  signing_attempted: false,
  deployment_attempted: false,
  funding_attempted: false,
  liquidity_attempted: false,
  live_execution_authorized: false,
  results
};

fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
console.log("PASS protocol-intent-classifier-v0.1-tests");
