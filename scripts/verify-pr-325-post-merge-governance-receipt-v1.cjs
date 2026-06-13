#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const cp = require('child_process');

const receiptPath = 'receipts/governance/pr-325-post-merge-governance-receipt-v1.json';

function fail(message) {
  console.error(`FAIL pr-325-post-merge-governance-receipt-v1: ${message}`);
  process.exit(1);
}

function sh(cmd) {
  return cp.execSync(cmd, { encoding: 'utf8' }).trim();
}

function sha256File(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));

if (receipt.schema !== 'qpf.governance.pr_post_merge_receipt.v1') fail('invalid schema');
if (receipt.pr !== 325) fail('invalid PR number');
if (receipt.branch !== 'main') fail('invalid branch');
if (!receipt.merged_main_head_full) fail('missing merged main head');

const requiredFiles = [
  'docs/governance/NPM_AUDIT_HARDENING_EVIDENCE_V1.md',
  'receipts/governance/npm-audit-hardening-evidence-v1.json',
  'scripts/verify-npm-audit-hardening-evidence-v1.cjs',
  'package.json'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) fail(`missing merged file: ${file}`);
}

try {
  cp.execSync(`git merge-base --is-ancestor ${receipt.merged_main_head_full} HEAD`, { stdio: 'ignore' });
} catch {
  fail('merged main head is not an ancestor of current HEAD');
}

if (receipt.hashes.npm_audit_hardening_document_sha256 !== sha256File('docs/governance/NPM_AUDIT_HARDENING_EVIDENCE_V1.md')) {
  fail('npm audit hardening document hash mismatch');
}

if (receipt.hashes.npm_audit_hardening_receipt_sha256 !== sha256File('receipts/governance/npm-audit-hardening-evidence-v1.json')) {
  fail('npm audit hardening receipt hash mismatch');
}

for (const [key, value] of Object.entries(receipt.posture || {})) {
  if (key === 'evidence_only') {
    if (value !== true) fail('evidence_only posture not true');
  } else {
    if (value !== false) fail(`posture flag not false: ${key}`);
  }
}

if (fs.existsSync('receipts/execution/v2-mainnet-cutover-execution-v1.json')) {
  fail('execution receipt present');
}

console.log('PASS pr-325-post-merge-governance-receipt-v1');
console.log(`merged_main_head=${receipt.merged_main_head_short}`);
console.log(`current_head=${sh('git rev-parse --short HEAD')}`);
