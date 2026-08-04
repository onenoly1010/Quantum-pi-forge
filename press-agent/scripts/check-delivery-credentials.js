'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const opaqueValueStatus = (name) => {
  const value = process.env[name];

  if (!value) {
    return 'missing';
  }

  return /\s/.test(value) ? 'invalid format' : 'configured';
};

const enumStatus = (name, allowed) => {
  const value = process.env[name];

  if (!value) {
    return 'missing';
  }

  return allowed.has(value) ? 'configured' : 'invalid format';
};

const emailStatus = (name) => {
  const value = process.env[name];

  if (!value) {
    return 'missing';
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? 'configured'
    : 'invalid format';
};

const providerStatus = (name) => {
  const value = process.env[name];

  if (!value) {
    return 'missing';
  }

  return /^[a-z0-9][a-z0-9_-]{1,63}$/i.test(value)
    ? 'configured'
    : 'invalid format';
};

const httpsUrlStatus = (name) => {
  const value = process.env[name];

  if (!value) {
    return 'missing';
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password
      ? 'configured'
      : 'invalid format';
  } catch {
    return 'invalid format';
  }
};

const evidenceDirectoryStatus = () => {
  const configuredPath = process.env.OUTREACH_EVIDENCE_DIR;

  if (!configuredPath) {
    return 'missing';
  }

  try {
    const resolved = path.resolve(configuredPath);
    const parent = fs.existsSync(resolved) ? resolved : path.dirname(resolved);
    fs.accessSync(parent, fs.constants.W_OK);
    return 'configured';
  } catch {
    return 'invalid format';
  }
};

const checks = [
  ['OUTREACH_DELIVERY_MODE', enumStatus('OUTREACH_DELIVERY_MODE', new Set(['disabled', 'dry_run', 'live']))],
  ['OUTREACH_EVIDENCE_DIR', evidenceDirectoryStatus()],
  ['OUTREACH_LIVE_SEND_ACK', enumStatus('OUTREACH_LIVE_SEND_ACK', new Set(['ENABLE_APPROVED_DELIVERY']))],
  ['TWITTER_API_KEY', opaqueValueStatus('TWITTER_API_KEY')],
  ['TWITTER_API_SECRET', opaqueValueStatus('TWITTER_API_SECRET')],
  ['TWITTER_ACCESS_TOKEN', opaqueValueStatus('TWITTER_ACCESS_TOKEN')],
  ['TWITTER_ACCESS_SECRET', opaqueValueStatus('TWITTER_ACCESS_SECRET')],
  ['PRESS_AGENT_LIVE_X_POST', enumStatus('PRESS_AGENT_LIVE_X_POST', new Set(['1']))],
  ['EMAIL_PROVIDER', providerStatus('EMAIL_PROVIDER')],
  ['EMAIL_API_KEY', opaqueValueStatus('EMAIL_API_KEY')],
  ['EMAIL_FROM', emailStatus('EMAIL_FROM')],
  ['CONTACT_FORM_PROVIDER', providerStatus('CONTACT_FORM_PROVIDER')],
  ['CONTACT_FORM_ENDPOINT', httpsUrlStatus('CONTACT_FORM_ENDPOINT')],
  ['CONTACT_FORM_API_KEY', opaqueValueStatus('CONTACT_FORM_API_KEY')],
];

console.log(JSON.stringify({
  schema: 'qpf.delivery_credential_health.v1',
  checkedAtUtc: new Date().toISOString(),
  checks: checks.map(([name, status]) => ({ name, status })),
}, null, 2));
