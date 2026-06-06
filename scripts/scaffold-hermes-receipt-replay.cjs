#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Schema JSON
const schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://quantumpiforge.com/evidence/hermes/schemas/receipt-v1.schema.json",
  "title": "Quantum Pi Forge Hermes Receipt v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schemaVersion",
    "receiptId",
    "evidenceId",
    "mode",
    "model",
    "input",
    "output",
    "timestamp",
    "authority"
  ],
  "properties": {
    "schemaVersion": { "type": "string", "const": "hermes-receipt-v1" },
    "receiptId": { "type": "string", "pattern": "^QPF-HERMES-RECEIPT-[A-Za-z0-9._:-]+$" },
    "evidenceId": { "type": "string", "description": "Claim, evidence, or canonical index ID this receipt is bound to." },
    "mode": { "type": "string", "enum": ["local-read-only", "replay-verify"] },
    "model": {
      "type": "object",
      "additionalProperties": false,
      "required": ["provider", "name"],
      "properties": {
        "provider": { "type": "string", "enum": ["ollama"] },
        "name": { "type": "string", "minLength": 1 },
        "digest": { "type": "string", "description": "Optional Ollama model digest if available." }
      }
    },
    "input": {
      "type": "object",
      "additionalProperties": false,
      "required": ["kind", "sha256"],
      "properties": {
        "kind": { "type": "string", "enum": ["prompt", "evidence-reference", "file"] },
        "path": { "type": "string" },
        "sha256": { "type": "string", "pattern": "^[a-f0-9]{64}$" }
      }
    },
    "output": {
      "type": "object",
      "additionalProperties": false,
      "required": ["sha256"],
      "properties": {
        "path": { "type": "string" },
        "sha256": { "type": "string", "pattern": "^[a-f0-9]{64}$" }
      }
    },
    "timestamp": { "type": "string", "format": "date-time" },
    "localSignature": {
      "type": "object",
      "additionalProperties": false,
      "required": ["present"],
      "properties": {
        "present": { "type": "boolean" },
        "algorithm": { "type": "string" },
        "publicKeyFingerprint": { "type": "string" },
        "signatureSha256": { "type": "string", "pattern": "^[a-f0-9]{64}$" }
      }
    },
    "authority": {
      "type": "object",
      "additionalProperties": false,
      "required": ["readOnly", "noPosting", "noWalletSigning", "noDeployment", "noChainMutation"],
      "properties": {
        "readOnly": { "type": "boolean", "const": true },
        "noPosting": { "type": "boolean", "const": true },
        "noWalletSigning": { "type": "boolean", "const": true },
        "noDeployment": { "type": "boolean", "const": true },
        "noChainMutation": { "type": "boolean", "const": true }
      }
    }
  }
};

// Claim markdown
const claim = `# QPF-HERMES-RECEIPT-REPLAY-v1

## Claim

Hermes local inference receipts can be structurally verified against a committed receipt schema before any replay or trust claim is accepted.

## Scope

This claim covers schema-level validation only.

It does not authorize:
- live posting
- wallet signing
- token minting
- staking
- deployment
- governance execution
- chain mutation

## Verification target

- \`evidence/hermes/schemas/receipt-v1.schema.json\`

## Required invariant

A valid Hermes receipt must declare:
- schema version
- receipt ID
- bound evidence ID
- local model provider/name
- input SHA-256
- output SHA-256
- timestamp
- explicit read-only authority boundary

## Status

Drafted for Hermes Receipt Replay Verification lane.
`;

// Verify script (Node.js)
const verifyScript = `#!/usr/bin/env node

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
  console.error(\`Invalid schemaVersion: \${receipt.schemaVersion}\`);
  process.exit(1);
}
if (receipt.mode !== 'local-read-only' && receipt.mode !== 'replay-verify') {
  console.error(\`Invalid mode: \${receipt.mode}\`);
  process.exit(1);
}
if (receipt.model.provider !== 'ollama') {
  console.error(\`Unsupported provider: \${receipt.model.provider}\`);
  process.exit(1);
}

// Re-run inference (assumes 'ollama run \${modelName}' returns output)
const modelName = receipt.model.name;
const inputText = (receipt.input.kind === 'prompt')
  ? (receipt.input.path ? fs.readFileSync(receipt.input.path, 'utf8') : '')
  : '';

try {
  const output = execSync(\`ollama run \${modelName} "\${inputText}"\`, { encoding: 'utf8' });
  const outputHash = crypto.createHash('sha256').update(output.trim()).digest('hex');
  if (outputHash !== receipt.output.sha256) {
    console.error(\`Output hash mismatch.\nExpected: \${receipt.output.sha256}\nGot:      \${outputHash}\`);
    process.exit(1);
  }
  console.log('✓ Receipt verified: output matches.');
  process.exit(0);
} catch (err) {
  console.error('Replay failed:', err.message);
  process.exit(1);
}
`;

// PR body
const prBody = `## Scope

Adds Hermes receipt replay verification:

- JSON schema for local inference receipts (\`evidence/hermes/schemas/receipt-v1.schema.json\`)
- Claim document (\`evidence/claims/QPF-HERMES-RECEIPT-REPLAY-v1.md\`)
- Verification script (\`scripts/verify-hermes-receipt.js\`)

## Boundary

This is schema + verification only.

It does not authorize:
- live posting
- wallet signing
- token minting
- staking
- deployment
- governance execution
- chain mutation

## Verification

Run:

\`\`\`bash
bash scripts/local-ci-surrogate.sh
\`\`\`

To test a receipt, generate one first (e.g., via \`scripts/hermes-run.sh\`), then run:

\`\`\`bash
npm run verify:receipt -- path/to/receipt.json
\`\`\`
`;

// Write files
ensureDir(path.join(baseDir, 'evidence', 'hermes', 'schemas'));
ensureDir(path.join(baseDir, 'evidence', 'claims'));
ensureDir(path.join(baseDir, 'scripts'));

fs.writeFileSync(
  path.join(baseDir, 'evidence', 'hermes', 'schemas', 'receipt-v1.schema.json'),
  JSON.stringify(schema, null, 2) + '\n'
);
fs.writeFileSync(
  path.join(baseDir, 'evidence', 'claims', 'QPF-HERMES-RECEIPT-REPLAY-v1.md'),
  claim
);
fs.writeFileSync(
  path.join(baseDir, 'scripts', 'verify-hermes-receipt.js'),
  verifyScript
);
fs.writeFileSync(
  '/tmp/hermes-receipt-replay-pr.md',
  prBody
);

// Make verify script executable
fs.chmodSync(path.join(baseDir, 'scripts', 'verify-hermes-receipt.js'), 0o755);

console.log('✓ Generated:');
console.log('  evidence/hermes/schemas/receipt-v1.schema.json');
console.log('  evidence/claims/QPF-HERMES-RECEIPT-REPLAY-v1.md');
console.log('  scripts/verify-hermes-receipt.js');
console.log('  /tmp/hermes-receipt-replay-pr.md');
console.log('\nNext steps:');
console.log('  git add evidence/hermes evidence/claims scripts/verify-hermes-receipt.js');
console.log('  git commit -m "Add Hermes receipt replay verification"');
console.log('  bash scripts/local-ci-surrogate.sh');
console.log('  git push -u origin feature/hermes-receipt-replay-v2');
console.log('  scripts/gh-pr-create-file.sh main feature/hermes-receipt-replay-v2 "Add Hermes receipt replay verification" /tmp/hermes-receipt-replay-pr.md');
