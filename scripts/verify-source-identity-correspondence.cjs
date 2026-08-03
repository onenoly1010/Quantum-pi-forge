#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputPath = path.join(root, "deploy", "source-identity-correspondence-v1.json");
function fail(message) {
  console.error(`ERROR source identity correspondence verification failed: ${message}`);
  process.exit(1);
}

try {
  childProcess.execFileSync("node", ["scripts/generate-source-identity-correspondence.cjs"], { cwd: root, stdio: "inherit" });
} catch {
  fail("generator failed");
}
let surface;
try {
  surface = JSON.parse(fs.readFileSync(outputPath, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}
if (surface.schemaVersion !== "qpf-source-identity-correspondence-v1" || !Array.isArray(surface.entries) || surface.entries.length === 0) {
  fail("invalid source identity surface");
}
for (const entry of surface.entries) {
  if (!["MATCHED", "PARTIAL", "UNKNOWN"].includes(entry.sourceIdentityState)) fail(`unsupported source identity state: ${entry.id}`);
  if (!entry.deploymentReference || !entry.compilerReference || !entry.comparisonMethod || !entry.gap) fail(`incomplete source identity evidence: ${entry.id}`);
  if (entry.sourceIdentityState === "MATCHED" && entry.artifactReference === "UNKNOWN") fail(`matched entry lacks artifact reference: ${entry.id}`);
  if (entry.sourceIdentityState === "PARTIAL" &&
      (typeof entry.artifactReference !== "string" || entry.artifactReference.trim() === "")) {
    fail(`partial entry lacks artifact reference state: ${entry.id}`);
  }
}
console.log(`OK source identity correspondence verified: ${surface.entries.length} entries.`);
