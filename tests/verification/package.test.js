/**
 * Tests for buildPackageManifest (Gap J) — structure, package_id derivation,
 * component digest correctness, authority boundary.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildPackageManifest, PACKAGE_SCHEMA, PACKAGE_ID_PREFIX } from '../../src/verification/package.js';
import { writeResult } from '../../src/verification/result-store.js';
import { deriveResultId } from '../../src/verification/result-id.js';
import { canonicalizeToBytes } from '../../src/verification/canonical.js';
import { digestSha256, digestSha256File } from '../../src/verification/hash.js';

function makeFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'qpf-pkg-'));

  // Write artifact
  const artifactPath = join(dir, 'artifact.txt');
  writeFileSync(artifactPath, 'hello-qpf-package\n', 'utf8');

  // Write receipt
  const receiptPath = join(dir, 'receipt.json');
  const receiptBody = {
    spec: 'quantum-pi-forge-receipt/v1',
    receipt_id: 'test-pkg-receipt',
    artifact: {
      path: 'artifact.txt',
      digest: digestSha256File(artifactPath),
    },
  };
  writeFileSync(receiptPath, JSON.stringify(receiptBody, null, 2), 'utf8');

  // Build a synthetic result
  const receiptDigest = digestSha256File(receiptPath);
  const artifactDigest = digestSha256File(artifactPath);
  const baseResult = {
    spec: 'quantum-pi-forge-verify-result/v1',
    target: { hash: artifactDigest.hex, type: 'artifact', path: 'artifact.txt' },
    level_requested: 0,
    level_achieved: 0,
    status: 'pass',
    summary: 'All mandatory Level 0 checks succeeded',
    checks: [{ name: 'artifact_located', status: 'pass', detail: 'ok', code: 'OK' }],
    timestamp: new Date().toISOString(),
    verifier: { identity: 'qpf-verify-level0', version: '0.1.0' },
    evidence_binding: {
      artifact_digest: artifactDigest,
      receipt_digest: receiptDigest,
      artifact_path: 'artifact.txt',
      receipt_path: 'receipt.json',
    },
    does_not_authorize: ['governance_decision'],
  };
  const result = { ...baseResult, result_id: deriveResultId(baseResult) };

  // Write result file
  const resultPath = writeResult(result, { sinkDir: dir, cwd: dir });

  return { dir, artifactPath, receiptPath, resultPath, result };
}

describe('buildPackageManifest', () => {
  /** @type {ReturnType<typeof makeFixture>} */
  let fx;

  before(() => {
    fx = makeFixture();
  });

  after(() => {
    try { rmSync(fx.dir, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  it('returns an object with expected top-level fields', () => {
    const m = buildPackageManifest({
      artifactPath: fx.artifactPath,
      receiptPath: fx.receiptPath,
      resultPath: fx.resultPath,
      result: fx.result,
    });
    for (const k of ['schema', 'package_id', 'created_at', 'result_id', 'components', 'authority_boundary']) {
      assert.ok(k in m, `missing field: ${k}`);
    }
  });

  it('schema is qpf-evidence-package/v1', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.equal(m.schema, PACKAGE_SCHEMA);
    assert.equal(PACKAGE_SCHEMA, 'qpf-evidence-package/v1');
  });

  it('package_id starts with expected prefix', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.ok(m.package_id.startsWith(`${PACKAGE_ID_PREFIX}:`), `bad prefix: ${m.package_id}`);
    assert.equal(PACKAGE_ID_PREFIX, 'qpfpkg0');
  });

  it('package_id hex portion is 64 lowercase hex characters', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const hex = m.package_id.slice(`${PACKAGE_ID_PREFIX}:`.length);
    assert.equal(hex.length, 64);
    assert.ok(/^[0-9a-f]+$/.test(hex), `not lowercase hex: ${hex}`);
  });

  it('result_id in manifest matches result.result_id', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.equal(m.result_id, fx.result.result_id);
  });

  it('components block has artifact, receipt, verification_result', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.ok('artifact' in m.components);
    assert.ok('receipt' in m.components);
    assert.ok('verification_result' in m.components);
  });

  it('artifact component digest matches independently computed sha256', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const expected = digestSha256File(fx.artifactPath);
    assert.equal(m.components.artifact.digest.hex, expected.hex);
    assert.equal(m.components.artifact.digest.alg, expected.alg);
  });

  it('receipt component digest matches independently computed sha256', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const expected = digestSha256File(fx.receiptPath);
    assert.equal(m.components.receipt.digest.hex, expected.hex);
  });

  it('verification_result component digest matches independently computed sha256', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const expected = digestSha256File(fx.resultPath);
    assert.equal(m.components.verification_result.digest.hex, expected.hex);
  });

  it('package_id is deterministic — same inputs produce same package_id', () => {
    const m1 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const m2 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.equal(m1.package_id, m2.package_id);
  });

  it('package_id changes when artifact content changes', () => {
    // Write a different artifact to a new path
    const altPath = join(fx.dir, 'artifact-alt.txt');
    writeFileSync(altPath, 'different-content\n', 'utf8');
    const m1 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const m2 = buildPackageManifest({ artifactPath: altPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.notEqual(m1.package_id, m2.package_id);
  });

  it('authority_boundary declares readOnly and no-mutation flags', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.equal(m.authority_boundary.readOnly, true);
    assert.equal(m.authority_boundary.noWalletSigning, true);
    assert.equal(m.authority_boundary.noDeployment, true);
    assert.equal(m.authority_boundary.noGovernanceExecution, true);
    assert.equal(m.authority_boundary.noChainMutation, true);
  });

  it('package_id can be independently verified from component digests and result_id', () => {
    const m = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    // Re-derive package_id using the same algorithm
    const idInput = {
      result_id: m.result_id,
      artifact_digest: m.components.artifact.digest,
      receipt_digest: m.components.receipt.digest,
      verification_result_digest: m.components.verification_result.digest,
    };
    const { hex } = digestSha256(canonicalizeToBytes(idInput));
    const expected = `qpfpkg0:${hex}`;
    assert.equal(m.package_id, expected);
  });

  it('package_id changes when receipt content changes', () => {
    // Write a different receipt to a new path and confirm the package_id diverges.
    const altReceiptPath = join(fx.dir, 'receipt-alt.json');
    writeFileSync(altReceiptPath, JSON.stringify({ spec: 'quantum-pi-forge-receipt/v1', receipt_id: 'different-receipt' }, null, 2), 'utf8');
    const m1 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const m2 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: altReceiptPath, resultPath: fx.resultPath, result: fx.result });
    assert.notEqual(m1.package_id, m2.package_id);
  });

  it('package_id changes when result_id changes', () => {
    // A different result_id — the provenance spine — must propagate to a different package_id.
    const altResult = { ...fx.result, result_id: `qpfv0:${'0'.repeat(64)}` };
    const m1 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const m2 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: altResult });
    assert.notEqual(m1.package_id, m2.package_id);
  });

  it('package_id is stable when result object key order differs', () => {
    // Canonicalization must sort keys; insertion order must not affect package_id.
    const { result_id, spec, target, level_requested, level_achieved, status, summary,
            checks, timestamp, verifier, evidence_binding, does_not_authorize } = fx.result;
    // Deliberately reversed key insertion order relative to makeFixture
    const reordered = {
      does_not_authorize, evidence_binding, verifier, timestamp, checks,
      summary, status, level_achieved, level_requested, target, spec, result_id,
    };
    const m1 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result });
    const m2 = buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: reordered });
    assert.equal(m1.package_id, m2.package_id);
  });

  it('throws when artifact file is missing', () => {
    assert.throws(
      () => buildPackageManifest({ artifactPath: '/no/such/artifact', receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: fx.result }),
      /artifact not found/
    );
  });

  it('throws when result_id is absent from result', () => {
    const bad = { ...fx.result };
    delete bad.result_id;
    assert.throws(
      () => buildPackageManifest({ artifactPath: fx.artifactPath, receiptPath: fx.receiptPath, resultPath: fx.resultPath, result: bad }),
      /result_id/
    );
  });
});
