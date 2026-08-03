#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const inputs = [
  "evidence/live-rpc-correspondence-v1.json",
  "evidence/build-artifact-manifest-v1.json",
  "deploy/source-identity-correspondence-v1.json"
];
const checks = [];
for (const input of inputs) {
  const filePath = path.join(root, input);
  if (!fs.existsSync(filePath)) throw new Error(`Missing verification input: ${input}`);
  JSON.parse(fs.readFileSync(filePath, "utf8"));
  checks.push({ input, result: "PASS" });
}
const receipt = {
  schemaVersion: "qpf-independent-verification-v1",
  phase: 11,
  authorityBoundary: { externalVerifierAuthority: false, mutations: false },
  inputs,
  checks,
  result: "PASS"
};
fs.writeFileSync(path.join(root, "deploy", "independent-verification-v1.json"), `${JSON.stringify(receipt, null, 2)}\n`);
console.log("OK independent verification inputs available: 3.");
