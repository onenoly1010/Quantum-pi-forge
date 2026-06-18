const fs = require("fs");

const doc = fs.readFileSync("docs/architecture/PROTOCOL_ADAPTER_NORMALIZATION_PIPELINE_V0_1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/pipeline/protocol-adapter-normalization-pipeline-v0_1.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL verify-protocol-adapter-normalization-pipeline-v0.1:", message);
    process.exit(1);
  }
}

assert(doc.includes("PROTOCOL_ADAPTER_NORMALIZATION_PIPELINE_V0_1=true"), "missing pipeline assertion");
assert(doc.includes("MODE=LOCAL_DRY_RUN_ONLY"), "missing local dry-run mode");
assert(doc.includes("COMPOSES_PROTOCOL_ADAPTER=true"), "missing adapter composition assertion");
assert(doc.includes("COMPOSES_NORMALIZATION_ENGINE=true"), "missing normalization composition assertion");
assert(doc.includes("RPC_MUTATION_AUTHORIZED=false"), "missing rpc denial");
assert(doc.includes("SIGNING_AUTHORIZED=false"), "missing signing denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("FUNDING_AUTHORIZED=false"), "missing funding denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(receipt.receipt === "protocol-adapter-normalization-pipeline-v0.1", "receipt mismatch");
assert(receipt.mode === "LOCAL_DRY_RUN_ONLY", "mode mismatch");
assert(receipt.composed_protocol_adapter === true, "adapter not composed");
assert(receipt.composed_normalization_engine === true, "normalization engine not composed");
assert(receipt.adapter_output_accepted === true, "adapter output not accepted");
assert(receipt.normalized === true, "pipeline did not normalize");
assert(typeof receipt.canonical_hash === "string" && receipt.canonical_hash.length === 64, "canonical hash invalid");
assert(receipt.rpc_mutation_attempted === false, "rpc mutation must remain false");
assert(receipt.signing_attempted === false, "signing must remain false");
assert(receipt.deployment_attempted === false, "deployment must remain false");
assert(receipt.funding_attempted === false, "funding must remain false");
assert(receipt.liquidity_attempted === false, "liquidity must remain false");
assert(receipt.live_execution_authorized === false, "live execution must remain false");
assert(receipt.future_operational_gate_required === true, "future operational gate must remain required");
console.log("PASS verify-protocol-adapter-normalization-pipeline-v0.1");
