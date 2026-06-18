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
  "receipts/governance/cross-platform-determinism-v1.json",
  ".env",
  ".env.*"
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

const DETERMINISTIC_BUILD_TIME = git("git show -s --format=%cI HEAD") || "1970-01-01T00:00:00+00:00";
const DETERMINISTIC_COMMIT = git("git rev-parse HEAD") || "UNKNOWN_COMMIT";

const VOLATILE_NORMALIZATION_RULES = [
  {
    id: "out-build-time-field-v1",
    scope: "out/** and public/** text artifacts",
    reason: "Generated static build metadata can encode wall-clock build time. The review boundary tests deterministic source/output structure, not local clock time.",
    appliesTo: (file) => file.startsWith("out/") || file.startsWith("public/"),
    normalize: (text) => text
      .replace(/("build_time"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_BUILD_TIME + "$3")
      .replace(/("buildTime"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_BUILD_TIME + "$3")
      .replace(/("built_at"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_BUILD_TIME + "$3")
      .replace(/("generated_at"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_BUILD_TIME + "$3")
  },
  {
    id: "version-json-commit-field-v1",
    scope: "out/**/version.json and public/**/version.json only",
    reason: "Generated version metadata can encode the local commit SHA. The review boundary pins this field to the current checked-out commit and blocks commit drift elsewhere.",
    appliesTo: (file) => (file === "out/version.json" || file.endsWith("/version.json")) && (file.startsWith("out/") || file.startsWith("public/")),
    normalize: (text) => text
      .replace(/("commit"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_COMMIT + "$3")
      .replace(/("commit_sha"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_COMMIT + "$3")
      .replace(/("commitSha"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_COMMIT + "$3")
      .replace(/("git_sha"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_COMMIT + "$3")
      .replace(/("gitSha"\s*:\s*")([^"]*)(")/g, "$1" + DETERMINISTIC_COMMIT + "$3")
  }
];

function normalizeForDeterminism(file, bytes) {
  const textLike = /\.(json|html|js|mjs|css|txt|xml|svg|map)$/i.test(file);
  if (!textLike) {
    return { bytes, normalization_ids: [] };
  }

  let text = bytes.toString("utf8");
  const applied = [];

  for (const rule of VOLATILE_NORMALIZATION_RULES) {
    if (!rule.appliesTo(file)) continue;
    const before = text;
    text = rule.normalize(text);
    if (text !== before || rule.id === "version-json-commit-field-v1") applied.push(rule.id);
  }

  return {
    bytes: Buffer.from(text, "utf8"),
    normalization_ids: applied
  };
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
  const raw = fs.readFileSync(path.join(ROOT, file));
  const normalized = normalizeForDeterminism(file, raw);
  return {
    path: file,
    size_bytes: raw.length,
    sha256: sha256(normalized.bytes),
    normalized: normalized.normalization_ids.length > 0,
    normalization_ids: normalized.normalization_ids
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
  deterministic_build_time: DETERMINISTIC_BUILD_TIME,
  deterministic_commit: DETERMINISTIC_COMMIT,
  volatile_normalization_rules: VOLATILE_NORMALIZATION_RULES.map(({ id, scope, reason }) => ({ id, scope, reason })),
  manifest_hash_algorithm: "sha256(JSON.stringify(entries,null,2)+newline) after declared volatile-field normalization",
  manifest_sha256: sha256(canonical),
  entries
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + "\n");
console.log("WROTE " + OUTPUT);
console.log("MANIFEST_SHA256 " + manifest.manifest_sha256);
console.log("FILE_COUNT " + manifest.file_count);
