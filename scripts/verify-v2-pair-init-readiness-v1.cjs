const fs = require('fs');
const doc = 'docs/deployments/0g-dex-pair-init-readiness-v1.md';
const base = 'docs/deployments/full-0g-dex-live-status-v1.md';
function fail(m){ console.error('FAIL v2-pair-init-readiness-v1:', m); process.exit(1); }
if (fs.existsSync(doc) === false) fail('missing pair init readiness doc');
if (fs.existsSync(base) === false) fail('missing full dex live status doc');
const d = fs.readFileSync(doc, 'utf8');
const b = fs.readFileSync(base, 'utf8');
const required = [
  'Status: READINESS_ONLY_NO_BROADCAST',
  'W0G: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d',
  'UniswapV2Factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8',
  'UniswapV2Router02: 0x2c70129E50BF88eCD59b89d63af2e8920aCF3951',
  'This lane does not create pairs, add liquidity, transfer tokens, approve spenders, set feeTo, or broadcast transactions.'
];
for (const x of required) if (d.includes(x) === false) fail('missing required text: ' + x);
for (const x of ['0xD1De4F87C8b195f21254b7163dDA9370D8Df593d','0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8','0x2c70129E50BF88eCD59b89d63af2e8920aCF3951']) if (b.includes(x) === false) fail('base deployment doc missing address: ' + x);
console.log('PASS v2-pair-init-readiness-v1');
