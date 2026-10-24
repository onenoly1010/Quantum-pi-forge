/**
 * Negative property: while SUBMISSIONS_OPEN is false, the public /api/claim
 * write routes reject before any body read, KV write, or downstream call.
 */
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  SUBMISSIONS_OPEN,
  onRequestPost,
  onRequestPut,
} from '../../functions/api/claim.js';

const ORIGIN = 'https://quantumpiforge.com/api/claim';
const BODY = JSON.stringify({
  project: 'Stranger',
  claim: 'x'.repeat(120),
  links: ['https://example.com/a'],
  decision: 'Whether to rely on it.',
});

function spyKV() {
  const calls = { get: 0, put: 0, delete: 0, list: 0 };
  return {
    calls,
    async get() { calls.get++; return null; },
    async put() { calls.put++; },
    async delete() { calls.delete++; },
    async list() { calls.list++; return { keys: [] }; },
  };
}

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

async function assertClosed(method, handler, extraHeaders = {}) {
  const kv = spyKV();
  let fetchCalls = 0;
  globalThis.fetch = async () => { fetchCalls++; throw new Error('no network'); };
  const request = new Request(ORIGIN, {
    method,
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.9', ...extraHeaders },
    body: BODY,
  });
  const res = await handler({ request, env: { QPF_CLAIMS: kv, QPF_ADMIN_TOKEN: 'sekrit' } });

  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), {
    ok: false,
    error: 'submissions_not_open',
    message: 'Submissions are not open.',
  });
  assert.equal(request.bodyUsed, false, 'body must not be read');
  assert.deepEqual(kv.calls, { get: 0, put: 0, delete: 0, list: 0 }, 'no KV access');
  assert.equal(fetchCalls, 0, 'no downstream fetch');
}

describe('/api/claim while submissions are closed', () => {
  it('gate constant is false', () => {
    assert.equal(SUBMISSIONS_OPEN, false);
  });
  it('POST rejects with no KV write and no downstream call', async () => {
    await assertClosed('POST', onRequestPost);
  });
  it('PUT (even with valid admin token) rejects with no KV write', async () => {
    await assertClosed('PUT', onRequestPut, { 'x-qpf-admin': 'sekrit' });
  });
});
