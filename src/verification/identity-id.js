/**
 * QPF verifiable AI identity — deterministic content-addressed identifier (Step B).
 *
 * identity_id = "qpfid0:" + sha256(canonicalize(stable_identity_body))
 *
 * The identity_id field itself and wall-clock-only created_at are excluded from
 * the hashed projection. All other identity fields are retained. Canonicalization
 * is the existing QPF JCS-style canonicalize() implementation.
 */

import { canonicalizeToBytes } from './canonical.js';
import { digestSha256 } from './hash.js';

export const IDENTITY_ID_PREFIX = 'qpfid0';

export function stableIdentityProjection(identity) {
  if (identity === null || typeof identity !== 'object' || Array.isArray(identity)) {
    throw new TypeError('identity must be a plain object');
  }
  const stable = { ...identity };
  delete stable.identity_id;
  delete stable.created_at;
  return stable;
}

export function deriveIdentityId(identity) {
  const stable = stableIdentityProjection(identity);
  const { hex } = digestSha256(canonicalizeToBytes(stable));
  return `${IDENTITY_ID_PREFIX}:${hex}`;
}
