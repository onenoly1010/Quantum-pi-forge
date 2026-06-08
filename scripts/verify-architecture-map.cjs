#!/usr/bin/env node

const fs = require("fs");
const file = "docs/ARCHITECTURE.md";

const required = [
  "# Quantum Pi Forge Constellation Architecture",
  "## 1. Purpose",
  "## 2. Constellation Overview",
  "## 3. Core Planes",
  "### 3.1 Infrastructure & Verification Plane",
  "### 3.2 Protocol-of-Intent Plane",
  "### 3.3 Public & Narrative Plane",
  "### 3.4 Chain & Value-Risk Plane",
  "## 4. Repository Map",
  "## 5. Data Flows",
  "## 6. Trust Surfaces",
  "## 7. Deployment Topology",
  "## 8. Human Authority Boundary",
  "## 9. Agent Authority Boundary",
  "## 10. Evidence & Verification Path",
  "## 11. Known Gaps",
  "## 12. Next Formalization Targets",
  "## 13. Non-Goals",
  "## 14. Reviewer Use",
  "No automated component may mutate chain state.",
  "Humans retain exclusive authority over:",
  "Agents may not:",
  "No private keys may be committed.",
  "No implied liquidity.",
  "No implied yield.",
  "This document is descriptive."
];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(file)) fail(`Missing ${file}`);
const text = fs.readFileSync(file, "utf8");

for (const item of required) {
  if (!text.includes(item)) fail(`Missing required architecture marker: ${item}`);
}

console.log("OK: Architecture map exists");
console.log("OK: Required architecture sections found");
console.log("OK: Required authority and value-risk boundaries found");
console.log("Architecture Map v1 verification passed");
