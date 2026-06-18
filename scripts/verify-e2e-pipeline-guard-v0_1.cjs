const fs = require("fs");

const doc = fs.readFileSync("docs/architecture/E2E_PIPELINE_GUARD_RECEIPT_V0_1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/pipeline/e2e-pipeline-guard-receipt-v0_1.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL verify-e2e-pipeline-guard-v0.1:", message);
    process.exit(1);
  }
}

assert(doc.includes("E2E_PIPELINE_GUARD_RECEIPT_V0_1=true"), "missing e2e assertion");
assert(doc.includes("MODE=LOCAL_DRY_RUN_ONLY"), "missing local dry-run mode");
assert(doc.includes("USES_PROTOCOL_PIPELINE_ORCHESTRATOR=true"), "missing orchestrator assertion");
assert(doc.includes("RPC_MUTATION_AUTHORIZED=false"), "missing rpc denial");
assert(doc.includes("SIGNING_AUTHORIZED=false"), "missing signing denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("FUNDING_AUTHORIZED=false"), "missing funding denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(doc.includes("LIVE_EXECUTION_AUTHORIZED=false"), "missing live execution denial");
assert(receipt.receipt === "e2e-pipeline-guard-receipt-v0.1", "receipt name mismatch");
assert(receipt.mode === "LOCAL_DRY_RUN_ONLY", "mode mismatch");
assert(receipt.gate_mode === "ACTIVE_DEVELOPMENT", "gate mismatch");
assert(receipt.uses_protocol_pipeline_orchestrator === true, "orchestrator not used");
assert(receipt.total_cases === 6, "expected 6 cases");
assert(receipt.accepted_cases === 1, "expected 1 accepted case");
assert(receipt.quarantined_cases === 5, "expected 5 quarantined cases");
assert(receipt.chain_of_custody.adapter_stage_represented === true, "adapter chain broken");
assert(receipt.chain_of_custody.normalization_stage_passed === true, "normalization chain broken");
assert(receipt.chain_of_custody.classifier_guard_stage_passed === true, "classifier chain broken");
assert(receipt.chain_of_custody.orchestrator_stage_passed === true, "orchestrator chain broken");
assert(receipt.invariants.private_keys_loaded === false, "private key leak");
assert(receipt.invariants.live_execution_authorized === false, "live execution leak");
assert(receipt.invariants.signing_attempted === false, "signing leak");
assert(receipt.invariants.rpc_mutation_attempted === false, "rpc mutation leak");
assert(receipt.invariants.deployment_attempted === false, "deployment leak");
assert(receipt.invariants.funding_attempted === false, "funding leak");
assert(receipt.invariants.liquidity_attempted === false, "liquidity leak");
assert(receipt.invariants.future_operational_gate_required === true, "future gate not required");
assert(typeof receipt.master_canonical_hash === "string" && receipt.master_canonical_hash.length === 64, "invalid master canonical hash");

const accepted = receipt.results.filter((item) => item.accepted).map((item) => item.name);
const quarantined = receipt.results.filter((item) => item.quarantine).map((item) => item.name);
assert(accepted.includes("accept-safe-local-governance-simulation"), "safe case not accepted");
for (const required of ["quarantine-deploy-intent", "quarantine-execute-intent", "quarantine-sign-intent", "quarantine-funding-intent", "quarantine-liquidity-intent"]) {
  assert(quarantined.includes(required), "missing quarantined case " + required);
}

console.log("PASS verify-e2e-pipeline-guard-v0.1");
