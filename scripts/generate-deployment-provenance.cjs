#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const verificationPath = path.join(root, "deploy", "deployed-addresses-verification.json");
const statusPath = path.join(root, "deploy", "verification-status-v1.json");
const outputPath = path.join(root, "deploy", "deployment-provenance-v1.json");

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

const verification = readJson(verificationPath);
const status = readJson(statusPath);
const contracts = verification.phase_b_address_extraction?.contracts;
const declared = status.core_contracts;

if (verification.schema !== "qpf-deployed-addresses-verification-v1" || !Array.isArray(contracts)) {
  fail("Invalid deployed-addresses verification source");
}
if (status.schema !== "qpf-verification-status-v1" || !Array.isArray(declared)) {
  fail("Invalid verification status source");
}

const declaredAddresses = new Set(declared.map((contract) => contract.address.toLowerCase()));
const entries = contracts.map((contract) => {
  const declaredMatch = declaredAddresses.has(contract.address.toLowerCase());
  return {
    id: contract.address.toLowerCase(),
    name: contract.name,
    address: contract.address,
    correspondenceState: declaredMatch ? "PARTIAL" : "UNKNOWN",
    declaredReference: declaredMatch ? "deploy/verification-status-v1.json" : "UNKNOWN",
    observedReference: "deploy/deployed-addresses-verification.json",
    verificationMethod: "EIP-55 checksum and repository-source comparison",
    observedAt: verification.verified_at_utc,
    liveRpcState: verification.phase_d_rpc_consistency?.status || "UNKNOWN",
    gap: declaredMatch
      ? "Live RPC eth_getCode correspondence is pending."
      : "No matching declared core-contract entry is available.",
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: "qpf-deployment-provenance-v1",
  purpose: "Derived read-only deployment correspondence. PARTIAL and UNKNOWN are not live-chain assertions.",
  authorityBoundary: verification.audit_boundary,
  entries,
}, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${entries.length} entries.`);
