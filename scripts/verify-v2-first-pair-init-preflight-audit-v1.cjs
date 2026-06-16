const fs = require('fs');
const receiptPath = 'receipts/execution/v2-first-pair-metadata-probe-v1.json';
const docPath = 'docs/deployments/0g-dex-first-pair-init-preflight-audit-v1.md';
function fail(m){ console.error('FAIL v2-first-pair-init-preflight-audit-v1:', m); process.exit(1); }
if (fs.existsSync(docPath) === false) fail('missing preflight audit doc');
if (fs.existsSync(receiptPath) === false) fail('missing metadata probe receipt');
const d = fs.readFileSync(docPath, 'utf8');
for (const marker of ['PREFLIGHT_AUDIT_ONLY_NO_BROADCAST','W0G','USDC.e','does not use a private key','does not broadcast','does not call createPair']) if (d.includes(marker) === false) fail('missing doc marker: ' + marker);
const r = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
if ((r.schema === 'qpf.v2.first-pair-metadata-probe.v1') === false) fail('bad receipt schema');
if ((r.status === 'READ_ONLY_PROBE_COMPLETE_NO_BROADCAST') === false) fail('bad receipt status');
if ((r.chainId === 16661) === false) fail('bad chainId');
if ((r.tokenA.address === '0xD1De4F87C8b195f21254b7163dDA9370D8Df593d') === false) fail('bad tokenA');
if ((r.tokenB.address === '0x1f3aa82227281ca364bfb3d253b0f1af1da6473e') === false) fail('bad tokenB');
if ((r.tokenB.symbol === 'USDC.e') === false) fail('bad tokenB symbol');
if ((r.factoryGetPair === '0x0000000000000000000000000000000000000000') === false) fail('pair already exists or nonzero getPair');
if ((r.pairExists === false) === false) fail('pairExists must be false');
for (const k of ['privateKeyUsed','broadcast','approvals','transfers','liquidityAdded','createPairCalled','feeToMutation']) if ((r.boundaries[k] === false) === false) fail('boundary not false: ' + k);
console.log('PASS v2-first-pair-init-preflight-audit-v1');
