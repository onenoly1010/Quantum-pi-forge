#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const indexPath = "evidence/INDEX.md";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function existsFileOrDirectory(p) {
  return fs.existsSync(p);
}

if (!fs.existsSync(indexPath)) {
  fail(`${indexPath} is missing`);
}

const index = fs.readFileSync(indexPath, "utf8");

if (!index.includes("## Current Evidence Lanes")) {
  fail("missing Current Evidence Lanes section");
}

if (!index.includes("## Authority Boundary")) {
  fail("missing Authority Boundary section");
}

const rows = index
  .split(/\r?\n/)
  .filter((line) => line.startsWith("| QPF-"));

if (rows.length === 0) {
  fail("no evidence lane rows found");
}

const missing = [];
const checked = [];

for (const row of rows) {
  const cells = row.split("|").map((cell) => cell.trim());
  const evidenceId = cells[1];
  const primaryFiles = cells[4] || "";
  const paths = [...primaryFiles.matchAll(/`([^`]+)`/g)].map((match) => match[1]);

  if (paths.length === 0) {
    missing.push(`${evidenceId}: no primary files listed`);
    continue;
  }

  for (const p of paths) {
    checked.push(`${evidenceId}: ${p}`);
    if (!existsFileOrDirectory(p)) {
      missing.push(`${evidenceId}: missing ${p}`);
    }
  }
}

if (missing.length > 0) {
  console.error("Evidence index verification failed.");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`OK evidence index verified: ${rows.length} lanes, ${checked.length} paths checked.`);
