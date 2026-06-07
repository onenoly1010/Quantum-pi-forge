#!/usr/bin/env node
const fs = require("fs");
const cp = require("child_process");

function fail(msg) {
  console.error("ERROR snapshot verification failed: " + msg);
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    fail("cannot read valid JSON: " + path + ": " + err.message);
  }
}

const snapshot = readJson("evidence/snapshot-v1.json");
const receipt = readJson("evidence/receipt.json");

const expectedCommit = "7e6281d";
const expectedReceipt = "b720d54e7a07b89edd4e7dd20ce6631d5d252bef273e8c59ab62cffa2fd27fb1";

if (snapshot.snapshotVersion !== "1.0.0") fail("snapshotVersion must be 1.0.0");
if (!snapshot.state) fail("missing state");
if (snapshot.state.canonicalCommit !== expectedCommit) fail("canonicalCommit mismatch");
if (snapshot.state.receiptHash !== expectedReceipt) fail("baseline receiptHash mismatch");
if (snapshot.state.proofCommand !== "npm run verify:evidence") fail("proofCommand mismatch");
if (snapshot.state.proofStatus !== "passed") fail("proofStatus mismatch");
if (!snapshot.authorityBoundary || snapshot.authorityBoundary.type !== "read-only verification only") fail("authority boundary mismatch");

for (const item of ["no wallet signing","no deployment execution","no posting paths","no governance execution","no custody transfer","no token minting","no staking mutation","no chain mutation"]) {
  if (!snapshot.authorityBoundary.restrictions.includes(item)) fail("missing restriction: " + item);
}

try {
  cp.execFileSync("git", ["merge-base", "--is-ancestor", expectedCommit, "HEAD"], { stdio: "ignore" });
} catch {
  fail("canonicalCommit is not an ancestor of HEAD");
}

if (!receipt.indexSha256) fail("receipt missing indexSha256");

console.log("OK evidence snapshot verified.");
console.log("snapshotVersion=" + snapshot.snapshotVersion);
console.log("canonicalCommit=" + snapshot.state.canonicalCommit);
console.log("currentHead=" + cp.execFileSync("git", ["rev-parse", "--short=7", "HEAD"], { encoding: "utf8" }).trim());
console.log("baselineReceiptHash=" + snapshot.state.receiptHash);
console.log("currentReceiptHash=" + receipt.indexSha256);
console.log("proofCommand=" + snapshot.state.proofCommand);
