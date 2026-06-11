const fs = require("fs");

const script = fs.readFileSync("scripts/supervised-autonomous-dry-run-v1.cjs", "utf8");
const gitignore = fs.readFileSync(".gitignore", "utf8");
const doc = fs.readFileSync("docs/autonomous/DRY_RUN_OUTPUT_HYGIENE_V1.md", "utf8");
const receipt = JSON.parse(
  fs.readFileSync("receipts/autonomous/dry-run-output-hygiene-v1.json", "utf8")
);

if (!script.includes(".qpf-runtime/autonomous/supervised-autonomous-dry-run-v1.latest.json")) {
  throw new Error("dry-run script must write runtime report under .qpf-runtime/autonomous");
}

if (script.includes('fs.writeFileSync(\\n  "reports/autonomous/supervised-autonomous-dry-run-v1.report.json"')) {
  throw new Error("dry-run script still writes to tracked sealed sample report");
}

if (!gitignore.split(/\r?\n/).includes(".qpf-runtime/")) {
  throw new Error(".gitignore must include .qpf-runtime/");
}

const requiredDoc = [
  "The supervised autonomous dry-run script must be executable without dirtying tracked report files.",
  ".qpf-runtime/autonomous/supervised-autonomous-dry-run-v1.latest.json",
  "reports/autonomous/supervised-autonomous-dry-run-v1.report.json",
  "tracked_report_mutated_by_runtime == false"
];

for (const text of requiredDoc) {
  if (!doc.includes(text)) {
    throw new Error(`doc missing required text: ${text}`);
  }
}

const requiredReceipt = {
  receipt: "dry-run-output-hygiene-v1",
  status: "sealed",
  script: "scripts/supervised-autonomous-dry-run-v1.cjs",
  sealed_sample_report: "reports/autonomous/supervised-autonomous-dry-run-v1.report.json",
  runtime_report: ".qpf-runtime/autonomous/supervised-autonomous-dry-run-v1.latest.json",
  runtime_directory_gitignored: true,
  tracked_report_mutated_by_runtime: false,
  network_write_performed: false,
  public_posting_performed: false,
  wallet_transaction_performed: false,
  protected_branch_mutation_performed: false,
  git_commit_performed_by_agent: false,
  git_push_performed_by_agent: false,
  credentials_used: false,
  systemd_service_installed: false,
  infinite_loop_enabled: false,
  full_autonomous_network_claimed: false
};

for (const [key, value] of Object.entries(requiredReceipt)) {
  if (receipt[key] !== value) {
    throw new Error(`${key} expected ${value} got ${receipt[key]}`);
  }
}

console.log("PASS dry-run-output-hygiene-v1");
