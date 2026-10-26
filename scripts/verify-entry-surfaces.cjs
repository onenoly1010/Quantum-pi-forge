#!/usr/bin/env node
/**
 * Post-build smoke check for public discoverability entry surfaces.
 * Fails if allowlist regressions drop pages from out/ or if SPA-shaped
 * titles leak onto dedicated funnel pages (the #718→#720 class of bug).
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'out');

const requiredFiles = [
  'index.html',
  'try.html',
  'open.html',
  'open-gates-v1.json',
  'meet.html',
  'meet.js',
  'front-door-cell.json',
  'mint-ai.html',
  'counterpart.js',
  'birth.html',
  'birth-client.js',
  'verification.html',
  'verification-certificate.html',
  'verification-request.html',
  'support.html',
  'verification-artifact.html',
  'verification-artifact.json',
  'verification-status-v1.json',
  'robots.txt',
  'sitemap.xml',
  'problems/index.html',
  'problems/verify-github-repo.html',
  'problems/prove-deployment-matches-source.html',
  'problems/audit-smart-contract-release.html',
  'problems/evidence-package-ai-result.html',
  '_headers',
  '_redirects',
];

/** title substring that must appear in the dedicated page (case-sensitive) */
const titleMustInclude = {
  // PR #906: /try was retitled to say plainly it is a limited demo, not a service.
  'try.html': 'Limited technical demonstration',
  // PR #906: /open now states gates are closed and the page is a preserved record.
  'open.html': 'preserved record (gates closed to new service)',
  'meet.html': 'Meet a co-creator',
  'mint-ai.html': 'Mint your AI',
  'birth.html': 'Watch your AI come to life',
  'problems/index.html': 'Problems QPF',
  'verification.html': 'Verification',
  'support.html': 'Support / Build With QPF',
  'verification-artifact.html': 'Verification Artifact',
  'robots.txt': null, // not HTML
  'sitemap.xml': null,
};

/** titles that indicate SPA / homepage fallback — must NOT appear on dedicated pages */
const forbiddenTitles = [
  'Quantum Pi Forge Genesis',
];

const errors = [];

function read(rel) {
  const p = path.join(outDir, rel);
  if (!fs.existsSync(p)) {
    errors.push(`missing out/${rel}`);
    return null;
  }
  return fs.readFileSync(p, 'utf8');
}

if (!fs.existsSync(outDir)) {
  console.error('ERROR: out/ missing — run npm run build first');
  process.exit(1);
}

for (const rel of requiredFiles) {
  const body = read(rel);
  if (body === null) continue;

  if (rel === 'robots.txt') {
    if (!/Sitemap:\s*https:\/\/quantumpiforge\.com\/sitemap\.xml/i.test(body)) {
      errors.push('robots.txt missing Sitemap: https://quantumpiforge.com/sitemap.xml');
    }
    if (/<!DOCTYPE html/i.test(body)) {
      errors.push('robots.txt looks like HTML (SPA fallback)');
    }
    continue;
  }

  if (rel === 'sitemap.xml') {
    if (!/quantumpiforge\.com\/try\.html/.test(body)) {
      errors.push('sitemap.xml missing try.html URL');
    }
    if (!/quantumpiforge\.com\/open\.html/.test(body)) {
      errors.push('sitemap.xml missing open.html URL');
    }
    if (!/quantumpiforge\.com\/meet\.html/.test(body)) {
      errors.push('sitemap.xml missing meet.html URL');
    }
    if (!/quantumpiforge\.com\/mint-ai\.html/.test(body)) {
      errors.push('sitemap.xml missing mint-ai.html URL');
    }
    if (!/quantumpiforge\.com\/birth\.html/.test(body)) {
      errors.push('sitemap.xml missing birth.html URL');
    }
    if (!/quantumpiforge\.com\/support\.html/.test(body)) {
      errors.push('sitemap.xml missing support.html URL');
    }
    if (!/quantumpiforge\.com\/verification-artifact/.test(body)) {
      errors.push('sitemap.xml missing verification-artifact URL');
    }
    if (!/quantumpiforge\.com\/problems\//.test(body)) {
      errors.push('sitemap.xml missing problems/ URL');
    }
    if (/<!DOCTYPE html/i.test(body)) {
      errors.push('sitemap.xml looks like HTML (SPA fallback)');
    }
    continue;
  }

  if (rel.endsWith('.json')) {
    try {
      JSON.parse(body);
    } catch (e) {
      errors.push(`${rel} is not valid JSON: ${e.message}`);
    }
    continue;
  }

  if (rel.endsWith('.html') || rel === 'index.html') {
    const titleMatch = body.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    if (!title) {
      errors.push(`${rel} has no <title>`);
    }
    for (const bad of forbiddenTitles) {
      if (title === bad || title.includes(bad)) {
        errors.push(`${rel} has SPA-fallback title: "${title}"`);
      }
    }
    const must = titleMustInclude[rel];
    if (must && !title.includes(must)) {
      errors.push(`${rel} title should include "${must}", got: "${title}"`);
    }
  }
}

// index must point at funnel
const index = read('index.html');
if (index) {
  if (!index.includes('/try.html') && !index.includes('href="/try"')) {
    errors.push('index.html missing link to /try.html');
  }
  if (!index.includes('/open.html') && !index.includes('href="/open"')) {
    errors.push('index.html missing link to /open.html');
  }
  // PR #906 removed home links to /meet.html, /mint-ai.html and /problems/
  // (those pages still exist and are still required in out/ above). The home
  // page now routes strangers to the verifiable record instead; assert those.
  if (!index.includes('/deployed-addresses.html')) {
    errors.push('index.html missing link to /deployed-addresses.html');
  }
  if (!index.includes('/what-it-does.html')) {
    errors.push('index.html missing link to /what-it-does.html');
  }
  if (!index.includes('/verification-request.html')) {
    errors.push('index.html missing link to /verification-request.html');
  }
  if (!index.includes('/support.html')) {
    errors.push('index.html missing link to /support.html');
  }
  if (!index.includes('/verification-artifact.html')) {
    errors.push('index.html missing link to /verification-artifact.html');
  }
  // PR #906 replaced the hero "Know what is real" with the current h1 wording.
  if (!/It needs verifiable boundaries/i.test(index)) {
    errors.push('index.html missing hero phrase "It needs verifiable boundaries"');
  }
  // Home page title must identify it as the preserved technical record.
  if (!/<title>[^<]*Preserved Technical Record/i.test(index)) {
    errors.push('index.html title missing "Preserved Technical Record"');
  }
}

// _headers should declare SEO content-types
const headers = read('_headers');
if (headers) {
  if (!/\/robots\.txt/.test(headers)) {
    errors.push('_headers missing /robots.txt rules');
  }
  if (!/\/sitemap\.xml/.test(headers)) {
    errors.push('_headers missing /sitemap.xml rules');
  }
}

if (errors.length) {
  console.error('Entry surface verification FAILED:\n');
  for (const e of errors) console.error('  -', e);
  process.exit(1);
}

console.log('OK entry surfaces present and not SPA-fallbacked:');
for (const rel of requiredFiles) {
  console.log('  out/' + rel);
}
process.exit(0);
