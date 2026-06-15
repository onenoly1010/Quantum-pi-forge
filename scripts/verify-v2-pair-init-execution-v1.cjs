const fs = require('fs');
const doc = 'docs/deployments/0g-dex-pair-init-execution-v1.md';
const readiness = 'docs/deployments/0g-dex-pair-init-readiness-v1.md';
const live = 'docs/deployments/full-0g-dex-live-status-v1.md';
const receipt = 'receipts/execution/v2-pair-init-execution-v1.json';
function fail(m){ console.error('FAIL v2-pair-init-execution-v1:', m); process.exit(1); }
for (const p of [doc, readiness, live, receipt]) if (fs.existsSync(p) === false) fail('missing required file: ' + p);
const d = fs.readFileSync(doc, 'utf8');
const r = JSON.parse(fs.readFileSync(receipt, 'utf8'));
const required = [
  'Status: SUPERVISED_EXECUTION_PENDING',
  'Pair status: NOT_SELECTED',
  'This scaffold does not create pairs, add liquidity, approve spenders, transfer tokens, set feeTo, or broadcast transactions.',
  'receipts/execution/v2-pair-init-execution-v1.json',
  'npm run governance:v2-pair-init-execution:v1:check'
];
for (const x of required) if (d.includes(x) === false) fail('missing required text: ' + x);
if (r.status !== 'PENDING_NO_BROADCAST') fail('receipt status must be PENDING_NO_BROADCAST');
if (r.execution.broadcast !== false) fail('receipt broadcast must be false');
if (r.pair.status !== 'NOT_SELECTED') fail('pair status must be NOT_SELECTED');
console.log('PASS v2-pair-init-execution-v1');
