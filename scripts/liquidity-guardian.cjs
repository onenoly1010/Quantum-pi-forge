#!/usr/bin/env node

/**
 * Liquidity Guardian v1.1 - Configurable Remote Fetch Adapter
 *
 * Bounded execution:
 *   fetch -> validate -> compare -> emit -> build -> diff -> stop
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
const LOCAL_FIXTURE_PATH = path.join(__dirname, '../test/mock-oracle.json');

const REMOTE_TARGET_URL =
  process.env.GUARDIAN_REMOTE_URL || 'http://127.0.0.1:8788/mock-oracle.json';

const FETCH_TIMEOUT_MS = Number(process.env.GUARDIAN_FETCH_TIMEOUT_MS || 5000);

const USE_REMOTE_FETCH =
  process.argv.includes('--remote') ||
  process.env.GUARDIAN_REMOTE_MODE === '1' ||
  process.env.GUARDIAN_REMOTE_MODE === 'true';

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
    console.error(`ERROR failed to parse local JSON: ${filePath}`);
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

function validateObservedPayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return false;
  }

  return STRUCTURAL_KEYS.every((key) =>
    Object.prototype.hasOwnProperty.call(input, key)
  );
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

async function fetchObservedTelemetry() {
  if (!USE_REMOTE_FETCH) {
    const localPayload = readJson(LOCAL_FIXTURE_PATH, null);

    if (!localPayload) {
      throw new Error(`local fixture missing: ${LOCAL_FIXTURE_PATH}`);
    }

    return localPayload;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(REMOTE_TARGET_URL, {
      signal: controller.signal,
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  console.log(`[${new Date().toISOString()}] Liquidity Guardian v1.1 starting`);
  console.log(`Remote fetch enabled: ${USE_REMOTE_FETCH ? 'yes' : 'no'}`);
  console.log(`Local fixture path: ${LOCAL_FIXTURE_PATH}`);
  console.log(`Remote oracle target: ${REMOTE_TARGET_URL}`);
  console.log(`Fetch timeout: ${FETCH_TIMEOUT_MS}ms`);

  let observedRaw;

  try {
    observedRaw = await fetchObservedTelemetry();
  } catch (error) {
    console.error('\n=== guardian result ===');
    console.error(`ERROR remote fetch failed safely: ${error.message}`);
    console.error('No local telemetry mutation, no build, no deploy, no commit, no push');
    process.exit(1);
  }

  if (!validateObservedPayload(observedRaw)) {
    console.error('\n=== guardian result ===');
    console.error('ERROR remote payload failed schema validation');
    console.error(JSON.stringify(observedRaw, null, 2));
    console.error('No local telemetry mutation, no build, no deploy, no commit, no push');
    process.exit(1);
  }

  const observed = compactTelemetry(observedRaw);
  const current = compactTelemetry(readJson(CURRENT_STATE_PATH, {}));

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
    mode: 'read-only-remote-v1.1',
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
  console.log('Guardian v1.1 stopped before deploy/commit/push.');
  console.log('Manual deploy command, if approved: bash scripts/deploy-cloudflare-pages.sh');
}

main();
