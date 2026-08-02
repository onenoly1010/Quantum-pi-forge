#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputPath = path.join(root, "deploy", "capability-manifest.json");

function fail(message) {
  console.error(`ERROR capability manifest verification failed: ${message}`);
  process.exit(1);
}

try {
  childProcess.execFileSync("node", ["scripts/generate-capability-manifest.cjs"], {
    cwd: root,
    stdio: "inherit",
  });
} catch {
  fail("generator failed");
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(outputPath, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}

if (manifest.schemaVersion !== "qpf-capability-manifest-v1") fail("invalid schemaVersion");
if (manifest.sourceInventory?.path !== "evidence/phase-1-inventory-v1.json") fail("invalid source inventory");
if (typeof manifest.authorityBoundary !== "string" || !manifest.authorityBoundary.startsWith("read-only")) {
  fail("invalid authority boundary");
}
if (!Array.isArray(manifest.capabilities) || manifest.capabilities.length === 0) {
  fail("capabilities must be non-empty");
}

for (const capability of manifest.capabilities) {
  if (capability.status !== "Active") fail(`unsupported capability status: ${capability.id}`);
  if (capability.source !== "evidence/INDEX.md") fail(`unexpected source: ${capability.id}`);
  if (!Array.isArray(capability.primaryFiles) || capability.primaryFiles.length === 0) {
    fail(`missing primary files: ${capability.id}`);
  }

  for (const file of capability.primaryFiles) {
    if (!fs.existsSync(path.join(root, file))) fail(`missing source file: ${file}`);
  }
}

for (const category of manifest.unavailableCategories || []) {
  if (category.status !== "UNKNOWN") fail(`unavailable category must be UNKNOWN: ${category.id}`);
}

for (const unknown of manifest.unknowns || []) {
  if (unknown.status !== "UNKNOWN") fail(`unknown record must be UNKNOWN: ${unknown.id}`);
}

console.log(`OK capability manifest verified: ${manifest.capabilities.length} capabilities.`);
