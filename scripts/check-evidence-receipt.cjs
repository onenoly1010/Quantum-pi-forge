#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const indexPath = "evidence/INDEX.md";
const receiptPath = "evidence/receipt.json";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function sha256File(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

if (!fs.existsSync(indexPath)) {
  fail(`missing ${indexPath}`);
}

if (!fs.existsSync(receiptPath)) {
  fail(`missing ${receiptPath}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (!receipt.indexSha256) {
  fail(`${receiptPath} missing indexSha256`);
}

const actual = sha256File(indexPath);
const expected = receipt.indexSha256;

if (actual !== expected) {
  fail(`receipt drift detected: receipt indexSha256 ${expected} does not match current ${indexPath} SHA-256 ${actual}`);
}

console.log("OK evidence receipt matches evidence index hash.");
console.log(`indexSha256=${actual}`);
