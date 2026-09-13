/**
 * Report-only claim-integrity linter. Does not edit files.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const BLOCKING = "BLOCKING";
export const REVIEW_REQUIRED = "REVIEW_REQUIRED";
export const INFORMATIONAL = "INFORMATIONAL";

const NEGATION =
  /\b(not|no|never|without|nor|n't|cannot|can't|dont|don't|disabled|gated|blocked|unauthorized|unauthorised|pending|forbidden|prohibited|refused|nogo|no-go|historical|diagnostic|optional|proposed|prepared-only|false|denied|disallowed|closed|unchecked)\b/i;

const CLAIM_RULES = [
  {
    rx: /\b(has|have|with)\s+live\s+mint(ing)?\b|\blive\s+mint(ing)?\s+is\b|\bmint(ing)?\s+is\s+(live|enabled|open|active)\b|\bpublic\s+mint(ing)?\s+is\s+(live|enabled|open|active)\b|\bpublic\s+mint(ing)?\s+(enabled|live)\b|\bmint(ing)?\s+went\s+live\b|\blaunched\s+live\s+mint(ing)?\b/i,
    topic: "live minting",
    evidence: "Economic activation remains NOT AUTHORIZED (mint / LP / yield).",
  },
  {
    rx: /\b(live\s+)?(liquidity|lp)\b.{0,20}\b(live|enabled|open|active)\b|\blive liquidity\b|\blp is live\b|\blp is active\b/i,
    topic: "live liquidity / LP",
    evidence: "Economic activation remains NOT AUTHORIZED (mint / LP / yield).",
  },
  {
    rx: /\byield\b.{0,24}\b(live|enabled|active|activated|authorized)\b|\blive yield\b/i,
    topic: "live yield",
    evidence: "Economic activation remains NOT AUTHORIZED (mint / LP / yield).",
  },
  {
    rx: /\beconomic activation\b.{0,24}\b(authorized|live|enabled|active)\b/i,
    topic: "live economic activation",
    evidence: "Economic activation remains NOT AUTHORIZED (mint / LP / yield).",
  },
  {
    rx: /\brouter\b.{0,32}\b(permanently|declaratively|is)\s+dead\b|\brouter is dead\b/i,
    topic: "Router permanently/declaratively dead",
    evidence: "Historical Router HTTP 402 is diagnostic history, not permanent product death.",
  },
  {
    rx: /\bbroadcast\b.{0,40}\b(designated|is the)\b.{0,20}\b(sor|source of truth)\b/i,
    topic: "Broadcast as designated SoR",
    evidence: "Broadcast set = UNRESOLVED_PEER. Docs DEPLOYMENT_SET is designated identity SoR only.",
  },
  {
    rx: /\berc-?7857\b.{0,40}\b(qpf\s+)?(canonical\s+)?identity\b|\berc-?8004\b.{0,40}\b(qpf\s+)?(canonical\s+)?identity\b/i,
    topic: "ERC-7857/8004 as QPF canonical identity",
    evidence: "ERC-7857/8004 are discoverability/research only. Not QPF identity SoR.",
  },
  {
    rx: /\b(s1\s+)?payment address\b.{0,40}\b(public|authorized|go)\b|\bpublic\s+(pay|checkout|payment)\b.{0,20}\b(authorized|live|go)\b/i,
    topic: "S1 payment address as public authorization",
    evidence: "Commercial receive / public pay remains pending GO.",
  },
];

const LADDER = [
  [/\bprepared\b.{0,40}\b(as|is|means|equals?|=)\s+executed\b/i, "prepared represented as executed"],
  [/\bverified\b.{0,40}\b(as|is|means|equals?|=)\s+approved\b/i, "verified represented as approved"],
  [/\bapproved\b.{0,40}\b(as|is|means|equals?|=)\s+executed\b/i, "approved represented as executed"],
];

function windowNegated(text, start, end, radius = 90) {
  return NEGATION.test(text.slice(Math.max(0, start - radius), Math.min(text.length, end + radius)));
}

export function scanText(text, source) {
  const findings = [];
  for (const rule of CLAIM_RULES) {
    rule.rx.lastIndex = 0;
    let m;
    const rx = new RegExp(rule.rx.source, rule.rx.flags.includes("g") ? rule.rx.flags : rule.rx.flags + "g");
    while ((m = rx.exec(text))) {
      if (windowNegated(text, m.index, m.index + m[0].length)) continue;
      const line = text.slice(0, m.index).split("\n").length;
      findings.push({
        severity: BLOCKING,
        topic: rule.topic,
        file: source,
        line,
        claim: text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).replace(/\n/g, " ").trim().slice(0, 240),
        evidence: rule.evidence,
        conflict: rule.evidence,
        certainty: "high",
      });
    }
  }
  for (const [rx0, topic] of LADDER) {
    const rx = new RegExp(rx0.source, "gi");
    let m;
    while ((m = rx.exec(text))) {
      const line = text.slice(0, m.index).split("\n").length;
      const claim = text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).replace(/\n/g, " ").trim().slice(0, 240);
      if (windowNegated(text, m.index, m.index + m[0].length)) continue;
      findings.push({
        severity: BLOCKING,
        topic,
        file: source,
        line,
        claim,
        evidence: "prepared ≠ verified ≠ approved ≠ executed",
        conflict: topic,
        certainty: "high",
      });
    }
  }
  return findings;
}

function walk(root, dir, acc, limit) {
  if (acc.length >= limit) return;
  let ents;
  try {
    ents = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of ents) {
    if (acc.length >= limit) return;
    const p = join(dir, e.name);
    const rel = relative(root, p).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (/(^|\/)(node_modules|\.git|archive|__pycache__|living-forge|reality)(\/|$)/.test(rel)) continue;
      walk(root, p, acc, limit);
    } else if (e.isFile()) {
      if (rel.startsWith("reports/") || rel.endsWith(".json")) continue;
      if (rel.includes("S1_PACKAGE_INDEX") || rel.includes("S1_PAYMENT_VERIFICATION")) continue;
      try {
        if (statSync(p).size > 200000) continue;
        acc.push({ path: rel, abs: p });
      } catch {
        /* skip */
      }
    }
  }
}

export function scanContradictions({ root, texts = null, limitFiles = 120 } = {}) {
  const findings = [];
  let scanned = 0;
  if (texts) {
    for (const [path, text] of texts) {
      findings.push(...scanText(text, path));
      scanned += 1;
    }
  } else if (root) {
    const files = [];
    for (const d of ["docs/ai", "docs/governance", "docs/0g-compute", "docs/0g-alignment-node", "docs/0g-builder-hub"]) {
      const abs = join(root, d);
      if (existsSync(abs)) walk(root, abs, files, limitFiles);
    }
    const single = join(root, "docs/0G_SKILLS_README.md");
    if (existsSync(single)) files.push({ path: "docs/0G_SKILLS_README.md", abs: single });
    for (const f of files.slice(0, limitFiles)) {
      try {
        findings.push(...scanText(readFileSync(f.abs, "utf8"), f.path));
        scanned += 1;
      } catch {
        /* skip */
      }
    }
  }
  const counts = { [BLOCKING]: 0, [REVIEW_REQUIRED]: 0, [INFORMATIONAL]: 0 };
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;
  return {
    schema: "qpf.ops.contradiction_report.v1",
    read_only: true,
    scanned_files: scanned,
    counts,
    findings,
    authority: "Report-only. Does not modify files or authorization state.",
  };
}

export function renderContradictionText(report) {
  const lines = [
    "CONTRADICTION REPORT (read-only)",
    `scanned=${report.scanned_files}  BLOCKING=${report.counts[BLOCKING] || 0}  REVIEW_REQUIRED=${report.counts[REVIEW_REQUIRED] || 0}  INFORMATIONAL=${report.counts[INFORMATIONAL] || 0}`,
    "",
  ];
  if (!report.findings?.length) {
    lines.push("NO CONTRADICTIONS DETECTED");
    return lines.join("\n");
  }
  for (const f of report.findings) {
    lines.push(f.severity, "", `File: ${f.file}:${f.line}`, `Claim: ${f.claim}`, `Canonical evidence: ${f.evidence}`, `Conflict: ${f.conflict}`, `Severity: ${f.severity}`, "");
  }
  return lines.join("\n");
}
