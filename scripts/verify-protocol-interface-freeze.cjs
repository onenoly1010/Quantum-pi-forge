#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

console.log("--- Running Protocol Interface Freeze v1 Verification ---");

const requiredDocs = [
  "docs/PROTOCOL_INTERFACE_FREEZE_V1.md",
];

for (const file of requiredDocs) {
  if (!exists(file)) fail(`Missing required protocol document: ${file}`);
  ok(`Found ${file}`);
}

const protocol = read("docs/PROTOCOL_INTERFACE_FREEZE_V1.md");

const requiredTerms = [
  "Frozen Interfaces",
  "Mutable Interfaces",
  "Forbidden Mutations",
  "Failover State",
  "Reviewer Test",
  "local-first",
  "Autonomous wallet signing",
  "Autonomous live chain mutation",
];

for (const term of requiredTerms) {
  if (!protocol.includes(term)) {
    fail(`Protocol freeze document missing required term: ${term}`);
  }
}
ok("Protocol freeze document contains required boundary sections");

const forbiddenPatterns = [
  {
    pattern: /\bauto[_-]?sign\b/i,
    description: "auto-sign marker",
  },
  {
    pattern: /\bwallet_sign\b/i,
    description: "wallet_sign marker",
  },
  {
    pattern: /\bautonomous\s+mint/i,
    description: "autonomous mint marker",
  },
  {
    pattern: /\bauto[_-]?mint\b/i,
    description: "auto-mint marker",
  },
];

const scanDirs = ["scripts", "src", "tools", "lib", "agents", "hermes"].filter(exists);

function walk(dir) {
  const abs = path.join(root, dir);
  const out = [];

  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;

    const rel = path.join(dir, entry.name);
    const full = path.join(root, rel);

    if (entry.isDirectory()) {
      out.push(...walk(rel));
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }

  return out;
}

const files = scanDirs.flatMap(walk).filter((file) => {
  return /\.(js|cjs|mjs|ts|tsx|sh|py|sol|md|json|yaml|yml)$/.test(file);
});

for (const file of files) {
  if (file === "docs/PROTOCOL_INTERFACE_FREEZE_V1.md") continue;
  if (file === "scripts/verify-protocol-interface-freeze.cjs") continue;

  let body;
  try {
    body = read(file);
  } catch {
    continue;
  }

  for (const item of forbiddenPatterns) {
    if (item.pattern.test(body)) {
      fail(`Forbidden mutation wording detected in ${file}: ${item.description}`);
    }
  }
}
ok("No forbidden autonomous mutation markers found in scanned implementation files");

const knownEvidenceFiles = [
  "docs/EVIDENCE.md",
  "evidence/INDEX.md",
  "evidence/index.json",
  "evidence/receipt.json",
  "evidence/receipts.json",
];

if (!knownEvidenceFiles.some(exists)) {
  fail("No recognized evidence index or evidence document found");
}
ok("Recognized evidence surface exists");

const knownVerifierFiles = [
  "scripts/verify-evidence.cjs",
  "scripts/evidence-index-verify.sh",
  "scripts/local-ci-surrogate.sh",
  "scripts/verify-claim-map.cjs",
];

if (!knownVerifierFiles.some(exists)) {
  fail("No recognized local verification script found");
}
ok("Recognized local verifier surface exists");

console.log("SUCCESS: Protocol Interface Freeze v1 coherent.");
