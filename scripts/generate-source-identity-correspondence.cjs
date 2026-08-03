#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const correspondencePath = path.join(root, "deploy", "live-rpc-correspondence-v1.json");
const compilerPath = path.join(root, "contracts", "foundry.toml");
const artifactDirectory = path.join(root, "contracts", "out");
const outputPath = path.join(root, "deploy", "source-identity-correspondence-v1.json");

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Unable to read ${path.relative(root, filePath)}: ${error.message}`);
  }
}

const correspondence = readJson(correspondencePath);
if (correspondence.schemaVersion !== "qpf-live-rpc-correspondence-v1" || !Array.isArray(correspondence.entries)) {
  fail("Invalid live RPC correspondence source");
}
if (!fs.existsSync(compilerPath)) fail("Missing versioned Foundry compiler configuration");

const artifactDirectoryPresent = fs.existsSync(artifactDirectory);
const entries = correspondence.entries.map((entry) => {
  if (entry.correspondenceState !== "VERIFIED") {
    return {
      id: entry.id,
      name: entry.name,
      address: entry.address,
      sourceIdentityState: "UNKNOWN",
      deploymentReference: "deploy/live-rpc-correspondence-v1.json",
      artifactReference: "UNKNOWN",
      compilerReference: "contracts/foundry.toml",
      comparisonMethod: "Not evaluated because deployment correspondence is not VERIFIED.",
      gap: "No verified declared deployment correspondence is available for source-identity comparison."
    };
  }
  return {
    id: entry.id,
    name: entry.name,
    address: entry.address,
    sourceIdentityState: "PARTIAL",
    deploymentReference: "deploy/live-rpc-correspondence-v1.json",
    artifactReference: "UNKNOWN",
    compilerReference: "contracts/foundry.toml",
    comparisonMethod: "Versioned Foundry compiler configuration is present; no versioned contracts/out artifact is available for normalized runtime-bytecode comparison.",
    gap: artifactDirectoryPresent
      ? "A versioned artifact mapping is required before bytecode identity can be compared."
      : "The versioned contracts/out artifact directory is absent; recover declared deployment-era artifacts and compiler metadata."
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: "qpf-source-identity-correspondence-v1",
  purpose: "Read-only source-identity evidence. MATCHED is unavailable without a declared local artifact and normalized bytecode comparison.",
  deploymentReference: "deploy/live-rpc-correspondence-v1.json",
  compilerReference: "contracts/foundry.toml",
  artifactDirectory: "contracts/out",
  artifactDirectoryPresent,
  entries
}, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${entries.length} entries.`);
