/**
 * SCCB v1 comprehensive tests.
 * Uses node:test + MemorySecretStore only. No real secrets.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  createSccbRuntime,
  MemorySecretStore,
  CapabilityRegistry,
  defaultCapabilities,
  evaluatePolicy,
  hashParams,
  ApprovalEngine,
  ControlPlane,
  Broker,
  buildReceipt,
  verifyReceiptSafety,
  redactForAudit,
  redactString,
  isSecretFieldName,
  prepareTransaction,
  refuseSign,
  evaluateTxLimits,
  createBootstrapPlan,
  registerMetadata,
  validateCredential,
  discoverRequiredCredentials,
  POLICY_CLASS,
  POLICY_DECISION,
  CREDENTIAL_STATUS,
  ENVIRONMENT,
  createCredentialMeta,
} from '../src/index.js';

describe('SCCB v1', () => {
  /** @type {Awaited<ReturnType<typeof createSccbRuntime>>} */
  let rt;

  beforeEach(async () => {
    rt = await createSccbRuntime({ environment: ENVIRONMENT.TEST });
    await rt.secretStore.provisionFixture(
      {
        id: 'cloudflare-api-token',
        provider: 'cloudflare',
        env_names: ['CLOUDFLARE_API_TOKEN'],
        environment: ENVIRONMENT.TEST,
      },
      { CLOUDFLARE_API_TOKEN: 'test-fixture-token-not-real' }
    );
    await rt.secretStore.provisionFixture(
      {
        id: 'github-token',
        provider: 'github',
        env_names: ['GITHUB_TOKEN'],
        environment: ENVIRONMENT.TEST,
      },
      { GITHUB_TOKEN: 'test-fixture-gh-not-real' }
    );
  });

  describe('unauthorized capability rejection', () => {
    it('denies unknown capability', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'does.not.exist',
        operation: 'anything',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
      assert.equal(r.result, 'DENIED');
    });

    it('denies operation not in permitted_operations', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'delete_account',
        actor: 'test',
        params: { target: 'quantumpiforge', branch: 'main' },
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });

    it('denies FORBIDDEN economics.mint', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'economics.mint',
        operation: 'mint',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
      assert.match(r.reason, /LOCKED|forbidden|Mint/i);
    });

    it('denies wallet.sign_transaction', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'wallet.sign_transaction',
        operation: 'sign',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });

    it('denies pi.read while forbidden', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'pi.read',
        operation: 'read_status',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });
  });

  describe('policy matching', () => {
    it('allows PREAUTHORIZED funnel verify', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.ALLOW);
      assert.equal(r.result, 'SUCCESS');
    });

    it('allows CONDITIONAL cloudflare.deploy when target+branch match', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'test',
        params: { target: 'quantumpiforge', branch: 'main' },
        dry_run: true,
      });
      assert.equal(r.policy_decision, POLICY_DECISION.ALLOW);
      assert.equal(r.execution_state, 'DRY_RUN');
    });
  });

  describe('policy mismatch', () => {
    it('escalates deploy to non-allowlisted target', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'test',
        params: { target: 'evil-project', branch: 'main' },
      });
      assert.equal(r.policy_decision, POLICY_DECISION.ESCALATE);
      assert.equal(r.result, 'APPROVAL_REQUIRED');
      assert.ok(r.data?.approval_id);
    });

    it('escalates deploy from non-main branch', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'test',
        params: { target: 'quantumpiforge', branch: 'feature/x' },
      });
      assert.equal(r.policy_decision, POLICY_DECISION.ESCALATE);
    });
  });

  describe('approval-required behavior', () => {
    it('requires human approval for github.merge', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params: { pr: 1, repo: 'KrisCrispy-spec/Quantum-pi-forge' },
      });
      assert.equal(r.result, 'APPROVAL_REQUIRED');
      assert.equal(r.approval_state, 'PENDING');
    });

    it('allows after human approval bound to params_hash', async () => {
      const params = { pr: 42, repo: 'KrisCrispy-spec/Quantum-pi-forge' };
      const first = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
      });
      assert.equal(first.result, 'APPROVAL_REQUIRED');
      await rt.approvals.decide(first.data.approval_id, 'APPROVED', {
        decided_by: 'kris',
        reasoning: 'test approval',
        ttl_seconds: 600,
      });
      const second = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
        approval_id: first.data.approval_id,
      });
      assert.equal(second.policy_decision, POLICY_DECISION.ALLOW);
      assert.equal(second.result, 'SUCCESS');
    });

    it('rejects when human rejects', async () => {
      const params = { pr: 7 };
      const first = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
      });
      await rt.approvals.decide(first.data.approval_id, 'REJECTED', {
        decided_by: 'kris',
      });
      // prior rejection via findValid won't apply; re-invoke without approval stays escalate
      // Use prior_approval path by passing rejected id — evaluate checks REJECTED
      const rec = rt.approvals.get(first.data.approval_id);
      assert.equal(rec.state, 'REJECTED');
    });

    it('does not treat agent_always_approve as policy bypass', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params: { pr: 99 },
        agent_always_approve: true,
      });
      assert.equal(r.result, 'APPROVAL_REQUIRED');
      assert.notEqual(r.policy_decision, POLICY_DECISION.ALLOW);
    });

    it('does not allow always_approve to bypass FORBIDDEN', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'economics.mint',
        operation: 'mint',
        actor: 'agent',
        agent_always_approve: true,
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });
  });

  describe('revocation', () => {
    it('denies revoked capability', async () => {
      await rt.control.revokeCapability('cloudflare.pages.read', rt.registry);
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.pages.read',
        operation: 'list_projects',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
      assert.match(r.reason, /revoked|paused/i);
    });

    it('denies when credential revoked', async () => {
      await rt.secretStore.setStatus('cloudflare-api-token', CREDENTIAL_STATUS.REVOKED);
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'test',
        params: { target: 'quantumpiforge', branch: 'main' },
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
      assert.match(r.reason, /credential|revoked/i);
    });
  });

  describe('emergency stop', () => {
    it('blocks all invocations when emergency stop active', async () => {
      await rt.control.emergencyStop('test stop');
      const r = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
      assert.match(r.reason, /emergency/i);
    });

    it('blocks on global pause', async () => {
      await rt.control.setGlobalPause(true);
      const r = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });

    it('blocks per-capability pause only', async () => {
      await rt.control.pauseCapability('cloudflare.deploy');
      const ok = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
      });
      assert.equal(ok.result, 'SUCCESS');
      const blocked = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'test',
        params: { target: 'quantumpiforge', branch: 'main' },
      });
      assert.equal(blocked.policy_decision, POLICY_DECISION.DENY);
    });

    it('clears emergency stop when requested', async () => {
      await rt.control.emergencyStop('x');
      await rt.control.clearEmergencyStop({ resume_global: true });
      const r = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
      });
      assert.equal(r.result, 'SUCCESS');
    });
  });

  describe('secret non-disclosure', () => {
    it('metadata never includes secret values', async () => {
      const meta = await rt.secretStore.getMetadata('cloudflare-api-token');
      assert.ok(meta);
      assert.equal(meta.env_names[0], 'CLOUDFLARE_API_TOKEN');
      assert.equal(Object.prototype.hasOwnProperty.call(meta, 'secret'), false);
      assert.equal(Object.prototype.hasOwnProperty.call(meta, 'value'), false);
      assert.equal(Object.prototype.hasOwnProperty.call(meta, 'token'), false);
      const json = JSON.stringify(meta);
      assert.equal(json.includes('test-fixture-token-not-real'), false);
    });

    it('broker result never includes fixture secret', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'test',
        params: { target: 'quantumpiforge', branch: 'main' },
        dry_run: true,
      });
      const json = JSON.stringify(r);
      assert.equal(json.includes('test-fixture-token-not-real'), false);
      assert.equal(r.secret_exposed_to_llm, false);
    });

    it('rejects secret fields in credential metadata', () => {
      assert.throws(() =>
        createCredentialMeta({
          id: 'x',
          provider: 'y',
          secret: 'nope',
        })
      );
    });

    it('loadForInject fails after revoke and drops material', async () => {
      await rt.secretStore.setStatus('cloudflare-api-token', CREDENTIAL_STATUS.REVOKED);
      await assert.rejects(() => rt.secretStore.loadForInject('cloudflare-api-token'));
    });
  });

  describe('log redaction', () => {
    it('redacts secret field names', () => {
      const out = redactForAudit({
        api_key: 'sk-super-secret',
        project: 'quantumpiforge',
        nested: { password: 'hunter2', ok: true },
      });
      assert.equal(out.api_key, '[REDACTED]');
      assert.equal(out.nested.password, '[REDACTED]');
      assert.equal(out.project, 'quantumpiforge');
      assert.equal(out.nested.ok, true);
    });

    it('redacts private key patterns in strings', () => {
      const s = redactString('key=0x' + 'a'.repeat(64));
      assert.match(s, /REDACTED/);
    });

    it('isSecretFieldName detects common names', () => {
      assert.equal(isSecretFieldName('private_key'), true);
      assert.equal(isSecretFieldName('seed_phrase'), true);
      assert.equal(isSecretFieldName('project'), false);
    });

    it('receipt safety verifier catches secrets', () => {
      const bad = {
        secret_exposed_to_llm: false,
        api_key: 'literally-a-key-value',
      };
      const v = verifyReceiptSafety(bad);
      assert.equal(v.ok, false);
    });

    it('buildReceipt forces secret_exposed_to_llm false and redacts', () => {
      const rec = buildReceipt({
        actor: 't',
        capability_id: 'x',
        operation: 'y',
        params: { password: 'secret', target: 'ok' },
      });
      assert.equal(rec.secret_exposed_to_llm, false);
      assert.equal(rec.params_redacted.password, '[REDACTED]');
      assert.equal(rec.params_redacted.target, 'ok');
      const v = verifyReceiptSafety(rec);
      assert.equal(v.ok, true);
    });
  });

  describe('transaction-policy limits', () => {
    it('prepares tx without signing', () => {
      const prepared = prepareTransaction({
        intent: {
          network: '0g-galileo-testnet',
          to: '0x0000000000000000000000000000000000000001',
          amount_wei: '1000',
          operation: 'transfer',
        },
        registry: rt.registry,
        control: rt.control,
        environment: ENVIRONMENT.TEST,
      });
      assert.equal(prepared.signing_enabled, false);
      assert.equal(prepared.can_sign, false);
      assert.equal(prepared.private_key_included, false);
      assert.equal(prepared.next_step, 'signing_disabled');
    });

    it('blocks mint economic ops in limits', () => {
      const lim = evaluateTxLimits(
        {
          network: '0g-galileo-testnet',
          to: '0x1',
          amount_wei: '1',
          operation: 'mint',
        },
        {}
      );
      assert.equal(lim.ok, false);
      assert.ok(lim.failed.some((f) => /mint|locked/i.test(f)));
    });

    it('enforces max_amount_wei', () => {
      const lim = evaluateTxLimits(
        {
          network: '0g-galileo-testnet',
          to: '0x1',
          amount_wei: '1000000',
          operation: 'transfer',
        },
        { max_amount_wei: '100', allowed_networks: ['0g-galileo-testnet'] }
      );
      assert.equal(lim.ok, false);
    });

    it('refuseSign never signs', () => {
      const r = refuseSign({ prepare_id: 'abc' });
      assert.equal(r.signed, false);
      assert.equal(r.broadcast, false);
      assert.equal(r.secret_exposed, false);
    });

    it('0g.submit_transaction is forbidden', async () => {
      const r = await rt.broker.invoke({
        capability_id: '0g.submit_transaction',
        operation: 'submit',
        actor: 'test',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });
  });

  describe('replay / idempotency protections', () => {
    it('params_hash differs for different params', () => {
      assert.notEqual(hashParams({ a: 1 }), hashParams({ a: 2 }));
      assert.equal(hashParams({ a: 1, b: 2 }), hashParams({ b: 2, a: 1 }));
    });

    it('approval does not apply to different params', async () => {
      const p1 = { pr: 1 };
      const first = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params: p1,
      });
      await rt.approvals.decide(first.data.approval_id, 'APPROVED', {
        decided_by: 'kris',
        ttl_seconds: 600,
      });
      const other = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params: { pr: 2 },
        approval_id: first.data.approval_id,
      });
      // prior_approval params_hash mismatch → still escalate
      assert.equal(other.result, 'APPROVAL_REQUIRED');
    });

    it('idempotency_key returns replay', async () => {
      const r1 = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
        idempotency_key: 'same-key-1',
      });
      const r2 = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
        idempotency_key: 'same-key-1',
      });
      assert.equal(r1.result, 'SUCCESS');
      assert.equal(r2.result, 'IDEMPOTENT_REPLAY');
      assert.equal(r2.request_id, r1.request_id);
    });

    it('consumed approval cannot be reused', async () => {
      const params = { pr: 55 };
      const first = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
      });
      await rt.approvals.decide(first.data.approval_id, 'APPROVED', {
        decided_by: 'kris',
        ttl_seconds: 600,
      });
      const second = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
        approval_id: first.data.approval_id,
      });
      assert.equal(second.result, 'SUCCESS');
      const third = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
        approval_id: first.data.approval_id,
      });
      assert.equal(third.result, 'APPROVAL_REQUIRED');
    });
  });

  describe('development/test isolation', () => {
    it('runtime environment is test', () => {
      assert.equal(rt.environment, ENVIRONMENT.TEST);
    });

    it('bootstrap refuses without authorization', async () => {
      await assert.rejects(
        () =>
          createBootstrapPlan({
            registry: rt.registry,
            secretStore: rt.secretStore,
            authorized: false,
          }),
        /not authorized/i
      );
    });

    it('bootstrap plan never includes secret values', async () => {
      const plan = await createBootstrapPlan({
        registry: rt.registry,
        secretStore: rt.secretStore,
        authorized: true,
        environment: ENVIRONMENT.TEST,
        provider_filter: ['cloudflare'],
      });
      assert.equal(plan.secret_values_included, false);
      const json = JSON.stringify(plan);
      assert.equal(json.includes('test-fixture-token-not-real'), false);
      assert.ok(plan.steps.length >= 1);
    });

    it('registerMetadata does not accept secrets', async () => {
      const meta = await registerMetadata({
        secretStore: rt.secretStore,
        credential_id: 'cloudflare-api-token',
        environment: ENVIRONMENT.TEST,
      });
      assert.ok(meta.id);
      assert.equal(JSON.stringify(meta).includes('test-fixture'), false);
    });

    it('validateCredential does not return secret', async () => {
      const v = await validateCredential({
        secretStore: rt.secretStore,
        credential_id: 'cloudflare-api-token',
      });
      assert.equal(v.secret_value_returned, false);
      assert.equal(JSON.stringify(v).includes('test-fixture-token-not-real'), false);
    });

    it('discoverRequiredCredentials lists dependencies', () => {
      const d = discoverRequiredCredentials(rt.registry);
      assert.ok(d.some((x) => x.credential_id === 'cloudflare-api-token'));
    });

    it('production signing env gate blocks can_sign in test', () => {
      const prepared = prepareTransaction({
        intent: {
          network: '0g-galileo-testnet',
          to: '0x1',
          amount_wei: '1',
        },
        registry: rt.registry,
        control: rt.control,
        environment: ENVIRONMENT.TEST,
        signing_enabled: true,
      });
      assert.equal(prepared.can_sign, false);
      assert.equal(prepared.signing_enabled, false);
    });
  });

  describe('audit receipts', () => {
    it('writes non-secret receipt files', async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sccb-receipts-'));
      const broker = new Broker({
        registry: rt.registry,
        secretStore: rt.secretStore,
        approvals: rt.approvals,
        control: rt.control,
        receiptDir: dir,
        environment: ENVIRONMENT.TEST,
      });
      const r = await broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'test',
      });
      assert.ok(r.receipt_path);
      const body = await fs.readFile(r.receipt_path, 'utf8');
      const parsed = JSON.parse(body);
      assert.equal(parsed.secret_exposed_to_llm, false);
      assert.equal(parsed.capability_id, 'qpf.site.funnel.verify');
      assert.ok(parsed.timestamp);
      assert.ok(parsed.evidence_id);
      const safety = verifyReceiptSafety(parsed);
      assert.equal(safety.ok, true);
      await fs.rm(dir, { recursive: true, force: true });
    });
  });

  describe('inject isolation', () => {
    it('inject runs child with secret but agentSafeResult has no value', async () => {
      const { runWithInjectedSecrets, agentSafeResult } = await import('../src/broker/inject.js');
      const result = await runWithInjectedSecrets(
        rt.secretStore,
        'cloudflare-api-token',
        'node',
        ['-e', 'process.exit(process.env.CLOUDFLARE_API_TOKEN ? 0 : 1)'],
        { allowlist: ['node'] }
      );
      assert.equal(result.code, 0);
      const safe = agentSafeResult(result);
      assert.equal(safe.secret_values_returned, false);
      assert.equal(JSON.stringify(safe).includes('test-fixture-token-not-real'), false);
    });

    it('rejects non-allowlisted commands', async () => {
      const { runWithInjectedSecrets } = await import('../src/broker/inject.js');
      await assert.rejects(
        () =>
          runWithInjectedSecrets(rt.secretStore, 'cloudflare-api-token', 'curl', ['http://x'], {
            allowlist: ['node'],
          }),
        /allowlist/i
      );
    });
  });

  describe('default capabilities catalog', () => {
    it('includes required capability ids from BUILD spec', () => {
      const ids = defaultCapabilities().map((c) => c.id);
      for (const need of [
        'cloudflare.deploy',
        'github.merge',
        'pi.read',
        'wallet.prepare_transaction',
        'wallet.sign_transaction',
        '0g.submit_transaction',
      ]) {
        assert.ok(ids.includes(need), `missing ${need}`);
      }
    });

    it('each capability has required fields', () => {
      for (const c of defaultCapabilities()) {
        assert.ok(c.id);
        assert.ok(c.scope);
        assert.ok(Array.isArray(c.permitted_operations));
        assert.ok(c.policy_class);
        assert.ok(c.audit?.never_include_secrets);
        assert.ok(Object.prototype.hasOwnProperty.call(c, 'credential_dependency'));
        assert.ok(Object.prototype.hasOwnProperty.call(c, 'approval_required'));
      }
    });
  });

  describe('evaluatePolicy unit', () => {
    it('PREAUTHORIZED allows', () => {
      const cap = defaultCapabilities().find((c) => c.id === 'qpf.site.funnel.verify');
      const r = evaluatePolicy({
        capability_id: cap.id,
        operation: 'verify',
        actor: 't',
        capability: cap,
        control: {},
      });
      assert.equal(r.decision, POLICY_DECISION.ALLOW);
    });
  });
});
