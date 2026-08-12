/**
 * SCCB v1 — non-secret audit receipts.
 * Never record credential values, private keys, seeds, passwords, or tokens.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { redactForAudit } from '../redaction.js';
import { SCCB_VERSION } from '../types.js';

/**
 * @typedef {object} AuditReceipt
 * @property {string} schema
 * @property {string} sccb_version
 * @property {string} evidence_id
 * @property {string} request_id
 * @property {string} timestamp
 * @property {string} actor
 * @property {string} capability_id
 * @property {string} operation
 * @property {string} policy_class
 * @property {string} policy_decision
 * @property {string} policy_reason
 * @property {string} approval_state
 * @property {string|null} approval_id
 * @property {string} execution_state
 * @property {string|null} result
 * @property {string} params_hash
 * @property {unknown} [params_redacted]
 * @property {boolean} secret_exposed_to_llm
 * @property {string[]} evidence_refs
 * @property {object} [extra]
 */

/**
 * @param {object} input
 * @returns {AuditReceipt}
 */
export function buildReceipt(input) {
  const evidence_id = input.evidence_id ?? `sccb-${randomUUID()}`;
  const request_id = input.request_id ?? randomUUID();
  /** @type {AuditReceipt} */
  const receipt = {
    schema: 'sccb.audit_receipt.v1',
    sccb_version: SCCB_VERSION,
    evidence_id,
    request_id,
    timestamp: input.timestamp ?? new Date().toISOString(),
    actor: String(input.actor ?? 'unknown'),
    capability_id: String(input.capability_id ?? ''),
    operation: String(input.operation ?? ''),
    policy_class: String(input.policy_class ?? ''),
    policy_decision: String(input.policy_decision ?? ''),
    policy_reason: String(input.policy_reason ?? ''),
    approval_state: String(input.approval_state ?? ''),
    approval_id: input.approval_id ?? null,
    execution_state: String(input.execution_state ?? 'NOT_STARTED'),
    result: input.result != null ? String(input.result) : null,
    params_hash: String(input.params_hash ?? ''),
    params_redacted: input.params
      ? redactForAudit(input.params)
      : input.params_redacted ?? undefined,
    secret_exposed_to_llm: false,
    evidence_refs: Array.isArray(input.evidence_refs) ? [...input.evidence_refs] : [],
    extra: input.extra ? redactForAudit(input.extra) : undefined,
  };

  // Defense in depth: ensure no secret-like keys slipped in
  return /** @type {AuditReceipt} */ (redactForAudit(receipt));
}

/**
 * Write receipt to directory. Returns path.
 * @param {string} dir
 * @param {AuditReceipt} receipt
 */
export async function writeReceipt(dir, receipt) {
  await fs.mkdir(dir, { recursive: true });
  const safe = buildReceipt(receipt);
  const fname = `${safe.timestamp.replace(/[:.]/g, '')}-${safe.capability_id.replace(/[^a-zA-Z0-9._-]/g, '_')}-${safe.evidence_id.slice(0, 8)}.json`;
  const full = path.join(dir, fname);
  await fs.writeFile(full, JSON.stringify(safe, null, 2) + '\n', { mode: 0o644 });
  return full;
}

/**
 * Verify receipt contains no obvious secret material.
 * @param {object} receipt
 * @returns {{ ok: boolean, issues: string[] }}
 */
export function verifyReceiptSafety(receipt) {
  const issues = [];
  const json = JSON.stringify(receipt);
  if (/BEGIN [A-Z ]*PRIVATE KEY/.test(json)) {
    issues.push('contains private key block');
  }
  if (/"password"\s*:\s*"[^"]+"/i.test(json) && !/"password"\s*:\s*"\[REDACTED\]"/.test(json)) {
    issues.push('contains password field value');
  }
  if (/"api_key"\s*:\s*"[^"\[]+/i.test(json)) {
    issues.push('contains api_key value');
  }
  if (/"private_key"\s*:\s*"[^"\[]+/i.test(json)) {
    issues.push('contains private_key value');
  }
  if (/"seed_phrase"\s*:\s*"/i.test(json) || /"mnemonic"\s*:\s*"/i.test(json)) {
    issues.push('contains seed/mnemonic');
  }
  if (receipt.secret_exposed_to_llm === true) {
    issues.push('secret_exposed_to_llm must be false');
  }
  return { ok: issues.length === 0, issues };
}

/**
 * Idempotency key from request identity.
 * @param {string} capabilityId
 * @param {string} operation
 * @param {string} paramsHash
 * @param {string} [idempotencyKey]
 */
export function computeIdempotencyKey(capabilityId, operation, paramsHash, idempotencyKey) {
  if (idempotencyKey) {
    return createHash('sha256')
      .update(`${capabilityId}|${operation}|${String(idempotencyKey)}`)
      .digest('hex')
      .slice(0, 32);
  }
  return createHash('sha256')
    .update(`${capabilityId}|${operation}|${paramsHash}`)
    .digest('hex')
    .slice(0, 32);
}
