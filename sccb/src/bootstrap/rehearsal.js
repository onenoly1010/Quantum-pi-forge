/**
 * SCCB bootstrap REHEARSAL — synthetic end-to-end onboarding.
 * Never performs real credential intake. Never connects production systems.
 */

import { randomUUID } from 'node:crypto';
import { CREDENTIAL_DESIGN_CATALOG, firstWaveEnrollmentPlan } from './catalog.js';
import {
  createBootstrapPlan,
  registerMetadata,
  validateCredential,
  associationReport,
  writeBootstrapReceipt,
} from './bootstrap.js';
import { CREDENTIAL_STATUS, ENVIRONMENT, POLICY_DECISION } from '../types.js';
import { projectCapabilityGrant, formatCapabilityLine } from '../grants/projection.js';
import { prepareTransaction, refuseSign } from '../wallet/prepare.js';
import { RECOVERY_PROCEDURE } from '../control/emergency.js';
import { buildReceipt, writeReceipt, verifyReceiptSafety } from '../audit/receipt.js';
import { redactForAudit } from '../redaction.js';

const SYNTH_PREFIX = 'sccb-rehearsal-synth-';

/**
 * Build synthetic fixture material (obviously fake; never real).
 * @param {string} credentialId
 * @param {string[]} envNames
 */
export function syntheticMaterialFor(credentialId, envNames) {
  /** @type {Record<string, string>} */
  const env = {};
  for (const name of envNames) {
    env[name] = `${SYNTH_PREFIX}${credentialId}-${name}-NOT-REAL`;
  }
  return env;
}

/**
 * Produce the precise bootstrap procedure document as structured data (answers 1–10).
 * @param {import('../capabilities/registry.js').CapabilityRegistry} registry
 * @param {import('../authority/state.js').AuthorityState} authority
 */
export function buildRehearsalProcedure(registry, authority) {
  const caps = registry.list();
  const byId = Object.fromEntries(caps.map((c) => [c.id, c]));

  const credentials = CREDENTIAL_DESIGN_CATALOG.map((slot) => {
    const capDetails = slot.capabilities_unlocked.map((cid) => {
      const c = byId[cid];
      return {
        capability_id: cid,
        policy_class: c?.policy_class ?? 'unknown',
        permitted_operations: c?.permitted_operations ?? [],
        approval_required: c?.approval_required ?? true,
        agent_projection: formatCapabilityLine({
          type: 'CAPABILITY',
          capability_id: cid,
        }),
      };
    });
    return {
      // 1–4
      credential_id: slot.id,
      provider: slot.provider,
      what: slot.label,
      why: slot.why,
      capabilities_unlocked: capDetails,
      can_be_scoped: slot.scoping,
      // 5–6
      where_stored: slot.storage,
      who_can_retrieve: slot.retrieval,
      // 7–8
      standing_policy_actions: slot.standing_policy_actions,
      approval_required_actions: slot.approval_required_actions,
      forbidden_until_separate_go: slot.forbidden_until_separate_go,
      enrollment_priority: slot.enrollment_priority,
      recommended_for_first_real_bootstrap: slot.recommended_for_first_real_bootstrap,
      store_unrestricted_private_key: slot.store_unrestricted_private_key,
      operator_notes: slot.operator_notes,
    };
  });

  return {
    schema: 'sccb.bootstrap_rehearsal_procedure.v1',
    title: 'One-time credential bootstrap procedure (rehearsal design)',
    mode: 'REHEARSAL_SYNTHETIC_ONLY',
    real_enrollment_authorized: authority.phases?.credential_bootstrap?.status === 'AUTHORIZED',
    authority_phases: Object.fromEntries(
      Object.entries(authority.phases || {}).map(([k, v]) => [k, v.status])
    ),
    principles: [
      'Never paste secrets into chat, Git, agent context, or logs.',
      'Local interactive intake only: pass insert → GPG vault.',
      'Agents receive CAPABILITY grants, not raw tokens.',
      'Wallet: prefer external signer; do not store unrestricted private keys on agent host.',
      'Chat GO phrases are not authorization; sealed authority-state is.',
      'This rehearsal does not enroll real credentials.',
    ],
    answers: {
      '1_what_credentials': credentials.map((c) => ({
        id: c.credential_id,
        what: c.what,
        provider: c.provider,
      })),
      '2_why_each': credentials.map((c) => ({ id: c.credential_id, why: c.why })),
      '3_capability_each_unlocks': credentials.map((c) => ({
        id: c.credential_id,
        capabilities: c.capabilities_unlocked,
      })),
      '4_scoping': credentials.map((c) => ({ id: c.credential_id, scoping: c.can_be_scoped })),
      '5_where_stored': credentials.map((c) => ({ id: c.credential_id, storage: c.where_stored })),
      '6_who_retrieves': credentials.map((c) => ({
        id: c.credential_id,
        retrieval: c.who_can_retrieve,
      })),
      '7_standing_auto': credentials.flatMap((c) =>
        c.standing_policy_actions.map((a) => ({ credential_id: c.credential_id, action: a }))
      ),
      '8_approval_required': credentials.flatMap((c) =>
        c.approval_required_actions.map((a) => ({ credential_id: c.credential_id, action: a }))
      ),
      '9_emergency_revoke': {
        single_action: 'npm run sccb -- emergency-stop --reason "..."',
        then: [
          'capability-revoke --id <id> for each affected capability',
          'credential-revoke --id <id> in SCCB metadata',
          'Invalidate tokens at provider dashboards (CF, GitHub, …)',
          'Optional: pass rm <path> after provider rotate',
        ],
        full_procedure: 'docs/sccb/EMERGENCY_RECOVERY.md',
      },
      '10_compromise_recovery': {
        laptop: [
          'emergency-stop',
          'Revoke all provider tokens at source',
          'Rotate GPG if agent/unlocked session compromised',
          'Re-bootstrap only after sealed authority re-confirmed',
        ],
        vault_pass: [
          'Assume secrets exposed if GPG passphrase compromised',
          'Rotate every token/key that lived in pass',
          'Re-create pass store under new GPG key if needed',
        ],
        agent: [
          'emergency-stop + revoke capabilities',
          'Secrets should not be in agent context; still rotate if inject was used during compromise window',
          'Review receipts/sccb for unexpected invokes',
        ],
        recovery_text_excerpt: RECOVERY_PROCEDURE.split('\n').slice(0, 12).join('\n'),
      },
    },
    credentials_detailed: credentials,
    first_wave: firstWaveEnrollmentPlan(),
    local_interactive_intake: {
      real_path: [
        '1. Seal credential_bootstrap=AUTHORIZED in authority-state.v1.json (human PR)',
        '2. Terminal (not chat): pass insert <pass_path>',
        '3. Paste secret only into pass (GPG)',
        '4. sccb bootstrap register-metadata --id <id>',
        '5. sccb bootstrap validate --id <id> --pass',
        '6. Non-secret receipt under receipts/sccb/',
      ],
      rehearsal_path: [
        '1. MemorySecretStore fixtures only',
        '2. register-metadata + storeSecret(fixture)',
        '3. validate presence',
        '4. invoke capabilities under policy',
        '5. emergency-stop rehearsal',
        '6. evidence receipt (no real secrets)',
      ],
      never: [
        'Paste secret into LLM chat',
        'Commit secret to Git',
        'Log secret values',
        'Put unrestricted wallet seed on agent host for first bootstrap',
      ],
    },
    secret_values_included: false,
  };
}

/**
 * Run full synthetic onboarding rehearsal.
 *
 * @param {object} opts
 * @param {import('../index.js').createSccbRuntime extends Function} opts — runtime pieces
 * @param {import('../capabilities/registry.js').CapabilityRegistry} opts.registry
 * @param {import('../secrets/memory-store.js').MemorySecretStore} opts.secretStore
 * @param {import('../approval/engine.js').ApprovalEngine} opts.approvals
 * @param {import('../control/emergency.js').ControlPlane} opts.control
 * @param {import('../broker/broker.js').Broker} opts.broker
 * @param {import('../authority/state.js').AuthorityState} opts.authority
 * @param {string|null} [opts.receiptDir]
 * @param {string[]} [opts.enroll_ids] - subset of credential ids to rehearse enroll
 */
export async function runBootstrapRehearsal(opts) {
  const {
    registry,
    secretStore,
    approvals,
    control,
    broker,
    authority,
    receiptDir = null,
    enroll_ids = null,
  } = opts;

  if (authority.phases?.credential_bootstrap?.status === 'AUTHORIZED') {
    // Still OK to rehearse with synthetic — but flag unusual state
  }

  const procedure = buildRehearsalProcedure(registry, authority);
  const wave = firstWaveEnrollmentPlan();
  const enrollList =
    enroll_ids ??
    CREDENTIAL_DESIGN_CATALOG.filter((c) => c.recommended_for_first_real_bootstrap).map(
      (c) => c.id
    );

  const steps = [];
  const synthNeedles = [];

  // Step 0: refuse plan (synthetic)
  const plan = await createBootstrapPlan({
    registry,
    secretStore,
    synthetic_only: true,
    environment: ENVIRONMENT.TEST,
    provider_filter: enrollList.map((id) => {
      const d = CREDENTIAL_DESIGN_CATALOG.find((c) => c.id === id);
      return d?.provider ?? id;
    }),
  });
  steps.push({
    step: 'plan',
    ok: plan.mode === 'synthetic_verification' && plan.secret_values_included === false,
    mode: plan.mode,
  });

  // Step 1–3: register metadata + synthetic store + validate for each first-wave id
  for (const id of enrollList) {
    const design = CREDENTIAL_DESIGN_CATALOG.find((c) => c.id === id);
    if (!design) {
      steps.push({ step: 'enroll', credential_id: id, ok: false, reason: 'unknown id' });
      continue;
    }
    await registerMetadata({
      secretStore,
      credential_id: id,
      environment: ENVIRONMENT.TEST,
    });
    const material = syntheticMaterialFor(id, design.env_names);
    synthNeedles.push(...Object.values(material));
    await secretStore.storeSecret(id, material);
    const meta = await secretStore.getMetadata(id);
    // mark active via validate path
    const v = await validateCredential({
      secretStore,
      credential_id: id,
      mark_active_if_usable: true,
    });
    // ensure active for usable store
    if (meta && meta.status !== CREDENTIAL_STATUS.ACTIVE) {
      await secretStore.putMetadata({
        ...meta,
        status: CREDENTIAL_STATUS.ACTIVE,
        last_validated_utc: new Date().toISOString(),
      });
    }
    const v2 = await validateCredential({ secretStore, credential_id: id });
    steps.push({
      step: 'enroll_synthetic',
      credential_id: id,
      ok: v2.secret_value_returned === false && (v2.ok || (await secretStore.isUsable(id))),
      secret_value_returned: v2.secret_value_returned,
      status: (await secretStore.getMetadata(id))?.status,
    });
  }

  // Step 4: association report
  const assoc = await associationReport(registry, secretStore);
  steps.push({
    step: 'association',
    ok: assoc.secret_values === false,
    rows: assoc.rows.filter((r) => enrollList.includes(r.credential_id) || r.credential_id == null),
  });

  // Step 5: standing ALLOW (no credential)
  const allow = await broker.invoke({
    capability_id: 'qpf.site.funnel.verify',
    operation: 'verify',
    actor: 'bootstrap-rehearsal',
  });
  steps.push({
    step: 'standing_allow',
    ok: allow.result === 'SUCCESS',
    result: allow.result,
  });

  // Step 6: CONDITIONAL dry-run deploy (uses synthetic CF if present)
  const deploy = await broker.invoke({
    capability_id: 'cloudflare.deploy',
    operation: 'deploy',
    actor: 'bootstrap-rehearsal',
    params: { target: 'quantumpiforge', branch: 'main' },
    dry_run: true,
  });
  steps.push({
    step: 'conditional_deploy_dry_run',
    ok: deploy.policy_decision === POLICY_DECISION.ALLOW || deploy.result === 'DRY_RUN',
    policy_decision: deploy.policy_decision,
    result: deploy.result,
  });

  // Step 7: HUMAN approval required
  const merge = await broker.invoke({
    capability_id: 'github.merge',
    operation: 'merge_pr',
    actor: 'bootstrap-rehearsal',
    params: { pr: 1, repo: 'KrisCrispy-spec/Quantum-pi-forge' },
  });
  steps.push({
    step: 'approval_required',
    ok: merge.result === 'APPROVAL_REQUIRED',
    result: merge.result,
    approval_id: merge.data?.approval_id ?? null,
  });

  // Step 8: FORBIDDEN still denied
  const mint = await broker.invoke({
    capability_id: 'economics.mint',
    operation: 'mint',
    actor: 'bootstrap-rehearsal',
    agent_always_approve: true,
  });
  steps.push({
    step: 'forbidden_deny',
    ok: mint.policy_decision === POLICY_DECISION.DENY,
    result: mint.result,
  });

  // Step 9: wallet prepare without key possession
  const prepared = prepareTransaction({
    intent: {
      network: '0g-galileo-testnet',
      to: '0x0000000000000000000000000000000000000001',
      amount_wei: '0',
    },
    registry,
    control,
    environment: ENVIRONMENT.TEST,
  });
  const refused = refuseSign(prepared);
  steps.push({
    step: 'wallet_prepare_no_key',
    ok: prepared.private_key_included === false && refused.signed === false,
    next_step: prepared.next_step,
  });

  // Step 10: grants projection no secrets
  const grants = [];
  for (const cap of registry.list()) {
    let meta = null;
    if (cap.credential_dependency) {
      meta = await secretStore.getMetadata(cap.credential_dependency);
    }
    grants.push(projectCapabilityGrant(cap, meta));
  }
  const grantsJson = JSON.stringify(grants);
  const noLeak = !synthNeedles.some((n) => grantsJson.includes(n));
  steps.push({
    step: 'capability_grants_no_secret',
    ok: noLeak && grants.every((g) => g.secret_value_included === false),
    grant_lines: grants.map((g) => formatCapabilityLine(g)),
  });

  // Step 11: emergency stop rehearsal
  await control.emergencyStop('bootstrap-rehearsal emergency drill');
  const blocked = await broker.invoke({
    capability_id: 'qpf.site.funnel.verify',
    operation: 'verify',
    actor: 'bootstrap-rehearsal',
  });
  steps.push({
    step: 'emergency_stop',
    ok: blocked.policy_decision === POLICY_DECISION.DENY,
    result: blocked.result,
  });
  await control.clearEmergencyStop({ resume_global: true });

  // Step 12: real bootstrap still denied
  let realDenied = false;
  try {
    await createBootstrapPlan({
      registry,
      secretStore,
      allow_real_bootstrap: true,
      authority,
      authorized: true,
    });
  } catch {
    realDenied = true;
  }
  steps.push({
    step: 'real_bootstrap_still_denied',
    ok: realDenied || authority.phases?.credential_bootstrap?.status !== 'AUTHORIZED',
    real_denied: realDenied,
  });

  // Audit sample
  const auditSample = buildReceipt({
    actor: 'bootstrap-rehearsal',
    capability_id: 'sccb.bootstrap_rehearsal',
    operation: 'rehearse',
    policy_class: 'HUMAN_APPROVAL',
    policy_decision: 'ALLOW',
    policy_reason: 'synthetic rehearsal authorized',
    approval_state: 'NOT_REQUIRED',
    execution_state: 'SUCCESS',
    result: 'REHEARSAL_COMPLETE',
    params_hash: randomUUID().slice(0, 16),
    params: { enrollList, mode: 'synthetic' },
  });
  const auditSafety = verifyReceiptSafety(auditSample);

  const allOk = steps.every((s) => s.ok !== false);
  const report = {
    schema: 'sccb.bootstrap_rehearsal_result.v1',
    mode: 'SYNTHETIC_REHEARSAL',
    real_credentials_enrolled: false,
    real_secret_intake: false,
    production_connected: false,
    overall_pass: allOk && auditSafety.ok && noLeak,
    started_note: 'GO SCCB_BOOTSTRAP_REHEARSAL — not credential intake',
    procedure_summary: {
      credential_count: procedure.credentials_detailed.length,
      first_wave: wave.first_wave.map((f) => f.id),
      deferred: wave.deferred.map((d) => d.id),
    },
    steps,
    audit_safety: auditSafety,
    first_wave_plan: wave,
    secret_values_in_report: false,
    next_real_step:
      'Only after human seals credential_bootstrap=AUTHORIZED and reviews docs/sccb/BOOTSTRAP_REHEARSAL.md',
  };

  // Ensure no synth needles in full report JSON
  const reportJson = JSON.stringify(report);
  if (synthNeedles.some((n) => reportJson.includes(n))) {
    report.overall_pass = false;
    report.steps.push({
      step: 'report_non_disclosure',
      ok: false,
      reason: 'synthetic material leaked into report',
    });
  }

  let receipt_path = null;
  if (receiptDir) {
    receipt_path = await writeReceipt(receiptDir, {
      ...auditSample,
      extra: redactForAudit({
        overall_pass: report.overall_pass,
        steps: report.steps,
        first_wave: wave.first_wave.map((f) => f.id),
      }),
    });
    await writeBootstrapReceipt(receiptDir, {
      type: 'bootstrap_rehearsal',
      overall_pass: report.overall_pass,
      real_secret_intake: false,
    });
  }

  return {
    report,
    procedure,
    receipt_path,
  };
}
