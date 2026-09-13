/**
 * QPF verification — evidence package manifest builder (Gap J).
 *
 * An evidence package binds three primary objects:
 *   artifact + receipt + verification result
 *
 * into a single content-addressed manifest.  No ZIP/TAR — the manifest
 * is canonical JSON; a physical archive can be reconstructed without
 * changing the logical package identity.
 *
 * package_id = "qpfpkg0:" + sha256(canonicalize({
 *   result_id,
 *   artifact_digest,
 *   receipt_digest,
 *   verification_result_digest,
 * }))
 *
 * This is the outer boundary a customer receives and can independently
 * inspect: given the three files, they can re-derive all digests and
 * confirm package_id matches.
 */

import { existsSync } from 'node:fs';
import { relative } from 'node:path';
import { canonicalizeToBytes } from './canonical.js';
import { digestSha256, digestSha256File } from './hash.js';

export const PACKAGE_SCHEMA = 'qpf-evidence-package/v1';
export const PACKAGE_ID_PREFIX = 'qpfpkg0';

/** Authority boundary declaration — identical to all QPF read-only receipts. */
const AUTHORITY_BOUNDARY = Object.freeze({
  readOnly: true,
  noWalletSigning: true,
  noDeployment: true,
  noGovernanceExecution: true,
  noChainMutation: true,
  noTokenMinting: true,
  noPosting: true,
});

/**
 * Build an evidence package manifest.
 *
 * All three component files must exist on disk at call time so their
 * digests can be computed. Missing-input validation is performed before
 * any hashing so an absent component produces a deterministic validation
 * error rather than entering the hashing path.
 *
 * Paths are emitted relative to `baseDir` when supplied, preventing
 * producer-local absolute filesystem paths from becoming part of the
 * portable manifest. Hashing always uses the original paths, so content
 * identity is unaffected by display-path normalization.
 *
 * @param {{
 *   artifactPath: string,
 *   receiptPath: string,
 *   resultPath: string,
 *   result: object,
 *   baseDir?: string,
 * }} params
 * @returns {object} — package manifest (not written to disk here)
 */
export function buildPackageManifest({ artifactPath, receiptPath, resultPath, result, baseDir }) {
  if (!result || !result.result_id) {
    throw new Error('buildPackageManifest: result must include result_id');
  }

  const missing = [
    ['artifact', artifactPath],
    ['receipt', receiptPath],
    ['result file', resultPath],
  ].filter(([, path]) => !path || !existsSync(path));

  if (missing.length) {
    throw new Error(
      `buildPackageManifest: ${missing.map(([name]) => `${name} not found`).join('; ')}`
    );
  }

  const artifactDigest = digestSha256File(artifactPath);
  const receiptDigest = digestSha256File(receiptPath);
  const resultDigest = digestSha256File(resultPath);

  // package_id is derived from the canonical manifest of component identities —
  // not from ZIP/TAR byte ordering, so physical archives can be reconstructed
  // without changing logical package identity.
  const idInput = {
    result_id: result.result_id,
    artifact_digest: artifactDigest,
    receipt_digest: receiptDigest,
    verification_result_digest: resultDigest,
  };
  const { hex } = digestSha256(canonicalizeToBytes(idInput));
  const package_id = `${PACKAGE_ID_PREFIX}:${hex}`;

  const displayPath = (path) => (baseDir ? relative(baseDir, path) || '.' : path);

  return {
    schema: PACKAGE_SCHEMA,
    package_id,
    created_at: new Date().toISOString(),
    result_id: result.result_id,
    components: {
      artifact: {
        path: displayPath(artifactPath),
        digest: artifactDigest,
      },
      receipt: {
        path: displayPath(receiptPath),
        digest: receiptDigest,
      },
      verification_result: {
        path: displayPath(resultPath),
        digest: resultDigest,
      },
    },
    authority_boundary: { ...AUTHORITY_BOUNDARY },
  };
}
