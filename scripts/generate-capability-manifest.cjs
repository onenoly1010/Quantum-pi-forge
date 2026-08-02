#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const inventoryPath = path.join(root, "evidence", "phase-1-inventory-v1.json");
const indexPath = path.join(root, "evidence", "INDEX.md");
const outputPath = path.join(root, "deploy", "capability-manifest.json");

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

function isSafeRepoRelativePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !path.isAbsolute(value)
    && !path.win32.isAbsolute(value)
    && !value.split(/[\\/]+/).includes("..");
}

function parseEvidenceLanes(index) {
  return index
    .split(/\r?\n/)
    .filter((line) => line.startsWith("| QPF-"))
    .map((row) => {
      const cells = row.split("|").map((cell) => cell.trim());
      if (!cells[1] || !cells[2] || !cells[3] || typeof cells[4] !== "string" || !cells[5]) {
        fail(`Invalid evidence lane: ${row}`);
      }

      const primaryFiles = [...cells[4].matchAll(/`([^`]+)`/g)].map((match) => match[1]);
      if (primaryFiles.length === 0 || primaryFiles.some((file) => !isSafeRepoRelativePath(file))) {
        fail(`Invalid evidence lane: ${row}`);
      }

      return {
        id: cells[1],
        capability: cells[2],
        status: cells[3],
        source: "evidence/INDEX.md",
        primaryFiles,
        verification: cells[5],
      };
    });
}

function buildManifest() {
  const inventory = readJson(inventoryPath);
  const index = fs.readFileSync(indexPath, "utf8");

  if (inventory.schemaVersion !== "qpf-phase-1-inventory-v1") {
    fail("Unsupported Phase 1 inventory schema");
  }

  if (!Array.isArray(inventory.canonicalSources) || !inventory.canonicalSources.some(
    (source) => source.path === "evidence/INDEX.md",
  )) {
    fail("Phase 1 inventory does not include evidence/INDEX.md");
  }

  const capabilities = parseEvidenceLanes(index);
  const unknowns = Array.isArray(inventory.unknowns) ? inventory.unknowns.map((unknown) => ({
    id: unknown.id,
    status: unknown.status,
    source: unknown.source,
    reason: unknown.reason,
    ...(unknown.referencedPath ? { referencedPath: unknown.referencedPath } : {}),
  })) : [];

  if (unknowns.some((unknown) => unknown.status !== "UNKNOWN")) {
    fail("Phase 1 inventory contains an invalid unknown status");
  }

  return {
    schemaVersion: "qpf-capability-manifest-v1",
    purpose: "Derived public capability view. Canonical evidence remains in the Phase 1 inventory sources.",
    sourceInventory: {
      path: "evidence/phase-1-inventory-v1.json",
      sourceCommit: inventory.sourceCommit,
    },
    authorityBoundary: inventory.authorityBoundary,
    capabilities,
    unavailableCategories: [
      {
        id: "contracts",
        status: "UNKNOWN",
        reason: "No contract registry is included in the verified Phase 1 inventory.",
      },
      {
        id: "deployments",
        status: "UNKNOWN",
        reason: "No deployment registry is included in the verified Phase 1 inventory.",
      },
    ],
    unknowns,
  };
}

const manifest = buildManifest();
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${manifest.capabilities.length} capabilities.`);
