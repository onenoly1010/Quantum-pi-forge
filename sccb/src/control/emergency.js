/**
 * SCCB v1 — revocation, pause, and emergency stop control plane.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CAPABILITY_STATUS, CREDENTIAL_STATUS } from '../types.js';

/**
 * @typedef {object} ControlState
 * @property {boolean} emergency_stop
 * @property {boolean} global_pause
 * @property {string[]} paused_capabilities
 * @property {string[]} revoked_capabilities
 * @property {string|null} emergency_reason
 * @property {string|null} emergency_set_utc
 * @property {string|null} updated_utc
 */

/** @returns {ControlState} */
export function defaultControlState() {
  return {
    emergency_stop: false,
    global_pause: false,
    paused_capabilities: [],
    revoked_capabilities: [],
    emergency_reason: null,
    emergency_set_utc: null,
    updated_utc: null,
  };
}

export class ControlPlane {
  /**
   * @param {{ statePath?: string, memoryOnly?: boolean }} [opts]
   */
  constructor(opts = {}) {
    this.statePath = opts.statePath ?? null;
    this.memoryOnly = opts.memoryOnly ?? !opts.statePath;
    /** @type {ControlState} */
    this.state = defaultControlState();
  }

  async load() {
    if (this.memoryOnly || !this.statePath) return this.state;
    try {
      const raw = await fs.readFile(this.statePath, 'utf8');
      const data = JSON.parse(raw);
      this.state = { ...defaultControlState(), ...data };
      this.state.paused_capabilities = [...(data.paused_capabilities ?? [])];
      this.state.revoked_capabilities = [...(data.revoked_capabilities ?? [])];
    } catch (err) {
      if (err && err.code !== 'ENOENT') throw err;
    }
    return this.snapshot();
  }

  async save() {
    this.state.updated_utc = new Date().toISOString();
    if (this.memoryOnly || !this.statePath) return;
    await fs.mkdir(path.dirname(this.statePath), { recursive: true });
    await fs.writeFile(
      this.statePath,
      JSON.stringify(
        {
          schema: 'sccb.control.v1',
          note: 'Control plane — no secrets',
          ...this.state,
        },
        null,
        2
      ) + '\n',
      { mode: 0o600 }
    );
  }

  snapshot() {
    return {
      ...this.state,
      paused_capabilities: [...this.state.paused_capabilities],
      revoked_capabilities: [...this.state.revoked_capabilities],
    };
  }

  /** Policy context fragment */
  asPolicyControl() {
    return {
      emergency_stop: this.state.emergency_stop,
      global_pause: this.state.global_pause,
      paused_capabilities: [
        ...this.state.paused_capabilities,
        ...this.state.revoked_capabilities,
      ],
    };
  }

  async emergencyStop(reason = 'operator emergency stop') {
    this.state.emergency_stop = true;
    this.state.global_pause = true;
    this.state.emergency_reason = reason;
    this.state.emergency_set_utc = new Date().toISOString();
    await this.save();
    return this.snapshot();
  }

  /**
   * Clear emergency stop. Does not auto-resume revoked capabilities.
   * Recovery requires explicit clear + optional unpause.
   */
  async clearEmergencyStop({ resume_global = false } = {}) {
    this.state.emergency_stop = false;
    this.state.emergency_reason = null;
    this.state.emergency_set_utc = null;
    if (resume_global) this.state.global_pause = false;
    await this.save();
    return this.snapshot();
  }

  async setGlobalPause(paused) {
    this.state.global_pause = !!paused;
    await this.save();
    return this.snapshot();
  }

  async pauseCapability(capabilityId) {
    if (!this.state.paused_capabilities.includes(capabilityId)) {
      this.state.paused_capabilities.push(capabilityId);
    }
    await this.save();
    return this.snapshot();
  }

  async unpauseCapability(capabilityId) {
    this.state.paused_capabilities = this.state.paused_capabilities.filter(
      (id) => id !== capabilityId
    );
    await this.save();
    return this.snapshot();
  }

  /**
   * Revoke capability in control plane + registry if provided.
   * @param {string} capabilityId
   * @param {import('../capabilities/registry.js').CapabilityRegistry|null} [registry]
   */
  async revokeCapability(capabilityId, registry = null) {
    if (!this.state.revoked_capabilities.includes(capabilityId)) {
      this.state.revoked_capabilities.push(capabilityId);
    }
    this.state.paused_capabilities = this.state.paused_capabilities.filter(
      (id) => id !== capabilityId
    );
    if (registry) {
      try {
        registry.setStatus(capabilityId, CAPABILITY_STATUS.REVOKED);
      } catch {
        /* registry may not have it */
      }
    }
    await this.save();
    return this.snapshot();
  }

  /**
   * @param {string} credentialId
   * @param {import('../secrets/store.js').SecretStore} secretStore
   * @param {'revoked'|'disabled'} status
   */
  async revokeCredential(credentialId, secretStore, status = CREDENTIAL_STATUS.REVOKED) {
    return secretStore.setStatus(credentialId, status);
  }
}

/**
 * Operator recovery procedure text (also in docs).
 */
export const RECOVERY_PROCEDURE = `
SCCB Emergency Recovery Procedure
=================================

1. Confirm incident scope (which capability/credential/environment).
2. If active compromise: run emergency stop immediately.
   $ node sccb/src/cli.js emergency-stop --reason "..."
3. Revoke compromised provider tokens at the provider dashboard (CF, GitHub, etc.).
4. Mark credentials revoked in SCCB metadata:
   $ node sccb/src/cli.js credential-revoke --id <credential-id>
5. Revoke or pause affected capabilities:
   $ node sccb/src/cli.js capability-revoke --id <capability-id>
6. Rotate secrets via local terminal only (pass insert / provider UI) — NEVER chat.
7. Clear emergency stop only after rotation verified:
   $ node sccb/src/cli.js emergency-clear --resume-global
8. Re-validate connectivity with non-destructive capability (e.g. cloudflare.pages.read).
9. Write non-secret incident receipt under receipts/sccb/.
10. Do not re-enable wallet.sign_transaction or economic capabilities without separate GO.
`.trim();
