/**
 * QPF Verification Protocol v1 — Milestone 1
 * Canonical serialization for hashing/signing inputs.
 *
 * Encoding identifier: jcs-rfc8785
 *
 * Implements JSON Canonicalization Scheme (RFC 8785) behavior as used for
 * deterministic object → UTF-8 bytes conversion:
 * - object members sorted by Unicode code point order of keys
 * - no insignificant whitespace
 * - JSON string/number forms via ECMAScript JSON rules (aligns with JCS for
 *   finite numbers and standard strings)
 *
 * This module does NOT hash or sign. Callers MUST pass the returned string/bytes
 * (not pretty-printed JSON.stringify output) into later hash/sign steps.
 */

/** @type {const} */
export const CANONICAL_ENCODING_ID = 'jcs-rfc8785';

/**
 * True if value is a plain object (not null, array, Date, Buffer, etc.).
 * @param {unknown} value
 */
function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Reject values that cannot appear in JSON / JCS.
 * @param {unknown} value
 * @param {string} path
 */
function assertJsonSafe(value, path = '$') {
  if (value === undefined) {
    throw new TypeError(`canonical: undefined is not allowed at ${path}`);
  }
  if (typeof value === 'function' || typeof value === 'symbol') {
    throw new TypeError(`canonical: ${typeof value} is not allowed at ${path}`);
  }
  if (typeof value === 'bigint') {
    throw new TypeError(`canonical: bigint is not allowed at ${path}`);
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`canonical: non-finite number at ${path}`);
    }
  }
  if (value !== null && typeof value === 'object') {
    if (Array.isArray(value)) {
      value.forEach((item, i) => assertJsonSafe(item, `${path}[${i}]`));
      return;
    }
    if (!isPlainObject(value)) {
      throw new TypeError(
        `canonical: only plain objects and arrays are allowed at ${path} (got ${Object.prototype.toString.call(value)})`
      );
    }
    for (const [k, v] of Object.entries(value)) {
      // JSON omits undefined object values; JCS input should not include them.
      if (v === undefined) {
        throw new TypeError(`canonical: undefined property value at ${path}.${k}`);
      }
      assertJsonSafe(v, `${path}.${k}`);
    }
  }
}

/**
 * Produce the canonical JSON string (RFC 8785 / JCS style).
 * @param {unknown} value
 * @returns {string}
 */
export function canonicalize(value) {
  assertJsonSafe(value);
  return canonicalizeInternal(value);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function canonicalizeInternal(value) {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    // JSON.stringify uses ECMAScript NumberToString — required by JCS for numbers.
    return JSON.stringify(value);
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    let out = '[';
    for (let i = 0; i < value.length; i++) {
      if (i > 0) out += ',';
      // JSON arrays may contain null; undefined is invalid (caught earlier).
      out += canonicalizeInternal(value[i]);
    }
    out += ']';
    return out;
  }
  // plain object — sort keys by UTF-16 code unit order (JS string <)
  const keys = Object.keys(value).sort();
  if (keys.length === 0) return '{}';
  let out = '{';
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (i > 0) out += ',';
    out += JSON.stringify(k);
    out += ':';
    out += canonicalizeInternal(/** @type {Record<string, unknown>} */ (value)[k]);
  }
  out += '}';
  return out;
}

/**
 * Canonical UTF-8 bytes (for hashing/signing in later milestones).
 * @param {unknown} value
 * @returns {Uint8Array}
 */
export function canonicalizeToBytes(value) {
  const s = canonicalize(value);
  return new TextEncoder().encode(s);
}

/**
 * Encoding metadata for verifier profiles / signed payloads.
 * @returns {{ encoding: string, description: string }}
 */
export function canonicalEncodingInfo() {
  return {
    encoding: CANONICAL_ENCODING_ID,
    description:
      'JSON Canonicalization Scheme (RFC 8785) style: sorted object keys, no insignificant whitespace, ECMAScript JSON number/string forms',
  };
}
