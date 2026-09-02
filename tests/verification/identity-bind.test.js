/**
 * Step C — identity artifact bound to existing Level 0 / package machinery.
 * Not Genesis. Not a second verifier.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { digestSha256File } from '../../src/verification/hash.js';
import { deriveIdentityId } from '../../src/verification/identity-id.js';
import { bindIdentityArtifact, IDENTITY_SPEC } from '../../src/verification/identity-bind.js';

function baseIdentity() {
  return {
    spec: IDENTITY_SPEC,
    protocol_version: 1,
    name: 'Step C Test Identity',
    purpose: 'Bind identity artifact to Level 0. Not OINIO Genesis.',
    identity_scope: 'knowledge_body',
    authority: {
      does_not: [
        'legal_personhood',
        'human_equivalence',
        'qpf_chain_designation',
        'economic_activation',
        'self_grant_permissions',
      ],
    },
    epistemic: { identity_record: 'DECLARED', human_authorship: 'UNKNOWN', claims: [] },
    lineage: { genesis_digest: null, parent_digest: null, ancestors: [], derivatives: [] },
    canonical_artifact: { digest: { alg: 'sha256', hex: 'ab'.repeat(32) } },
  };
}

function writeIdentityPair(dir, identity, { corruptReceipt = false, corruptId = false } = {}) {
  mkdirSync(dir, { recursive: true });
  const derived = deriveIdentityId(identity);
  const withId = {
    ...identity,
    identity_id: corruptId ? `qpfid0:${'0'.repeat(64)}` : derived,
  };
  const artifactName = 'identity.json';
  const artifactPath = join(dir, artifactName);
  writeFileSync(artifactPath, `${JSON.stringify(withId, null, 2)}\n`);
  const fileDigest = digestSha256File(artifactPath);
  const claimed = corruptReceipt ? { alg: 'sha256', hex: '00'.repeat(32) } : fileDigest;
  const receiptName = 'receipt.json';
  writeFileSync(
    join(dir, receiptName),
    `${JSON.stringify(
      {
        spec: 'quantum-pi-forge-receipt/v1',
        receipt_id: 'step-c-test-receipt',
        artifact: { path: artifactName, type: 'artifact', digest: claimed },
        produced_at: '2026-08-19T00:00:00.000Z',
        envelope: { readOnly: true },
      },
      null,
      2,
    )}\n`,
  );
  return { artifactName, receiptName, withId, fileDigest, derived };
}

describe('bindIdentityArtifact', () => {
  let root;

  before(() => {
    root = mkdtempSync(join(tmpdir(), 'qpf-idbind-'));
  });

  after(() => {
    try {
      rmSync(root, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it('valid identity + matching receipt → pass, evidence_binding, qpfpkg0', () => {
    const dir = join(root, 'ok');
    const pair = writeIdentityPair(dir, baseIdentity());
    const bound = bindIdentityArtifact({
      cwd: dir,
      artifactPath: pair.artifactName,
      receiptPath: pair.receiptName,
      sinkDir: 'sink',
    });
    assert.equal(bound.verification.status, 'pass');
    assert.equal(bound.identity_id_consistent, true);
    assert.equal(bound.identity_id, pair.derived);
    assert.equal(bound.binding_status, 'pass');
    assert.ok(bound.evidence_binding);
    assert.equal(bound.evidence_binding.artifact_digest.hex, pair.fileDigest.hex);
    assert.ok(bound.package);
    assert.match(bound.package.package_id, /^qpfpkg0:[0-9a-f]{64}$/);
    assert.ok(existsSync(bound.paths.result));
    assert.ok(existsSync(bound.paths.package));
    assert.ok(bound.authority.does_not_authorize.includes('deployment'));
    assert.ok(bound.authority.does_not_authorize.includes('genesis_creation'));
  });

  it('does not treat pass as Genesis or economic authorization', () => {
    const dir = join(root, 'noauth');
    const pair = writeIdentityPair(dir, baseIdentity());
    const bound = bindIdentityArtifact({
      cwd: dir,
      artifactPath: pair.artifactName,
      receiptPath: pair.receiptName,
    });
    assert.equal(bound.binding_status, 'pass');
    for (const denied of ['economic_activation', 'wallet_actions', 'genesis_creation', 'merge']) {
      assert.ok(bound.authority.does_not_authorize.includes(denied), denied);
    }
  });

  it('tampered receipt digest → Level 0 fail and binding fail', () => {
    const dir = join(root, 'tamper');
    const pair = writeIdentityPair(dir, baseIdentity(), { corruptReceipt: true });
    const bound = bindIdentityArtifact({
      cwd: dir,
      artifactPath: pair.artifactName,
      receiptPath: pair.receiptName,
    });
    assert.equal(bound.verification.status, 'fail');
    assert.equal(bound.binding_status, 'fail');
    const hashCheck = bound.verification.checks.find((c) => c.name === 'artifact_hash');
    assert.equal(hashCheck.status, 'fail');
  });

  it('declared identity_id mismatch → binding fail even if file digest matches', () => {
    const dir = join(root, 'badid');
    const pair = writeIdentityPair(dir, baseIdentity(), { corruptId: true });
    const bound = bindIdentityArtifact({
      cwd: dir,
      artifactPath: pair.artifactName,
      receiptPath: pair.receiptName,
    });
    assert.equal(bound.verification.status, 'pass');
    assert.equal(bound.identity_id_consistent, false);
    assert.equal(bound.binding_status, 'fail');
    assert.equal(bound.identity_id, pair.derived);
  });

  it('artifact file digest is not the same string as identity_id', () => {
    const dir = join(root, 'distinct');
    const pair = writeIdentityPair(dir, baseIdentity());
    assert.notEqual(pair.fileDigest.hex, pair.derived.replace('qpfid0:', ''));
    const bound = bindIdentityArtifact({
      cwd: dir,
      artifactPath: pair.artifactName,
      receiptPath: pair.receiptName,
    });
    assert.equal(bound.artifact_file_digest.hex, pair.fileDigest.hex);
    assert.equal(bound.identity_id, pair.derived);
  });
});
