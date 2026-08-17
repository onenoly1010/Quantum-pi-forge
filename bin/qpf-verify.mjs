#!/usr/bin/env node
/**
 * qpf-verify — QPF artifact verification CLI.
 * Thin entry point; delegates to scripts/qpf-verify-level0.mjs.
 *
 * Usage:
 *   qpf-verify --artifact <path> --receipt <path> [--cwd <dir>] [--output <path>]
 *
 * Exit codes:
 *   0  pass or partial
 *   1  fail (deterministic violation detected)
 *   2  usage error
 *   3  unavailable (missing input or unsupported level)
 */

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Re-import the verification engine directly so this binary is self-contained.
const { verifyLevel0 } = await import(resolve(__dirname, '../src/verification/verify-level0.js'));

function usage() {
  process.stderr.write(
    'Usage: qpf-verify --artifact <path> --receipt <path> [--cwd <dir>] [--output <path>]\n'
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--artifact' || a === '--receipt' || a === '--cwd' || a === '--output') {
      out[a.slice(2)] = argv[++i];
    } else if (a === '--help' || a === '-h') {
      usage();
    }
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

const json = JSON.stringify(result, null, 2);

if (args.output) {
  writeFileSync(args.output, json + '\n', 'utf8');
  process.stderr.write(`verification result written to: ${args.output}\n`);
} else {
  process.stdout.write(json + '\n');
}

if (result.status === 'pass' || result.status === 'partial') process.exit(0);
if (result.status === 'fail') process.exit(1);
process.exit(3); // unavailable
