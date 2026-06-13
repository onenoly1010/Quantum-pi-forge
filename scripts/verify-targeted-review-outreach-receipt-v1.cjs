#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

const receiptPath = 'receipts/governance/targeted-review-outreach-receipt-v1.json';
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));

function fail(msg) {
  console.error(`FAIL targeted-review-outreach-receipt-v1: ${msg}`);
  process.exit(1);
}

function sha256(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}

if (receipt.schema !== 'targeted-review-outreach-receipt-v1') fail('bad schema');
if (receipt.source_canonical_main !== '243882c') fail('bad source canonical main');
if (receipt.determinism_manifest_sha256 !== 'c909b22dc277e9885f6a4781455835b53c5381097f730673da0b56adb83c3ded') fail('bad determinism sha');

if (!receipt.posture) fail('missing posture');
for (const key of ['deployments', 'chain_actions', 'publishes', 'keys_used', 'execution_receipt_present']) {
  if (receipt.posture[key] !== false) fail(`posture ${key} must be false`);
}
if (receipt.posture.mode !== 'evidence_only_manual_outreach') fail('bad posture mode');

if (fs.existsSync('receipts/execution/v2-mainnet-cutover-execution-v1.json')) {
  fail('execution receipt exists');
}

if (!fs.existsSync(receipt.outreach_log)) fail('outreach log missing');
if (sha256(receipt.outreach_log) !== receipt.outreach_log_sha256) fail('outreach log sha mismatch');

const log = fs.readFileSync(receipt.outreach_log, 'utf8').trimEnd().split(/\n/);
const expectedHeader = 'timestamp_utc\ttarget\tchannel\tlink_or_handle\tmessage_file\tresponse_status\tnotes';
if (log[0] !== expectedHeader) fail('bad outreach log header');

let realRows = 0;
for (let i = 1; i < log.length; i++) {
  const fields = log[i].split('\t');
  if (fields.length !== 7) fail(`bad field count on line ${i + 1}`);
  const [, target, channel, linkOrHandle, messageFile, responseStatus] = fields;
  if (!target || !channel || !linkOrHandle || !messageFile) fail(`empty required field on line ${i + 1}`);
  if (!['short-dm-message.md', 'discord-forum-message.md', 'email-message.md'].includes(messageFile)) {
    fail(`bad message file on line ${i + 1}`);
  }
  if (
    linkOrHandle !== '#builders-or-review-channel' &&
    linkOrHandle !== '@handle-or-name' &&
    linkOrHandle !== 'email-or-name' &&
    responseStatus === 'sent'
  ) {
    realRows++;
  }
}

if (realRows < 1) fail('no real outreach rows');
if (receipt.real_outreach_rows !== realRows) fail('real outreach row count mismatch');

for (const item of Object.values(receipt.message_files || {})) {
  if (!item.path || !item.sha256) fail('bad message file receipt entry');
  if (!fs.existsSync(item.path)) fail(`missing message file ${item.path}`);
  if (sha256(item.path) !== item.sha256) fail(`sha mismatch for ${item.path}`);
}

console.log('PASS targeted-review-outreach-receipt-v1');
console.log(`real_outreach_rows=${realRows}`);
console.log(`outreach_log_sha256=${receipt.outreach_log_sha256}`);
