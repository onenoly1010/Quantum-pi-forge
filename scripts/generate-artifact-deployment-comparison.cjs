#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const deploymentPath = path.join(root, "deploy", "live-rpc-correspondence-v1.json");
const artifactPath = path.join(root, "evidence", "build-artifact-manifest-v1.json");
const mappingPath = path.join(root, "evidence", "artifact-deployment-mapping-v1.json");
const outputPath = path.join(root, "deploy", "artifact-deployment-comparison-v1.json");

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read ${path.relative(root, filePath)}: ${error.message}`);
  }
}

const deployments = readJson(deploymentPath);
const artifacts = readJson(artifactPath);
const mapping = readJson(mappingPath);
if (deployments.schemaVersion !== "qpf-live-rpc-correspondence-v1" || !Array.isArray(deployments.entries)) {
  throw new Error("Invalid live RPC correspondence source");
}
if (artifacts.schemaVersion !== "qpf-build-artifact-manifest-v1" || !Array.isArray(artifacts.entries)) {
  throw new Error("Invalid build artifact manifest");
}
if (mapping.schemaVersion !== "qpf-artifact-deployment-mapping-v1" || !Array.isArray(mapping.mappings)) {
  throw new Error("Invalid artifact deployment mapping registry");
}

const artifactsById = new Map(artifacts.entries.map((artifact) => [artifact.artifactId, artifact]));
const mappingsByAddress = new Map();
for (const entry of mapping.mappings) {
  if (typeof entry?.deploymentAddress !== "string" || typeof entry?.artifactId !== "string") {
    throw new Error("Invalid explicit mapping");
  }
  const address = entry.deploymentAddress.toLowerCase();
  if (mappingsByAddress.has(address)) throw new Error(`Duplicate explicit mapping: ${entry.deploymentAddress}`);
  if (!artifactsById.has(entry.artifactId)) throw new Error(`Mapped artifact is absent: ${entry.artifactId}`);
  mappingsByAddress.set(address, entry);
}

const artifactCandidates = new Map();
for (const artifact of artifacts.entries) {
  const candidates = artifactCandidates.get(artifact.normalizedRuntimeBytecodeSha256) || [];
  candidates.push(artifact.artifactId);
  artifactCandidates.set(artifact.normalizedRuntimeBytecodeSha256, candidates);
}

const entries = deployments.entries.map((deployment) => {
  const explicitMapping = mappingsByAddress.get(deployment.address.toLowerCase());
  if (deployment.correspondenceState !== "VERIFIED") {
    return {
      id: deployment.id,
      address: deployment.address,
      comparisonState: "UNKNOWN",
      deploymentReference: "deploy/live-rpc-correspondence-v1.json",
      artifactReference: "UNKNOWN",
      mappingReference: "evidence/artifact-deployment-mapping-v1.json",
      candidateArtifactIds: artifactCandidates.get(deployment.codeSha256) || [],
      gap: "No declared deployment correspondence is available for artifact comparison."
    };
  }
  if (!explicitMapping) {
    return {
      id: deployment.id,
      address: deployment.address,
      comparisonState: "PARTIAL",
      deploymentReference: "deploy/live-rpc-correspondence-v1.json",
      artifactReference: "UNKNOWN",
      mappingReference: "evidence/artifact-deployment-mapping-v1.json",
      candidateArtifactIds: artifactCandidates.get(deployment.codeSha256) || [],
      gap: "No explicit artifact-to-deployment mapping is declared; hash candidates do not establish identity."
    };
  }
  const artifact = artifactsById.get(explicitMapping.artifactId);
  const matched = artifact.normalizedRuntimeBytecodeSha256 === deployment.codeSha256;
  return {
    id: deployment.id,
    address: deployment.address,
    comparisonState: matched ? "MATCHED" : "PARTIAL",
    deploymentReference: "deploy/live-rpc-correspondence-v1.json",
    artifactReference: artifact.artifactPath,
    mappingReference: "evidence/artifact-deployment-mapping-v1.json",
    candidateArtifactIds: [artifact.artifactId],
    gap: matched
      ? "Explicit mapping and normalized runtime-bytecode hashes match."
      : "Explicit mapping exists, but normalized runtime-bytecode hashes differ."
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: "qpf-artifact-deployment-comparison-v1",
  purpose: "Read-only artifact-to-deployment comparison. Explicit mappings are required for MATCHED.",
  deploymentReference: "deploy/live-rpc-correspondence-v1.json",
  artifactReference: "evidence/build-artifact-manifest-v1.json",
  mappingReference: "evidence/artifact-deployment-mapping-v1.json",
  entries
}, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${entries.length} entries.`);
