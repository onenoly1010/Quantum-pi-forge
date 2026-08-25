#!/usr/bin/env node
/**
 * QPF Verification V1 - independent claim verifier.
 *
 * CONSUMES: claims file + observations file. PRODUCES: scoped verdicts.
 *
 * Independence rules enforced here:
 * - Imports NOTHING from src/verification or any QPF module.
 * - QPF conclusions supplied as support are NEVER establishing evidence;
 *   their use is flagged as SELF_REFERENCE_DETECTED.
 * - Document assertions are ASSERTION_ONLY; they identify what to test,
 *   never establish results.
 * - Uncertainty never converts into a negative claim.
 *
 * Verdict classes: VERIFIED | FALSE | NOT_ESTABLISHED | INSUFFICIENT_EVIDENCE |
 *                  UNVERIFIED | CONFLICT
 */
import { readFileSync } from 'node:fs';

const claimsPath = process.argv[2];
const obsPath = process.argv[3];
if (!claimsPath || !obsPath) {
  console.error('usage: verifier.mjs <claims.json> <observations.json>');
  process.exit(2);
}

const claimsDoc = JSON.parse(readFileSync(claimsPath, 'utf8'));
const obsDoc = JSON.parse(readFileSync(obsPath, 'utf8'));
const obsById = new Map(obsDoc.observations.map((o) => [o.observation_id, o]));

function getPath(obj, path) {
  return String(path).split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function evaluateCheck(obs, check) {
  // returns {result: SUPPORTED|CONTRADICTED|MISSING|INSUFFICIENT_EVIDENCE, detail}
  if (!obs) return { result: 'MISSING', detail: `observation not present` };
  switch (check.op) {
    case 'field_equals': {
      const actual = getPath(obs, check.path);
      if (actual === undefined || actual === null)
        return { result: 'INSUFFICIENT_EVIDENCE', detail: `field ${check.path} absent from observation` };
      const ok = String(actual).toLowerCase() === String(check.value).toLowerCase();
      return { result: ok ? 'SUPPORTED' : 'CONTRADICTED', detail: `${check.path}: observed=${actual} claimed=${check.value}` };
    }
    case 'code_nonempty': {
      if (obs.type !== 'account_code') return { result: 'MISSING', detail: 'observation is not account_code' };
      if (obs.size_bytes == null || obs.sha256_of_code_hex == null)
        return { result: 'INSUFFICIENT_EVIDENCE', detail: 'code size/hash unavailable from malformed capture' }; // R3 fix
      const ok = !obs.empty && obs.size_bytes > 0;
      return { result: ok ? 'SUPPORTED' : 'CONTRADICTED', detail: `code size ${obs.size_bytes} bytes at ${obs.address}` };
    }
    case 'reserves_all_zero': {
      if (obs.type !== 'pair_reserves') return { result: 'MISSING', detail: 'observation is not pair_reserves' };
      if (obs.reserve0 === null || obs.reserve1 === null)
        return { result: 'INSUFFICIENT_EVIDENCE', detail: 'reserve words undecodable' };
      const ok = obs.reserve0 === '0' && obs.reserve1 === '0';
      return { result: ok ? 'SUPPORTED' : 'CONTRADICTED', detail: `reserves ${obs.reserve0}/${obs.reserve1}` };
    }
    default:
      return { result: 'INSUFFICIENT_EVIDENCE', detail: `unknown check op ${check.op}` };
  }
}

function evaluateClaim(claim) {
  let any_partial_only = false;
  const per_support = [];
  const flags = {
    self_reference_detected: false,
    assertion_only_support: false,
    stale_observation_detected: false,
  };
  let saw_observation_support = false;
  let any_contradicted = false;
  let any_missing = false;
  let any_insufficient = false;
  let conflict_detected = false;

  // Cross-observation conflict scan: identical identity presentation from
  // distinct addresses (duplicate-token ambiguity).
  const names = new Map();
  for (const o of obsDoc.observations) {
    if (o.type === 'token_name') {
      const key = o.name_decoded.toLowerCase();
      if (!names.has(key)) names.set(key, new Set());
      names.get(key).add(o.address.toLowerCase());
    }
  }
  for (const [nameKey, addrSet] of names.entries()) {
    if (addrSet.size > 1) {
      conflict_detected = true;
      per_support.push({
        kind: 'conflict_scan',
        result: 'CONFLICT',
        detail: `${addrSet.size} distinct addresses present identity "${nameKey}": ${[...addrSet].join(', ')}`,
      });
    }
  }

  for (const sup of claim.supports || []) {
    if (sup.kind === 'observation_check') {
      saw_observation_support = true;
      if (sup.partial) any_partial_only = true;
      const obs = obsById.get(sup.observation_id);
      let r = evaluateCheck(obs, sup.check);
      if (sup.freshness_sensitive && r.result === 'SUPPORTED' && obs?.type === 'block_number') {
        const fresh = obsDoc.observations.find((o) => o.observation_id === 'block-fresh');
        if (fresh && obs.observation_id !== 'block-fresh') {
          const frozenDec = BigInt(obs.block_number_hex);
          const freshDec = BigInt(fresh.block_number_hex);
          if (freshDec !== frozenDec) {
            flags.stale_observation_detected = true;
            r = {
              result: 'CONTRADICTED',
              detail: `STALE: chain advanced. frozen block ${obs.block_number_dec}, fresh block ${fresh.block_number_dec}. Recheck required.`,
            };
          }
        }
      }
      per_support.push({ kind: sup.kind, observation_id: sup.observation_id, partial: !!sup.partial, ...r }); // R6 fix: propagate partial flag
      if (r.result === 'CONTRADICTED') any_contradicted = true;
      if (r.result === 'MISSING') any_missing = true;
      if (r.result === 'INSUFFICIENT_EVIDENCE') any_insufficient = true;
    } else if (sup.kind === 'document_assertion') {
      flags.assertion_only_support = true;
      per_support.push({
        kind: 'document_assertion',
        source: sup.source,
        result: 'ASSERTION_ONLY',
        detail: 'documentation identifies what to test; it cannot establish the result',
      });
    } else if (sup.kind === 'qpf_conclusion') {
      flags.self_reference_detected = true;
      per_support.push({
        kind: 'qpf_conclusion',
        result: 'SELF_REFERENCE_DETECTED',
        detail: 'originating-system conclusion is not independent evidence',
      });
    } else {
      per_support.push({ kind: sup.kind, result: 'INSUFFICIENT_EVIDENCE', detail: 'unknown support kind' });
      any_insufficient = true;
    }
  }

  let verdict;
  const scope_limits = [];
  if (flags.self_reference_detected) {
    verdict = 'NOT_ESTABLISHED';
    scope_limits.push('circular dependency: only originating-system conclusion supplied');
  } else if (conflict_detected && claim.proposition_conflict_sensitive) {
    verdict = 'CONFLICT';
    scope_limits.push('identity ambiguity requires governance/deployer information');
  } else if (any_contradicted) {
    verdict = 'FALSE';
  } else if (any_insufficient) {
    verdict = 'INSUFFICIENT_EVIDENCE';
    scope_limits.push('one or more observations were malformed/truncated; values could not be decoded'); // R4b fix
  } else if (any_missing) {
    verdict = 'NOT_ESTABLISHED';
    scope_limits.push('required observation absent from supplied evidence');
  } else if (saw_observation_support) {
    const fullSupport = per_support.some((p) => p.result === 'SUPPORTED' && !p.partial);
    if (!fullSupport) {
      any_partial_only = true;
      verdict = 'NOT_ESTABLISHED';
      scope_limits.push('supplied observations cover only part of the proposition; remainder unsupported'); // R4 fix
    } else {
      verdict = 'VERIFIED';
    }
    scope_limits.push('scoped to captured observation timestamps; recheck on chain advancement');
  } else if (any_missing) {
    verdict = 'NOT_ESTABLISHED';
    scope_limits.push('required observation absent from supplied evidence');
  } else if (any_insufficient) {
    verdict = 'INSUFFICIENT_EVIDENCE';
  } else {
    verdict = flags.assertion_only_support ? 'NOT_ESTABLISHED' : 'UNVERIFIED';
    scope_limits.push('no establishing support supplied');
  }

  return {
    claim_id: claim.claim_id,
    proposition: claim.proposition,
    verdict,
    flags,
    per_support,
    scope_and_limitations: scope_limits,
    recheck_conditions: ['newer chain observation available', 'evidence files change', 'canonical layout changes'],
    verifier_version: 'qpf-verifier-v1/0.1.0 (independent, no QPF imports)',
  };
}

const verdicts = claimsDoc.claims.map(evaluateClaim);
const out = {
  spec: 'qpf-verifier-v1/verdicts',
  evaluated_at_utc: new Date().toISOString(),
  claims_evaluated: verdicts.length,
  self_reference_violations: verdicts.filter((v) => v.flags.self_reference_detected).length,
  verdicts,
};
console.log(JSON.stringify(out, null, 2));
