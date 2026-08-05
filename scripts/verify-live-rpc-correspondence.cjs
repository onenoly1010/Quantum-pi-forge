#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputPath = path.join(root, "deploy", "live-rpc-correspondence-v1.json");
function fail(message) {
  console.error(`ERROR live RPC correspondence verification failed: ${message}`);
  process.exit(1);
}

try {
  childProcess.execFileSync("node", ["scripts/generate-live-rpc-correspondence.cjs"], { cwd: root, stdio: "inherit" });
} catch {
  fail("generator failed");
}

let surface;
try {
  surface = JSON.parse(fs.readFileSync(outputPath, "utf8"));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}
if (surface.schemaVersion !== "qpf-live-rpc-correspondence-v1" || surface.chainId !== "0x4115" || !Array.isArray(surface.entries) || surface.entries.length === 0) {
  fail("invalid correspondence surface");
}
for (const entry of surface.entries) {
  if (!["VERIFIED", "PARTIAL", "UNKNOWN"].includes(entry.correspondenceState)) fail(`unsupported correspondence state "${entry.correspondenceState}": ${entry.id}`);
  if (!entry.observedReference || !entry.verificationMethod || !entry.observedAt || !entry.gap) fail(`incomplete correspondence: ${entry.id}`);
  if (entry.correspondenceState === "VERIFIED" &&
      (entry.declaredReference === "UNKNOWN" || entry.blockTag === "UNKNOWN" || entry.codeByteLength <= 0 || !/^[0-9a-f]{64}$/i.test(entry.codeSha256))) {
    fail(`verified entry lacks reproducible evidence: ${entry.id}`);
  }
  if (entry.correspondenceState === "UNKNOWN" && entry.declaredReference !== "UNKNOWN") fail(`unknown entry has a declared reference: ${entry.id}`);
}
console.log(`OK live RPC correspondence verified: ${surface.entries.length} entries.`);
