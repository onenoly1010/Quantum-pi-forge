/**
 * QPF verification hashing utilities (Level 0).
 * Uses SHA-256 (Node crypto) as transitional algorithm until BLAKE3 is added.
 * Algorithm id is always explicit on digests.
 */

import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';

export const HASH_ALG_SHA256 = 'sha256';

/**
 * @param {Uint8Array|Buffer|string} data
 * @returns {{ alg: string, hex: string }}
 */
export function digestSha256(data) {
  const h = createHash('sha256').update(data).digest('hex');
  return { alg: HASH_ALG_SHA256, hex: h };
}

/**
 * @param {string} filePath
 * @returns {{ alg: string, hex: string }|null} null if missing
 */
export function digestSha256File(filePath) {
  if (!existsSync(filePath)) return null;
  const buf = readFileSync(filePath);
  return digestSha256(buf);
}

/**
 * Compare two digests (alg + hex, case-insensitive hex).
 * @param {{ alg?: string, hex?: string }|null|undefined} a
 * @param {{ alg?: string, hex?: string }|null|undefined} b
 */
export function digestsEqual(a, b) {
  if (!a || !b) return false;
  if (String(a.alg || '').toLowerCase() !== String(b.alg || '').toLowerCase()) return false;
  return String(a.hex || '').toLowerCase() === String(b.hex || '').toLowerCase();
}
