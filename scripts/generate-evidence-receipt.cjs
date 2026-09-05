#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");

const indexPath = "evidence/INDEX.md";
const receiptPath = "evidence/receipt.json";

function sha256File(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function git(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function evidenceIndexCounts() {
  const rows = fs.readFileSync(indexPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.startsWith("| QPF-"));
  const paths = rows.flatMap((row) => {
    const primaryFiles = row.split("|").map((cell) => cell.trim())[4] || "";
    return [...primaryFiles.matchAll(/`([^`]+)`/g)];
  });
  return { lanesChecked: rows.length, pathsChecked: paths.length };
}

if (!fs.existsSync(indexPath)) {
  console.error(`ERROR: missing ${indexPath}`);
  process.exit(1);
}

execSync("node scripts/verify-evidence-index.cjs", { stdio: "inherit" });

const receipt = {
  schemaVersion: "qpf-evidence-receipt-v1",
  generatedAt: new Date().toISOString(),
  gitCommit: git("git rev-parse --short HEAD"),
  gitBranch: git("git rev-parse --abbrev-ref HEAD"),
  indexPath,
  indexSha256: sha256File(indexPath),
  verifier: {
    command: "npm run verify:evidence-index",
    result: "pass",
    ...evidenceIndexCounts()
  },
  authorityBoundary: {
    readOnly: true,
    noWalletSigning: true,
    noDeployment: true,
    noPosting: true,
    noGovernanceExecution: true,
    noCustodyTransfer: true,
    noTokenMinting: true,
    noStaking: true,
    noChainMutation: true
  }
};

fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", "utf8");

console.log(`OK wrote ${receiptPath}`);
console.log(`indexSha256=${receipt.indexSha256}`);
console.log(`gitCommit=${receipt.gitCommit}`);
