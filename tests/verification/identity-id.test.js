/** Step B tests for deterministic qpfid0 identity derivation. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deriveIdentityId, IDENTITY_ID_PREFIX, stableIdentityProjection } from '../../src/verification/identity-id.js';

function makeIdentity(overrides = {}) {
  return {
    spec: 'qpf.identity.verifiable-ai.v1',
    protocol_version: 1,
    name: 'Example Identity',
    purpose: 'Deterministic test identity',
    identity_scope: 'knowledge_body',
    authority: { does_not: ['human_equivalence', 'economic_activation'] },
    epistemic: { identity_record: 'DECLARED', human_authorship: 'UNKNOWN', claims: [] },
    lineage: { genesis_digest: null, parent_digest: null, ancestors: [], derivatives: [] },
    canonical_artifact: { digest: { alg: 'sha256', hex: 'a'.repeat(64) } },
    ...overrides,
  };
}

describe('deriveIdentityId', () => {
  it('uses qpfid0 and a 64-character lowercase SHA-256 hex suffix', () => {
    const id = deriveIdentityId(makeIdentity());
    assert.match(id, /^qpfid0:[0-9a-f]{64}$/);
    assert.equal(IDENTITY_ID_PREFIX, 'qpfid0');
  });

  it('is deterministic across repeated derivations', () => {
    const identity = makeIdentity();
    assert.equal(deriveIdentityId(identity), deriveIdentityId(identity));
  });

  it('excludes identity_id and created_at from the stable projection', () => {
    const base = makeIdentity();
    const withVolatile = { ...base, identity_id: 'qpfid0:' + 'f'.repeat(64), created_at: '2099-12-31T23:59:59.999Z' };
    assert.deepEqual(stableIdentityProjection(withVolatile), base);
    assert.equal(deriveIdentityId(base), deriveIdentityId(withVolatile));
  });

  it('is insensitive to object insertion order because existing canonicalization sorts keys', () => {
    const a = makeIdentity();
    const b = {
      canonical_artifact: a.canonical_artifact,
      lineage: a.lineage,
      epistemic: a.epistemic,
      authority: a.authority,
      identity_scope: a.identity_scope,
      purpose: a.purpose,
      name: a.name,
      protocol_version: a.protocol_version,
      spec: a.spec,
    };
    assert.equal(deriveIdentityId(a), deriveIdentityId(b));
  });

  it('changes when a substantive identity field changes', () => {
    assert.notEqual(deriveIdentityId(makeIdentity()), deriveIdentityId(makeIdentity({ purpose: 'Different purpose' })));
  });

  it('golden vector is pinned independently of deriveIdentityId', () => {
    const fixture = {
      spec: 'qpf.identity.verifiable-ai.v1',
      protocol_version: 1,
      name: 'Golden Identity',
      purpose: 'Pinned Step B vector',
      identity_scope: 'knowledge_body',
      authority: { does_not: ['human_equivalence'] },
      epistemic: { identity_record: 'DECLARED', human_authorship: 'UNKNOWN', claims: [] },
      lineage: { genesis_digest: null, parent_digest: null, ancestors: [], derivatives: [] },
      canonical_artifact: { digest: { alg: 'sha256', hex: '1'.repeat(64) } },
    };
    const EXPECTED_GOLDEN_ID = 'qpfid0:95b5b4a455029d06084feaa941baf834371c4759bb108473f62d683b1bfda5b2';
    assert.equal(deriveIdentityId(fixture), EXPECTED_GOLDEN_ID);
  });
});
