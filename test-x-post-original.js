// test-x-post.js - Exact implementation as specified
require('dotenv').config();
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const got = require('got');

const oauth = OAuth({
  consumer: { key: process.env.X_API_KEY, secret: process.env.X_API_SECRET },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

const token = {
  key: process.env.X_ACCESS_TOKEN,
  secret: process.env.X_ACCESS_SECRET,
};

async function testPost() {
  const url = 'https://api.x.com/2/tweets';
  const requestData = { url, method: 'POST' };
  const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

  try {
    const response = await got.post(url, {
      json: { text: "Test from local OINIO sovereign agent — resonance check ✅" },
      headers: {
        Authorization: authHeader.Authorization,
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
    console.log("✅ Success! Tweet ID:", response.body.data.id);
  } catch (err) {
    console.error("❌ Failed:", err.response?.body || err.message);
  }
}

testPost();