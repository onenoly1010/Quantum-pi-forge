#!/usr/bin/env node
/**
 * Post-build broken-link gate for the public static bundle.
 *
 * Everything under out/ is served directly by Cloudflare Pages, so a link in a
 * shipped page that has no matching file in out/ is a 404 for a stranger walking
 * the site. Two classes of defect this catches:
 *
 *   1. A page links to a path that was never in the build manifest
 *      (e.g. out/ceremonial_interface.html pointing at deploy/index.html,
 *      which only exists in the source tree, not in the deployed artifact).
 *   2. A page links to a dev-only asset that ships as a dead script
 *      (e.g. the Vite dev shell requesting /src/main.tsx).
 *
 * Links outside out/ (http:, mailto:, data:, protocol-relative, bare #anchors)
 * and runtime-templated hrefs (inside JS template literals) are out of scope.
 *
 * Usage: node scripts/verify-internal-links.cjs   (run after `npm run build`)
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'out');

/** Anything with a scheme (http:, mailto:, data:, ...) or protocol-relative // */
const NON_LOCAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

const errors = [];
const scanned = [];

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function walkHtml(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walkHtml(full, acc);
    } else if (entry.name.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

/**
 * Resolve a page-relative URL against the deployed artifact.
 * Mirrors the Cloudflare Pages "clean URL" behaviour: /x may be served from
 * x, x.html or x/index.html.
 */
function resolveLocal(url, fromRel) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return { ok: true, why: 'in-page anchor' };
  if (NON_LOCAL.test(clean)) return { ok: true, why: 'external or non-http' };
  if (clean.includes('${')) return { ok: true, why: 'runtime-templated' };

  const relRaw = clean.startsWith('/')
    ? clean.slice(1)
    : toPosix(path.posix.join(path.posix.dirname(fromRel), clean));

  const rel = path.posix.normalize(relRaw);
  const base = rel === '' || rel === '.' ? 'index.html' : rel;

  const candidates = [base];
  if (!path.posix.extname(base)) {
    candidates.push(`${base}.html`, path.posix.join(base, 'index.html'));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(outDir, candidate))) {
      return { ok: true, file: candidate };
    }
  }
  return { ok: false, resolved: base };
}

function checkRedirects() {
  const redirectsPath = path.join(outDir, '_redirects');
  if (!fs.existsSync(redirectsPath)) return;

  const lines = fs.readFileSync(redirectsPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [, target] = trimmed.split(/\s+/);
    if (!target) continue;
    // Splat rewrites and proxied targets are owned by the edge, not by out/.
    if (NON_LOCAL.test(target) || target.includes(':')) continue;
    const resolved = resolveLocal(target, 'index.html');
    if (!resolved.ok) {
      errors.push(`_redirects target missing from out/: ${trimmed}  ->  ${resolved.resolved}`);
    }
  }
}

if (!fs.existsSync(outDir)) {
  console.error('ERROR: out/ missing — run npm run build first');
  process.exit(1);
}

for (const file of walkHtml(outDir)) {
  const fromRel = toPosix(path.relative(outDir, file));
  scanned.push(fromRel);
  const html = fs.readFileSync(file, 'utf8');

  const refRe = /(?:href|src)\s*=\s*"([^"]*)"/gi;
  let match;
  while ((match = refRe.exec(html)) !== null) {
    const url = match[1].trim();
    if (!url) continue;
    const resolved = resolveLocal(url, fromRel);
    if (!resolved.ok) {
      errors.push(`${fromRel} links to "${url}" -> out/${resolved.resolved} (missing)`);
    }
  }
}

checkRedirects();

if (errors.length) {
  console.error('Internal link verification FAILED:\n');
  for (const e of errors) console.error('  -', e);
  console.error(`\nScanned ${scanned.length} HTML files in out/.`);
  process.exit(1);
}

console.log(`OK no broken internal links (scanned ${scanned.length} HTML files in out/)`);
process.exit(0);
