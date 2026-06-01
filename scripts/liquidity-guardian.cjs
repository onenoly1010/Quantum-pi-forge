#!/usr/bin/env node

/**
 * Liquidity Guardian v1 - Local Observer Loop
 *
 * Bounded execution:
 *   observe -> compare -> emit -> build -> diff -> stop
 *
 * This script does NOT:
 *   - connect to a wallet
 *   - create a signer
 *   - submit transactions
 *   - deploy automatically
 *   - commit automatically
 *   - push automatically
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CURRENT_STATE_PATH = path.join(__dirname, '../api/liquidity-signals.json');
const OBSERVED_SOURCE_PATH = path.join(__dirname, '../test/mock-oracle.json');

const STRUCTURAL_KEYS = [
  'liquiditySource',
  'treasuryStatus',
  'lpPairAddress',
];

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`ERROR failed to parse JSON: ${filePath}`);
    console.error(error.message);
    process.exit(1);
  }
}

function compactTelemetry(input) {
  return {
    liquiditySource: input?.liquiditySource ?? null,
    treasuryStatus: input?.treasuryStatus ?? 'Not Seeded',
    lpPairAddress: input?.lpPairAddress ?? null,
  };
}

function structuralEqual(a, b) {
  return STRUCTURAL_KEYS.every((key) => a[key] === b[key]);
}

function run(label, command, args) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    console.error(`ERROR ${label} failed with exit code ${result.status}`);
    process.exit(result.status || 1);
  }
}

console.log(`[${new Date().toISOString()}] Liquidity Guardian v1 starting`);

const observedRaw = readJson(OBSERVED_SOURCE_PATH);
if (!observedRaw) {
  console.error(`ERROR observed source missing: ${OBSERVED_SOURCE_PATH}`);
  process.exit(1);
}

const currentRaw = readJson(CURRENT_STATE_PATH, {});
const observed = compactTelemetry(observedRaw);
const current = compactTelemetry(currentRaw);

console.log('\n=== observed structural telemetry ===');
console.log(JSON.stringify(observed, null, 2));

console.log('\n=== current structural telemetry ===');
console.log(JSON.stringify(current, null, 2));

if (structuralEqual(observed, current)) {
  console.log('\n=== guardian result ===');
  console.log('OK no structural telemetry change detected');
  console.log('No timestamp churn, no build, no deploy, no commit, no push');
  process.exit(0);
}

console.log('\n=== guardian result ===');
console.log('STRUCTURAL CHANGE DETECTED');
console.log('Updating local telemetry artifact only');

const updatedPayload = {
  ...observed,
  updatedAt: new Date().toISOString(),
  mode: 'read-only-automated-v1',
};

fs.writeFileSync(CURRENT_STATE_PATH, `${JSON.stringify(updatedPayload, null, 2)}\n`);
console.log(`OK wrote ${CURRENT_STATE_PATH}`);

run('build static artifact', 'npm', ['run', 'build:cf']);

console.log('\n=== review diff ===');
spawnSync('git', ['diff', '--', 'api/liquidity-signals.json', 'out/api/liquidity-signals.json'], {
  stdio: 'inherit',
  shell: false,
});

console.log('\n=== execution boundary enforced ===');
console.log('Guardian v1 stopped before deploy/commit/push.');
console.log('Manual deploy command, if approved: bash scripts/deploy-cloudflare-pages.sh');
