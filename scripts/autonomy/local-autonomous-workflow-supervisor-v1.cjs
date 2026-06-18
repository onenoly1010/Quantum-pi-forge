const fs = require("fs");
const path = require("path");

const queuePath = ".qpf-autonomy/objective-queue-v1.json";
const runPath = ".qpf-autonomy/autonomy-run-state-v1.json";

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));

const forbiddenAffirmative = [
  "DEPLOYMENT_AUTHORIZED=true",
  "FUNDS_MOVEMENT_AUTHORIZED=true",
  "WALLET_SIGNING_AUTHORIZED=true",
  "PRIVATE_KEY_ACCESS_AUTHORIZED=true",
  "SEED_PHRASE_ACCESS_AUTHORIZED=true",
  "TOKEN_APPROVAL_AUTHORIZED=true",
  "BRIDGE_AUTHORIZED=true",
  "LIQUIDITY_AUTHORIZED=true",
  "MAINNET_MUTATION_AUTHORIZED=true",
  "forge script --broadcast",
  "cast send",
  "addLiquidity("
];

function scanText(text) {
  return forbiddenAffirmative.filter((term) => text.includes(term));
}

function scanRepo() {
  const targets = [
    "docs/governance/LOCAL_AUTONOMOUS_WORKFLOW_SUPERVISOR_V1.md",
    "receipts/governance/local-autonomous-workflow-supervisor-v1.json",
    ".qpf-autonomy/objective-queue-v1.json"
  ];
  const findings = [];
  for (const target of targets) {
    if (!fs.existsSync(target)) findings.push({ target, missing: true });
    else {
      const hits = scanText(fs.readFileSync(target, "utf8"));
      if (hits.length) findings.push({ target, forbidden: hits });
    }
  }
  return findings;
}

const findings = scanRepo();
const state = {
  run: "local-autonomous-workflow-supervisor-v1",
  mode: "BOUNDED_LOCAL_AUTONOMY",
  queue_total: queue.queue.length,
  assigned_objectives: queue.queue.map((item) => item.id),
  blocked_live_actions: true,
  local_ai_workflow_ready: findings.length === 0,
  findings,
  next_safe_action: "Run objective-specific local artifact generation for A-E under the blocked live-action policy.",
  updated_at: new Date().toISOString()
};

fs.writeFileSync(runPath, JSON.stringify(state, null, 2) + "\n");
if (findings.length) {
  console.error("FAIL local-autonomous-workflow-supervisor-v1");
  console.error(JSON.stringify(state, null, 2));
  process.exit(1);
}
console.log("PASS local-autonomous-workflow-supervisor-v1");
