const fs = require("fs");

const doc = fs.readFileSync("docs/governance/LOCAL_AUTONOMOUS_WORKFLOW_SUPERVISOR_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/governance/local-autonomous-workflow-supervisor-v1.json", "utf8"));
const queue = JSON.parse(fs.readFileSync(".qpf-autonomy/objective-queue-v1.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL verify-local-autonomous-workflow-supervisor-v1:", message);
    process.exit(1);
  }
}

assert(doc.includes("LOCAL_AUTONOMOUS_WORKFLOW_SUPERVISOR_V1=true"), "missing supervisor assertion");
assert(doc.includes("MODE=BOUNDED_LOCAL_AUTONOMY"), "missing bounded autonomy mode");
assert(doc.includes("CONTINUOUS_WORKFLOW_ENABLED=true"), "missing continuous workflow assertion");
assert(doc.includes("LOCAL_AI_ALLOWED=true"), "missing local AI assertion");
assert(doc.includes("SEED_PHRASE_ACCESS_AUTHORIZED=false"), "missing seed phrase denial");
assert(doc.includes("PRIVATE_KEY_ACCESS_AUTHORIZED=false"), "missing private key denial");
assert(doc.includes("WALLET_SIGNING_AUTHORIZED=false"), "missing wallet signing denial");
assert(doc.includes("FUNDS_MOVEMENT_AUTHORIZED=false"), "missing funds denial");
assert(doc.includes("TOKEN_APPROVAL_AUTHORIZED=false"), "missing token approval denial");
assert(doc.includes("BRIDGE_AUTHORIZED=false"), "missing bridge denial");
assert(doc.includes("DEPLOYMENT_AUTHORIZED=false"), "missing deployment denial");
assert(doc.includes("LIQUIDITY_AUTHORIZED=false"), "missing liquidity denial");
assert(doc.includes("MAINNET_MUTATION_AUTHORIZED=false"), "missing mainnet mutation denial");
assert(receipt.receipt === "local-autonomous-workflow-supervisor-v1", "receipt mismatch");
assert(receipt.mode === "BOUNDED_LOCAL_AUTONOMY", "mode mismatch");
assert(receipt.continuous_workflow_enabled === true, "continuous workflow must be enabled");
assert(receipt.local_ai_allowed === true, "local AI must be allowed");
assert(receipt.wallet_signing_authorized === false, "wallet signing must remain false");
assert(receipt.seed_phrase_access_authorized === false, "seed phrase access must remain false");
assert(receipt.private_key_access_authorized === false, "private key access must remain false");
assert(receipt.funds_movement_authorized === false, "funds movement must remain false");
assert(receipt.token_approval_authorized === false, "token approval must remain false");
assert(receipt.bridge_authorized === false, "bridge must remain false");
assert(receipt.deployment_authorized === false, "deployment must remain false");
assert(receipt.liquidity_authorized === false, "liquidity must remain false");
assert(receipt.mainnet_mutation_authorized === false, "mainnet mutation must remain false");
assert(Array.isArray(queue.queue) && queue.queue.length === 5, "expected A-E queue");
console.log("PASS verify-local-autonomous-workflow-supervisor-v1");
