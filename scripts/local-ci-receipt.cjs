#!/usr/bin/env node
/* eslint-disable no-console */

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    shell: false,
    ...opts,
  });
}

const rootResult = run("git", ["rev-parse", "--show-toplevel"]);
const ROOT = rootResult.status === 0 ? rootResult.stdout.trim() : process.cwd();

function gitText(args) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", shell: false });
  return r.status === 0 ? String(r.stdout || "").trim() : null;
}

function cmdText(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", shell: false });
  return r.status === 0 ? String(r.stdout || "").trim() : null;
}

function sha256File(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex");
}

function collectEvidenceFiles() {
  return [
    "docs/review/LOCAL_CI_RECEIPT_SCHEMA.md",
    "scripts/local-ci-receipt-default.sh",
    "docs/review/PUBLIC_REVIEW_BOUNDARY.md",
    "docs/EVIDENCE.md",
    "docs/ARCHITECTURE.md",
    "docs/ARCHITECTURE_MAP.md",
    "package.json",
    "package-lock.json",
  ]
    .map((p) => {
      const hash = sha256File(p);
      return hash ? { path: p, sha256: hash } : null;
    })
    .filter(Boolean);
}

const sep = process.argv.indexOf("--");
const command = sep >= 0 ? process.argv.slice(sep + 1) : [];

if (command.length === 0) {
  console.error("Usage: node scripts/local-ci-receipt.cjs -- <command> [args...]");
  process.exit(2);
}

const result = spawnSync(command[0], command.slice(1), {
  cwd: ROOT,
  encoding: "utf8",
  shell: false,
  stdio: "inherit",
});

const receipt = {
  schema: "quantum-pi-forge.local-ci-receipt.v1",
  generated_at_utc: new Date().toISOString(),
  repo: {
    root: ROOT,
    branch: gitText(["branch", "--show-current"]),
    commit: gitText(["rev-parse", "HEAD"]),
    status_short: gitText(["status", "--short"]) || "",
  },
  command: {
    argv: command,
    exit_code: typeof result.status === "number" ? result.status : 1,
  },
  environment: {
    node: cmdText("node", ["--version"]),
    npm: cmdText("npm", ["--version"]),
    git: cmdText("git", ["--version"]),
    platform: `${os.type()} ${os.release()} ${os.arch()}`,
  },
  evidence: {
    files: collectEvidenceFiles(),
  },
  authority_boundary: {
    authenticity_equals_authority: false,
    hosted_ci_claimed: false,
    deployment_claimed: false,
    wallet_or_chain_authority_claimed: false,
  },
};

const outDir = path.join(ROOT, "receipts", "local-ci");
fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, "latest.json");
fs.writeFileSync(outFile, JSON.stringify(receipt, null, 2) + "\n");

console.log("");
console.log("Local CI receipt written: receipts/local-ci/latest.json");
console.log("Command exit code:", receipt.command.exit_code);

process.exit(receipt.command.exit_code);
