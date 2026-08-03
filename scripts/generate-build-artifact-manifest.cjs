#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const artifactsRoot = path.join(root, "contracts", "out");
const outputPath = path.join(root, "evidence", "build-artifact-manifest-v1.json");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filePath) : [filePath];
  });
}

function normalizeBytecode(value) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]*$/.test(value) || (value.length - 2) % 2 !== 0) {
    throw new Error("Artifact has invalid deployed bytecode");
  }
  return value.toLowerCase();
}

if (!fs.existsSync(artifactsRoot)) throw new Error("Missing contracts/out; run cd contracts && forge build");
const records = walk(artifactsRoot)
  .filter((filePath) => filePath.endsWith(".json") && !filePath.includes(`${path.sep}build-info${path.sep}`))
  .sort()
  .map((filePath) => {
    const artifact = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const bytecode = normalizeBytecode(artifact.deployedBytecode?.object || artifact.deployedBytecode);
    const metadata = typeof artifact.rawMetadata === "string" ? JSON.parse(artifact.rawMetadata) : artifact.metadata;
    const compiler = metadata?.compiler;
    const settings = metadata?.settings;
    const sourcePath = Object.keys(metadata?.sources || {})[0];
    if (!compiler?.version || !settings || !sourcePath) {
      return { excluded: true, artifactPath: path.relative(root, filePath).replaceAll(path.sep, "/"), reason: "Compiler metadata is incomplete." };
    }
    return {
      artifactId: typeof artifact.id === "string" ? artifact.id : path.basename(filePath, ".json"),
      sourcePath,
      artifactPath: path.relative(root, filePath).replaceAll(path.sep, "/"),
      compilerVersion: compiler.version,
      optimizer: settings.optimizer,
      evmVersion: settings.evmVersion || "default",
      normalizedRuntimeBytecodeSha256: crypto.createHash("sha256").update(bytecode).digest("hex"),
      runtimeBytecodeLength: (bytecode.length - 2) / 2
    };
  });
const entries = records.filter((record) => !record.excluded);
const excludedArtifacts = records.filter((record) => record.excluded);

fs.writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: "qpf-build-artifact-manifest-v1",
  purpose: "Versioned metadata and normalized runtime-bytecode hashes derived from a local Foundry build. Artifact binaries remain reproducible generated outputs.",
  buildCommand: "cd contracts && forge build",
  compilerConfiguration: "contracts/foundry.toml",
  entries,
  excludedArtifacts
}, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${entries.length} artifacts and ${excludedArtifacts.length} exclusions.`);
