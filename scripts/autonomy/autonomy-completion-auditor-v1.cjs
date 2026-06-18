const fs = require("fs");

const required = [
  "docs/governance/LOCAL_AUTONOMOUS_WORKFLOW_SUPERVISOR_V1.md",
  "receipts/governance/local-autonomous-workflow-supervisor-v1.json",
  "docs/governance/FUNDING_CONSTRAINT_RESILIENCE_MODE_V1.md",
  "docs/governance/SUSTAINABILITY_READINESS_GATE_V1.md",
  "docs/reviewer/PUBLIC_EVIDENCE_MIRROR_OFFLINE_REVIEW_PACKET_V1.md",
  "docs/reviewer/REVIEWER_FUNDER_PACKET_V1.md",
  "receipts/governance/local-autonomous-worker-loop-v1.json",
  "docs/governance/AUTONOMY_COMPLETION_AUDITOR_V1.md",
  "receipts/governance/autonomy-completion-auditor-v1.json"
];

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL autonomy-completion-auditor-v1:", message);
    process.exit(1);
  }
}

for (const file of required) assert(fs.existsSync(file), "missing " + file);

const auditorDoc = fs.readFileSync("docs/governance/AUTONOMY_COMPLETION_AUDITOR_V1.md", "utf8");
const auditor = JSON.parse(fs.readFileSync("receipts/governance/autonomy-completion-auditor-v1.json", "utf8"));
const worker = JSON.parse(fs.readFileSync("receipts/governance/local-autonomous-worker-loop-v1.json", "utf8"));

assert(auditorDoc.includes("AUTONOMY_COMPLETION_AUDITOR_V1=true"), "missing auditor assertion");
assert(auditor.supervisor_canonical === true, "supervisor not canonical");
assert(auditor.worker_loop_canonical === true, "worker loop not canonical");
assert(auditor.objective_a_complete === true, "objective A incomplete");
assert(auditor.objective_b_custody_lane_external === true, "objective B custody lane not tracked");
assert(auditor.objective_c_complete === true, "objective C incomplete");
assert(auditor.objective_d_complete === true, "objective D incomplete");
assert(auditor.objective_e_complete === true, "objective E incomplete");
assert(worker.mode === "BOUNDED_LOCAL_AUTONOMY", "worker mode mismatch");
assert(worker.objectives_completed_locally.includes("A"), "worker missing A");
assert(worker.objectives_completed_locally.includes("C"), "worker missing C");
assert(worker.objectives_completed_locally.includes("D"), "worker missing D");
assert(worker.objectives_completed_locally.includes("E"), "worker missing E");
for (const key of ["live_actions_authorized","wallet_signing_authorized","funds_movement_authorized","mainnet_mutation_authorized"]) assert(auditor[key] === false, key + " must remain false");

console.log("PASS autonomy-completion-auditor-v1");
