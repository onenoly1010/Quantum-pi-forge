/**
 * Front-door co-creator: model may propose, constitution decides.
 * Never mints, never touches a wallet, never stores visitor text.
 *
 * POST /api/meet  { text }
 * Optional env: XAI_API_KEY — without it, constitution mapper only.
 */
const ALLOWED = [
  "inspect_self",
  "inspect_chain",
  "inspect_open",
  "inspect_gist",
  "inspect_try",
];
const DENIED_KIND = ["mint", "wallet", "payment", "github.write", "email.send", "store_visitor", "key.export", "liquidity", "yield", "peer_command"];

const HARD_STOP = [
  /\b(mint|token|lp\b|liquidity|yield|stake|wallet|private key|seed phrase)\b/i,
  /\b(github\.write|push to main|deploy contract)\b/i,
];

const ACTS = {
  inspect_self: "Show this constitution.",
  inspect_chain: "Read 0G Aristotle chain id from the public RPC.",
  inspect_open: "Fetch /open and confirm the public door.",
  inspect_gist: "Fetch the public economic object id from the gist raw JSON.",
  inspect_try: "Fetch /try and confirm the self-serve check exists.",
};

function decide(kind) {
  if (DENIED_KIND.includes(kind) || String(kind).startsWith("wallet") || String(kind).startsWith("payment")) {
    return { decision: "STOP", breaker: "deny:" + kind };
  }
  if (!ALLOWED.includes(kind)) return { decision: "STOP", breaker: "deny-unlisted-act" };
  return { decision: "EXECUTE", breaker: null };
}

function proposeDeterministic(text) {
  const t = (text || "").trim();
  for (const re of HARD_STOP) {
    if (re.test(t)) {
      return {
        understanding: "You asked for mint, wallet, payment, or write access.",
        can_do: "I can inspect public evidence.",
        cannot_do: "I cannot mint, touch a wallet, take payment, or store your words.",
        proposal: { kind: "mint" },
        force_stop: true,
        source: "constitution",
      };
    }
  }
  let kind = "inspect_self";
  if (/\b(chain|rpc|16661|0g|aristotle|verify deploy)\b/i.test(t)) kind = "inspect_chain";
  else if (/\b(open gates|\/open|baseline)\b/i.test(t)) kind = "inspect_open";
  else if (/\b(gist|economic object|qpfo0|object_id)\b/i.test(t)) kind = "inspect_gist";
  else if (/\b(try|self-serve|check a deploy)\b/i.test(t)) kind = "inspect_try";
  else if (t.length > 0 && !/^(hi|hello|hey)\b/i.test(t)) kind = "inspect_open";
  return {
    understanding: t
      ? "I mapped what you said onto one public inspect I am allowed to run."
      : "You have not named an idea yet. I can introduce myself from my constitution.",
    can_do: ACTS[kind],
    cannot_do: "Mint tokens, use a wallet, take payment, write to GitHub, or keep your message.",
    proposal: { kind },
    force_stop: false,
    source: "constitution",
  };
}

async function proposeWithModel(text, key) {
  const sys = `You are a bounded QPF co-creator at the public door.
You are not the visitor. You are not a company. You do not mint tokens.
You may ONLY choose proposal.kind from: ${ALLOWED.join(", ")}.
If they ask to mint, use a wallet, pay, or write to GitHub, set kind to "mint" (the constitution will STOP).
Do not claim an arena, customers, revenue, or a live economy.
Reply JSON only:
{"understanding":"...","can_do":"...","cannot_do":"...","proposal":{"kind":"inspect_open"}}`;
  const r = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: "Bearer " + key,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.3,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: String(text).slice(0, 500) },
      ],
    }),
  });
  if (!r.ok) throw new Error("model_http_" + r.status);
  const j = await r.json();
  const raw = j.choices?.[0]?.message?.content || "";
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const parsed = JSON.parse(raw.slice(start, end + 1));
  let kind = String(parsed?.proposal?.kind || "inspect_self");
  if (!ALLOWED.includes(kind) && kind !== "mint") kind = "inspect_self";
  return {
    understanding: String(parsed.understanding || "").slice(0, 800),
    can_do: String(parsed.can_do || ACTS[kind] || ACTS.inspect_self).slice(0, 400),
    cannot_do: String(parsed.cannot_do || "Mint, wallet, payment, GitHub write, storing your words.").slice(0, 400),
    proposal: { kind },
    force_stop: kind === "mint" || !ALLOWED.includes(kind),
    source: "model",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "https://quantumpiforge.com",
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "https://quantumpiforge.com",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      },
    });
  }
  if (request.method !== "POST") return json({ error: "POST only" }, 405);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const text = String(body?.text || "").slice(0, 500);
  let proposed = proposeDeterministic(text);
  const key = env && env.XAI_API_KEY;
  if (key && text && !proposed.force_stop) {
    try {
      proposed = await proposeWithModel(text, key);
    } catch {
      proposed.source = "constitution_fallback";
    }
  }
  const gate = proposed.force_stop
    ? { decision: "STOP", breaker: "deny:" + proposed.proposal.kind }
    : decide(proposed.proposal.kind);
  return json({
    ...proposed,
    constitution: gate,
    stored: false,
    note: "Model may propose. Constitution decides. No visitor text stored.",
  });
}
