#!/usr/bin/env node
const fs = require("fs");
const receipt = JSON.parse(fs.readFileSync("receipts/autonomous/autonomous-runner-observation-v1.json", "utf8"));
function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exit(1);
  }
}
assert(receipt.receipt_version === "autonomous-runner-observation-v1", "wrong receipt version");
assert(receipt.status === "observed", "status must be observed");
assert(receipt.relationship.readiness_pr === 188, "must reference PR #188");
assert(receipt.relationship.readiness_pr_merged === false, "PR #188 must remain unmerged");
assert(receipt.claim.local_execution_observed === true, "local execution must be observed");
assert(receipt.claim.autonomous_readiness_exists === true, "readiness must exist");
assert(receipt.claim.full_autonomous_network_live === false, "must not claim full autonomy");
assert(receipt.claim.external_review_claimed === false, "must not claim external review");
assert(receipt.claim.github_hosted_ci_authoritative === false, "hosted CI must not be authoritative here");
assert(receipt.claim.protected_branch_mutated === false, "protected branch must not be mutated");
assert(receipt.claim.funds_or_tokens_moved === false, "funds or tokens must not move");
assert(receipt.claim.contracts_deployed === false, "contracts must not be deployed");
assert(receipt.github_check_state_observed.local_receipt_verifier === "PASS", "local verifier must pass");
assert(Array.isArray(receipt.next_required_evidence), "next evidence must be listed");
console.log("PASS: autonomous runner observation v1 receipt is honest and bounded");
