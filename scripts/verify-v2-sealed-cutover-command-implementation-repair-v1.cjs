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
for (const text of ["MNEMONIC","eth_sendRawTransaction","sendTransaction","deploy(","setRouter("]) if (src.includes(text)) fail("forbidden live capability: " + text);

if (!src.includes("process.env.PRIVATE_KEY")) fail("missing PRIVATE_KEY env gate");
if (src.includes("--private-key")) fail("wrapper must not pass --private-key on command line");
if (!src.includes("spawnSync(\"forge\"")) fail("missing forge spawnSync execution");
if (!src.includes("QPF_0G_RPC_URL")) fail("missing QPF_0G_RPC_URL override support");

console.log("PASS v2-sealed-cutover-command-implementation-repair-v1");
