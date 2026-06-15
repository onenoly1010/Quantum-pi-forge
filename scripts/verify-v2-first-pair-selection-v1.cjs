const fs = require('fs');
const doc = 'docs/deployments/0g-dex-first-pair-selection-manifest-v1.md';
const scaffold = 'docs/deployments/0g-dex-pair-init-execution-v1.md';
function fail(m){ console.error('FAIL v2-first-pair-selection-v1:', m); process.exit(1); }
for (const p of [doc, scaffold]) if (fs.existsSync(p) === false) fail('missing required file: ' + p);
const d = fs.readFileSync(doc, 'utf8');
const required = [
  'Status: PAIR_SELECTION_PENDING_NO_BROADCAST',
  'Pair status: NOT_SELECTED',
  'Token A symbol: W0G',
  'Token A address: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d',
  'This manifest does not create pairs, add liquidity, approve spenders, transfer tokens, set feeTo, or broadcast transactions.',
  'Only one first canonical pair may be selected in this lane.'
];
for (const x of required) if (d.includes(x) === false) fail('missing required text: ' + x);
console.log('PASS v2-first-pair-selection-v1');
