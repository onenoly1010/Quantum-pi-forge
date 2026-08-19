#!/usr/bin/env node
/**
 * CLI: Level 0 QPF verify (quantum-pi-forge-verify/v1).
 * Does not perform governance authorization.
 *
 * Optional --sink <dir> flag: when supplied, persists the verification result
 * as a content-addressed canonical JSON file and writes an evidence package
 * manifest alongside it.  When omitted, behaviour is unchanged (stdout only).
 */

import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { verifyLevel0 } from '../src/verification/verify-level0.js';
import { writeResult } from '../src/verification/result-store.js';
import { buildPackageManifest } from '../src/verification/package.js';
import { canonicalize } from '../src/verification/canonical.js';

function usage() {
  console.error(
    'Usage: node scripts/qpf-verify-level0.mjs --artifact <path> --receipt <path> [--cwd <dir>] [--sink <dir>]'
  );
  process.exit(2);
}

function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--artifact' || a === '--receipt' || a === '--cwd' || a === '--sink') {
      out[a.slice(2)] = argv[++i];
    } else if (a === '--help' || a === '-h') usage();
  }
  return out;
}

const args = parseArgs(process.argv);
if (!args.artifact || !args.receipt) usage();

const cwd = args.cwd || process.cwd();

const result = verifyLevel0({
  spec: 'quantum-pi-forge-verify/v1',
  level_requested: 0,
  target: { type: 'artifact', path: args.artifact },
  receipt: { path: args.receipt },
  cwd,
});

console.log(JSON.stringify(result, null, 2));

if (args.sink) {
  const sinkDir = resolve(cwd, args.sink);

  // Persist the verification result (Gap A).
  const resultPath = writeResult(result, { sinkDir, cwd });
  console.error(`result_id:  ${result.result_id}`);
  console.error(`result written: ${resultPath}`);

  // Build and write the evidence package manifest (Gap J).
  const artifactAbs = resolve(cwd, args.artifact);
  const receiptAbs = resolve(cwd, args.receipt);

  const manifest = buildPackageManifest({
    artifactPath: artifactAbs,
    receiptPath: receiptAbs,
    resultPath,
    result,
  });

  const pkgFilename = `${manifest.package_id.replace(':', '-')}.json`;
  const pkgPath = join(sinkDir, pkgFilename);
  writeFileSync(pkgPath, canonicalize(manifest) + '\n', 'utf8');
  console.error(`package_id: ${manifest.package_id}`);
  console.error(`package written: ${pkgPath}`);
}

if (result.status === 'pass') process.exit(0);
if (result.status === 'partial') process.exit(0);
if (result.status === 'fail') process.exit(1);
process.exit(3); // unavailable
