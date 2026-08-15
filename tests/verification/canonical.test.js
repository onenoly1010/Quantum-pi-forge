/**
 * Milestone 1 — canonical serialization tests (deterministic).
 * Does not test hashing, signing, or full verification.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CANONICAL_ENCODING_ID,
  canonicalize,
  canonicalizeToBytes,
  canonicalEncodingInfo,
} from '../../src/verification/canonical.js';

describe('QPF M1 canonical serialization', () => {
  it('declares jcs-rfc8785 encoding id', () => {
    assert.equal(CANONICAL_ENCODING_ID, 'jcs-rfc8785');
    assert.equal(canonicalEncodingInfo().encoding, 'jcs-rfc8785');
  });

  it('sorts object keys regardless of insertion order', () => {
    const a = { z: 1, a: 2, m: 3 };
    const b = { m: 3, z: 1, a: 2 };
    const c = { a: 2, m: 3, z: 1 };
    assert.equal(canonicalize(a), canonicalize(b));
    assert.equal(canonicalize(b), canonicalize(c));
    assert.equal(canonicalize(a), '{"a":2,"m":3,"z":1}');
  });

  it('is independent of whitespace / pretty-print input structure', () => {
    // Logical object equality, not string parse of pretty JSON
    const compact = { nested: { b: true, a: false }, list: [1, 2] };
    const rebuilt = JSON.parse(JSON.stringify(compact, null, 2));
    assert.equal(canonicalize(compact), canonicalize(rebuilt));
    assert.equal(canonicalize(compact), '{"list":[1,2],"nested":{"a":false,"b":true}}');
  });

  it('emits no insignificant whitespace', () => {
    const s = canonicalize({ b: 1, a: { d: 2, c: 3 } });
    assert.equal(s.includes(' '), false);
    assert.equal(s.includes('\n'), false);
    assert.equal(s.includes('\t'), false);
  });

  it('handles null, booleans, empty containers', () => {
    assert.equal(canonicalize(null), 'null');
    assert.equal(canonicalize(true), 'true');
    assert.equal(canonicalize(false), 'false');
    assert.equal(canonicalize({}), '{}');
    assert.equal(canonicalize([]), '[]');
  });

  it('preserves array order (does not sort arrays)', () => {
    assert.equal(canonicalize([3, 1, 2]), '[3,1,2]');
    assert.notEqual(canonicalize([3, 1, 2]), canonicalize([1, 2, 3]));
  });

  it('canonicalizes nested arrays of objects', () => {
    const v = [
      { b: 1, a: 2 },
      { y: 3, x: 4 },
    ];
    assert.equal(canonicalize(v), '[{"a":2,"b":1},{"x":4,"y":3}]');
  });

  it('escapes strings consistently', () => {
    assert.equal(canonicalize({ msg: 'a"b\\c' }), '{"msg":"a\\"b\\\\c"}');
  });

  it('produces identical UTF-8 bytes for equal logical objects', () => {
    const o1 = { schema: 'qpf.receipt.v1', z: 0, artifact: { dig: 'ab' } };
    const o2 = { artifact: { dig: 'ab' }, schema: 'qpf.receipt.v1', z: 0 };
    const b1 = canonicalizeToBytes(o1);
    const b2 = canonicalizeToBytes(o2);
    assert.deepEqual(b1, b2);
    assert.equal(new TextDecoder().decode(b1), canonicalize(o1));
  });

  it('rejects non-finite numbers', () => {
    assert.throws(() => canonicalize({ n: NaN }), /non-finite/);
    assert.throws(() => canonicalize({ n: Infinity }), /non-finite/);
    assert.throws(() => canonicalize(-Infinity), /non-finite/);
  });

  it('rejects undefined, functions, bigint, non-plain objects', () => {
    assert.throws(() => canonicalize(undefined), /undefined/);
    assert.throws(() => canonicalize({ a: undefined }), /undefined/);
    assert.throws(() => canonicalize(() => {}), /function/);
    assert.throws(() => canonicalize(1n), /bigint/);
    assert.throws(() => canonicalize(new Date()), /plain objects/);
  });

  it('stable golden vector for protocol-shaped fixture', () => {
    const receiptLike = {
      schema: 'qpf.receipt.v1',
      receipt_id: 'r1',
      artifact_digest: { alg: 'blake3', hex: '00' },
      envelope: { readOnly: true, noWalletSigning: true },
      produced_at: '2026-08-08T00:00:00.000Z',
      actor: 'test',
    };
    // Keys reordered copy
    const shuffled = {
      actor: 'test',
      produced_at: '2026-08-08T00:00:00.000Z',
      envelope: { noWalletSigning: true, readOnly: true },
      artifact_digest: { hex: '00', alg: 'blake3' },
      receipt_id: 'r1',
      schema: 'qpf.receipt.v1',
    };
    const expected =
      '{"actor":"test","artifact_digest":{"alg":"blake3","hex":"00"},"envelope":{"noWalletSigning":true,"readOnly":true},"produced_at":"2026-08-08T00:00:00.000Z","receipt_id":"r1","schema":"qpf.receipt.v1"}';
    assert.equal(canonicalize(receiptLike), expected);
    assert.equal(canonicalize(shuffled), expected);
  });
});
