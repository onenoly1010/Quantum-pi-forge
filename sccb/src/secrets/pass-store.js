/**
 * SCCB v1 — pass (GPG password-store) backend.
 *
 * Reuses the QPF pattern from press-agent/scripts/run-with-delivery-credentials.sh:
 * secrets loaded into child process env only; never returned to agent context.
 *
 * This module:
 * - reads/writes credential *metadata* from a JSON file (git-safe if empty of secrets)
 * - loads secrets via `pass show` only for inject
 * - never logs secret values
 *
 * Does NOT ingest Kris's real secrets during build. Bootstrap is operator-driven.
 */

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { SecretStore, assertCredentialMeta } from './store.js';
import { CREDENTIAL_STATUS } from '../types.js';

/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {{ timeoutMs?: number, input?: string }} [opts]
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
 */
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`command timeout: ${cmd}`));
    }, opts.timeoutMs ?? 15000);
    child.stdout.on('data', (d) => {
      stdout += d.toString('utf8');
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString('utf8');
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
    if (opts.input != null) {
      child.stdin.write(opts.input);
      child.stdin.end();
    } else {
      child.stdin.end();
    }
  });
}

export class PassSecretStore extends SecretStore {
  /**
   * @param {{ metadataPath: string, passAvailable?: boolean }} opts
   */
  constructor(opts) {
    super();
    if (!opts?.metadataPath) throw new Error('PassSecretStore requires metadataPath');
    this.metadataPath = opts.metadataPath;
    this._passChecked = opts.passAvailable;
  }

  async _ensurePass() {
    if (this._passChecked === true) return;
    if (this._passChecked === false) {
      throw new Error('pass is not available on this host');
    }
    try {
      const r = await run('pass', ['version'], { timeoutMs: 5000 });
      this._passChecked = r.code === 0;
    } catch {
      this._passChecked = false;
    }
    if (!this._passChecked) {
      throw new Error('The approved local credential store (pass) is not available.');
    }
  }

  async _loadAllMeta() {
    try {
      const raw = await fs.readFile(this.metadataPath, 'utf8');
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.credentials)) return [];
      return data.credentials;
    } catch (err) {
      if (err && err.code === 'ENOENT') return [];
      throw err;
    }
  }

  async _saveAllMeta(list) {
    await fs.mkdir(path.dirname(this.metadataPath), { recursive: true });
    const payload = {
      schema: 'sccb.credential_metadata.v1',
      note: 'Metadata only — never store secret values in this file',
      credentials: list,
      updated_utc: new Date().toISOString(),
    };
    await fs.writeFile(this.metadataPath, JSON.stringify(payload, null, 2) + '\n', {
      mode: 0o600,
    });
  }

  async listMetadata() {
    const list = await this._loadAllMeta();
    return list.map((m) => ({ ...m }));
  }

  async getMetadata(credentialId) {
    const list = await this._loadAllMeta();
    const m = list.find((c) => c.id === credentialId);
    return m ? { ...m } : null;
  }

  async putMetadata(meta) {
    assertCredentialMeta(meta);
    const list = await this._loadAllMeta();
    const idx = list.findIndex((c) => c.id === meta.id);
    const copy = { ...meta };
    if (idx >= 0) list[idx] = copy;
    else list.push(copy);
    await this._saveAllMeta(list);
    return { ...copy };
  }

  /**
   * Production intake: operator uses `pass insert` outside agent context.
   * This method only records that metadata exists; it does not accept secret
   * values from agent prompts. Use storeSecret only in controlled bootstrap CLI
   * with --from-pass confirmation that entry already exists in pass.
   */
  async storeSecret(_credentialId, _envMap) {
    throw new Error(
      'PassSecretStore.storeSecret refuses agent-supplied secret material. ' +
        'Operator must use: pass insert <path> (local terminal), then sccb bootstrap register-metadata.'
    );
  }

  /**
   * Verify pass entry exists (non-empty first line) without returning value to caller as success boolean.
   * Used by bootstrap validation — does not return secret.
   * @param {string} passPath
   * @returns {Promise<boolean>}
   */
  async passEntryExists(passPath) {
    await this._ensurePass();
    const r = await run('pass', ['show', passPath], { timeoutMs: 10000 });
    if (r.code !== 0) return false;
    const first = r.stdout.split('\n')[0] ?? '';
    // Do not retain value; only presence
    return first.trim().length > 0;
  }

  async loadForInject(credentialId) {
    await this._ensurePass();
    const meta = await this.getMetadata(credentialId);
    if (!meta) throw new Error(`credential not found: ${credentialId}`);
    if (meta.status === CREDENTIAL_STATUS.REVOKED) {
      throw new Error(`credential revoked: ${credentialId}`);
    }
    if (meta.status === CREDENTIAL_STATUS.DISABLED) {
      throw new Error(`credential disabled: ${credentialId}`);
    }

    /** @type {Record<string, string>} */
    const env = {};
    // Convention: multi-env credentials use pass_path as prefix + /ENV_NAME
    // Single-value: pass_path maps to first env_names entry
    if (meta.env_names.length === 1) {
      const r = await run('pass', ['show', meta.pass_path], { timeoutMs: 10000 });
      if (r.code !== 0) {
        throw new Error(`pass show failed for credential ${credentialId} (exit ${r.code})`);
      }
      const value = (r.stdout.split('\n')[0] ?? '').trim();
      if (!value) throw new Error(`empty pass entry for ${credentialId}`);
      env[meta.env_names[0]] = value;
    } else {
      for (const name of meta.env_names) {
        const entry = `${meta.pass_path}/${name}`;
        const r = await run('pass', ['show', entry], { timeoutMs: 10000 });
        if (r.code !== 0) {
          throw new Error(`pass show failed for ${credentialId}/${name}`);
        }
        const value = (r.stdout.split('\n')[0] ?? '').trim();
        if (!value) throw new Error(`empty pass entry for ${credentialId}/${name}`);
        env[name] = value;
      }
    }
    return { env };
  }

  async setStatus(credentialId, status) {
    const list = await this._loadAllMeta();
    const idx = list.findIndex((c) => c.id === credentialId);
    if (idx < 0) throw new Error(`credential not found: ${credentialId}`);
    list[idx] = {
      ...list[idx],
      status,
      revoked_utc:
        status === CREDENTIAL_STATUS.REVOKED || status === CREDENTIAL_STATUS.DISABLED
          ? new Date().toISOString()
          : list[idx].revoked_utc ?? null,
    };
    await this._saveAllMeta(list);
    return { ...list[idx] };
  }

  async isUsable(credentialId) {
    const meta = await this.getMetadata(credentialId);
    if (!meta || meta.status !== CREDENTIAL_STATUS.ACTIVE) return false;
    try {
      if (meta.env_names.length === 1) {
        return await this.passEntryExists(meta.pass_path);
      }
      for (const name of meta.env_names) {
        const ok = await this.passEntryExists(`${meta.pass_path}/${name}`);
        if (!ok) return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}
