#!/usr/bin/env node
const { execSync } = require("child_process");

execSync("node scripts/review/verify-phase-39-public-mint-nogo-closure-v1.cjs", {
  stdio: "inherit",
});

console.log("PHASE_39_NOGO_CLOSURE_V1_SEALED");
console.log("classification_only=true");
console.log("authorizes_execution=false");
console.log("authorizes_mint=false");
console.log("reopen_public_mint_authorization=false");
console.log("live_execution_authorization=false");