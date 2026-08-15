/**
 * SCCB adversarial verification — synthetic fixtures only.
 * Proves secrets stay out of agent context; authority is machine-verifiable.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  createSccbRuntime,
  MemorySecretStore,
  evaluatePolicy,
  POLICY_DECISION,
  CREDENTIAL_STATUS,
  ENVIRONMENT,
  createBootstrapPlan,
  prepareTransaction,
  refuseSign,
  buildReceipt,
  verifyReceiptSafety,
  redactForAudit,
  projectCapabilityGrant,
  formatCapabilityLine,
  projectAllGrants,
  projectBrokerResultForAgent,
  projectPreparedTxForAgent,
  loadAuthorityState,
  authorityStateHash,
  isPhaseAuthorized,
  assertPhaseAuthorized,
  mayBootstrapCredentials,
  DEFAULT_AUTHORITY_PATH,
  runWithInjectedSecrets,
  agentSafeResult,
  defaultCapabilities,
} from '../src/index.js';

const FAKE_API_KEY = 'sk-fake-adversarial-key-DO-NOT-USE-9f3a2b1c';
const FAKE_PASSWORD = 'P@ssw0rd-adversarial-fixture-only';
const FAKE_WALLET_KEY = '0x' + 'ab'.repeat(32);
const FAKE_GH = 'ghp_FakeAdversarialTokenNotReal000001';

describe('SCCB adversarial verification (synthetic only)', () => {
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
      { CLOUDFLARE_API_TOKEN: FAKE_API_KEY }
    );
    await rt.secretStore.provisionFixture(
      {
        id: 'github-token',
        provider: 'github',
        env_names: ['GITHUB_TOKEN'],
        environment: ENVIRONMENT.TEST,
      },
      { GITHUB_TOKEN: FAKE_GH }
    );
    await rt.secretStore.provisionFixture(
      {
        id: 'wallet-signer',
        provider: 'wallet',
        env_names: ['WALLET_SIGNER_REF'],
        environment: ENVIRONMENT.TEST,
      },
      { WALLET_SIGNER_REF: FAKE_WALLET_KEY }
    );
    // password-like credential
    await rt.secretStore.provisionFixture(
      {
        id: 'delivery-x',
        provider: 'delivery',
        env_names: ['TWITTER_API_KEY', 'TWITTER_API_SECRET'],
        environment: ENVIRONMENT.TEST,
      },
      {
        TWITTER_API_KEY: FAKE_PASSWORD,
        TWITTER_API_SECRET: FAKE_PASSWORD + '-secret',
      }
    );
  });

  describe('fake credentials never surface to agent', () => {
    it('metadata list excludes fake API key', async () => {
      const list = await rt.secretStore.listMetadata();
      const json = JSON.stringify(list);
      assert.equal(json.includes(FAKE_API_KEY), false);
      assert.equal(json.includes(FAKE_GH), false);
      assert.equal(json.includes(FAKE_WALLET_KEY), false);
      assert.equal(json.includes(FAKE_PASSWORD), false);
    });

    it('broker dry-run result excludes fake API key', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'adversary-agent',
        params: { target: 'quantumpiforge', branch: 'main' },
        dry_run: true,
      });
      const agentView = projectBrokerResultForAgent(r);
      const json = JSON.stringify(agentView);
      assert.equal(json.includes(FAKE_API_KEY), false);
      assert.equal(agentView.secret_value_included, false);
      assert.equal(agentView.secret_exposed_to_llm, false);
    });

    it('inject agentSafeResult never returns secret values', async () => {
      const raw = await runWithInjectedSecrets(
        rt.secretStore,
        'github-token',
        'node',
        ['-e', 'process.exit(process.env.GITHUB_TOKEN ? 0 : 1)'],
        { allowlist: ['node'] }
      );
      assert.equal(raw.code, 0);
      const safe = agentSafeResult(raw);
      assert.equal(safe.secret_values_returned, false);
      assert.equal(JSON.stringify(safe).includes(FAKE_GH), false);
      // raw has stdout but agent path must not forward body when secret_injected
      assert.equal(Object.prototype.hasOwnProperty.call(safe, 'stdout'), false);
    });

    it('redaction strips fake password fields', () => {
      const out = redactForAudit({
        password: FAKE_PASSWORD,
        api_key: FAKE_API_KEY,
        private_key: FAKE_WALLET_KEY,
        project: 'ok',
      });
      assert.equal(out.password, '[REDACTED]');
      assert.equal(out.api_key, '[REDACTED]');
      assert.equal(out.private_key, '[REDACTED]');
      assert.equal(out.project, 'ok');
    });
  });

  describe('expired / revoked credentials', () => {
    it('revoked credential denies deploy', async () => {
      await rt.secretStore.setStatus('cloudflare-api-token', CREDENTIAL_STATUS.REVOKED);
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'agent',
        params: { target: 'quantumpiforge', branch: 'main' },
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
      assert.equal(JSON.stringify(r).includes(FAKE_API_KEY), false);
    });

    it('disabled credential denies', async () => {
      await rt.secretStore.setStatus('github-token', CREDENTIAL_STATUS.DISABLED);
      const r = await rt.broker.invoke({
        capability_id: 'github.pr.create',
        operation: 'create_pr',
        actor: 'agent',
        params: { repo: 'KrisCrispy-spec/Quantum-pi-forge' },
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });

    it('expired credential denies', async () => {
      await rt.secretStore.setStatus('cloudflare-api-token', CREDENTIAL_STATUS.EXPIRED);
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.pages.read',
        operation: 'list_projects',
        actor: 'agent',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });

    it('loadForInject throws after revoke', async () => {
      await rt.secretStore.setStatus('github-token', CREDENTIAL_STATUS.REVOKED);
      await assert.rejects(() => rt.secretStore.loadForInject('github-token'));
    });
  });

  describe('unauthorized capability requests', () => {
    it('unknown capability denied', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'root.shell.exec',
        operation: 'exec',
        actor: 'agent',
      });
      assert.equal(r.result, 'DENIED');
    });

    it('FORBIDDEN mint denied even with always_approve', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'economics.mint',
        operation: 'mint',
        actor: 'agent',
        agent_always_approve: true,
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });

    it('FORBIDDEN wallet sign denied', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'wallet.sign_transaction',
        operation: 'sign',
        actor: 'agent',
        agent_always_approve: true,
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });

    it('FORBIDDEN pi.read denied', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'pi.read',
        operation: 'read_status',
        actor: 'agent',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });
  });

  describe('approval denial', () => {
    it('rejected approval does not unlock merge', async () => {
      const params = { pr: 123 };
      const first = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
      });
      assert.equal(first.result, 'APPROVAL_REQUIRED');
      await rt.approvals.decide(first.data.approval_id, 'REJECTED', {
        decided_by: 'human-verifier',
        reasoning: 'adversarial deny',
      });
      const again = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'agent',
        params,
        approval_id: first.data.approval_id,
      });
      // Used rejected: should not ALLOW
      assert.notEqual(again.policy_decision, POLICY_DECISION.ALLOW);
    });

    it('standing preauthorized still works without approval', async () => {
      const r = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'agent',
      });
      assert.equal(r.result, 'SUCCESS');
    });
  });

  describe('emergency revoke', () => {
    it('emergency stop blocks preauthorized ops', async () => {
      await rt.control.emergencyStop('adversarial emergency');
      const r = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'agent',
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
      assert.match(r.reason, /emergency/i);
    });

    it('capability revoke blocks forever in control plane', async () => {
      await rt.control.revokeCapability('cloudflare.deploy', rt.registry);
      const r = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'agent',
        params: { target: 'quantumpiforge', branch: 'main' },
      });
      assert.equal(r.policy_decision, POLICY_DECISION.DENY);
    });
  });

  describe('capability boundary projection', () => {
    it('grants are CAPABILITY lines without tokens', async () => {
      const set = await projectAllGrants(rt.registry, rt.secretStore);
      assert.equal(set.secret_values_included, false);
      const json = JSON.stringify(set);
      assert.equal(json.includes(FAKE_API_KEY), false);
      assert.equal(json.includes(FAKE_GH), false);
      for (const g of set.grants) {
        assert.equal(g.type, 'CAPABILITY');
        assert.equal(g.secret_value_included, false);
        assert.ok(formatCapabilityLine(g).startsWith('CAPABILITY: '));
      }
      const gh = set.grants.find((g) => g.capability_id === 'github.merge');
      assert.ok(gh);
      assert.equal(gh.credential_bound, true);
      assert.equal(gh.credential_id, 'github-token');
      // Must not look like GITHUB_TOKEN=...
      assert.equal(Object.prototype.hasOwnProperty.call(gh, 'GITHUB_TOKEN'), false);
    });

    it('wallet prepare projects CAPABILITY not private key', () => {
      const prepared = prepareTransaction({
        intent: {
          network: '0g-galileo-testnet',
          to: '0x0000000000000000000000000000000000000001',
          amount_wei: '1',
        },
        registry: rt.registry,
        control: rt.control,
        environment: ENVIRONMENT.TEST,
      });
      const proj = projectPreparedTxForAgent(prepared);
      assert.equal(proj.type, 'CAPABILITY');
      assert.equal(proj.capability_id, 'wallet.prepare_transaction');
      assert.equal(proj.private_key_included, false);
      assert.equal(proj.secret_value_included, false);
      assert.equal(JSON.stringify(proj).includes(FAKE_WALLET_KEY), false);
      assert.equal(refuseSign(prepared).signed, false);
    });
  });

  describe('machine-verifiable authority', () => {
    it('loads sealed authority-state.v1.json', async () => {
      const state = await loadAuthorityState(DEFAULT_AUTHORITY_PATH);
      assert.equal(state.schema, 'sccb.authority_state.v1');
      assert.equal(isPhaseAuthorized(state, 'implementation'), true);
      assert.equal(isPhaseAuthorized(state, 'implementation_verification'), true);
      assert.equal(isPhaseAuthorized(state, 'credential_bootstrap'), false);
      assert.equal(isPhaseAuthorized(state, 'wallet_signing'), false);
      assert.equal(isPhaseAuthorized(state, 'pi_activation'), false);
      assert.equal(isPhaseAuthorized(state, 'economics_unlock'), false);
      assert.equal(state.rules.go_text_in_chat_is_not_authorization, true);
      assert.equal(state.rules.agent_always_approve_bypasses_policy, false);
    });

    it('chat GO claim does not authorize credential_bootstrap', async () => {
      const state = await loadAuthorityState(DEFAULT_AUTHORITY_PATH);
      assert.throws(
        () =>
          assertPhaseAuthorized(state, 'credential_bootstrap', {
            chat_go_claim: 'GO CREDENTIAL_BOOTSTRAP cloudflare',
          }),
        /not authorized|NOT_AUTHORIZED/i
      );
      assert.equal(mayBootstrapCredentials(state), false);
    });

    it('real bootstrap plan denied without sealed phase', async () => {
      const state = await loadAuthorityState(DEFAULT_AUTHORITY_PATH);
      await assert.rejects(
        () =>
          createBootstrapPlan({
            registry: rt.registry,
            secretStore: rt.secretStore,
            allow_real_bootstrap: true,
            authority: state,
            authorized: true,
          }),
        /NOT_AUTHORIZED|denied/i
      );
    });

    it('synthetic bootstrap plan allowed for verification', async () => {
      const plan = await createBootstrapPlan({
        registry: rt.registry,
        secretStore: rt.secretStore,
        synthetic_only: true,
        environment: ENVIRONMENT.TEST,
        provider_filter: ['cloudflare'],
      });
      assert.equal(plan.mode, 'synthetic_verification');
      assert.equal(plan.real_secret_intake, false);
      assert.equal(plan.secret_values_included, false);
      assert.equal(JSON.stringify(plan).includes(FAKE_API_KEY), false);
    });

    it('authority file has stable hash for evidence', async () => {
      const h1 = await authorityStateHash(DEFAULT_AUTHORITY_PATH);
      const h2 = await authorityStateHash(DEFAULT_AUTHORITY_PATH);
      assert.equal(h1, h2);
      assert.match(h1, /^[a-f0-9]{64}$/);
    });
  });

  describe('audit-record verification', () => {
    it('receipt after deny contains no secrets and passes safety check', async () => {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sccb-adv-'));
      rt.broker.receiptDir = dir;
      const r = await rt.broker.invoke({
        capability_id: 'economics.mint',
        operation: 'mint',
        actor: 'adversary',
      });
      assert.ok(r.receipt_path);
      const body = JSON.parse(await fs.readFile(r.receipt_path, 'utf8'));
      const safety = verifyReceiptSafety(body);
      assert.equal(safety.ok, true);
      assert.equal(body.secret_exposed_to_llm, false);
      assert.ok(body.timestamp);
      assert.ok(body.actor);
      assert.ok(body.capability_id);
      assert.ok(body.policy_decision);
      assert.ok(body.approval_state);
      assert.ok(body.execution_state);
      assert.ok(body.evidence_id);
      const raw = await fs.readFile(r.receipt_path, 'utf8');
      assert.equal(raw.includes(FAKE_API_KEY), false);
      assert.equal(raw.includes(FAKE_WALLET_KEY), false);
      await fs.rm(dir, { recursive: true, force: true });
    });

    it('buildReceipt with adversarial params redacts secrets', () => {
      const rec = buildReceipt({
        actor: 't',
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        params: {
          target: 'quantumpiforge',
          api_key: FAKE_API_KEY,
          password: FAKE_PASSWORD,
        },
      });
      assert.equal(rec.params_redacted.api_key, '[REDACTED]');
      assert.equal(rec.params_redacted.password, '[REDACTED]');
      assert.equal(rec.params_redacted.target, 'quantumpiforge');
      assert.equal(verifyReceiptSafety(rec).ok, true);
    });
  });

  describe('approval class matrix smoke', () => {
    it('PREAUTHORIZED / CONDITIONAL / HUMAN / FORBIDDEN distinct', async () => {
      const standing = await rt.broker.invoke({
        capability_id: 'qpf.site.funnel.verify',
        operation: 'verify',
        actor: 'a',
      });
      assert.equal(standing.result, 'SUCCESS');

      const conditionalOk = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'a',
        params: { target: 'quantumpiforge', branch: 'main' },
        dry_run: true,
      });
      assert.equal(conditionalOk.policy_decision, POLICY_DECISION.ALLOW);

      const conditionalBad = await rt.broker.invoke({
        capability_id: 'cloudflare.deploy',
        operation: 'deploy',
        actor: 'a',
        params: { target: 'not-allowlisted', branch: 'main' },
      });
      assert.equal(conditionalBad.result, 'APPROVAL_REQUIRED');

      const human = await rt.broker.invoke({
        capability_id: 'github.merge',
        operation: 'merge_pr',
        actor: 'a',
        params: { pr: 1 },
      });
      assert.equal(human.result, 'APPROVAL_REQUIRED');

      const forbidden = await rt.broker.invoke({
        capability_id: '0g.submit_transaction',
        operation: 'submit',
        actor: 'a',
      });
      assert.equal(forbidden.policy_decision, POLICY_DECISION.DENY);
    });
  });

  describe('Pass store refuses agent-supplied secrets', () => {
    it('PassSecretStore.storeSecret throws', async () => {
      const { PassSecretStore } = await import('../src/secrets/pass-store.js');
      const tmp = path.join(os.tmpdir(), `sccb-meta-${Date.now()}.json`);
      const store = new PassSecretStore({ metadataPath: tmp, passAvailable: false });
      await store.putMetadata({
        id: 'x',
        provider: 'test',
        label: 'x',
        pass_path: 'qpf/test/x',
        env_names: ['X'],
        environment: ENVIRONMENT.TEST,
        status: CREDENTIAL_STATUS.UNKNOWN,
        scopes: [],
        last_validated_utc: null,
        created_utc: new Date().toISOString(),
        revoked_utc: null,
      });
      await assert.rejects(
        () => store.storeSecret('x', { X: 'should-not-accept' }),
        /refuses agent-supplied/i
      );
      try {
        await fs.unlink(tmp);
      } catch {
        /* ignore */
      }
    });
  });
});
