#!/usr/bin/env node
const fs = require("fs");

const receipt = JSON.parse(fs.readFileSync("receipts/governance/pr-186-selfhosted-merge-boundary-v1.json", "utf8"));

const required = {
  status: "sealed_pre_merge_boundary",
  pr: 186,
  github_hosted_checks_passed: false,
  github_hosted_checks_failed_due_to_billing_lock: true,
  code_failure_claimed: false,
  workflow_failure_claimed: false,
  selfhosted_forgejo_pass_claimed: true,
  external_runner_pass_claimed: false,
  verifier_weakened: false,
  pr_186_merged: false,
  admin_merge_attempted: true,
  admin_merge_blocked_by_required_review: true,
  override_bounded: false,
  proof_source: "sealed_selfhosted_forgejo_pass",
  pre_merge_branch_head: "c9f3236",
  codeberg_task_observed: "6285407",
  pass_task: "6285194"
};

for (const [key, value] of Object.entries(required)) {
  if (receipt[key] !== value) {
    console.error(`FAIL: ${key} expected ${value} got ${receipt[key]}`);
    process.exit(1);
  }
}

console.log("OK: PR #186 self-hosted merge boundary receipt verified");
