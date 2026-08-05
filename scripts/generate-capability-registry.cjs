#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const inventoryPath = path.join(root, "evidence", "phase-1-inventory-v1.json");
const manifestPath = path.join(root, "deploy", "capability-manifest.json");
const outputPath = path.join(root, "deploy", "capability-registry-v1.json");
const repository = "onenoly1010/Quantum-pi-forge";

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

function sourceReference(source, primaryFiles = []) {
  return {
    phaseOneInventory: "evidence/phase-1-inventory-v1.json",
    phaseTwoManifest: "deploy/capability-manifest.json",
    canonicalSource: source,
    primaryFiles,
  };
}

function unknownEntry({ id, name, reason, source, referencedPath }) {
  return {
    id,
    name,
    description: reason,
    sourceReference: sourceReference(source, referencedPath ? [referencedPath] : []),
    verification: {
      status: "UNKNOWN",
      method: "No verification assertion is available.",
    },
    confidence: "UNKNOWN",
    owner: {
      repository: "UNKNOWN",
      status: "UNKNOWN",
    },
    unknownFields: ["owner.repository"],
  };
}

function buildRegistry() {
  const inventory = readJson(inventoryPath);
  const manifest = readJson(manifestPath);

  if (inventory.schemaVersion !== "qpf-phase-1-inventory-v1") fail("Unsupported Phase 1 inventory schema");
  if (manifest.schemaVersion !== "qpf-capability-manifest-v1") fail("Unsupported Phase 2 manifest schema");
  if (manifest.sourceInventory?.path !== "evidence/phase-1-inventory-v1.json") {
    fail("Phase 2 manifest does not reference the Phase 1 inventory");
  }

  const verifiedEntries = manifest.capabilities.map((capability) => ({
    id: capability.id,
    name: capability.capability,
    description: `Active evidence capability derived from ${capability.id}.`,
    sourceReference: sourceReference(capability.source, capability.primaryFiles),
    verification: {
      status: "VERIFIED",
      method: capability.verification,
    },
    confidence: "HIGH",
    owner: {
      repository,
      status: "VERIFIED",
    },
    unknownFields: [],
  }));

  const unavailableEntries = manifest.unavailableCategories.map((category) => unknownEntry({
    id: category.id,
    name: category.id,
    reason: category.reason,
    source: "evidence/phase-1-inventory-v1.json",
  }));

  const legacyUnknownEntries = inventory.unknowns.map((unknown) => unknownEntry({
    id: unknown.id,
    name: unknown.id,
    reason: unknown.reason,
    source: unknown.source,
    referencedPath: unknown.referencedPath,
  }));

  return {
    schemaVersion: "qpf-capability-registry-v1",
    purpose: "Derived capability-to-source registry. Canonical evidence remains in the Phase 1 and Phase 2 sources.",
    authorityBoundary: inventory.authorityBoundary,
    entries: [...verifiedEntries, ...unavailableEntries, ...legacyUnknownEntries],
  };
}

const registry = buildRegistry();
fs.writeFileSync(outputPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${registry.entries.length} entries.`);
