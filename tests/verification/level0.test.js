/**
 * Level 0 quantum-pi-forge-verify/v1 adversarial tests.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  verifyLevel0,
  VERIFY_RESULT_SPEC,
  VERIFY_REQUEST_SPEC,
} from '../../src/verification/verify-level0.js';
import { digestSha256 } from '../../src/verification/hash.js';

function makeFixtureDir() {
  const dir = mkdtempSync(join(tmpdir(), 'qpf-l0-'));
  return dir;
}

function writeArtifact(dir, name, content) {
  const p = join(dir, name);
  writeFileSync(p, content, 'utf8');
  return { path: name, abs: p, digest: digestSha256(content) };
}

function writeReceipt(dir, name, body) {
  const p = join(dir, name);
  writeFileSync(p, JSON.stringify(body, null, 2), 'utf8');
  return name;
}

function validReceipt(artifactRel, digest) {
  return {
    spec: 'quantum-pi-forge-receipt/v1',
    receipt_id: 'test-receipt-1',
    artifact: {
      path: artifactRel,
      type: 'artifact',
      digest: { alg: digest.alg, hex: digest.hex },
    },
    produced_at: '2026-08-08T00:00:00.000Z',
    envelope: { readOnly: true },
  };
}

function run(cwd, artifact, receipt, level = 0) {
  return verifyLevel0({
    spec: VERIFY_REQUEST_SPEC,
    level_requested: level,
    target: { type: 'artifact', path: artifact },
    receipt: { path: receipt },
    cwd,
  });
}

describe('QPF Level 0 verify', () => {
  /** @type {string} */
  let dir;
  let art;
  let receiptName;

  before(() => {
    dir = makeFixtureDir();
    art = writeArtifact(dir, 'artifact.txt', 'hello-qpf-level0\n');
    receiptName = writeReceipt(dir, 'receipt.json', validReceipt(art.path, art.digest));
  });

  after(() => {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it('valid artifact + valid receipt → pass', () => {
    const r = run(dir, art.path, receiptName);
    assert.equal(r.spec, VERIFY_RESULT_SPEC);
    assert.equal(r.status, 'pass');
    assert.equal(r.level_achieved, 0);
    assert.ok(Array.isArray(r.checks));
    assert.ok(r.checks.length >= 5);
    assert.ok(r.checks.every((c) => c.name && c.status && c.detail));
    assert.equal(r.target.hash, art.digest.hex);
    assert.ok(r.does_not_authorize.includes('governance_decision'));
    const hashCheck = r.checks.find((c) => c.name === 'artifact_hash');
    assert.equal(hashCheck.status, 'pass');
  });

  it('missing artifact → unavailable (not fail)', () => {
    const r = run(dir, 'no-such-artifact.bin', receiptName);
    assert.equal(r.status, 'unavailable');
    const loc = r.checks.find((c) => c.name === 'artifact_located');
    assert.equal(loc.status, 'unavailable');
    assert.notEqual(r.status, 'fail');
  });

  it('missing receipt → unavailable', () => {
    const r = run(dir, art.path, 'missing-receipt.json');
    assert.equal(r.status, 'unavailable');
    assert.equal(r.checks.find((c) => c.name === 'receipt_located').status, 'unavailable');
  });

  it('artifact hash mismatch → fail', () => {
    const bad = writeReceipt(
      dir,
      'bad-hash.json',
      validReceipt(art.path, { alg: 'sha256', hex: '00'.repeat(32) })
    );
    const r = run(dir, art.path, bad);
    assert.equal(r.status, 'fail');
    const h = r.checks.find((c) => c.name === 'artifact_hash');
    assert.equal(h.status, 'fail');
    assert.equal(h.code, 'ARTIFACT_HASH_MISMATCH');
  });

  it('malformed receipt → fail structure', () => {
    writeFileSync(join(dir, 'malformed.json'), '{not-json', 'utf8');
    const r = run(dir, art.path, 'malformed.json');
    assert.equal(r.status, 'fail');
    assert.equal(r.checks.find((c) => c.name === 'receipt_structure').status, 'fail');
  });

  it('receipt/artifact binding path mismatch → fail', () => {
    const other = writeArtifact(dir, 'other.txt', 'other-content\n');
    const boundWrong = writeReceipt(
      dir,
      'wrong-bind.json',
      validReceipt('other.txt', art.digest) // path other but hash of art
    );
    // hash will fail first because digest is for art but wait - validReceipt uses art.digest with path other
    // So hash of other.txt != art.digest → hash fail
    // For pure binding fail: use other digest with path mismatch to art
    const r2Receipt = writeReceipt(dir, 'bind-only.json', {
      ...validReceipt(other.path, other.digest),
      artifact: {
        path: other.path,
        digest: { alg: other.digest.alg, hex: other.digest.hex },
      },
    });
    // target is art.path but receipt binds to other
    const r = run(dir, art.path, r2Receipt);
    // hash fails because other digest vs art content
    assert.equal(r.status, 'fail');
  });

  it('binding path mismatch with matching hash → fail binding', () => {
    // same content different name - create copy with same content
    const copy = writeArtifact(dir, 'copy.txt', 'hello-qpf-level0\n');
    const rec = writeReceipt(
      dir,
      'path-mismatch.json',
      validReceipt('copy.txt', copy.digest)
    );
    // target artifact.txt has same hash as copy.txt
    const r = run(dir, art.path, rec);
    // hash passes (same content), binding path fails
    assert.equal(r.checks.find((c) => c.name === 'artifact_hash').status, 'pass');
    assert.equal(r.checks.find((c) => c.name === 'receipt_artifact_binding').status, 'fail');
    assert.equal(r.status, 'fail');
  });

  it('invalid/claimed signature without primitive → unavailable', () => {
    const body = validReceipt(art.path, art.digest);
    body.signature = { alg: 'ed25519', value: 'deadbeef' };
    const rec = writeReceipt(dir, 'signed.json', body);
    const r = run(dir, art.path, rec);
    assert.equal(r.checks.find((c) => c.name === 'signature').status, 'unavailable');
    assert.equal(r.status, 'unavailable');
    assert.notEqual(r.status, 'pass');
  });

  it('no signature → not_applicable and can pass', () => {
    const r = run(dir, art.path, receiptName);
    assert.equal(r.checks.find((c) => c.name === 'signature').status, 'not_applicable');
    assert.equal(r.status, 'pass');
  });

  it('deterministic repeated verification (checks stable except timestamp)', () => {
    const r1 = run(dir, art.path, receiptName);
    const r2 = run(dir, art.path, receiptName);
    const strip = (r) => {
      const { timestamp, ...rest } = r;
      return JSON.stringify(rest);
    };
    assert.equal(strip(r1), strip(r2));
    assert.equal(r1.status, r2.status);
    assert.deepEqual(
      r1.checks.map((c) => ({ name: c.name, status: c.status, code: c.code })),
      r2.checks.map((c) => ({ name: c.name, status: c.status, code: c.code }))
    );
  });

  it('PASS cannot occur when a mandatory check is unavailable', () => {
    const r = run(dir, 'missing.bin', receiptName);
    assert.notEqual(r.status, 'pass');
    assert.ok(r.checks.some((c) => c.status === 'unavailable'));
  });

  it('FAIL is not produced merely because optional signature is absent', () => {
    const r = run(dir, art.path, receiptName);
    assert.equal(r.checks.find((c) => c.name === 'signature').status, 'not_applicable');
    assert.equal(r.status, 'pass');
  });

  it('level > 0 yields unavailable or partial, not silent upgrade', () => {
    const r = run(dir, art.path, receiptName, 1);
    // Level 0 mandatories pass but level capability unavailable
    assert.ok(['unavailable', 'partial', 'fail'].includes(r.status));
    assert.notEqual(r.level_achieved, 1);
    const lc = r.checks.find((c) => c.name === 'level_capability');
    assert.equal(lc.status, 'unavailable');
  });

  it('result shape minimum fields', () => {
    const r = run(dir, art.path, receiptName);
    for (const k of [
      'spec',
      'target',
      'level_requested',
      'level_achieved',
      'status',
      'summary',
      'checks',
      'timestamp',
      'verifier',
    ]) {
      assert.ok(k in r, `missing ${k}`);
    }
    assert.equal(r.verifier.identity, 'qpf-verify-level0');
  });
});

describe('QPF Level 0 — designation / verification boundary', () => {
  /**
   * These tests enforce the canonical rule:
   *
   *   designation  → verification target (supplied externally)
   *   verification → evidence about target
   *   verification ≠ designation
   *
   * The verifier must never infer canonical identity; it can only test
   * a target supplied to it against the evidence in a receipt.
   */

  /** @type {string} */
  let dir;
  let designatedArtifact;
  let alternateArtifact;
  let matchingReceiptName;
  let mismatchReceiptName;
  let contradictionReceiptName;
  let noDigestReceiptName;

  before(() => {
    dir = mkdtempSync(join(tmpdir(), 'qpf-boundary-'));

    // Designated artifact — the governance-designated identity target
    designatedArtifact = writeArtifact(dir, 'designated.json', JSON.stringify({
      designation: 'qpf.designation.docs.deployment_set.16661.v1',
      address_set: 'B',
    }));

    // An alternate artifact that does NOT match the designated receipt
    alternateArtifact = writeArtifact(dir, 'alternate.json', JSON.stringify({
      address_set: 'A',
      note: 'broadcast CREATE set — not designated',
    }));

    // Receipt that correctly binds to the designated artifact
    matchingReceiptName = writeReceipt(dir, 'receipt-matching.json', {
      spec: 'quantum-pi-forge-receipt/v1',
      receipt_id: 'designated-receipt-1',
      artifact: {
        path: designatedArtifact.path,
        type: 'artifact',
        digest: { alg: designatedArtifact.digest.alg, hex: designatedArtifact.digest.hex },
      },
      produced_at: '2026-08-17T00:00:00.000Z',
      envelope: { readOnly: true },
    });

    // Receipt that binds to a DIFFERENT (alternate) artifact hash — simulates contradictory historical evidence
    mismatchReceiptName = writeReceipt(dir, 'receipt-mismatch.json', {
      spec: 'quantum-pi-forge-receipt/v1',
      receipt_id: 'alternate-receipt-1',
      artifact: {
        path: designatedArtifact.path,
        type: 'artifact',
        // Deliberately wrong digest — simulates address set contradiction
        digest: { alg: alternateArtifact.digest.alg, hex: alternateArtifact.digest.hex },
      },
      produced_at: '2026-08-17T00:00:00.000Z',
      envelope: { readOnly: true },
    });

    // Receipt that records a contradiction observation as a field but has no artifact digest
    contradictionReceiptName = writeReceipt(dir, 'receipt-contradiction.json', {
      spec: 'quantum-pi-forge-receipt/v1',
      receipt_id: 'contradiction-receipt-1',
      artifact: {
        path: designatedArtifact.path,
        type: 'artifact',
        // No digest — simulates a receipt that cannot complete hash verification
        contradiction_observation: 'two_address_sets_detected',
      },
      produced_at: '2026-08-17T00:00:00.000Z',
      envelope: { readOnly: true },
    });

    // Receipt with no digest claim at all
    noDigestReceiptName = writeReceipt(dir, 'receipt-no-digest.json', {
      spec: 'quantum-pi-forge-receipt/v1',
      receipt_id: 'no-digest-receipt-1',
      artifact: {
        path: designatedArtifact.path,
        type: 'artifact',
      },
      produced_at: '2026-08-17T00:00:00.000Z',
      envelope: { readOnly: true },
    });
  });

  after(() => {
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
  });

  it('designated artifact supplied as target → pass', () => {
    const r = run(dir, designatedArtifact.path, matchingReceiptName);
    assert.equal(r.status, 'pass');
    const hashCheck = r.checks.find((c) => c.name === 'artifact_hash');
    assert.equal(hashCheck.status, 'pass');
  });

  it('verifier does not authorize canonical_identity_designation', () => {
    const r = run(dir, designatedArtifact.path, matchingReceiptName);
    assert.ok(
      r.does_not_authorize.includes('canonical_identity_designation'),
      'does_not_authorize must include canonical_identity_designation'
    );
  });

  it('verifier declares it does not infer canonical identity from on-chain evidence', () => {
    const r = run(dir, designatedArtifact.path, matchingReceiptName);
    assert.ok(Array.isArray(r.does_not_infer_canonical_identity_from));
    for (const source of [
      'eth_getCode',
      'bytecode_similarity',
      'deployment_provenance',
      'owner_function',
      'address_frequency',
      'documentation_references',
      'existence_of_multiple_live_contracts',
    ]) {
      assert.ok(
        r.does_not_infer_canonical_identity_from.includes(source),
        `does_not_infer_canonical_identity_from must include ${source}`
      );
    }
  });

  it('contradictory receipt (hash mismatch) → fail, not silently discarded', () => {
    // The designated artifact is supplied but the receipt records a different hash.
    // This represents contradictory historical evidence (dual address sets).
    // The verifier must report fail — it must not silently pass.
    const r = run(dir, designatedArtifact.path, mismatchReceiptName);
    assert.equal(r.status, 'fail');
    const hashCheck = r.checks.find((c) => c.name === 'artifact_hash');
    assert.equal(hashCheck.status, 'fail');
    assert.match(hashCheck.detail, /mismatch/i);
  });

  it('contradictory evidence does not change the designated target — target field is unchanged', () => {
    // Even when verification fails due to contradiction, the target identity
    // in the result must reflect what was supplied — it must not be replaced.
    const r = run(dir, designatedArtifact.path, mismatchReceiptName);
    assert.equal(r.target.path, designatedArtifact.path);
  });

  it('unresolvable receipt (no digest) → unavailable, not a pass or designation change', () => {
    const r = run(dir, designatedArtifact.path, noDigestReceiptName);
    assert.notEqual(r.status, 'pass');
    // unavailable is the correct status when evidence cannot be tested
    assert.ok(r.status === 'unavailable' || r.status === 'partial');
    // Target is still the supplied designated path
    assert.equal(r.target.path, designatedArtifact.path);
  });

  it('verifier does not authorize minting, liquidity, payments, or wallet actions', () => {
    const r = run(dir, designatedArtifact.path, matchingReceiptName);
    for (const authority of ['minting', 'liquidity', 'payments', 'wallet_actions']) {
      assert.ok(
        r.does_not_authorize.includes(authority),
        `does_not_authorize must include ${authority}`
      );
    }
  });

  it('verifier does not authorize governance_alteration or deployment', () => {
    const r = run(dir, designatedArtifact.path, matchingReceiptName);
    for (const authority of ['governance_alteration', 'deployment']) {
      assert.ok(
        r.does_not_authorize.includes(authority),
        `does_not_authorize must include ${authority}`
      );
    }
  });
});
