#!/usr/bin/env node

require('dotenv').config();

const https = require('https');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Configuration
const ROUTER_URL = process.env.OG_COMPUTE_ROUTER_URL || 'https://router-api.0g.ai/v1';
const API_KEY = process.env.OG_COMPUTE_API_KEY || '';
const MODEL = process.env.OG_COMPUTE_MODEL || '0GM-1.0-35B-A3B';
const JSON_OUTPUT = process.argv.includes('--json');

// State
const results = {
  ROUTER_MODELS: { status: 'UNKNOWN', details: {} },
  ROUTER_CHAT: { status: 'UNKNOWN', details: {} },
  DIRECT_PROVIDER: { status: 'UNKNOWN', details: {} }
};

/**
 * Make an HTTPS request
 */
function httpsRequest(endpoint, method, headers, body) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers
    };

    const req = https.request(endpoint, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

/**
 * Test 1: GET /models
 */
async function testRouterModels() {
  try {
    if (!API_KEY) {
      results.ROUTER_MODELS = {
        status: 'FAIL',
        details: { error: 'OG_COMPUTE_API_KEY not set' }
      };
      return;
    }

    const cleanUrl = ROUTER_URL.replace(/\/$/, '');
    const endpoint = `${cleanUrl}/models`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };

    const response = await httpsRequest(endpoint, 'GET', headers, null);

    if (response.statusCode === 200) {
      try {
        const json = JSON.parse(response.body);
        const modelCount = json.data ? json.data.length : 0;
        results.ROUTER_MODELS = {
          status: 'PASS',
          details: {
            statusCode: response.statusCode,
            modelCount,
            requestId: response.headers['x-request-id'] || undefined
          }
        };
      } catch (e) {
        results.ROUTER_MODELS = {
          status: 'FAIL',
          details: { error: 'Failed to parse response', statusCode: response.statusCode }
        };
      }
    } else {
      results.ROUTER_MODELS = {
        status: 'FAIL',
        details: { statusCode: response.statusCode }
      };
    }
  } catch (error) {
    results.ROUTER_MODELS = {
      status: 'FAIL',
      details: { error: error.message }
    };
  }
}

/**
 * Test 2: POST /chat/completions
 */
async function testRouterChat() {
  try {
    if (!API_KEY) {
      results.ROUTER_CHAT = {
        status: 'FAIL',
        details: { error: 'OG_COMPUTE_API_KEY not set' }
      };
      return;
    }

    const cleanUrl = ROUTER_URL.replace(/\/$/, '');
    const endpoint = `${cleanUrl}/chat/completions`;

    const body = JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'Answer directly. Do not explain.' },
        { role: 'user', content: 'Say exactly this phrase: OINIO router path online' }
      ],
      max_tokens: 64
    });

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'Authorization': `Bearer ${API_KEY}`
    };

    const response = await httpsRequest(endpoint, 'POST', headers, body);

    if (response.statusCode === 200) {
      try {
        const json = JSON.parse(response.body);
        const responseText = json.choices?.[0]?.message?.content || '';
        results.ROUTER_CHAT = {
          status: 'PASS',
          details: {
            statusCode: response.statusCode,
            responseLength: responseText.length,
            requestId: json.request_id || undefined
          }
        };
      } catch (e) {
        results.ROUTER_CHAT = {
          status: 'FAIL',
          details: { error: 'Failed to parse response', statusCode: response.statusCode }
        };
      }
    } else if (response.statusCode === 402) {
      try {
        const json = JSON.parse(response.body);
        results.ROUTER_CHAT = {
          status: 'WARN',
          details: {
            statusCode: response.statusCode,
            errorType: json.error?.type || 'unknown',
            errorCode: json.error?.code || 'unknown',
            errorMessage: json.error?.message || 'Payment required',
            requestId: json.request_id || undefined
          }
        };
      } catch (e) {
        results.ROUTER_CHAT = {
          status: 'WARN',
          details: { statusCode: 402, reason: 'Payment error' }
        };
      }
    } else {
      try {
        const json = JSON.parse(response.body);
        results.ROUTER_CHAT = {
          status: 'FAIL',
          details: {
            statusCode: response.statusCode,
            error: json.error?.message || 'Unknown error',
            requestId: json.request_id || undefined
          }
        };
      } catch (e) {
        results.ROUTER_CHAT = {
          status: 'FAIL',
          details: { statusCode: response.statusCode }
        };
      }
    }
  } catch (error) {
    results.ROUTER_CHAT = {
      status: 'FAIL',
      details: { error: error.message }
    };
  }
}

/**
 * Test 3: Direct provider (call as child process)
 */
function testDirectProvider() {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, 'query-0g-direct-provider.js');

    if (!fs.existsSync(scriptPath)) {
      results.DIRECT_PROVIDER = {
        status: 'FAIL',
        details: { error: 'Direct provider script not found' }
      };
      resolve();
      return;
    }

    const child = spawn('node', [scriptPath], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        results.DIRECT_PROVIDER = {
          status: 'PASS',
          details: {
            exitCode: 0,
            hasOutput: stdout.length > 0
          }
        };
      } else {
        results.DIRECT_PROVIDER = {
          status: 'FAIL',
          details: {
            exitCode: code,
            error: stderr || 'Process failed'
          }
        };
      }
      resolve();
    });

    child.on('error', (error) => {
      results.DIRECT_PROVIDER = {
        status: 'FAIL',
        details: { error: error.message }
      };
      resolve();
    });
  });
}

/**
 * Print results
 */
function printResults() {
  if (JSON_OUTPUT) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log('=== 0G Compute Health Check ===\n');
    console.log(`ROUTER_MODELS=${results.ROUTER_MODELS.status}`);
    console.log(`ROUTER_CHAT=${results.ROUTER_CHAT.status}`);
    console.log(`DIRECT_PROVIDER=${results.DIRECT_PROVIDER.status}`);
    console.log();

    // Print details if any non-PASS status
    const hasNonPass = Object.values(results).some(r => r.status !== 'PASS');
    if (hasNonPass) {
      console.log('=== Details ===\n');
      Object.entries(results).forEach(([key, result]) => {
        if (result.status !== 'PASS') {
          console.log(`${key}:`);
          console.log(`  Status: ${result.status}`);
          if (result.details.requestId) {
            console.log(`  Request ID: ${result.details.requestId}`);
          }
          if (result.details.error) {
            console.log(`  Error: ${result.details.error}`);
          }
          if (result.details.errorMessage) {
            console.log(`  Message: ${result.details.errorMessage}`);
          }
          if (result.details.statusCode) {
            console.log(`  HTTP Status: ${result.details.statusCode}`);
          }
          console.log();
        }
      });
    }
  }
}

/**
 * Determine exit code
 */
function getExitCode() {
  const statuses = Object.values(results).map(r => r.status);
  if (statuses.includes('FAIL')) return 1;
  if (statuses.includes('WARN')) return 0; // Warnings don't fail
  return 0;
}

/**
 * Main
 */
async function main() {
  try {
    await testRouterModels();
    await testRouterChat();
    await testDirectProvider();

    printResults();
    process.exit(getExitCode());
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
