#!/usr/bin/env node
/**
 * Read-only Independent AI Verification Partner CLI.
 *
 *   node scripts/qpf-independent-verify.mjs --artifact <path> --receipt <path> [--cwd <dir>]
 *
 * Never writes the artifact or receipt. Never merges or deploys.
 */
import { runPartner } from '../src/verification/independent-partner.js';

function usage() {
  process.stderr.write(
    'Usage: node scripts/qpf-independent-verify.mjs --artifact <path> --receipt <path> [--cwd <dir>]\n',
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--artifact' || a === '--receipt' || a === '--cwd') {
      out[a.slice(2)] = argv[++i];
    } else if (a === '--help' || a === '-h') {
      usage();
    }
  }
  return out;
}

const args = parseArgs(process.argv);
if (!args.artifact || !args.receipt) usage();

const evidence = runPartner({
  cwd: args.cwd,
  artifact: args.artifact,
  receipt: args.receipt,
});
process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);

if (evidence.comparison.agreement === 'MATCH' && evidence.primary.status === 'pass') {
  process.exit(0);
}
if (evidence.comparison.agreement === 'REVIEW_REQUIRED') process.exit(4);
if (evidence.primary.status === 'fail' || evidence.independent.status === 'fail') process.exit(1);
process.exit(3);
