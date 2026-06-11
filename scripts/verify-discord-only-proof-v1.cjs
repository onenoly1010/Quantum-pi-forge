const fs = require("fs");

const receipt = JSON.parse(
  fs.readFileSync("receipts/press-agent/discord-only-proof-v1.json", "utf8")
);

const required = {
  receipt: "discord-only-proof-v1",
  status: "sealed",
  pr_196_merged: true,
  press_agent_governance_safe_template_on_main: true,
  discord_webhook_proof_succeeded: true,
  x_twitter_live_posting_enabled: false,
  telegram_posting_enabled: false,
  wallet_transaction_performed: false,
  protected_branch_mutation_performed: false,
  full_autonomous_network_claimed: false,
  operator_supervision_required: true
};

for (const [key, value] of Object.entries(required)) {
  if (receipt[key] !== value) {
    throw new Error(`${key} expected ${value} got ${receipt[key]}`);
  }
}

if (!receipt.main_commit || typeof receipt.main_commit !== "string") {
  throw new Error("main_commit missing");
}

console.log("PASS discord-only-proof-v1");
