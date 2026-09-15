/**
 * QPF verification package exports (Level 0 milestone).
 */

export {
  CANONICAL_ENCODING_ID,
  canonicalize,
  canonicalizeToBytes,
  canonicalEncodingInfo,
} from './canonical.js';

export { digestSha256, digestSha256File, digestsEqual, HASH_ALG_SHA256 } from './hash.js';

export { REASON, aggregateLevel0 } from './semantics.js';

export {
  verifyLevel0,
  VERIFY_REQUEST_SPEC,
  VERIFY_RESULT_SPEC,
  VERIFIER_IDENTITY,
  VERIFIER_VERSION,
  extractArtifactDigest,
  extractBoundArtifactPath,
} from './verify-level0.js';

export { deriveResultId, RESULT_ID_PREFIX } from './result-id.js';

export { writeResult, DEFAULT_SINK_DIR } from './result-store.js';

export { buildPackageManifest, PACKAGE_SCHEMA, PACKAGE_ID_PREFIX } from './package.js';

export {
  identifyArtifact,
  verifyIndependent,
  verifyPrimary,
  compareResults,
  runPartner,
  MATCH,
  REVIEW_REQUIRED,
  INDEPENDENT_VERIFIER_IDENTITY,
  INDEPENDENT_VERIFIER_VERSION,
  INDEPENDENT_RESULT_SPEC,
  PARTNER_EVIDENCE_SPEC,
} from './independent-partner.js';

export {
  deriveIdentityId,
  projectStableIdentityBody,
  IDENTITY_ID_PREFIX,
  IDENTITY_ID_PATTERN,
  IDENTITY_ID_EXCLUDED_FIELDS,
} from './identity-id.js';

export {
  bindIdentityArtifact,
  IDENTITY_SPEC,
  IDENTITY_BIND_SPEC,
} from './identity-bind.js';
