#!/usr/bin/env node
/**
 * SCCB SECURITY_GATE — freeze baseline, adversarial/control tests, evidence.
 * Synthetic fixtures only. No real credential intake, deploy, Pi, economics.
 */

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCCB_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SCCB_ROOT, '..');
const RECEIPT_DIR = path.join(REPO_ROOT, 'receipts', 'sccb');

const SYNTH = {
  api: 'sk-security-gate-synthetic-DO-NOT-USE-aa11bb22',
  gh: 'ghp_SecurityGateSyntheticNotReal00000002',
  wallet: '0x' + 'cd'.repeat(32),
  password: 'SecurityGate-fixture-password-only',
};

function run(cmd, args, cwd = REPO_ROOT) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString('utf8')));
    child.stderr.on('data', (d) => (stderr += d.toString('utf8')));
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

async function sha256(filePath) {
  const buf = await fs.readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

async function walkFiles(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function containsAny(hay, needles) {
  return needles.some((n) => hay.includes(n));
}

async function main() {
  const started = new Date().toISOString();
  /** @type {string[]} */
  const critical = [];
  /** @type {string[]} */
  const residual = [];
  /** @type {Record<string, boolean>} */
  const checks = {};

  // --- A freeze baseline ---
  const head = (await run('git', ['rev-parse', 'HEAD'])).stdout.trim();
  const branch = (await run('git', ['branch', '--show-current'])).stdout.trim();
  const log = (await run('git', ['log', '-5', '--oneline'])).stdout.trim();

  const freeze = {
    schema: 'sccb.security_gate_baseline.v1',
    label: 'SCCB_SECURITY_GATE_CANDIDATE_BASELINE',
    frozen_utc: started,
    branch,
    commit: head,
    recent_log: log.split('\n'),
    note: 'Baseline for security gate; do not treat chat GO as authorization to advance phases',
  };

  // --- File inventory ---
  const sccbFiles = (await walkFiles(SCCB_ROOT)).map((f) => path.relative(REPO_ROOT, f)).sort();
  const docsFiles = (await walkFiles(path.join(REPO_ROOT, 'docs/sccb')))
    .map((f) => path.relative(REPO_ROOT, f))
    .sort();
  const inventory = {
    sccb_file_count: sccbFiles.length,
    docs_sccb_file_count: docsFiles.length,
    files: [...sccbFiles, ...docsFiles],
  };

  // --- Secret pattern scan (exclude known synthetic test strings) ---
  const syntheticMarkers = [
    'test-fixture',
    'FakeAdversarial',
    'DO-NOT-USE',
    'adversarial',
    'SecurityGate',
    'security-gate-synthetic',
    'not-real',
    'NotReal',
  ];
  const highSignal =
    /(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk_live_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|github_pat_[A-Za-z0-9_]{22,})/;
  const tokenish =
    /(ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,})/;

  const scanHits = [];
  for (const rel of inventory.files) {
    if (!/\.(js|mjs|json|md)$/.test(rel)) continue;
    const full = path.join(REPO_ROOT, rel);
    let text;
    try {
      text = await fs.readFile(full, 'utf8');
    } catch {
      continue;
    }
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      if (highSignal.test(line) && !syntheticMarkers.some((m) => line.includes(m) || rel.includes('test'))) {
        // allow pattern definitions in redaction/receipt code
        if (/test\(|replace\(|issues\.push|VALUE_PATTERNS|PRIVATE KEY-----/.test(line) && /sccb\/src\//.test(rel)) {
          return;
        }
        scanHits.push({ file: rel, line: i + 1, kind: 'high_signal', preview: line.slice(0, 120) });
      }
      if (tokenish.test(line)) {
        const isTest = rel.includes('/test/') || syntheticMarkers.some((m) => line.includes(m));
        const isPatternDef = /VALUE_PATTERNS|redact|\/ghp_|\/sk-/.test(line);
        if (!isTest && !isPatternDef) {
          scanHits.push({ file: rel, line: i + 1, kind: 'tokenish', preview: line.slice(0, 120) });
        }
      }
    });
  }
  checks.no_real_secrets_in_tree = scanHits.length === 0;
  if (!checks.no_real_secrets_in_tree) {
    critical.push(`Secret-like patterns outside fixtures: ${JSON.stringify(scanHits.slice(0, 5))}`);
  }

  // local.json must not exist in repo
  try {
    const locals = (await fs.readdir(path.join(SCCB_ROOT, 'config'))).filter((f) =>
      f.endsWith('.local.json')
    );
    checks.no_local_secret_metadata_committed = locals.length === 0;
    if (locals.length) critical.push(`Found local config files: ${locals.join(',')}`);
  } catch {
    checks.no_local_secret_metadata_committed = true;
  }

  // gitignore
  const gi = await fs.readFile(path.join(REPO_ROOT, '.gitignore'), 'utf8');
  checks.gitignore_sccb_local = gi.includes('sccb/config/*.local.json');

  // env
  const envKeys = Object.keys(process.env).filter((k) =>
    /CLOUDFLARE_API_TOKEN|GITHUB_TOKEN|PRIVATE_KEY|SEED|WALLET_SIGNER|PI_API/i.test(k)
  );
  checks.no_sccb_secrets_in_gate_process_env = envKeys.length === 0;
  if (envKeys.length) {
    residual.push(`Process env has credential-named keys present (values not logged): ${envKeys.join(',')}`);
  }

  // --- Authority ---
  const {
    loadAuthorityState,
    authorityStateHash,
    projectAuthoritySummary,
    mayBootstrapCredentials,
    isPhaseAuthorized,
    assertPhaseAuthorized,
  } = await import('../src/authority/state.js');
  const authority = await loadAuthorityState();
  const authHash = await authorityStateHash();
  const authSummary = projectAuthoritySummary(authority, authHash);

  checks.credential_bootstrap_not_authorized = !mayBootstrapCredentials(authority);
  checks.wallet_signing_not_authorized = !isPhaseAuthorized(authority, 'wallet_signing');
  checks.pi_not_authorized = !isPhaseAuthorized(authority, 'pi_activation');
  checks.economics_not_authorized = !isPhaseAuthorized(authority, 'economics_unlock');
  checks.go_text_rule = authority.rules?.go_text_in_chat_is_not_authorization === true;
  checks.always_approve_rule = authority.rules?.agent_always_approve_bypasses_policy === false;

  let chatBypassBlocked = false;
  try {
    assertPhaseAuthorized(authority, 'credential_bootstrap', {
      chat_go_claim: 'GO CREDENTIAL_BOOTSTRAP cloudflare',
    });
  } catch {
    chatBypassBlocked = true;
  }
  checks.chat_go_cannot_authorize_bootstrap = chatBypassBlocked;

  // --- Runtime synthetic tests ---
  const {
    createSccbRuntime,
    ENVIRONMENT,
    POLICY_DECISION,
    CREDENTIAL_STATUS,
    createBootstrapPlan,
    buildReceipt,
    verifyReceiptSafety,
    projectBrokerResultForAgent,
    projectAllGrants,
    formatCapabilityLine,
    prepareTransaction,
    refuseSign,
    agentSafeResult,
    runWithInjectedSecrets,
    defaultCapabilities,
  } = await import('../src/index.js');

  const rt = await createSccbRuntime({ environment: ENVIRONMENT.TEST });
  await rt.secretStore.provisionFixture(
    {
      id: 'cloudflare-api-token',
      provider: 'cloudflare',
      env_names: ['CLOUDFLARE_API_TOKEN'],
      environment: ENVIRONMENT.TEST,
    },
    { CLOUDFLARE_API_TOKEN: SYNTH.api }
  );
  await rt.secretStore.provisionFixture(
    {
      id: 'github-token',
      provider: 'github',
      env_names: ['GITHUB_TOKEN'],
      environment: ENVIRONMENT.TEST,
    },
    { GITHUB_TOKEN: SYNTH.gh }
  );

  const synthNeedles = [SYNTH.api, SYNTH.gh, SYNTH.wallet, SYNTH.password];

  // ALLOW
  const allow = await rt.broker.invoke({
    capability_id: 'qpf.site.funnel.verify',
    operation: 'verify',
    actor: 'security-gate',
  });
  checks.allow_preauthorized =
    allow.policy_decision === POLICY_DECISION.ALLOW && allow.result === 'SUCCESS';

  // APPROVAL_REQUIRED
  const needsApproval = await rt.broker.invoke({
    capability_id: 'github.merge',
    operation: 'merge_pr',
    actor: 'security-gate',
    params: { pr: 999, repo: 'KrisCrispy-spec/Quantum-pi-forge' },
  });
  checks.approval_required =
    needsApproval.result === 'APPROVAL_REQUIRED' &&
    needsApproval.approval_state === 'PENDING' &&
    Boolean(needsApproval.data?.approval_id);

  // DENY forbidden
  const deny = await rt.broker.invoke({
    capability_id: 'economics.mint',
    operation: 'mint',
    actor: 'security-gate',
    agent_always_approve: true,
  });
  checks.deny_forbidden =
    deny.policy_decision === POLICY_DECISION.DENY && deny.result === 'DENIED';

  // always-approve cannot bypass human
  const aa = await rt.broker.invoke({
    capability_id: 'github.merge',
    operation: 'merge_pr',
    actor: 'security-gate',
    params: { pr: 1000 },
    agent_always_approve: true,
  });
  checks.always_approve_no_bypass_human = aa.result === 'APPROVAL_REQUIRED';

  // real bootstrap denied
  let realBootstrapDenied = false;
  try {
    await createBootstrapPlan({
      registry: rt.registry,
      secretStore: rt.secretStore,
      allow_real_bootstrap: true,
      authority,
      authorized: true,
    });
  } catch {
    realBootstrapDenied = true;
  }
  checks.real_bootstrap_denied_without_seal = realBootstrapDenied;

  // conversational authorized flag alone for real still denied
  // (allow_real without sealed authority already tested)

  // REVOKE / emergency
  const beforeRevoke = await rt.broker.invoke({
    capability_id: 'cloudflare.deploy',
    operation: 'deploy',
    actor: 'security-gate',
    params: { target: 'quantumpiforge', branch: 'main' },
    dry_run: true,
  });
  checks.pre_revoke_conditional_allow = beforeRevoke.policy_decision === POLICY_DECISION.ALLOW;

  await rt.control.emergencyStop('security-gate emergency revoke test');
  const afterEmergency = await rt.broker.invoke({
    capability_id: 'qpf.site.funnel.verify',
    operation: 'verify',
    actor: 'security-gate',
  });
  checks.emergency_blocks_preauthorized =
    afterEmergency.policy_decision === POLICY_DECISION.DENY;

  await rt.control.clearEmergencyStop({ resume_global: true });
  await rt.control.revokeCapability('cloudflare.deploy', rt.registry);
  const afterRevoke = await rt.broker.invoke({
    capability_id: 'cloudflare.deploy',
    operation: 'deploy',
    actor: 'security-gate',
    params: { target: 'quantumpiforge', branch: 'main' },
    dry_run: true,
  });
  checks.capability_revoke_blocks =
    afterRevoke.policy_decision === POLICY_DECISION.DENY;

  await rt.secretStore.setStatus('github-token', CREDENTIAL_STATUS.REVOKED);
  // recreate runtime state for credential - use fresh broker with same store
  // github.pr.create should deny due to revoked credential when matching conditional
  const afterCredRevoke = await rt.broker.invoke({
    capability_id: 'github.pr.create',
    operation: 'create_pr',
    actor: 'security-gate',
    params: { repo: 'KrisCrispy-spec/Quantum-pi-forge' },
  });
  checks.credential_revoke_blocks =
    afterCredRevoke.policy_decision === POLICY_DECISION.DENY;

  // Secret non-disclosure across results
  const disclosureSurfaces = [
    JSON.stringify(allow),
    JSON.stringify(needsApproval),
    JSON.stringify(deny),
    JSON.stringify(await rt.secretStore.listMetadata()),
    JSON.stringify(await projectAllGrants(rt.registry, rt.secretStore)),
    JSON.stringify(projectBrokerResultForAgent(needsApproval)),
  ];
  checks.synthetic_secrets_not_in_agent_surfaces = !disclosureSurfaces.some((s) =>
    containsAny(s, synthNeedles)
  );
  if (!checks.synthetic_secrets_not_in_agent_surfaces) {
    critical.push('Synthetic secret values appeared in agent-facing surfaces');
  }

  // inject + agentSafeResult
  // re-provision github for inject test
  const rt2 = await createSccbRuntime({ environment: ENVIRONMENT.TEST });
  await rt2.secretStore.provisionFixture(
    {
      id: 'github-token',
      provider: 'github',
      env_names: ['GITHUB_TOKEN'],
      environment: ENVIRONMENT.TEST,
    },
    { GITHUB_TOKEN: SYNTH.gh }
  );
  const injectRaw = await runWithInjectedSecrets(
    rt2.secretStore,
    'github-token',
    'node',
    ['-e', 'process.exit(process.env.GITHUB_TOKEN ? 0 : 1)'],
    { allowlist: ['node'] }
  );
  const injectSafe = agentSafeResult(injectRaw);
  checks.inject_child_receives_secret = injectRaw.code === 0;
  checks.inject_agent_safe_no_secret =
    !containsAny(JSON.stringify(injectSafe), synthNeedles) &&
    injectSafe.secret_values_returned === false &&
    !Object.prototype.hasOwnProperty.call(injectSafe, 'stdout');

  // Residual: raw inject returns stdout/stderr (could leak if child echoes secret)
  residual.push(
    'runWithInjectedSecrets returns stdout/stderr to direct callers; broker uses agentSafeResult which strips bodies. Direct library misuse could expose child output.'
  );

  // Pass store refuses agent secrets
  const { PassSecretStore } = await import('../src/secrets/pass-store.js');
  const tmpMeta = path.join(REPO_ROOT, 'sccb/config', `.gate-tmp-meta-${Date.now()}.json`);
  const passStore = new PassSecretStore({ metadataPath: tmpMeta, passAvailable: false });
  await passStore.putMetadata({
    id: 'gate-test',
    provider: 'test',
    label: 'gate',
    pass_path: 'qpf/test/gate',
    env_names: ['X'],
    environment: ENVIRONMENT.TEST,
    status: 'unknown',
    scopes: [],
    last_validated_utc: null,
    created_utc: new Date().toISOString(),
    revoked_utc: null,
  });
  let passRefuse = false;
  try {
    await passStore.storeSecret('gate-test', { X: 'should-not-store' });
  } catch {
    passRefuse = true;
  }
  checks.pass_refuses_agent_secret_write = passRefuse;
  try {
    await fs.unlink(tmpMeta);
  } catch {
    /* ignore */
  }

  // Wallet
  const prepared = prepareTransaction({
    intent: {
      network: '0g-galileo-testnet',
      to: '0x0000000000000000000000000000000000000001',
      amount_wei: '0',
    },
    registry: rt2.registry,
    control: rt2.control,
    environment: ENVIRONMENT.TEST,
  });
  const signRefuse = refuseSign(prepared);
  checks.wallet_prepare_no_key =
    prepared.private_key_included === false && prepared.can_sign === false;
  checks.wallet_sign_refused = signRefuse.signed === false && signRefuse.broadcast === false;

  // Audit integrity
  const dir = await fs.mkdtemp(path.join(REPO_ROOT, 'receipts/sccb', 'gate-tmp-'));
  const rt3 = await createSccbRuntime({
    environment: ENVIRONMENT.TEST,
    receiptDir: dir,
  });
  const audited = await rt3.broker.invoke({
    capability_id: 'github.merge',
    operation: 'merge_pr',
    actor: 'security-gate-auditor',
    params: { pr: 42 },
  });
  let auditOk = false;
  let auditFields = {};
  if (audited.receipt_path) {
    const body = JSON.parse(await fs.readFile(audited.receipt_path, 'utf8'));
    const safety = verifyReceiptSafety(body);
    auditFields = {
      has_timestamp: Boolean(body.timestamp),
      has_actor: body.actor === 'security-gate-auditor',
      has_capability: body.capability_id === 'github.merge',
      has_operation: body.operation === 'merge_pr',
      has_policy_decision: Boolean(body.policy_decision),
      has_approval_state: Boolean(body.approval_state),
      has_execution_state: Boolean(body.execution_state),
      has_result: Boolean(body.result),
      has_evidence_id: Boolean(body.evidence_id),
      has_params_hash: Boolean(body.params_hash),
      secret_exposed_false: body.secret_exposed_to_llm === false,
      safety_ok: safety.ok,
      no_synth_in_receipt: !containsAny(JSON.stringify(body), synthNeedles),
    };
    auditOk = Object.values(auditFields).every(Boolean);
  }
  checks.audit_integrity = auditOk;
  // cleanup temp receipts
  try {
    const tmpFiles = await fs.readdir(dir);
    for (const f of tmpFiles) await fs.unlink(path.join(dir, f));
    await fs.rmdir(dir);
  } catch {
    /* ignore */
  }

  // Full test suite
  const tests = await run(process.execPath, [
    '--test',
    'sccb/test/sccb.v1.test.js',
    'sccb/test/adversarial.verification.test.js',
  ]);
  checks.unit_adversarial_suite = tests.code === 0 && /# fail 0/.test(tests.stdout);

  // Matrices
  const caps = defaultCapabilities();
  const capability_matrix = caps.map((c) => ({
    capability_id: c.id,
    policy_class: c.policy_class,
    credential_dependency: c.credential_dependency,
    permitted_operations: c.permitted_operations,
    approval_required: c.approval_required,
    agent_projection: `CAPABILITY: ${c.id}`,
  }));
  const approval_matrix = {
    ALLOW_PREAUTHORIZED: caps.filter((c) => c.policy_class === 'PREAUTHORIZED').map((c) => c.id),
    CONDITIONAL: caps.filter((c) => c.policy_class === 'CONDITIONAL').map((c) => c.id),
    APPROVAL_REQUIRED: caps.filter((c) => c.policy_class === 'HUMAN_APPROVAL').map((c) => c.id),
    DENY_FORBIDDEN: caps.filter((c) => c.policy_class === 'FORBIDDEN').map((c) => c.id),
  };

  // Storage design summary
  const secret_handling = {
    memory_store: {
      encryption_at_rest: 'none (RAM only, synthetic/tests)',
      decrypt: 'in-process loadForInject',
      disk_write: false,
    },
    pass_store: {
      encryption_at_rest: 'GPG via password-store',
      decrypt: 'pass show → child process env only',
      agent_write_refused: true,
      metadata_permissions_intent: '0o600 when written',
    },
    git_exclusion: 'sccb/config/*.local.json',
    receipts: 'non-secret; mode typically 0644',
    backups: 'not implemented by SCCB (OS/user backup of pass store is operator concern)',
    temp_files: 'gate temp metadata deleted; receipt temps cleaned',
    shell_history_note:
      'SCCB code does not write secrets to shell history. Pre-existing operator pass insert commands may appear in history (paths only; not values). Not introduced as secret material by SCCB.',
  };

  const failedChecks = Object.entries(checks)
    .filter(([, v]) => v !== true)
    .map(([k]) => k);

  if (failedChecks.length) {
    for (const k of failedChecks) critical.push(`Check failed: ${k}`);
  }

  const overall =
    critical.length === 0 &&
    checks.unit_adversarial_suite &&
    checks.credential_bootstrap_not_authorized &&
    checks.chat_go_cannot_authorize_bootstrap;

  const result = {
    schema: 'sccb.security_gate.v1',
    title: 'SCCB SECURITY_GATE',
    started_utc: started,
    completed_utc: new Date().toISOString(),
    baseline: freeze,
    overall_pass: overall,
    gate_status: overall ? 'SCCB_SECURITY_GATE_PASSED' : 'SCCB_SECURITY_GATE_FAILED',
    critical_findings: critical,
    residual_risks: residual,
    checks,
    A_SECURITY_GATE_RESULT: {
      pass: overall,
      status: overall ? 'SCCB_SECURITY_GATE_PASSED' : 'SCCB_SECURITY_GATE_FAILED',
      baseline_commit: head,
      branch,
      critical_count: critical.length,
      residual_count: residual.length,
    },
    B_THREAT_MODEL: {
      path: 'docs/sccb/THREAT_MODEL.md',
      summary: [
        'Secret→LLM exfil mitigated by inject+agentSafeResult+redaction',
        'Always-approve cannot elevate policy',
        'Chat GO cannot authorize gated phases (sealed authority file)',
        'Laptop compromise → revoke provider tokens; prefer HW for treasury',
        'Residual: direct inject stdout may contain child-echoed secrets',
      ],
    },
    C_SECRET_HANDLING_RESULT: {
      pass: checks.no_real_secrets_in_tree && checks.synthetic_secrets_not_in_agent_surfaces,
      scan_hits: scanHits,
      secret_handling,
      real_credentials_imported: false,
      production_wallets_connected: false,
      secrets_committed: !checks.no_real_secrets_in_tree,
    },
    D_AUTHORIZATION_BYPASS_TEST_RESULT: {
      pass:
        checks.chat_go_cannot_authorize_bootstrap &&
        checks.always_approve_no_bypass_human &&
        checks.real_bootstrap_denied_without_seal &&
        checks.deny_forbidden,
      chat_go_bootstrap: chatBypassBlocked ? 'BLOCKED' : 'FAILED_OPEN',
      always_approve_human: checks.always_approve_no_bypass_human ? 'BLOCKED' : 'FAILED_OPEN',
      always_approve_forbidden: checks.deny_forbidden ? 'BLOCKED' : 'FAILED_OPEN',
      real_bootstrap_without_seal: realBootstrapDenied ? 'BLOCKED' : 'FAILED_OPEN',
      authority_summary: authSummary,
    },
    E_CAPABILITY_MATRIX: capability_matrix,
    F_APPROVAL_MATRIX: {
      classes: {
        ALLOW: 'PREAUTHORIZED standing policy auto-executes when control plane clear',
        APPROVAL_REQUIRED: 'HUMAN_APPROVAL and CONDITIONAL mismatch → prepare + escalate',
        DENY: 'FORBIDDEN and control-plane stop/revoke',
      },
      ...approval_matrix,
      live_tests: {
        ALLOW: {
          capability: 'qpf.site.funnel.verify',
          result: allow.result,
          policy_decision: allow.policy_decision,
        },
        APPROVAL_REQUIRED: {
          capability: 'github.merge',
          result: needsApproval.result,
          approval_id_present: Boolean(needsApproval.data?.approval_id),
        },
        DENY: {
          capability: 'economics.mint',
          result: deny.result,
          policy_decision: deny.policy_decision,
        },
      },
    },
    G_REVOKE_TEST_RESULT: {
      pass:
        checks.emergency_blocks_preauthorized &&
        checks.capability_revoke_blocks &&
        checks.credential_revoke_blocks,
      emergency_stop: checks.emergency_blocks_preauthorized,
      capability_revoke: checks.capability_revoke_blocks,
      credential_revoke: checks.credential_revoke_blocks,
    },
    H_AUDIT_INTEGRITY_RESULT: {
      pass: checks.audit_integrity,
      fields: auditFields,
      sample_request: {
        result: audited.result,
        receipt_written: Boolean(audited.receipt_path),
      },
    },
    I_REMAINING_BLOCKERS: [
      'credential_bootstrap phase NOT_AUTHORIZED — no real secret enrollment',
      'wallet_signing / wallet_broadcast NOT_AUTHORIZED',
      'pi_activation NOT_AUTHORIZED',
      'economics_unlock NOT_AUTHORIZED',
      'production_deploy_via_sccb NOT_AUTHORIZED',
      'No production credential connectivity tests (by design)',
      residual.length
        ? 'Residual: inject API stdout exposure if child echoes secrets (use agentSafeResult)'
        : null,
    ].filter(Boolean),
    J_EXACT_NEXT_AUTHORIZATION_REQUIRED: {
      phase: 'credential_bootstrap',
      sealed_file: 'sccb/config/authority-state.v1.json',
      required_change:
        'Human sets phases.credential_bootstrap.status = AUTHORIZED via explicit PR/operator edit',
      then: [
        'Local terminal only: pass insert <path> (never chat)',
        'npm run sccb -- bootstrap plan --real --provider <provider>',
        'register-metadata + validate presence only',
      ],
      not_sufficient: [
        'chat GO CREDENTIAL_BOOTSTRAP',
        'always-approve agent mode',
        'silence / prior conversational approval',
        'SECURITY_GATE_PASSED itself (does not authorize enrollment)',
        'CLI --authorized without sealed phase',
      ],
      still_separate_after_bootstrap: [
        'wallet_signing',
        'pi_activation',
        'economics_unlock',
        'production_deploy_via_sccb',
      ],
    },
    inventory,
    tests_summary: {
      exit_code: tests.code,
      pass: checks.unit_adversarial_suite,
      tail: tests.stdout
        .split('\n')
        .filter((l) => l.startsWith('#'))
        .slice(-8)
        .join(' | '),
    },
    explicit_non_actions: [
      'no deploy of SCCB',
      'no secret migration',
      'no financial transactions',
      'no Pi activation',
      'no QPF economic lock changes',
      'no production CF/GitHub/wallet/Pi credentials used',
    ],
    secret_values_in_this_report: false,
  };

  // Write freeze + gate evidence
  await fs.mkdir(RECEIPT_DIR, { recursive: true });
  const freezePath = path.join(SCCB_ROOT, 'config', 'security-gate-baseline.v1.json');
  await fs.writeFile(freezePath, JSON.stringify(freeze, null, 2) + '\n');

  const stamp = result.completed_utc.replace(/[:.]/g, '');
  const outPath = path.join(RECEIPT_DIR, `${stamp}-security-gate.json`);
  await fs.writeFile(outPath, JSON.stringify(result, null, 2) + '\n');

  // Markdown report for operators
  const mdPath = path.join(REPO_ROOT, 'docs/sccb/SECURITY_GATE_REPORT.md');
  const md = `# SCCB SECURITY_GATE Report

**Status:** \`${result.gate_status}\`  
**Baseline commit:** \`${head}\`  
**Branch:** \`${branch}\`  
**Completed:** ${result.completed_utc}  
**Evidence:** \`${path.relative(REPO_ROOT, outPath)}\`

## A. SECURITY_GATE_RESULT

- **Pass:** ${overall}
- **Critical findings:** ${critical.length}
- **Residual risks:** ${residual.length}

${critical.length ? critical.map((c) => `- CRITICAL: ${c}`).join('\n') : '- None'}

## B. THREAT_MODEL

See \`docs/sccb/THREAT_MODEL.md\`. Gate-confirmed:

${result.B_THREAT_MODEL.summary.map((s) => `- ${s}`).join('\n')}

## C. SECRET_HANDLING_RESULT

- Real credentials imported: **false**
- Secrets committed: **${!checks.no_real_secrets_in_tree}**
- Synthetic secrets in agent surfaces: **${!checks.synthetic_secrets_not_in_agent_surfaces}**
- Pass refuses agent write: **${checks.pass_refuses_agent_secret_write}**
- Gitignore local config: **${checks.gitignore_sccb_local}**

## D. AUTHORIZATION_BYPASS_TEST_RESULT

| Vector | Result |
| --- | --- |
| Chat GO → credential_bootstrap | ${result.D_AUTHORIZATION_BYPASS_TEST_RESULT.chat_go_bootstrap} |
| always-approve → HUMAN | ${result.D_AUTHORIZATION_BYPASS_TEST_RESULT.always_approve_human} |
| always-approve → FORBIDDEN | ${result.D_AUTHORIZATION_BYPASS_TEST_RESULT.always_approve_forbidden} |
| Real bootstrap without seal | ${result.D_AUTHORIZATION_BYPASS_TEST_RESULT.real_bootstrap_without_seal} |

## E. CAPABILITY_MATRIX

| Capability | Class | Credential id |
| --- | --- | --- |
${capability_matrix.map((c) => `| ${c.capability_id} | ${c.policy_class} | ${c.credential_dependency ?? '—'} |`).join('\n')}

## F. APPROVAL_MATRIX

| Live class | Capability | Result |
| --- | --- | --- |
| ALLOW | qpf.site.funnel.verify | ${allow.result} / ${allow.policy_decision} |
| APPROVAL_REQUIRED | github.merge | ${needsApproval.result} |
| DENY | economics.mint | ${deny.result} / ${deny.policy_decision} |

## G. REVOKE_TEST_RESULT

| Control | Pass |
| --- | --- |
| Emergency stop | ${checks.emergency_blocks_preauthorized} |
| Capability revoke | ${checks.capability_revoke_blocks} |
| Credential revoke | ${checks.credential_revoke_blocks} |

## H. AUDIT_INTEGRITY_RESULT

Pass: **${checks.audit_integrity}**

## I. REMAINING_BLOCKERS

${result.I_REMAINING_BLOCKERS.map((b) => `- ${b}`).join('\n')}

## J. EXACT NEXT AUTHORIZATION REQUIRED

To enroll **real** credentials (still not authorized by this gate):

1. Human updates \`sccb/config/authority-state.v1.json\` → \`credential_bootstrap.status = AUTHORIZED\`
2. Local terminal: \`pass insert <path>\` (never chat)
3. \`npm run sccb -- bootstrap plan --real --provider <provider>\`
4. register-metadata + validate

**Not sufficient:** chat GO, always-approve, silence, or this SECURITY_GATE_PASSED result alone.

---

${overall ? '## SCCB_SECURITY_GATE_PASSED' : '## SCCB_SECURITY_GATE_FAILED'}

Do not proceed to credential enrollment without separate explicit sealed authorization.
`;
  await fs.writeFile(mdPath, md);

  console.log(
    JSON.stringify(
      {
        gate_status: result.gate_status,
        overall_pass: overall,
        baseline_commit: head,
        critical: critical,
        residual: residual,
        checks_failed: failedChecks,
        evidence: path.relative(REPO_ROOT, outPath),
        report: path.relative(REPO_ROOT, mdPath),
        authority_phases: authSummary.phases,
      },
      null,
      2
    )
  );

  process.exit(overall ? 0 : 1);
}

main().catch((e) => {
  console.error(String(e?.stack || e));
  process.exit(1);
});
