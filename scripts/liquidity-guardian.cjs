#!/usr/bin/env node

/**
 * Liquidity Guardian v0 - Read-Only Manual Approval Loop
 *
 * This script observes intended telemetry input, runs the manual emitter,
 * rebuilds the static artifact, and prints the resulting diff.
 *
 * It does NOT:
 *   - connect to a wallet
 *   - create a signer
 *   - submit transactions
 *   - deploy automatically
 *   - commit automatically
 */

const { spawnSync } = require('child_process');
const fs = require('fs');

function run(label, command, args, options = {}) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options
  });

  if (result.status !== 0) {
    console.error(`FAILED: ${label}`);
    process.exit(result.status || 1);
  }
}

function showFile(label, file) {
  console.log(`\n=== ${label} ===`);
  if (!fs.existsSync(file)) {
    console.error(`Missing file: ${file}`);
    process.exit(1);
  }
  console.log(fs.readFileSync(file, 'utf8'));
}

run('emit read-only liquidity telemetry', 'node', ['scripts/update-liquidity-signals.cjs']);
run('build static Cloudflare Pages artifact', 'npm', ['run', 'build:cf']);

showFile('source telemetry', 'api/liquidity-signals.json');
showFile('artifact telemetry', 'out/api/liquidity-signals.json');

run('show git diff for human review', 'git', ['diff', '--', 'api/liquidity-signals.json', 'out/api/liquidity-signals.json']);

console.log('\nGuardian v0 complete.');
console.log('No deploy, commit, push, wallet, signer, or transaction was performed.');
console.log('Manual next step, if approved: bash scripts/deploy-cloudflare-pages.sh');
