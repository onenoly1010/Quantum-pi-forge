const fs=require("fs"),cp=require("child_process"),crypto=require("crypto");
const gatePath="docs/governance/EXECUTION_LANE_SEPARATION_GATE_V1.json";
const receiptPath="receipts/governance/execution-lane-separation-gate-v1.json";
const sh=(cmd)=>{try{return cp.execSync(cmd,{encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim()}catch(e){return String((e.stdout||"")+(e.stderr||"")||e.message).trim()}};
const exists=(p)=>fs.existsSync(p);
const sha=(s)=>crypto.createHash("sha256").update(s).digest("hex");
if(!exists(gatePath)) throw new Error("missing "+gatePath);
const raw=fs.readFileSync(gatePath,"utf8");
const g=JSON.parse(raw);
const checks={
  schema_valid:g.schema==="qpf.execution_lane_separation_gate.v1",
  named_action_valid:g.named_action==="supervised-mainnet-activation-execution-v1",
  classification_only:g.classification_only===true,
  execution_not_authorized:g.authorizes_execution===false,
  wallet_actions_not_authorized:g.authorizes_wallet_actions===false,
  private_key_access_not_authorized:g.authorizes_private_key_access===false,
  signing_not_authorized:g.authorizes_signing===false,
  broadcast_not_authorized:g.authorizes_transaction_broadcast===false,
  deploy_not_authorized:g.authorizes_deploy===false,
  stake_not_authorized:g.authorizes_stake===false,
  mint_not_authorized:g.authorizes_mint===false,
  participant_growth_not_authorized:g.authorizes_participant_growth===false,
  classification_lane_forbids_irreversible_actions:g.separation_contract && Array.isArray(g.separation_contract.classification_lane_forbidden) && g.separation_contract.classification_lane_forbidden.includes("private key access") && g.separation_contract.classification_lane_forbidden.includes("transaction broadcast") && g.separation_contract.classification_lane_forbidden.includes("live execution"),
  future_execution_controls_declared:g.separation_contract && Array.isArray(g.separation_contract.future_execution_lane_required_controls) && g.separation_contract.future_execution_lane_required_controls.includes("exact command hash") && g.separation_contract.future_execution_lane_required_controls.includes("one-shot execution guard"),
  satisfies_execution_lane_separation_only:Array.isArray(g.readiness_conditions_satisfied_by_this_gate) && g.readiness_conditions_satisfied_by_this_gate.length===1 && g.readiness_conditions_satisfied_by_this_gate[0]==="execution_lane_separate_from_classification_lane",
  bounded_gate_exists:exists("docs/governance/BOUNDED_ACTIVATION_READINESS_GATE_V1.json"),
  named_action_plan_exists:exists("docs/governance/NAMED_ACTIVATION_ACTION_PLAN_V1.json")
};
const missing=Object.entries(checks).filter(([,v])=>v!==true).map(([k])=>k);
const receipt={
  schema:"qpf.execution_lane_separation_gate.receipt.v1",
  created_at:new Date().toISOString(),
  status:missing.length?"invalid":"sealed",
  named_action:g.named_action,
  checks,
  missing_conditions:missing,
  readiness_conditions_satisfied_by_this_gate:g.readiness_conditions_satisfied_by_this_gate,
  readiness_conditions_not_satisfied_by_this_gate:g.readiness_conditions_not_satisfied_by_this_gate,
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
  gate_path:gatePath,
  gate_sha256:sha(raw),
  git_head:sh("git rev-parse HEAD"),
  git_status_short:sh("git status --short")
};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+"\n");
console.log("EXECUTION_LANE_SEPARATION_GATE_V1_SEALED");
console.log("file="+receiptPath);
console.log("status="+receipt.status);
console.log("named_action="+receipt.named_action);
console.log("classification_only=true");
console.log("authorizes_execution=false");
console.log("satisfied="+JSON.stringify(receipt.readiness_conditions_satisfied_by_this_gate));
console.log("missing_conditions="+JSON.stringify(receipt.missing_conditions));
if(missing.length) process.exit(1);
