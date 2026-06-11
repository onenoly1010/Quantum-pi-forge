#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

const MANIFEST = "receipts/governance/cross-platform-determinism-manifest-v1.json";
const RECEIPT = "receipts/governance/cross-platform-determinism-v1.json";

function fail(msg) {
  console.error("FAIL cross-platform-determinism-v1: " + msg);
  process.exit(1);
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function normalizeForDeterminism(file, bytes, deterministicBuildTime, deterministicCommit) {
  const textLike = /\.(json|html|js|mjs|css|txt|xml|svg|map)$/i.test(file);
  if (!textLike || !(file.startsWith("out/") || file.startsWith("public/"))) {
    return { bytes, normalization_ids: [] };
  }

  let text = bytes.toString("utf8");
  const applied = [];

  const beforeTime = text;
  text = text
    .replace(/("build_time"\s*:\s*")([^"]*)(")/g, "$1" + deterministicBuildTime + "$3")
    .replace(/("buildTime"\s*:\s*")([^"]*)(")/g, "$1" + deterministicBuildTime + "$3")
    .replace(/("built_at"\s*:\s*")([^"]*)(")/g, "$1" + deterministicBuildTime + "$3")
    .replace(/("generated_at"\s*:\s*")([^"]*)(")/g, "$1" + deterministicBuildTime + "$3");
  if (text !== beforeTime) applied.push("out-build-time-field-v1");

  if ((file === "out/version.json" || file.endsWith("/version.json")) && (file.startsWith("out/") || file.startsWith("public/"))) {
    text = text
      .replace(/("commit"\s*:\s*")([^"]*)(")/g, "$1" + deterministicCommit + "$3")
      .replace(/("commit_sha"\s*:\s*")([^"]*)(")/g, "$1" + deterministicCommit + "$3")
      .replace(/("commitSha"\s*:\s*")([^"]*)(")/g, "$1" + deterministicCommit + "$3")
      .replace(/("git_sha"\s*:\s*")([^"]*)(")/g, "$1" + deterministicCommit + "$3")
      .replace(/("gitSha"\s*:\s*")([^"]*)(")/g, "$1" + deterministicCommit + "$3");
    applied.push("version-json-commit-field-v1");
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

if (!fs.existsSync(MANIFEST)) fail("missing manifest");
if (!fs.existsSync(RECEIPT)) fail("missing receipt");

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const receipt = JSON.parse(fs.readFileSync(RECEIPT, "utf8"));

if (manifest.schema !== "qpf.cross_platform_determinism_manifest.v1") fail("bad manifest schema");
if (!manifest.deterministic_build_time) fail("missing deterministic build time");
if (!manifest.deterministic_commit) fail("missing deterministic commit");
if (!Array.isArray(manifest.volatile_normalization_rules)) fail("missing volatile normalization rules");
if (receipt.schema !== "qpf.cross_platform_determinism_receipt.v1") fail("bad receipt schema");

for (const key of [
  "non_executing",
  "approval_granted",
  "cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
]) {
  if (manifest.posture[key] !== receipt.posture[key]) fail("posture mismatch: " + key);
}

if (receipt.posture.non_executing !== true) fail("receipt is not non-executing");
if (receipt.posture.approval_granted !== false) fail("approval flag must remain false");
if (receipt.posture.cutover_executed !== false) fail("cutover flag must remain false");
if (receipt.posture.deployment_executed !== false) fail("deployment flag must remain false");
if (receipt.posture.broadcast_executed !== false) fail("broadcast flag must remain false");
if (receipt.posture.state_changing_transaction_executed !== false) fail("state-changing tx flag must remain false");

const entries = manifest.entries || [];
const canonical = JSON.stringify(entries, null, 2) + "\n";
const recomputedManifestHash = sha256(canonical);

if (recomputedManifestHash !== manifest.manifest_sha256) {
  fail("manifest_sha256 mismatch");
}

for (const entry of entries) {
  if (!fs.existsSync(entry.path)) fail("missing tracked artifact: " + entry.path);
  const bytes = fs.readFileSync(entry.path);
  if (bytes.length !== entry.size_bytes) fail("size mismatch: " + entry.path);
  const normalized = normalizeForDeterminism(entry.path, bytes, manifest.deterministic_build_time, manifest.deterministic_commit);
  if (sha256(normalized.bytes) !== entry.sha256) fail("sha256 mismatch: " + entry.path);
  const expectedIds = JSON.stringify(entry.normalization_ids || []);
  const actualIds = JSON.stringify(normalized.normalization_ids || []);
  if (expectedIds !== actualIds) fail("normalization mismatch: " + entry.path);
}

if (receipt.manifest_sha256 !== manifest.manifest_sha256) fail("receipt manifest hash mismatch");
if (receipt.manifest_file_count !== manifest.file_count) fail("receipt file count mismatch");
if (receipt.verification_anchor !== "canonical_local_surrogate_only") fail("bad verification anchor");

const now = new Date();
const deadline = new Date(receipt.review_window.hard_deadline_utc);
if (!(now <= deadline)) fail("review window deadline has expired");

const ALLOWED_DIRTY_PATTERNS = [
  "cross-platform-determinism",
  "package.json",
  "scripts/generate-determinism-manifest.cjs",
  "scripts/verify-cross-platform-determinism-v1.cjs",
  "scripts/audit-full-local.cjs",
  "docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md"
];

const status = git("git status --short");
if (status && status.split("\n").some((line) => !ALLOWED_DIRTY_PATTERNS.some((p) => line.includes(p)))) {
  fail("unexpected dirty working tree outside determinism receipt files");
}

console.log("PASS cross-platform-determinism-v1");
console.log("MANIFEST_SHA256 " + manifest.manifest_sha256);
console.log("FILE_COUNT " + manifest.file_count);
