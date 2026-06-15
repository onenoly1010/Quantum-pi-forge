#!/usr/bin/env node
"use strict";
const fs = require("fs");
const crypto = require("crypto");
const { isAddress } = require("ethers");
const RECEIPT = "receipts/execution/v2-full-dex-deployment-execution-v1.json";
const EXPECTED_COMMAND = "npm run autonomous:v2-full-dex-deployment:execute -- --dry-run --require-command-hash --receipt receipts/execution/v2-full-dex-deployment-execution-v1.json";
const EXPECTED_HASH = crypto.createHash("sha256").update(EXPECTED_COMMAND).digest("hex");
function fail(msg){ console.error("FAIL v2-full-dex-deployment-execution-v1: " + msg); process.exit(1); }
if(!fs.existsSync(RECEIPT)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(RECEIPT,"utf8"));
if(r.receipt !== "v2-full-dex-deployment-execution-v1") fail("bad receipt id");
if(r.status !== "dry_run") fail("bad status " + r.status);
if(r.dry_run !== true || r.no_broadcast !== true || r.no_wallet_signing !== true || r.no_state_change !== true) fail("bad dry-run safety flags");
if(r.chain_id_required !== 16661 || r.chain_id_observed !== 16661) fail("bad chain id");
if(r.deployment_scope !== "FULL_0G_DEX" || r.full_dex_deployment !== true) fail("bad scope");
if(r.command_sha256 !== EXPECTED_HASH) fail("bad command hash");
for (const k of ["signer_deployer","create2_deployer","fee_to_setter","zero_g_w0g","predicted_factory","predicted_router"]) if(!isAddress(r[k])) fail("bad address " + k);
if(r.create2_deployer !== "0x4e59b44847b379578588920cA78FbF26c0B4956C") fail("bad create2 deployer");
if(r.zero_g_w0g !== "0xD1De4F87C8b195f21254b7163dDA9370D8Df593d") fail("bad W0G");
if(r.predicted_factory !== "0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8") fail("bad predicted factory");
if(r.predicted_router !== "0x2c70129E50BF88eCD59b89d63af2e8920aCF3951") fail("bad predicted router");
if(r.pair_init_code_hash !== "0x0ee982e687af41950da5a27ca2e6e2dd7817c9186efbe5fc30f1f40f72d39853") fail("bad pair hash");
console.log("PASS v2-full-dex-deployment-execution-v1");
