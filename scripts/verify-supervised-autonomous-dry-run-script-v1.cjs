const fs = require("fs");

const script = fs.readFileSync("scripts/supervised-autonomous-dry-run-v1.cjs", "utf8");
const receipt = JSON.parse(
  fs.readFileSync("receipts/autonomous/supervised-autonomous-dry-run-script-v1.json", "utf8")
);

const forbiddenInScript = [
  "fetch(",
  "axios",
  "http.request",
  "https.request",
  "git push",
  "git commit",
  "gh pr create",
  "DISCORD_WEBHOOK_URL",
  "TWITTER_API_KEY",
  "TELEGRAM_BOT_TOKEN",
  "PRIVATE_KEY",
  "WALLET"
];

for (const text of forbiddenInScript) {
  if (script.includes(text)) {
    throw new Error(`script contains forbidden capability: ${text}`);
  }
}

const requiredReceipt = {
  receipt: "supervised-autonomous-dry-run-script-v1",
  status: "sealed",
  script: "scripts/supervised-autonomous-dry-run-v1.cjs",
  report: "reports/autonomous/supervised-autonomous-dry-run-v1.report.json",
  allowed_behavior: "local-supervised-non-mutating-observation",
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
  operator_supervision_required: true
};

for (const [key, value] of Object.entries(requiredReceipt)) {
  if (receipt[key] !== value) {
    throw new Error(`${key} expected ${value} got ${receipt[key]}`);
  }
}

if (!fs.existsSync("reports/autonomous/supervised-autonomous-dry-run-v1.report.json")) {
  throw new Error("dry-run report missing; run npm run autonomous:supervised-dry-run:v1 first");
}

const report = JSON.parse(
  fs.readFileSync("reports/autonomous/supervised-autonomous-dry-run-v1.report.json", "utf8")
);

const requiredReportFalse = [
  "network_write_performed",
  "public_posting_performed",
  "wallet_transaction_performed",
  "protected_branch_mutation_performed",
  "git_commit_performed_by_agent",
  "git_push_performed_by_agent",
  "credentials_used",
  "systemd_service_installed",
  "infinite_loop_enabled",
  "full_autonomous_network_claimed"
];

for (const key of requiredReportFalse) {
  if (report[key] !== false) {
    throw new Error(`report ${key} expected false got ${report[key]}`);
  }
}

if (report.mode !== "local-supervised-non-mutating-observation") {
  throw new Error(`unexpected report mode: ${report.mode}`);
}

console.log("PASS supervised-autonomous-dry-run-script-v1");
