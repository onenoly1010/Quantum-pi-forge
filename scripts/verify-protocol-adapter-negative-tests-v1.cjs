const fs = require("fs");

const receipt = JSON.parse(fs.readFileSync("receipts/protocol/protocol-adapter-negative-tests-v1.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL verify-protocol-adapter-negative-tests-v1:", message);
    process.exit(1);
  }
}

assert(receipt.receipt === "protocol-adapter-negative-tests-v1", "receipt mismatch");
assert(receipt.mode === "DRY_RUN_ONLY", "mode mismatch");
assert(receipt.total_cases === 8, "expected 8 cases");
assert(receipt.rejected_cases === 7, "expected 7 rejected cases");
assert(receipt.accepted_cases === 1, "expected 1 accepted dry-run case");
assert(receipt.live_execution_authorized === false, "live execution must remain false");
assert(receipt.signing_authorized === false, "signing must remain false");
assert(receipt.rpc_mutation_authorized === false, "rpc mutation must remain false");
assert(receipt.deployment_authorized === false, "deployment must remain false");
assert(receipt.funding_authorized === false, "funding must remain false");
assert(receipt.liquidity_authorized === false, "liquidity must remain false");

const rejectedNames = receipt.results.filter((item) => item.result.accepted === false).map((item) => item.name);
for (const required of ["reject-execution", "reject-signing", "reject-rpc-mutation", "reject-deployment", "reject-funding", "reject-liquidity", "reject-private-key"]) {
  assert(rejectedNames.includes(required), "missing rejected case " + required);
}

const allowed = receipt.results.find((item) => item.name === "allow-pure-dry-run");
assert(allowed && allowed.result.accepted === true, "pure dry-run must be accepted");

console.log("PASS verify-protocol-adapter-negative-tests-v1");
