#!/usr/bin/env node
/**
 * qpf-external-verification/v1
 *
 * T0/T1/T2-A/T2-B are separate propositions. One failure does not rewrite another.
 * FAIL ≠ BLOCKED.
 *
 * T2-B needs no RPC and no wallet. It is the outsider golden-vector test.
 */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const fixtureDir = join(here, 'fixtures/t2b-golden');

const suite = JSON.parse(readFileSync(join(here, 'SUITE.json'), 'utf8'));

function sha256File(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

function verdict({ status, detail, evidence }) {
  return { status, detail, evidence };
}

async function t2b() {
  const manifest = JSON.parse(readFileSync(join(fixtureDir, 'manifest.json'), 'utf8'));
  const { verifyLevel0 } = await import(join(root, 'src/verification/verify-level0.js'));
  const { deriveResultId } = await import(join(root, 'src/verification/result-id.js'));
  const { digestSha256File, digestSha256 } = await import(join(root, 'src/verification/hash.js'));
  const { canonicalizeToBytes } = await import(join(root, 'src/verification/canonical.js'));

  const artifactPath = join(fixtureDir, 'artifact.bin');
  const receiptPath = join(fixtureDir, 'receipt.json');
  const expectedResultPath = join(fixtureDir, 'expected-result.json');
  const expectedPackagePath = join(fixtureDir, 'expected-package.json');

  for (const p of [artifactPath, receiptPath, expectedResultPath, expectedPackagePath]) {
    if (!existsSync(p)) {
      return verdict({
        status: 'BLOCKED',
        detail: `missing fixture file ${p}`,
        evidence: { path: p },
      });
    }
  }

  const artHex = sha256File(artifactPath);
  const recHex = sha256File(receiptPath);
  const resHex = sha256File(expectedResultPath);
  if (artHex !== manifest.expected.artifact_digest.hex) {
    return verdict({
      status: 'FAIL',
      detail: 'artifact.bin digest does not match golden manifest',
      evidence: { observed: artHex, expected: manifest.expected.artifact_digest.hex },
    });
  }
  if (recHex !== manifest.expected.receipt_digest.hex) {
    return verdict({
      status: 'FAIL',
      detail: 'receipt.json digest does not match golden manifest',
      evidence: { observed: recHex, expected: manifest.expected.receipt_digest.hex },
    });
  }
  if (resHex !== manifest.expected.verification_result_digest.hex) {
    return verdict({
      status: 'FAIL',
      detail: 'expected-result.json digest does not match golden manifest',
      evidence: { observed: resHex, expected: manifest.expected.verification_result_digest.hex },
    });
  }

  const expectedResult = JSON.parse(readFileSync(expectedResultPath, 'utf8'));
  const derivedId = deriveResultId(expectedResult);
  if (derivedId !== manifest.expected.result_id) {
    return verdict({
      status: 'FAIL',
      detail: 're-derived result_id from expected-result.json does not match golden',
      evidence: { observed: derivedId, expected: manifest.expected.result_id },
    });
  }

  const idInput = {
    result_id: derivedId,
    artifact_digest: digestSha256File(artifactPath),
    receipt_digest: digestSha256File(receiptPath),
    verification_result_digest: digestSha256File(expectedResultPath),
  };
  const { hex } = digestSha256(canonicalizeToBytes(idInput));
  const derivedPkg = `qpfpkg0:${hex}`;
  if (derivedPkg !== manifest.expected.package_id) {
    return verdict({
      status: 'FAIL',
      detail: 're-derived package_id does not match golden',
      evidence: { observed: derivedPkg, expected: manifest.expected.package_id },
    });
  }

  const live = verifyLevel0({
    spec: 'quantum-pi-forge-verify/v1',
    level_requested: 0,
    target: { type: 'artifact', path: 'artifact.bin' },
    receipt: { path: 'receipt.json' },
    cwd: fixtureDir,
  });
  if (live.status !== 'pass') {
    return verdict({
      status: 'FAIL',
      detail: `verifyLevel0 status ${live.status}, expected pass`,
      evidence: { status: live.status, result_id: live.result_id },
    });
  }
  if (live.result_id !== manifest.expected.result_id) {
    return verdict({
      status: 'FAIL',
      detail: 'fresh verifyLevel0 result_id drifted from golden (timestamp is excluded; this is a real primitive break)',
      evidence: { observed: live.result_id, expected: manifest.expected.result_id },
    });
  }

  return verdict({
    status: 'pass',
    detail: 'Same inputs → same result_id and package_id. No RPC.',
    evidence: {
      result_id: derivedId,
      package_id: derivedPkg,
    },
  });
}

function t2a() {
  const r = spawnSync(
    process.execPath,
    [
      '--test',
      'tests/verification/result-id.test.js',
      'tests/verification/package.test.js',
      'tests/verification/canonical.test.js',
      'tests/verification/level0.test.js',
    ],
    { cwd: root, encoding: 'utf8' }
  );
  if (r.error) {
    return verdict({
      status: 'BLOCKED',
      detail: `could not spawn node --test: ${r.error.message}`,
      evidence: {},
    });
  }
  if (r.status !== 0) {
    return verdict({
      status: 'FAIL',
      detail: 'documented verification tests failed',
      evidence: { exit: r.status, stderr: (r.stderr || '').slice(-800) },
    });
  }
  return verdict({
    status: 'pass',
    detail: 'result-id, package, canonical, and level0 tests passed',
    evidence: { exit: 0 },
  });
}

async function rpc(method, params) {
  const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 20000);
  try {
    const res = await fetch('https://evmrpc.0g.ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      signal: ac.signal,
    });
    const json = await res.json();
    return json.result;
  } finally {
    clearTimeout(t);
  }
}

async function t1() {
  let chain;
  try {
    chain = await rpc('eth_chainId', []);
  } catch (e) {
    return verdict({
      status: 'BLOCKED',
      detail: `RPC unavailable: ${e.name || e.message}`,
      evidence: { rpc: 'https://evmrpc.0g.ai' },
    });
  }
  if (chain !== '0x4115') {
    return verdict({
      status: 'FAIL',
      detail: `eth_chainId ${chain}, published claim 0x4115 (16661)`,
      evidence: { observed: chain, expected: '0x4115' },
    });
  }
  const code = await rpc('eth_getCode', [
    '0x75995EC0fdf881189850aeD864cB3f43c0DFCb58',
    'latest',
  ]);
  if (!code || code === '0x') {
    return verdict({
      status: 'FAIL',
      detail: 'published OINIO token has no code on 16661',
      evidence: { code },
    });
  }
  const reserves = await rpc('eth_call', [
    { to: '0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE', data: '0x0902f1ac' },
    'latest',
  ]);
  const zeros = '0x' + '0'.repeat(192);
  if (reserves !== zeros) {
    return verdict({
      status: 'FAIL',
      detail: 'published empty-pair claim contradicted: getReserves is not all-zero',
      evidence: { observed: reserves },
    });
  }
  return verdict({
    status: 'pass',
    detail: 'chain 16661, token code present, pair reserves 0/0',
    evidence: { chainId: chain, code_len: (code.length - 2) / 2, reserves: '0/0' },
  });
}

async function t0() {
  const localPath = join(root, 'deploy/verification-artifact.json');
  if (!existsSync(localPath)) {
    return verdict({
      status: 'BLOCKED',
      detail: 'deploy/verification-artifact.json missing from checkout',
      evidence: {},
    });
  }
  const local = JSON.parse(readFileSync(localPath, 'utf8'));
  let live;
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 20000);
    const res = await fetch('https://quantumpiforge.com/verification-artifact.json', {
      signal: ac.signal,
    });
    clearTimeout(t);
    live = await res.json();
  } catch (e) {
    return verdict({
      status: 'BLOCKED',
      detail: `live public JSON unavailable: ${e.name || e.message}`,
      evidence: { url: 'https://quantumpiforge.com/verification-artifact.json' },
    });
  }
  if (live.result_id !== local.result_id || live.package_id !== local.package_id) {
    return verdict({
      status: 'FAIL',
      detail: 'live inspect JSON identifiers do not match git publish object',
      evidence: {
        live_result_id: live.result_id,
        git_result_id: local.result_id,
        live_package_id: live.package_id,
        git_package_id: local.package_id,
      },
    });
  }
  if (live.first_dollar_earned === true) {
    return verdict({
      status: 'FAIL',
      detail: 'public JSON claims first dollar earned; Autodeposit confirmation is not established',
      evidence: { first_dollar_earned: live.first_dollar_earned },
    });
  }
  return verdict({
    status: 'pass',
    detail: 'live inspect JSON matches git identifiers; no false earning claim',
    evidence: { result_id: live.result_id, package_id: live.package_id },
  });
}

function rollup(tests) {
  const statuses = tests.map((t) => t.result.status);
  if (statuses.includes('FAIL')) return 'FAIL';
  const applicable = tests.filter((t) => t.result.status !== 'BLOCKED');
  if (applicable.length === 0) return 'BLOCKED';
  if (statuses.includes('BLOCKED')) return 'PARTIAL';
  const passed = applicable.every((t) => t.result.status === 'pass');
  if (passed && !statuses.includes('BLOCKED')) return 'CONFIRM';
  if (passed) return 'PARTIAL';
  return 'PARTIAL';
}

const commit = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
const commitShort = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
});

const tests = [];
tests.push({ id: 'T2-B', proposition: suite.propositions['T2-B'], result: await t2b() });
tests.push({ id: 'T2-A', proposition: suite.propositions['T2-A'], result: t2a() });
tests.push({ id: 'T1', proposition: suite.propositions['T1'], result: await t1() });
tests.push({ id: 'T0', proposition: suite.propositions['T0'], result: await t0() });

const report = {
  spec: suite.spec,
  suite_version: suite.suite_version,
  fixture_set: suite.fixture_set,
  fixture_version: suite.fixture_version,
  qpf_commit: (commit.stdout || '').trim() || null,
  qpf_commit_short: (commitShort.stdout || '').trim() || null,
  run_at_utc: new Date().toISOString(),
  tests,
  overall: rollup(tests),
  does_not_authorize: suite.does_not_authorize,
  first_dollar_earned: false,
};

console.log(JSON.stringify(report, null, 2));

if (report.overall === 'FAIL') process.exit(1);
if (report.overall === 'BLOCKED') process.exit(3);
process.exit(0);
