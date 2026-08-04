'use strict';

const path = require('path');

const DELIVERY_MODES = new Set(['disabled', 'dry_run', 'live']);

function readConfig(env = process.env) {
  const mode = env.OUTREACH_DELIVERY_MODE || 'disabled';

  if (!DELIVERY_MODES.has(mode)) {
    throw new Error(`Invalid OUTREACH_DELIVERY_MODE: ${mode}`);
  }

  return {
    mode,
    evidenceDir: env.OUTREACH_EVIDENCE_DIR
      ? path.resolve(env.OUTREACH_EVIDENCE_DIR)
      : path.resolve(__dirname, '../../../receipts/outreach/delivery'),
    liveAcknowledgement: env.OUTREACH_LIVE_SEND_ACK === 'ENABLE_APPROVED_DELIVERY',
  };
}

function credentialStatus(requiredSecrets, env = process.env) {
  const missing = requiredSecrets.filter((name) => !env[name]);

  return {
    ready: missing.length === 0,
    missing,
  };
}

module.exports = {
  credentialStatus,
  readConfig,
};
