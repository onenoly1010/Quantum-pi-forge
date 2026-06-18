const fs = require("fs");

const doc = fs.readFileSync("docs/architecture/PROTOCOL_INTENT_CLASSIFIER_EXECUTION_GUARD_V0_1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/classifier/protocol-intent-classifier-v0_1-tests.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL verify-protocol-intent-classifier-v0.1:", message);
    process.exit(1);
  }
}

assert(doc.includes("PROTOCOL_INTENT_CLASSIFIER_V0_1=true"), "missing classifier assertion");
assert(doc.includes("EXECUTION_GUARD_V0_1=true"), "missing guard assertion");
assert(doc.includes("MODE=LOCAL_DRY_RUN_ONLY"), "missing local dry-run mode");
assert(doc.includes("RPC_MUTATION_AUTHORIZED=false"), "missing rpc denial");
assert(doc.includes("SIGNING_AUTHORIZED=false"), "missing signing denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("FUNDING_AUTHORIZED=false"), "missing funding denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(doc.includes("LIVE_EXECUTION_AUTHORIZED=false"), "missing live execution denial");
assert(receipt.receipt === "protocol-intent-classifier-v0.1-tests", "receipt mismatch");
assert(receipt.mode === "LOCAL_DRY_RUN_ONLY", "mode mismatch");
assert(receipt.gate_mode === "ACTIVE_DEVELOPMENT", "gate mismatch");
assert(receipt.total_cases === 8, "expected 8 cases");
assert(receipt.accepted_cases === 4, "expected 4 accepted cases");
assert(receipt.quarantined_cases === 4, "expected 4 quarantined cases");
assert(receipt.rpc_mutation_attempted === false, "rpc mutation must remain false");
assert(receipt.signing_attempted === false, "signing must remain false");
assert(receipt.deployment_attempted === false, "deployment must remain false");
assert(receipt.funding_attempted === false, "funding must remain false");
assert(receipt.liquidity_attempted === false, "liquidity must remain false");
assert(receipt.live_execution_authorized === false, "live execution must remain false");

const rejectedNames = receipt.results.filter((item) => item.quarantine).map((item) => item.name);
for (const required of ["reject-deploy-action", "reject-execute-action", "reject-forced-live-flag", "reject-unsupported-normalization-mode"]) {
  assert(rejectedNames.includes(required), "missing quarantined case " + required);
}

console.log("PASS verify-protocol-intent-classifier-v0.1");
