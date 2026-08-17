/**
 * Regression tests for artifact-name sanitization in the POST /api/verify endpoint.
 *
 * The endpoint must extract the basename from the supplied artifact_name so that:
 *   - "dir/artifact.json"       → "artifact.json"   (not "dirartifact.json")
 *   - "a/b/c/artifact.json"     → "artifact.json"
 *   - "..\\..\\artifact.json"   → "artifact.json"
 *   - "../../../etc/passwd"     → "passwd"
 *   - "artifact.json"           → "artifact.json"   (unchanged)
 *   - "" or omitted             → "artifact"        (fallback)
 *   - ".hidden" / "...hidden"   → preserved
 *   - "..."                     → fallback to "artifact" (dot-only basename)
 *
 * This module tests the sanitization logic in isolation (pure function, no I/O).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Reproduces the sanitization logic from functions/api/verify.ts onRequestPost.
 *
 * NOTE: this function is intentionally duplicated here rather than imported.
 * `functions/api/verify.ts` is a Cloudflare Pages Function that uses TypeScript and
 * Web Crypto APIs unavailable in the plain Node.js test runner; it cannot be imported
 * directly. If the production sanitization logic is ever extracted to a shared
 * `src/verification/sanitize.js` utility, import from there and remove this copy.
 *
 * Keep in sync with the production implementation in functions/api/verify.ts.
 *
 * @param {string|undefined} rawInput
 * @returns {string}
 */
function sanitizeArtifactName(rawInput) {
  const rawName =
    typeof rawInput === 'string' && rawInput.trim() ? rawInput.trim() : 'artifact';
  const baseName = rawName.replace(/\\/g, '/').split('/').pop() || '';
  return baseName && !/^\.+$/.test(baseName) ? baseName : 'artifact';
}

describe('Endpoint artifact-name sanitization', () => {
  it('simple filename unchanged', () => {
    assert.equal(sanitizeArtifactName('artifact.json'), 'artifact.json');
  });

  it('single-level path → basename only', () => {
    assert.equal(sanitizeArtifactName('dir/artifact.json'), 'artifact.json');
  });

  it('multi-level path → basename only', () => {
    assert.equal(sanitizeArtifactName('a/b/c/artifact.json'), 'artifact.json');
  });

  it('windows-style backslash path → basename only', () => {
    assert.equal(sanitizeArtifactName('dir\\artifact.json'), 'artifact.json');
  });

  it('mixed separators → basename only', () => {
    assert.equal(sanitizeArtifactName('a\\b/c\\artifact.json'), 'artifact.json');
  });

  it('traversal-like path → basename only (no pass-through of ..)', () => {
    const name = sanitizeArtifactName('../../../etc/passwd');
    assert.equal(name, 'passwd');
    assert.ok(!name.includes('..'), 'result must not contain ..');
    assert.ok(!name.includes('/'), 'result must not contain /');
  });

  it('dot-prefixed file names are preserved', () => {
    assert.equal(sanitizeArtifactName('.hidden'), '.hidden');
    assert.equal(sanitizeArtifactName('...hidden'), '...hidden');
  });

  it('empty string → fallback "artifact"', () => {
    assert.equal(sanitizeArtifactName(''), 'artifact');
  });

  it('whitespace-only string → fallback "artifact"', () => {
    assert.equal(sanitizeArtifactName('   '), 'artifact');
  });

  it('undefined → fallback "artifact"', () => {
    assert.equal(sanitizeArtifactName(undefined), 'artifact');
  });

  it('all dots (after split) → fallback "artifact"', () => {
    // "..." → after pop "..." → after dot-strip "" → fallback
    assert.equal(sanitizeArtifactName('...'), 'artifact');
  });
});
