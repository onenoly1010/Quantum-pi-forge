const fs = require("fs");
const path = require("path");
const { runProtocolPipeline } = require("../../scripts/orchestrator/protocol-pipeline-orchestrator-v0_1.cjs");

const receiptPath = path.join("receipts", "orchestrator", "protocol-pipeline-orchestrator-v0_1-tests.json");

const cases = [
  {
    name: "allow-local-read-simulation",
    input: { action: "read_status", requested_operation: "local_simulation", payload: { receipt: "demo" } },
    accepted: true
  },
  {
    name: "reject-deploy-request",
    input: { action: "deploy_contract", requested_operation: "future_deploy", payload: {} },
    accepted: false
  },
  {
    name: "reject-execute-request",
    input: { action: "execute_live_request", requested_operation: "execute", payload: {} },
    accepted: false
  },
  {
    name: "reject-sign-request",
    input: { action: "sign_message", requested_operation: "sign", payload: {} },
    accepted: false
  },
  {
    name: "reject-funding-request",
    input: { action: "fund_wallet", requested_operation: "fund", payload: {} },
    accepted: false
  },
  {
    name: "reject-liquidity-request",
    input: { action: "add_liquidity", requested_operation: "liquidity", payload: {} },
    accepted: false
  }
];

const results = cases.map((item) => {
  const result = runProtocolPipeline(item.input);
  if (result.accepted !== item.accepted) {
    console.error("FAIL protocol-pipeline-orchestrator-v0.1:", item.name, "acceptance mismatch");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  if (result.rpc_mutation_attempted !== false || result.signing_attempted !== false || result.deployment_attempted !== false || result.funding_attempted !== false || result.liquidity_attempted !== false || result.live_execution_authorized !== false) {
    console.error("FAIL protocol-pipeline-orchestrator-v0.1:", item.name, "dry-run boundary violated");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  return {
    name: item.name,
    accepted: result.accepted,
    quarantine: result.quarantine,
    stage: result.stage,
    canonical_hash: result.normalization && result.normalization.canonical_hash,
    classification: result.classification && result.classification.classification
  };
});

const receipt = {
  receipt: "protocol-pipeline-orchestrator-v0.1-tests",
  orchestrator: "ProtocolPipelineOrchestrator",
  mode: "LOCAL_DRY_RUN_ONLY",
  gate_mode: "ACTIVE_DEVELOPMENT",
  total_cases: results.length,
  accepted_cases: results.filter((item) => item.accepted).length,
  quarantined_cases: results.filter((item) => item.quarantine).length,
  sequenced_adapter: true,
  sequenced_normalization: true,
  sequenced_classifier_guard: true,
  rpc_mutation_attempted: false,
  signing_attempted: false,
  deployment_attempted: false,
  funding_attempted: false,
  liquidity_attempted: false,
  live_execution_authorized: false,
  future_operational_gate_required: true,
  results
};

fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
console.log("PASS protocol-pipeline-orchestrator-v0.1-tests");
