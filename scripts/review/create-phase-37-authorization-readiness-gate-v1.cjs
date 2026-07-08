#!/usr/bin/env node
const { execSync } = require("child_process");

execSync("node scripts/review/verify-phase-37-public-mint-authorization-readiness-gate-v1.cjs", {
  stdio: "inherit",
});

console.log("PHASE_37_AUTHORIZATION_READINESS_GATE_V1_SEALED");
console.log("classification_only=true");
console.log("authorizes_execution=false");
console.log("authorizes_mint=false");
console.log("live_execution_authorization=false");