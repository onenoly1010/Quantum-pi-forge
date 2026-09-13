#!/usr/bin/env node
const fs = require("fs");
const { DOCUMENT_PATH, readRegistry, renderRegistry, validateRegistry } = require("./lib/ecosystem-registry.cjs");

try {
  const registry = readRegistry();
  validateRegistry(registry);
  const expected = renderRegistry(registry);
  if (!fs.existsSync(DOCUMENT_PATH)) throw new Error("generated Markdown is missing");
  if (fs.readFileSync(DOCUMENT_PATH, "utf8") !== expected) {
    throw new Error("generated Markdown is stale; run npm run generate:ecosystem-registry");
  }
  console.log(`PASS ecosystem registry repositories=${registry.repositories.length} projects=${registry.projects.length}`);
} catch (error) {
  console.error(`FAIL ecosystem registry: ${error.message}`);
  process.exit(1);
}
