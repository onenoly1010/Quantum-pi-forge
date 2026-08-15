#!/usr/bin/env node
/**
 * SCCB BOOTSTRAP REHEARSAL — synthetic end-to-end onboarding.
 * Does NOT enroll real credentials. Does NOT connect production.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const RECEIPT_DIR = path.join(REPO_ROOT, 'receipts', 'sccb');
const DOCS_OUT = path.join(REPO_ROOT, 'docs/sccb/BOOTSTRAP_REHEARSAL.md');

async function main() {
  const {
    createSccbRuntime,
    ENVIRONMENT,
    loadAuthorityState,
    authorityStateHash,
    isPhaseAuthorized,
    mayBootstrapCredentials,
    runBootstrapRehearsal,
    firstWaveEnrollmentPlan,
  } = await import('../src/index.js');

  const authority = await loadAuthorityState();
  const authHash = await authorityStateHash();

  if (!isPhaseAuthorized(authority, 'bootstrap_rehearsal')) {
    console.error(
      'bootstrap_rehearsal phase is NOT_AUTHORIZED in sealed authority-state. Refusing.'
    );
    process.exit(2);
  }
  if (mayBootstrapCredentials(authority)) {
    console.warn(
      'NOTE: credential_bootstrap is AUTHORIZED in sealed state — rehearsal still uses synthetic only.'
    );
  }

  const rt = await createSccbRuntime({
    environment: ENVIRONMENT.TEST,
    receiptDir: RECEIPT_DIR,
  });

  const { report, procedure, receipt_path } = await runBootstrapRehearsal({
    registry: rt.registry,
    secretStore: rt.secretStore,
    approvals: rt.approvals,
    control: rt.control,
    broker: rt.broker,
    authority,
    receiptDir: RECEIPT_DIR,
  });

  const stamp = new Date().toISOString().replace(/[:.]/g, '');
  const jsonPath = path.join(RECEIPT_DIR, `${stamp}-bootstrap-rehearsal.json`);
  const evidence = {
    schema: 'sccb.bootstrap_rehearsal_evidence.v1',
    completed_utc: new Date().toISOString(),
    authority_sha256: authHash,
    authority_phases: Object.fromEntries(
      Object.entries(authority.phases || {}).map(([k, v]) => [k, v.status])
    ),
    real_credential_bootstrap_authorized: mayBootstrapCredentials(authority),
    report,
    procedure_digest: {
      principles: procedure.principles,
      first_wave: procedure.first_wave,
      answers_keys: Object.keys(procedure.answers),
      credential_ids: procedure.credentials_detailed.map((c) => c.credential_id),
    },
    // Full procedure embedded for operator review (no secrets)
    procedure,
    receipt_path,
    secret_values_included: false,
  };
  await fs.mkdir(RECEIPT_DIR, { recursive: true });
  await fs.writeFile(jsonPath, JSON.stringify(evidence, null, 2) + '\n');

  // Human-readable procedure
  const md = renderMarkdown(procedure, report, authHash, jsonPath);
  await fs.writeFile(DOCS_OUT, md);

  console.log(
    JSON.stringify(
      {
        overall_pass: report.overall_pass,
        mode: 'SYNTHETIC_REHEARSAL',
        real_credentials_enrolled: false,
        credential_bootstrap_authorized: mayBootstrapCredentials(authority),
        first_wave: firstWaveEnrollmentPlan().first_wave.map((f) => f.id),
        steps_ok: report.steps.filter((s) => s.ok).length,
        steps_total: report.steps.length,
        evidence: path.relative(REPO_ROOT, jsonPath),
        procedure_doc: path.relative(REPO_ROOT, DOCS_OUT),
        receipt_path,
      },
      null,
      2
    )
  );

  if (!report.overall_pass) {
    console.error('\nBOOTSTRAP_REHEARSAL_FAILED');
    process.exit(1);
  }
  console.log('\nSCCB_BOOTSTRAP_REHEARSAL_PASSED');
  console.log('Real credential enrollment remains NOT AUTHORIZED.');
  process.exit(0);
}

function renderMarkdown(procedure, report, authHash, evidencePath) {
  const c = procedure.credentials_detailed;
  return `# SCCB Bootstrap Rehearsal — Procedure & Results

**Mode:** SYNTHETIC REHEARSAL ONLY  
**Real credential enrollment:** NOT PERFORMED / NOT AUTHORIZED  
**Authority file SHA-256:** \`${authHash}\`  
**Rehearsal result:** \`${report.overall_pass ? 'PASSED' : 'FAILED'}\`  
**Evidence:** \`${evidencePath.replace(/.*receipts/, 'receipts')}\`

> Do **not** paste real secrets into chat. Real intake is local \`pass insert\` only after sealed \`credential_bootstrap=AUTHORIZED\`.

## Principles

${procedure.principles.map((p) => `- ${p}`).join('\n')}

## First wave (recommended when real enrollment is later authorized)

${procedure.first_wave.first_wave
  .map((f) => `- **${f.id}** (${f.provider}): ${f.why}`)
  .join('\n')}

### Deferred (not first wave)

${procedure.first_wave.deferred.map((d) => `- **${d.id}**: ${d.reason}`).join('\n')}

---

## 1. Exactly what credentials / configuration are needed

| ID | Provider | What |
| --- | --- | --- |
${c.map((x) => `| \`${x.credential_id}\` | ${x.provider} | ${x.what} |`).join('\n')}

## 2. Why each is needed

| ID | Why |
| --- | --- |
${c.map((x) => `| \`${x.credential_id}\` | ${x.why} |`).join('\n')}

## 3. Capability each unlocks

${c
  .map((x) => {
    const lines = x.capabilities_unlocked
      .map(
        (cap) =>
          `  - \`${cap.capability_id}\` (${cap.policy_class}) → agent sees \`${cap.agent_projection}\``
      )
      .join('\n');
    return `### \`${x.credential_id}\`\n${lines}`;
  })
  .join('\n\n')}

## 4. Scoping (read-only / short-lived)

${c
  .map((x) => {
    const s = x.can_be_scoped;
    return `### \`${x.credential_id}\`
- Preferred: ${s.preferred}
- Read-only possible: ${s.read_only_possible ?? 'n/a'}
- Short-lived: ${s.short_lived ?? 'n/a'}
${s.strongly_discouraged ? `- **Strongly discouraged:** ${s.strongly_discouraged}` : ''}`;
  })
  .join('\n\n')}

## 5. Where stored

| ID | Backend | Path |
| --- | --- | --- |
${c
  .map(
    (x) =>
      `| \`${x.credential_id}\` | ${x.where_stored.backend} | \`${x.where_stored.path || x.where_stored.pass_path || ''}\` |`
  )
  .join('\n')}

Metadata only may live in gitignored \`credential-metadata.local.json\`. **Never** secrets in Git.

## 6. Who / what can retrieve

| ID | Who | Agent sees |
| --- | --- | --- |
${c
  .map(
    (x) =>
      `| \`${x.credential_id}\` | ${x.who_can_retrieve.who} | ${x.who_can_retrieve.agent_sees} |`
  )
  .join('\n')}

## 7. Standing policy (automatic under sealed policy)

${procedure.answers['7_standing_auto'].map((a) => `- \`${a.action}\` (via \`${a.credential_id || 'none'}\`)`).join('\n') || '- (none beyond no-credential PREAUTHORIZED)'}

Also always standing without credentials: \`qpf.site.funnel.verify\`.

## 8. Actions requiring human approval

${procedure.answers['8_approval_required'].map((a) => `- \`${a.action}\``).join('\n')}

## 9. Emergency revoke (one primary action)

\`\`\`bash
npm run sccb -- emergency-stop --reason "compromise suspected"
\`\`\`

Then:

${procedure.answers['9_emergency_revoke'].then.map((t) => `- ${t}`).join('\n')}

Full text: \`${procedure.answers['9_emergency_revoke'].full_procedure}\`

## 10. Compromise recovery

### Laptop
${procedure.answers['10_compromise_recovery'].laptop.map((t) => `- ${t}`).join('\n')}

### Vault (\`pass\` / GPG)
${procedure.answers['10_compromise_recovery'].vault_pass.map((t) => `- ${t}`).join('\n')}

### Agent process
${procedure.answers['10_compromise_recovery'].agent.map((t) => `- ${t}`).join('\n')}

---

## Local interactive intake (real — future only)

${procedure.local_interactive_intake.real_path.map((t, i) => `${i + 1}. ${t.replace(/^\\d+\\. /, '')}`).join('\n')}

### Never

${procedure.local_interactive_intake.never.map((t) => `- ${t}`).join('\n')}

### Wallet boundary

Prefer **external / hardware / policy signer**. SCCB orchestrates \`wallet.prepare_transaction\` without unrestricted private keys. Do **not** enroll raw seeds in first real bootstrap.

---

## Rehearsal run steps (this execution)

| Step | OK | Detail |
| --- | --- | --- |
${report.steps
  .map((s) => `| ${s.step} | ${s.ok ? 'yes' : 'NO'} | ${JSON.stringify({ ...s, step: undefined, ok: undefined })} |`)
  .join('\n')}

---

## Authority state (machine-verifiable)

| Phase | Expected for rehearsal |
| --- | --- |
| bootstrap_rehearsal | AUTHORIZED |
| credential_bootstrap | **NOT_AUTHORIZED** |
| wallet_signing / pi / economics | NOT_AUTHORIZED |

## Exact next authorization for real enrollment

1. Human reviews this document.  
2. Human sets \`sccb/config/authority-state.v1.json\` → \`credential_bootstrap.status = AUTHORIZED\`.  
3. Local terminal: \`pass insert\` only (never chat).  
4. \`npm run sccb -- bootstrap plan --real --provider cloudflare\` (then github).  
5. register-metadata + validate.

**Not sufficient:** this rehearsal pass, chat GO, always-approve, or silence.

---

${report.overall_pass ? '## SCCB_BOOTSTRAP_REHEARSAL_PASSED' : '## SCCB_BOOTSTRAP_REHEARSAL_FAILED'}

Real credential enrollment remains **blocked** until sealed \`credential_bootstrap\`.
`;
}

main().catch((e) => {
  console.error(String(e?.stack || e));
  process.exit(1);
});
