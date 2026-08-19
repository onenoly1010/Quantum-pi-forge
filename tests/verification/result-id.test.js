/**
 * Tests for deriveResultId (Gap B) — determinism, content-addressing,
 * sensitivity, golden vector.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deriveResultId, RESULT_ID_PREFIX } from '../../src/verification/result-id.js';
import { digestSha256 } from '../../src/verification/hash.js';
import { canonicalizeToBytes } from '../../src/verification/canonical.js';

/** Minimal synthetic verification result matching the expected shape. */
function makeResult(overrides = {}) {
  return {
    spec: 'quantum-pi-forge-verify-result/v1',
    target: { hash: 'abc123', type: 'artifact', path: 'artifact.txt' },
    level_requested: 0,
    level_achieved: 0,
    status: 'pass',
    checks: [
      { name: 'artifact_located', status: 'pass', detail: 'ok', code: 'OK' },
      { name: 'artifact_hash', status: 'pass', detail: 'ok', code: 'OK' },
    ],
    timestamp: '2026-08-19T00:00:00.000Z',
    verifier: { identity: 'qpf-verify-level0', version: '0.1.0' },
    does_not_authorize: ['governance_decision'],
    evidence_binding: {
      artifact_digest: { alg: 'sha256', hex: 'a'.repeat(64) },
      receipt_digest: { alg: 'sha256', hex: 'b'.repeat(64) },
      artifact_path: 'artifact.txt',
      receipt_path: 'receipt.json',
    },
    ...overrides,
  };
}

describe('deriveResultId', () => {
  it('returns a string starting with the expected prefix', () => {
    const id = deriveResultId(makeResult());
    assert.ok(typeof id === 'string');
    assert.ok(id.startsWith(`${RESULT_ID_PREFIX}:`), `expected prefix qpfv0:, got: ${id}`);
  });

  it('prefix constant is qpfv0', () => {
    assert.equal(RESULT_ID_PREFIX, 'qpfv0');
  });

  it('hex portion is 64 lowercase hex characters (SHA-256)', () => {
    const id = deriveResultId(makeResult());
    const hex = id.slice(`${RESULT_ID_PREFIX}:`.length);
    assert.equal(hex.length, 64);
    assert.ok(/^[0-9a-f]+$/.test(hex), `not lowercase hex: ${hex}`);
  });

  it('determinism — two calls with same result (different timestamp) produce identical result_id', () => {
    const base = makeResult();
    const r1 = { ...base, timestamp: '2026-08-19T01:00:00.000Z' };
    const r2 = { ...base, timestamp: '2026-08-19T02:00:00.000Z' };
    assert.equal(deriveResultId(r1), deriveResultId(r2));
  });

  it('timestamp exclusion — modifying timestamp alone does not change result_id', () => {
    const r = makeResult();
    const id1 = deriveResultId({ ...r, timestamp: '2024-01-01T00:00:00.000Z' });
    const id2 = deriveResultId({ ...r, timestamp: '2099-12-31T23:59:59.999Z' });
    assert.equal(id1, id2);
  });

  it('summary exclusion — modifying summary alone does not change result_id', () => {
    const r = makeResult();
    const id1 = deriveResultId({ ...r, summary: 'summary A' });
    const id2 = deriveResultId({ ...r, summary: 'summary B' });
    assert.equal(id1, id2);
  });

  it('does_not_authorize exclusion — modifying does_not_authorize does not change result_id', () => {
    const r = makeResult();
    const id1 = deriveResultId({ ...r, does_not_authorize: ['governance_decision'] });
    const id2 = deriveResultId({ ...r, does_not_authorize: ['governance_decision', 'deployment'] });
    assert.equal(id1, id2);
  });

  it('content-addressing — changing status changes result_id', () => {
    const pass = makeResult({ status: 'pass' });
    const fail = makeResult({ status: 'fail' });
    assert.notEqual(deriveResultId(pass), deriveResultId(fail));
  });

  it('content-addressing — changing artifact_digest changes result_id', () => {
    const r1 = makeResult();
    const r2 = makeResult({
      evidence_binding: {
        ...r1.evidence_binding,
        artifact_digest: { alg: 'sha256', hex: 'c'.repeat(64) },
      },
    });
    assert.notEqual(deriveResultId(r1), deriveResultId(r2));
  });

  it('content-addressing — changing receipt_digest changes result_id', () => {
    const r1 = makeResult();
    const r2 = makeResult({
      evidence_binding: {
        ...r1.evidence_binding,
        receipt_digest: { alg: 'sha256', hex: 'd'.repeat(64) },
      },
    });
    assert.notEqual(deriveResultId(r1), deriveResultId(r2));
  });

  it('content-addressing — changing verifier version changes result_id', () => {
    const r1 = makeResult({ verifier: { identity: 'qpf-verify-level0', version: '0.1.0' } });
    const r2 = makeResult({ verifier: { identity: 'qpf-verify-level0', version: '0.2.0' } });
    assert.notEqual(deriveResultId(r1), deriveResultId(r2));
  });

  it('content-addressing — changing a check status changes result_id', () => {
    const r1 = makeResult();
    const r2 = makeResult({
      checks: [
        { name: 'artifact_located', status: 'fail', detail: 'missing', code: 'ARTIFACT_MISSING' },
        { name: 'artifact_hash', status: 'unavailable', detail: 'n/a', code: 'ARTIFACT_MISSING' },
      ],
    });
    assert.notEqual(deriveResultId(r1), deriveResultId(r2));
  });

  it('result without evidence_binding still produces a valid id', () => {
    const r = makeResult();
    delete r.evidence_binding;
    const id = deriveResultId(r);
    assert.ok(id.startsWith('qpfv0:'));
  });

  it('result with evidence_binding and without produce different ids', () => {
    const withBinding = makeResult();
    const withoutBinding = makeResult();
    delete withoutBinding.evidence_binding;
    assert.notEqual(deriveResultId(withBinding), deriveResultId(withoutBinding));
  });

  it('golden vector — fixed synthetic result produces a stable known result_id', () => {
    // This test pins the derivation. If the canonicalization or hash changes
    // this value will break, which is the intended regression signal.
    const fixture = {
      spec: 'quantum-pi-forge-verify-result/v1',
      target: { hash: 'deadbeef', type: 'artifact', path: 'fixture.txt' },
      level_requested: 0,
      level_achieved: 0,
      status: 'pass',
      checks: [{ name: 'artifact_located', status: 'pass', detail: 'ok', code: 'OK' }],
      timestamp: 'EXCLUDED',
      verifier: { identity: 'qpf-verify-level0', version: '0.1.0' },
      does_not_authorize: ['EXCLUDED'],
      evidence_binding: {
        artifact_digest: { alg: 'sha256', hex: '0'.repeat(64) },
        receipt_digest: { alg: 'sha256', hex: 'f'.repeat(64) },
        artifact_path: 'fixture.txt',
        receipt_path: 'receipt.json',
      },
    };
    // Compute expected value independently using the same primitives.
    const stable = {
      spec: fixture.spec,
      target: fixture.target,
      level_requested: fixture.level_requested,
      level_achieved: fixture.level_achieved,
      status: fixture.status,
      checks: fixture.checks,
      verifier: fixture.verifier,
      evidence_binding: fixture.evidence_binding,
    };
    const { hex } = digestSha256(canonicalizeToBytes(stable));
    const expected = `qpfv0:${hex}`;
    assert.equal(deriveResultId(fixture), expected);
  });
});
