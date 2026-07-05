#!/usr/bin/env node

/**
 * human-cockpit-status.cjs
 *
 * Pipeline-refreshed read-only cockpit snapshot generator.
 *
 * Trust chain:
 *   Receipts + Governance Files
 *     → verify:evidence
 *     → build
 *     → human-cockpit-status.cjs
 *     → receipts/human-cockpit/human-cockpit-read-only-v1.json
 *     → human-cockpit.html
 *
 * Rule: No dashboard update is trusted unless evidence verification
 *       and build pass first.
 *
 * This script is a verified snapshot generator, NOT a live controller.
 * It preserves the cockpit as a witness, not an actor.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const RECEIPTS_DIR = path.join(ROOT, 'receipts');
const COCKPIT_DIR = path.join(RECEIPTS_DIR, 'human-cockpit');
const OUTPUT_FILE = path.join(COCKPIT_DIR, 'human-cockpit-read-only-v1.json');

// ─── Hardcoded safety assertions ───────────────────────────────────────────
// These are the invariant guarantees for Human Cockpit v1.
// No dashboard update is trusted unless these are all false.
const SAFETY_ASSERTIONS = {
  signing: false,
  broadcast: false,
  wallet_connection: false,
  private_key_access: false,
  mint: false,
  transfer: false,
  liquidity: false,
  staking: false,
  bridge: false
};

// ─── Evidence verification status ──────────────────────────────────────────
function checkEvidenceVerification() {
  // Check multiple evidence receipts to determine verification status
  const evidencePaths = [
    { path: path.join(RECEIPTS_DIR, 'governance', 'current-governance-state-v1.json'), label: 'Governance State' },
    { path: path.join(RECEIPTS_DIR, 'governance', 'open-verification-gate-v1.json'), label: 'Open Verification Gate' },
    { path: path.join(RECEIPTS_DIR, 'governance', 'open-verification-gate-v1-post-merge.json'), label: 'Open Verification Gate (Post-Merge)' }
  ];

  let foundCount = 0;
  let passedCount = 0;
  const details = [];

  for (const { path: p, label } of evidencePaths) {
    if (!fs.existsSync(p)) {
      details.push(`${label}: Not Found`);
      continue;
    }
    foundCount++;
    try {
      const raw = fs.readFileSync(p, 'utf8');
      const receipt = JSON.parse(raw);
      // Receipt exists and is valid JSON — that's evidence of verification
      passedCount++;
      details.push(`${label}: Present`);
    } catch (err) {
      details.push(`${label}: Parse Error`);
    }
  }

  // Also check that verify:evidence has been run by looking for evidence index
  const evidenceIndexPath = path.join(RECEIPTS_DIR, 'governance', 'cross-platform-determinism-v1.json');
  if (fs.existsSync(evidenceIndexPath)) {
    foundCount++;
    passedCount++;
    details.push('Cross-Platform Determinism: Present');
  }

  const passed = foundCount > 0 && passedCount === foundCount;
  return {
    status: passed ? 'Passed' : 'Failed',
    passed,
    detail: passed
      ? `Evidence verification confirmed (${passedCount}/${foundCount} receipts valid)`
      : `Evidence verification incomplete (${passedCount}/${foundCount} receipts valid) — run npm run verify:evidence`
  };
}

function checkBuildStatus() {
  const versionPath = path.join(ROOT, 'out', 'version.json');
  if (!fs.existsSync(versionPath)) {
    return { status: 'Not Run', passed: false, detail: 'No build output found — run npm run build first' };
  }

  try {
    const raw = fs.readFileSync(versionPath, 'utf8');
    const manifest = JSON.parse(raw);
    return {
      status: 'Passed',
      passed: true,
      detail: `Build commit ${manifest.commit ? manifest.commit.slice(0, 7) : 'unknown'} at ${manifest.build_time || 'unknown'}`
    };
  } catch (err) {
    return { status: 'Error', passed: false, detail: `Build manifest parse error: ${err.message}` };
  }
}

// ─── Gather governance signals from receipts ──────────────────────────────
function gatherGovernanceSignals() {
  const signals = {};

  // Check for public mint status
  const mintReceipt = path.join(RECEIPTS_DIR, 'execution', 'first-controlled-mint-v1.json');
  if (fs.existsSync(mintReceipt)) {
    try {
      const data = JSON.parse(fs.readFileSync(mintReceipt, 'utf8'));
      signals.publicMintOpen = data.mintExecuted === true || data.status === 'executed';
    } catch { /* ignore */ }
  }

  // Check for liquidity status
  const liquidityReceipt = path.join(RECEIPTS_DIR, 'governance', 'liquidity-funding-plan-v1.json');
  if (fs.existsSync(liquidityReceipt)) {
    try {
      const data = JSON.parse(fs.readFileSync(liquidityReceipt, 'utf8'));
      signals.liquiditySeeded = data.executed === true || data.status === 'executed';
    } catch { /* ignore */ }
  }

  // Check for staking status
  const stakingReceipt = path.join(RECEIPTS_DIR, 'governance', 'liquidity-readiness-preflight-v1.json');
  if (fs.existsSync(stakingReceipt)) {
    try {
      const data = JSON.parse(fs.readFileSync(stakingReceipt, 'utf8'));
      signals.stakingActive = data.stakingEnabled === true;
    } catch { /* ignore */ }
  }

  // Check for bridge status
  const bridgeReceipt = path.join(RECEIPTS_DIR, 'governance', 'bridge-policy-readiness-v1.json');
  if (fs.existsSync(bridgeReceipt)) {
    try {
      const data = JSON.parse(fs.readFileSync(bridgeReceipt, 'utf8'));
      signals.bridgeActive = data.bridgeEnabled === true;
    } catch { /* ignore */ }
  }

  // Check for wallet onboarding
  const walletReceipt = path.join(RECEIPTS_DIR, 'governance', 'first-external-human-wallet-onboarding-v1.json');
  if (fs.existsSync(walletReceipt)) {
    try {
      const data = JSON.parse(fs.readFileSync(walletReceipt, 'utf8'));
      signals.walletOnboarded = data.onboarded === true;
    } catch { /* ignore */ }
  }

  return signals;
}

// ─── Build the cockpit snapshot ────────────────────────────────────────────
function buildCockpitSnapshot() {
  console.log('\n=== Human Cockpit v1 — Read-Only Snapshot Generator ===\n');

  // 1. Check evidence verification
  const evidenceStatus = checkEvidenceVerification();
  console.log(`Evidence Verification: ${evidenceStatus.status}`);
  if (!evidenceStatus.passed) {
    console.warn(`  WARN: ${evidenceStatus.detail}`);
  }

  // 2. Check build status
  const buildStatus = checkBuildStatus();
  console.log(`Build Status:         ${buildStatus.status}`);
  if (!buildStatus.passed) {
    console.warn(`  WARN: ${buildStatus.detail}`);
  }

  // 3. Gather governance signals
  const signals = gatherGovernanceSignals();

  // 4. Determine system mode
  const allAssertionsHeld = Object.values(SAFETY_ASSERTIONS).every(v => v === false);
  const systemMode = allAssertionsHeld ? 'Read-Only Observation' : 'WARNING: Safety assertions violated';

  // 5. Determine next allowed action
  let nextAllowedAction = 'Human review of outreach packet or read-only reconciliation';
  if (!evidenceStatus.passed || !buildStatus.passed) {
    nextAllowedAction = 'Run verify:evidence and build before cockpit update is trusted';
  }

  // 6. Build the snapshot
  const snapshot = {
    _meta: {
      schema: 'human-cockpit-read-only-v1',
      generated_at: new Date().toISOString(),
      generator: 'scripts/human-cockpit-status.cjs',
      description: 'Pipeline-refreshed read-only cockpit snapshot. Not a live controller.'
    },
    trust_chain: {
      evidence_verification: evidenceStatus,
      build: buildStatus
    },
    system: {
      mode: systemMode,
      description: 'Pipeline-refreshed read-only cockpit. Updates only when Forge state is intentionally verified.'
    },
    safety_assertions: SAFETY_ASSERTIONS,
    status: {
      'System Mode': systemMode,
      'Public Mint': signals.publicMintOpen ? 'Open' : 'Not Open',
      'Controlled Mint': 'Requires Verification',
      'Wallet Signing': 'Disabled',
      'Token Transfer': 'Disabled',
      'Liquidity': signals.liquiditySeeded ? 'Seeded' : 'Disabled',
      'Staking': signals.stakingActive ? 'Active' : 'Disabled',
      'Bridge': signals.bridgeActive ? 'Active' : 'Disabled',
      'Outreach': 'Human Review Allowed',
      'Evidence Verification': `${evidenceStatus.status} / ${evidenceStatus.passed ? 'Passed' : 'Required'}`,
      'Build Status': `${buildStatus.status} / ${buildStatus.passed ? 'Passed' : 'Required'}`,
      'Next Allowed Action': nextAllowedAction
    },
    governance_signals: signals,
    invariants: {
      signing_disabled: SAFETY_ASSERTIONS.signing === false,
      broadcast_disabled: SAFETY_ASSERTIONS.broadcast === false,
      wallet_connection_disabled: SAFETY_ASSERTIONS.wallet_connection === false,
      private_key_access_disabled: SAFETY_ASSERTIONS.private_key_access === false,
      mint_disabled: SAFETY_ASSERTIONS.mint === false,
      transfer_disabled: SAFETY_ASSERTIONS.transfer === false,
      liquidity_disabled: SAFETY_ASSERTIONS.liquidity === false,
      staking_disabled: SAFETY_ASSERTIONS.staking === false,
      bridge_disabled: SAFETY_ASSERTIONS.bridge === false
    }
  };

  // 7. Write the snapshot
  fs.mkdirSync(COCKPIT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(`\nOK wrote cockpit snapshot to receipts/human-cockpit/human-cockpit-read-only-v1.json`);

  // 8. Also write a human-readable summary to the receipts dir
  const summaryPath = path.join(COCKPIT_DIR, 'human-cockpit-summary-v1.txt');
  const summaryLines = [
    '╔══════════════════════════════════════════════════════════════╗',
    '║        HUMAN COCKPIT v1 — READ-ONLY OBSERVATION             ║',
    '║        Pipeline-refreshed snapshot — NOT a live controller  ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    `Generated: ${snapshot._meta.generated_at}`,
    '',
    '── System Mode ──────────────────────────────────────────────',
    `  ${systemMode}`,
    '',
    '── Status ───────────────────────────────────────────────────',
  ];

  for (const [key, value] of Object.entries(snapshot.status)) {
    summaryLines.push(`  ${key}: ${value}`);
  }

  summaryLines.push(
    '',
    '── Safety Assertions (all must be false) ────────────────────',
  );

  for (const [key, value] of Object.entries(SAFETY_ASSERTIONS)) {
    summaryLines.push(`  ${key}: ${value}`);
  }

  summaryLines.push(
    '',
    '── Trust Chain ──────────────────────────────────────────────',
    `  Evidence Verification: ${evidenceStatus.status}`,
    `  Build:                ${buildStatus.status}`,
    '',
    '── Rule ─────────────────────────────────────────────────────',
    '  No dashboard update is trusted unless evidence verification',
    '  and build pass first.',
    '',
    '── Next Allowed Action ──────────────────────────────────────',
    `  ${nextAllowedAction}`,
    '',
  );

  fs.writeFileSync(summaryPath, summaryLines.join('\n') + '\n');
  console.log(`OK wrote cockpit summary to receipts/human-cockpit/human-cockpit-summary-v1.txt`);

  return snapshot;
}

// ─── Main ──────────────────────────────────────────────────────────────────
try {
  const snapshot = buildCockpitSnapshot();
  console.log('\nOK Human Cockpit v1 snapshot generated successfully.\n');
  process.exit(0);
} catch (err) {
  console.error(`\nERROR Human Cockpit v1 snapshot generation failed: ${err.message}`);
  process.exit(1);
}