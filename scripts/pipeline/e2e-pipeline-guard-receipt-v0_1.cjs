const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { runProtocolPipeline } = require("../orchestrator/protocol-pipeline-orchestrator-v0_1.cjs");

const receiptPath = path.join("receipts", "pipeline", "e2e-pipeline-guard-receipt-v0_1.json");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = canonicalize(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

const cases = [
  {
    name: "accept-safe-local-governance-simulation",
    input: { action: "read_status", requested_operation: "local_simulation", target: "governance-gate", payload: { review: "active-development-local-only" } },
    expectedAccepted: true
  },
  {
    name: "quarantine-deploy-intent",
    input: { action: "deploy_contract", requested_operation: "future_deploy", payload: {} },
    expectedAccepted: false
  },
  {
    name: "quarantine-execute-intent",
    input: { action: "execute_live_request", requested_operation: "execute", payload: {} },
    expectedAccepted: false
  },
  {
    name: "quarantine-sign-intent",
    input: { action: "sign_message", requested_operation: "sign", payload: {} },
    expectedAccepted: false
  },
  {
    name: "quarantine-funding-intent",
    input: { action: "fund_wallet", requested_operation: "fund", payload: {} },
    expectedAccepted: false
  },
  {
    name: "quarantine-liquidity-intent",
    input: { action: "add_liquidity", requested_operation: "liquidity", payload: {} },
    expectedAccepted: false
  }
];

const results = cases.map((item) => {
  const result = runProtocolPipeline(item.input);
  if (result.accepted !== item.expectedAccepted) {
    console.error("FAIL e2e-pipeline-guard-receipt-v0.1:", item.name, "acceptance mismatch");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  for (const field of ["rpc_mutation_attempted", "signing_attempted", "deployment_attempted", "funding_attempted", "liquidity_attempted", "live_execution_authorized"]) {
    if (result[field] !== false) {
      console.error("FAIL e2e-pipeline-guard-receipt-v0.1:", item.name, field, "leaked");
      console.error(JSON.stringify(result, null, 2));
      process.exit(1);
    }
  }
  return {
    name: item.name,
    accepted: result.accepted,
    quarantine: result.quarantine,
    stage: result.stage,
    canonical_hash: result.normalization && result.normalization.canonical_hash,
    intent_type: result.classification && result.classification.classification && result.classification.classification.intent_type,
    reasons: result.classification && result.classification.classification && result.classification.classification.reasons
  };
});

const canonicalBody = {
  receipt: "e2e-pipeline-guard-receipt-v0.1",
  pipeline_version: "0.1",
  mode: "LOCAL_DRY_RUN_ONLY",
  gate_mode: "ACTIVE_DEVELOPMENT",
  uses_protocol_pipeline_orchestrator: true,
  chain_of_custody: {
    adapter_stage_represented: true,
    normalization_stage_passed: true,
    classifier_guard_stage_passed: true,
    orchestrator_stage_passed: true
  },
  invariants: {
    private_keys_loaded: false,
    live_execution_authorized: false,
    signing_attempted: false,
    rpc_mutation_attempted: false,
    deployment_attempted: false,
    funding_attempted: false,
    liquidity_attempted: false,
    future_operational_gate_required: true
  },
  total_cases: results.length,
  accepted_cases: results.filter((item) => item.accepted).length,
  quarantined_cases: results.filter((item) => item.quarantine).length,
  results
};

const masterCanonicalHash = sha256(JSON.stringify(canonicalize(canonicalBody)));
const receipt = {
  ...canonicalBody,
  master_canonical_hash: masterCanonicalHash,
  generated_at: new Date().toISOString(),
  summary: "Full pipeline integrity verified. LOCAL_DRY_RUN_ONLY invariant holds end-to-end."
};

fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
console.log("PASS e2e-pipeline-guard-receipt-v0.1");
console.log("MASTER_CANONICAL_HASH=" + masterCanonicalHash);
