/**
 * Morning brief — extends cockpit/reality path. Not a competing dashboard.
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { authFromState, ensureContract, postureFromRepo } from "./brief-contract.mjs";
import { BLOCKING, REVIEW_REQUIRED, scanContradictions } from "./brief-contradictions.mjs";
import { explainDirtyTree } from "./brief-dirty-tree.mjs";
import { detectModels, route } from "./brief-router.mjs";
import { writeSnapshot } from "./brief-retrieve.mjs";

function agentHealth(root) {
  try {
    const r = spawnSync("bash", [join(root, "scripts/agent-health.sh"), "--json"], {
      cwd: root,
      encoding: "utf8",
      timeout: 15000,
      env: { ...process.env, NO_WALLET_TOUCH: "1" },
    });
    const raw = (r.stdout || "").trim();
    if (raw.startsWith("{")) return JSON.parse(raw);
    return { exit: r.status, detail: (r.stderr || raw).slice(0, 300) };
  } catch (e) {
    return { exit: null, detail: String(e.message || e) };
  }
}

function attention(contract, auth, contra, dirty, health) {
  const items = [];
  const blocking = contra.counts?.[BLOCKING] || 0;
  const review = contra.counts?.[REVIEW_REQUIRED] || 0;
  if (blocking) {
    items.push({ kind: "contradiction", title: `${blocking} BLOCKING contradiction(s)` });
  }
  if (review && items.length < 5) {
    items.push({ kind: "contradiction", title: `${review} REVIEW_REQUIRED claim(s)` });
  }
  if (contract.state === "CONTRACT_UNAVAILABLE") {
    items.push({ kind: "contract", title: "STATE: CONTRACT_UNAVAILABLE" });
  } else if (contract.state === "CONTRACT_STALE") {
    items.push({
      kind: "contract",
      title: "STATE: CONTRACT_STALE",
      detail: `age=${contract.contract_age_s}s max=${contract.max_age_s}s`,
    });
  }
  const ver = contract.verify_report?.facts?.verification || {};
  if (ver.evidence === "FAIL" || ver.build === "FAIL") {
    items.push({ kind: "verify", title: `Verification failed evidence=${ver.evidence} build=${ver.build}` });
  }
  if (health?.exit === 1) {
    items.push({ kind: "health", title: "agent-health critical" });
  }
  if (dirty.total && items.length < 5) {
    const product = dirty.groups.find((g) => g.group === "PRODUCT / CODE");
    items.push({
      kind: "git",
      title: `Dirty tree (${dirty.total} paths${product ? `, ${product.count} product` : ""})`,
    });
  }
  if (auth.posture && /NO_GO|GATED/i.test(String(auth.posture)) && items.length < 5) {
    items.push({
      kind: "auth",
      title: `Execution posture ${auth.posture} · activation ${auth.public_activation}`,
    });
  }
  return items.slice(0, 5);
}

export async function buildBrief({ root, refresh = false, scanDocs = true } = {}) {
  const contract = ensureContract({ root, refresh });
  const auth = authFromState(contract.project_state);
  const posture = postureFromRepo(root);
  const dirty = explainDirtyTree({ root });
  const health = agentHealth(root);
  const contra = scanDocs
    ? scanContradictions({ root })
    : { counts: { [BLOCKING]: 0, [REVIEW_REQUIRED]: 0 }, findings: [], scanned_files: 0 };
  const models = await detectModels();
  const routing = {
    classify: route("classify", { installed: models }),
    navigate: route("navigate", { installed: models }),
    analyze: route("analyze", { installed: models }),
    embed: route("embed", { installed: models }),
  };
  const attn = attention(contract, auth, contra, dirty, health);
  const brief = {
    schema: "qpf.ops.morning_brief.v1",
    read_only: true,
    chat_is_not_authority: true,
    contract,
    git: contract.live_git,
    auth,
    posture,
    services: health,
    contradictions: {
      counts: contra.counts,
      scanned_files: contra.scanned_files,
      findings: (contra.findings || []).slice(0, 20),
    },
    dirty_tree: dirty,
    models,
    routing,
    attention: attn,
    safety: {
      economic: "NOT AUTHORIZED",
      wallet: false,
      sign: false,
      broadcast: false,
      mint: false,
      lp: false,
      yield: false,
      outreach: false,
      live_compute: false,
    },
  };
  return brief;
}

export function renderBriefText(brief) {
  const c = brief.contract || {};
  const g = brief.git || {};
  const a = brief.auth || {};
  const p = brief.posture || {};
  const lines = [
    "QPF AI BRIEF  ·  read-only  ·  chat ≠ authority",
    `STATE: ${c.state || "CONTRACT_UNAVAILABLE"}`,
    "",
    "=== GIT TRUTH (live) ===",
    `branch: ${g.branch}`,
    `HEAD: ${g.commit_short}  (${g.commit})`,
    `dirty paths: ${g.dirty_count}`,
    `ahead: ${g.ahead}  behind: ${g.behind}`,
    `contract generated: ${c.at}`,
    `contract timestamp: ${c.contract_timestamp}`,
    `verify report age_s: ${c.verify_report_age_s}`,
    `project-state age_s: ${c.project_state_age_s}`,
    `freshness threshold_s: ${c.max_age_s}`,
    "",
    "=== AUTHORIZATION (project-state, not invented) ===",
    `phase: ${a.phase} ${a.phase_status}`,
    `public_activation: ${a.public_activation}`,
    `execution_posture: ${a.posture}`,
    "awaiting_invented: false",
    "",
    "=== SERVICES / AGENT HEALTH ===",
    `agent-health exit: ${brief.services?.exit ?? brief.services?.status ?? "n/a"}`,
    "",
    "=== 0G POSTURE ===",
    `Network: ${p.network}`,
    `Chain ID: ${p.chain_id}`,
    `Identity SoR: ${p.identity_sor}`,
    `Designation: ${p.designation}`,
    `Economic activation: ${p.economic}`,
    `Compute spend: ${p.compute_spend}`,
    "",
    "=== CONTRADICTIONS ===",
    `BLOCKING=${brief.contradictions?.counts?.[BLOCKING] || 0}  REVIEW_REQUIRED=${brief.contradictions?.counts?.[REVIEW_REQUIRED] || 0}  scanned=${brief.contradictions?.scanned_files}`,
  ];
  for (const f of (brief.contradictions?.findings || []).slice(0, 5)) {
    lines.push(`- [${f.severity}] ${f.file}:${f.line} ${f.topic}`);
  }
  lines.push("", "=== DIRTY TREE ===");
  const dt = brief.dirty_tree || {};
  if (dt.clean) lines.push("clean working tree");
  else {
    lines.push(`${dt.total} dirty path(s)`);
    for (const ginfo of dt.groups || []) lines.push(`- ${ginfo.group}: ${ginfo.count}`);
  }
  lines.push("", "=== ATTENTION (max 5) ===");
  const attn = brief.attention || [];
  if (!attn.length) lines.push("NO MATERIAL ATTENTION ITEMS");
  else attn.forEach((item, i) => lines.push(`${i + 1}. [${item.kind}] ${item.title}`));
  const nav = brief.routing?.navigate || {};
  lines.push(
    "",
    "=== ROUTER (local) ===",
    `navigate → ${nav.model} (${nav.reason})`,
    `installed: ${(brief.models || []).length} model(s)`,
    "",
    "No signing, broadcast, mint, LP, yield, wallet, outreach, or live 0G spend.",
    "prepared ≠ verified ≠ approved ≠ executed",
  );
  return lines.join("\n");
}

export async function runBriefAndWrite({ root, refresh = false } = {}) {
  const brief = await buildBrief({ root, refresh });
  const text = renderBriefText(brief);
  writeSnapshot(root, text);
  return { brief, text };
}
