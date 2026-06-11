#!/usr/bin/env node
const fs=require("fs");
const r=JSON.parse(fs.readFileSync("receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json","utf8"));
const d=fs.readFileSync("docs/autonomous/MAINNET_CUTOVER_READONLY_LIVE_PROBE_V1.md","utf8");
function fail(m){console.error("FAIL mainnet-cutover-readonly-live-probe-v1: "+m);process.exit(1);}
if(r.schema!=="qpf.autonomous.mainnet_cutover_readonly_live_probe.v1")fail("schema mismatch");
if(r.status!=="SEALED_READONLY_LIVE_PROBE")fail("status mismatch");
if(r.base_main_commit!=="b9568e0")fail("base mismatch");
if(!/^[a-f0-9]{64}$/.test(r.runtime_receipt_sha256||""))fail("runtime hash invalid");
for(const k of ["cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_sent","secret_values_printed"]){if(r[k]!==false)fail(k+" must be false");}
for(const k of ["eth_chainId","eth_blockNumber"]){if(!r.probe_scope.includes(k))fail("missing probe "+k);if(!d.includes(k))fail("doc missing "+k);}
const c=r.claim_boundary||{};
if(c.readonly_live_probe_defined!==true)fail("defined claim mismatch");
if(c.readonly_live_probe_executed!==true)fail("executed claim mismatch");
for(const k of ["mainnet_cutover_ready_to_execute","mainnet_cutover_complete","deployment_complete","broadcast_complete","unsupervised_autonomy_active"]){if(c[k]!==false)fail(k+" must be false");}
if(r.next_authorized_lane!=="mainnet-cutover-command-hash-v1")fail("next lane mismatch");
console.log("PASS mainnet-cutover-readonly-live-probe-v1");
