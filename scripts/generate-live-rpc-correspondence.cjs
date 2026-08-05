#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const provenancePath = path.join(root, "deploy", "deployment-provenance-v1.json");
const evidencePath = path.join(root, "evidence", "live-rpc-correspondence-v1.json");
const outputPath = path.join(root, "deploy", "live-rpc-correspondence-v1.json");

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

function validEntry(entry) {
  return typeof entry?.address === "string" &&
    /^0x[0-9a-f]{40}$/i.test(entry.address) &&
    typeof entry.blockTag === "string" &&
    /^0x[0-9a-f]+$/i.test(entry.blockTag) &&
    Number.isInteger(entry.codeByteLength) &&
    entry.codeByteLength >= 0 &&
    typeof entry.codeSha256 === "string" &&
    /^[0-9a-f]{64}$/i.test(entry.codeSha256);
}

const provenance = readJson(provenancePath);
const evidence = readJson(evidencePath);
if (provenance.schemaVersion !== "qpf-deployment-provenance-v1" || !Array.isArray(provenance.entries)) {
  fail("Invalid deployment provenance source");
}
if (evidence.schemaVersion !== "qpf-live-rpc-correspondence-evidence-v1" ||
    evidence.chainId !== evidence.expectedChainId ||
    evidence.expectedChainId !== "0x4115" ||
    typeof evidence.blockTag !== "string" ||
    !/^0x[0-9a-f]+$/i.test(evidence.blockTag) ||
    typeof evidence.collectedAt !== "string" ||
    Number.isNaN(Date.parse(evidence.collectedAt)) ||
    !Array.isArray(evidence.entries) ||
    !evidence.entries.every(validEntry)) {
  fail("Invalid live RPC correspondence evidence");
}

const observations = new Map(evidence.entries.map((entry) => [entry.address.toLowerCase(), entry]));
if (observations.size !== evidence.entries.length || observations.size !== provenance.entries.length) {
  fail("Live RPC evidence must contain one observation per deployment provenance entry");
}
const entries = provenance.entries.map((entry) => {
  const observation = observations.get(entry.address.toLowerCase());
  if (!observation || observation.blockTag !== evidence.blockTag) {
    fail(`Missing block-pinned observation for ${entry.address}`);
  }
  const hasDeclaration = typeof entry.declaredReference === "string" && entry.declaredReference !== "UNKNOWN";
  const verified = hasDeclaration && observation && observation.codeByteLength > 0;
  return {
    id: entry.id,
    name: entry.name,
    address: entry.address,
    correspondenceState: verified ? "VERIFIED" : hasDeclaration ? "PARTIAL" : "UNKNOWN",
    declaredReference: entry.declaredReference,
    observedReference: "evidence/live-rpc-correspondence-v1.json",
    verificationMethod: evidence.method,
    observedAt: evidence.collectedAt,
    blockTag: observation?.blockTag || "UNKNOWN",
    codeByteLength: observation?.codeByteLength ?? 0,
    codeSha256: observation?.codeSha256 || "UNKNOWN",
    gap: verified
      ? "Deployment correspondence verified by non-empty code at the declared address; source, ownership, and behavior remain outside this check."
      : hasDeclaration
        ? "Declared address lacks conclusive non-empty code evidence at the recorded block."
        : "No matching declared core-contract entry is available.",
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: "qpf-live-rpc-correspondence-v1",
  purpose: "Derived read-only deployment correspondence from block-pinned eth_getCode evidence.",
  evidenceReference: "evidence/live-rpc-correspondence-v1.json",
  chainId: evidence.chainId,
  blockTag: evidence.blockTag,
  entries,
}, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputPath)} with ${entries.length} entries.`);
