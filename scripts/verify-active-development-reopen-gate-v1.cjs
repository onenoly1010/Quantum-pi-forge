const fs = require("fs");
const doc = fs.readFileSync("docs/governance/ACTIVE_DEVELOPMENT_REOPEN_GATE_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/governance/active-development-reopen-gate-v1.json", "utf8"));
function assert(condition, message) {
  if (!condition) {
    console.error("FAIL active-development-reopen-gate-v1:", message);
    process.exit(1);
  }
}
assert(doc.includes("ACTIVE_DEVELOPMENT_REOPENED_FOR_NEW_BRANCH_ONLY=true"), "missing reopen assertion");
assert(doc.includes("PRIOR_FREEZE_BASELINE_PRESERVED=true"), "missing freeze preservation assertion");
assert(doc.includes("UNRESTRICTED_ITERATION_ALLOWED=false"), "missing unrestricted iteration denial");
assert(doc.includes("LIVE_RELEASE=false"), "missing live release denial");
assert(doc.includes("EXECUTION_AUTHORIZED=false"), "missing execution denial");
assert(receipt.mode === "ACTIVE_DEVELOPMENT", "receipt mode mismatch");
assert(receipt.scope === "NEW_BRANCH_ONLY", "receipt scope mismatch");
assert(receipt.prior_freeze_baseline_preserved === true, "prior freeze not preserved");
assert(receipt.unrestricted_iteration_allowed === false, "unrestricted iteration must remain false");
assert(receipt.live_release === false, "live release must remain false");
assert(receipt.execution_authorized === false, "execution must remain false");
assert(receipt.funding_authorized === false, "funding must remain false");
assert(receipt.wallet_actions_authorized === false, "wallet actions must remain false");
assert(receipt.liquidity_authorized === false, "liquidity must remain false");
assert(receipt.mainnet_mutation_authorized === false, "mainnet mutation must remain false");
console.log("PASS active-development-reopen-gate-v1");
