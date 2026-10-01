/**
 * Claim intake endpoint (/api/claim) — the email-free customer loop.
 * Exercises POST create, GET status (capability link), PUT operator update,
 * validation, honeypot, rate limit, and missing-config behavior against an
 * in-memory KV mock. No network, no real storage.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  onRequestPost,
  onRequestGet,
  onRequestPut,
} from '../../functions/api/claim.js';

const ORIGIN = 'https://quantumpiforge.com/api/claim';

function mockKV() {
  const store = new Map();
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    _store: store,
  };
}

function post(body, { env = {}, ip = '203.0.113.10' } = {}) {
  const request = new Request(ORIGIN, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': ip,
    },
    body: JSON.stringify(body),
  });
  return onRequestPost({ request, env });
}

function get(token, env) {
  const request = new Request(`${ORIGIN}?t=${token}`, { method: 'GET' });
  return onRequestGet({ request, env });
}

function put(body, { env = {}, adminHeader } = {}) {
  const header =
    adminHeader !== undefined ? adminHeader : env.QPF_ADMIN_TOKEN || '';
  const request = new Request(ORIGIN, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'x-qpf-admin': header,
    },
    body: JSON.stringify(body),
  });
  return onRequestPut({ request, env });
}

const VALID = {
  project: 'Test Project',
  claim:
    'On chain 16661, the published W0G/USDC.e pair reports zero reserves at the time of review.',
  links: [
    'https://example.com/deployment',
    'https://github.com/onenoly1010/Quantum-pi-forge',
  ],
  decision: 'Whether to provide liquidity to this pair.',
};

function validBody(overrides = {}) {
  return {
    ...VALID,
    links: [...VALID.links],
    ...overrides,
  };
}

describe('POST /api/claim', () => {
  it('accepts a valid claim and returns ref + private status link', async () => {
    const kv = mockKV();
    const res = await post(validBody(), { env: { QPF_CLAIMS: kv } });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.match(data.ref, /^QPF-\d{4}-[A-Z2-9]{6}$/);
    const token = /#t=([0-9a-f]{32})$/.exec(data.statusUrl)?.[1];
    assert.ok(token, 'statusUrl carries a 32-hex token in the fragment');

    const record = JSON.parse(kv._store.get(`claim:${token}`));
    assert.equal(record.ref, data.ref);
    assert.equal(record.status, 'received');
    assert.equal(record.project, VALID.project);
    assert.equal(record.claim, VALID.claim);
    assert.deepEqual(record.links, VALID.links);
    assert.equal(kv._store.get(`ref:${data.ref}`), token);
  });

  it('rejects a claim that is too short', async () => {
    const res = await post(validBody({ claim: 'too short' }), {
      env: { QPF_CLAIMS: mockKV() },
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.ok, false);
    assert.match(data.error, /claim:/);
  });

  it('requires at least one public reference link', async () => {
    const res = await post(validBody({ links: [] }), {
      env: { QPF_CLAIMS: mockKV() },
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /reference link/);
  });

  it('rejects non-http(s) links', async () => {
    const res = await post(validBody({ links: ['ftp://example.com/x'] }), {
      env: { QPF_CLAIMS: mockKV() },
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /http/);
  });

  it('rejects an invalid JSON body', async () => {
    const request = new Request(ORIGIN, { method: 'POST', body: 'not json' });
    const res = await onRequestPost({
      request,
      env: { QPF_CLAIMS: mockKV() },
    });
    assert.equal(res.status, 400);
  });

  it('honeypot submissions pretend success but store nothing', async () => {
    const kv = mockKV();
    const res = await post(validBody({ company: 'Totally Real Ltd' }), {
      env: { QPF_CLAIMS: kv },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    const claimKeys = [...kv._store.keys()].filter((k) => k.startsWith('claim:'));
    assert.equal(claimKeys.length, 0);
  });

  it('rate-limits a single IP after 5 submissions', async () => {
    const env = { QPF_CLAIMS: mockKV() };
    for (let i = 0; i < 5; i++) {
      const res = await post(validBody(), { env, ip: '198.51.100.7' });
      assert.equal(res.status, 200, `submission ${i + 1} should pass`);
    }
    const res = await post(validBody(), { env, ip: '198.51.100.7' });
    assert.equal(res.status, 429);
    const other = await post(validBody(), { env, ip: '198.51.100.8' });
    assert.equal(other.status, 200);
  });

  it('fails honestly when storage is not configured', async () => {
    const res = await post(validBody(), { env: {} });
    assert.equal(res.status, 503);
    const data = await res.json();
    assert.match(data.error, /not configured/);
  });
});

describe('GET /api/claim', () => {
  it('returns the claim to the holder of the token', async () => {
    const env = { QPF_CLAIMS: mockKV() };
    const created = await (await post(validBody(), { env })).json();
    const token = /#t=([0-9a-f]{32})$/.exec(created.statusUrl)[1];

    const res = await get(token, env);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.claim.ref, created.ref);
    assert.equal(data.claim.status, 'received');
    assert.equal(data.claim.claim, VALID.claim);
    assert.deepEqual(data.claim.links, VALID.links);
    assert.equal(data.claim.result, null);
  });

  it('rejects malformed tokens', async () => {
    const res = await get('nope', { QPF_CLAIMS: mockKV() });
    assert.equal(res.status, 400);
  });

  it('404s for an unknown but well-formed token', async () => {
    const res = await get('a'.repeat(32), { QPF_CLAIMS: mockKV() });
    assert.equal(res.status, 404);
  });
});

describe('PUT /api/claim (operator)', () => {
  async function createdRef(env) {
    const data = await (await post(validBody(), { env })).json();
    return data.ref;
  }

  it('is disabled (503) when QPF_ADMIN_TOKEN is not set', async () => {
    const env = { QPF_CLAIMS: mockKV() };
    const ref = await createdRef(env);
    const res = await put({ ref, status: 'checking' }, { env });
    assert.equal(res.status, 503);
  });

  it('rejects a wrong admin token (403)', async () => {
    const env = { QPF_CLAIMS: mockKV(), QPF_ADMIN_TOKEN: 'right' };
    const ref = await createdRef(env);
    const res = await put(
      { ref, status: 'checking' },
      { env, adminHeader: 'wrong' },
    );
    assert.equal(res.status, 403);
  });

  it('advances status and stores a result visible via GET', async () => {
    const env = { QPF_CLAIMS: mockKV(), QPF_ADMIN_TOKEN: 'sekrit' };
    const created = await (await post(validBody(), { env })).json();
    const token = /#t=([0-9a-f]{32})$/.exec(created.statusUrl)[1];

    const check = await put({ ref: created.ref, status: 'checking' }, { env });
    assert.equal(check.status, 200);

    const done = await put(
      {
        ref: created.ref,
        status: 'complete',
        result: {
          verified: ['Code is present at the published address.'],
          unverified: ['That the code behaves as documented.'],
          unknown: ['Who deployed it.'],
          method: 'Three eth_* reads against a public RPC.',
          limits: 'Single RPC channel; point-in-time observation.',
          receiptUrl: '/verification-artifact.html',
        },
      },
      { env },
    );
    assert.equal(done.status, 200);

    const data = await (await get(token, env)).json();
    assert.equal(data.claim.status, 'complete');
    assert.equal(data.claim.result.verified.length, 1);
    assert.equal(data.claim.result.receiptUrl, '/verification-artifact.html');
  });

  it('rejects unknown statuses and malformed refs', async () => {
    const env = { QPF_CLAIMS: mockKV(), QPF_ADMIN_TOKEN: 'sekrit' };
    const ref = await createdRef(env);
    const badStatus = await put({ ref, status: 'paid' }, { env });
    assert.equal(badStatus.status, 400);
    const badRef = await put({ ref: 'not-a-ref', status: 'checking' }, { env });
    assert.equal(badRef.status, 400);
    const unknownRef = await put(
      { ref: 'QPF-2026-ZZZZZZ', status: 'checking' },
      { env },
    );
    assert.equal(unknownRef.status, 404);
  });
});

