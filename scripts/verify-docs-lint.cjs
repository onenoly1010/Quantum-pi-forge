#!/usr/bin/env node
const fs = require("fs");

const markdownFiles = [
  "AGENTS.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  "docs/governance/GITHUB_ECOSYSTEM_REGISTRY_V1.md"
];
const jsonFiles = [
  ".qpf/task-contracts/feat__qpf-operating-model-v1.json",
  "docs/governance/github-ecosystem-registry-v1.json"
];

function fail(message) {
  console.error(`FAIL operating-model lint: ${message}`);
  process.exit(1);
}

for (const file of markdownFiles) {
  if (!fs.existsSync(file)) fail(`missing ${file}`);
  const text = fs.readFileSync(file, "utf8");
  if (!text.endsWith("\n")) fail(`${file} must end with a newline`);
  if (text.includes("\t")) fail(`${file} contains a tab`);
  const badLine = text.split("\n").findIndex((line) => /[ \t]+$/.test(line));
  if (badLine >= 0) fail(`${file}:${badLine + 1} has trailing whitespace`);
}

for (const file of jsonFiles) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${file} is invalid JSON: ${error.message}`);
  }
}

console.log(`PASS operating-model lint markdown=${markdownFiles.length} json=${jsonFiles.length}`);
