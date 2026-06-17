#!/usr/bin/env node
const fs = require("fs");

const EXPECTED_ARISTOTLE_CHAIN_ID = "16661";
const EXPECTED_ARISTOTLE_RPC = "https://evmrpc.0g.ai";

const forbiddenKeyNames = [
  "PRIVATE_KEY", "DEPLOYER_PRIVATE_KEY", "FEE_TO_SETTER_PRIVATE_KEY",
  "MNEMONIC", "SEED", "PI_PRIVATE_KEY", "AI_PRIVATE_KEY"
];

function verifyEnv() {
  console.log("=== Wallet Preflight Verifier: Scanning Env ===");
  forbiddenKeyNames.forEach(key => {
    if (process.env[key]) {
      console.error(`FATAL: Forbidden key ${key} detected in environment!`);
      process.exit(1);
    }
  });
  console.log("PASS: No forbidden keys detected.");
}

verifyEnv();
