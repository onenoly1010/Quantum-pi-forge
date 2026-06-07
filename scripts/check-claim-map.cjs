#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const claimMapPath = path.join(root, "evidence", "claim-map.json");
const indexPath = path.join(root, "evidence", "INDEX.md");
const packagePath = path.join(root, "package.json");

function fail(message) {
  console.error("ERROR claim map drift check failed: " + message);
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    fail("invalid JSON in " + path.relative(root, filePath) + ": " + err.message);
  }
}

function fileExists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function commandToScript(command) {
  const prefix = "npm run ";
  if (!command.startsWith(prefix)) return null;
  return command.slice(prefix.length).trim();
}

try {
  cp.execFileSync("npm", ["run", "verify:claim-map"], {
    cwd: root,
    stdio: "inherit"
  });
} catch {
  fail("npm run verify:claim-map failed");
}

if (!fs.existsSync(claimMapPath)) fail("missing evidence/claim-map.json");
if (!fs.existsSync(indexPath)) fail("missing evidence/INDEX.md");
if (!fs.existsSync(packagePath)) fail("missing package.json");

const claimMap = readJson(claimMapPath);
const pkg = readJson(packagePath);
const indexText = fs.readFileSync(indexPath, "utf8");
const scripts = pkg.scripts || {};

if (!indexText.includes("evidence/claim-map.json")) {
  fail("evidence/INDEX.md does not reference evidence/claim-map.json");
}

if (!indexText.includes("scripts/verify-claim-map.cjs")) {
  fail("evidence/INDEX.md does not reference scripts/verify-claim-map.cjs");
}

if (!indexText.includes("npm run verify:claim-map")) {
  fail("evidence/INDEX.md does not document npm run verify:claim-map");
}

if (scripts["verify:claim-map"] !== "node scripts/verify-claim-map.cjs") {
  fail('package.json script "verify:claim-map" must equal "node scripts/verify-claim-map.cjs"');
}

if (scripts["claim-map:check"] !== "node scripts/check-claim-map.cjs") {
  fail('package.json script "claim-map:check" must equal "node scripts/check-claim-map.cjs"');
}

if (!Array.isArray(claimMap.claims) || claimMap.claims.length === 0) {
  fail("claim map has no claims");
}

for (const claim of claimMap.claims) {
  const verificationScript = commandToScript(claim.verification);

  if (!verificationScript) {
    fail("claim " + claim.id + " verification is not an npm run command");
  }

  if (!Object.prototype.hasOwnProperty.call(scripts, verificationScript)) {
    fail("claim " + claim.id + " references missing npm script: " + verificationScript);
  }

  for (const relPath of claim.evidence) {
    if (!fileExists(relPath)) {
      fail("claim " + claim.id + " references missing evidence path: " + relPath);
    }
  }
}

console.log("OK claim map drift check passed.");
console.log("claims=" + claimMap.claims.length);
