#!/usr/bin/env node
/** Adversarial battery runner: executes every case against the verifier.
 *  Read-only over specimen; writes battery-results.json in adversarial/. */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const v1 = join(here, '..');
const casesDir = join(here, 'adversarial', 'cases');
const verifier = join(here, 'verifier.mjs'); // R2 fix: was join(v1,...) which pointed at research/verifier.mjs (nonexistent)
const mainObs = join(here, 'observations.json'); // R5 fix: was join(v1,...) which pointed at research/observations.json (nonexistent)

const files = readdirSync(casesDir).filter((f) => f.endsWith('.json')).sort();
const results = [];
let pass = 0;
let fail = 0;

for (const f of files) {
  const c = JSON.parse(readFileSync(join(casesDir, f), 'utf8'));
  const obsFile = c.observations_override
    ? join(here, c.observations_override)
    : mainObs;
  const claimsTmp = join(here, 'adversarial', `.claims-${c.case_id}.json`);
  writeFileSync(claimsTmp, JSON.stringify({ claims: c.claims }, null, 2));
  const r = spawnSync(process.execPath, [verifier, claimsTmp, obsFile], { encoding: 'utf8' });
  let out;
  try { out = JSON.parse(r.stdout); } catch { out = null; }
  const perClaim = (out?.verdicts || []).map((v) => ({ claim_id: v.claim_id, verdict: v.verdict, flags: v.flags }));
  // compare vs expected
  const expected = c.expected.map((e) => `${e.claim_id}=${e.verdict_class}`).sort().join(' ');;
  const actual = perClaim.map((p) => `${p.claim_id}=${p.verdict}`).sort().join(' ');
  const matched = expected === actual;
  if (matched) pass++; else fail++;
  results.push({
    case_id: c.case_id,
    title: c.title,
    expected,
    actual,
    matched,
    self_reference_flags: perClaim.filter((p) => p.flags?.self_reference_detected).length,
    raw: perClaim,
  });
}

const summary = {
  spec: 'qpf-v1-adversarial-battery/v1',
  ran_at_utc: new Date().toISOString(),
  verifier: 'research/verification-v1/verifier.mjs',
  cases: results.length,
  expected_match_pass: pass,
  expected_match_fail: fail,
  results,
};
writeFileSync(join(here, 'adversarial', 'battery-results.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ cases: summary.cases, pass, fail }, null, 2));
results.forEach((r) => console.log(`${r.matched ? 'MATCH ' : 'DIFF  '} ${r.case_id}: exp=[${r.expected}] act=[${r.actual}]${r.self_reference_flags ? ' [self-ref flagged]' : ''}`));
