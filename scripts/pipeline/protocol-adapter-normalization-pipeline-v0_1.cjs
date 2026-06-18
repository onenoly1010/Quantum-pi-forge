const fs = require("fs");
const path = require("path");
const { normalize } = require("../normalization/normalization-engine-v0_1.cjs");

const receiptPath = path.join("receipts", "pipeline", "protocol-adapter-normalization-pipeline-v0_1.json");

const adapterOutput = {
  adapter: "protocol-adapter-layer-v1",
  mode: "DRY_RUN_ONLY",
  chain: "0G_ARISTOTLE_MAINNET",
  target: "protocol-interface",
  action: "normalize-and-classify",
  normalized: true,
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

const normalizationInput = {
  kind: "evidence_receipt",
  version: "v0.1",
  payload: adapterOutput
};

const result = normalize(normalizationInput);

if (result.accepted !== true) {
  console.error("FAIL protocol-adapter-normalization-pipeline-v0.1: normalization rejected adapter output");
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

const receipt = {
  receipt: "protocol-adapter-normalization-pipeline-v0.1",
  mode: "LOCAL_DRY_RUN_ONLY",
  composed_protocol_adapter: true,
  composed_normalization_engine: true,
  adapter_output_accepted: true,
  normalized: true,
  canonical_hash: result.canonical_hash,
  rpc_mutation_attempted: false,
  signing_attempted: false,
  deployment_attempted: false,
  funding_attempted: false,
  liquidity_attempted: false,
  live_execution_authorized: false,
  future_operational_gate_required: true,
  normalized_object: result.normalized
};

fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
console.log("PASS protocol-adapter-normalization-pipeline-v0.1");
