#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const file = path.join(root, "evidence", "claim-map.json");
const statuses = new Set(["verified", "needs-update", "unmapped"]);

function fail(msg) {
  console.error("ERROR claim map verification failed: " + msg);
  process.exit(1);
}

try {
  cp.execFileSync("npm", ["run", "verify:evidence-index"], { stdio: "inherit" });
} catch {
  fail("npm run verify:evidence-index failed");
}

if (!fs.existsSync(file)) fail("missing evidence/claim-map.json");

let map;
try {
  map = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (err) {
  fail("invalid JSON: " + err.message);
}

if (map.schemaVersion !== "qpf-claim-map-v1") fail("bad schemaVersion");
if (typeof map.lastUpdated !== "string" || !map.lastUpdated.trim()) fail("bad lastUpdated");
if (typeof map.authorityBoundary !== "string" || !map.authorityBoundary.trim()) fail("bad authorityBoundary");
if (!Array.isArray(map.claims) || map.claims.length === 0) fail("claims must be non-empty");

const ids = new Set();

for (const claim of map.claims) {
  for (const key of ["id", "description", "status", "verification", "authorityBoundary"]) {
    if (typeof claim[key] !== "string" || !claim[key].trim()) fail("bad " + key);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(claim.id)) fail("bad id " + claim.id);
  if (ids.has(claim.id)) fail("duplicate id " + claim.id);
  ids.add(claim.id);

  if (!statuses.has(claim.status)) fail("bad status " + claim.status);
  if (!claim.verification.startsWith("npm run ")) fail("bad verification " + claim.id);

  if (!Array.isArray(claim.evidence) || claim.evidence.length === 0) {
    fail("bad evidence " + claim.id);
  }

  for (const rel of claim.evidence) {
    if (typeof rel !== "string" || !rel.trim()) fail("bad evidence path " + claim.id);
    if (path.isAbsolute(rel) || rel.includes("..")) fail("unsafe path " + rel);
    if (!fs.existsSync(path.join(root, rel))) fail("missing evidence path " + rel);
  }
}

console.log("OK claim map verified: " + map.claims.length + " claims checked.");
