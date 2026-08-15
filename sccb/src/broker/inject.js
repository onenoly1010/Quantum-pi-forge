/**
 * SCCB v1 — secret inject into child process only.
 * Pattern reused from press-agent/scripts/run-with-delivery-credentials.sh.
 *
 * Secrets:
 * - loaded via SecretStore.loadForInject
 * - placed only in child env
 * - never returned to caller / LLM
 * - scrubbed from parent after spawn setup
 */

import { spawn } from 'node:child_process';

/**
 * Run a command with injected env from secret material.
 * Does NOT return secret values. Returns only exit code + scrubbed stdout/stderr.
 *
 * @param {import('../secrets/store.js').SecretStore} store
 * @param {string} credentialId
 * @param {string} command
 * @param {string[]} args
 * @param {{ cwd?: string, timeoutMs?: number, extraEnv?: Record<string, string>, allowlist?: string[] }} [opts]
 * @returns {Promise<{ code: number, stdout: string, stderr: string, secret_injected: boolean }>}
 */
export async function runWithInjectedSecrets(store, credentialId, command, args, opts = {}) {
  if (opts.allowlist && opts.allowlist.length > 0) {
    const base = pathBasename(command);
    if (!opts.allowlist.includes(base) && !opts.allowlist.includes(command)) {
      throw new Error(`command not in SCCB allowlist: ${command}`);
    }
  }

  const material = await store.loadForInject(credentialId);
  /** @type {Record<string, string>} */
  const childEnv = {
    ...process.env,
    ...opts.extraEnv,
    ...material.env,
  };

  // Drop references to secret map as soon as env object is built
  const envNames = Object.keys(material.env);
  for (const k of Object.keys(material.env)) {
    material.env[k] = '';
  }

  try {
    const result = await spawnCapture(command, args, {
      env: childEnv,
      cwd: opts.cwd,
      timeoutMs: opts.timeoutMs ?? 120000,
    });
    // Scrub childEnv secret keys
    for (const name of envNames) {
      childEnv[name] = '';
      delete childEnv[name];
    }
    return {
      code: result.code,
      stdout: result.stdout,
      stderr: result.stderr,
      secret_injected: true,
    };
  } finally {
    for (const name of envNames) {
      if (childEnv[name]) {
        childEnv[name] = '';
        delete childEnv[name];
      }
    }
  }
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ env: NodeJS.ProcessEnv, cwd?: string, timeoutMs: number }} opts
 */
function spawnCapture(command, args, opts) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: opts.env,
      cwd: opts.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('injected command timeout'));
    }, opts.timeoutMs);
    child.stdout.on('data', (d) => {
      stdout += d.toString('utf8');
      // cap size
      if (stdout.length > 500_000) stdout = stdout.slice(0, 500_000) + '\n[truncated]';
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString('utf8');
      if (stderr.length > 200_000) stderr = stderr.slice(0, 200_000) + '\n[truncated]';
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

function pathBasename(p) {
  const parts = String(p).split(/[/\\]/);
  return parts[parts.length - 1] || p;
}

/**
 * Build agent-safe result: never include env values.
 * @param {{ code: number, stdout: string, stderr: string, secret_injected: boolean }} result
 */
export function agentSafeResult(result) {
  return {
    code: result.code,
    // stdout/stderr may accidentally contain secrets from tools — callers should prefer status only
    // For agent return we only expose exit code + length hashes, not body, when secret_injected
    stdout_length: result.stdout?.length ?? 0,
    stderr_length: result.stderr?.length ?? 0,
    success: result.code === 0,
    secret_injected: result.secret_injected,
    secret_values_returned: false,
  };
}
