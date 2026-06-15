#!/usr/bin/env node
"use strict";
const fs = require("fs");
const crypto = require("crypto");
const { isAddress } = require("ethers");
const RECEIPT = "receipts/execution/v2-full-dex-deployment-execution-v1.json";
const DRY_COMMAND = "npm run autonomous:v2-full-dex-deployment:execute -- --dry-run --require-command-hash --receipt receipts/execution/v2-full-dex-deployment-execution-v1.json";
const LIVE_COMMAND = "npm run autonomous:v2-full-dex-deployment:execute -- --require-command-hash --receipt receipts/execution/v2-full-dex-deployment-execution-v1.json";
const DRY_HASH = crypto.createHash("sha256").update(DRY_COMMAND).digest("hex");
const LIVE_HASH = crypto.createHash("sha256").update(LIVE_COMMAND).digest("hex");
function fail(msg){ console.error("FAIL v2-full-dex-deployment-execution-v1: " + msg); process.exit(1); }
function isTxHash(v){ return /^0x[0-9a-fA-F]{64}$/.test(String(v || "")); }
if(!fs.existsSync(RECEIPT)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(RECEIPT,"utf8"));
if(r.receipt !== "v2-full-dex-deployment-execution-v1") fail("bad receipt id");
const mode = r.status;
if(r.chain_id_required !== 16661 || r.chain_id_observed !== 16661) fail("bad chain id");
if(r.deployment_scope !== "FULL_0G_DEX" || r.full_dex_deployment !== true) fail("bad scope");

for (const k of ["signer_deployer","create2_deployer","fee_to_setter","zero_g_w0g","predicted_factory","predicted_router"]) if(!isAddress(r[k])) fail("bad address " + k);
if(r.create2_deployer !== "0x4e59b44847b379578588920cA78FbF26c0B4956C") fail("bad create2 deployer");
if(r.zero_g_w0g !== "0xD1De4F87C8b195f21254b7163dDA9370D8Df593d") fail("bad W0G");
if(r.predicted_factory !== "0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8") fail("bad predicted factory");
if(r.predicted_router !== "0x2c70129E50BF88eCD59b89d63af2e8920aCF3951") fail("bad predicted router");
if(r.pair_init_code_hash !== "0x0ee982e687af41950da5a27ca2e6e2dd7817c9186efbe5fc30f1f40f72d39853") fail("bad pair hash");
if(mode === "dry_run"){
  if(r.dry_run !== true || r.no_broadcast !== true || r.no_wallet_signing !== true || r.no_state_change !== true) fail("bad dry-run safety flags");
  if(r.command !== DRY_COMMAND || r.command_sha256 !== DRY_HASH) fail("bad dry-run command hash");
  console.log("PASS v2-full-dex-deployment-execution-v1");
  process.exit(0);
}
if(mode === "success"){
  if(r.dry_run !== false || r.no_broadcast !== false || r.no_wallet_signing !== false || r.no_state_change !== false || r.state_change !== true) fail("bad live flags");
  if(r.command !== LIVE_COMMAND || r.command_sha256 !== LIVE_HASH) fail("bad live command hash");
  if(!isTxHash(r.factory_deployment_tx_hash)) fail("bad factory tx hash");
  if(!isTxHash(r.router_deployment_tx_hash)) fail("bad router tx hash");
  if(!(Number(r.factory_deployment_block) > 0)) fail("bad factory block");
  if(!(Number(r.router_deployment_block) >= Number(r.factory_deployment_block))) fail("bad router block");
  if(!(Number(r.factory_code_size_bytes) > 0)) fail("bad factory code size");
  if(!(Number(r.router_code_size_bytes) > 0)) fail("bad router code size");
  console.log("PASS v2-full-dex-deployment-execution-v1");
  process.exit(0);
}
fail("bad status " + mode);
