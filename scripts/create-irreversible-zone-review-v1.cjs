const fs=require("fs"),cp=require("child_process"),crypto=require("crypto");
const reviewPath="docs/governance/IRREVERSIBLE_ZONE_REVIEW_V1.json";
const receiptPath="receipts/governance/irreversible-zone-review-v1.json";
const sh=(cmd)=>{try{return cp.execSync(cmd,{encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim()}catch(e){return String((e.stdout||"")+(e.stderr||"")||e.message).trim()}};
const exists=(p)=>fs.existsSync(p);
const sha=(s)=>crypto.createHash("sha256").update(s).digest("hex");
if(!exists(reviewPath)) throw new Error("missing "+reviewPath);
const raw=fs.readFileSync(reviewPath,"utf8");
const r=JSON.parse(raw);
const required=["private_key_access","wallet_connection","signing","transaction_broadcast","deploy","stake","mint","participant_growth","approval_or_allowance","ownership_or_admin_change","liquidity_or_funds_movement"];
const checks={
  schema_valid:r.schema==="qpf.irreversible_zone_review.v1",
  named_action_valid:r.named_action==="supervised-mainnet-activation-execution-v1",
  chain_id_valid:r.chain&&r.chain.chain_id===16661,
  classification_only:r.classification_only===true,
  execution_not_authorized:r.authorizes_execution===false,
  wallet_actions_not_authorized:r.authorizes_wallet_actions===false,
  private_key_access_not_authorized:r.authorizes_private_key_access===false,
  signing_not_authorized:r.authorizes_signing===false,
  broadcast_not_authorized:r.authorizes_transaction_broadcast===false,
  deploy_not_authorized:r.authorizes_deploy===false,
  stake_not_authorized:r.authorizes_stake===false,
  mint_not_authorized:r.authorizes_mint===false,
  participant_growth_not_authorized:r.authorizes_participant_growth===false,
  all_irreversible_actions_reviewed:Array.isArray(r.irreversible_actions_reviewed)&&required.every(x=>r.irreversible_actions_reviewed.includes(x)),
  future_controls_present:Array.isArray(r.required_future_controls)&&r.required_future_controls.length>=8,
  stop_conditions_present:Array.isArray(r.stop_conditions)&&r.stop_conditions.length>=8,
  satisfies_irreversible_zone_review_only:Array.isArray(r.readiness_conditions_satisfied_by_this_review)&&r.readiness_conditions_satisfied_by_this_review.length===1&&r.readiness_conditions_satisfied_by_this_review[0]==="irreversible_zone_review_completed",
  still_blocks_remaining_conditions:Array.isArray(r.readiness_conditions_not_satisfied_by_this_review)&&r.readiness_conditions_not_satisfied_by_this_review.includes("explicit_human_operator_approval_exists")&&r.readiness_conditions_not_satisfied_by_this_review.includes("dry_run_or_simulation_receipt_present_for_named_action")&&r.readiness_conditions_not_satisfied_by_this_review.includes("gas_funding_or_quantity_limits_declared_for_named_action"),
  bounded_gate_exists:exists("docs/governance/BOUNDED_ACTIVATION_READINESS_GATE_V1.json"),
  named_plan_exists:exists("docs/governance/NAMED_ACTIVATION_ACTION_PLAN_V1.json"),
  execution_lane_gate_exists:exists("docs/governance/EXECUTION_LANE_SEPARATION_GATE_V1.json")
};
const missing=Object.entries(checks).filter(([,v])=>v!==true).map(([k])=>k);
const receipt={
  schema:"qpf.irreversible_zone_review.receipt.v1",
  created_at:new Date().toISOString(),
  status:missing.length?"invalid":"sealed",
  named_action:r.named_action,
  checks,
  missing_conditions:missing,
  readiness_conditions_satisfied_by_this_review:r.readiness_conditions_satisfied_by_this_review,
  readiness_conditions_not_satisfied_by_this_review:r.readiness_conditions_not_satisfied_by_this_review,
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
  review_path:reviewPath,
  review_sha256:sha(raw),
  git_head:sh("git rev-parse HEAD"),
  git_status_short:sh("git status --short")
};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+"\n");
console.log("IRREVERSIBLE_ZONE_REVIEW_V1_SEALED");
console.log("file="+receiptPath);
console.log("status="+receipt.status);
console.log("named_action="+receipt.named_action);
console.log("classification_only=true");
console.log("authorizes_execution=false");
console.log("satisfied="+JSON.stringify(receipt.readiness_conditions_satisfied_by_this_review));
console.log("missing_conditions="+JSON.stringify(receipt.missing_conditions));
if(missing.length) process.exit(1);
