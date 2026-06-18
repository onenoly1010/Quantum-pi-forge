const { normalize } = require("../normalization/normalization-engine-v0_1.cjs");
const { classifyIntent } = require("../classifier/protocol-intent-classifier-v0_1.cjs");

function buildAdapterPayload(rawIntent) {
  return {
    adapter: "protocol-adapter-layer-v1",
    mode: "DRY_RUN_ONLY",
    chain: rawIntent.chain || "0G_ARISTOTLE_MAINNET",
    target: rawIntent.target || "protocol-interface",
    action: rawIntent.action || "read_status",
    requested_operation: rawIntent.requested_operation || "local_simulation",
    payload: rawIntent.payload || {},
    dry_run: true,
    private_key_loaded: false,
    rpc_mutation_attempted: false,
    signing_attempted: false,
    deployment_attempted: false,
    funding_attempted: false,
    liquidity_attempted: false,
    live_execution_authorized: false,
    future_operational_gate_required: true
  };
}

function runProtocolPipeline(rawIntent) {
  const adapterPayload = buildAdapterPayload(rawIntent || {});
  const normalizationInput = {
    kind: "evidence_receipt",
    version: "v0.1",
    payload: adapterPayload
  };

  const normalizationResult = normalize(normalizationInput);
  if (normalizationResult.accepted !== true) {
    return {
      accepted: false,
      quarantine: true,
      stage: "normalization",
      mode: "LOCAL_DRY_RUN_ONLY",
      adapter_payload: adapterPayload,
      normalization: normalizationResult,
      classification: null,
      rpc_mutation_attempted: false,
      signing_attempted: false,
      deployment_attempted: false,
      funding_attempted: false,
      liquidity_attempted: false,
      live_execution_authorized: false
    };
  }

  const classificationResult = classifyIntent(normalizationResult.normalized);
  const accepted = classificationResult.accepted === true;

  return {
    accepted,
    quarantine: !accepted,
    stage: "complete",
    mode: "LOCAL_DRY_RUN_ONLY",
    orchestrator: "ProtocolPipelineOrchestrator",
    adapter_payload: adapterPayload,
    normalization: {
      accepted: normalizationResult.accepted,
      quarantine: normalizationResult.quarantine,
      canonical_hash: normalizationResult.canonical_hash,
      normalized_object: normalizationResult.normalized
    },
    classification: classificationResult,
    rpc_mutation_attempted: false,
    signing_attempted: false,
    deployment_attempted: false,
    funding_attempted: false,
    liquidity_attempted: false,
    live_execution_authorized: false,
    future_operational_gate_required: true
  };
}

module.exports = {
  runProtocolPipeline,
  buildAdapterPayload
};
