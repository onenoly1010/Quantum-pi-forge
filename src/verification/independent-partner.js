/**
 * Independent AI Verification Partner — capability-benchmark demo.
 *
 * Primary path: existing QPF Level 0 verifier (does not own the artifact).
 * Independent path: re-reads the artifact bytes, recomputes SHA-256, and
 * checks the originating receipt claim without consuming the primary result.
 *
 * This module never writes to the artifact path or the receipt path.
 * OS-level immutability is not enforced; that limitation is documented.
 *
 * prepared != verified != approved != executed
 * verification != authorization
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { digestSha256, digestSha256File, digestsEqual, HASH_ALG_SHA256 } from './hash.js';
import {
  verifyLevel0,
  VERIFY_REQUEST_SPEC,
  VERIFY_RESULT_SPEC,
  extractArtifactDigest,
} from './verify-level0.js';

export const INDEPENDENT_VERIFIER_IDENTITY = 'qpf-independent-ai-verifier';
export const INDEPENDENT_VERIFIER_VERSION = '0.1.0';
export const INDEPENDENT_RESULT_SPEC = 'qpf.verification.independent-result.v1';
export const PARTNER_EVIDENCE_SPEC = 'qpf.verification.independent_partner.evidence.v1';
export const MATCH = 'MATCH';
export const REVIEW_REQUIRED = 'REVIEW_REQUIRED';

export const DOES_NOT = Object.freeze([
  'modify_artifact',
  'modify_primary_result',
  'approve_own_result',
  'merge_code',
  'deploy_production',
  'change_organization_governance',
  'grant_permissions',
  'alter_evidence_after_verification',
  'minting',
  'liquidity',
  'wallet_actions',
]);

function check(name, status, detail, code) {
  return { name, status, detail, code };
}

/**
 * Deterministic artifact identity from file bytes. Read-only.
 * @param {string} filePath
 * @returns {{ alg: string, hex: string, bytes: number }}
 */
export function identifyArtifact(filePath) {
  const abs = resolve(filePath);
  if (!existsSync(abs)) {
    throw new Error(`artifact not found: ${filePath}`);
  }
  const buf = readFileSync(abs);
  const digest = digestSha256(buf);
  return { alg: digest.alg, hex: digest.hex, bytes: buf.length };
}

/**
 * Independent verification. Does not call verifyLevel0. Does not write.
 * @param {{ cwd?: string, artifact: string, receipt: string, now?: string }} input
 */
export function verifyIndependent(input) {
  const cwd = input.cwd ? resolve(input.cwd) : process.cwd();
  const artifactAbs = resolve(cwd, input.artifact);
  const receiptAbs = resolve(cwd, input.receipt);
  const timestamp = input.now || new Date().toISOString();
  const checks = [];

  let identity = null;
  if (!existsSync(artifactAbs)) {
    checks.push(check('artifact_located', 'unavailable', 'artifact missing', 'ARTIFACT_MISSING'));
  } else {
    identity = identifyArtifact(artifactAbs);
    checks.push(check('artifact_located', 'pass', `bytes=${identity.bytes}`, 'OK'));
    checks.push(
      check(
        'artifact_identity',
        'pass',
        `${identity.alg}:${identity.hex}`,
        'OK',
      ),
    );
  }

  let claimed = null;
  if (!existsSync(receiptAbs)) {
    checks.push(check('receipt_located', 'unavailable', 'receipt missing', 'RECEIPT_MISSING'));
  } else {
    checks.push(check('receipt_located', 'pass', basename(receiptAbs), 'OK'));
    let receiptObj = null;
    try {
      receiptObj = JSON.parse(readFileSync(receiptAbs, 'utf8'));
    } catch (e) {
      checks.push(
        check('receipt_structure', 'fail', String(e?.message || e), 'RECEIPT_MALFORMED'),
      );
    }
    if (receiptObj && typeof receiptObj === 'object' && !Array.isArray(receiptObj)) {
      checks.push(check('receipt_structure', 'pass', receiptObj.spec || 'object', 'OK'));
      claimed = extractArtifactDigest(receiptObj);
      if (!claimed) {
        checks.push(
          check('artifact_hash', 'unavailable', 'receipt has no artifact digest', 'STRUCTURE_INVALID'),
        );
      }
    } else if (receiptObj != null) {
      checks.push(check('receipt_structure', 'fail', 'receipt root must be object', 'RECEIPT_MALFORMED'));
    }
  }

  if (identity && claimed) {
    if (digestsEqual(identity, claimed)) {
      checks.push(
        check(
          'artifact_hash',
          'pass',
          `independent digest matches receipt (${identity.alg}:${identity.hex.slice(0, 12)}…)`,
          'OK',
        ),
      );
    } else {
      checks.push(
        check(
          'artifact_hash',
          'fail',
          `digest mismatch: independent ${identity.alg}:${identity.hex} != receipt ${claimed.alg}:${claimed.hex}`,
          'ARTIFACT_HASH_MISMATCH',
        ),
      );
    }
  }

  const anyFail = checks.some((c) => c.status === 'fail');
  const anyUnavailable = checks.some((c) => c.status === 'unavailable');
  let status = 'pass';
  if (anyFail) status = 'fail';
  else if (anyUnavailable) status = 'unavailable';

  return {
    spec: INDEPENDENT_RESULT_SPEC,
    status,
    summary:
      status === 'pass'
        ? 'Independent digest matches originating receipt'
        : status === 'fail'
          ? 'Independent digest disagrees with originating receipt'
          : 'Independent verification incomplete',
    target: {
      type: 'artifact',
      path: input.artifact,
      hash: identity ? { alg: identity.alg, hex: identity.hex } : null,
    },
    checks,
    timestamp,
    verifier: {
      identity: INDEPENDENT_VERIFIER_IDENTITY,
      version: INDEPENDENT_VERIFIER_VERSION,
    },
    does_not: [...DOES_NOT],
    writes_artifact: false,
    writes_receipt: false,
    copies_primary_result: false,
  };
}

/**
 * Primary verification via existing Level 0 engine.
 * Never writes the artifact.
 */
export function verifyPrimary({ cwd, artifact, receipt }) {
  return verifyLevel0({
    spec: VERIFY_REQUEST_SPEC,
    level_requested: 0,
    target: { type: 'artifact', path: artifact },
    receipt: { path: receipt },
    cwd: cwd || process.cwd(),
  });
}

function primaryDigest(primary) {
  const h = primary?.target?.hash;
  if (typeof h === 'string' && h.length >= 32) {
    return { alg: HASH_ALG_SHA256, hex: h };
  }
  if (h && typeof h === 'object' && h.hex) {
    return { alg: h.alg || HASH_ALG_SHA256, hex: String(h.hex) };
  }
  const binding = primary?.evidence_binding?.artifact_digest;
  if (binding?.hex) return { alg: binding.alg || HASH_ALG_SHA256, hex: String(binding.hex) };
  return null;
}

function independentDigest(independent) {
  const h = independent?.target?.hash;
  if (h && typeof h === 'object' && h.hex) {
    return { alg: h.alg || HASH_ALG_SHA256, hex: String(h.hex) };
  }
  return null;
}

/**
 * Compare primary vs independent. Disagreement is REVIEW_REQUIRED.
 * Neither result is selected as "correct".
 */
export function compareResults(primary, independent) {
  const reasons = [];
  const pd = primaryDigest(primary);
  const id = independentDigest(independent);

  if (!pd || !id) {
    reasons.push('missing_digest_on_one_or_both_results');
  } else if (!digestsEqual(pd, id)) {
    reasons.push('artifact_digest_mismatch');
  }

  const ps = primary?.status;
  const is_ = independent?.status;
  if (ps !== is_) {
    reasons.push(`status_mismatch:${ps}!=${is_}`);
  }

  const agreement = reasons.length === 0 ? MATCH : REVIEW_REQUIRED;
  return {
    agreement,
    reasons,
    primary_status: ps ?? null,
    independent_status: is_ ?? null,
    primary_digest: pd,
    independent_digest: id,
    selected_winner: null,
    note:
      agreement === MATCH
        ? 'Both verifiers report equivalent identity and status. Neither is an authorizer.'
        : 'Material disagreement. Human review required. Neither verifier is auto-selected.',
  };
}

/**
 * Run primary + independent + comparison. Read-only vs artifact/receipt.
 */
export function runPartner({ cwd, artifact, receipt, primaryOverride = null, now = null } = {}) {
  const primary = primaryOverride || verifyPrimary({ cwd, artifact, receipt });
  const independent = verifyIndependent({ cwd, artifact, receipt, now: now || undefined });
  const comparison = compareResults(primary, independent);
  const artifactPath = resolve(cwd || process.cwd(), artifact);
  const identity = existsSync(artifactPath)
    ? identifyArtifact(artifactPath)
    : null;

  return {
    spec: PARTNER_EVIDENCE_SPEC,
    read_only: true,
    artifact: {
      path: artifact,
      identity,
    },
    primary,
    independent,
    comparison,
    authority: {
      modifies_artifact: false,
      modifies_primary: Boolean(primaryOverride),
      primary_override_used: Boolean(primaryOverride),
      merges: false,
      deploys: false,
      does_not: [...DOES_NOT],
      enforcement:
        'Code paths do not write artifact or receipt files. OS immutability, merge, and deploy are NOT technically enforced by this module.',
    },
    nondeterministic: [
      'primary.timestamp',
      'independent.timestamp (unless now is pinned)',
    ],
  };
}

/**
 * Convenience: re-hash after an external mutation to prove detection.
 */
export function digestFile(filePath) {
  return digestSha256File(filePath);
}

export { VERIFY_RESULT_SPEC, HASH_ALG_SHA256 };
