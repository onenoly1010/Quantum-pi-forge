/**
 * External verification suite v1 — T2-B golden vectors only.
 * T0/T1 stay in `npm run verify:external:v1` so CI cannot confuse RPC BLOCKED with FAIL.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { verifyLevel0 } from '../../src/verification/verify-level0.js';
import { deriveResultId } from '../../src/verification/result-id.js';
import { digestSha256, digestSha256File } from '../../src/verification/hash.js';
import { canonicalizeToBytes } from '../../src/verification/canonical.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const fixture = join(root, 'external-verification/v1/fixtures/t2b-golden');

function sha256File(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

describe('qpf-external-verification/v1 T2-B', () => {
  const manifest = JSON.parse(readFileSync(join(fixture, 'manifest.json'), 'utf8'));

  it('golden manifest pins matching file digests and identifiers', () => {
    assert.equal(manifest.spec, 'qpf-external-verification/v1');
    assert.equal(manifest.proposition, 'T2-B');
    assert.match(manifest.expected.result_id, /^qpfv0:[0-9a-f]{64}$/);
    assert.match(manifest.expected.package_id, /^qpfpkg0:[0-9a-f]{64}$/);
    assert.equal(sha256File(join(fixture, 'artifact.bin')), manifest.expected.artifact_digest.hex);
    assert.equal(sha256File(join(fixture, 'receipt.json')), manifest.expected.receipt_digest.hex);
    assert.equal(
      sha256File(join(fixture, 'expected-result.json')),
      manifest.expected.verification_result_digest.hex
    );
  });

  it('re-derives result_id and package_id from golden files', () => {
    const expectedResult = JSON.parse(readFileSync(join(fixture, 'expected-result.json'), 'utf8'));
    assert.equal(deriveResultId(expectedResult), manifest.expected.result_id);
    const idInput = {
      result_id: manifest.expected.result_id,
      artifact_digest: digestSha256File(join(fixture, 'artifact.bin')),
      receipt_digest: digestSha256File(join(fixture, 'receipt.json')),
      verification_result_digest: digestSha256File(join(fixture, 'expected-result.json')),
    };
    const { hex } = digestSha256(canonicalizeToBytes(idInput));
    assert.equal(`qpfpkg0:${hex}`, manifest.expected.package_id);
  });

  it('fresh verifyLevel0 reproduces golden result_id (timestamp may differ)', () => {
    const live = verifyLevel0({
      spec: 'quantum-pi-forge-verify/v1',
      level_requested: 0,
      target: { type: 'artifact', path: 'artifact.bin' },
      receipt: { path: 'receipt.json' },
      cwd: fixture,
    });
    assert.equal(live.status, 'pass');
    assert.equal(live.result_id, manifest.expected.result_id);
  });
});
