'use strict';

const crypto = require('crypto');

function percentEncode(value) {
  return encodeURIComponent(value)
    .replace(/[!*()']/g, char => '%' + char.charCodeAt(0).toString(16).toUpperCase());
}

function buildOAuthHeader({ method, url, apiKey, apiSecret, accessToken, accessSecret }) {
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const parameterString = Object.keys(oauthParams)
    .sort()
    .map(key => `${percentEncode(key)}=${percentEncode(oauthParams[key])}`)
    .join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(parameterString),
  ].join('&');

  const signingKey = `${percentEncode(apiSecret)}&${percentEncode(accessSecret)}`;

  oauthParams.oauth_signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  return 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${percentEncode(key)}="${percentEncode(oauthParams[key])}"`)
    .join(', ');
}

function normalizeMessage(message) {
  const text = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  return text.length > 280 ? text.slice(0, 277) + '...' : text;
}

async function send(message) {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  const text = normalizeMessage(message);

  const missing = [
    ['TWITTER_API_KEY', apiKey],
    ['TWITTER_API_SECRET', apiSecret],
    ['TWITTER_ACCESS_TOKEN', accessToken],
    ['TWITTER_ACCESS_SECRET', accessSecret],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    return {
      ok: false,
      skipped: true,
      reason: `Missing X/Twitter credentials: ${missing.join(', ')}`,
    };
  }

  if (process.env.PRESS_AGENT_LIVE_X_POST !== '1') {
    console.log('[twitter] dry-run send requested:', text);
    return { ok: true, dryRun: true, text };
  }

  const url = 'https://api.twitter.com/2/tweets';
  const method = 'POST';

  const authorization = buildOAuthHeader({
    method,
    url,
    apiKey,
    apiSecret,
    accessToken,
    accessSecret,
  });

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`X/Twitter post failed: ${response.status} ${response.statusText} ${body}`);
  }

  return {
    ok: true,
    dryRun: false,
    response: body ? JSON.parse(body) : null,
  };
}

module.exports = { send };
