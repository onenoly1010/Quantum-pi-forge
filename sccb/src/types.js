/**
 * SCCB v1 — shared constants and type documentation.
 * Secrets never appear in these structures.
 */

/** @typedef {'PREAUTHORIZED'|'CONDITIONAL'|'HUMAN_APPROVAL'|'FORBIDDEN'} PolicyClass */

/** @typedef {'active'|'revoked'|'disabled'|'expired'|'unknown'} CredentialStatus */

/** @typedef {'active'|'revoked'|'paused'} CapabilityStatus */

/** @typedef {'ALLOW'|'DENY'|'ESCALATE'} PolicyDecision */

/** @typedef {'PENDING'|'APPROVED'|'REJECTED'|'NOT_REQUIRED'|'BLOCKED'} ApprovalState */

/** @typedef {'NOT_STARTED'|'SKIPPED'|'SUCCESS'|'FAIL'|'BLOCKED'|'DRY_RUN'} ExecutionState */

/** @typedef {'development'|'test'|'production'} EnvironmentClass */

export const POLICY_CLASS = Object.freeze({
  PREAUTHORIZED: 'PREAUTHORIZED',
  CONDITIONAL: 'CONDITIONAL',
  HUMAN_APPROVAL: 'HUMAN_APPROVAL',
  FORBIDDEN: 'FORBIDDEN',
});

export const CREDENTIAL_STATUS = Object.freeze({
  ACTIVE: 'active',
  REVOKED: 'revoked',
  DISABLED: 'disabled',
  EXPIRED: 'expired',
  UNKNOWN: 'unknown',
});

export const CAPABILITY_STATUS = Object.freeze({
  ACTIVE: 'active',
  REVOKED: 'revoked',
  PAUSED: 'paused',
});

export const POLICY_DECISION = Object.freeze({
  ALLOW: 'ALLOW',
  DENY: 'DENY',
  ESCALATE: 'ESCALATE',
});

export const APPROVAL_STATE = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  NOT_REQUIRED: 'NOT_REQUIRED',
  BLOCKED: 'BLOCKED',
});

export const EXECUTION_STATE = Object.freeze({
  NOT_STARTED: 'NOT_STARTED',
  SKIPPED: 'SKIPPED',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  BLOCKED: 'BLOCKED',
  DRY_RUN: 'DRY_RUN',
});

export const ENVIRONMENT = Object.freeze({
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
});

/** Exact field names for secret *values* — not audit flags like secret_exposed_to_llm */
export const SECRET_FIELD_PATTERNS = Object.freeze([
  /^password$/i,
  /^passwd$/i,
  /^secret$/i,
  /^secrets$/i,
  /^private[_-]?key$/i,
  /^seed[_-]?phrase$/i,
  /^mnemonic$/i,
  /^api[_-]?key$/i,
  /^api[_-]?token$/i,
  /^access[_-]?token$/i,
  /^refresh[_-]?token$/i,
  /^bearer$/i,
  /^authorization$/i,
  /^credential$/i,
  /^credentials$/i,
  /^passphrase$/i,
  /^wallet[_-]?key$/i,
  /^token$/i,
  /^plaintext$/i,
  /^client_secret$/i,
]);

export const SCCB_VERSION = '1.0.0';
