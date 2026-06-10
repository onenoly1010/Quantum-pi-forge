#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (err) {
    return `ERROR: ${err.message}`;
  }
}

const now = new Date().toISOString();

const receipt = {
  schema: "autonomous-worker-monitor-attempt-v1",
  sealed_at: now,
  status: "sealed",
  baseline: {
    main_head: sh("git rev-parse HEAD"),
    branch: sh("git branch --show-current"),
    status_short: sh("git status --short"),
    latest_commits: sh("git log --oneline -5")
  },
  observations: {
    package_scripts_include_readiness_check:
      fs.readFileSync("package.json", "utf8").includes("autonomous:readiness:v1:check"),
    readiness_doc_exists:
      fs.existsSync("docs/autonomous/AUTONOMOUS_NETWORK_READINESS_V1.md"),
    readiness_receipt_exists:
      fs.existsSync("receipts/autonomous/autonomous-network-readiness-v1.json"),
    pr_188_merge_boundary_doc_exists:
      fs.existsSync("docs/governance/PR_188_AUTONOMOUS_READINESS_MERGE_BOUNDARY_V1.md"),
    pr_188_merge_boundary_receipt_exists:
      fs.existsSync("receipts/governance/pr-188-autonomous-readiness-merge-boundary-v1.json")
  },
  claims: {
    worker_monitor_attempt_recorded: true,
    local_observation_only: true,
    protected_state_mutated: false,
    autonomous_push_performed: false,
    autonomous_merge_performed: false,
    wallet_or_chain_transaction_performed: false,
    full_autonomous_network_live: false,
    operator_override_required: true,
    receipt_written: true,
    false_authority_claimed: false,
    hosted_ci_authoritative: false
  },
  next_lane: "ops/autonomous-worker-loop-dry-run-v1"
};

fs.writeFileSync(
  "receipts/autonomous/autonomous-worker-monitor-attempt-v1.json",
  JSON.stringify(receipt, null, 2) + "\n"
);

console.log("WROTE receipts/autonomous/autonomous-worker-monitor-attempt-v1.json");
