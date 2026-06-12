const fs = require('fs');
const path = require('path');
const docPath = path.join(process.cwd(), 'deploy/pre-unpark-handoff.html');
function fail(msg) { console.error('FAIL v2-public-handoff-route-v1:', msg); process.exit(1); }
if (!fs.existsSync(docPath)) fail('missing public handoff page');
const content = fs.readFileSync(docPath, 'utf8');
const required = [
  'Pre-Unpark Readiness Handoff',
  'READY_TO_UNPARK_CANDIDATE=true',
  'UNPARK_EXECUTED=false',
  'ACTIVATION_BOUNDARY_REACHED=true',
  'STEWARD_PROOF_DECLARATION_V1.md',
  'PRE_UNPARK_READINESS_CANDIDATE_CLOSURE_V1.md',
  'V2_GOVERNANCE_RECEIPT_CHAIN_INDEX_V1.md',
  'AI_OUTSIDE_REVIEW_ATTESTATION_V1.md',
  'FINAL_PREFLIGHT_CHECKLIST_V1.md',
  'v2-public-funder-packet-index',
  'No activation',
  'No unpark',
  'No deployment',
  'No broadcast',
  'Stashes untouched'
];
for (const needle of required) {
  if (!content.includes(needle)) fail('missing required content: ' + needle);
}
console.log('PASS v2-public-handoff-route-v1');
