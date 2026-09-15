/* Bounded front-door participant. Constitution in the browser.
   No wallet. No token mint. No visitor-data store. No GitHub write. */
(function (global) {
  const DENIED = [
    { re: /\b(mint|token|lp|liquidity|yield|stake|wallet|private key|seed phrase|pay me|wire)\b/i, kind: "mint" },
    { re: /\b(github\.write|push to main|deploy contract)\b/i, kind: "github.write" },
  ];

  function deniedMatch(kind, pattern) {
    if (pattern.endsWith(".*")) return kind.startsWith(pattern.slice(0, -1));
    return kind === pattern;
  }

  function decide(constitution, proposal) {
    const kind = proposal.kind || "";
    for (const p of constitution.denied_by_default) {
      if (deniedMatch(kind, p)) return { decision: "STOP", breaker: "deny:" + p };
    }
    if (!constitution.authorized_kinds.includes(kind)) {
      return { decision: "STOP", breaker: "deny-unlisted-act" };
    }
    return { decision: "EXECUTE", breaker: null };
  }

  function propose(constitution, text) {
    const t = (text || "").trim();
    for (const d of DENIED) {
      if (d.re.test(t)) {
        return {
          understanding: "You asked for something that would require mint, wallet, payment, or write access.",
          can_do: "I can inspect public evidence.",
          cannot_do: "I cannot mint, touch a wallet, take payment, or store your words on a server.",
          proposal: { kind: d.kind, note: "mapped from visitor text" },
          force_stop: true,
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
      can_do: constitution.authorized_acts[kind],
      cannot_do: "Mint tokens, use a wallet, take payment, write to GitHub, or keep your message.",
      proposal: { kind, visitor_len: t.length },
      force_stop: false,
    };
  }

  async function sha256Hex(s) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function execute(constitution, proposal) {
    const refs = constitution.public_refs;
    const kind = proposal.kind;
    if (kind === "inspect_self") {
      return { ok: true, evidence: { name: constitution.name, role: constitution.role, statement: constitution.statement } };
    }
    if (kind === "inspect_chain") {
      const r = await fetch(refs.rpc, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
      });
      const j = await r.json();
      return { ok: j.result === refs.chain_id_hex, evidence: { eth_chainId: j.result, expect: refs.chain_id_hex } };
    }
    if (kind === "inspect_open") {
      const r = await fetch(refs.open, { headers: { "cache-control": "no-cache" } });
      const t = await r.text();
      const title = (t.match(/<title>([^<]+)/) || [, ""])[1];
      return { ok: /open gates/i.test(title), evidence: { http: r.status, title } };
    }
    if (kind === "inspect_try") {
      const r = await fetch(refs.try, { headers: { "cache-control": "no-cache" } });
      const t = await r.text();
      return { ok: r.ok && /Run check now/i.test(t), evidence: { http: r.status } };
    }
    if (kind === "inspect_gist") {
      const r = await fetch(refs.gist_object_json, { headers: { "cache-control": "no-cache" } });
      const j = await r.json();
      return { ok: typeof j.object_id === "string" && j.object_id.startsWith("qpfo0:"), evidence: { object_id: j.object_id } };
    }
    return { ok: false, evidence: { error: "unknown kind" } };
  }

  async function runAuthorized(constitution, visitorText, proposal) {
    const gate = decide(constitution, proposal);
    const interestHash = await sha256Hex(visitorText || "");
    if (gate.decision !== "EXECUTE") {
      return {
        decision: "STOP",
        breaker: gate.breaker,
        executed: false,
        evidence: { visitor_interest_sha256: interestHash },
        verdict: "ESTABLISHED",
      };
    }
    const out = await execute(constitution, proposal);
    return {
      decision: "EXECUTE",
      breaker: null,
      executed: true,
      evidence: { ...out.evidence, visitor_interest_sha256: interestHash },
      verdict: out.ok ? "ESTABLISHED" : "FAILED",
    };
  }

  global.QpfFrontDoor = { decide, propose, execute, runAuthorized };
})(window);
