#!/usr/bin/env node

/**
 * Build script for Cloudflare Pages deployment.
 * Produces a static `out/` directory plus Pages-compatible redirects/headers.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const outputDir = path.join(rootDir, 'out');
const deployDir = path.join(rootDir, 'deploy');

const staticFiles = [
  { src: 'deploy/_headers', dest: '_headers', fallback: '_headers' },
  { src: 'deploy/index.html', dest: 'index.html' },
  { src: 'deploy/dao.html', dest: 'dao.html' },
  { src: 'deploy/resonate.html', dest: 'resonate.html' },
  { src: 'deploy/staking.html', dest: 'staking.html' },
  { src: 'deploy/what-it-does.html', dest: 'what-it-does.html' },
  { src: 'deploy/for-builders.html', dest: 'for-builders.html' },
  { src: 'deploy/work-with-us.html', dest: 'work-with-us.html' },
  { src: 'deploy/why-this-matters.html', dest: 'why-this-matters.html' },
  { src: 'deploy/human-onboarding.html', dest: 'human-onboarding.html' },
  { src: 'deploy/deployed-addresses.html', dest: 'deployed-addresses.html' },
  { src: 'deploy/capabilities.html', dest: 'capabilities.html' },
  { src: 'deploy/verification-status-v1.json', dest: 'verification-status-v1.json' },
  { src: 'deploy/capability-manifest.json', dest: 'capability-manifest.json' },
  { src: 'deploy/deployed-addresses-verification.json', dest: 'deployed-addresses-verification.json' },
  { src: 'deploy/onboarding-status.html', dest: 'onboarding-status.html' },
  { src: 'deploy/manifest.json', dest: 'manifest.json' },
  { src: 'mint.html', dest: 'mint.html' },
  { src: 'mint-status.html', dest: 'mint-status.html' },
  { src: 'human-cockpit.html', dest: 'human-cockpit.html' },
  { src: 'ceremonial_interface.html', dest: 'ceremonial_interface.html', optional: true },
  { src: 'spectral_command_shell.html', dest: 'spectral_command_shell.html', optional: true },
  { src: 'pi-forge-integration.js', dest: 'pi-forge-integration.js', optional: true }
];

const staticDirs = [
  { src: 'frontend', dest: 'frontend', optional: true },
  { src: 'deploy/trust', dest: 'trust', optional: true },
  { src: 'receipts/human-cockpit', dest: 'receipts/human-cockpit', optional: true },
  // Public mint / model metadata — required (served as application/json via _headers)
  { src: 'metadata', dest: 'metadata', optional: false },
];

/** Minimum non-empty _headers size (bytes). Empty file was B-05 / S-03 residual. */
const MIN_HEADERS_BYTES = 64;

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function resolveSource(file) {
  const primary = path.join(rootDir, file.src);
  if (fs.existsSync(primary)) return primary;

  if (file.fallback) {
    const fallback = path.join(rootDir, file.fallback);
    if (fs.existsSync(fallback)) return fallback;
  }

  return null;
}

function copyFile(file) {
  const srcPath = resolveSource(file);

  if (!srcPath) {
    const message = `File not found: ${file.src}`;
    if (file.optional) {
      console.warn(`WARN ${message}`);
      return;
    }
    throw new Error(message);
  }

  const destPath = path.join(outputDir, file.dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  console.log(`OK copied ${path.relative(rootDir, srcPath)} -> out/${file.dest}`);
}


function pruneProductionArtifacts() {
  const forbiddenRelativePaths = [
    'frontend/README.md',
    'frontend/example.html'
  ];

  for (const rel of forbiddenRelativePaths) {
    const target = path.join(outputDir, rel);
    if (fs.existsSync(target)) {
      fs.rmSync(target, { force: true });
      console.log(`OK pruned dev artifact out/${rel}`);
    }
  }
}

function writeVersionManifest() {
  let commitHash = 'dev-local';
  let buildTime = new Date().toISOString();

  try {
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    buildTime = execSync('date -u +"%Y-%m-%dT%H:%M:%SZ"', { encoding: 'utf8' }).trim();
  } catch {
    console.warn('WARN Could not retrieve git metadata, using dev-local');
  }

  const versionManifest = {
    commit: commitHash,
    build_time: buildTime,
    system: 'OINIO Quantum Pi Forge',
    version: '1.0.0'
  };

  fs.mkdirSync(path.join(rootDir, 'public'), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, 'public', 'version.json'),
    `${JSON.stringify(versionManifest, null, 2)}\n`
  );
  fs.writeFileSync(
    path.join(outputDir, 'version.json'),
    `${JSON.stringify(versionManifest, null, 2)}\n`
  );
  console.log(`OK generated version manifest for ${commitHash.slice(0, 7)}`);
}

function writeRedirects() {
  const redirects = [
    '/trust/* /trust/:splat 200',
    // Pi-network production_dashboard removed from public routes (see gated stub page).
    '/dashboard /frontend/dashboard-gated.html 200',
    '/dashboard/ /frontend/dashboard-gated.html 200',
    '/resonance-dashboard /frontend/dashboard-gated.html 200',
    '/api/* https://pi-forge-quantum-genesis.railway.app/api/:splat 200',
    '/health https://pi-forge-quantum-genesis.railway.app/health 200'
  ].join('\n') + '\n';

  fs.writeFileSync(path.join(outputDir, '_redirects'), redirects);
  console.log('OK created out/_redirects');
}

function build() {
  console.log('Building static assets for Cloudflare Pages\n');

  if (!fs.existsSync(deployDir)) {
    throw new Error('deploy/ directory is required for the public landing bundle');
  }

  console.log('Generating capability manifest');
  execSync('node scripts/generate-capability-manifest.cjs', { cwd: rootDir, stdio: 'inherit' });

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  writeRedirects();

  console.log('\nCopying static files');
  for (const file of staticFiles) copyFile(file);

  console.log('\nCopying static directories');
  for (const dir of staticDirs) {
    const srcPath = path.join(rootDir, dir.src);
    const destPath = path.join(outputDir, dir.dest);

    if (!fs.existsSync(srcPath)) {
      if (dir.optional) {
        console.warn(`WARN directory not found: ${dir.src}`);
        continue;
      }
      throw new Error(`Directory not found: ${dir.src}`);
    }

    copyDir(srcPath, destPath);
    console.log(`OK copied ${dir.src}/ -> out/${dir.dest}/`);
  }

  pruneProductionArtifacts();

  writeVersionManifest();

  assertHeadersPresent();

  console.log(`\nBuild completed: ${outputDir}\n`);
}

/**
 * Edge foundation gate: refuse a green build if Cloudflare _headers is missing or empty.
 * Source of truth is deploy/_headers (not public/_headers).
 */
function assertHeadersPresent() {
  const outHeaders = path.join(outputDir, '_headers');
  if (!fs.existsSync(outHeaders)) {
    throw new Error('out/_headers missing after copy — check deploy/_headers');
  }
  const bytes = fs.statSync(outHeaders).size;
  if (bytes < MIN_HEADERS_BYTES) {
    throw new Error(
      `out/_headers too small (${bytes} bytes; need >= ${MIN_HEADERS_BYTES}). ` +
        'Author security + content-type rules in deploy/_headers (B-05 residual).',
    );
  }
  const text = fs.readFileSync(outHeaders, 'utf8');
  const required = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    '/metadata/*',
  ];
  const missing = required.filter((token) => !text.includes(token));
  if (missing.length) {
    throw new Error(`out/_headers missing required directives: ${missing.join(', ')}`);
  }
  console.log(`OK edge headers present out/_headers (${bytes} bytes)`);
}

try {
  build();
} catch (error) {
  console.error(`\nBuild failed: ${error.message}`);
  process.exit(1);
}


// BEGIN publish run-guardian.sh for public install
await (async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const root = process.cwd();
  const src = path.join(root, "run-guardian.sh");
  const outDir = path.join(root, "out");
  const dest = path.join(outDir, "run-guardian.sh");

  if (fs.existsSync(src)) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, 0o755);
    console.log("OK copied run-guardian.sh -> out/run-guardian.sh");
  } else {
    console.warn("WARN run-guardian.sh not found; public guardian installer not copied");
  }
})();
// END publish run-guardian.sh for public install

// Copy read-only API telemetry files into the static output.
// This keeps /api/liquidity-signals.json available on Cloudflare Pages
// without introducing any server-side or write-capability behavior.
if (fs.existsSync('api')) {
  fs.cpSync('api', 'out/api', { recursive: true });
  console.log('OK copied api/ -> out/api');
}