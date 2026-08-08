/**
 * SCCB v1 — redaction utilities.
 * Ensures secrets never appear in logs, receipts, or agent-facing output.
 */

import { SECRET_FIELD_PATTERNS } from './types.js';

const REDACTED = '[REDACTED]';

/** Common secret-like value patterns (heuristic; never log raw values) */
const VALUE_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
  /sk-[A-Za-z0-9]{20,}/g,
  /ghp_[A-Za-z0-9]{20,}/g,
  /gho_[A-Za-z0-9]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /xox[baprs]-[A-Za-z0-9-]{10,}/g,
  /0x[a-fA-F0-9]{64}/g, // private key hex length
  /-----BEGIN[^-]+PRIVATE KEY-----[\s\S]*?-----END[^-]+PRIVATE KEY-----/g,
];

/**
 * @param {string} key
 * @returns {boolean}
 */
export function isSecretFieldName(key) {
  if (typeof key !== 'string') return false;
  return SECRET_FIELD_PATTERNS.some((re) => re.test(key));
}

/**
 * Redact secret-like substrings from a string.
 * @param {unknown} input
 * @returns {string}
 */
export function redactString(input) {
  if (input == null) return '';
  let s = String(input);
  for (const re of VALUE_PATTERNS) {
    s = s.replace(re, REDACTED);
  }
  return s;
}

/**
 * Deep-clone and redact an object for safe logging / receipts.
 * Secret field names → REDACTED. Nested objects walked.
 * Never returns secret values.
 * @param {unknown} value
 * @param {number} [depth]
 * @returns {unknown}
 */
export function redactForAudit(value, depth = 0) {
  if (depth > 12) return '[MAX_DEPTH]';
  if (value == null) return value;
  if (typeof value === 'string') return redactString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    return value.map((v) => redactForAudit(v, depth + 1));
  }
  if (typeof value === 'object') {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (isSecretFieldName(k)) {
        out[k] = REDACTED;
      } else {
        out[k] = redactForAudit(v, depth + 1);
      }
    }
    return out;
  }
  return String(value);
}

/**
 * Safe logger that never prints secret field values.
 */
export function createSafeLogger(sink = console) {
  const wrap =
    (fn) =>
    (...args) => {
      const safe = args.map((a) =>
        typeof a === 'object' && a !== null ? redactForAudit(a) : redactString(a)
      );
      fn(...safe);
    };
  return {
    info: wrap(sink.info?.bind(sink) ?? sink.log.bind(sink)),
    warn: wrap(sink.warn?.bind(sink) ?? sink.log.bind(sink)),
    error: wrap(sink.error?.bind(sink) ?? sink.log.bind(sink)),
    debug: wrap(sink.debug?.bind(sink) ?? sink.log.bind(sink)),
  };
}

export { REDACTED };
