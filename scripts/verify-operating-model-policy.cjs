#!/usr/bin/env node
const fs = require("fs");
const { readRegistry, validateRegistry } = require("./lib/ecosystem-registry.cjs");

function requireText(file, snippets) {
  const text = fs.readFileSync(file, "utf8");
  for (const snippet of snippets) {
    if (!text.includes(snippet)) throw new Error(`${file} missing policy text: ${snippet}`);
  }
}

try {
  validateRegistry(readRegistry());
  requireText("AGENTS.md", [
    "UNKNOWN != HEALTHY",
    "A publication branch contains only the artifact explicitly under review.",
    "AI does not independently control production",
    "npm run verify:all"
  ]);
  requireText(".github/CODEOWNERS", [
    "/docs/governance/",
    "/.qpf/",
    "/AGENTS.md"
  ]);
  requireText(".github/workflows/operating-model.yml", [
    "name: Operating Model",
    "name: Verify All",
    "name: Publication Scope",
    "npm run verify:all"
  ]);
  requireText(".github/workflows/apply-branch-protection.yml", [
    "\"required_status_checks\"",
    "\"Operating Model / Verify All\"",
    "\"Operating Model / Publication Scope\"",
    "\"required_approving_review_count\": 0"
  ]);
  console.log("PASS operating-model policy");
} catch (error) {
  console.error(`FAIL operating-model policy: ${error.message}`);
  process.exit(1);
}
