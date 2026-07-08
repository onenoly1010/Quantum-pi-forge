#!/usr/bin/env node
const { execSync } = require("child_process");

execSync("node scripts/review/public-mint-live-gas-rpc-preview-v1.cjs", { stdio: "inherit" });
execSync("node scripts/review/verify-phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1.cjs", {
  stdio: "inherit",
});

console.log("PHASE_36_READINESS_REPAIR_GATE_V1_SEALED");
console.log("classification_only=true");
console.log("authorizes_execution=false");
console.log("authorizes_mint=false");