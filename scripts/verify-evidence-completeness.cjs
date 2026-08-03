#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const registryPath = path.join(root, "deploy", "capability-registry-v1.json");
const surfacePath = path.join(root, "deploy", "evidence-completeness-v1.json");

function fail(message) {
  console.error(`ERROR evidence completeness verification failed: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`invalid JSON at ${path.relative(root, filePath)}: ${error.message}`);
  }
}

try {
  childProcess.execFileSync("node", ["scripts/generate-evidence-completeness.cjs"], {
    cwd: root,
    stdio: "inherit",
  });
} catch {
  fail("generator failed");
}

const registry = readJson(registryPath);
const surface = readJson(surfacePath);
const states = new Set(["VERIFIED", "PARTIAL", "UNKNOWN"]);

if (surface.schemaVersion !== "qpf-evidence-completeness-v1") fail("invalid schemaVersion");
if (!Array.isArray(surface.entries) || surface.entries.length !== registry.entries.length) {
  fail("entry count does not match capability registry");
}

for (const entry of surface.entries) {
  const registryEntry = registry.entries.find((item) => item.id === entry.id);
  if (!registryEntry) fail(`orphan evidence entry: ${entry.id}`);
  if (!states.has(entry.evidenceState)) fail(`invalid evidence state: ${entry.id}`);
  if (!entry.provenance?.canonicalSource) fail(`missing provenance: ${entry.id}`);
  if (!entry.verification?.status || !entry.verification?.method) fail(`missing verification: ${entry.id}`);
  if (!entry.evidenceReceipt?.path || !entry.evidenceReceipt?.generatedAt || !entry.evidenceReceipt?.gitCommit) {
    fail(`missing evidence receipt reference: ${entry.id}`);
  }
  if (entry.deploymentMatch?.state !== "UNKNOWN") fail(`unsupported deployment assertion: ${entry.id}`);
  if (!Array.isArray(entry.gaps)) fail(`invalid gaps: ${entry.id}`);

  if (registryEntry.verification.status === "VERIFIED") {
    if (entry.evidenceState !== "VERIFIED" || !entry.referenceCommit || entry.referenceCommit === "UNKNOWN") {
      fail(`verified entry lacks commit reference: ${entry.id}`);
    }
  } else if (entry.evidenceState !== "UNKNOWN" || entry.gaps.length === 0) {
    fail(`unknown entry is not explicit: ${entry.id}`);
  }
}

console.log(`OK evidence completeness verified: ${surface.entries.length} entries.`);
