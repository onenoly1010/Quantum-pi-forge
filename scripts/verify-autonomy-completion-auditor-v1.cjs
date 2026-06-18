const fs = require("fs");
const receipt = JSON.parse(fs.readFileSync("receipts/governance/autonomy-completion-auditor-v1.json", "utf8"));
function assert(condition, message) { if (!condition) { console.error("FAIL verify-autonomy-completion-auditor-v1:", message); process.exit(1); } }
assert(receipt.receipt === "autonomy-completion-auditor-v1", "receipt mismatch");
assert(receipt.mode === "LOCAL_AUDIT_ONLY", "mode mismatch");
assert(receipt.supervisor_canonical === true, "supervisor must be canonical");
assert(receipt.worker_loop_canonical === true, "worker loop must be canonical");
assert(receipt.objective_a_complete === true, "A incomplete");
assert(receipt.objective_b_custody_lane_external === true, "B lane missing");
assert(receipt.objective_c_complete === true, "C incomplete");
assert(receipt.objective_d_complete === true, "D incomplete");
assert(receipt.objective_e_complete === true, "E incomplete");
assert(receipt.live_actions_authorized === false, "live actions must remain false");
assert(receipt.wallet_signing_authorized === false, "wallet signing must remain false");
assert(receipt.funds_movement_authorized === false, "funds movement must remain false");
assert(receipt.mainnet_mutation_authorized === false, "mainnet mutation must remain false");
console.log("PASS verify-autonomy-completion-auditor-v1");
