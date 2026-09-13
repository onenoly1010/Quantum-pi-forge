#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const { DOCUMENT_PATH, readRegistry, renderRegistry } = require("./lib/ecosystem-registry.cjs");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

try {
  const registry = readRegistry();
  const first = renderRegistry(registry);
  const second = renderRegistry(JSON.parse(JSON.stringify(registry)));
  if (first !== second) throw new Error("registry renderer produced different outputs");
  if (fs.readFileSync(DOCUMENT_PATH, "utf8") !== first) {
    throw new Error("committed registry documentation differs from deterministic output");
  }
  console.log(`PASS operating-model determinism sha256=${sha256(first)}`);
} catch (error) {
  console.error(`FAIL operating-model determinism: ${error.message}`);
  process.exit(1);
}
