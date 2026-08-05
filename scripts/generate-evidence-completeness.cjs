#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const registryPath = path.join(root, "deploy", "capability-registry-v1.json");
const manifestPath = path.join(root, "deploy", "capability-manifest.json");
const receiptPath = path.join(root, "evidence", "receipt.json");
const outputPath = path.join(root, "deploy", "evidence-completeness-v1.json");

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

function buildEntry(entry, sourceCommit, receipt) {
  const verified = entry.verification.status === "VERIFIED";
  return {
    id: entry.id,
    name: entry.name,
    evidenceState: verified ? "VERIFIED" : "UNKNOWN",
    confidence: entry.confidence,
    provenance: entry.sourceReference,
    verification: entry.verification,
    referenceCommit: verified ? sourceCommit : "UNKNOWN",
    evidenceReceipt: {
      path: "evidence/receipt.json",
      generatedAt: receipt.generatedAt,
      gitCommit: receipt.gitCommit,
    },
    deploymentMatch: {
      state: "UNKNOWN",
      reason: "No verified deployment registry is included in the Phase 1 inventory.",
    },
    gaps: verified ? [] : entry.unknownFields,
  };
}

function buildSurface() {
  const registry = readJson(registryPath);
  const manifest = readJson(manifestPath);
  const receipt = readJson(receiptPath);

  if (registry.schemaVersion !== "qpf-capability-registry-v1") fail("Unsupported capability registry schema");
  if (manifest.schemaVersion !== "qpf-capability-manifest-v1") fail("Unsupported capability manifest schema");
  if (!Array.isArray(registry.entries) || registry.entries.length === 0) fail("Registry entries must be non-empty");
  if (typeof manifest.sourceInventory?.sourceCommit !== "string") fail("Capability manifest source commit is missing");
  if (receipt.schemaVersion !== "qpf-evidence-receipt-v1"
    || typeof receipt.generatedAt !== "string"
    || typeof receipt.gitCommit !== "string") {
    fail("Evidence receipt is missing required provenance fields");
  }

  return {
    schemaVersion: "qpf-evidence-completeness-v1",
    purpose: "Derived read-only evidence completeness surface. Canonical evidence remains in the referenced sources.",
    sourceRegistry: "deploy/capability-registry-v1.json",
    authorityBoundary: registry.authorityBoundary,
    entries: registry.entries.map((entry) => buildEntry(entry, manifest.sourceInventory.sourceCommit, receipt)),
  };
}

const surface = buildSurface();
fs.writeFileSync(outputPath, `${JSON.stringify(surface, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${surface.entries.length} entries.`);
