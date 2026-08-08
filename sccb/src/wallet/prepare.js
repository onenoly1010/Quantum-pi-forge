/**
 * SCCB v1 — wallet transaction preparation and policy evaluation.
 *
 * Pipeline:
 *   intent → policy evaluation → approval requirement → signer → network → evidence
 *
 * Real signing/execution is DISABLED in development/test mode.
 * Agents never receive private keys.
 */

import { createHash, randomUUID } from 'node:crypto';
import { evaluatePolicy, hashParams } from '../policy/engine.js';
import { POLICY_CLASS, POLICY_DECISION, ENVIRONMENT } from '../types.js';

/**
 * @typedef {object} TxIntent
 * @property {string} network
 * @property {string} [from]
 * @property {string} to
 * @property {string} amount_wei
 * @property {string} [data]
 * @property {string} [asset]
 * @property {string} [reason]
 * @property {string} [operation] - transfer | contract_call | mint | etc.
 */

/**
 * @typedef {object} PreparedTx
 * @property {string} prepare_id
 * @property {string} intent_hash
 * @property {object} intent_summary - safe for agent
 * @property {object} policy_result
 * @property {boolean} signing_enabled
 * @property {boolean} can_sign
 * @property {string} next_step
 * @property {string} created_utc
 */

/**
 * Summarize intent without secrets.
 * @param {TxIntent} intent
 */
export function summarizeIntent(intent) {
  return {
    network: intent.network,
    from: intent.from ?? null,
    to: intent.to,
    amount_wei: String(intent.amount_wei),
    asset: intent.asset ?? 'native',
    operation: intent.operation ?? 'transfer',
    data_present: Boolean(intent.data && intent.data !== '0x'),
    data_hash: intent.data
      ? createHash('sha256').update(String(intent.data)).digest('hex').slice(0, 16)
      : null,
    reason: intent.reason ?? null,
  };
}

/**
 * Evaluate wallet transfer policy limits.
 * @param {TxIntent} intent
 * @param {object} [limits]
 */
export function evaluateTxLimits(intent, limits = {}) {
  const failed = [];
  const matched = [];

  const max = limits.max_amount_wei != null ? BigInt(String(limits.max_amount_wei)) : null;
  if (max != null) {
    try {
      const amt = BigInt(String(intent.amount_wei));
      if (amt <= max) matched.push('max_amount_wei');
      else failed.push(`amount exceeds max_amount_wei (${max})`);
      if (amt < 0n) failed.push('negative amount');
    } catch {
      failed.push('invalid amount_wei');
    }
  }

  if (Array.isArray(limits.allowed_destinations) && limits.allowed_destinations.length) {
    if (limits.allowed_destinations.includes(intent.to)) matched.push('allowed_destinations');
    else failed.push('destination not in allowlist');
  }

  if (Array.isArray(limits.allowed_networks) && limits.allowed_networks.length) {
    if (limits.allowed_networks.includes(intent.network)) matched.push('allowed_networks');
    else failed.push('network not in allowlist');
  }

  if (limits.forbid_operations && Array.isArray(limits.forbid_operations)) {
    const op = intent.operation ?? 'transfer';
    if (limits.forbid_operations.includes(op)) failed.push(`operation forbidden: ${op}`);
  }

  // Economic locks always apply
  const op = intent.operation ?? 'transfer';
  if (['mint', 'add_liquidity', 'remove_liquidity'].includes(op)) {
    failed.push(`economic operation locked: ${op}`);
  }

  return { matched, failed, ok: failed.length === 0 };
}

/**
 * Prepare a transaction for policy review. Never signs.
 *
 * @param {object} opts
 * @param {TxIntent} opts.intent
 * @param {import('../capabilities/registry.js').CapabilityRegistry} opts.registry
 * @param {import('../control/emergency.js').ControlPlane} opts.control
 * @param {string} [opts.environment]
 * @param {string} [opts.actor]
 * @param {boolean} [opts.signing_enabled] - force; default false outside explicit prod GO
 * @param {object} [opts.limits]
 * @returns {PreparedTx}
 */
export function prepareTransaction(opts) {
  const {
    intent,
    registry,
    control,
    environment = ENVIRONMENT.DEVELOPMENT,
    actor = 'agent',
    limits = {},
  } = opts;

  // Signing hard-disabled in development/test
  const signing_enabled =
    opts.signing_enabled === true &&
    environment === ENVIRONMENT.PRODUCTION &&
    process.env.SCCB_WALLET_SIGNING === 'enabled';

  if (!intent?.to || intent.amount_wei == null || !intent.network) {
    throw new Error('intent requires network, to, amount_wei');
  }

  const limitResult = evaluateTxLimits(intent, {
    allowed_networks: ['0g-galileo-testnet', '0g-aristotle-mainnet'],
    forbid_operations: ['mint', 'add_liquidity', 'remove_liquidity'],
    ...limits,
  });

  const prepareCap = registry.get('wallet.prepare_transaction');
  const signCap = registry.get('wallet.sign_transaction');

  const policy = evaluatePolicy({
    capability_id: 'wallet.prepare_transaction',
    operation: 'prepare',
    actor,
    params: {
      network: intent.network,
      destination: intent.to,
      amount_wei: String(intent.amount_wei),
      operation: intent.operation ?? 'transfer',
    },
    environment,
    control: control.asPolicyControl(),
    capability: prepareCap,
    credential: null,
  });

  const signPolicy = evaluatePolicy({
    capability_id: 'wallet.sign_transaction',
    operation: 'sign',
    actor,
    params: { network: intent.network },
    environment,
    control: control.asPolicyControl(),
    capability: signCap,
    credential: null,
  });

  const prepare_id = randomUUID();
  const summary = summarizeIntent(intent);
  const intent_hash = hashParams(summary);

  let next_step = 'ready_for_approval_or_sign_gate';
  let can_sign = false;

  if (policy.decision === POLICY_DECISION.DENY) {
    next_step = 'blocked_by_prepare_policy';
  } else if (!limitResult.ok) {
    next_step = 'blocked_by_tx_limits';
  } else if (signPolicy.decision === POLICY_DECISION.DENY || !signing_enabled) {
    next_step = 'signing_disabled';
    can_sign = false;
  } else if (signPolicy.policy_class === POLICY_CLASS.HUMAN_APPROVAL) {
    next_step = 'awaiting_human_approval_for_sign';
    can_sign = false;
  } else {
    next_step = 'signing_would_be_allowed';
    can_sign = signing_enabled;
  }

  return {
    prepare_id,
    intent_hash,
    intent_summary: summary,
    policy_result: {
      prepare: policy,
      limits: limitResult,
      sign: {
        decision: signPolicy.decision,
        reason: signPolicy.reason,
        policy_class: signPolicy.policy_class,
      },
    },
    signing_enabled,
    can_sign,
    next_step,
    created_utc: new Date().toISOString(),
    // Explicitly no private key material
    private_key_included: false,
    seed_included: false,
  };
}

/**
 * Explicitly refuse sign attempts in v1 default.
 * @param {PreparedTx} prepared
 */
export function refuseSign(prepared) {
  return {
    signed: false,
    prepare_id: prepared.prepare_id,
    reason: 'SCCB v1: wallet.sign_transaction is FORBIDDEN / signing disabled',
    broadcast: false,
    secret_exposed: false,
  };
}
