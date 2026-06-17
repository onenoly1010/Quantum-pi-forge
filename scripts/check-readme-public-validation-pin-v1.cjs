#!/usr/bin/env node
const fs = require("fs");

const text = fs.readFileSync("README.md", "utf8");

const required = [
  "Quantum Pi Forge Public Validation Status v1 is open.",
  "docs/governance/PUBLIC_VALIDATION_STATUS_V1.md",
  "Liquidity, approvals, staking, relayer flows, funding, and growth loops remain intentionally blocked",
  "Review the proof. Verify the gates. Confirm the boundary."
];

for (const needle of required) {
  if (!text.includes(needle)) {
    throw new Error(`README public validation pin missing: ${needle}`);
  }
}

console.log("OK README public validation pin v1 verified.");
