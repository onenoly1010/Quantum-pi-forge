#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
function fail(m){ console.error("FAIL v2-sealed-cutover-command-implementation-repair-v1: " + m); process.exit(1); }
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const script = pkg.scripts && pkg.scripts["autonomous:v2-mainnet-cutover:execute"];
if (script !== "node scripts/v2-mainnet-cutover-execute.cjs") fail("package script mismatch");
if (!fs.existsSync("scripts/v2-mainnet-cutover-execute.cjs")) fail("missing wrapper");
const src = fs.readFileSync("scripts/v2-mainnet-cutover-execute.cjs", "utf8");
const cmd = "npm run autonomous:v2-mainnet-cutover:execute -- --require-command-hash --receipt receipts/execution/v2-mainnet-cutover-execution-v1.json";
const hash = crypto.createHash("sha256").update(cmd).digest("hex");
if (hash !== "37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8") fail("hash mismatch");
for (const text of ["QPF_MAINNET_CUTOVER_EXECUTE","--require-command-hash","No deployment executed","No broadcast executed","No wallet signing executed","No state-changing transaction executed","BirthGenesisHeartbeat.s.sol"]) if (!src.includes(text)) fail("missing implementation text: " + text);
for (const text of ["PRIVATE_KEY","MNEMONIC","eth_sendRawTransaction","sendTransaction","deploy(","setRouter("]) if (src.includes(text)) fail("forbidden live capability: " + text);
console.log("PASS v2-sealed-cutover-command-implementation-repair-v1");
