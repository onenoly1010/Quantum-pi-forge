const fs = require("fs");

const doc = fs.readFileSync("docs/architecture/PROTOCOL_PIPELINE_ORCHESTRATOR_V0_1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/orchestrator/protocol-pipeline-orchestrator-v0_1-tests.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL verify-protocol-pipeline-orchestrator-v0.1:", message);
    process.exit(1);
  }
}

assert(doc.includes("PROTOCOL_PIPELINE_ORCHESTRATOR_V0_1=true"), "missing orchestrator assertion");
assert(doc.includes("DRY_RUN_COORDINATOR_V0_1=true"), "missing dry-run coordinator assertion");
assert(doc.includes("MODE=LOCAL_DRY_RUN_ONLY"), "missing local dry-run mode");
assert(doc.includes("SEQUENCES_ADAPTER=true"), "missing adapter sequencing assertion");
assert(doc.includes("SEQUENCES_NORMALIZATION=true"), "missing normalization sequencing assertion");
assert(doc.includes("SEQUENCES_CLASSIFIER_GUARD=true"), "missing classifier guard sequencing assertion");
assert(doc.includes("RPC_MUTATION_AUTHORIZED=false"), "missing rpc denial");
assert(doc.includes("SIGNING_AUTHORIZED=false"), "missing signing denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("FUNDING_AUTHORIZED=false"), "missing funding denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(doc.includes("LIVE_EXECUTION_AUTHORIZED=false"), "missing live execution denial");
assert(receipt.receipt === "protocol-pipeline-orchestrator-v0.1-tests", "receipt mismatch");
assert(receipt.orchestrator === "ProtocolPipelineOrchestrator", "orchestrator mismatch");
assert(receipt.mode === "LOCAL_DRY_RUN_ONLY", "mode mismatch");
assert(receipt.gate_mode === "ACTIVE_DEVELOPMENT", "gate mismatch");
assert(receipt.total_cases === 6, "expected 6 cases");
assert(receipt.accepted_cases === 1, "expected 1 accepted case");
assert(receipt.quarantined_cases === 5, "expected 5 quarantined cases");
assert(receipt.sequenced_adapter === true, "adapter was not sequenced");
assert(receipt.sequenced_normalization === true, "normalization was not sequenced");
assert(receipt.sequenced_classifier_guard === true, "classifier guard was not sequenced");
assert(receipt.rpc_mutation_attempted === false, "rpc mutation must remain false");
assert(receipt.signing_attempted === false, "signing must remain false");
assert(receipt.deployment_attempted === false, "deployment must remain false");
assert(receipt.funding_attempted === false, "funding must remain false");
assert(receipt.liquidity_attempted === false, "liquidity must remain false");
assert(receipt.live_execution_authorized === false, "live execution must remain false");
assert(receipt.future_operational_gate_required === true, "future operational gate must remain required");
console.log("PASS verify-protocol-pipeline-orchestrator-v0.1");
