/**
 * SCCB v1 — agent-facing capability grants.
 *
 * Agents receive CAPABILITY grants, never secret values:
 *   CAPABILITY: github.pr.create
 * not:
 *   GITHUB_TOKEN=actual_secret
 */

import { redactForAudit } from '../redaction.js';

/**
 * @typedef {object} CapabilityGrant
 * @property {'CAPABILITY'} type
 * @property {string} capability_id
 * @property {string} policy_class
 * @property {string[]} permitted_operations
 * @property {boolean} credential_bound
 * @property {string|null} credential_id
 * @property {string|null} credential_status
 * @property {string} capability_status
 * @property {boolean} approval_required
 * @property {object} policy_constraints - allowlists only, no secrets
 * @property {boolean} secret_value_included
 */

/**
 * Project a capability into an agent-safe grant.
 * @param {import('../capabilities/registry.js').CapabilityDef} cap
 * @param {{ status?: string }|null} [credentialMeta]
 * @returns {CapabilityGrant}
 */
export function projectCapabilityGrant(cap, credentialMeta = null) {
  if (!cap?.id) throw new Error('capability required');
  return {
    type: 'CAPABILITY',
    capability_id: cap.id,
    policy_class: cap.policy_class,
    permitted_operations: [...(cap.permitted_operations || [])],
    credential_bound: Boolean(cap.credential_dependency),
    credential_id: cap.credential_dependency ?? null,
    credential_status: credentialMeta?.status ?? null,
    capability_status: cap.status ?? 'active',
    approval_required: Boolean(cap.approval_required),
    policy_constraints: redactForAudit(cap.policy || {}),
    secret_value_included: false,
  };
}

/**
 * Format grant as agent-facing line.
 * @param {CapabilityGrant} grant
 */
export function formatCapabilityLine(grant) {
  return `CAPABILITY: ${grant.capability_id}`;
}

/**
 * Project full registry for agent context (no secrets).
 * @param {import('../capabilities/registry.js').CapabilityRegistry} registry
 * @param {import('../secrets/store.js').SecretStore} [secretStore]
 */
export async function projectAllGrants(registry, secretStore = null) {
  const grants = [];
  for (const cap of registry.list()) {
    let meta = null;
    if (secretStore && cap.credential_dependency) {
      meta = await secretStore.getMetadata(cap.credential_dependency);
    }
    grants.push(projectCapabilityGrant(cap, meta));
  }
  return {
    type: 'CAPABILITY_GRANT_SET',
    grants,
    secret_values_included: false,
    agent_instruction:
      'Use capability ids only. Never request or accept raw API tokens, passwords, or private keys.',
  };
}

/**
 * Project a broker result into agent-safe shape.
 * Strips any accidental secret-like fields.
 * @param {object} brokerResult
 */
export function projectBrokerResultForAgent(brokerResult) {
  const safe = redactForAudit({
    type: 'SCCB_RESULT',
    request_id: brokerResult.request_id,
    evidence_id: brokerResult.evidence_id,
    capability_id: brokerResult.capability_id,
    policy_decision: brokerResult.policy_decision,
    approval_state: brokerResult.approval_state,
    execution_state: brokerResult.execution_state,
    result: brokerResult.result,
    reason: brokerResult.reason,
    data: brokerResult.data,
    receipt_path: brokerResult.receipt_path,
    secret_exposed_to_llm: false,
    secret_value_included: false,
  });
  // Defense: ensure known secret patterns absent
  const json = JSON.stringify(safe);
  if (
    /ghp_[A-Za-z0-9]{10,}/.test(json) ||
    /sk-[A-Za-z0-9]{10,}/.test(json) ||
    /BEGIN [A-Z ]*PRIVATE KEY/.test(json)
  ) {
    return {
      type: 'SCCB_RESULT',
      result: 'REDACTED_UNSAFE',
      reason: 'agent projection blocked potential secret material',
      secret_exposed_to_llm: false,
      secret_value_included: false,
    };
  }
  return safe;
}

/**
 * Wallet prepare projection — never includes keys.
 * @param {import('../wallet/prepare.js').PreparedTx} prepared
 */
export function projectPreparedTxForAgent(prepared) {
  return {
    type: 'CAPABILITY',
    capability_id: 'wallet.prepare_transaction',
    prepare_id: prepared.prepare_id,
    intent_summary: prepared.intent_summary,
    next_step: prepared.next_step,
    can_sign: prepared.can_sign,
    signing_enabled: prepared.signing_enabled,
    private_key_included: false,
    seed_included: false,
    secret_value_included: false,
  };
}
