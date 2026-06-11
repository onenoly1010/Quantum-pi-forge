const fs = require("fs");

const doc = fs.readFileSync("docs/autonomous/SUPERVISED_AUTONOMOUS_DRY_RUN_V1.md", "utf8");
const receipt = JSON.parse(
  fs.readFileSync("receipts/autonomous/supervised-autonomous-dry-run-v1.json", "utf8")
);

const requiredDoc = [
  "does not activate the quarantined autonomous-agent bundle",
  "does not install a systemd service",
  "does not run infinite loops",
  "does not use credentials",
  "does not perform wallet transactions",
  "does not mutate protected branches",
  "does not post publicly",
  "does not claim full autonomous network operation",
  "exit cleanly"
];

for (const text of requiredDoc) {
  if (!doc.includes(text)) {
    throw new Error(`doc missing required boundary text: ${text}`);
  }
}

const requiredReceipt = {
  receipt: "supervised-autonomous-dry-run-v1",
  status: "sealed",
  starting_main_commit: "6e17116",
  quarantined_agent_bundle_activated: false,
  systemd_service_installed: false,
  infinite_loop_enabled: false,
  credentials_used: false,
  wallet_transaction_performed: false,
  protected_branch_mutation_performed: false,
  public_posting_performed: false,
  network_write_performed: false,
  git_commit_performed_by_agent: false,
  git_push_performed_by_agent: false,
  full_autonomous_network_claimed: false,
  operator_supervision_required: true,
  dry_run_scope: "local-supervised-non-mutating-observation"
};

for (const [key, value] of Object.entries(requiredReceipt)) {
  if (receipt[key] !== value) {
    throw new Error(`${key} expected ${value} got ${receipt[key]}`);
  }
}

console.log("PASS supervised-autonomous-dry-run-v1");
