#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");

const ROOT = process.cwd();
const OUTPUT = "receipts/governance/cross-platform-determinism-manifest-v1.json";

const INCLUDE_ROOTS = [
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "next.config.js",
  "next.config.mjs",
  "tsconfig.json",
  "vite.config.js",
  "vite.config.ts",
  "hardhat.config.js",
  "hardhat.config.ts",
  "src",
  "app",
  "pages",
  "public",
  "contracts",
  "scripts",
  "docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md",
  "out"
];

const EXCLUDE = [
  ".git",
  "node_modules",
  ".next",
  ".turbo",
  "cache",
  "artifacts",
  "coverage",
  "runtime",
  "receipts/governance/cross-platform-determinism-manifest-v1.json",
  "receipts/governance/cross-platform-determinism-v1.json"
];

function exists(p) {
  return fs.existsSync(path.join(ROOT, p));
}

function isExcluded(rel) {
  return EXCLUDE.some((x) => rel === x || rel.startsWith(x + "/"));
}

function walk(rel) {
  if (!exists(rel) || isExcluded(rel)) return [];
  const abs = path.join(ROOT, rel);
  const st = fs.statSync(abs);
  if (st.isFile()) return [rel];
  if (!st.isDirectory()) return [];
  return fs.readdirSync(abs)
    .sort()
    .flatMap((name) => walk(path.join(rel, name).replace(/\\/g, "/")));
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function git(cmd) {
  try {
    return cp.execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

const files = INCLUDE_ROOTS
  .flatMap(walk)
  .filter((x, i, arr) => arr.indexOf(x) === i)
  .sort();

const entries = files.map((file) => {
  const bytes = fs.readFileSync(path.join(ROOT, file));
  return {
    path: file,
    size_bytes: bytes.length,
    sha256: sha256(bytes)
  };
});

const canonical = JSON.stringify(entries, null, 2) + "\n";
const manifest = {
  schema: "qpf.cross_platform_determinism_manifest.v1",
  generated_at_utc: new Date().toISOString(),
  posture: {
    phase: "PRE_CUTOVER_REVIEW_LOCK",
    non_executing: true,
    approval_granted: false,
    cutover_executed: false,
    deployment_executed: false,
    broadcast_executed: false,
    state_changing_transaction_executed: false
  },
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch
  },
  git: {
    branch: git("git branch --show-current"),
    commit: git("git rev-parse HEAD"),
    status_short: git("git status --short")
  },
  include_roots: INCLUDE_ROOTS,
  exclude: EXCLUDE,
  file_count: entries.length,
  manifest_hash_algorithm: "sha256(JSON.stringify(entries,null,2)+newline)",
  manifest_sha256: sha256(canonical),
  entries
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + "\n");
console.log("WROTE " + OUTPUT);
console.log("MANIFEST_SHA256 " + manifest.manifest_sha256);
console.log("FILE_COUNT " + manifest.file_count);
