const fs = require('fs');
const receiptPath = 'receipts/execution/v2-first-pair-metadata-probe-v1.json';
function fail(m){ console.error('FAIL v2-first-pair-metadata-probe-v1:', m); process.exit(1); }
if (fs.existsSync('scripts/probe-v2-first-pair-metadata-v1.cjs') === false) fail('missing probe script');
if (fs.existsSync(receiptPath) === false) fail('missing metadata probe receipt; run TOKEN_B=0x... npm run probe:v2-first-pair-metadata:v1 first');
const r = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
if (r.schema !== 'qpf.v2.first-pair-metadata-probe.v1') fail('bad schema');
if (r.status !== 'READ_ONLY_PROBE_COMPLETE_NO_BROADCAST') fail('bad status');
if (r.chainId !== 16661) fail('bad chainId');
if (r.factory !== '0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8') fail('bad factory');
if (r.router !== '0x2c70129E50BF88eCD59b89d63af2e8920aCF3951') fail('bad router');
if (!r.tokenA || r.tokenA.address !== '0xD1De4F87C8b195f21254b7163dDA9370D8Df593d') fail('bad tokenA');
if (!r.tokenB || typeof r.tokenB.address !== 'string') fail('bad tokenB');
if (!r.boundaries) fail('missing boundaries');
for (const k of ['privateKeyUsed','broadcast','approvals','transfers','liquidityAdded','createPairCalled','feeToMutation']) if (r.boundaries[k] !== false) fail('boundary not false: ' + k);
console.log('PASS v2-first-pair-metadata-probe-v1');
