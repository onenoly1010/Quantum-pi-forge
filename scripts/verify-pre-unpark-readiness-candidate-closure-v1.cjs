const fs = require('fs');
const path = require('path');
const receiptPath = path.join(process.cwd(), 'receipts/governance/pre-unpark-readiness-candidate-closure-v1.json');
const docPath = path.join(process.cwd(), 'docs/governance/PRE_UNPARK_READINESS_CANDIDATE_CLOSURE_V1.md');
function fail(msg) { console.error('FAIL pre-unpark-readiness-candidate-closure-v1:', msg); process.exit(1); }
if (!fs.existsSync(receiptPath)) fail('missing receipt');
if (!fs.existsSync(docPath)) fail('missing doc');
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
if (receipt.schema !== 'pre-unpark-readiness-candidate-closure-v1') fail('bad schema');
if (receipt.observed_state.READY_TO_UNPARK_CANDIDATE !== true) fail('candidate flag not true');
if (receipt.observed_state.UNPARK_EXECUTED !== false) fail('unpark flag must be false');
if (receipt.observed_state.ACTIVATION_BOUNDARY_REACHED !== true) fail('activation boundary flag not true');
const p = receipt.posture || {};
for (const key of ['activation_executed','unpark_executed','deployment_executed','broadcast_executed','state_changing_transaction_executed','keys_accessed','zero_g_action_performed','stashes_touched']) {
  if (p[key] !== false) fail(key + ' must be false');
}
const doc = fs.readFileSync(docPath, 'utf8');
for (const needle of ['READY_TO_UNPARK_CANDIDATE=true','UNPARK_EXECUTED=false','ACTIVATION_BOUNDARY_REACHED=true','No activation was performed','No 0G action was performed']) {
  if (!doc.includes(needle)) fail('doc missing: ' + needle);
}
console.log('PASS pre-unpark-readiness-candidate-closure-v1');
