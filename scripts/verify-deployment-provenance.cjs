#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputPath = path.join(root, "deploy", "deployment-provenance-v1.json");
function fail(message) {
  console.error(`ERROR deployment provenance verification failed: ${message}`);
  process.exit(1);
}

try {
  childProcess.execFileSync("node", ["scripts/generate-deployment-provenance.cjs"], { cwd: root, stdio: "inherit" });
} catch {
  fail("generator failed");
}

let surface;
try {
  surface = JSON.parse(fs.readFileSync(outputPath, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}
if (surface.schemaVersion !== "qpf-deployment-provenance-v1" || !Array.isArray(surface.entries) || surface.entries.length === 0) {
  fail("invalid provenance surface");
}
for (const entry of surface.entries) {
  if (!["PARTIAL", "UNKNOWN"].includes(entry.correspondenceState)) fail(`unsupported correspondence state "${entry.correspondenceState}": ${entry.id}`);
  if (!entry.observedReference || !entry.verificationMethod || !entry.observedAt || !entry.gap) fail(`incomplete provenance: ${entry.id}`);
  if (entry.correspondenceState === "PARTIAL" &&
      (typeof entry.declaredReference !== "string" || entry.declaredReference.trim() === "" || entry.declaredReference === "UNKNOWN")) {
    fail(`partial entry lacks declared reference: ${entry.id}`);
  }
}
console.log(`OK deployment provenance verified: ${surface.entries.length} entries.`);
