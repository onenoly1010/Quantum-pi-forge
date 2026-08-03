#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const outputPath = path.join(root, "deploy", "artifact-deployment-comparison-v1.json");

function fail(message) {
  console.error(`ERROR artifact deployment comparison verification failed: ${message}`);
  process.exit(1);
}

try {
  childProcess.execFileSync("node", ["scripts/generate-artifact-deployment-comparison.cjs"], { cwd: root, stdio: "inherit" });
} catch {
  fail("generator failed");
}
let surface;
try {
  surface = JSON.parse(fs.readFileSync(outputPath, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}
if (surface.schemaVersion !== "qpf-artifact-deployment-comparison-v1" || !Array.isArray(surface.entries) || surface.entries.length === 0) {
  fail("invalid artifact deployment comparison surface");
}
for (const entry of surface.entries) {
  if (!["MATCHED", "PARTIAL", "UNKNOWN"].includes(entry.comparisonState)) fail(`unsupported comparison state: ${entry.comparisonState} (entry: ${entry.id})`);
  if (!entry.deploymentReference || !entry.mappingReference || !entry.gap || !Array.isArray(entry.candidateArtifactIds)) {
    fail(`incomplete comparison evidence: ${entry.id}`);
  }
  if (typeof entry.artifactReference !== "string") fail(`missing or invalid artifactReference: ${entry.id}`);
  if (entry.comparisonState === "MATCHED" && (entry.artifactReference === "UNKNOWN" || entry.artifactReference === "")) fail(`matched entry lacks artifact reference: ${entry.id}`);
}
console.log(`OK artifact deployment comparison verified: ${surface.entries.length} entries.`);
