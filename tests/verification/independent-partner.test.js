/**
 * Independent AI Verification Partner — capability benchmark tests.
 * Verifiers under test never write the artifact file.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { digestSha256 } from '../../src/verification/hash.js';
import {
  identifyArtifact,
  verifyIndependent,
  verifyPrimary,
  compareResults,
  runPartner,
  MATCH,
  REVIEW_REQUIRED,
  INDEPENDENT_VERIFIER_IDENTITY,
} from '../../src/verification/independent-partner.js';

function validReceipt(artifactRel, digest) {
  return {
    spec: 'quantum-pi-forge-receipt/v1',
    receipt_id: 'independent-partner-test-1',
    artifact: {
      path: artifactRel,
      type: 'artifact',
      digest: { alg: digest.alg, hex: digest.hex },
    },
    produced_at: '2026-08-19T00:00:00.000Z',
    envelope: { readOnly: true },
  };
}

describe('Independent AI Verification Partner', () => {
  let dir;
  let artifactName;
  let receiptName;
  let originalBytes;
  let originalDigest;

  before(() => {
    dir = mkdtempSync(join(tmpdir(), 'qpf-iap-'));
    artifactName = 'artifact.txt';
    originalBytes = Buffer.from('qpf-independent-partner-fixture-v1\n', 'utf8');
    originalDigest = digestSha256(originalBytes);
    writeFileSync(join(dir, artifactName), originalBytes);
    receiptName = 'receipt.json';
    writeFileSync(
      join(dir, receiptName),
      `${JSON.stringify(validReceipt(artifactName, originalDigest), null, 2)}\n`,
    );
  });

  after(() => {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it('identical artifact → identical digest', () => {
    const a = identifyArtifact(join(dir, artifactName));
    const b = identifyArtifact(join(dir, artifactName));
    assert.equal(a.alg, 'sha256');
    assert.equal(a.hex, b.hex);
    assert.equal(a.hex, originalDigest.hex);
  });

  it('modified artifact → different digest', () => {
    const before = identifyArtifact(join(dir, artifactName));
    const tampered = join(dir, 'tampered.txt');
    writeFileSync(tampered, Buffer.concat([originalBytes, Buffer.from('x')]));
    const after = identifyArtifact(tampered);
    assert.notEqual(after.hex, before.hex);
  });

  it('primary verification success', () => {
    const r = verifyPrimary({ cwd: dir, artifact: artifactName, receipt: receiptName });
    assert.equal(r.status, 'pass');
    assert.equal(r.verifier.identity, 'qpf-verify-level0');
    assert.ok(r.target.hash);
  });

  it('independent verification success (does not copy primary)', () => {
    const r = verifyIndependent({
      cwd: dir,
      artifact: artifactName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    assert.equal(r.status, 'pass');
    assert.equal(r.verifier.identity, INDEPENDENT_VERIFIER_IDENTITY);
    assert.equal(r.copies_primary_result, false);
    assert.equal(r.writes_artifact, false);
    assert.equal(r.target.hash.hex, originalDigest.hex);
  });

  it('matching results → MATCH', () => {
    const evidence = runPartner({
      cwd: dir,
      artifact: artifactName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    assert.equal(evidence.comparison.agreement, MATCH);
    assert.equal(evidence.comparison.selected_winner, null);
    assert.equal(evidence.primary.status, 'pass');
    assert.equal(evidence.independent.status, 'pass');
  });

  it('contradictory results → REVIEW_REQUIRED', () => {
    const real = verifyIndependent({
      cwd: dir,
      artifact: artifactName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    const fakePrimary = {
      spec: 'quantum-pi-forge-verify-result/v1',
      status: 'pass',
      target: {
        type: 'artifact',
        path: artifactName,
        hash: { alg: 'sha256', hex: '0'.repeat(64) },
      },
      checks: [],
      verifier: { identity: 'forged-primary', version: '0.0.0' },
    };
    const comparison = compareResults(fakePrimary, real);
    assert.equal(comparison.agreement, REVIEW_REQUIRED);
    assert.equal(comparison.selected_winner, null);
    assert.ok(comparison.reasons.includes('artifact_digest_mismatch'));
  });

  it('evidence bound to correct artifact', () => {
    const evidence = runPartner({
      cwd: dir,
      artifact: artifactName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    assert.equal(evidence.artifact.identity.hex, originalDigest.hex);
    assert.equal(evidence.comparison.primary_digest.hex, originalDigest.hex);
    assert.equal(evidence.independent.target.hash.hex, originalDigest.hex);
    assert.equal(evidence.comparison.primary_digest.hex, originalDigest.hex);
    assert.equal(evidence.comparison.independent_digest.hex, originalDigest.hex);
  });

  it('verifier cannot silently change the artifact being verified', () => {
    const before = readFileSync(join(dir, artifactName));
    runPartner({ cwd: dir, artifact: artifactName, receipt: receiptName });
    verifyIndependent({ cwd: dir, artifact: artifactName, receipt: receiptName });
    verifyPrimary({ cwd: dir, artifact: artifactName, receipt: receiptName });
    const after = readFileSync(join(dir, artifactName));
    assert.deepEqual(after, before);
  });

  it('tamper after original verification is detected', () => {
    const original = runPartner({
      cwd: dir,
      artifact: artifactName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    assert.equal(original.comparison.agreement, MATCH);

    const tamperedName = 'after-tamper.txt';
    writeFileSync(join(dir, tamperedName), Buffer.concat([originalBytes, Buffer.from('TAMPER')]));
    const tamperedId = identifyArtifact(join(dir, tamperedName));
    assert.notEqual(tamperedId.hex, original.artifact.identity.hex);

    const vsOriginalReceipt = verifyIndependent({
      cwd: dir,
      artifact: tamperedName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    assert.equal(vsOriginalReceipt.status, 'fail');

    const comparison = compareResults(original.primary, vsOriginalReceipt);
    assert.equal(comparison.agreement, REVIEW_REQUIRED);
  });

  it('second execution against same bytes is equivalent (timestamp excluded)', () => {
    const a = verifyIndependent({
      cwd: dir,
      artifact: artifactName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    const b = verifyIndependent({
      cwd: dir,
      artifact: artifactName,
      receipt: receiptName,
      now: '2026-08-19T21:00:00.000Z',
    });
    assert.equal(a.status, b.status);
    assert.equal(a.target.hash.hex, b.target.hash.hex);
    assert.deepEqual(a.checks, b.checks);
  });
});
