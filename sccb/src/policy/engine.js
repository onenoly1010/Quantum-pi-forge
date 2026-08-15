/**
 * SCCB v1 — policy evaluation engine.
 *
 * Classes:
 *   PREAUTHORIZED — auto if capability active and global state allows
 *   CONDITIONAL   — auto only when params match policy constraints
 *   HUMAN_APPROVAL — must escalate for explicit approval
 *   FORBIDDEN     — always deny
 *
 * "Always approve" agent modes NEVER bypass SCCB policy.
 */

import { createHash } from 'node:crypto';
import {
  POLICY_CLASS,
  POLICY_DECISION,
  CAPABILITY_STATUS,
  APPROVAL_STATE,
} from '../types.js';

/**
 * @typedef {object} PolicyContext
 * @property {string} capability_id
 * @property {string} operation
 * @property {string} actor
 * @property {Record<string, unknown>} [params]
 * @property {string} [environment]
 * @property {boolean} [agent_always_approve] - MUST NOT bypass policy
 * @property {{ global_pause?: boolean, emergency_stop?: boolean, paused_capabilities?: string[] }} [control]
 * @property {import('../capabilities/registry.js').CapabilityDef|null} capability
 * @property {{ status?: string }|null} [credential]
 * @property {{ approval_id?: string, state?: string, params_hash?: string }|null} [prior_approval]
 */

/**
 * @typedef {object} PolicyResult
 * @property {string} decision - ALLOW | DENY | ESCALATE
 * @property {string} policy_class
 * @property {string} reason
 * @property {string} params_hash
 * @property {string} approval_state
 * @property {string[]} matched_conditions
 * @property {string[]} failed_conditions
 */

/**
 * Stable hash of params for approval binding and idempotency.
 * @param {unknown} params
 * @returns {string}
 */
export function hashParams(params) {
  const canonical = JSON.stringify(params ?? {}, Object.keys(params ?? {}).sort());
  return createHash('sha256').update(canonical).digest('hex').slice(0, 32);
}

/**
 * Evaluate whether params satisfy conditional policy.
 * @param {import('../capabilities/registry.js').CapabilityDef} cap
 * @param {Record<string, unknown>} params
 * @returns {{ matched: string[], failed: string[] }}
 */
export function evaluateConditions(cap, params = {}) {
  const matched = [];
  const failed = [];
  const policy = cap.policy || {};

  if (Array.isArray(policy.allowed_targets)) {
    const target = params.target ?? params.project ?? params.destination;
    if (target != null && policy.allowed_targets.includes(String(target))) {
      matched.push('allowed_targets');
    } else {
      failed.push(`target not in allowlist: ${target ?? '(missing)'}`);
    }
  }

  if (Array.isArray(policy.allowed_branches)) {
    const branch = params.branch;
    if (branch != null && policy.allowed_branches.includes(String(branch))) {
      matched.push('allowed_branches');
    } else if (policy.allowed_branches.length) {
      failed.push(`branch not in allowlist: ${branch ?? '(missing)'}`);
    }
  }

  if (Array.isArray(policy.allowed_repos)) {
    const repo = params.repo ?? params.repository;
    if (repo != null && policy.allowed_repos.includes(String(repo))) {
      matched.push('allowed_repos');
    } else {
      failed.push(`repo not in allowlist: ${repo ?? '(missing)'}`);
    }
  }

  if (Array.isArray(policy.allowed_networks)) {
    const network = params.network;
    if (network != null && policy.allowed_networks.includes(String(network))) {
      matched.push('allowed_networks');
    } else if (network != null) {
      failed.push(`network not in allowlist: ${network}`);
    }
  }

  if (policy.max_amount_wei != null && params.amount_wei != null) {
    try {
      const amt = BigInt(String(params.amount_wei));
      const max = BigInt(String(policy.max_amount_wei));
      if (amt <= max) matched.push('max_amount_wei');
      else failed.push(`amount_wei ${amt} exceeds max ${max}`);
    } catch {
      failed.push('invalid amount_wei');
    }
  }

  if (policy.allowed_destinations && Array.isArray(policy.allowed_destinations)) {
    const dest = params.destination ?? params.to;
    if (dest != null && policy.allowed_destinations.includes(String(dest))) {
      matched.push('allowed_destinations');
    } else {
      failed.push(`destination not in allowlist: ${dest ?? '(missing)'}`);
    }
  }

  if (policy.signing_enabled === false && (params.sign === true || params.execute_sign === true)) {
    failed.push('signing_enabled is false');
  }

  return { matched, failed };
}

/**
 * Core policy evaluation. Never elevates on agent_always_approve.
 * @param {PolicyContext} ctx
 * @returns {PolicyResult}
 */
export function evaluatePolicy(ctx) {
  const params = ctx.params ?? {};
  const params_hash = hashParams(params);
  const matched_conditions = [];
  const failed_conditions = [];

  const base = {
    params_hash,
    matched_conditions,
    failed_conditions,
  };

  // Global control plane
  if (ctx.control?.emergency_stop) {
    return {
      ...base,
      decision: POLICY_DECISION.DENY,
      policy_class: POLICY_CLASS.FORBIDDEN,
      reason: 'emergency stop is active',
      approval_state: APPROVAL_STATE.BLOCKED,
    };
  }
  if (ctx.control?.global_pause) {
    return {
      ...base,
      decision: POLICY_DECISION.DENY,
      policy_class: POLICY_CLASS.FORBIDDEN,
      reason: 'global SCCB execution pause is active',
      approval_state: APPROVAL_STATE.BLOCKED,
    };
  }
  if (ctx.control?.paused_capabilities?.includes(ctx.capability_id)) {
    return {
      ...base,
      decision: POLICY_DECISION.DENY,
      policy_class: POLICY_CLASS.FORBIDDEN,
      reason: `capability paused: ${ctx.capability_id}`,
      approval_state: APPROVAL_STATE.BLOCKED,
    };
  }

  const cap = ctx.capability;
  if (!cap) {
    return {
      ...base,
      decision: POLICY_DECISION.DENY,
      policy_class: POLICY_CLASS.FORBIDDEN,
      reason: `unknown capability: ${ctx.capability_id}`,
      approval_state: APPROVAL_STATE.BLOCKED,
    };
  }

  if (cap.status === CAPABILITY_STATUS.REVOKED) {
    return {
      ...base,
      decision: POLICY_DECISION.DENY,
      policy_class: POLICY_CLASS.FORBIDDEN,
      reason: `capability revoked: ${cap.id}`,
      approval_state: APPROVAL_STATE.BLOCKED,
    };
  }
  if (cap.status === CAPABILITY_STATUS.PAUSED) {
    return {
      ...base,
      decision: POLICY_DECISION.DENY,
      policy_class: POLICY_CLASS.FORBIDDEN,
      reason: `capability status paused: ${cap.id}`,
      approval_state: APPROVAL_STATE.BLOCKED,
    };
  }

  if (!cap.permitted_operations.includes(ctx.operation)) {
    return {
      ...base,
      decision: POLICY_DECISION.DENY,
      policy_class: cap.policy_class,
      reason: `operation not permitted: ${ctx.operation}`,
      approval_state: APPROVAL_STATE.BLOCKED,
    };
  }

  // Credential dependency (status only — no secret load at policy time)
  if (cap.credential_dependency) {
    if (!ctx.credential) {
      // Allow ESCALATE/policy path for HUMAN; deny auto for others if missing meta
      if (cap.policy_class === POLICY_CLASS.FORBIDDEN) {
        // fall through
      } else if (
        cap.policy_class === POLICY_CLASS.PREAUTHORIZED ||
        cap.policy_class === POLICY_CLASS.CONDITIONAL
      ) {
        // credential may be missing until bootstrap — still evaluate policy class
        // Broker will fail inject if needed; policy does not require secret presence for PREAUTH verify-no-cred caps
      }
    } else if (
      ctx.credential.status === 'revoked' ||
      ctx.credential.status === 'disabled' ||
      ctx.credential.status === 'expired'
    ) {
      return {
        ...base,
        decision: POLICY_DECISION.DENY,
        policy_class: cap.policy_class,
        reason: `credential not usable: ${cap.credential_dependency} (${ctx.credential.status})`,
        approval_state: APPROVAL_STATE.BLOCKED,
      };
    }
  }

  // Explicit: agent always-approve never bypasses
  if (ctx.agent_always_approve && cap.policy_class !== POLICY_CLASS.PREAUTHORIZED) {
    // still apply normal rules — document that flag was ignored for elevation
    matched_conditions.push('agent_always_approve_ignored_for_elevation');
  }

  switch (cap.policy_class) {
    case POLICY_CLASS.FORBIDDEN: {
      return {
        ...base,
        decision: POLICY_DECISION.DENY,
        policy_class: POLICY_CLASS.FORBIDDEN,
        reason: cap.policy?.reason
          ? String(cap.policy.reason)
          : `capability forbidden: ${cap.id}`,
        approval_state: APPROVAL_STATE.BLOCKED,
      };
    }
    case POLICY_CLASS.PREAUTHORIZED: {
      return {
        ...base,
        decision: POLICY_DECISION.ALLOW,
        policy_class: POLICY_CLASS.PREAUTHORIZED,
        reason: 'standing preauthorized policy',
        approval_state: APPROVAL_STATE.NOT_REQUIRED,
        matched_conditions: [...matched_conditions, 'preauthorized'],
      };
    }
    case POLICY_CLASS.CONDITIONAL: {
      const { matched, failed } = evaluateConditions(cap, params);
      matched_conditions.push(...matched);
      failed_conditions.push(...failed);
      if (failed.length === 0) {
        return {
          ...base,
          decision: POLICY_DECISION.ALLOW,
          policy_class: POLICY_CLASS.CONDITIONAL,
          reason: 'conditional policy matched',
          approval_state: APPROVAL_STATE.NOT_REQUIRED,
          matched_conditions,
          failed_conditions,
        };
      }
      // mismatch → escalate to human (not silent allow)
      return {
        ...base,
        decision: POLICY_DECISION.ESCALATE,
        policy_class: POLICY_CLASS.CONDITIONAL,
        reason: `conditional policy mismatch: ${failed.join('; ')}`,
        approval_state: APPROVAL_STATE.PENDING,
        matched_conditions,
        failed_conditions,
      };
    }
    case POLICY_CLASS.HUMAN_APPROVAL: {
      if (
        ctx.prior_approval?.state === APPROVAL_STATE.APPROVED &&
        ctx.prior_approval.params_hash === params_hash
      ) {
        return {
          ...base,
          decision: POLICY_DECISION.ALLOW,
          policy_class: POLICY_CLASS.HUMAN_APPROVAL,
          reason: `human approval bound: ${ctx.prior_approval.approval_id}`,
          approval_state: APPROVAL_STATE.APPROVED,
          matched_conditions: [...matched_conditions, 'prior_approval'],
        };
      }
      if (ctx.prior_approval?.state === APPROVAL_STATE.REJECTED) {
        return {
          ...base,
          decision: POLICY_DECISION.DENY,
          policy_class: POLICY_CLASS.HUMAN_APPROVAL,
          reason: 'human approval rejected',
          approval_state: APPROVAL_STATE.REJECTED,
        };
      }
      return {
        ...base,
        decision: POLICY_DECISION.ESCALATE,
        policy_class: POLICY_CLASS.HUMAN_APPROVAL,
        reason: 'explicit human approval required',
        approval_state: APPROVAL_STATE.PENDING,
      };
    }
    default:
      return {
        ...base,
        decision: POLICY_DECISION.DENY,
        policy_class: POLICY_CLASS.FORBIDDEN,
        reason: `unknown policy class: ${cap.policy_class}`,
        approval_state: APPROVAL_STATE.BLOCKED,
      };
  }
}
