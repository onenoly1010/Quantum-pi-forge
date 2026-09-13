/**
 * Step C — bind a qpf.identity.verifiable-ai.v1 artifact to existing
 * Level 0 verification, evidence_binding, and qpfpkg0 package machinery.
 *
 * Does not implement qpf.lineage.v1, Genesis, or a second verifier.
 * Does not change verifyLevel0 / canonicalize / hash semantics.
 *
 * identity_id (qpfid0:) identifies the stable identity body.
 * Level 0 artifact digest identifies the stored identity file bytes.
 * Those are related but not the same string; this module records both.
 *
 * pass != authorization
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { canonicalize } from './canonical.js';
import { digestSha256File } from './hash.js';
import { verifyLevel0, VERIFY_REQUEST_SPEC } from './verify-level0.js';
import { deriveIdentityId, IDENTITY_ID_PATTERN } from './identity-id.js';
import { writeResult } from './result-store.js';
import { buildPackageManifest, PACKAGE_ID_PREFIX } from './package.js';

export const IDENTITY_SPEC = 'qpf.identity.verifiable-ai.v1';
export const IDENTITY_BIND_SPEC = 'qpf.identity.bind.v1';

const BIND_DOES_NOT = Object.freeze([
  'genesis_creation',
  'merge',
  'deployment',
  'wallet_actions',
  'economic_activation',
  'lineage_engine',
  'api_verify_publication',
]);

function readJsonObject(abs, label) {
  if (!existsSync(abs)) {
    return { ok: false, error: `${label} not found` };
  }
  let value;
  try {
    value = JSON.parse(readFileSync(abs, 'utf8'));
  } catch (e) {
    return { ok: false, error: `${label} is not valid JSON: ${e.message}` };
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: `${label} root must be a JSON object` };
  }
  return { ok: true, value };
}

/**
 * Bind an on-disk identity artifact + originating receipt to Level 0 + package.
 *
 * @param {{
 *   cwd?: string,
 *   artifactPath: string,
 *   receiptPath: string,
 *   sinkDir?: string,
 * }} input
 */
export function bindIdentityArtifact(input) {
  const cwd = input.cwd ? resolve(input.cwd) : process.cwd();
  const artifactAbs = resolve(cwd, input.artifactPath);
  const receiptAbs = resolve(cwd, input.receiptPath);

  const loaded = readJsonObject(artifactAbs, 'identity artifact');
  let derived_identity_id = null;
  let declared_identity_id = null;
  let identity_id_consistent = false;
  const composition_checks = [];

  if (!loaded.ok) {
    composition_checks.push({
      name: 'identity_artifact',
      status: 'unavailable',
      detail: loaded.error,
    });
  } else {
    composition_checks.push({
      name: 'identity_artifact',
      status: loaded.value.spec === IDENTITY_SPEC ? 'pass' : 'fail',
      detail: `spec=${String(loaded.value.spec)}`,
    });
    try {
      derived_identity_id = deriveIdentityId(loaded.value);
    } catch (e) {
      composition_checks.push({
        name: 'identity_id_derived',
        status: 'fail',
        detail: String(e.message || e),
      });
    }
    declared_identity_id =
      typeof loaded.value.identity_id === 'string' ? loaded.value.identity_id : null;
    identity_id_consistent =
      Boolean(derived_identity_id) &&
      declared_identity_id === derived_identity_id &&
      IDENTITY_ID_PATTERN.test(derived_identity_id);
    composition_checks.push({
      name: 'identity_id_consistent',
      status: identity_id_consistent ? 'pass' : 'fail',
      detail: identity_id_consistent
        ? derived_identity_id
        : `declared=${declared_identity_id} derived=${derived_identity_id}`,
    });
  }

  const verification = verifyLevel0({
    spec: VERIFY_REQUEST_SPEC,
    level_requested: 0,
    target: { type: 'artifact', path: input.artifactPath },
    receipt: { path: input.receiptPath },
    cwd,
  });

  let package_manifest = null;
  let result_path = null;
  let package_path = null;
  if (input.sinkDir) {
    result_path = writeResult(verification, { sinkDir: input.sinkDir, cwd });
    package_manifest = buildPackageManifest({
      artifactPath: artifactAbs,
      receiptPath: receiptAbs,
      resultPath: result_path,
      result: verification,
      baseDir: cwd,
    });
    package_path = join(resolve(cwd, input.sinkDir), `${package_manifest.package_id.replace(':', '-')}.json`);
    writeFileSync(package_path, `${canonicalize(package_manifest)}\n`, 'utf8');
  }

  const file_digest = existsSync(artifactAbs) ? digestSha256File(artifactAbs) : null;

  let binding_status = 'unavailable';
  if (verification.status === 'fail' || !identity_id_consistent) binding_status = 'fail';
  else if (verification.status === 'pass' && identity_id_consistent) binding_status = 'pass';
  else if (verification.status === 'partial') binding_status = 'partial';
  else if (verification.status === 'unavailable') binding_status = 'unavailable';

  return {
    spec: IDENTITY_BIND_SPEC,
    binding_status,
    identity_id: derived_identity_id,
    declared_identity_id,
    identity_id_consistent,
    artifact_file_digest: file_digest,
    composition_checks,
    verification,
    evidence_binding: verification.evidence_binding ?? null,
    package: package_manifest,
    paths: {
      artifact: input.artifactPath,
      receipt: input.receiptPath,
      result: result_path,
      package: package_path,
    },
    authority: {
      pass_means: 'identity file matched originating receipt AND identity_id matched derivation',
      does_not_authorize: [
        ...(verification.does_not_authorize || []),
        ...BIND_DOES_NOT,
      ],
    },
    package_id_prefix: PACKAGE_ID_PREFIX,
  };
}
