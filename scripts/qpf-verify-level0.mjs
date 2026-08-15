#!/usr/bin/env node
/**
 * CLI: Level 0 QPF verify (quantum-pi-forge-verify/v1).
 * Does not perform governance authorization.
 */

import { verifyLevel0 } from '../src/verification/verify-level0.js';

function usage() {
  console.error(
    'Usage: node scripts/qpf-verify-level0.mjs --artifact <path> --receipt <path> [--cwd <dir>]'
  );
  process.exit(2);
}

function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--artifact' || a === '--receipt' || a === '--cwd') {
      out[a.slice(2)] = argv[++i];
    } else if (a === '--help' || a === '-h') usage();
  }
  return out;
}

const args = parseArgs(process.argv);
if (!args.artifact || !args.receipt) usage();

const result = verifyLevel0({
  spec: 'quantum-pi-forge-verify/v1',
  level_requested: 0,
  target: { type: 'artifact', path: args.artifact },
  receipt: { path: args.receipt },
  cwd: args.cwd || process.cwd(),
});

console.log(JSON.stringify(result, null, 2));

if (result.status === 'pass') process.exit(0);
if (result.status === 'partial') process.exit(0);
if (result.status === 'fail') process.exit(1);
process.exit(3); // unavailable
