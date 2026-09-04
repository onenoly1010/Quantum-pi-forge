/**
 * Local, deterministic verification of a bounded physical-compute evidence manifest.
 * It verifies supplied representations and commitments, never physical truth.
 */
import { canonicalizeToBytes } from './canonical.js';
import { digestSha256 } from './hash.js';

export const PHYSICAL_COMPUTE_MANIFEST_SPEC = 'qpf.physical-compute-manifest/v1';
export const PHYSICAL_COMPUTE_VERDICTS = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID',
  INCOMPLETE: 'INCOMPLETE',
  CONFLICT: 'CONFLICT',
});

const REQUIRED_KINDS = ['energy', 'compute', 'thermal', 'recovery', 'delivery'];

function check(name, status, detail) {
  return { name, status, detail };
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function intervalIsValid(interval) {
  if (!isObject(interval) || typeof interval.start !== 'string' || typeof interval.end !== 'string') return false;
  const start = Date.parse(interval.start);
  const end = Date.parse(interval.end);
  return Number.isFinite(start) && Number.isFinite(end) && start < end;
}

function intervalsOverlap(a, b) {
  return Date.parse(a.start) < Date.parse(b.end) && Date.parse(b.start) < Date.parse(a.end);
}

function rounded(value, places) {
  if (!Number.isInteger(places) || places < 0 || places > 12) throw new TypeError('decimal_places must be an integer from 0 to 12');
  const factor = 10 ** places;
  return Math.sign(value) * Math.round((Math.abs(value) + Number.EPSILON) * factor) / factor;
}

/**
 * @param {{manifest: object, evidence: Array<{id: string, content: object}>}} input
 * @returns {{verdict: string, checks: Array<{name: string, status: string, detail: string}>, limitations: string[]}}
 */
export function verifyPhysicalComputeManifest(input) {
  const checks = [];
  const limitations = ['Evidence integrity does not establish that an external physical observation is truthful.'];
  const manifest = input?.manifest;
  const evidence = input?.evidence;
  if (!isObject(manifest) || !Array.isArray(evidence)) {
    return { verdict: PHYSICAL_COMPUTE_VERDICTS.INVALID, checks: [check('request_structure', 'fail', 'manifest and evidence array are required')], limitations };
  }
  if (manifest.spec !== PHYSICAL_COMPUTE_MANIFEST_SPEC || !intervalIsValid(manifest.interval) || !isObject(manifest.boundary)) {
    checks.push(check('manifest_structure', 'fail', 'spec, bounded interval, and boundary are required'));
  } else {
    checks.push(check('manifest_structure', 'pass', 'manifest has the required bounded structure'));
  }

  const commitments = Array.isArray(manifest.commitments?.evidence) ? manifest.commitments.evidence : null;
  if (!commitments) {
    checks.push(check('evidence_commitments', 'unavailable', 'evidence commitments are absent'));
  } else {
    const supplied = new Map(evidence.map((entry) => [entry?.id, entry]));
    let failed = false;
    let missing = false;
    for (const commitment of commitments) {
      const entry = supplied.get(commitment?.id);
      if (!entry) {
        missing = true;
        continue;
      }
      if (commitment.alg !== 'sha256' || typeof commitment.hex !== 'string' ||
          digestSha256(canonicalizeToBytes(entry.content)).hex !== commitment.hex) failed = true;
    }
    checks.push(check('evidence_commitments', failed ? 'fail' : missing ? 'unavailable' : 'pass',
      failed ? 'a supplied evidence item does not match its SHA-256 commitment' :
        missing ? 'a committed evidence item was not supplied' : 'all supplied evidence matches its commitments'));
  }

  const byKind = new Map();
  for (const entry of evidence) {
    if (REQUIRED_KINDS.includes(entry?.content?.kind) && !byKind.has(entry.content.kind)) byKind.set(entry.content.kind, entry.content);
  }
  const missingKinds = REQUIRED_KINDS.filter((kind) => !byKind.has(kind));
  checks.push(check('required_evidence', missingKinds.length ? 'unavailable' : 'pass',
    missingKinds.length ? `missing required evidence: ${missingKinds.join(', ')}` : 'all required evidence categories supplied'));

  const energy = byKind.get('energy');
  const compute = byKind.get('compute');
  if (energy && compute && intervalIsValid(energy.interval) && intervalIsValid(compute.interval)) {
    checks.push(check('energy_compute_correlation', intervalsOverlap(energy.interval, compute.interval) ? 'pass' : 'unavailable',
      intervalsOverlap(energy.interval, compute.interval) ? 'intervals overlap' : 'intervals do not overlap'));
  } else if (energy && compute) {
    checks.push(check('energy_compute_correlation', 'fail', 'energy and compute intervals must be valid ISO-8601 intervals'));
  }

  const recovery = byKind.get('recovery');
  if (recovery?.calculation) {
    const c = recovery.calculation;
    try {
      const inputs = c.inputs;
      if (c.method !== 'liquid_heat_transfer/v1' || !isObject(inputs) ||
          !Number.isFinite(inputs.flow_kg_per_s) || !Number.isFinite(inputs.specific_heat_kj_per_kg_k) ||
          !Number.isFinite(inputs.supply_temperature_c) || !Number.isFinite(inputs.return_temperature_c) ||
          !Number.isFinite(c.declared_kw) || !c.fluid_property_evidence_id) {
        checks.push(check('recovery_calculation', 'unavailable', 'complete fluid-property-backed liquid calculation inputs are required'));
      } else if (!Number.isFinite(inputs.flow_kg_per_s) || inputs.flow_kg_per_s < 0 ||
                 inputs.specific_heat_kj_per_kg_k <= 0 || inputs.supply_temperature_c < inputs.return_temperature_c) {
        checks.push(check('recovery_calculation', 'fail', 'liquid calculation inputs are physically invalid for declared recovered heat'));
      } else {
        const reproduced = rounded(
          inputs.flow_kg_per_s * inputs.specific_heat_kj_per_kg_k *
          (inputs.supply_temperature_c - inputs.return_temperature_c),
          c.decimal_places
        );
        checks.push(check('recovery_calculation', reproduced === c.declared_kw ? 'pass' : 'fail',
          reproduced === c.declared_kw ? 'declared kW reproduces from supplied inputs' :
            `declared ${c.declared_kw} kW does not reproduce (${reproduced} kW)`));
      }
    } catch (error) {
      checks.push(check('recovery_calculation', 'fail', error.message));
    }
  } else if (recovery) {
    checks.push(check('recovery_calculation', 'unavailable', 'recovery calculation is absent'));
  }

  const assertions = new Map();
  for (const entry of evidence) {
    const a = entry?.content?.assertion;
    if (!a?.key || a.value === undefined) continue;
    const prior = assertions.get(a.key);
    if (prior !== undefined && canonicalizeToBytes(prior).toString() !== canonicalizeToBytes(a.value).toString()) {
      checks.push(check('evidence_conflict', 'conflict', `incompatible assertions for ${a.key}`));
      break;
    }
    assertions.set(a.key, a.value);
  }

  const statuses = checks.map((entry) => entry.status);
  const verdict = statuses.includes('fail') ? PHYSICAL_COMPUTE_VERDICTS.INVALID :
    statuses.includes('conflict') ? PHYSICAL_COMPUTE_VERDICTS.CONFLICT :
      statuses.includes('unavailable') ? PHYSICAL_COMPUTE_VERDICTS.INCOMPLETE :
        PHYSICAL_COMPUTE_VERDICTS.VALID;
  return { verdict, checks, limitations };
}
