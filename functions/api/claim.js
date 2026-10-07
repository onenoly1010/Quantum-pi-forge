// /api/claim — customer intake + private status lookup for verification
// review requests. Replaces the mailto flow: no email, no account, no wallet.
//
// POST   /api/claim            create a claim -> { ref, statusUrl } (token in URL)
// GET    /api/claim?t=TOKEN    read own claim status (capability link = auth)
// PUT    /api/claim            operator update, requires X-QPF-Admin header
//                                matching env.QPF_ADMIN_TOKEN (503 if unset).
//
// Storage: env.QPF_CLAIMS (KV namespace QPF_CLAIMS).
//   claim:<token>  full record (token is 128-bit random; unguessable)
//   ref:<ref>      -> token (operator lookup by human-readable reference)
//   rl:<ip>        sliding-window rate limit for POST
//
// Privacy: the customer's token never leaves the URL fragment (#t=...) and
// is never sent to the server as part of page navigation. Claim content is
// returned only to the holder of the token.

// Intake gate. Submissions are CLOSED: every write path (POST, PUT) returns
// 503 submissions_not_open before reading the body, touching KV, or doing any
// other work. This is a code constant on purpose (not an env var) so it cannot
// silently default open. Flip only with an explicit, reviewed code change.
export const SUBMISSIONS_OPEN = false;

function submissionsClosed() {
  return json(
    {
      ok: false,
      error: "submissions_not_open",
      message: "Submissions are not open.",
    },
    503,
  );
}

const MAX_BODY_BYTES = 16384;
const CLAIM_MIN = 80;
const CLAIM_MAX = 4000;
const PROJECT_MAX = 160;
const DECISION_MAX = 600;
const LINKS_MAX = 5;
const LINK_MAX = 400;
const RATE_LIMIT_MAX = 5;
const RATE_WINDOW_S = 3600;
const STATUS_VALUES = ["received", "checking", "declined", "complete"];
const TOKEN_RE = /^[0-9a-f]{32}$/;
const REF_RE = /^QPF-[0-9]{4}-[A-Z2-9]{6}$/;
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomRef() {
  let out = "";
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  for (const b of buf) out += REF_ALPHABET[b % REF_ALPHABET.length];
  const year = new Date().getUTCFullYear();
  return `QPF-${year}-${out}`;
}

function str(value, max, { min = 0, trim = true } = {}) {
  if (typeof value !== "string") return null;
  const v = trim ? value.trim() : value;
  if (v.length < min || v.length > max) return null;
  return v;
}

async function rateLimited(env, ip) {
  if (!ip) return false; // no IP header -> do not block; size caps still apply
  const key = `rl:${ip}`;
  const now = Date.now();
  let rec = { c: 0, t: now };
  try {
    rec = JSON.parse((await env.QPF_CLAIMS.get(key)) || '{"c":0,"t":0}');
  } catch {
    /* corrupt counter -> start fresh */
  }
  if (now - rec.t > RATE_WINDOW_S * 1000) rec = { c: 0, t: now };
  if (rec.c >= RATE_LIMIT_MAX) return true;
  rec.c += 1;
  await env.QPF_CLAIMS.put(key, JSON.stringify(rec), {
    expirationTtl: RATE_WINDOW_S,
  });
  return false;
}

function validate(body) {
  const project = str(body.project, PROJECT_MAX, { min: 1 });
  const claim = str(body.claim, CLAIM_MAX, { min: CLAIM_MIN });
  const decision = str(body.decision, DECISION_MAX, { min: 1 });
  if (!project) return { error: "project: required, up to 160 characters" };
  if (!claim) return { error: `claim: ${CLAIM_MIN}–${CLAIM_MAX} characters` };
  if (!decision) return { error: "decision: required, up to 600 characters" };

  const rawLinks = Array.isArray(body.links) ? body.links : [];
  const links = [];
  for (const item of rawLinks) {
    const link = str(item, LINK_MAX, { min: 1 });
    if (!link) return { error: `link: each link must be 1–${LINK_MAX} characters` };
    if (!/^(https?:\/\/|git@)/i.test(link)) {
      return { error: "links must start with http(s):// — public references only" };
    }
    links.push(link);
  }
  if (links.length < 1) return { error: "at least one public reference link is required" };
  if (links.length > LINKS_MAX) return { error: `at most ${LINKS_MAX} reference links` };

  return { project, claim, decision, links };
}

async function handlePost(request, env) {
  if (!env.QPF_CLAIMS) {
    return json(
      { ok: false, error: "intake storage is not configured — nothing was submitted" },
      503,
    );
  }

  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_BODY_BYTES) {
    return json({ ok: false, error: "request too large" }, 413);
  }

  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "request too large" }, 413);
    }
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "invalid JSON body" }, 400);
  }

  // Honeypot: real users never fill the hidden field. Pretend success so the
  // bot learns nothing and no storage is written.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return json({
      ok: true,
      ref: randomRef(),
      statusUrl: `/claim-status.html#t=${randomHex(16)}`,
    });
  }

  if (await rateLimited(env, request.headers.get("cf-connecting-ip"))) {
    return json(
      { ok: false, error: "too many submissions from this network — try later" },
      429,
    );
  }

  const fields = validate(body);
  if (fields.error) return json({ ok: false, error: fields.error }, 400);

  let ref = null;
  for (let i = 0; i < 3; i++) {
    const candidate = randomRef();
    if (!(await env.QPF_CLAIMS.get(`ref:${candidate}`))) {
      ref = candidate;
      break;
    }
  }
  if (!ref) return json({ ok: false, error: "reference generation failed — retry" }, 503);

  const token = randomHex(16);
  const now = new Date().toISOString();
  const record = {
    ref,
    project: fields.project,
    claim: fields.claim,
    links: fields.links,
    decision: fields.decision,
    status: "received",
    createdAt: now,
    updatedAt: now,
    result: null,
  };

  await env.QPF_CLAIMS.put(`claim:${token}`, JSON.stringify(record));
  await env.QPF_CLAIMS.put(`ref:${ref}`, token);

  return json({
    ok: true,
    ref,
    statusUrl: `/claim-status.html#t=${token}`,
  });
}

async function handleGet(request, env) {
  if (!env.QPF_CLAIMS) {
    return json({ ok: false, error: "intake storage is not configured" }, 503);
  }
  const url = new URL(request.url);
  const token = url.searchParams.get("t") || "";
  if (!TOKEN_RE.test(token)) {
    return json({ ok: false, error: "invalid or missing status token" }, 400);
  }
  const raw = await env.QPF_CLAIMS.get(`claim:${token}`);
  if (!raw) return json({ ok: false, error: "not found — check your status link" }, 404);
  const record = JSON.parse(raw);
  return json({
    ok: true,
    claim: {
      ref: record.ref,
      project: record.project,
      claim: record.claim,
      links: record.links,
      decision: record.decision,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      result: record.result || null,
    },
  });
}

async function handlePut(request, env) {
  if (!env.QPF_CLAIMS) {
    return json({ ok: false, error: "intake storage is not configured" }, 503);
  }
  const adminToken = env.QPF_ADMIN_TOKEN;
  if (!adminToken) {
    return json(
      { ok: false, error: "admin updates disabled — QPF_ADMIN_TOKEN not set" },
      503,
    );
  }
  if (request.headers.get("x-qpf-admin") !== adminToken) {
    return json({ ok: false, error: "forbidden" }, 403);
  }

  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return json({ ok: false, error: "invalid JSON body" }, 400);
  }

  const ref = str(body.ref, 32, { min: 8 });
  if (!ref || !REF_RE.test(ref)) {
    return json({ ok: false, error: "ref: expected reference like QPF-2026-ABC234" }, 400);
  }
  const status = str(body.status, 16, { min: 1 });
  if (!status || !STATUS_VALUES.includes(status)) {
    return json({ ok: false, error: `status: one of ${STATUS_VALUES.join(", ")}` }, 400);
  }

  const token = await env.QPF_CLAIMS.get(`ref:${ref}`);
  if (!token) return json({ ok: false, error: "unknown ref" }, 404);
  const raw = await env.QPF_CLAIMS.get(`claim:${token}`);
  if (!raw) return json({ ok: false, error: "unknown ref" }, 404);
  const record = JSON.parse(raw);

  record.status = status;
  record.updatedAt = new Date().toISOString();
  if (body.result !== undefined) {
    if (body.result === null) {
      record.result = null;
    } else if (typeof body.result === "object" && !Array.isArray(body.result)) {
      const keep = {};
      for (const key of ["verified", "unverified", "unknown"]) {
        const arr = body.result[key];
        if (Array.isArray(arr)) {
          keep[key] = arr
            .filter((x) => typeof x === "string")
            .map((x) => x.slice(0, 1200))
            .slice(0, 40);
        }
      }
      for (const key of ["method", "limits", "receiptUrl"]) {
        if (typeof body.result[key] === "string") {
          keep[key] = body.result[key].slice(0, 4000);
        }
      }
      record.result = keep;
    } else {
      return json({ ok: false, error: "result: object or null" }, 400);
    }
  }

  await env.QPF_CLAIMS.put(`claim:${token}`, JSON.stringify(record));
  return json({ ok: true, ref: record.ref, status: record.status });
}

// Ungated handlers, exported only so tests can exercise the intake logic.
// Pages routes only onRequest* exports; these are not reachable over HTTP.
export const _internal = { handlePost, handleGet, handlePut };

export async function onRequestPost(context) {
  if (!SUBMISSIONS_OPEN) return submissionsClosed();
  return handlePost(context.request, context.env);
}

export async function onRequestGet(context) {
  return handleGet(context.request, context.env);
}

export async function onRequestPut(context) {
  if (!SUBMISSIONS_OPEN) return submissionsClosed();
  return handlePut(context.request, context.env);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
      "access-control-allow-headers": "content-type, x-qpf-admin",
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
    },
  });
}


