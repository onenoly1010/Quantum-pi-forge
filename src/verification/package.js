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
 * digests can be computed.
 *
 * @param {{
 *   artifactPath: string,
 *   receiptPath: string,
 *   resultPath: string,
 *   result: object,
 * }} params
 * @returns {object} — package manifest (not written to disk here)
 */
export function buildPackageManifest({ artifactPath, receiptPath, resultPath, result }) {
  if (!result.result_id) {
    throw new Error('buildPackageManifest: result must include result_id');
  }

  const artifactDigest = digestSha256File(artifactPath);
  const receiptDigest = digestSha256File(receiptPath);
  const resultDigest = digestSha256File(resultPath);

  if (!artifactDigest) throw new Error(`buildPackageManifest: artifact not found: ${artifactPath}`);
  if (!receiptDigest) throw new Error(`buildPackageManifest: receipt not found: ${receiptPath}`);
  if (!resultDigest) throw new Error(`buildPackageManifest: result file not found: ${resultPath}`);

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

  return {
    schema: PACKAGE_SCHEMA,
    package_id,
    created_at: new Date().toISOString(),
    result_id: result.result_id,
    components: {
      artifact: {
        path: artifactPath,
        digest: artifactDigest,
      },
      receipt: {
        path: receiptPath,
        digest: receiptDigest,
      },
      verification_result: {
        path: resultPath,
        digest: resultDigest,
      },
    },
    authority_boundary: { ...AUTHORITY_BOUNDARY },
  };
}
