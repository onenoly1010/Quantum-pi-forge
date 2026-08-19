/**
 * QPF verification — deterministic result identifier (Gap B).
 *
 * result_id = "qpfv0:" + sha256(canonicalize(stable_result_fields))
 *
 * The stable subset excludes `timestamp` (wall-clock, non-deterministic),
 * `summary` (human-readable narrative derived from status), and
 * `does_not_authorize` (static policy declaration independent of inputs).
 *
 * Including `evidence_binding` ensures the identifier changes whenever the
 * artifact digest or receipt digest changes — binding identity to inputs.
 */

import { canonicalizeToBytes } from './canonical.js';
import { digestSha256 } from './hash.js';

export const RESULT_ID_PREFIX = 'qpfv0';

/**
 * Derive a content-addressed identifier from a verification result.
 *
 * The identifier is stable across repeated verifications of the same
 * artifact + receipt with the same outcome, and changes when any
 * substantive aspect of the result changes.
 *
 * @param {object} result — a VerificationResult as returned by verifyLevel0
 * @returns {string} — e.g. "qpfv0:a3f8..."
 */
export function deriveResultId(result) {
  /** @type {object} */
  const stable = {
    spec: result.spec,
    target: result.target,
    level_requested: result.level_requested,
    level_achieved: result.level_achieved,
    status: result.status,
    checks: result.checks,
    verifier: result.verifier,
    // evidence_binding ties identity to the specific artifact and receipt
    // verified; if present on result, include it.
    ...(result.evidence_binding != null
      ? { evidence_binding: result.evidence_binding }
      : {}),
  };
  const bytes = canonicalizeToBytes(stable);
  const { hex } = digestSha256(bytes);
  return `${RESULT_ID_PREFIX}:${hex}`;
}
