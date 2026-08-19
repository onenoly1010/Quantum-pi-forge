/**
 * quantum-pi-forge-verify/v1 — Level 0 only.
 *
 * AUTHORIZATION ≠ VERIFICATION
 * VERIFICATION ≠ GOVERNANCE DECISION
 *
 * Does not implement trust-root, trust-policy, attestation (L1),
 * evidence retrieval (L2), or reproduction (L3).
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { digestSha256, digestSha256File, digestsEqual, HASH_ALG_SHA256 } from './hash.js';
import { aggregateLevel0, REASON } from './semantics.js';
import { deriveResultId } from './result-id.js';

export const VERIFY_REQUEST_SPEC = 'quantum-pi-forge-verify/v1';
export const VERIFY_RESULT_SPEC = 'quantum-pi-forge-verify-result/v1';
export const VERIFIER_IDENTITY = 'qpf-verify-level0';
export const VERIFIER_VERSION = '0.1.0';

/** Required structural fields on a Level 0 execution receipt */
const REQUIRED_RECEIPT_FIELDS = ['spec', 'receipt_id', 'artifact'];

/**
 * @typedef {object} VerifyRequest
 * @property {string} [spec]
 * @property {number} [level_requested]
 * @property {{ type?: string, path?: string, hash?: { alg: string, hex: string } }} [target]
 * @property {{ path?: string }} [receipt]
 * @property {string} [cwd]
 */

/**
 * @param {string} name
 * @param {'pass'|'fail'|'unavailable'|'not_applicable'} status
 * @param {string} detail
 * @param {string} [code]
 */
function check(name, status, detail, code) {
  /** @type {{ name: string, status: string, detail: string, code?: string }} */
  const c = { name, status, detail };
  if (code) c.code = code;
  return c;
}

/**
 * Parse receipt JSON; returns { ok, value, error }.
 * @param {string} text
 */
function parseReceipt(text) {
  try {
    const value = JSON.parse(text);
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return { ok: false, error: 'receipt root must be a JSON object' };
    }
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

/**
 * Extract artifact digest from receipt (several accepted shapes for interop).
 * @param {object} receipt
 * @returns {{ alg: string, hex: string }|null}
 */
export function extractArtifactDigest(receipt) {
  if (receipt.artifact?.digest?.hex) {
    return {
      alg: receipt.artifact.digest.alg || HASH_ALG_SHA256,
      hex: String(receipt.artifact.digest.hex),
    };
  }
  if (receipt.artifact_digest?.hex) {
    return {
      alg: receipt.artifact_digest.alg || HASH_ALG_SHA256,
      hex: String(receipt.artifact_digest.hex),
    };
  }
  // Legacy evidence-style: indexSha256 as bare hex for path artifact
  if (typeof receipt.indexSha256 === 'string' && receipt.indexSha256.length >= 32) {
    return { alg: HASH_ALG_SHA256, hex: receipt.indexSha256 };
  }
  return null;
}

/**
 * Path the receipt claims to bind to.
 * @param {object} receipt
 */
export function extractBoundArtifactPath(receipt) {
  if (receipt.artifact?.path) return String(receipt.artifact.path);
  if (receipt.indexPath) return String(receipt.indexPath);
  if (receipt.artifact_path) return String(receipt.artifact_path);
  return null;
}

/**
 * Level 0 verification. Deterministic for fixed inputs except `timestamp`.
 * @param {VerifyRequest} request
 */
export function verifyLevel0(request) {
  const cwd = request.cwd ? resolve(request.cwd) : process.cwd();
  const level_requested =
    request.level_requested === undefined || request.level_requested === null
      ? 0
      : Number(request.level_requested);

  /** @type {import('./semantics.js').Check[]} */
  const checks = [];

  const timestamp = new Date().toISOString();

  // Request shape
  if (request.spec && request.spec !== VERIFY_REQUEST_SPEC) {
    checks.push(
      check(
        'request_spec',
        'fail',
        `unsupported request spec: ${request.spec}`,
        REASON.STRUCTURE_INVALID
      )
    );
  } else {
    checks.push(check('request_spec', 'pass', VERIFY_REQUEST_SPEC, REASON.OK));
  }

  if (level_requested !== 0) {
    checks.push(
      check(
        'level_capability',
        'unavailable',
        `Level ${level_requested} not implemented in this verifier (Level 0 only)`,
        REASON.LEVEL_UNSUPPORTED
      )
    );
  } else {
    checks.push(check('level_capability', 'pass', 'Level 0 supported', REASON.OK));
  }

  const artifactRel = request.target?.path;
  const receiptRel = request.receipt?.path;

  const artifactPath = artifactRel ? resolve(cwd, artifactRel) : null;
  const receiptPath = receiptRel ? resolve(cwd, receiptRel) : null;

  // 1. Locate artifact
  let artifactExists = false;
  if (!artifactPath) {
    checks.push(
      check('artifact_located', 'unavailable', 'target.path not provided', REASON.ARTIFACT_MISSING)
    );
  } else if (!existsSync(artifactPath)) {
    checks.push(
      check(
        'artifact_located',
        'unavailable',
        `artifact not found: ${artifactRel}`,
        REASON.ARTIFACT_MISSING
      )
    );
  } else {
    artifactExists = true;
    checks.push(check('artifact_located', 'pass', `artifact found: ${artifactRel}`, REASON.OK));
  }

  // 2. Locate receipt
  let receiptText = null;
  let receiptObj = null;
  let receiptDigest = null;
  if (!receiptPath) {
    checks.push(
      check('receipt_located', 'unavailable', 'receipt.path not provided', REASON.RECEIPT_MISSING)
    );
  } else if (!existsSync(receiptPath)) {
    checks.push(
      check(
        'receipt_located',
        'unavailable',
        `receipt not found: ${receiptRel}`,
        REASON.RECEIPT_MISSING
      )
    );
  } else {
    checks.push(check('receipt_located', 'pass', `receipt found: ${receiptRel}`, REASON.OK));
    try {
      receiptText = readFileSync(receiptPath, 'utf8');
      // Compute receipt digest for evidence_binding (Gap H).
      receiptDigest = digestSha256(receiptText);
    } catch (e) {
      checks.push(
        check(
          'receipt_located',
          'unavailable',
          `receipt unreadable: ${e.message}`,
          REASON.RECEIPT_MISSING
        )
      );
    }
  }

  // 3–4. Structure + parse
  if (receiptText != null) {
    const parsed = parseReceipt(receiptText);
    if (!parsed.ok) {
      checks.push(
        check(
          'receipt_structure',
          'fail',
          `malformed receipt JSON: ${parsed.error}`,
          REASON.RECEIPT_MALFORMED
        )
      );
    } else {
      receiptObj = parsed.value;
      const missing = REQUIRED_RECEIPT_FIELDS.filter((f) => receiptObj[f] == null);
      // Accept legacy evidence receipt: schemaVersion + indexSha256 + indexPath
      const legacyOk =
        receiptObj.schemaVersion &&
        (receiptObj.indexSha256 || receiptObj.artifact?.digest) &&
        (receiptObj.indexPath || receiptObj.artifact?.path);

      if (missing.length && !legacyOk) {
        checks.push(
          check(
            'receipt_structure',
            'fail',
            `missing required fields: ${missing.join(', ')}`,
            REASON.STRUCTURE_INVALID
          )
        );
      } else {
        checks.push(
          check(
            'receipt_structure',
            'pass',
            legacyOk && missing.length
              ? 'legacy evidence receipt structure accepted'
              : 'required structural fields present',
            REASON.OK
          )
        );
      }
    }
  } else {
    checks.push(
      check(
        'receipt_structure',
        'unavailable',
        'receipt body not available for structural check',
        REASON.RECEIPT_MISSING
      )
    );
  }

  // 5. Artifact hash vs receipt
  let computedDigest = null;
  if (artifactExists && artifactPath) {
    computedDigest = digestSha256File(artifactPath);
  }

  const claimedDigest = receiptObj ? extractArtifactDigest(receiptObj) : null;

  if (!artifactExists) {
    checks.push(
      check(
        'artifact_hash',
        'unavailable',
        'cannot hash missing artifact',
        REASON.ARTIFACT_MISSING
      )
    );
  } else if (!claimedDigest) {
    checks.push(
      check(
        'artifact_hash',
        'unavailable',
        'receipt does not contain an artifact digest claim',
        REASON.STRUCTURE_INVALID
      )
    );
  } else if (!computedDigest) {
    checks.push(
      check('artifact_hash', 'unavailable', 'failed to compute artifact digest', REASON.ARTIFACT_MISSING)
    );
  } else if (!digestsEqual(computedDigest, claimedDigest)) {
    checks.push(
      check(
        'artifact_hash',
        'fail',
        `digest mismatch: computed ${computedDigest.alg}:${computedDigest.hex} != receipt ${claimedDigest.alg}:${claimedDigest.hex}`,
        REASON.ARTIFACT_HASH_MISMATCH
      )
    );
  } else {
    checks.push(
      check(
        'artifact_hash',
        'pass',
        `artifact digest matches (${computedDigest.alg}:${computedDigest.hex.slice(0, 12)}…)`,
        REASON.OK
      )
    );
  }

  // 6. Receipt-to-artifact binding (path identity when both sides declare path)
  if (!receiptObj || !artifactExists) {
    checks.push(
      check(
        'receipt_artifact_binding',
        'unavailable',
        'cannot verify binding without receipt and artifact',
        REASON.BINDING_MISMATCH
      )
    );
  } else {
    const boundPath = extractBoundArtifactPath(receiptObj);
    if (!boundPath) {
      // Digest-only binding is OK if hash check passed
      const hashCheck = checks.find((c) => c.name === 'artifact_hash');
      if (hashCheck?.status === 'pass') {
        checks.push(
          check(
            'receipt_artifact_binding',
            'pass',
            'binding via artifact digest only (no path claim in receipt)',
            REASON.OK
          )
        );
      } else if (hashCheck?.status === 'fail') {
        checks.push(
          check(
            'receipt_artifact_binding',
            'fail',
            'digest binding failed',
            REASON.BINDING_MISMATCH
          )
        );
      } else {
        checks.push(
          check(
            'receipt_artifact_binding',
            'unavailable',
            'no path claim and digest check not pass',
            REASON.BINDING_MISMATCH
          )
        );
      }
    } else {
      const normalizedClaim = resolve(cwd, boundPath);
      const normalizedTarget = artifactPath;
      if (normalizedClaim !== normalizedTarget && boundPath !== artifactRel) {
        // allow match on relative equality
        const relMatch =
          boundPath.replace(/^\.\//, '') === String(artifactRel || '').replace(/^\.\//, '');
        if (!relMatch) {
          checks.push(
            check(
              'receipt_artifact_binding',
              'fail',
              `path binding mismatch: receipt claims ${boundPath}, target is ${artifactRel}`,
              REASON.BINDING_MISMATCH
            )
          );
        } else {
          checks.push(
            check('receipt_artifact_binding', 'pass', 'receipt path binds to target artifact', REASON.OK)
          );
        }
      } else {
        checks.push(
          check('receipt_artifact_binding', 'pass', 'receipt path binds to target artifact', REASON.OK)
        );
      }
    }
  }

  // 7. Signature — only if primitive exists (it does not in this repo for Ed25519)
  const hasSig =
    receiptObj &&
    (receiptObj.signature || receiptObj.sig || receiptObj.signatures);
  if (!hasSig) {
    checks.push(
      check(
        'signature',
        'not_applicable',
        'receipt does not claim a cryptographic signature',
        REASON.OK
      )
    );
  } else {
    // No Ed25519 verify module in repo — capability unavailable
    checks.push(
      check(
        'signature',
        'unavailable',
        'receipt claims signature but verifier has no signature verification primitive configured',
        REASON.SIGNATURE_UNAVAILABLE
      )
    );
  }

  const agg = aggregateLevel0(checks, { level_requested });

  // Safety: never PASS if mandatory unavailable
  let status = agg.status;
  if (status === 'pass') {
    const mandUnavail = checks.some(
      (c) =>
        c.status === 'unavailable' &&
        [
          'artifact_located',
          'receipt_located',
          'receipt_structure',
          'artifact_hash',
          'receipt_artifact_binding',
        ].includes(c.name)
    );
    const sigUnavail = checks.some((c) => c.name === 'signature' && c.status === 'unavailable');
    if (mandUnavail || sigUnavail) {
      status = 'unavailable';
    }
  }

  const targetHash =
    computedDigest?.hex ||
    claimedDigest?.hex ||
    request.target?.hash?.hex ||
    null;

  // Build evidence_binding (Gap H): captures the specific artifact and
  // receipt digests consumed by this verification run.  This allows an
  // external party to confirm that a given result refers to specific inputs.
  /** @type {object|null} */
  const evidence_binding =
    computedDigest || receiptDigest
      ? {
          artifact_digest: computedDigest ?? null,
          receipt_digest: receiptDigest ?? null,
          artifact_path: artifactRel ?? null,
          receipt_path: receiptRel ?? null,
        }
      : null;

  const partialResult = {
    spec: VERIFY_RESULT_SPEC,
    target: {
      hash: targetHash,
      type: request.target?.type || 'artifact',
      path: artifactRel || null,
    },
    level_requested: level_requested,
    level_achieved: status === 'pass' || status === 'partial' ? 0 : 0,
    status,
    summary: status === agg.status ? agg.summary : 'Level 0 incomplete after safety reclassification',
    checks,
    timestamp,
    verifier: {
      identity: VERIFIER_IDENTITY,
      version: VERIFIER_VERSION,
    },
    ...(evidence_binding != null ? { evidence_binding } : {}),
    // Explicit non-claims
    does_not_authorize: [
      'governance_decision',
      'mainnet_operator_approval',
      'deployment',
      'financial_transaction',
      'production_safety',
    ],
  };

  // Derive content-addressed result_id (Gap B) after the result shape is
  // final.  result_id covers all stable fields including evidence_binding.
  const result_id = deriveResultId(partialResult);

  return { ...partialResult, result_id };
}
