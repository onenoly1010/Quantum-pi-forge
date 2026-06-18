const fs = require("fs");

const doc = fs.readFileSync("docs/architecture/NORMALIZATION_ENGINE_V0_1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/normalization/normalization-engine-v0_1-tests.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL verify-normalization-engine-v0.1:", message);
    process.exit(1);
  }
}

assert(doc.includes("NORMALIZATION_ENGINE_V0_1=true"), "missing engine assertion");
assert(doc.includes("MODE=LOCAL_DRY_RUN_ONLY"), "missing local dry-run mode");
assert(doc.includes("RPC_MUTATION_AUTHORIZED=false"), "missing rpc denial");
assert(doc.includes("SIGNING_AUTHORIZED=false"), "missing signing denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("FUNDING_AUTHORIZED=false"), "missing funding denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(receipt.receipt === "normalization-engine-v0.1-tests", "receipt mismatch");
assert(receipt.mode === "LOCAL_DRY_RUN_ONLY", "mode mismatch");
assert(receipt.total_cases === 9, "expected 9 cases");
assert(receipt.accepted_cases === 5, "expected 5 accepted cases");
assert(receipt.quarantined_cases === 4, "expected 4 quarantined cases");
assert(receipt.rpc_mutation_attempted === false, "rpc mutation must remain false");
assert(receipt.signing_attempted === false, "signing must remain false");
assert(receipt.deployment_attempted === false, "deployment must remain false");
assert(receipt.funding_attempted === false, "funding must remain false");
assert(receipt.liquidity_attempted === false, "liquidity must remain false");
console.log("PASS verify-normalization-engine-v0.1");
