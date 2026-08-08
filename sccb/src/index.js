/**
 * SCCB v1 — public API for Sovereign Credential & Capability Bootstrap.
 */

export {
  SCCB_VERSION,
  POLICY_CLASS,
  POLICY_DECISION,
  CREDENTIAL_STATUS,
  CAPABILITY_STATUS,
  APPROVAL_STATE,
  EXECUTION_STATE,
  ENVIRONMENT,
} from './types.js';
export { redactForAudit, redactString, createSafeLogger, isSecretFieldName } from './redaction.js';
export { SecretStore, createCredentialMeta, assertCredentialMeta } from './secrets/store.js';
export { MemorySecretStore } from './secrets/memory-store.js';
export { PassSecretStore } from './secrets/pass-store.js';
export { CapabilityRegistry, defaultCapabilities, assertCapability } from './capabilities/registry.js';
export { evaluatePolicy, evaluateConditions, hashParams } from './policy/engine.js';
export { ApprovalEngine } from './approval/engine.js';
export { ControlPlane, RECOVERY_PROCEDURE, defaultControlState } from './control/emergency.js';
export { buildReceipt, writeReceipt, verifyReceiptSafety, computeIdempotencyKey } from './audit/receipt.js';
export { Broker } from './broker/broker.js';
export { runWithInjectedSecrets, agentSafeResult } from './broker/inject.js';
export { prepareTransaction, refuseSign, evaluateTxLimits, summarizeIntent } from './wallet/prepare.js';
export {
  CREDENTIAL_CATALOG,
  discoverRequiredCredentials,
  createBootstrapPlan,
  registerMetadata,
  validateCredential,
  associationReport,
  writeBootstrapReceipt,
} from './bootstrap/bootstrap.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CapabilityRegistry, defaultCapabilities } from './capabilities/registry.js';
import { MemorySecretStore } from './secrets/memory-store.js';
import { PassSecretStore } from './secrets/pass-store.js';
import { ApprovalEngine } from './approval/engine.js';
import { ControlPlane } from './control/emergency.js';
import { Broker } from './broker/broker.js';
import { ENVIRONMENT } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SCCB_ROOT = path.resolve(__dirname, '..');
export const DEFAULT_CONFIG_DIR = path.join(SCCB_ROOT, 'config');

/**
 * Create a fully wired SCCB runtime for tests or local use.
 * @param {object} [opts]
 */
export async function createSccbRuntime(opts = {}) {
  const environment = opts.environment ?? ENVIRONMENT.TEST;
  const registry = new CapabilityRegistry(opts.capabilities ?? defaultCapabilities());
  const secretStore =
    opts.secretStore ??
    (opts.usePass
      ? new PassSecretStore({
          metadataPath:
            opts.metadataPath ?? path.join(DEFAULT_CONFIG_DIR, 'credential-metadata.local.json'),
        })
      : new MemorySecretStore({ environment }));
  const approvals = opts.approvals ?? new ApprovalEngine({ memoryOnly: true });
  await approvals.load();
  const control = opts.control ?? new ControlPlane({ memoryOnly: true });
  await control.load();
  const broker = new Broker({
    registry,
    secretStore,
    approvals,
    control,
    receiptDir: opts.receiptDir ?? null,
    environment,
    commandAllowlist: opts.commandAllowlist,
  });
  return { registry, secretStore, approvals, control, broker, environment };
}
