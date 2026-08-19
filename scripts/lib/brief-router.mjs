/**
 * Local model router. Detects Ollama tags. Never silently routes remote.
 */
const PREFERRED = {
  classify: ["qwen2.5:0.5b", "llama3.2:1b"],
  navigate: ["oinio-soul-forge:latest", "oinio-soul-forge", "llama3.2:3b", "llama3.2:1b"],
  analyze: ["qwen2.5-coder:7b", "llama3.1:8b", "qwen2.5-coder:3b"],
  embed: ["nomic-embed-text", "nomic-embed-text:latest"],
};
const LIMITS = {
  classify: { num_predict: 128, timeout_s: 45 },
  navigate: { num_predict: 640, timeout_s: 90 },
  analyze: { num_predict: 896, timeout_s: 150 },
  embed: { num_predict: 0, timeout_s: 30 },
};
const REMOTE = ["openai", "anthropic", "gemini", "grok-remote", "router-api.0g.ai"];

export async function detectModels({ fetchImpl = fetch, host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434" } = {}) {
  try {
    const res = await fetchImpl(`${host.replace(/\/$/, "")}/api/tags`, { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    return (data.models || []).map((m) => m.name).filter(Boolean);
  } catch {
    return [];
  }
}

function pick(preferred, installed) {
  const lower = new Map(installed.map((n) => [n.toLowerCase(), n]));
  for (const cand of preferred) {
    const key = cand.toLowerCase();
    if (lower.has(key)) return lower.get(key);
    for (const inst of installed) {
      if (inst.toLowerCase() === key || inst.toLowerCase().startsWith(`${key}:`)) return inst;
      if (inst.split(":")[0].toLowerCase() === key.split(":")[0]) return inst;
    }
  }
  return null;
}

export function route(task, { installed = [], override = process.env.QPF_CC_MODEL } = {}) {
  const taskKey = PREFERRED[task] ? task : "navigate";
  let chosen = null;
  let reason = "preferred";
  let fallback = false;
  if (override && taskKey !== "embed") {
    if (REMOTE.some((h) => override.toLowerCase().includes(h))) {
      override = null;
      reason = "ignored remote override";
    } else {
      chosen = override;
      reason = "QPF_CC_MODEL override (local)";
    }
  }
  if (!chosen) {
    chosen = pick(PREFERRED[taskKey], installed);
    if (!chosen) {
      fallback = true;
      chosen =
        installed.find((n) => !/embed|nomic/i.test(n)) ||
        process.env.QPF_CC_MODEL ||
        "llama3.2:1b";
      reason = "preferred model unavailable → local fallback";
    }
  }
  return {
    task: taskKey,
    model: chosen,
    preferred: PREFERRED[taskKey],
    installed,
    fallback,
    reason,
    advisory: fallback,
    limits: LIMITS[taskKey],
    remote: false,
    authority: "local-only; no silent remote escalation",
  };
}
