const fs = require('fs');
const files = [
  'docs/0g-skills/ship-SKILL-v1.md',
  'docs/deployments/0g-dex-first-pair-selection-manifest-v1.md',
  'docs/deployments/0g-dex-pair-init-execution-v1.md',
  'docs/deployments/0g-dex-ship-skill-reconciliation-v1.md'
];
function fail(m){ console.error('FAIL 0g-ship-skill-reconciliation-v1:', m); process.exit(1); }
for (const f of files) if (fs.existsSync(f) === false) fail('missing required file: ' + f);
const d = fs.readFileSync('docs/deployments/0g-dex-ship-skill-reconciliation-v1.md','utf8');
const required = [
  'Status: RECONCILED_NO_BROADCAST',
  'Read-only token metadata probe only.',
  'This reconciliation does not create pairs, add liquidity, approve spenders, transfer tokens, set feeTo, or broadcast transactions.',
  'Factory pair existence must be checked with getPair',
  'private key usage'
];
for (const x of required) if (d.includes(x) === false) fail('missing required text: ' + x);
const skill = fs.readFileSync('docs/0g-skills/ship-SKILL-v1.md','utf8');
if (skill.length < 200) fail('ship skill source unexpectedly short');
console.log('PASS 0g-ship-skill-reconciliation-v1');
