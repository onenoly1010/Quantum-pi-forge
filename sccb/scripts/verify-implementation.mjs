#!/usr/bin/env node
/**
 * SCCB implementation verification — synthetic fixtures only.
 * Produces machine-readable evidence under receipts/sccb/.
 *
 * Does NOT: deploy, migrate secrets, connect wallets, sign, activate Pi.
 */

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCCB_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SCCB_ROOT, '..');
const RECEIPT_DIR = path.join(REPO_ROOT, 'receipts', 'sccb');

function run(cmd, args, cwd = REPO_ROOT) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString('utf8');
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString('utf8');
    });
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

async function sha256File(filePath) {
  const buf = await fs.readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

async function listSccbFiles() {
  const files = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else files.push(path.relative(REPO_ROOT, full));
    }
  }
  await walk(SCCB_ROOT);
  return files.sort();
}

async function main() {
  const started = new Date().toISOString();
  console.log('SCCB implementation verification (synthetic only)\n');

  // 1. Authority
  const {
    loadAuthorityState,
    authorityStateHash,
    projectAuthoritySummary,
    mayBootstrapCredentials,
    isPhaseAuthorized,
  } = await import('../src/authority/state.js');
  const authority = await loadAuthorityState();
  const authHash = await authorityStateHash();
  const authSummary = projectAuthoritySummary(authority, authHash);

  // 2. Capability + approval matrices
  const { defaultCapabilities } = await import('../src/capabilities/registry.js');
  const caps = defaultCapabilities();
  const capability_matrix = caps.map((c) => ({
    capability_id: c.id,
    policy_class: c.policy_class,
    credential_dependency: c.credential_dependency,
    permitted_operations: c.permitted_operations,
    approval_required: c.approval_required,
    status: c.status,
    agent_sees: `CAPABILITY: ${c.id}`,
    agent_never_sees: c.credential_dependency
      ? `secret material for ${c.credential_dependency}`
      : 'n/a',
  }));

  const approval_matrix = {
    PREAUTHORIZED: {
      meaning: 'Standing authorization — auto if capability active and control plane clear',
      examples: caps.filter((c) => c.policy_class === 'PREAUTHORIZED').map((c) => c.id),
    },
    CONDITIONAL: {
      meaning: 'Auto only when params match allowlists; mismatch → escalate',
      examples: caps.filter((c) => c.policy_class === 'CONDITIONAL').map((c) => c.id),
    },
    HUMAN_APPROVAL: {
      meaning: 'Prepare + ask human Yes/No; bound to params_hash',
      examples: caps.filter((c) => c.policy_class === 'HUMAN_APPROVAL').map((c) => c.id),
    },
    FORBIDDEN: {
      meaning: 'Cannot perform without new policy + sealed authority phase',
      examples: caps.filter((c) => c.policy_class === 'FORBIDDEN').map((c) => c.id),
    },
  };

  // 3. Storage / encryption design summary
  const storage_encryption_design = {
    backends: [
      {
        name: 'MemorySecretStore',
        use: 'tests / synthetic fixtures only',
        encryption_at_rest: 'none (process memory)',
        decrypt_process: 'in-process loadForInject',
        agent_access: 'metadata only via getMetadata; values only via loadForInject for inject',
      },
      {
        name: 'PassSecretStore',
        use: 'operator real credentials (when bootstrap authorized)',
        encryption_at_rest: 'GPG via password-store (pass)',
        decrypt_process: 'pass show → child env only',
        agent_access: 'metadata JSON only; storeSecret refuses agent-supplied values',
        plaintext_on_disk: 'only inside GPG-encrypted pass store entries (outside git)',
      },
    ],
    never_written_plaintext: [
      'agent chat / tool results',
      'Git repository',
      'evidence receipts',
      'credential-metadata JSON',
      'logs (redacted)',
    ],
    git_safe_paths: [
      'sccb/config/capabilities.v1.json',
      'sccb/config/credential-metadata.example.json',
      'sccb/config/authority-state.v1.json',
    ],
    gitignored_local: ['sccb/config/*.local.json'],
  };

  // 4. Run tests
  console.log('Running test suites...');
  const unit = await run(process.execPath, ['--test', 'sccb/test/sccb.v1.test.js']);
  const adv = await run(process.execPath, [
    '--test',
    'sccb/test/adversarial.verification.test.js',
  ]);
  const unitPass = /# fail 0/.test(unit.stdout) && unit.code === 0;
  const advPass = /# fail 0/.test(adv.stdout) && adv.code === 0;

  const unitStats = {
    exit_code: unit.code,
    pass: unitPass,
    summary_line: (unit.stdout.match(/# tests \d+[\s\S]*?# todo \d+/) || [''])[0]
      .split('\n')
      .filter((l) => l.startsWith('#'))
      .join(' | '),
  };
  const advStats = {
    exit_code: adv.code,
    pass: advPass,
    summary_line: (adv.stdout.match(/# tests \d+[\s\S]*?# todo \d+/) || [''])[0]
      .split('\n')
      .filter((l) => l.startsWith('#'))
      .join(' | '),
  };

  // 5. Diff inventory
  const sccb_files = await listSccbFiles();
  const file_hashes = {};
  for (const rel of sccb_files) {
    if (rel.endsWith('.json') || rel.endsWith('.js') || rel.endsWith('.mjs') || rel.endsWith('.md')) {
      try {
        file_hashes[rel] = await sha256File(path.join(REPO_ROOT, rel));
      } catch {
        /* skip */
      }
    }
  }

  // 6. Threat model path exists
  const threatModelPath = path.join(REPO_ROOT, 'docs/sccb/THREAT_MODEL.md');
  let threat_model_present = false;
  try {
    await fs.access(threatModelPath);
    threat_model_present = true;
  } catch {
    threat_model_present = false;
  }

  // 7. Safety assertions for this run
  const safety = {
    real_credential_bootstrap_authorized: mayBootstrapCredentials(authority),
    wallet_signing_authorized: isPhaseAuthorized(authority, 'wallet_signing'),
    pi_activation_authorized: isPhaseAuthorized(authority, 'pi_activation'),
    economics_unlock_authorized: isPhaseAuthorized(authority, 'economics_unlock'),
    production_deploy_via_sccb_authorized: isPhaseAuthorized(
      authority,
      'production_deploy_via_sccb'
    ),
    synthetic_fixtures_only: true,
    go_text_is_not_authorization: authority.rules?.go_text_in_chat_is_not_authorization === true,
    always_approve_bypasses_policy: authority.rules?.agent_always_approve_bypasses_policy === true,
  };

  const overall_pass =
    unitPass &&
    advPass &&
    threat_model_present &&
    safety.real_credential_bootstrap_authorized === false &&
    safety.wallet_signing_authorized === false &&
    safety.always_approve_bypasses_policy === false;

  const evidence = {
    schema: 'sccb.implementation_verification.v1',
    title: 'SCCB implementation verification (synthetic fixtures only)',
    started_utc: started,
    completed_utc: new Date().toISOString(),
    overall_pass,
    authority: authSummary,
    safety,
    storage_encryption_design,
    capability_matrix,
    approval_matrix,
    tests: {
      unit: unitStats,
      adversarial: advStats,
    },
    threat_model_path: 'docs/sccb/THREAT_MODEL.md',
    threat_model_present,
    sccb_file_count: sccb_files.length,
    sccb_files,
    // omit full file_hashes from console noise but include in receipt
    file_hashes_sha256: file_hashes,
    explicit_non_actions: [
      'no real secret intake',
      'no deploy',
      'no wallet connect/sign',
      'no fund movement',
      'no Pi activation',
      'no economics unlock',
      'no production credential rotation',
    ],
    next_authorization_required: {
      phase: 'credential_bootstrap',
      how: 'Human updates sccb/config/authority-state.v1.json credential_bootstrap.status to AUTHORIZED via PR/operator action, then GO CREDENTIAL_BOOTSTRAP <provider> with local pass insert only',
      not_sufficient: [
        'chat phrase GO CREDENTIAL_BOOTSTRAP',
        'agent always-approve mode',
        'CLI --authorized without sealed phase',
      ],
    },
    secret_values_in_evidence: false,
  };

  await fs.mkdir(RECEIPT_DIR, { recursive: true });
  const stamp = evidence.completed_utc.replace(/[:.]/g, '');
  const outPath = path.join(RECEIPT_DIR, `${stamp}-implementation-verification.json`);
  await fs.writeFile(outPath, JSON.stringify(evidence, null, 2) + '\n');

  // Human-readable summary
  console.log(JSON.stringify(
    {
      overall_pass,
      authority_phases: authSummary.phases,
      authority_sha256: authHash,
      tests: { unit: unitStats, adversarial: advStats },
      capability_count: capability_matrix.length,
      forbidden: approval_matrix.FORBIDDEN.examples,
      credential_bootstrap: safety.real_credential_bootstrap_authorized ? 'AUTHORIZED' : 'NOT_AUTHORIZED',
      evidence_path: path.relative(REPO_ROOT, outPath),
    },
    null,
    2
  ));

  if (!overall_pass) {
    console.error('\nVERIFICATION FAILED');
    if (!unitPass) console.error(unit.stdout.slice(-2000));
    if (!advPass) console.error(adv.stdout.slice(-2000));
    process.exit(1);
  }
  console.log('\nVERIFICATION PASSED (synthetic only; real credentials still off-limits)');
  process.exit(0);
}

main().catch((err) => {
  console.error(String(err?.stack || err));
  process.exit(1);
});
