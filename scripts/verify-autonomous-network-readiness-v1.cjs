#!/usr/bin/env node
const fs = require("fs");
const receipt = JSON.parse(fs.readFileSync("receipts/autonomous/autonomous-network-readiness-v1.json", "utf8"));
function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exit(1);
  }
}
assert(receipt.receipt_version === "autonomous-network-readiness-v1", "wrong receipt version");
assert(receipt.status === "prepared", "status must be prepared");
assert(receipt.claim.sealed_history_exists === true, "sealed history must be true");
assert(receipt.claim.pr_186_merged === true, "PR #186 must be marked merged");
assert(receipt.claim.pr_187_merged === true, "PR #187 must be marked merged");
assert(receipt.claim.selfhosted_runner_proof_exists === true, "runner proof must be true");
assert(receipt.claim.branch_protection_restored === true, "branch protection restored must be true");
assert(receipt.claim.autonomous_network_readiness_lane_created === true, "readiness lane must be true");
assert(receipt.claim.full_autonomous_network_live === false, "must not falsely claim full autonomy");
assert(Array.isArray(receipt.next_required_evidence), "next evidence must be listed");
assert(receipt.next_required_evidence.length >= 4, "next evidence list incomplete");
assert(Array.isArray(receipt.forbidden_claims), "forbidden claims must be listed");
console.log("PASS: autonomous network readiness v1 receipt is honest and bounded");
