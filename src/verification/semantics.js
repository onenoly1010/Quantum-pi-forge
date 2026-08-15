/**
 * QPF verification semantics — Level 0 status aggregation.
 * Missing data → unavailable (not automatic cryptographic fail).
 * Known violations → fail.
 */

/** @typedef {'pass'|'fail'|'partial'|'unavailable'} TopStatus */
/** @typedef {'pass'|'fail'|'unavailable'|'not_applicable'} CheckStatus */

export const REASON = Object.freeze({
  ARTIFACT_MISSING: 'ARTIFACT_MISSING',
  RECEIPT_MISSING: 'RECEIPT_MISSING',
  RECEIPT_MALFORMED: 'RECEIPT_MALFORMED',
  ARTIFACT_HASH_MISMATCH: 'ARTIFACT_HASH_MISMATCH',
  BINDING_MISMATCH: 'BINDING_MISMATCH',
  STRUCTURE_INVALID: 'STRUCTURE_INVALID',
  SIGNATURE_UNAVAILABLE: 'SIGNATURE_UNAVAILABLE',
  SIGNATURE_INVALID: 'SIGNATURE_INVALID',
  LEVEL_UNSUPPORTED: 'LEVEL_UNSUPPORTED',
  OK: 'OK',
});

/**
 * @typedef {object} Check
 * @property {string} name
 * @property {CheckStatus} status
 * @property {string} detail
 * @property {string} [code]
 */

/**
 * Aggregate Level 0 checks into top-level status.
 * Mandatory checks: artifact_located, receipt_located, receipt_structure,
 * artifact_hash, receipt_artifact_binding.
 * Signature is mandatory only when receipt claims a signature (not not_applicable).
 *
 * @param {Check[]} checks
 * @param {{ level_requested: number }} opts
 * @returns {{ status: TopStatus, level_achieved: number, summary: string }}
 */
export function aggregateLevel0(checks, opts) {
  const byName = Object.fromEntries(checks.map((c) => [c.name, c]));
  const mandatoryNames = [
    'artifact_located',
    'receipt_located',
    'receipt_structure',
    'artifact_hash',
    'receipt_artifact_binding',
  ];

  const sig = byName.signature;
  if (sig && sig.status !== 'not_applicable') {
    mandatoryNames.push('signature');
  }

  let anyFail = false;
  let anyUnavailable = false;
  let allMandatoryPass = true;

  for (const name of mandatoryNames) {
    const c = byName[name];
    if (!c) {
      anyUnavailable = true;
      allMandatoryPass = false;
      continue;
    }
    if (c.status === 'fail') {
      anyFail = true;
      allMandatoryPass = false;
    } else if (c.status === 'unavailable') {
      anyUnavailable = true;
      allMandatoryPass = false;
    } else if (c.status !== 'pass') {
      allMandatoryPass = false;
      if (c.status === 'not_applicable' && name !== 'signature') {
        // mandatory structural checks must not be N/A
        anyUnavailable = true;
      }
    }
  }

  // Optional / extension checks (e.g. requested level > 0 stubs)
  const optionalFail = checks.some(
    (c) => !mandatoryNames.includes(c.name) && c.status === 'fail'
  );
  const optionalUnavailable = checks.some(
    (c) => !mandatoryNames.includes(c.name) && c.status === 'unavailable'
  );

  if (anyFail || optionalFail) {
    return {
      status: 'fail',
      level_achieved: 0,
      summary: 'Mandatory Level 0 requirement positively violated',
    };
  }

  if (anyUnavailable) {
    return {
      status: 'unavailable',
      level_achieved: 0,
      summary: 'Minimum Level 0 verification could not be completed (essential data or capability unavailable)',
    };
  }

  if (allMandatoryPass && optionalUnavailable && opts.level_requested > 0) {
    return {
      status: 'partial',
      level_achieved: 0,
      summary: 'Level 0 succeeded; requested higher level unavailable',
    };
  }

  if (allMandatoryPass) {
    return {
      status: 'pass',
      level_achieved: 0,
      summary: 'All mandatory Level 0 checks succeeded',
    };
  }

  return {
    status: 'unavailable',
    level_achieved: 0,
    summary: 'Level 0 verification incomplete',
  };
}

/**
 * Enforce: PASS cannot occur if any mandatory check is unavailable.
 * @param {Check[]} checks
 * @param {TopStatus} status
 */
export function assertNoPassWithUnavailable(checks, status) {
  if (status !== 'pass') return true;
  const bad = checks.some(
    (c) =>
      c.status === 'unavailable' &&
      [
        'artifact_located',
        'receipt_located',
        'receipt_structure',
        'artifact_hash',
        'receipt_artifact_binding',
        'signature',
      ].includes(c.name) &&
      !(c.name === 'signature' && c.status === 'not_applicable')
  );
  // signature unavailable only matters if not N/A — already filtered
  const mandUnavail = checks.some((c) => {
    if (c.status !== 'unavailable') return false;
    if (c.name === 'signature') return true; // claimed signature path
    return [
      'artifact_located',
      'receipt_located',
      'receipt_structure',
      'artifact_hash',
      'receipt_artifact_binding',
    ].includes(c.name);
  });
  return !mandUnavail;
}
