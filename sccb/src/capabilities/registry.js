/**
 * SCCB v1 — capability registry (provider operations, not evidence registry).
 * Separate from deploy/capability-registry-v1.json (evidence proofs).
 */

import { promises as fs } from 'node:fs';
import { CAPABILITY_STATUS, POLICY_CLASS } from '../types.js';

/**
 * @typedef {object} CapabilityDef
 * @property {string} id
 * @property {string} scope - human-readable scope description
 * @property {string[]} permitted_operations
 * @property {string|null} credential_dependency - credential id or null if none
 * @property {string} policy_class - PREAUTHORIZED | CONDITIONAL | HUMAN_APPROVAL | FORBIDDEN
 * @property {object} [policy] - extra policy constraints
 * @property {boolean} approval_required - default for HUMAN class
 * @property {object} audit - audit behavior flags
 * @property {string} status - active | revoked | paused
 * @property {string} [provider]
 * @property {string} [description]
 * @property {string} [environment] - if set, only valid in that env class
 */

/**
 * @param {CapabilityDef} cap
 */
export function assertCapability(cap) {
  if (!cap?.id) throw new Error('capability requires id');
  if (!Array.isArray(cap.permitted_operations)) {
    throw new Error(`capability ${cap.id}: permitted_operations required`);
  }
  const classes = Object.values(POLICY_CLASS);
  if (!classes.includes(cap.policy_class)) {
    throw new Error(`capability ${cap.id}: invalid policy_class`);
  }
  if (!cap.audit || typeof cap.audit !== 'object') {
    throw new Error(`capability ${cap.id}: audit config required`);
  }
}

export class CapabilityRegistry {
  /**
   * @param {CapabilityDef[]} [initial]
   */
  constructor(initial = []) {
    /** @type {Map<string, CapabilityDef>} */
    this._caps = new Map();
    for (const c of initial) {
      this.register(c);
    }
  }

  /**
   * @param {CapabilityDef} cap
   */
  register(cap) {
    assertCapability(cap);
    this._caps.set(cap.id, {
      ...cap,
      permitted_operations: [...cap.permitted_operations],
      policy: cap.policy ? { ...cap.policy } : {},
      audit: { ...cap.audit },
      status: cap.status ?? CAPABILITY_STATUS.ACTIVE,
    });
  }

  /**
   * @param {string} id
   * @returns {CapabilityDef|null}
   */
  get(id) {
    const c = this._caps.get(id);
    return c ? { ...c, permitted_operations: [...c.permitted_operations], policy: { ...c.policy }, audit: { ...c.audit } } : null;
  }

  /**
   * @returns {CapabilityDef[]}
   */
  list() {
    return [...this._caps.values()].map((c) => this.get(c.id));
  }

  /**
   * @param {string} id
   * @param {string} status
   */
  setStatus(id, status) {
    const c = this._caps.get(id);
    if (!c) throw new Error(`unknown capability: ${id}`);
    c.status = status;
    return this.get(id);
  }

  /**
   * @param {string} filePath
   */
  async loadFromFile(filePath) {
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    const caps = data.capabilities ?? data;
    if (!Array.isArray(caps)) throw new Error('capabilities file must contain array');
    for (const c of caps) this.register(c);
    return this.list().length;
  }

  /**
   * @param {string} filePath
   */
  async saveToFile(filePath) {
    const payload = {
      schema: 'sccb.capabilities.v1',
      version: 1,
      note: 'Provider operation capabilities — no secrets. Separate from evidence capability-registry-v1.json',
      capabilities: this.list(),
    };
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2) + '\n');
  }
}

/**
 * Default v1 capabilities (production-safe defaults; economics forbidden).
 * @returns {CapabilityDef[]}
 */
export function defaultCapabilities() {
  const auditDefault = {
    write_receipt: true,
    include_params_hash: true,
    never_include_secrets: true,
  };

  return [
    {
      id: 'qpf.site.funnel.verify',
      provider: 'qpf',
      scope: 'public production funnel smoke checks',
      description: 'Verify quantumpiforge.com funnel surfaces (no credentials)',
      permitted_operations: ['verify'],
      credential_dependency: null,
      policy_class: POLICY_CLASS.PREAUTHORIZED,
      policy: {},
      approval_required: false,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'cloudflare.pages.read',
      provider: 'cloudflare',
      scope: 'list/read Cloudflare Pages projects and deployments',
      permitted_operations: ['list_projects', 'list_deployments', 'get_deployment'],
      credential_dependency: 'cloudflare-api-token',
      policy_class: POLICY_CLASS.PREAUTHORIZED,
      policy: {},
      approval_required: false,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'cloudflare.deploy',
      provider: 'cloudflare',
      scope: 'deploy static site to named Cloudflare Pages projects',
      permitted_operations: ['deploy'],
      credential_dependency: 'cloudflare-api-token',
      policy_class: POLICY_CLASS.CONDITIONAL,
      policy: {
        allowed_targets: ['quantumpiforge', 'oinio-dashboard'],
        allowed_branches: ['main'],
      },
      approval_required: false,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'github.pr.create',
      provider: 'github',
      scope: 'open pull requests on allowed repositories',
      permitted_operations: ['create_pr'],
      credential_dependency: 'github-token',
      policy_class: POLICY_CLASS.CONDITIONAL,
      policy: {
        allowed_repos: ['KrisCrispy-spec/Quantum-pi-forge'],
      },
      approval_required: false,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'github.merge',
      provider: 'github',
      scope: 'merge pull requests on protected branches',
      permitted_operations: ['merge_pr'],
      credential_dependency: 'github-token',
      policy_class: POLICY_CLASS.HUMAN_APPROVAL,
      policy: {},
      approval_required: true,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'delivery.x.public_post',
      provider: 'delivery',
      scope: 'publish approved X/Twitter delivery content',
      permitted_operations: ['post'],
      credential_dependency: 'delivery-x',
      policy_class: POLICY_CLASS.HUMAN_APPROVAL,
      policy: {},
      approval_required: true,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'pi.read',
      provider: 'pi',
      scope: 'read Pi network / app status when provisioned',
      permitted_operations: ['read_status', 'read_payment'],
      credential_dependency: 'pi-api',
      policy_class: POLICY_CLASS.FORBIDDEN,
      policy: { reason: 'Pi remains dormant until GO PI_PORTAL_RECORD + bootstrap' },
      approval_required: true,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'wallet.prepare_transaction',
      provider: 'wallet',
      scope: 'prepare unsigned transaction intents for policy evaluation',
      permitted_operations: ['prepare'],
      credential_dependency: null,
      policy_class: POLICY_CLASS.CONDITIONAL,
      policy: {
        signing_enabled: false,
        max_amount_wei: null,
        allowed_networks: ['0g-galileo-testnet', '0g-aristotle-mainnet'],
      },
      approval_required: false,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'wallet.sign_transaction',
      provider: 'wallet',
      scope: 'sign prepared transactions (disabled in dev/test; human in prod)',
      permitted_operations: ['sign'],
      credential_dependency: 'wallet-signer',
      policy_class: POLICY_CLASS.FORBIDDEN,
      policy: {
        reason: 'Real signing disabled in SCCB v1; economics LOCKED; no fund movement',
        signing_enabled: false,
      },
      approval_required: true,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: '0g.submit_transaction',
      provider: '0g',
      scope: 'broadcast signed transactions to 0G network',
      permitted_operations: ['submit'],
      credential_dependency: null,
      policy_class: POLICY_CLASS.FORBIDDEN,
      policy: {
        reason: 'Broadcast disabled until explicit economic/signing GO',
      },
      approval_required: true,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'economics.mint',
      provider: 'economics',
      scope: 'token mint operations',
      permitted_operations: ['mint'],
      credential_dependency: null,
      policy_class: POLICY_CLASS.FORBIDDEN,
      policy: { reason: 'Mint remains LOCKED' },
      approval_required: true,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
    {
      id: 'economics.liquidity',
      provider: 'economics',
      scope: 'liquidity provision operations',
      permitted_operations: ['add_liquidity', 'remove_liquidity'],
      credential_dependency: null,
      policy_class: POLICY_CLASS.FORBIDDEN,
      policy: { reason: 'Liquidity remains LOCKED' },
      approval_required: true,
      audit: { ...auditDefault },
      status: CAPABILITY_STATUS.ACTIVE,
    },
  ];
}
