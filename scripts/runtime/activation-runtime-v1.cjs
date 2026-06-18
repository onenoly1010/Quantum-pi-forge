#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),crypto=require("crypto"),cp=require("child_process");
const blocked=["PRIVATE_KEY","DEPLOYER_PRIVATE_KEY","WALLET_PRIVATE_KEY","MNEMONIC","SEED_PHRASE","QPF_LIVE_SIGNING","QPF_DEPLOY","QPF_LIQUIDITY","QPF_TREASURY_ROUTING","QPF_REVENUE_CLAIM"];
function sha(x){return crypto.createHash("sha256").update(x).digest("hex");}
function run(c){try{return cp.execSync(c,{encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim()}catch(e){return "ERROR:"+e.message}}
const present=blocked.filter(k=>process.env[k]&&String(process.env[k]).trim()!=="");
if(present.length){console.error("ACTIVATION_RUNTIME_V1_HALTED");console.error("BOUNDARY_VIOLATION_BLOCKED_ENV="+present.join(","));process.exit(1)}
fs.mkdirSync("logs/runtime",{recursive:true});fs.mkdirSync("receipts/runtime/activation-runtime-v1-runs",{recursive:true});
const payload={receipt:"activation-runtime-v1-cycle",timestamp_utc:new Date().toISOString(),mode:"AUTONOMOUS_LOCAL_ORCHESTRATION",canonical_head:run("git rev-parse HEAD"),git_status:run("git status --short"),local_receipt_sealing:true,read_only_checks:true,live_execution_authorized:false,private_key_access_authorized:false,wallet_actions_authorized:false,transaction_signing_authorized:false,deployments_authorized:false,liquidity_authorized:false,treasury_routing_authorized:false,live_revenue_claim:false,halt_on_boundary_violation:true};
const body=JSON.stringify(payload,Object.keys(payload).sort(),2)+"\n";const digest=sha(body);const file=`receipts/runtime/activation-runtime-v1-runs/activation-runtime-${Date.now()}-${digest.slice(0,12)}.json`;fs.writeFileSync(file,body);fs.appendFileSync("logs/runtime/activation-runtime-v1.log",`${payload.timestamp_utc},${payload.canonical_head},${digest},${file}\n`);
console.log("ACTIVATION_RUNTIME_V1_CYCLE_SEALED");console.log("file="+file);console.log("receipt_sha256="+digest);console.log("LIVE_EXECUTION=false");console.log("PRIVATE_KEY_ACCESS=false");console.log("WALLET_ACTIONS=false");
