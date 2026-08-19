/**
 * Bounded retrieval over canonical/current material.
 * Vector rank is not authority. Git/receipts remain SoR.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";

export const INCLUDE_DIRS = [
  "docs/ai",
  "docs/governance",
  "docs/0g-compute",
  "docs/0g-alignment-node",
  "docs/0g-builder-hub",
  "receipts",
];
export const INCLUDE_FILES = [
  "docs/0G_SKILLS_README.md",
  "reports/local-verify-report.json",
  "reports/project-state.json",
  "docs/activation/reality/briefs/LATEST.md",
];
const EXCLUDE_RE =
  /(^|\/)(node_modules|\.git|archive|__pycache__|living-forge|docs\/activation\/reality\/(history|state|diffs)|out|dist|\.next)(\/|$)/;
const S1_MARKERS = ["S1_PACKAGE_INDEX", "S1_PAYMENT_VERIFICATION_CHECKLIST", "S1_EVIDENCE_WALKTHROUGH"];
const MAX_FILES = Number(process.env.QPF_BRIEF_RETRIEVE_MAX_FILES || 400);
const MAX_BYTES = 200000;

export function listCorpus(root) {
  const out = [];
  const seen = new Set();
  const add = (abs, rel, status = "canonical-candidate") => {
    if (seen.has(rel)) return;
    if (EXCLUDE_RE.test(rel.replace(/\\/g, "/"))) return;
    if (S1_MARKERS.some((m) => rel.includes(m))) return;
    try {
      const st = statSync(abs);
      if (!st.isFile() || st.size > MAX_BYTES) return;
    } catch {
      return;
    }
    seen.add(rel);
    out.push({ path: rel, abs, status });
  };
  for (const rel of INCLUDE_FILES) {
    const abs = join(root, rel);
    if (existsSync(abs)) add(abs, rel, "explicit");
  }
  const walk = (dir) => {
    if (out.length >= MAX_FILES) return;
    let ents;
    try {
      ents = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of ents) {
      if (out.length >= MAX_FILES) return;
      const abs = join(dir, e.name);
      const rel = relative(root, abs).replace(/\\/g, "/");
      if (e.isDirectory()) {
        if (EXCLUDE_RE.test(rel + "/")) continue;
        walk(abs);
      } else if (e.isFile()) {
        add(abs, rel);
      }
    }
  };
  for (const d of INCLUDE_DIRS) {
    const abs = join(root, d);
    if (existsSync(abs)) walk(abs);
  }
  return out;
}

function keywordScore(query, text) {
  const q = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (!q.length) return 0;
  const hay = text.toLowerCase();
  return q.filter((w) => hay.includes(w)).length / q.length;
}

export async function retrieve(query, { root, k = 6, embed = null } = {}) {
  const corpus = listCorpus(root);
  const chunks = [];
  for (const item of corpus) {
    let text;
    try {
      text = readFileSync(item.abs, "utf8");
    } catch {
      continue;
    }
    for (let i = 0, n = 0; i < text.length && n < 8; i += 1200, n += 1) {
      const piece = text.slice(i, i + 1400);
      const line = text.slice(0, i).split("\n").length;
      chunks.push({ path: item.path, location: `L${line}`, text: piece });
    }
  }
  let method = "keyword";
  let scored = chunks.map((c) => [keywordScore(query, c.text), c]);
  if (typeof embed === "function") {
    try {
      const qv = await embed([query.slice(0, 2000)]);
      if (qv?.[0]) {
        method = "nomic-embed-text";
        scored = [];
        for (const c of chunks) {
          const ev = await embed([c.text.slice(0, 1400)]);
          if (!ev?.[0]) {
            method = "keyword";
            scored = chunks.map((ch) => [keywordScore(query, ch.text), ch]);
            break;
          }
          scored.push([cosine(qv[0], ev[0]), c]);
        }
      }
    } catch {
      method = "keyword";
      scored = chunks.map((c) => [keywordScore(query, c.text), c]);
    }
  }
  scored.sort((a, b) => b[0] - a[0]);
  const hits = scored
    .filter(([s]) => s > 0)
    .slice(0, k)
    .map(([score, ch]) => ({
      path: ch.path,
      location: ch.location,
      score: Number(score.toFixed(4)),
      excerpt: ch.text.slice(0, 500),
      status: "retrieved-not-authoritative",
    }));
  return {
    query,
    method,
    corpus_n: corpus.length,
    authority: "Git/files/receipts remain source of truth. Retrieval is advisory.",
    hits,
  };
}

function cosine(a, b) {
  if (!a?.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export function writeSnapshot(root, text) {
  const p = join(root, "reports/ai-brief-latest.txt");
  try {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, text);
  } catch {
    /* ignore */
  }
  return p;
}
