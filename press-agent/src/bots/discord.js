'use strict';

async function send(message) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return { ok: false, skipped: true, reason: 'DISCORD_WEBHOOK_URL not set' };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: typeof message === 'string' ? message : JSON.stringify(message, null, 2),
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
  }

  return { ok: true };
}

module.exports = { send };
