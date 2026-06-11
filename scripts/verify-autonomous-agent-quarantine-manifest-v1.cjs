const fs = require("fs");

const readme = fs.readFileSync("experimental/autonomous-agent/README.md", "utf8");
const receipt = JSON.parse(
  fs.readFileSync("receipts/autonomous/autonomous-agent-quarantine-manifest-v1.json", "utf8")
);

const requiredText = [
  "Quarantined / not enabled",
  "Do not install the systemd service yet",
  "Do not run infinite loops",
  "Do not commit API keys or wallet keys",
  "Do not perform wallet transactions",
  "Do not mutate protected branches",
  "Do not claim full autonomous network operation"
];

for (const text of requiredText) {
  if (!readme.includes(text)) {
    throw new Error(`README missing required boundary text: ${text}`);
  }
}

const requiredReceipt = {
  receipt: "autonomous-agent-quarantine-manifest-v1",
  status: "sealed",
  source_pr: 73,
  autonomous_agent_bundle_quarantined: true,
  runtime_enabled: false,
  systemd_service_installed: false,
  infinite_loop_enabled: false,
  api_keys_committed: false,
  wallet_keys_committed: false,
  wallet_transaction_performed: false,
  protected_branch_mutation_performed: false,
  full_autonomous_network_claimed: false,
  operator_supervision_required: true
};

for (const [key, value] of Object.entries(requiredReceipt)) {
  if (receipt[key] !== value) {
    throw new Error(`${key} expected ${value} got ${receipt[key]}`);
  }
}

console.log("PASS autonomous-agent-quarantine-manifest-v1");
