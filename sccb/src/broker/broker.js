/**
 * SCCB v1 — execution broker.
 *
 * Flow: intent → policy → approval → (optional inject) → handler → receipt
 *
 * Secrets never enter agent-facing return values.
 * "Always approve" agent mode cannot bypass policy.
 */

import { randomUUID } from 'node:crypto';
import { evaluatePolicy } from '../policy/engine.js';
import { buildReceipt, writeReceipt, computeIdempotencyKey } from '../audit/receipt.js';
import { runWithInjectedSecrets, agentSafeResult } from './inject.js';
import {
  POLICY_DECISION,
  EXECUTION_STATE,
  APPROVAL_STATE,
  ENVIRONMENT,
} from '../types.js';
import { redactForAudit } from '../redaction.js';

/**
 * @typedef {object} BrokerRequest
 * @property {string} capability_id
 * @property {string} operation
 * @property {string} [actor]
 * @property {Record<string, unknown>} [params]
 * @property {boolean} [agent_always_approve]
 * @property {string} [approval_id] - pre-granted approval to use
 * @property {string} [idempotency_key]
 * @property {boolean} [dry_run]
 * @property {string} [command] - for inject-based execution
 * @property {string[]} [command_args]
 */

/**
 * @typedef {object} BrokerResult
 * @property {string} request_id
 * @property {string} evidence_id
 * @property {string} policy_decision
 * @property {string} approval_state
 * @property {string} execution_state
 * @property {string} result
 * @property {string} reason
 * @property {object|null} data - agent-safe payload only
 * @property {string|null} receipt_path
 * @property {boolean} secret_exposed_to_llm
 */

export class Broker {
  /**
   * @param {object} deps
   * @param {import('../capabilities/registry.js').CapabilityRegistry} deps.registry
   * @param {import('../secrets/store.js').SecretStore} deps.secretStore
   * @param {import('../approval/engine.js').ApprovalEngine} deps.approvals
   * @param {import('../control/emergency.js').ControlPlane} deps.control
   * @param {string} [deps.receiptDir]
   * @param {string} [deps.environment]
   * @param {Map<string, Function>} [deps.handlers] - capability_id → async handler
   */
  constructor(deps) {
    this.registry = deps.registry;
    this.secretStore = deps.secretStore;
    this.approvals = deps.approvals;
    this.control = deps.control;
    this.receiptDir = deps.receiptDir ?? null;
    this.environment = deps.environment ?? ENVIRONMENT.DEVELOPMENT;
    /** @type {Map<string, Function>} */
    this.handlers = deps.handlers ?? new Map();
    /** @type {Map<string, BrokerResult>} */
    this._idempotency = new Map();
    /** command allowlist for inject */
    this.commandAllowlist = deps.commandAllowlist ?? [
      'echo',
      'true',
      'false',
      'node',
      'npm',
      'npx',
      'bash',
      'wrangler',
      'gh',
    ];
  }

  /**
   * Register a capability handler (no secrets in return).
   * @param {string} capabilityId
   * @param {(ctx: object) => Promise<object>} handler
   */
  registerHandler(capabilityId, handler) {
    this.handlers.set(capabilityId, handler);
  }

  /**
   * @param {BrokerRequest} req
   * @returns {Promise<BrokerResult>}
   */
  async invoke(req) {
    const request_id = randomUUID();
    const actor = req.actor ?? 'agent';
    const params = req.params ?? {};
    const cap = this.registry.get(req.capability_id);

    // Idempotency
    const earlyHash = computeIdempotencyKey(
      req.capability_id,
      req.operation,
      JSON.stringify(params),
      req.idempotency_key
    );
    // Better: use policy hash after evaluate — but for replay use full key
    const idemKey = req.idempotency_key
      ? computeIdempotencyKey(req.capability_id, req.operation, '', req.idempotency_key)
      : null;
    if (idemKey && this._idempotency.has(idemKey)) {
      return { ...this._idempotency.get(idemKey), result: 'IDEMPOTENT_REPLAY' };
    }

    let credentialMeta = null;
    if (cap?.credential_dependency) {
      credentialMeta = await this.secretStore.getMetadata(cap.credential_dependency);
    }

    let prior_approval = null;
    if (req.approval_id) {
      const rec = this.approvals.get(req.approval_id);
      // Reject consumed or expired approvals (replay protection)
      if (rec && !rec.used) {
        const expired =
          rec.expires_utc && new Date(rec.expires_utc).getTime() < Date.now();
        if (!expired) {
          prior_approval = {
            approval_id: rec.approval_id,
            state: rec.state,
            params_hash: rec.params_hash,
          };
        }
      }
    } else {
      const found = this.approvals.findValid(req.capability_id, req.operation, params);
      if (found) {
        prior_approval = {
          approval_id: found.approval_id,
          state: found.state,
          params_hash: found.params_hash,
        };
      }
    }

    const policy = evaluatePolicy({
      capability_id: req.capability_id,
      operation: req.operation,
      actor,
      params,
      environment: this.environment,
      agent_always_approve: !!req.agent_always_approve,
      control: this.control.asPolicyControl(),
      capability: cap,
      credential: credentialMeta,
      prior_approval,
    });

    /** @type {BrokerResult} */
    let result = {
      request_id,
      evidence_id: `sccb-${request_id}`,
      policy_decision: policy.decision,
      approval_state: policy.approval_state,
      execution_state: EXECUTION_STATE.NOT_STARTED,
      result: 'PENDING',
      reason: policy.reason,
      data: null,
      receipt_path: null,
      secret_exposed_to_llm: false,
    };

    if (policy.decision === POLICY_DECISION.DENY) {
      result.execution_state = EXECUTION_STATE.BLOCKED;
      result.result = 'DENIED';
      await this._writeAudit(result, policy, req, actor, params);
      return result;
    }

    if (policy.decision === POLICY_DECISION.ESCALATE) {
      const pending = await this.approvals.request({
        capability_id: req.capability_id,
        operation: req.operation,
        actor,
        params,
        reasoning: policy.reason,
      });
      result.execution_state = EXECUTION_STATE.SKIPPED;
      result.result = 'APPROVAL_REQUIRED';
      result.approval_state = APPROVAL_STATE.PENDING;
      result.data = {
        approval_id: pending.approval_id,
        params_hash: policy.params_hash,
        message: 'Human approval required. Secrets not loaded.',
      };
      await this._writeAudit(result, policy, req, actor, params, pending.approval_id);
      return result;
    }

    // ALLOW
    if (req.dry_run) {
      result.execution_state = EXECUTION_STATE.DRY_RUN;
      result.result = 'DRY_RUN';
      result.data = {
        would_execute: true,
        capability_id: req.capability_id,
        operation: req.operation,
        params: redactForAudit(params),
        credential_dependency: cap?.credential_dependency ?? null,
      };
      await this._writeAudit(result, policy, req, actor, params, prior_approval?.approval_id);
      return result;
    }

    try {
      const handler = this.handlers.get(req.capability_id);
      let data = null;

      if (handler) {
        data = await handler({
          capability: cap,
          operation: req.operation,
          params,
          actor,
          environment: this.environment,
          secretStore: this.secretStore,
          // Handlers may call inject; must not put secrets in return
        });
      } else if (req.command && cap?.credential_dependency) {
        const injectResult = await runWithInjectedSecrets(
          this.secretStore,
          cap.credential_dependency,
          req.command,
          req.command_args ?? [],
          { allowlist: this.commandAllowlist }
        );
        data = agentSafeResult(injectResult);
        if (injectResult.code !== 0) {
          result.execution_state = EXECUTION_STATE.FAIL;
          result.result = 'EXEC_FAIL';
          result.data = data;
          result.reason = 'injected command non-zero exit';
          await this._writeAudit(result, policy, req, actor, params, prior_approval?.approval_id);
          return result;
        }
      } else if (req.command) {
        // no credential — run without inject
        const injectResult = await runWithInjectedSecrets(
          {
            loadForInject: async () => ({ env: {} }),
          },
          'none',
          req.command,
          req.command_args ?? [],
          { allowlist: this.commandAllowlist }
        );
        data = agentSafeResult(injectResult);
      } else {
        // Default: policy allow with no handler = success acknowledgment (metadata only)
        data = {
          acknowledged: true,
          capability_id: req.capability_id,
          operation: req.operation,
          note: 'No handler registered; policy ALLOW recorded only',
        };
      }

      // Consume one-time approval if used
      if (prior_approval?.approval_id && policy.approval_state === APPROVAL_STATE.APPROVED) {
        try {
          await this.approvals.consume(prior_approval.approval_id);
        } catch {
          /* ignore double-consume races in tests */
        }
      }

      result.execution_state = EXECUTION_STATE.SUCCESS;
      result.result = 'SUCCESS';
      result.data = redactForAudit(data);
      result.secret_exposed_to_llm = false;
      await this._writeAudit(result, policy, req, actor, params, prior_approval?.approval_id);

      if (idemKey) {
        this._idempotency.set(idemKey, { ...result });
      }
      return result;
    } catch (err) {
      result.execution_state = EXECUTION_STATE.FAIL;
      result.result = 'ERROR';
      result.reason = String(err?.message ?? err);
      // Never attach err with potential secret
      result.data = { error_type: err?.name ?? 'Error' };
      await this._writeAudit(result, policy, req, actor, params, prior_approval?.approval_id);
      return result;
    }
  }

  async _writeAudit(result, policy, req, actor, params, approval_id = null) {
    const receipt = buildReceipt({
      evidence_id: result.evidence_id,
      request_id: result.request_id,
      actor,
      capability_id: req.capability_id,
      operation: req.operation,
      policy_class: policy.policy_class,
      policy_decision: policy.decision,
      policy_reason: policy.reason,
      approval_state: result.approval_state,
      approval_id,
      execution_state: result.execution_state,
      result: result.result,
      params_hash: policy.params_hash,
      params,
      secret_exposed_to_llm: false,
    });
    if (this.receiptDir) {
      try {
        result.receipt_path = await writeReceipt(this.receiptDir, receipt);
      } catch {
        result.receipt_path = null;
      }
    }
    return receipt;
  }
}
