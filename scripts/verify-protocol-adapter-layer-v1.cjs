const fs = require("fs");

const doc = fs.readFileSync("docs/architecture/PROTOCOL_ADAPTER_LAYER_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/protocol/protocol-adapter-dry-run-v1.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL protocol-adapter-layer-v1:", message);
    process.exit(1);
  }
}

assert(doc.includes("PROTOCOL_ADAPTER_LAYER_V1=true"), "missing layer assertion");
assert(doc.includes("MODE=DRY_RUN_ONLY"), "missing dry-run mode");
assert(doc.includes("RPC_MUTATION_AUTHORIZED=false"), "missing rpc mutation denial");
assert(doc.includes("SIGNING_AUTHORIZED=false"), "missing signing denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("FUNDING_AUTHORIZED=false"), "missing funding denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(receipt.receipt === "protocol-adapter-dry-run-v1", "receipt name mismatch");
assert(receipt.mode === "DRY_RUN_ONLY", "mode mismatch");
assert(receipt.normalized === true, "intent was not normalized");
assert(receipt.dry_run === true, "dry run must be true");
assert(receipt.private_key_loaded === false, "private key must not be loaded");
assert(receipt.rpc_mutation_attempted === false, "rpc mutation must not be attempted");
assert(receipt.signing_attempted === false, "signing must not be attempted");
assert(receipt.deployment_attempted === false, "deployment must not be attempted");
assert(receipt.funding_attempted === false, "funding must not be attempted");
assert(receipt.liquidity_attempted === false, "liquidity must not be attempted");
assert(receipt.live_execution_authorized === false, "live execution must not be authorized");
assert(receipt.future_operational_gate_required === true, "future gate must be required");
assert(receipt.classification.requires_signing === false, "classification signing mismatch");
assert(receipt.classification.requires_rpc_mutation === false, "classification rpc mutation mismatch");
assert(receipt.classification.requires_deployment === false, "classification deployment mismatch");
assert(receipt.classification.requires_funding === false, "classification funding mismatch");
assert(receipt.classification.requires_liquidity === false, "classification liquidity mismatch");
console.log("PASS protocol-adapter-layer-v1");
