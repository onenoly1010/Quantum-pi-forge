const fs=require("fs");
const crypto=require("crypto");

const receiptPath="receipts/governance/named-activation-action-plan-v1.json";
const fail=(m)=>{console.error("FAIL named-activation-action-plan-v1: "+m);process.exit(1)};

if(!fs.existsSync(receiptPath)) fail("missing receipt "+receiptPath);
const r=JSON.parse(fs.readFileSync(receiptPath,"utf8"));

if(r.schema!=="qpf.named_activation_action_plan.receipt.v1") fail("bad receipt schema");
if(r.status!=="sealed") fail("status must be sealed");
if(r.action_name!=="supervised-mainnet-activation-execution-v1") fail("bad action name");
if(r.classification_only!==true) fail("classification_only must be true");

for(const k of [
  "authorizes_execution",
  "authorizes_wallet_actions",
  "authorizes_private_key_access",
  "authorizes_signing",
  "authorizes_transaction_broadcast",
  "authorizes_deploy",
  "authorizes_stake",
  "authorizes_mint",
  "authorizes_participant_growth",
  "private_key_present",
  "wallet_actions",
  "signing_attempted",
  "transaction_broadcast",
  "live_execution"
]){
  if(r[k]!==false) fail(k+" must be false");
}

if(!Array.isArray(r.readiness_conditions_satisfied_by_this_plan)) fail("missing satisfied readiness list");
for(const required of [
  "named_action_plan_exists",
  "named_action_scope_declared",
  "target_contracts_named_or_action_specific_scope_declared"
]){
  if(!r.readiness_conditions_satisfied_by_this_plan.includes(required)) fail("missing satisfied condition "+required);
}

if(!Array.isArray(r.readiness_conditions_not_satisfied_by_this_plan)) fail("missing not-satisfied readiness list");
for(const stillMissing of [
  "explicit_human_operator_approval_exists",
  "execution_lane_separate_from_classification_lane",
  "irreversible_zone_review_completed",
  "dry_run_or_simulation_receipt_present_for_named_action",
  "gas_funding_or_quantity_limits_declared_for_named_action"
]){
  if(!r.readiness_conditions_not_satisfied_by_this_plan.includes(stillMissing)) fail("missing remaining condition "+stillMissing);
}

if(!r.plan_path || !fs.existsSync(r.plan_path)) fail("plan file missing");
const raw=fs.readFileSync(r.plan_path,"utf8");
const actual=crypto.createHash("sha256").update(raw).digest("hex");
if(actual!==r.plan_sha256) fail("plan sha mismatch");

const p=JSON.parse(raw);
if(p.schema!=="qpf.named_activation_action_plan.v1") fail("bad plan schema");
if(p.classification_only!==true) fail("plan classification_only must be true");
if(p.authorizes_execution!==false) fail("plan must not authorize execution");
if(!p.chain || p.chain.chain_id!==16661) fail("chain_id must be 16661");
if(!p.named_action_scope) fail("named action scope missing");
if(!Array.isArray(p.in_scope) || !Array.isArray(p.out_of_scope)) fail("scope lists missing");

console.log("PASS named-activation-action-plan-v1");
console.log("ACTION_NAME "+r.action_name);
console.log("STATUS "+r.status);
console.log("CLASSIFICATION_ONLY true");
console.log("AUTHORIZES_EXECUTION false");
