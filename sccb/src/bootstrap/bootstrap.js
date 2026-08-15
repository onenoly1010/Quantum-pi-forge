/**
 * SCCB v1 — one-time credential bootstrap framework.
 *
 * Human authorizes once. SCCB:
 * - discovers required credentials
 * - classifies them
 * - securely stores them (operator uses pass; never agent paste)
 * - validates configuration
 * - associates credentials with capabilities
 * - verifies connectivity (optional, non-secret)
 * - records non-secret evidence
 *
 * NEVER dumps secret values into agent context or logs.
 */

import { createCredentialMeta } from '../secrets/store.js';
import { CREDENTIAL_STATUS, ENVIRONMENT } from '../types.js';
import { buildReceipt, writeReceipt } from '../audit/receipt.js';
import { redactForAudit } from '../redaction.js';
import { toLegacyCatalogEntries } from './catalog.js';

/**
 * Catalog of known credential slots for QPF/OINIO (metadata templates only).
 * Full design fields: sccb/src/bootstrap/catalog.js
 */
export const CREDENTIAL_CATALOG = toLegacyCatalogEntries();

/**
 * Discover credentials required by active capabilities.
 * @param {import('../capabilities/registry.js').CapabilityRegistry} registry
 */
export function discoverRequiredCredentials(registry) {
  const needed = new Map();
  for (const cap of registry.list()) {
    if (!cap.credential_dependency) continue;
    const catalog = CREDENTIAL_CATALOG.find((c) => c.id === cap.credential_dependency);
    needed.set(cap.credential_dependency, {
      credential_id: cap.credential_dependency,
      required_by: [
        ...(needed.get(cap.credential_dependency)?.required_by ?? []),
        cap.id,
      ],
      catalog: catalog
        ? {
            id: catalog.id,
            provider: catalog.provider,
            label: catalog.label,
            pass_path: catalog.pass_path,
            env_names: catalog.env_names,
            scopes: catalog.scopes,
          }
        : null,
    });
  }
  return [...needed.values()];
}

/**
 * Classify environment for a credential slot.
 * @param {string} environment
 */
export function classifyEnvironment(environment) {
  const envs = Object.values(ENVIRONMENT);
  if (!envs.includes(environment)) {
    throw new Error(`invalid environment class: ${environment}`);
  }
  return environment;
}

/**
 * Bootstrap plan (no secrets). Operator executes pass inserts out-of-band.
 *
 * Authorization is machine-verifiable:
 * - sealed authority-state.v1.json phase `credential_bootstrap` must be AUTHORIZED, OR
 * - `synthetic_only: true` for verification fixtures (never real secrets)
 *
 * CLI `--authorized` alone is NOT sufficient for real credential intake.
 * Chat GO phrases are NOT authorization.
 *
 * @param {object} opts
 * @param {import('../capabilities/registry.js').CapabilityRegistry} opts.registry
 * @param {import('../secrets/store.js').SecretStore} opts.secretStore
 * @param {string[]} [opts.provider_filter]
 * @param {string} [opts.environment]
 * @param {boolean} [opts.authorized] - CLI convenience; insufficient alone for real bootstrap
 * @param {boolean} [opts.synthetic_only] - verification mode with fixtures only
 * @param {import('../authority/state.js').AuthorityState} [opts.authority]
 * @param {boolean} [opts.allow_real_bootstrap] - must be true AND phase AUTHORIZED
 */
export async function createBootstrapPlan(opts) {
  const { mayBootstrapCredentials } = await import('../authority/state.js');

  // Real intake: sealed authority only (chat GO / --authorized insufficient)
  if (opts.allow_real_bootstrap) {
    if (!opts.authority || !mayBootstrapCredentials(opts.authority)) {
      throw new Error(
        'Real credential bootstrap denied: sealed authority phase credential_bootstrap is NOT_AUTHORIZED. ' +
          'Chat GO text and --authorized alone are insufficient.'
      );
    }
  } else if (opts.synthetic_only || opts.authorized) {
    // Synthetic verification plan (fixtures only) or dry plan listing
  } else {
    throw new Error(
      'Bootstrap not authorized. Use synthetic_only for verification fixtures, or seal ' +
        'authority-state credential_bootstrap=AUTHORIZED for real intake. Chat GO phrases are not authorization.'
    );
  }

  const environment = classifyEnvironment(opts.environment ?? ENVIRONMENT.DEVELOPMENT);
  let discovered = discoverRequiredCredentials(opts.registry);
  if (opts.provider_filter?.length) {
    discovered = discovered.filter((d) => {
      const p = d.catalog?.provider ?? d.credential_id;
      return opts.provider_filter.includes(p) || opts.provider_filter.includes(d.credential_id);
    });
  }

  const steps = [];
  for (const d of discovered) {
    const existing = await opts.secretStore.getMetadata(d.credential_id);
    steps.push({
      credential_id: d.credential_id,
      provider: d.catalog?.provider ?? 'unknown',
      action: existing ? 'review_or_rotate' : 'register_metadata_then_pass_insert',
      pass_path: d.catalog?.pass_path ?? `qpf/sccb/${d.credential_id}`,
      env_names: d.catalog?.env_names ?? [],
      required_by_capabilities: d.required_by,
      operator_instructions: [
        '1. Open a local terminal (not chat).',
        `2. Run: pass insert ${d.catalog?.pass_path ?? d.credential_id}`,
        '3. Paste secret only into pass (GPG-encrypted).',
        '4. Run: node sccb/src/cli.js bootstrap register-metadata --id ' + d.credential_id,
        '5. Run: node sccb/src/cli.js bootstrap validate --id ' + d.credential_id,
        'NEVER paste the secret into agent chat or commit it.',
      ],
      existing_status: existing?.status ?? null,
      environment,
    });
  }

  return {
    schema: 'sccb.bootstrap_plan.v1',
    authorized: true,
    mode: opts.allow_real_bootstrap ? 'real_bootstrap' : 'synthetic_verification',
    environment,
    steps,
    secret_values_included: false,
    real_secret_intake: Boolean(opts.allow_real_bootstrap),
    created_utc: new Date().toISOString(),
  };
}

/**
 * Register metadata only after operator has stored secret in pass (or fixture store).
 * Does not accept secret values.
 *
 * @param {object} opts
 * @param {import('../secrets/store.js').SecretStore} opts.secretStore
 * @param {string} opts.credential_id
 * @param {string} [opts.environment]
 * @param {Partial<import('../secrets/store.js').CredentialMeta>} [opts.overrides]
 */
export async function registerMetadata(opts) {
  const catalog = CREDENTIAL_CATALOG.find((c) => c.id === opts.credential_id);
  if (!catalog && !opts.overrides) {
    throw new Error(`unknown credential_id and no overrides: ${opts.credential_id}`);
  }
  const meta = createCredentialMeta({
    id: opts.credential_id,
    provider: opts.overrides?.provider ?? catalog.provider,
    label: opts.overrides?.label ?? catalog?.label ?? opts.credential_id,
    pass_path: opts.overrides?.pass_path ?? catalog?.pass_path,
    env_names: opts.overrides?.env_names ?? catalog?.env_names ?? [],
    environment: opts.environment ?? ENVIRONMENT.DEVELOPMENT,
    status: CREDENTIAL_STATUS.UNKNOWN,
    scopes: opts.overrides?.scopes ?? catalog?.scopes ?? [],
    notes: 'Registered via SCCB bootstrap; secret must live only in secure store',
  });
  return opts.secretStore.putMetadata(meta);
}

/**
 * Validate configuration: metadata present; optional pass presence check.
 * Never returns secret values.
 *
 * @param {object} opts
 * @param {import('../secrets/store.js').SecretStore} opts.secretStore
 * @param {string} opts.credential_id
 * @param {boolean} [opts.mark_active_if_usable]
 */
export async function validateCredential(opts) {
  const meta = await opts.secretStore.getMetadata(opts.credential_id);
  if (!meta) {
    return {
      credential_id: opts.credential_id,
      ok: false,
      reason: 'metadata missing',
      secret_value_returned: false,
    };
  }
  let usable = false;
  try {
    usable = await opts.secretStore.isUsable(opts.credential_id);
  } catch {
    usable = false;
  }

  // For memory store, usable requires ACTIVE + material.
  // After bootstrap validate with material present, mark active.
  if (usable && opts.mark_active_if_usable && meta.status !== CREDENTIAL_STATUS.ACTIVE) {
    await opts.secretStore.putMetadata({
      ...meta,
      status: CREDENTIAL_STATUS.ACTIVE,
      last_validated_utc: new Date().toISOString(),
    });
  } else if (!usable) {
    // try load path for memory fixtures that are ACTIVE
    try {
      if (meta.status === CREDENTIAL_STATUS.ACTIVE || meta.status === CREDENTIAL_STATUS.UNKNOWN) {
        // isUsable false might mean status unknown without material
      }
    } catch {
      /* ignore */
    }
  }

  const updated = await opts.secretStore.getMetadata(opts.credential_id);
  return {
    credential_id: opts.credential_id,
    ok: Boolean(usable && updated?.status === CREDENTIAL_STATUS.ACTIVE),
    status: updated?.status,
    environment: updated?.environment,
    env_names: updated?.env_names,
    pass_path: updated?.pass_path,
    last_validated_utc: updated?.last_validated_utc,
    secret_value_returned: false,
    reason: usable ? 'credential usable (presence only)' : 'secret material not usable or not active',
  };
}

/**
 * Associate credentials with capabilities (report only — definitions already link).
 * @param {import('../capabilities/registry.js').CapabilityRegistry} registry
 * @param {import('../secrets/store.js').SecretStore} secretStore
 */
export async function associationReport(registry, secretStore) {
  const rows = [];
  for (const cap of registry.list()) {
    if (!cap.credential_dependency) {
      rows.push({
        capability_id: cap.id,
        credential_id: null,
        credential_status: null,
        ready: true,
      });
      continue;
    }
    const meta = await secretStore.getMetadata(cap.credential_dependency);
    rows.push({
      capability_id: cap.id,
      credential_id: cap.credential_dependency,
      credential_status: meta?.status ?? 'missing',
      ready: meta?.status === CREDENTIAL_STATUS.ACTIVE,
    });
  }
  return { schema: 'sccb.association_report.v1', rows, secret_values: false };
}

/**
 * Write bootstrap evidence receipt (no secrets).
 */
export async function writeBootstrapReceipt(receiptDir, planOrResult) {
  const receipt = buildReceipt({
    actor: 'human-operator',
    capability_id: 'sccb.bootstrap',
    operation: 'bootstrap',
    policy_class: 'HUMAN_APPROVAL',
    policy_decision: 'ALLOW',
    policy_reason: 'authorized bootstrap session',
    approval_state: 'APPROVED',
    execution_state: 'SUCCESS',
    result: 'BOOTSTRAP_PLAN_OR_VALIDATE',
    params_hash: 'bootstrap',
    extra: redactForAudit(planOrResult),
  });
  if (receiptDir) return writeReceipt(receiptDir, receipt);
  return null;
}
