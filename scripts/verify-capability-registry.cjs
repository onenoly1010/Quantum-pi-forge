#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const manifestPath = path.join(root, "deploy", "capability-manifest.json");
const registryPath = path.join(root, "deploy", "capability-registry-v1.json");

function fail(message) {
  console.error(`ERROR capability registry verification failed: ${message}`);
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
  childProcess.execFileSync("node", ["scripts/generate-capability-registry.cjs"], {
    cwd: root,
    stdio: "inherit",
  });
} catch {
  fail("generator failed");
}

const manifest = readJson(manifestPath);
const registry = readJson(registryPath);
const requiredFields = ["id", "name", "description", "sourceReference", "verification", "confidence", "owner", "unknownFields"];

if (manifest.schemaVersion !== "qpf-capability-manifest-v1") fail("invalid Phase 2 manifest schemaVersion");
if (!Array.isArray(manifest.capabilities) || manifest.capabilities.length === 0) {
  fail("Phase 2 manifest capabilities must be non-empty");
}
if (registry.schemaVersion !== "qpf-capability-registry-v1") fail("invalid schemaVersion");
if (!Array.isArray(registry.entries) || registry.entries.length === 0) fail("entries must be non-empty");

const ids = new Set();
for (const entry of registry.entries) {
  for (const field of requiredFields) {
    if (!(field in entry)) fail(`missing ${field} for ${entry.id || "entry"}`);
  }
  if (ids.has(entry.id)) fail(`duplicate entry id: ${entry.id}`);
  ids.add(entry.id);

  if (entry.verification.status === "VERIFIED") {
    const capability = manifest.capabilities.find((item) => item.id === entry.id);
    if (!capability) fail(`verified entry is not in the Phase 2 manifest: ${entry.id}`);
    if (entry.confidence !== "HIGH") fail(`verified entry lacks HIGH confidence: ${entry.id}`);
    if (entry.owner.repository !== "onenoly1010/Quantum-pi-forge") fail(`invalid owner: ${entry.id}`);
    if (entry.unknownFields.length !== 0) fail(`verified entry has unknown fields: ${entry.id}`);
    continue;
  }

  if (entry.verification.status !== "UNKNOWN") fail(`invalid verification status: ${entry.id}`);
  if (entry.confidence !== "UNKNOWN") fail(`unknown entry lacks UNKNOWN confidence: ${entry.id}`);
  if (entry.owner.repository !== "UNKNOWN") fail(`unknown entry has asserted owner: ${entry.id}`);
  if (!entry.unknownFields.includes("owner.repository")) fail(`unknown entry lacks owner marker: ${entry.id}`);
}

if (registry.entries.filter((entry) => entry.verification.status === "VERIFIED").length !== manifest.capabilities.length) {
  fail("verified entry count does not match the Phase 2 manifest");
}

console.log(`OK capability registry verified: ${registry.entries.length} entries.`);
