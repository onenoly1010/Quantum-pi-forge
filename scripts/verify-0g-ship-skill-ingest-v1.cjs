const fs = require('fs');
const p = 'docs/0g-skills/ship-SKILL-v1.md';
function fail(m){ console.error('FAIL 0g-ship-skill-ingest-v1:', m); process.exit(1); }
if (fs.existsSync(p) === false) fail('missing ship skill file');
const d = fs.readFileSync(p, 'utf8');
if (d.length < 200) fail('ship skill file unexpectedly short');
for (const x of ['0G','ship','deploy']) if (d.toLowerCase().includes(x.toLowerCase()) === false) fail('missing expected marker: ' + x);
console.log('PASS 0g-ship-skill-ingest-v1');
