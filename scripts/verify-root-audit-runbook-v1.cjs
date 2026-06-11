const fs = require("fs");

function fail(message) {
  console.error("FAIL root-audit-runbook-v1:", message);
  process.exit(1);
}

if (!fs.existsSync("AUDIT.md")) fail("missing AUDIT.md");
if (!fs.existsSync("scripts/audit-full-local.cjs")) fail("missing audit runner");

const audit = fs.readFileSync("AUDIT.md", "utf8");

const required = [
  "Canonical reviewer onboarding runbook",
  "This runbook is non-executing",
  "npm run audit:full-local",
  "Hosted CI failure is not hidden",
  "Do not deploy",
  "Do not broadcast",
  "Do not flip mainnet approval flags",
  "Do not perform state-changing transactions",
  "docs/governance/AUDIT_HARDENING_READINESS_V1.md",
  "scripts/verify-pr-251-post-merge-governance-receipt-v1.cjs",
  "The expected conclusion is not production readiness"
];

for (const needle of required) {
  if (!audit.includes(needle)) fail(`AUDIT.md missing: ${needle}`);
}

console.log("PASS root-audit-runbook-v1");
