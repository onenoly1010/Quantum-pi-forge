const fs=require("fs"),cp=require("child_process"),crypto=require("crypto");
const sh=c=>{try{return cp.execSync(c,{encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim()}catch(e){return String((e.stdout||"")+(e.stderr||"")||e.message).trim()}};
const exists=p=>fs.existsSync(p);
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const sha=s=>crypto.createHash("sha256").update(s).digest("hex");
const named="supervised-mainnet-activation-execution-v1";
const docPath="docs/governance/BOUNDED_ACTIVATION_READINESS_GATE_V1.json";
const out="receipts/governance/bounded-activation-readiness-gate-v1.json";
const safeReceipt=p=>{if(!exists(p))return null; try{return read(p)}catch{return null}};
const namedPlan=safeReceipt("docs/governance/NAMED_ACTIVATION_ACTION_PLAN_V1.json");
const human=safeReceipt("receipts/governance/human-operator-approval-v1.json");
const lane=safeReceipt("receipts/governance/execution-lane-separation-gate-v1.json");
const irreversible=safeReceipt("receipts/governance/irreversible-zone-review-v1.json");
const dry=safeReceipt("receipts/governance/dry-run-simulation-v1.json");
const gas=safeReceipt("receipts/governance/gas-funding-quantity-limits-v1.json");
const sealed=r=>r&&r.status==="sealed"&&r.classification_only===true&&r.authorizes_execution===false;
const checks={
  named_action_plan_exists:!!namedPlan,
  named_action_scope_declared:!!namedPlan&&((namedPlan.named_action||namedPlan.action_name)===named),
  explicit_human_operator_approval_exists:sealed(human)&&Array.isArray(human.readiness_conditions_satisfied_by_this_gate)&&human.readiness_conditions_satisfied_by_this_gate.includes("explicit_human_operator_approval_exists"),
  execution_lane_separate_from_classification_lane:sealed(lane)&&Array.isArray(lane.readiness_conditions_satisfied_by_this_gate)&&lane.readiness_conditions_satisfied_by_this_gate.includes("execution_lane_separate_from_classification_lane"),
  irreversible_zone_review_completed:sealed(irreversible)&&Array.isArray(irreversible.readiness_conditions_satisfied_by_this_review)&&irreversible.readiness_conditions_satisfied_by_this_review.includes("irreversible_zone_review_completed"),
  target_contracts_named_or_action_specific_scope_declared:!!namedPlan&&((namedPlan.named_action||namedPlan.action_name)===named),
  dry_run_or_simulation_receipt_present_for_named_action:sealed(dry)&&Array.isArray(dry.readiness_conditions_satisfied_by_this_gate)&&dry.readiness_conditions_satisfied_by_this_gate.includes("dry_run_or_simulation_receipt_present_for_named_action"),
  gas_funding_or_quantity_limits_declared_for_named_action:sealed(gas)&&Array.isArray(gas.readiness_conditions_satisfied_by_this_gate)&&gas.readiness_conditions_satisfied_by_this_gate.includes("gas_funding_or_quantity_limits_declared_for_named_action")
};
const missing=Object.entries(checks).filter(([,v])=>v!==true).map(([k])=>k);
const ready=missing.length===0;
const contractRaw=exists(docPath)?fs.readFileSync(docPath,"utf8"):"";
const receipt={
  schema:"qpf.bounded_activation_readiness_gate.receipt.v1",
  created_at:new Date().toISOString(),
  status:ready?"ready":"not_ready",
  ready,
  named_action:named,
  checks,
  missing_conditions:missing,
  artifact_paths:{
    bounded_gate:docPath,
    named_action_plan:"docs/governance/NAMED_ACTIVATION_ACTION_PLAN_V1.json",
    human_operator_approval:"receipts/governance/human-operator-approval-v1.json",
    execution_lane_separation:"receipts/governance/execution-lane-separation-gate-v1.json",
    irreversible_zone_review:"receipts/governance/irreversible-zone-review-v1.json",
    dry_run_simulation:"receipts/governance/dry-run-simulation-v1.json",
    gas_funding_quantity_limits:"receipts/governance/gas-funding-quantity-limits-v1.json"
  },
  contract_sha256:contractRaw?sha(contractRaw):null,
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
  git_head:sh("git rev-parse HEAD"),
  git_status_short:sh("git status --short")
};
fs.writeFileSync(out,JSON.stringify(receipt,null,2)+"\n");
console.log("BOUNDED_ACTIVATION_READINESS_GATE_V1_SEALED");
console.log("file="+out);
console.log("status="+receipt.status);
console.log("ready="+receipt.ready);
console.log("missing_conditions="+JSON.stringify(receipt.missing_conditions));
console.log("contract_sha256="+receipt.contract_sha256);
console.log("classification_only=true");
console.log("authorizes_execution=false");
if(!ready) process.exit(1);
