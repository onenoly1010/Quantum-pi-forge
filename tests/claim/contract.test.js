/**
 * v2 contract (qpfo0:99d797bd) on the operator PUT path:
 * public registration before work, public receipt before complete,
 * registered claims cannot be canceled. Network is stubbed; no real fetch.
 */
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { _internal } from '../../functions/api/claim.js';

const ORIGIN = 'https://quantumpiforge.com/api/claim';
const SHA = 'b'.repeat(40);
const PIN = (path) => `https://github.com/onenoly1010/qpf-verification-registry/blob/${SHA}/${path}`;
const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

function mockKV() {
  const s = new Map();
  return { async get(k) { return s.has(k) ? s.get(k) : null; }, async put(k, v) { s.set(k, v); } };
}
// registry stub: files map path -> text; compare returns cmpStatus
function stubRegistry(files, cmpStatus = 'behind') {
  const calls = [];
  globalThis.fetch = async (url) => {
    url = String(url); calls.push(url);
    if (url.startsWith('https://api.github.com/')) return new Response(JSON.stringify({ status: cmpStatus }), { status: 200 });
    const path = url.split(`/${SHA}/`)[1];
    return path in files ? new Response(files[path], { status: 200 }) : new Response('404', { status: 404 });
  };
  return calls;
}
async function setup() {
  const env = { QPF_CLAIMS: mockKV(), QPF_ADMIN_TOKEN: 'sekrit' };
  const res = await _internal.handlePost(new Request(ORIGIN, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ project: 'P', claim: 'x'.repeat(100), links: ['https://example.com/a'], decision: 'd' }),
  }), env);
  const d = await res.json();
  return { env, ref: d.ref, token: /#t=([0-9a-f]{32})$/.exec(d.statusUrl)[1] };
}
const put = (env, body) => _internal.handlePut(new Request(ORIGIN, {
  method: 'PUT', headers: { 'content-type': 'application/json', 'x-qpf-admin': 'sekrit' }, body: JSON.stringify(body),
}), env);
const RESULT = { verified: ['a'], unverified: [], unknown: [], method: 'm', limits: 'l' };

describe('v2 contract gates on PUT /api/claim', () => {
  it('refuses work (checking) before public registration', async () => {
    const { env, ref } = await setup();
    assert.equal((await put(env, { ref, status: 'checking' })).status, 409);
  });
  it('refuses a registryUrl that is not a pinned registry file', async () => {
    const { env, ref } = await setup();
    stubRegistry({});
    for (const u of ['/x', 'https://github.com/onenoly1010/qpf-verification-registry/blob/main/receipts/INDEX.md',
      'https://github.com/someone/fork/blob/' + SHA + '/receipts/INDEX.md', PIN('../x')]) {
      assert.equal((await put(env, { ref, status: 'checking', registryUrl: u })).status, 409, u);
    }
  });
  it('refuses a pinned file that does not name the ref, or a fork-only commit', async () => {
    const { env, ref } = await setup();
    stubRegistry({ 'receipts/INDEX.md': 'some other claim' });
    assert.equal((await put(env, { ref, status: 'checking', registryUrl: PIN('receipts/INDEX.md') })).status, 409);
    stubRegistry({ 'receipts/INDEX.md': `| ${ref} |` }, 'diverged');
    assert.equal((await put(env, { ref, status: 'checking', registryUrl: PIN('receipts/INDEX.md') })).status, 409);
  });
  it('fails closed when the registry cannot be reached', async () => {
    const { env, ref } = await setup();
    globalThis.fetch = async () => { throw new Error('offline'); };
    assert.equal((await put(env, { ref, status: 'checking', registryUrl: PIN('receipts/INDEX.md') })).status, 409);
  });
  it('registered -> checking -> complete requires a public receipt naming the ref', async () => {
    const { env, ref, token } = await setup();
    stubRegistry({ 'receipts/INDEX.md': `| ${ref} | REGISTERED |`, [`receipts/${ref}.md`]: `${ref} FAILED` });
    assert.equal((await put(env, { ref, status: 'checking', registryUrl: PIN('receipts/INDEX.md') })).status, 200);
    assert.equal((await put(env, { ref, status: 'complete', result: RESULT })).status, 409, 'no receiptUrl');
    assert.equal((await put(env, { ref, status: 'complete', result: { ...RESULT, receiptUrl: '/verification-artifact.html' } })).status, 409, 'not in registry');
    assert.equal((await put(env, { ref, status: 'complete', result: { ...RESULT, receiptUrl: PIN('receipts/missing.md') } })).status, 409, 'missing file');
    const ok = await put(env, { ref, status: 'complete', result: { ...RESULT, receiptUrl: PIN(`receipts/${ref}.md`) } });
    assert.equal(ok.status, 200);
    const g = await (await _internal.handleGet(new Request(`${ORIGIN}?t=${token}`), env)).json();
    assert.equal(g.claim.registryUrl, PIN('receipts/INDEX.md'));
    assert.equal(g.claim.result.receiptUrl, PIN(`receipts/${ref}.md`));
  });
  it('a registered claim cannot be canceled or re-pointed; an unregistered one can be declined', async () => {
    const a = await setup();
    assert.equal((await put(a.env, { ref: a.ref, status: 'declined' })).status, 200);
    const b = await setup();
    stubRegistry({ 'receipts/INDEX.md': `| ${b.ref} |`, 'receipts/other.md': `| ${b.ref} |` });
    assert.equal((await put(b.env, { ref: b.ref, status: 'received', registryUrl: PIN('receipts/INDEX.md') })).status, 200);
    assert.equal((await put(b.env, { ref: b.ref, status: 'declined' })).status, 409);
    assert.equal((await put(b.env, { ref: b.ref, status: 'checking', registryUrl: PIN('receipts/other.md') })).status, 409);
  });
});
