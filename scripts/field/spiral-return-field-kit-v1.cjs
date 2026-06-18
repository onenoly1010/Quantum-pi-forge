#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const childProcess = require("child_process");

const LOG_DIR = path.join("logs", "field", "attestations");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = canonicalize(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function sha256Canonical(value) {
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

function safeExec(command, fallback) {
  try {
    return childProcess.execSync(command, {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8"
    }).trim();
  } catch {
    return fallback;
  }
}

function readBatteryState() {
  const base = "/sys/class/power_supply";
  try {
    if (!fs.existsSync(base)) return "unavailable";
    const bat = fs.readdirSync(base).find((name) => name.startsWith("BAT"));
    if (!bat) return "unavailable";
    const dir = path.join(base, bat);
    const capacity = fs.existsSync(path.join(dir, "capacity")) ? fs.readFileSync(path.join(dir, "capacity"), "utf8").trim() : "unknown";
    const status = fs.existsSync(path.join(dir, "status")) ? fs.readFileSync(path.join(dir, "status"), "utf8").trim() : "unknown";
    return { capacity_percent: capacity, status };
  } catch {
    return "unavailable";
  }
}

function readThermalState() {
  const base = "/sys/class/thermal";
  try {
    if (!fs.existsSync(base)) return "unavailable";
    return fs.readdirSync(base).filter((name) => name.startsWith("thermal_zone")).slice(0, 8).map((zone) => {
      const dir = path.join(base, zone);
      const type = fs.existsSync(path.join(dir, "type")) ? fs.readFileSync(path.join(dir, "type"), "utf8").trim() : zone;
      const raw = fs.existsSync(path.join(dir, "temp")) ? fs.readFileSync(path.join(dir, "temp"), "utf8").trim() : null;
      const celsius = raw && /^\d+$/.test(raw) ? Number(raw) / 1000 : null;
      return { zone, type, celsius };
    });
  } catch {
    return "unavailable";
  }
}

function parseArgs(argv) {
  const args = { attest: false, checkpoint: "field-checkpoint" };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--attest") args.attest = true;
    else if (argv[i] === "--checkpoint") {
      args.checkpoint = argv[i + 1] || args.checkpoint;
      i++;
    } else if (argv[i] === "--help" || argv[i] === "-h") {
      args.help = true;
    }
  }
  return args;
}

function generateAttestation(options = {}) {
  fs.mkdirSync(LOG_DIR, { recursive: true });

  const checkpoint = String(options.checkpoint || "field-checkpoint").replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  const timestamp = new Date().toISOString();
  const gitStatusShort = safeExec("git status --short", "");

  const attestation = {
    kind: "MOBILE_NODE_ATTESTATION",
    version: "v1",
    timestamp_utc: timestamp,
    checkpoint_label: checkpoint,
    canonical_head: safeExec("git rev-parse --short HEAD", "git-unavailable"),
    branch: safeExec("git branch --show-current", "branch-unavailable"),
    local_state: {
      mode: "LOCAL_ONLY_OFFLINE",
      live_execution_authorized: false,
      wallet_actions_authorized: false,
      live_transaction_signing_authorized: false,
      liquidity_authorized: false,
      deployments_authorized: false,
      automated_fees_authorized: false,
      treasury_routing_authorized: false,
      live_revenue_claim: false,
      pending_human_reconciliation: true
    },
    observables: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptime_seconds: Math.floor(os.uptime()),
      load_average: os.loadavg(),
      free_memory_bytes: os.freemem(),
      total_memory_bytes: os.totalmem(),
      battery: readBatteryState(),
      thermal: readThermalState(),
      connectivity: "not-tested-local-only",
      geo_context: "coarse-or-unavailable",
      git_status_short_sha256: crypto.createHash("sha256").update(gitStatusShort).digest("hex")
    },
    constraints: {
      wallet_access: false,
      private_key_access: false,
      hardware_wallet_hooks: false,
      outbound_network_sync: false,
      uploads_authorized: false,
      precise_geo_required: false,
      reconciliation_requires_future_gate: true
    }
  };

  const attestationHash = sha256Canonical(attestation);
  const receiptId = `mobile-attestation-${Date.now().toString(36)}-${attestationHash.slice(0, 12)}`;

  const receiptWithoutReceiptHash = {
    receipt: receiptId,
    attestation,
    attestation_sha256: attestationHash
  };

  const finalReceipt = {
    ...receiptWithoutReceiptHash,
    receipt_sha256: sha256Canonical(receiptWithoutReceiptHash)
  };

  const out = path.join(LOG_DIR, `${receiptId}.json`);
  fs.writeFileSync(out, JSON.stringify(canonicalize(finalReceipt), null, 2) + "\n");

  console.log("MOBILE_NODE_ATTESTATION_SEALED");
  console.log(`file=${out}`);
  console.log(`attestation_sha256=${attestationHash}`);
  console.log(`receipt_sha256=${finalReceipt.receipt_sha256}`);
  console.log("PENDING_HUMAN_RECONCILIATION=true");
}

function help() {
  console.log('Usage: node scripts/field/spiral-return-field-kit-v1.cjs --attest --checkpoint "departure"');
}

if (require.main === module) {
  const args = parseArgs(process.argv);
  if (args.help || !args.attest) {
    help();
    process.exit(args.help ? 0 : 1);
  }
  generateAttestation({ checkpoint: args.checkpoint });
}

module.exports = { canonicalize, sha256Canonical, generateAttestation };
