/**
 * SCCB v1 — SecretStore abstraction.
 *
 * Secrets:
 * - never appear in normal agent prompts
 * - never appear in logs (callers must use redaction)
 * - never enter Git (metadata only is git-safe)
 * - never appear in evidence receipts
 *
 * Implementations expose values only to inject-into-child-env paths.
 */

import { CREDENTIAL_STATUS, ENVIRONMENT } from '../types.js';

/**
 * @typedef {object} CredentialMeta
 * @property {string} id - Stable credential id (e.g. cf-api-token-dev)
 * @property {string} provider - e.g. cloudflare, github
 * @property {string} label - Human label without secret
 * @property {string} pass_path - pass store path (or logical path for memory)
 * @property {string[]} env_names - Env var names this credential maps to
 * @property {string} environment - development | test | production
 * @property {string} status - active | revoked | disabled | expired | unknown
 * @property {string[]} scopes - Declared scopes (metadata only)
 * @property {string|null} last_validated_utc
 * @property {string} created_utc
 * @property {string|null} revoked_utc
 * @property {string} [notes]
 */

/**
 * @typedef {object} SecretMaterial
 * Opaque; only for inject path. Never serialize to receipts.
 * @property {Record<string, string>} env - env name → value
 */

/**
 * Abstract secret store interface.
 * Subclasses implement backend-specific storage.
 */
export class SecretStore {
  /**
   * List credential metadata only (no secret values).
   * @returns {Promise<CredentialMeta[]>}
   */
  async listMetadata() {
    throw new Error('SecretStore.listMetadata not implemented');
  }

  /**
   * Get metadata for one credential. Never returns secret value.
   * @param {string} credentialId
   * @returns {Promise<CredentialMeta|null>}
   */
  async getMetadata(credentialId) {
    throw new Error('SecretStore.getMetadata not implemented');
  }

  /**
   * Register metadata for a credential (value stored separately by backend).
   * @param {CredentialMeta} meta
   * @returns {Promise<CredentialMeta>}
   */
  async putMetadata(meta) {
    throw new Error('SecretStore.putMetadata not implemented');
  }

  /**
   * Load secret material for inject ONLY. Callers must not log or return this.
   * @param {string} credentialId
   * @returns {Promise<SecretMaterial>}
   */
  async loadForInject(credentialId) {
    throw new Error('SecretStore.loadForInject not implemented');
  }

  /**
   * Store secret material (bootstrap / rotation). Test/dev only unless pass backend.
   * @param {string} credentialId
   * @param {Record<string, string>} envMap
   * @returns {Promise<void>}
   */
  async storeSecret(credentialId, envMap) {
    throw new Error('SecretStore.storeSecret not implemented');
  }

  /**
   * Mark credential revoked/disabled. Does not necessarily delete backend entry.
   * @param {string} credentialId
   * @param {'revoked'|'disabled'} status
   * @returns {Promise<CredentialMeta>}
   */
  async setStatus(credentialId, status) {
    throw new Error('SecretStore.setStatus not implemented');
  }

  /**
   * Whether secret values can be loaded (credential active + present).
   * @param {string} credentialId
   * @returns {Promise<boolean>}
   */
  async isUsable(credentialId) {
    const meta = await this.getMetadata(credentialId);
    if (!meta) return false;
    if (meta.status !== CREDENTIAL_STATUS.ACTIVE) return false;
    return true;
  }
}

/**
 * Validate metadata shape (no secret fields allowed).
 * @param {CredentialMeta} meta
 */
export function assertCredentialMeta(meta) {
  if (!meta || typeof meta !== 'object') {
    throw new Error('credential metadata must be an object');
  }
  const required = ['id', 'provider', 'label', 'pass_path', 'env_names', 'environment', 'status'];
  for (const k of required) {
    if (meta[k] == null) throw new Error(`credential metadata missing: ${k}`);
  }
  if (!Array.isArray(meta.env_names)) {
    throw new Error('env_names must be an array');
  }
  const envs = Object.values(ENVIRONMENT);
  if (!envs.includes(meta.environment)) {
    throw new Error(`invalid environment: ${meta.environment}`);
  }
  // Reject accidental secret material in metadata
  for (const key of Object.keys(meta)) {
    if (/value|secret|password|token|key_material|seed/i.test(key) && key !== 'pass_path') {
      if (typeof meta[key] === 'string' && meta[key].length > 0 && key !== 'label' && key !== 'notes' && key !== 'provider' && key !== 'id' && key !== 'pass_path' && key !== 'status' && key !== 'environment' && key !== 'created_utc' && key !== 'last_validated_utc' && key !== 'revoked_utc') {
        // allow standard meta keys only
      }
    }
  }
  const forbiddenKeys = ['secret', 'password', 'private_key', 'seed', 'token', 'api_key', 'value', 'plaintext'];
  for (const fk of forbiddenKeys) {
    if (Object.prototype.hasOwnProperty.call(meta, fk)) {
      throw new Error(`credential metadata must not include field: ${fk}`);
    }
  }
}

/**
 * Create empty metadata template.
 * @param {Partial<CredentialMeta> & { id: string, provider: string }} partial
 * @returns {CredentialMeta}
 */
export function createCredentialMeta(partial) {
  const forbiddenKeys = [
    'secret',
    'password',
    'private_key',
    'seed',
    'token',
    'api_key',
    'value',
    'plaintext',
    'seed_phrase',
    'mnemonic',
  ];
  for (const fk of forbiddenKeys) {
    if (Object.prototype.hasOwnProperty.call(partial, fk)) {
      throw new Error(`credential metadata must not include field: ${fk}`);
    }
  }
  const now = new Date().toISOString();
  /** @type {CredentialMeta} */
  const meta = {
    id: partial.id,
    provider: partial.provider,
    label: partial.label ?? partial.id,
    pass_path: partial.pass_path ?? `qpf/sccb/${partial.provider}/${partial.id}`,
    env_names: partial.env_names ?? [],
    environment: partial.environment ?? ENVIRONMENT.DEVELOPMENT,
    status: partial.status ?? CREDENTIAL_STATUS.UNKNOWN,
    scopes: partial.scopes ?? [],
    last_validated_utc: partial.last_validated_utc ?? null,
    created_utc: partial.created_utc ?? now,
    revoked_utc: partial.revoked_utc ?? null,
    notes: partial.notes,
  };
  assertCredentialMeta(meta);
  return meta;
}
