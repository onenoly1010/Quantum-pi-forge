/**
 * QPF verification — content-addressed result store (Gap A).
 *
 * Persists a verification result as a deterministically named canonical JSON
 * file in a filesystem sink directory.  No database required.
 *
 * File name is derived from result_id so writes are idempotent: verifying
 * the same artifact+receipt with the same outcome produces the same file.
 *
 * The file is serialized with canonicalize() so the on-disk representation
 * is itself deterministic across platforms and tool versions.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { canonicalize } from './canonical.js';

export const DEFAULT_SINK_DIR = 'results';

/**
 * Write a verification result to the sink directory.
 *
 * @param {object} result — a VerificationResult (must include result_id)
 * @param {{ sinkDir?: string, cwd?: string }} [opts]
 * @returns {string} — absolute path of the written file
 */
export function writeResult(result, opts = {}) {
  if (!result.result_id) {
    throw new Error('writeResult: result must include result_id before writing');
  }
  const cwd = opts.cwd ? resolve(opts.cwd) : process.cwd();
  const dir = resolve(cwd, opts.sinkDir ?? DEFAULT_SINK_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  // Replace the colon in "qpfv0:<hex>" with a hyphen for safe filenames.
  const filename = `${result.result_id.replace(':', '-')}.json`;
  const dest = join(dir, filename);
  writeFileSync(dest, canonicalize(result) + '\n', 'utf8');
  return dest;
}
