/**
 * Step B — deterministic identity_id derivation golden vectors.
 * Not OINIO Genesis. Does not exercise Level 0.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalize } from '../../src/verification/canonical.js';
import { digestSha256 } from '../../src/verification/hash.js';
import {
  deriveIdentityId,
  projectStableIdentityBody,
  IDENTITY_ID_PREFIX,
  IDENTITY_ID_PATTERN,
} from '../../src/verification/identity-id.js';

/** Pinned fixture. created_at and identity_id must not affect derivation. */
const GOLDEN = Object.freeze({
  spec: 'qpf.identity.verifiable-ai.v1',
  protocol_version: 1,
  identity_id: `qpfid0:${'0'.repeat(64)}`,
  name: 'Example Identity',
  purpose: 'Step B golden vector only. Not OINIO Genesis.',
  identity_scope: 'knowledge_body',
  authority: Object.freeze({
    does_not: Object.freeze([
      'legal_personhood',
      'human_equivalence',
      'qpf_chain_designation',
      'economic_activation',
      'self_grant_permissions',
    ]),
  }),
  epistemic: Object.freeze({
    identity_record: 'DECLARED',
    human_authorship: 'UNKNOWN',
    claims: Object.freeze([]),
  }),
  lineage: Object.freeze({
    genesis_digest: null,
    parent_digest: null,
    ancestors: Object.freeze([]),
    derivatives: Object.freeze([]),
  }),
  canonical_artifact: Object.freeze({
    digest: Object.freeze({
      alg: 'sha256',
      hex: '11'.repeat(32),
    }),
  }),
  created_at: '2026-08-19T00:00:00.000Z',
});

const GOLDEN_ID = 'qpfid0:8b4db22723d5630d4becd658a2bee445441fbd9cbceb1f0ee50c96fc5da4047c';

const GOLDEN_CANONICAL =
  '{"authority":{"does_not":["legal_personhood","human_equivalence","qpf_chain_designation","economic_activation","self_grant_permissions"]},"canonical_artifact":{"digest":{"alg":"sha256","hex":"1111111111111111111111111111111111111111111111111111111111111111"}},"epistemic":{"claims":[],"human_authorship":"UNKNOWN","identity_record":"DECLARED"},"identity_scope":"knowledge_body","lineage":{"ancestors":[],"derivatives":[],"genesis_digest":null,"parent_digest":null},"name":"Example Identity","protocol_version":1,"purpose":"Step B golden vector only. Not OINIO Genesis.","spec":"qpf.identity.verifiable-ai.v1"}';

describe('deriveIdentityId', () => {
  it('matches the pinned golden vector', () => {
    assert.equal(deriveIdentityId(GOLDEN), GOLDEN_ID);
  });

  it('projects a stable body whose JCS form matches the pinned canonical string', () => {
    const stable = projectStableIdentityBody(GOLDEN);
    assert.equal(canonicalize(stable), GOLDEN_CANONICAL);
    const { hex } = digestSha256(canonicalize(stable));
    assert.equal(`${IDENTITY_ID_PREFIX}:${hex}`, GOLDEN_ID);
  });

  it('produces qpfid0: + 64 lowercase hex', () => {
    assert.match(deriveIdentityId(GOLDEN), IDENTITY_ID_PATTERN);
  });

  it('is independent of object key insertion order', () => {
    const reordered = {
      created_at: GOLDEN.created_at,
      lineage: GOLDEN.lineage,
      name: GOLDEN.name,
      spec: GOLDEN.spec,
      identity_id: GOLDEN.identity_id,
      canonical_artifact: GOLDEN.canonical_artifact,
      purpose: GOLDEN.purpose,
      authority: GOLDEN.authority,
      protocol_version: GOLDEN.protocol_version,
      identity_scope: GOLDEN.identity_scope,
      epistemic: GOLDEN.epistemic,
    };
    assert.equal(deriveIdentityId(reordered), GOLDEN_ID);
  });

  it('ignores identity_id and created_at', () => {
    const mutated = {
      ...GOLDEN,
      identity_id: `qpfid0:${'a'.repeat(64)}`,
      created_at: '1999-01-01T00:00:00.000Z',
    };
    assert.equal(deriveIdentityId(mutated), GOLDEN_ID);
  });

  it('changes when a substantive field changes', () => {
    const mutated = { ...GOLDEN, name: 'Different Name' };
    const id = deriveIdentityId(mutated);
    assert.match(id, IDENTITY_ID_PATTERN);
    assert.notEqual(id, GOLDEN_ID);
  });

  it('is deterministic across repeated calls', () => {
    assert.equal(deriveIdentityId(GOLDEN), deriveIdentityId({ ...GOLDEN }));
  });

  it('rejects a non-object', () => {
    assert.throws(() => deriveIdentityId(null), /plain object/);
    assert.throws(() => deriveIdentityId([]), /plain object/);
  });
});
