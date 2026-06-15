#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { AbiCoder, JsonRpcProvider, getCreate2Address, isAddress, keccak256, Wallet } = require("ethers");
const RECEIPT = "receipts/execution/v2-full-dex-deployment-execution-v1.json";
const DRY_COMMAND = "npm run autonomous:v2-full-dex-deployment:execute -- --dry-run --require-command-hash --receipt receipts/execution/v2-full-dex-deployment-execution-v1.json";
const LIVE_COMMAND = "npm run autonomous:v2-full-dex-deployment:execute -- --require-command-hash --receipt receipts/execution/v2-full-dex-deployment-execution-v1.json";
const DRY_HASH = crypto.createHash("sha256").update(DRY_COMMAND).digest("hex");
const LIVE_HASH = crypto.createHash("sha256").update(LIVE_COMMAND).digest("hex");
const REQUIRED_CHAIN_ID = 16661;
const CREATE2_DEPLOYER = "0x4e59b44847b379578588920cA78FbF26c0B4956C";
const W0G_EXPECTED = "0xD1De4F87C8b195f21254b7163dDA9370D8Df593d";
const FACTORY_EXPECTED = "0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8";
const ROUTER_EXPECTED = "0x2c70129E50BF88eCD59b89d63af2e8920aCF3951";
const PAIR_HASH = "0x0ee982e687af41950da5a27ca2e6e2dd7817c9186efbe5fc30f1f40f72d39853";
const FACTORY_SALT = keccak256(Buffer.from("QPF-0G-Factory-v1-2026"));
const ROUTER_SALT = keccak256(Buffer.from("QPF-0G-Router-v1-2026"));
function fail(msg){ console.error("BLOCKED v2-full-dex-deployment-execute: " + msg); process.exit(1); }
function artifact(paths){ const f = paths.find((p)=>fs.existsSync(p)); if(!f) fail("missing artifact " + paths.join(",")); const j = JSON.parse(fs.readFileSync(f,"utf8")); const raw = j.bytecode && j.bytecode.object ? j.bytecode.object : j.bytecode; const b = String(raw).startsWith("0x") ? String(raw) : "0x" + String(raw); if(!/^0x[0-9a-fA-F]+$/.test(b)) fail("bad bytecode " + f); return { file:f, bytecode:b }; }
async function main(){
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  if(!dryRun && process.env.QPF_FULL_DEX_DEPLOY_EXECUTE !== "YES") fail("live gate QPF_FULL_DEX_DEPLOY_EXECUTE=YES missing");
  if(!args.includes("--require-command-hash")) fail("require-command-hash flag missing");
  const receiptIndex = args.indexOf("--receipt");
  const receipt = receiptIndex >= 0 ? args[receiptIndex + 1] : RECEIPT;
  if(receipt !== RECEIPT) fail("unexpected receipt path " + receipt);
  const rpc = process.env.QPF_0G_RPC_URL || "https://evmrpc.0g.ai";
  const signer = process.env.DEPLOYER || "";
  const feeToSetter = process.env.FEE_TO_SETTER || signer;
  const w0g = process.env.ZERO_G_W0G || "";
  if(!isAddress(signer)) fail("DEPLOYER invalid");
  if(!isAddress(feeToSetter)) fail("FEE_TO_SETTER invalid");
  if(!isAddress(w0g)) fail("ZERO_G_W0G invalid");
  if(w0g !== W0G_EXPECTED) fail("unexpected W0G " + w0g);
  const provider = new JsonRpcProvider(rpc);
  const net = await provider.getNetwork();
  const chainId = Number(net.chainId);
  if(chainId !== REQUIRED_CHAIN_ID) fail("wrong chain " + chainId);
  if(await provider.getCode(CREATE2_DEPLOYER) === "0x") fail("CREATE2 deployer missing code");
  if(await provider.getCode(w0g) === "0x") fail("W0G missing code");
  const factory = artifact(["out/UniswapV2Factory.sol/UniswapV2Factory.json","contracts/out/UniswapV2Factory.sol/UniswapV2Factory.json"]);
  const router = artifact(["out/UniswapV2Router02.sol/UniswapV2Router02.json","contracts/out/UniswapV2Router02.sol/UniswapV2Router02.json"]);
  const coder = AbiCoder.defaultAbiCoder();
  const factoryInit = factory.bytecode + coder.encode(["address"], [feeToSetter]).slice(2);
  const predictedFactory = getCreate2Address(CREATE2_DEPLOYER, FACTORY_SALT, keccak256(factoryInit));
  const routerInit = router.bytecode + coder.encode(["address","address"], [predictedFactory, w0g]).slice(2);
  const predictedRouter = getCreate2Address(CREATE2_DEPLOYER, ROUTER_SALT, keccak256(routerInit));
  if(predictedFactory !== FACTORY_EXPECTED) fail("factory prediction drift " + predictedFactory);
  if(predictedRouter !== ROUTER_EXPECTED) fail("router prediction drift " + predictedRouter);
  if(await provider.getCode(predictedFactory) !== "0x") fail("factory already deployed");
  if(await provider.getCode(predictedRouter) !== "0x") fail("router already deployed");
  let factoryTxHash = null;
  let routerTxHash = null;
  let factoryBlock = null;
  let routerBlock = null;
  let factoryCodeSize = null;
  let routerCodeSize = null;
  if(!dryRun){
    const privateKey = process.env.PRIVATE_KEY || "";
    if(!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) fail("PRIVATE_KEY missing or invalid");
    const wallet = new Wallet(privateKey, provider);
    const walletAddress = await wallet.getAddress();
    if(walletAddress !== signer) fail("PRIVATE_KEY address mismatch " + walletAddress);
    const factoryTx = await wallet.sendTransaction({ to: CREATE2_DEPLOYER, data: FACTORY_SALT + factoryInit.slice(2) });
    const factoryReceipt = await factoryTx.wait();
    if(!factoryReceipt || factoryReceipt.status !== 1) fail("factory tx failed");
    const factoryCode = await provider.getCode(predictedFactory);
    if(factoryCode === "0x") fail("factory code missing after tx");
    const routerTx = await wallet.sendTransaction({ to: CREATE2_DEPLOYER, data: ROUTER_SALT + routerInit.slice(2) });
    const routerReceipt = await routerTx.wait();
    if(!routerReceipt || routerReceipt.status !== 1) fail("router tx failed");
    const routerCode = await provider.getCode(predictedRouter);
    if(routerCode === "0x") fail("router code missing after tx");
    factoryTxHash = factoryTx.hash;
    routerTxHash = routerTx.hash;
    factoryBlock = Number(factoryReceipt.blockNumber);
    routerBlock = Number(routerReceipt.blockNumber);
    factoryCodeSize = (factoryCode.length - 2) / 2;
    routerCodeSize = (routerCode.length - 2) / 2;
  }
  const out = {
    receipt: "v2-full-dex-deployment-execution-v1",
    status: dryRun ? "dry_run" : "success",
    dry_run: dryRun,
    no_broadcast: dryRun,
    no_wallet_signing: dryRun,
    no_state_change: dryRun,
    state_change: !dryRun,
    chain_id_required: REQUIRED_CHAIN_ID,
    chain_id_observed: chainId,
    rpc_url: rpc,
    deployment_scope: "FULL_0G_DEX",
    full_dex_deployment: true,
    signer_deployer: signer,
    create2_deployer: CREATE2_DEPLOYER,
    fee_to_setter: feeToSetter,
    zero_g_w0g: w0g,
    factory_artifact: factory.file,
    router_artifact: router.file,
    factory_salt: FACTORY_SALT,
    router_salt: ROUTER_SALT,
    factory_init_code_hash: keccak256(factoryInit),
    router_init_code_hash: keccak256(routerInit),
    predicted_factory: predictedFactory,
    predicted_router: predictedRouter,
    pair_init_code_hash: PAIR_HASH,
    command: dryRun ? DRY_COMMAND : LIVE_COMMAND,
    command_sha256: dryRun ? DRY_HASH : LIVE_HASH,
    factory_deployment_tx_hash: factoryTxHash,
    router_deployment_tx_hash: routerTxHash,
    factory_deployment_block: factoryBlock,
    router_deployment_block: routerBlock,
    factory_code_size_bytes: factoryCodeSize,
    router_code_size_bytes: routerCodeSize,
    timestamp_utc: new Date().toISOString()
  };
  fs.mkdirSync(path.dirname(receipt), { recursive:true });
  fs.writeFileSync(receipt, JSON.stringify(out,null,2) + "\n");
  console.log(dryRun ? "PASS v2-full-dex-deployment-execute dry-run" : "PASS v2-full-dex-deployment-execute live");
  console.log(dryRun ? "FULL_DEX_DRY_RUN_RECEIPT_PRESENT=true" : "FULL_DEX_LIVE_RECEIPT_PRESENT=true");
  if(!dryRun){ console.log("FACTORY_TX=" + factoryTxHash); console.log("ROUTER_TX=" + routerTxHash); }
  console.log("PREDICTED_FACTORY=" + predictedFactory);
  console.log("PREDICTED_ROUTER=" + predictedRouter);
}
main().catch((e)=>{ console.error(e && e.stack ? e.stack : e); process.exit(1); });
