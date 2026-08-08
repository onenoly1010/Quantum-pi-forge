#!/usr/bin/env node
/**
 * SCCB v1 CLI — operator-facing, never prints secret values.
 *
 * Usage:
 *   node sccb/src/cli.js status
 *   node sccb/src/cli.js capabilities
 *   node sccb/src/cli.js invoke --capability qpf.site.funnel.verify --operation verify
 *   node sccb/src/cli.js emergency-stop --reason "..."
 *   node sccb/src/cli.js bootstrap plan --authorized --provider cloudflare
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import {
  createSccbRuntime,
  defaultCapabilities,
  CapabilityRegistry,
  createBootstrapPlan,
  registerMetadata,
  validateCredential,
  associationReport,
  writeBootstrapReceipt,
  discoverRequiredCredentials,
  prepareTransaction,
  refuseSign,
  RECOVERY_PROCEDURE,
  ENVIRONMENT,
  CREDENTIAL_STATUS,
} from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const SCCB_DIR = path.resolve(__dirname, '..');
const DEFAULT_RECEIPTS = path.join(ROOT, 'receipts', 'sccb');
const DEFAULT_STATE = path.join(SCCB_DIR, 'config', 'control-state.local.json');
const DEFAULT_META = path.join(SCCB_DIR, 'config', 'credential-metadata.local.json');
const DEFAULT_APPROVALS = path.join(SCCB_DIR, 'config', 'approvals.local.json');

function parseArgs(argv) {
  const args = argv.slice(2);
  const cmd = args[0] ?? 'help';
  /** @type {Record<string, string|boolean>} */
  const flags = {};
  const positional = [];
  for (let i = 1; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { cmd, flags, positional };
}

function printJson(obj) {
  // Safe: callers must not pass secrets
  console.log(JSON.stringify(obj, null, 2));
}

async function buildRuntime(flags) {
  const environment = flags.env || flags.environment || ENVIRONMENT.DEVELOPMENT;
  const usePass = flags.pass === true || flags.pass === 'true';
  const { ControlPlane } = await import('./control/emergency.js');
  const { ApprovalEngine } = await import('./approval/engine.js');
  const { MemorySecretStore } = await import('./secrets/memory-store.js');
  const { PassSecretStore } = await import('./secrets/pass-store.js');

  const control = new ControlPlane({
    statePath: flags['state-path'] || DEFAULT_STATE,
    memoryOnly: false,
  });
  await control.load();

  const approvals = new ApprovalEngine({
    storagePath: flags['approvals-path'] || DEFAULT_APPROVALS,
    memoryOnly: false,
  });
  await approvals.load();

  const secretStore = usePass
    ? new PassSecretStore({ metadataPath: flags['meta-path'] || DEFAULT_META })
    : new MemorySecretStore({ environment });

  // Load metadata file into memory store if present
  if (!usePass) {
    try {
      const raw = await fs.readFile(flags['meta-path'] || DEFAULT_META, 'utf8');
      const data = JSON.parse(raw);
      for (const m of data.credentials ?? []) {
        await secretStore.putMetadata(m);
      }
    } catch {
      /* no local meta */
    }
  }

  const runtime = await createSccbRuntime({
    environment,
    secretStore,
    control,
    approvals,
    receiptDir: flags['receipt-dir'] || DEFAULT_RECEIPTS,
    usePass: false,
  });
  // createSccbRuntime overwrote control — rebind
  runtime.control = control;
  runtime.approvals = approvals;
  runtime.secretStore = secretStore;
  runtime.broker.control = control;
  runtime.broker.approvals = approvals;
  runtime.broker.secretStore = secretStore;
  runtime.broker.receiptDir = flags['receipt-dir'] || DEFAULT_RECEIPTS;
  return runtime;
}

async function main() {
  const { cmd, flags, positional } = parseArgs(process.argv);

  if (cmd === 'help' || flags.help) {
    console.log(`SCCB v1 — Sovereign Credential & Capability Bootstrap

Commands:
  status                 Control plane + association summary
  authority              Machine-verifiable authorization phases
  grants                 Agent-facing CAPABILITY grants (no secrets)
  capabilities           List capability registry
  invoke                 Invoke a capability (policy + broker)
  verify                 Run implementation verification suite
  bootstrap-rehearsal    Synthetic end-to-end onboarding (no real secrets)
  approve                Decide a pending approval
  emergency-stop         Global emergency stop
  emergency-clear        Clear emergency stop
  pause / unpause        Per-capability pause
  capability-revoke      Revoke capability
  credential-revoke      Revoke/disable credential metadata
  bootstrap plan         Create bootstrap plan (needs --authorized)
  bootstrap register-metadata
  bootstrap validate
  bootstrap discover
  wallet prepare         Prepare unsigned tx (signing disabled)
  recovery               Print emergency recovery procedure
  version

Safety: never pass secret values as CLI flags. Use pass insert locally.
`);
    return;
  }

  if (cmd === 'version') {
    const { SCCB_VERSION } = await import('./types.js');
    printJson({ sccb_version: SCCB_VERSION });
    return;
  }

  if (cmd === 'recovery') {
    console.log(RECOVERY_PROCEDURE);
    return;
  }

  if (cmd === 'capabilities') {
    const registry = new CapabilityRegistry(defaultCapabilities());
    printJson({ capabilities: registry.list().map((c) => ({
      id: c.id,
      policy_class: c.policy_class,
      credential_dependency: c.credential_dependency,
      status: c.status,
      permitted_operations: c.permitted_operations,
    })) });
    return;
  }

  if (cmd === 'authority') {
    const { loadAuthorityState, authorityStateHash, projectAuthoritySummary } =
      await import('./authority/state.js');
    const state = await loadAuthorityState();
    const hash = await authorityStateHash();
    printJson(projectAuthoritySummary(state, hash));
    return;
  }

  if (cmd === 'grants') {
    const { projectAllGrants, formatCapabilityLine } = await import('./grants/projection.js');
    const registry = new CapabilityRegistry(defaultCapabilities());
    const set = await projectAllGrants(registry, null);
    printJson({
      ...set,
      lines: set.grants.map(formatCapabilityLine),
    });
    return;
  }

  if (cmd === 'verify') {
    const { spawn } = await import('node:child_process');
    const script = path.join(SCCB_DIR, 'scripts', 'verify-implementation.mjs');
    const code = await new Promise((resolve) => {
      const child = spawn(process.execPath, [script], { stdio: 'inherit' });
      child.on('close', (c) => resolve(c ?? 1));
    });
    process.exit(code);
  }

  if (cmd === 'bootstrap-rehearsal' || cmd === 'rehearsal') {
    const { spawn } = await import('node:child_process');
    const script = path.join(SCCB_DIR, 'scripts', 'bootstrap-rehearsal.mjs');
    const code = await new Promise((resolve) => {
      const child = spawn(process.execPath, [script], { stdio: 'inherit' });
      child.on('close', (c) => resolve(c ?? 1));
    });
    process.exit(code);
  }

  const runtime = await buildRuntime(flags);

  if (cmd === 'status') {
    const assoc = await associationReport(runtime.registry, runtime.secretStore);
    printJson({
      control: runtime.control.snapshot(),
      environment: runtime.environment,
      associations: assoc,
      secret_values: false,
    });
    return;
  }

  if (cmd === 'invoke') {
    const capability = flags.capability || flags.c;
    const operation = flags.operation || flags.o;
    if (!capability || !operation) {
      console.error('require --capability and --operation');
      process.exit(2);
    }
    let params = {};
    if (flags.params) {
      params = JSON.parse(String(flags.params));
    }
    const result = await runtime.broker.invoke({
      capability_id: String(capability),
      operation: String(operation),
      actor: String(flags.actor || 'cli-operator'),
      params,
      dry_run: flags['dry-run'] === true || flags['dry-run'] === 'true',
      agent_always_approve: flags['always-approve'] === true,
      approval_id: flags['approval-id'] ? String(flags['approval-id']) : undefined,
      idempotency_key: flags.idempotency ? String(flags.idempotency) : undefined,
    });
    printJson(result);
    if (result.result === 'DENIED' || result.result === 'ERROR') process.exitCode = 1;
    if (result.result === 'APPROVAL_REQUIRED') process.exitCode = 3;
    return;
  }

  if (cmd === 'approve') {
    const id = flags.id || positional[0];
    const decision = flags.decision || positional[1];
    if (!id || !decision) {
      console.error('usage: approve --id <approval_id> --decision APPROVED|REJECTED --by <human>');
      process.exit(2);
    }
    const rec = await runtime.approvals.decide(String(id), String(decision), {
      decided_by: String(flags.by || 'human'),
      reasoning: flags.reason ? String(flags.reason) : undefined,
      ttl_seconds: flags.ttl ? Number(flags.ttl) : 3600,
    });
    printJson(rec);
    return;
  }

  if (cmd === 'emergency-stop') {
    const snap = await runtime.control.emergencyStop(String(flags.reason || 'cli emergency-stop'));
    printJson(snap);
    return;
  }

  if (cmd === 'emergency-clear') {
    const snap = await runtime.control.clearEmergencyStop({
      resume_global: flags['resume-global'] === true || flags['resume-global'] === 'true',
    });
    printJson(snap);
    return;
  }

  if (cmd === 'pause') {
    const id = flags.id || flags.capability || positional[0];
    printJson(await runtime.control.pauseCapability(String(id)));
    return;
  }

  if (cmd === 'unpause') {
    const id = flags.id || flags.capability || positional[0];
    printJson(await runtime.control.unpauseCapability(String(id)));
    return;
  }

  if (cmd === 'capability-revoke') {
    const id = flags.id || flags.capability || positional[0];
    printJson(await runtime.control.revokeCapability(String(id), runtime.registry));
    return;
  }

  if (cmd === 'credential-revoke') {
    const id = flags.id || positional[0];
    const status = flags.status === 'disabled' ? CREDENTIAL_STATUS.DISABLED : CREDENTIAL_STATUS.REVOKED;
    // ensure meta exists for memory path
    try {
      printJson(await runtime.control.revokeCredential(String(id), runtime.secretStore, status));
    } catch (e) {
      console.error(String(e.message || e));
      process.exit(1);
    }
    return;
  }

  if (cmd === 'bootstrap') {
    const sub = positional[0] || flags.sub || 'plan';
    if (sub === 'discover') {
      printJson({ required: discoverRequiredCredentials(runtime.registry) });
      return;
    }
    if (sub === 'plan') {
      const { loadAuthorityState, mayBootstrapCredentials } = await import('./authority/state.js');
      let authority = null;
      try {
        authority = await loadAuthorityState();
      } catch {
        /* missing authority file */
      }
      const real = flags.real === true || flags.real === 'true';
      const synthetic = flags.synthetic === true || flags.synthetic === 'true' || !real;

      if (real) {
        if (!authority || !mayBootstrapCredentials(authority)) {
          console.error(
            'Real credential bootstrap DENIED: sealed authority-state phase credential_bootstrap is NOT_AUTHORIZED. ' +
              'Chat GO phrases and --authorized alone are not authorization.'
          );
          process.exit(2);
        }
      } else if (!flags.authorized && !synthetic) {
        console.error('Refusing bootstrap plan. Use --synthetic for verification, or sealed AUTHORIZED credential_bootstrap for real intake.');
        process.exit(2);
      }

      const providers = flags.provider
        ? String(flags.provider).split(',')
        : flags.providers
          ? String(flags.providers).split(',')
          : undefined;
      const plan = await createBootstrapPlan({
        registry: runtime.registry,
        secretStore: runtime.secretStore,
        authorized: true,
        synthetic_only: !real,
        allow_real_bootstrap: real,
        authority,
        environment: String(flags.env || ENVIRONMENT.DEVELOPMENT),
        provider_filter: providers,
      });
      plan.mode = real ? 'real_bootstrap' : 'synthetic_verification';
      await writeBootstrapReceipt(DEFAULT_RECEIPTS, plan);
      printJson(plan);
      return;
    }
    if (sub === 'register-metadata') {
      const id = flags.id || positional[1];
      if (!id) {
        console.error('require --id');
        process.exit(2);
      }
      const meta = await registerMetadata({
        secretStore: runtime.secretStore,
        credential_id: String(id),
        environment: String(flags.env || ENVIRONMENT.DEVELOPMENT),
      });
      // Persist memory meta to file for local use
      if (runtime.secretStore.listMetadata) {
        const all = await runtime.secretStore.listMetadata();
        await fs.mkdir(path.dirname(DEFAULT_META), { recursive: true });
        await fs.writeFile(
          DEFAULT_META,
          JSON.stringify(
            {
              schema: 'sccb.credential_metadata.v1',
              note: 'Metadata only — never store secret values',
              credentials: all,
              updated_utc: new Date().toISOString(),
            },
            null,
            2
          ) + '\n',
          { mode: 0o600 }
        );
      }
      printJson(meta);
      return;
    }
    if (sub === 'validate') {
      const id = flags.id || positional[1];
      if (!id) {
        console.error('require --id');
        process.exit(2);
      }
      const result = await validateCredential({
        secretStore: runtime.secretStore,
        credential_id: String(id),
        mark_active_if_usable: true,
      });
      printJson(result);
      if (!result.ok) process.exitCode = 1;
      return;
    }
    console.error('unknown bootstrap subcommand');
    process.exit(2);
  }

  if (cmd === 'wallet') {
    const sub = positional[0] || 'prepare';
    if (sub === 'prepare') {
      let intent;
      if (flags.intent) {
        intent = JSON.parse(String(flags.intent));
      } else {
        intent = {
          network: String(flags.network || '0g-galileo-testnet'),
          to: String(flags.to || '0x0000000000000000000000000000000000000001'),
          amount_wei: String(flags.amount || '0'),
          operation: String(flags.operation || 'transfer'),
        };
      }
      const prepared = prepareTransaction({
        intent,
        registry: runtime.registry,
        control: runtime.control,
        environment: runtime.environment,
        actor: 'cli-operator',
      });
      printJson(prepared);
      return;
    }
    if (sub === 'sign') {
      printJson(
        refuseSign({
          prepare_id: String(flags['prepare-id'] || 'none'),
        })
      );
      process.exitCode = 1;
      return;
    }
  }

  console.error(`unknown command: ${cmd}`);
  process.exit(2);
}

main().catch((err) => {
  console.error(String(err?.message || err));
  process.exit(1);
});
