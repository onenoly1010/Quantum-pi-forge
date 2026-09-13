#!/usr/bin/env node
const fs = require("fs");
const { DOCUMENT_PATH, readRegistry, renderRegistry } = require("./lib/ecosystem-registry.cjs");

const rendered = renderRegistry(readRegistry());
if (process.argv.includes("--stdout")) {
  process.stdout.write(rendered);
} else {
  fs.writeFileSync(DOCUMENT_PATH, rendered);
  console.log(`PASS generated ${DOCUMENT_PATH}`);
}
