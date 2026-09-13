/**
 * Deterministic identity-ID derivation for qpf.identity.verifiable-ai.v1.
 *
 * identity_id = "qpfid0:" + sha256(canonicalize(stable_body))
 *
 * Stable body = the identity object minus:
 *   - identity_id  (derived; must not feed itself)
 *   - created_at   (the only wall-clock field in the Step A schema)
 *
 * Uses existing QPF machinery:
 *   canonicalizeToBytes  (jcs-rfc8785)
 *   digestSha256
 *
 * Does not modify Level 0, does not create Genesis, does not verify identities.
 */

import { canonicalizeToBytes } from './canonical.js';
import { digestSha256 } from './hash.js';

export const IDENTITY_ID_PREFIX = 'qpfid0';
export const IDENTITY_ID_PATTERN = /^qpfid0:[0-9a-f]{64}$/;

/** Fields excluded from the content-addressed identity body. */
export const IDENTITY_ID_EXCLUDED_FIELDS = Object.freeze(['identity_id', 'created_at']);

/**
 * JSON-safe deep clone. Drops non-JSON values the same way a stored artifact would.
 * @param {unknown} value
 */
function jsonClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Project the stable identity body used for identity_id.
 * @param {object} identity
 * @returns {object}
 */
export function projectStableIdentityBody(identity) {
  if (identity === null || typeof identity !== 'object' || Array.isArray(identity)) {
    throw new TypeError('projectStableIdentityBody: identity must be a plain object');
  }
  const body = jsonClone(identity);
  for (const field of IDENTITY_ID_EXCLUDED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      delete body[field];
    }
  }
  return body;
}

/**
 * Derive a content-addressed identity_id.
 * @param {object} identity
 * @returns {string} qpfid0:<64 lowercase hex>
 */
export function deriveIdentityId(identity) {
  const stable = projectStableIdentityBody(identity);
  const bytes = canonicalizeToBytes(stable);
  const { hex } = digestSha256(bytes);
  const id = `${IDENTITY_ID_PREFIX}:${hex}`;
  if (!IDENTITY_ID_PATTERN.test(id)) {
    throw new Error(`deriveIdentityId: produced malformed id: ${id}`);
  }
  return id;
}
