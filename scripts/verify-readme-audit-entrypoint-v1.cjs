const fs = require("fs");

function fail(message) {
  console.error("FAIL readme-audit-entrypoint-v1:", message);
  process.exit(1);
}

if (!fs.existsSync("README.md")) fail("missing README.md");
if (!fs.existsSync("AUDIT.md")) fail("missing AUDIT.md");

const readme = fs.readFileSync("README.md", "utf8");

const required = [
  "## For Auditors and Reviewers",
  "[`AUDIT.md`](./AUDIT.md)",
  "npm run audit:full-local",
  "non-executing reviewer onboarding runbook",
  "does not authorize deployment",
  "state-changing transactions"
];

for (const needle of required) {
  if (!readme.includes(needle)) fail(`README.md missing: ${needle}`);
}

console.log("PASS readme-audit-entrypoint-v1");
