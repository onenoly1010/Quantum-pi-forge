const fs = require("fs");

const doc = fs.readFileSync("docs/security/COLD_STORAGE_CUSTODY_ONBOARDING_GATE_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/security/cold-storage-custody-onboarding-gate-v1.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL cold-storage-custody-onboarding-gate-v1:", message);
    process.exit(1);
  }
}

assert(doc.includes("COLD_STORAGE_CUSTODY_ONBOARDING_GATE_V1=true"), "missing gate assertion");
assert(doc.includes("MODE=CUSTODY_PREPARATION_ONLY"), "missing custody-only mode");
assert(doc.includes("SEED_PHRASE_ONLINE=false"), "missing seed phrase online denial");
assert(doc.includes("PRIVATE_KEY_EXPORT_ALLOWED=false"), "missing private key export denial");
assert(doc.includes("FUNDS_MOVEMENT_AUTHORIZED=false"), "missing funds movement denial");
assert(doc.includes("WALLET_SIGNING_AUTHORIZED=false"), "missing wallet signing denial");
assert(doc.includes("RPC_MUTATION_AUTHORIZED=false"), "missing rpc mutation denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(doc.includes("TOKEN_APPROVAL_AUTHORIZED=false"), "missing token approval denial");
assert(doc.includes("MAINNET_MUTATION_AUTHORIZED=false"), "missing mainnet mutation denial");
assert(receipt.receipt === "cold-storage-custody-onboarding-gate-v1", "receipt mismatch");
assert(receipt.mode === "CUSTODY_PREPARATION_ONLY", "mode mismatch");
assert(receipt.device_receipt_pending === true, "device receipt should be pending");
assert(receipt.public_address_pending === true, "public address should be pending");
assert(receipt.seed_phrase_online === false, "seed phrase must remain offline");
assert(receipt.private_key_export_allowed === false, "private key export must remain false");
assert(receipt.funds_movement_authorized === false, "funds movement must remain false");
assert(receipt.wallet_signing_authorized === false, "wallet signing must remain false");
assert(receipt.rpc_mutation_authorized === false, "rpc mutation must remain false");
assert(receipt.deployment_authorized === false, "deployment must remain false");
assert(receipt.liquidity_authorized === false, "liquidity must remain false");
assert(receipt.token_approval_authorized === false, "token approval must remain false");
assert(receipt.mainnet_mutation_authorized === false, "mainnet mutation must remain false");
assert(receipt.future_operational_custody_gate_required === true, "future custody gate must be required");
console.log("PASS cold-storage-custody-onboarding-gate-v1");
