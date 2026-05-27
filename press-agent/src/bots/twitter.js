'use strict';

async function send(message) {
  const apiKey = process.env.TWITTER_API_KEY;

  if (!apiKey) {
    return { ok: false, skipped: true, reason: 'TWITTER_API_KEY not set' };
  }

  console.log('[twitter] send requested:', typeof message === 'string' ? message : JSON.stringify(message));
  return { ok: true, dryRun: true };
}

module.exports = { send };
