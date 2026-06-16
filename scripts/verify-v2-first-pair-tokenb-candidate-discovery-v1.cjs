const fs = require('fs');
const docPath = 'docs/deployments/0g-dex-first-pair-tokenb-candidate-discovery-v1.md';
function fail(m){ console.error('FAIL v2-first-pair-tokenb-candidate-discovery-v1:', m); process.exit(1); }
if (fs.existsSync(docPath) === false) fail('missing candidate discovery doc');
const d = fs.readFileSync(docPath, 'utf8');
for (const x of ['Status: CANDIDATE_DISCOVERY_REQUIRED','No Token B address is selected in this lane','verified contract address on 0G Aristotle Mainnet','ERC-20 metadata support','distinct address from W0G','read-only probe receipt before any pair creation']) if (d.includes(x) === false) fail('missing marker: ' + x);
console.log('PASS v2-first-pair-tokenb-candidate-discovery-v1');
