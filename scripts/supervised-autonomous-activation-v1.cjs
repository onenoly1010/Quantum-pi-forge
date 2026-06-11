const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const now = new Date().toISOString();
const outDir = process.env.QPF_AUTONOMOUS_RECEIPT_DIR || path.join("runtime", "autonomous", "runs");
fs.mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
const liveRequested = args.includes("--live") || process.env.QPF_AUTONOMOUS_LIVE === "1";
const privateKeyPresent =
  Boolean(process.env.PRIVATE_KEY) ||
  Boolean(process.env.DEPLOYER_PRIVATE_KEY) ||
  Boolean(process.env.WALLET_PRIVATE_KEY);

const receipt = {
  schema: "qpf.autonomous.supervised_activation_run.v1",
  status: "dry_run_complete",
  command: "autonomous:supervised-activation:v1",
  timestamp: now,
  mode: "dry-run",
  live_requested: liveRequested,
  private_key_present: privateKeyPresent,
  safety: {
    irreversible_network_action_executed: false,
    irreversible_network_action_refused: true,
    private_key_access_refused: true,
    operator_override_preserved: true,
    full_autonomy_claimed: false
  },
  baseline: {
    readiness_v2_required: true,
    runner_implementation_frozen: true
  },
  conclusion: "supervised activation dry-run completed without live network action"
};

if (liveRequested) {
  receipt.status = "refused_live_mode";
  receipt.conclusion = "live mode refused by v1 safety boundary";
}

if (privateKeyPresent) {
  receipt.status = "refused_private_key_context";
  receipt.conclusion = "private key context refused by v1 safety boundary";
}

const digest = crypto
  .createHash("sha256")
  .update(JSON.stringify(receipt))
  .digest("hex");

receipt.receipt_sha256 = digest;

const safeTimestamp = now.replace(/[:.]/g, "-");
const outPath = path.join(outDir, `supervised-activation-v1-${safeTimestamp}.json`);
fs.writeFileSync(outPath, JSON.stringify(receipt, null, 2) + "\n");

console.log("SUPERVISED_ACTIVATION_V1_RECEIPT=" + outPath);
console.log("SUPERVISED_ACTIVATION_V1_STATUS=" + receipt.status);
console.log("SUPERVISED_ACTIVATION_V1_SHA256=" + digest);

if (liveRequested || privateKeyPresent) {
  process.exit(2);
}
