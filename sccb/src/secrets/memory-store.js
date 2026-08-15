/**
 * SCCB v1 — in-memory secret store for tests and local dry-runs.
 * Never used for production real credentials.
 */

import { SecretStore, assertCredentialMeta, createCredentialMeta } from './store.js';
import { CREDENTIAL_STATUS, ENVIRONMENT } from '../types.js';

export class MemorySecretStore extends SecretStore {
  /**
   * @param {{ environment?: string }} [opts]
   */
  constructor(opts = {}) {
    super();
    /** @type {Map<string, import('./store.js').CredentialMeta>} */
    this._meta = new Map();
    /** @type {Map<string, Record<string, string>>} */
    this._secrets = new Map();
    this.defaultEnvironment = opts.environment ?? ENVIRONMENT.TEST;
  }

  async listMetadata() {
    return [...this._meta.values()].map((m) => ({ ...m, env_names: [...m.env_names], scopes: [...m.scopes] }));
  }

  async getMetadata(credentialId) {
    const m = this._meta.get(credentialId);
    return m ? { ...m, env_names: [...m.env_names], scopes: [...m.scopes] } : null;
  }

  async putMetadata(meta) {
    assertCredentialMeta(meta);
    const copy = { ...meta, env_names: [...meta.env_names], scopes: [...(meta.scopes || [])] };
    this._meta.set(meta.id, copy);
    return { ...copy };
  }

  /**
   * Store test/fixture secrets only. Do not use with real production secrets.
   * @param {string} credentialId
   * @param {Record<string, string>} envMap
   */
  async storeSecret(credentialId, envMap) {
    if (!this._meta.has(credentialId)) {
      throw new Error(`cannot store secret: unknown credential metadata: ${credentialId}`);
    }
    if (typeof envMap !== 'object' || envMap == null) {
      throw new Error('envMap must be an object');
    }
    /** @type {Record<string, string>} */
    const copy = {};
    for (const [k, v] of Object.entries(envMap)) {
      if (typeof v !== 'string') throw new Error(`secret env value must be string: ${k}`);
      copy[k] = v;
    }
    this._secrets.set(credentialId, copy);
    const meta = this._meta.get(credentialId);
    meta.status = CREDENTIAL_STATUS.ACTIVE;
    meta.last_validated_utc = new Date().toISOString();
  }

  async loadForInject(credentialId) {
    const meta = this._meta.get(credentialId);
    if (!meta) throw new Error(`credential not found: ${credentialId}`);
    if (meta.status === CREDENTIAL_STATUS.REVOKED) {
      throw new Error(`credential revoked: ${credentialId}`);
    }
    if (meta.status === CREDENTIAL_STATUS.DISABLED) {
      throw new Error(`credential disabled: ${credentialId}`);
    }
    if (meta.status === CREDENTIAL_STATUS.EXPIRED) {
      throw new Error(`credential expired: ${credentialId}`);
    }
    const env = this._secrets.get(credentialId);
    if (!env) throw new Error(`secret material missing: ${credentialId}`);
    return { env: { ...env } };
  }

  async setStatus(credentialId, status) {
    const meta = this._meta.get(credentialId);
    if (!meta) throw new Error(`credential not found: ${credentialId}`);
    meta.status = status;
    if (status === CREDENTIAL_STATUS.REVOKED || status === CREDENTIAL_STATUS.DISABLED) {
      meta.revoked_utc = new Date().toISOString();
      // Drop secret material on revoke for safety in tests
      if (status === CREDENTIAL_STATUS.REVOKED) {
        this._secrets.delete(credentialId);
      }
    }
    return this.getMetadata(credentialId);
  }

  async isUsable(credentialId) {
    const meta = await this.getMetadata(credentialId);
    if (!meta || meta.status !== CREDENTIAL_STATUS.ACTIVE) return false;
    return this._secrets.has(credentialId);
  }

  /**
   * Helper: register metadata + fixture secret in one step (tests only).
   * @param {Partial<import('./store.js').CredentialMeta> & { id: string, provider: string }} metaPartial
   * @param {Record<string, string>} envMap
   */
  async provisionFixture(metaPartial, envMap) {
    const meta = createCredentialMeta({
      ...metaPartial,
      environment: metaPartial.environment ?? this.defaultEnvironment,
      status: CREDENTIAL_STATUS.UNKNOWN,
    });
    await this.putMetadata(meta);
    await this.storeSecret(meta.id, envMap);
    return this.getMetadata(meta.id);
  }
}
