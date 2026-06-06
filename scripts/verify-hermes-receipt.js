#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const receiptPath = process.argv[2];
if (!receiptPath) {
  console.error('Usage: node scripts/verify-hermes-receipt.js <receipt.json>');
  process.exit(1);
}

let receipt;
try {
  receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
} catch (e) {
  console.error('Failed to parse receipt:', e.message);
  process.exit(1);
}

// Basic schema validation (simplified; full validation could use ajv)
if (receipt.schemaVersion !== 'hermes-receipt-v1') {
  console.error(`Invalid schemaVersion: ${receipt.schemaVersion}`);
  process.exit(1);
}
if (receipt.mode !== 'local-read-only' && receipt.mode !== 'replay-verify') {
  console.error(`Invalid mode: ${receipt.mode}`);
  process.exit(1);
}
if (receipt.model.provider !== 'ollama') {
  console.error(`Unsupported provider: ${receipt.model.provider}`);
  process.exit(1);
}

// Re-run inference (assumes 'ollama run ${modelName}' returns output)
const modelName = receipt.model.name;
const inputText = (receipt.input.kind === 'prompt')
  ? (receipt.input.path ? fs.readFileSync(receipt.input.path, 'utf8') : '')
  : '';

try {
  const output = execSync(`ollama run ${modelName} "${inputText}"`, { encoding: 'utf8' });
  const outputHash = crypto.createHash('sha256').update(output.trim()).digest('hex');
  if (outputHash !== receipt.output.sha256) {
    console.error(`Output hash mismatch.
Expected: ${receipt.output.sha256}
Got:      ${outputHash}`);
    process.exit(1);
  }
  console.log('✓ Receipt verified: output matches.');
  process.exit(0);
} catch (err) {
  console.error('Replay failed:', err.message);
  process.exit(1);
}
