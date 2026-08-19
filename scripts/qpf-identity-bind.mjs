#!/usr/bin/env node
/**
 * Bind an identity artifact to existing Level 0 + qpfpkg0 machinery.
 * Does not merge, deploy, or create Genesis.
 *
 *   node scripts/qpf-identity-bind.mjs --artifact <path> --receipt <path> [--cwd <dir>] [--sink <dir>]
 */
import { bindIdentityArtifact } from '../src/verification/identity-bind.js';

function usage() {
  process.stderr.write(
    'Usage: node scripts/qpf-identity-bind.mjs --artifact <path> --receipt <path> [--cwd <dir>] [--sink <dir>]\n',
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--artifact' || a === '--receipt' || a === '--cwd' || a === '--sink') {
      out[a.slice(2)] = argv[++i];
    } else if (a === '--help' || a === '-h') usage();
  }
  return out;
}

const args = parseArgs(process.argv);
if (!args.artifact || !args.receipt) usage();

const bound = bindIdentityArtifact({
  cwd: args.cwd,
  artifactPath: args.artifact,
  receiptPath: args.receipt,
  sinkDir: args.sink,
});
process.stdout.write(`${JSON.stringify(bound, null, 2)}\n`);
if (bound.binding_status === 'pass') process.exit(0);
if (bound.binding_status === 'fail') process.exit(1);
process.exit(3);
