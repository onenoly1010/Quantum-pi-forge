#!/usr/bin/env node
const fs = require("fs");
const status = JSON.parse(fs.readFileSync("public/status/autonomous-health.json", "utf8"));

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exit(1);
  }
}

assert(status.status_version === "autonomous-public-health-surface-v1", "wrong status version");
assert(status.full_autonomous_network_live === false, "must not claim full autonomy");
assert(status.governance_boundary.required_review === true, "required review must be true");
assert(status.governance_boundary.code_owner_review_required === true, "code owner review must be true");
assert(status.governance_boundary.enforce_admins === true, "enforce admins must be true");
assert(status.governance_boundary.required_linear_history === true, "linear history must be true");
assert(Array.isArray(status.open_autonomous_prs), "open PRs must be listed");
assert(status.open_autonomous_prs.length >= 2, "must list PR #188 and PR #189");

for (const pr of status.open_autonomous_prs) {
  assert(pr.state === "OPEN", `PR ${pr.number} must be open`);
  assert(pr.mergeable === "MERGEABLE", `PR ${pr.number} must be mergeable`);
  assert(pr.review_decision === "REVIEW_REQUIRED", `PR ${pr.number} must require review`);
  assert(pr.local_verifier === "PASS", `PR ${pr.number} local verifier must pass`);
}

assert(status.authority_limits.may_bypass_review_silently === false, "silent review bypass forbidden");
assert(status.authority_limits.may_move_funds_or_tokens === false, "fund/token movement forbidden");
assert(status.authority_limits.may_deploy_contracts === false, "contract deployment forbidden");
assert(status.authority_limits.may_claim_external_approval === false, "external approval claim forbidden");

console.log("PASS: autonomous public health surface is honest and bounded");
