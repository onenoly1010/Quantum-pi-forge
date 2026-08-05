#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const inputs = [
  {
    input: "evidence/live-rpc-correspondence-v1.json",
    schemaVersion: "qpf-live-rpc-correspondence-evidence-v1"
  },
  {
    input: "evidence/build-artifact-manifest-v1.json",
    schemaVersion: "qpf-build-artifact-manifest-v1"
  },
  {
    input: "deploy/source-identity-correspondence-v1.json",
    schemaVersion: "qpf-source-identity-correspondence-v1"
  }
];
const checks = [];
for (const { input, schemaVersion } of inputs) {
  const filePath = path.join(root, input);
  if (!fs.existsSync(filePath)) throw new Error(`Missing verification input: ${input}`);
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Malformed verification input JSON: ${input}: ${error.message}`);
  }
  if (parsed.schemaVersion !== schemaVersion) {
    throw new Error(`Unexpected schemaVersion for ${input}: expected ${schemaVersion}, got ${parsed.schemaVersion}`);
  }
  checks.push({ input, result: "PASS" });
}
const receipt = {
  schemaVersion: "qpf-independent-verification-v1",
  phase: 11,
  authorityBoundary: { externalVerifierAuthority: false, mutations: false },
  inputs: inputs.map(({ input }) => input),
  checks,
  result: "PASS"
};
fs.writeFileSync(path.join(root, "deploy", "independent-verification-v1.json"), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`OK independent verification inputs available: ${inputs.length}.`);
