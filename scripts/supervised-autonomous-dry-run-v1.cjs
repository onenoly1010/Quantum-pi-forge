const fs = require("fs");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

const startedAt = new Date().toISOString();
const mainCommit = git(["rev-parse", "HEAD"]);
const branch = git(["branch", "--show-current"]);
const status = git(["status", "--short"]);

const requiredFiles = [
  "docs/governance/CURRENT_SOVEREIGN_STATE_V1.md",
  "docs/autonomous/SUPERVISED_AUTONOMOUS_DRY_RUN_V1.md",
  "docs/autonomous/AUTONOMOUS_AGENT_QUARANTINE_MANIFEST_V1.md",
  "receipts/governance/current-sovereign-state-v1.json",
  "receipts/autonomous/supervised-autonomous-dry-run-v1.json",
  "receipts/autonomous/autonomous-agent-quarantine-manifest-v1.json"
];

const observedFiles = {};
for (const file of requiredFiles) {
  const text = readIfExists(file);
  observedFiles[file] = {
    exists: text !== null,
    sha256: text === null ? null : sha256(text)
  };
}

const report = {
  receipt: "supervised-autonomous-dry-run-script-v1",
  status: "completed",
  started_at: startedAt,
  completed_at: new Date().toISOString(),
  branch,
  main_commit: mainCommit,
  git_status_short: status,
  mode: "local-supervised-non-mutating-observation",
  network_write_performed: false,
  public_posting_performed: false,
  wallet_transaction_performed: false,
  protected_branch_mutation_performed: false,
  git_commit_performed_by_agent: false,
  git_push_performed_by_agent: false,
  credentials_used: false,
  systemd_service_installed: false,
  infinite_loop_enabled: false,
  full_autonomous_network_claimed: false,
  operator_supervision_required: true,
  observed_files: observedFiles
};

fs.mkdirSync("reports/autonomous", { recursive: true });
fs.writeFileSync(
  "reports/autonomous/supervised-autonomous-dry-run-v1.report.json",
  JSON.stringify(report, null, 2) + "\n"
);

console.log("PASS supervised-autonomous-dry-run-script-v1");
console.log(JSON.stringify({
  report: "reports/autonomous/supervised-autonomous-dry-run-v1.report.json",
  main_commit: mainCommit,
  mode: report.mode
}, null, 2));
