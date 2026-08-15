/**
 * SCCB v1 — approval engine.
 * Records human approvals bound to params_hash (replay protection).
 * Integrates conceptually with Guardian; v1 uses local JSON store.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { APPROVAL_STATE } from '../types.js';
import { hashParams } from '../policy/engine.js';

/**
 * @typedef {object} ApprovalRecord
 * @property {string} approval_id
 * @property {string} capability_id
 * @property {string} operation
 * @property {string} actor_requesting
 * @property {string} params_hash
 * @property {string} state - APPROVED | REJECTED | PENDING
 * @property {string|null} decided_by
 * @property {string|null} reasoning
 * @property {string} created_utc
 * @property {string|null} decided_utc
 * @property {string|null} expires_utc
 * @property {boolean} used
 */

export class ApprovalEngine {
  /**
   * @param {{ storagePath?: string, memoryOnly?: boolean }} [opts]
   */
  constructor(opts = {}) {
    this.storagePath = opts.storagePath ?? null;
    this.memoryOnly = opts.memoryOnly ?? !opts.storagePath;
    /** @type {Map<string, ApprovalRecord>} */
    this._byId = new Map();
    /** @type {Map<string, string>} hash key → approval_id */
    this._byHash = new Map();
  }

  _key(capabilityId, operation, paramsHash) {
    return `${capabilityId}::${operation}::${paramsHash}`;
  }

  async load() {
    if (this.memoryOnly || !this.storagePath) return;
    try {
      const raw = await fs.readFile(this.storagePath, 'utf8');
      const data = JSON.parse(raw);
      for (const rec of data.approvals ?? []) {
        this._byId.set(rec.approval_id, rec);
        if (rec.state === APPROVAL_STATE.APPROVED && !rec.used) {
          this._byHash.set(
            this._key(rec.capability_id, rec.operation, rec.params_hash),
            rec.approval_id
          );
        }
      }
    } catch (err) {
      if (err && err.code !== 'ENOENT') throw err;
    }
  }

  async save() {
    if (this.memoryOnly || !this.storagePath) return;
    await fs.mkdir(path.dirname(this.storagePath), { recursive: true });
    const payload = {
      schema: 'sccb.approvals.v1',
      note: 'No secrets — approval metadata only',
      approvals: [...this._byId.values()],
      updated_utc: new Date().toISOString(),
    };
    await fs.writeFile(this.storagePath, JSON.stringify(payload, null, 2) + '\n', {
      mode: 0o600,
    });
  }

  /**
   * Request approval (creates PENDING record).
   * @param {{ capability_id: string, operation: string, actor: string, params?: object, reasoning?: string }} req
   * @returns {Promise<ApprovalRecord>}
   */
  async request(req) {
    const params_hash = hashParams(req.params);
    const approval_id = randomUUID();
    /** @type {ApprovalRecord} */
    const rec = {
      approval_id,
      capability_id: req.capability_id,
      operation: req.operation,
      actor_requesting: req.actor,
      params_hash,
      state: APPROVAL_STATE.PENDING,
      decided_by: null,
      reasoning: req.reasoning ?? null,
      created_utc: new Date().toISOString(),
      decided_utc: null,
      expires_utc: null,
      used: false,
    };
    this._byId.set(approval_id, rec);
    await this.save();
    return { ...rec };
  }

  /**
   * Human decision.
   * @param {string} approvalId
   * @param {'APPROVED'|'REJECTED'} state
   * @param {{ decided_by: string, reasoning?: string, ttl_seconds?: number }} opts
   */
  async decide(approvalId, state, opts) {
    const rec = this._byId.get(approvalId);
    if (!rec) throw new Error(`unknown approval: ${approvalId}`);
    if (rec.state !== APPROVAL_STATE.PENDING) {
      throw new Error(`approval already decided: ${approvalId}`);
    }
    if (state !== APPROVAL_STATE.APPROVED && state !== APPROVAL_STATE.REJECTED) {
      throw new Error('state must be APPROVED or REJECTED');
    }
    rec.state = state;
    rec.decided_by = opts.decided_by;
    rec.reasoning = opts.reasoning ?? rec.reasoning;
    rec.decided_utc = new Date().toISOString();
    if (opts.ttl_seconds && state === APPROVAL_STATE.APPROVED) {
      rec.expires_utc = new Date(Date.now() + opts.ttl_seconds * 1000).toISOString();
    }
    if (state === APPROVAL_STATE.APPROVED) {
      this._byHash.set(
        this._key(rec.capability_id, rec.operation, rec.params_hash),
        approvalId
      );
    }
    await this.save();
    return { ...rec };
  }

  /**
   * Find valid unused approval matching capability+op+params.
   * @param {string} capabilityId
   * @param {string} operation
   * @param {object} [params]
   * @returns {ApprovalRecord|null}
   */
  findValid(capabilityId, operation, params) {
    const params_hash = hashParams(params);
    const id = this._byHash.get(this._key(capabilityId, operation, params_hash));
    if (!id) return null;
    const rec = this._byId.get(id);
    if (!rec || rec.state !== APPROVAL_STATE.APPROVED || rec.used) return null;
    if (rec.expires_utc && new Date(rec.expires_utc).getTime() < Date.now()) {
      return null;
    }
    return { ...rec };
  }

  /**
   * Mark approval consumed (one-time use for high-risk ops).
   * @param {string} approvalId
   */
  async consume(approvalId) {
    const rec = this._byId.get(approvalId);
    if (!rec) throw new Error(`unknown approval: ${approvalId}`);
    rec.used = true;
    this._byHash.delete(this._key(rec.capability_id, rec.operation, rec.params_hash));
    await this.save();
    return { ...rec };
  }

  get(approvalId) {
    const rec = this._byId.get(approvalId);
    return rec ? { ...rec } : null;
  }
}
