#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const cp = require('child_process');

const docPath = 'docs/press-agent/PRESS_AGENT_READONLY_READINESS_V1.md';
const receiptPath = 'receipts/press-agent/press-agent-readonly-readiness-v1.json';

function fail(message) {
  console.error(`FAIL press-agent-readonly-readiness-v1: ${message}`);
  process.exit(1);
}

function sh(cmd) {
  return cp.execSync(cmd, { encoding: 'utf8' }).trim();
}

function sha256File(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}

if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);
if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));

if (receipt.schema !== 'qpf.press_agent.readonly_readiness.v1') fail('invalid schema');
if (receipt.document !== docPath) fail('document path mismatch');
if (receipt.document_sha256 !== sha256File(docPath)) fail('document sha256 mismatch');

try {
  cp.execSync(`git merge-base --is-ancestor ${receipt.canonical_head_full} HEAD`, { stdio: 'ignore' });
} catch {
  fail('receipt canonical head is not ancestor of current HEAD');
}

for (const [key, value] of Object.entries(receipt.posture || {})) {
  if (key === 'read_only') {
    if (value !== true) fail('read_only posture not true');
  } else if (value !== false) {
    fail(`posture flag not false: ${key}`);
  }
}

if (fs.existsSync('receipts/execution/v2-mainnet-cutover-execution-v1.json')) {
  fail('execution receipt present');
}

console.log('PASS press-agent-readonly-readiness-v1');
console.log(`document_sha256=${receipt.document_sha256}`);
