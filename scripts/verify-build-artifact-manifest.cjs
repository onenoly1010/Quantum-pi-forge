#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const manifestPath = path.join(root, "evidence", "build-artifact-manifest-v1.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.schemaVersion !== "qpf-build-artifact-manifest-v1" || !Array.isArray(manifest.entries) || manifest.entries.length === 0) {
  throw new Error("Invalid build artifact manifest");
}
for (const entry of manifest.entries) {
  if (!entry.artifactId || !entry.sourcePath || !entry.artifactPath || !/^\d+\.\d+\.\d+/.test(entry.compilerVersion) ||
      !/^[0-9a-f]{64}$/i.test(entry.normalizedRuntimeBytecodeSha256) || !Number.isInteger(entry.runtimeBytecodeLength)) {
    throw new Error(`Invalid artifact manifest entry: ${entry.artifactId || "UNKNOWN"}`);
  }
}
console.log(`OK build artifact manifest verified: ${manifest.entries.length} artifacts.`);
