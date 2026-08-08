/**
 * SCCB v1 — machine-verifiable authorization state.
 *
 * Chat phrases (e.g. "GO SCCB_BUILD") and agent always-approve modes are NOT
 * authorization. Gated phases require status AUTHORIZED in the sealed
 * authority-state file (committed or operator-local).
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_AUTHORITY_PATH = path.resolve(
  __dirname,
  '../../config/authority-state.v1.json'
);

/** Phases that gate high-risk actions */
export const GATED_PHASES = Object.freeze([
  'credential_bootstrap',
  'wallet_signing',
  'wallet_broadcast',
  'pi_activation',
  'economics_unlock',
  'production_deploy_via_sccb',
]);

export const PHASE_STATUS = Object.freeze({
  AUTHORIZED: 'AUTHORIZED',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  REVOKED: 'REVOKED',
});

/**
 * @typedef {object} PhaseRecord
 * @property {string} status
 * @property {string|null} source
 * @property {string|null} ref
 * @property {string|null} authorized_utc
 * @property {string} [notes]
 */

/**
 * @typedef {object} AuthorityState
 * @property {string} schema
 * @property {number} version
 * @property {Record<string, PhaseRecord>} phases
 * @property {Record<string, boolean>} rules
 * @property {string} [updated_utc]
 */

/**
 * @param {string} [filePath]
 * @returns {Promise<AuthorityState>}
 */
export async function loadAuthorityState(filePath = DEFAULT_AUTHORITY_PATH) {
  const raw = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (data.schema !== 'sccb.authority_state.v1') {
    throw new Error(`invalid authority schema: ${data.schema}`);
  }
  if (!data.phases || typeof data.phases !== 'object') {
    throw new Error('authority state missing phases');
  }
  return data;
}

/**
 * Content hash for evidence binding (file integrity).
 * @param {string} [filePath]
 */
export async function authorityStateHash(filePath = DEFAULT_AUTHORITY_PATH) {
  const raw = await fs.readFile(filePath, 'utf8');
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * @param {AuthorityState} state
 * @param {string} phase
 * @returns {boolean}
 */
export function isPhaseAuthorized(state, phase) {
  const rec = state.phases?.[phase];
  return rec?.status === PHASE_STATUS.AUTHORIZED;
}

/**
 * Assert a gated phase is authorized. Throws if not.
 * Does NOT accept chat GO strings as proof — only sealed state.
 *
 * @param {AuthorityState} state
 * @param {string} phase
 * @param {{ chat_go_claim?: string }} [opts]
 */
export function assertPhaseAuthorized(state, phase, opts = {}) {
  if (opts.chat_go_claim) {
    // Explicitly ignore chat claims — document denial reason if phase not sealed
  }
  if (!isPhaseAuthorized(state, phase)) {
    const rec = state.phases?.[phase];
    const err = new Error(
      `SCCB phase not authorized in sealed authority state: ${phase}` +
        (rec?.status ? ` (status=${rec.status})` : ' (missing)') +
        '. Chat GO phrases and always-approve are not authorization.'
    );
    err.code = 'SCCB_PHASE_NOT_AUTHORIZED';
    err.phase = phase;
    err.phase_status = rec?.status ?? null;
    throw err;
  }
  return true;
}

/**
 * Summary safe for agent/operator display (no secrets).
 * @param {AuthorityState} state
 * @param {string} [hash]
 */
export function projectAuthoritySummary(state, hash = null) {
  /** @type {Record<string, string>} */
  const phases = {};
  for (const [k, v] of Object.entries(state.phases || {})) {
    phases[k] = v.status;
  }
  return {
    schema: state.schema,
    version: state.version,
    phases,
    rules: { ...state.rules },
    authority_file_sha256: hash,
    note: 'Machine-verifiable only. GO chat text is not authorization.',
  };
}

/**
 * Whether credential bootstrap (real secret intake) is allowed.
 * @param {AuthorityState} state
 */
export function mayBootstrapCredentials(state) {
  return isPhaseAuthorized(state, 'credential_bootstrap');
}

/**
 * Whether wallet signing is allowed by authority plane (policy still must allow).
 * @param {AuthorityState} state
 */
export function maySignWallet(state) {
  return isPhaseAuthorized(state, 'wallet_signing');
}
