#!/usr/bin/env node

require('dotenv').config();

const https = require('https');
const url = require('url');

// Configuration
const ROUTER_URL = process.env.OG_COMPUTE_ROUTER_URL || 'https://router-api.0g.ai/v1';
const API_KEY = process.env.OG_COMPUTE_API_KEY || '';
const MODEL = process.env.OG_COMPUTE_MODEL || '0GM-1.0-35B-A3B';

// Diagnostic output
console.log('=== 0G Router Chat Endpoint Diagnostics ===\n');
console.log(`Router URL: ${ROUTER_URL}`);
console.log(`Model: ${MODEL}`);
console.log(`API key present: ${API_KEY ? 'YES' : 'NO'}\n`);

// Fail safely if API key is missing
if (!API_KEY) {
  console.error('Error: OG_COMPUTE_API_KEY is not set');
  process.exit(1);
}

// Construct endpoint URL
const cleanUrl = ROUTER_URL.replace(/\/$/, '');
const endpoint = `${cleanUrl}/chat/completions`;

// Parse URL
const parsedUrl = new url.URL(endpoint);

// Request payload
const requestBody = JSON.stringify({
  model: MODEL,
  messages: [
    { role: 'system', content: 'Answer directly. Do not explain.' },
    { role: 'user', content: 'Say exactly this phrase: OINIO router path online' }
  ],
  max_tokens: 64
});

// Make request
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestBody),
    'Authorization': `Bearer ${API_KEY}`
  }
};

const req = https.request(endpoint, options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`HTTP Status: ${res.statusCode}`);

    // Try to parse JSON response
    let parsedResponse = null;
    try {
      parsedResponse = JSON.parse(responseData);
    } catch (e) {
      // Response is not JSON
    }

    if (parsedResponse) {
      console.log('\nParsed JSON Response:');
      if (parsedResponse.error) {
        console.log(`  error.type: ${parsedResponse.error.type || 'N/A'}`);
        console.log(`  error.code: ${parsedResponse.error.code || 'N/A'}`);
        console.log(`  error.message: ${parsedResponse.error.message || 'N/A'}`);
      }
      if (parsedResponse.request_id) {
        console.log(`  request_id: ${parsedResponse.request_id}`);
      }
      if (parsedResponse.choices && parsedResponse.choices[0]) {
        console.log(`  response: ${parsedResponse.choices[0].message?.content || 'N/A'}`);
      }
      if (parsedResponse.usage) {
        console.log(`  tokens used: ${parsedResponse.usage.total_tokens || 'N/A'}`);
      }
    } else if (responseData) {
      console.log(`\nResponse (raw): ${responseData}`);
    }

    // Determine exit code
    if (res.statusCode === 200) {
      process.exit(0);
    } else if (res.statusCode === 402) {
      process.exit(2);
    } else {
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`Network Error: ${error.message}`);
  process.exit(1);
});

req.write(requestBody);
req.end();
