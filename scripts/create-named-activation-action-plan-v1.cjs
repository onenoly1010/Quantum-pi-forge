const fs=require("fs");
const cp=require("child_process");
const crypto=require("crypto");

const planPath="docs/governance/NAMED_ACTIVATION_ACTION_PLAN_V1.json";
const receiptPath="receipts/governance/named-activation-action-plan-v1.json";

const sh=(cmd)=>{try{return cp.execSync(cmd,{encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim()}catch(e){return String((e.stdout||"")+(e.stderr||"")||e.message).trim()}};
const sha256=(s)=>crypto.createHash("sha256").update(s).digest("hex");
const fail=(m)=>{throw new Error(m)};

if(!fs.existsSync(planPath)) fail("missing plan "+planPath);
const raw=fs.readFileSync(planPath,"utf8");
const plan=JSON.parse(raw);

const checks={
  schema_valid: plan.schema==="qpf.named_activation_action_plan.v1",
  action_name_declared: plan.action_name==="supervised-mainnet-activation-execution-v1",
  classification_only: plan.classification_only===true,
  execution_not_authorized: plan.authorizes_execution===false,
  wallet_actions_not_authorized: plan.authorizes_wallet_actions===false,
  private_key_access_not_authorized: plan.authorizes_private_key_access===false,
  signing_not_authorized: plan.authorizes_signing===false,
  transaction_broadcast_not_authorized: plan.authorizes_transaction_broadcast===false,
  deploy_not_authorized: plan.authorizes_deploy===false,
  stake_not_authorized: plan.authorizes_stake===false,
  mint_not_authorized: plan.authorizes_mint===false,
  participant_growth_not_authorized: plan.authorizes_participant_growth===false,
  chain_id_declared: plan.chain && plan.chain.chain_id===16661,
  named_action_scope_declared: !!plan.named_action_scope,
  in_scope_declared: Array.isArray(plan.in_scope)&&plan.in_scope.length>0,
  out_of_scope_declared: Array.isArray(plan.out_of_scope)&&plan.out_of_scope.length>0,
  target_or_action_scope_declared: !!plan.target_contracts_or_action_scope,
  readiness_satisfied_list_present: Array.isArray(plan.readiness_conditions_satisfied_by_this_plan),
  readiness_not_satisfied_list_present: Array.isArray(plan.readiness_conditions_not_satisfied_by_this_plan)
};

const missing=Object.entries(checks).filter(([,v])=>v!==true).map(([k])=>k);
const passed=missing.length===0;

const receipt={
  schema:"qpf.named_activation_action_plan.receipt.v1",
  created_at:new Date().toISOString(),
  plan:"Named Activation Action Plan v1",
  action_name:plan.action_name,
  status:passed?"sealed":"invalid",
  checks,
  missing_conditions:missing,
  readiness_conditions_satisfied_by_this_plan:plan.readiness_conditions_satisfied_by_this_plan,
  readiness_conditions_not_satisfied_by_this_plan:plan.readiness_conditions_not_satisfied_by_this_plan,
  classification_only:true,
  authorizes_execution:false,
  authorizes_wallet_actions:false,
  authorizes_private_key_access:false,
  authorizes_signing:false,
  authorizes_transaction_broadcast:false,
  authorizes_deploy:false,
  authorizes_stake:false,
  authorizes_mint:false,
  authorizes_participant_growth:false,
  private_key_present:false,
  wallet_actions:false,
  signing_attempted:false,
  transaction_broadcast:false,
  live_execution:false,
  plan_path:planPath,
  plan_sha256:sha256(raw),
  git_head:sh("git rev-parse HEAD"),
  git_status_short:sh("git status --short")
};

fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+"\n");

console.log("NAMED_ACTIVATION_ACTION_PLAN_V1_SEALED");
console.log("file="+receiptPath);
console.log("status="+receipt.status);
console.log("action_name="+receipt.action_name);
console.log("plan_sha256="+receipt.plan_sha256);
console.log("classification_only=true");
console.log("authorizes_execution=false");
console.log("satisfied="+JSON.stringify(receipt.readiness_conditions_satisfied_by_this_plan));
console.log("not_satisfied="+JSON.stringify(receipt.readiness_conditions_not_satisfied_by_this_plan));

if(!passed) process.exit(1);
