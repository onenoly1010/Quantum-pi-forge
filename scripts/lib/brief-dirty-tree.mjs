/**
 * Read-only dirty-tree explainer. Never stages, resets, commits, or pushes.
 */
import { execFileSync } from "node:child_process";
import { extname } from "node:path";

const GROUPS = [
  "OPS / GENERATED NOISE",
  "PRODUCT / CODE",
  "DOCUMENTATION",
  "TESTS",
  "CONFIGURATION",
  "UNKNOWN / REVIEW",
];

function classify(path) {
  const norm = path.replace(/\\/g, "/");
  const base = norm.split("/").pop();
  const lower = norm.toLowerCase();
  if (
    norm.startsWith("docs/activation/living-forge/") ||
    norm.startsWith("docs/activation/reality/") ||
    norm.startsWith("reports/") ||
    norm.startsWith("receipts/ops/") ||
    lower.includes("__pycache__") ||
    base === "local-verify-report.json" ||
    base === "project-state.json"
  ) {
    return "OPS / GENERATED NOISE";
  }
  if (/\/tests?\/|\.test\.|\.spec\.|_test\./.test(lower)) return "TESTS";
  if (
    [".yml", ".yaml", ".toml", ".ini"].includes(extname(norm)) ||
    ["package.json", "package-lock.json", "wrangler.toml", "foundry.toml"].includes(base)
  ) {
    return "CONFIGURATION";
  }
  if ([".md", ".rst", ".txt"].includes(extname(norm)) || norm.startsWith("docs/")) {
    return "DOCUMENTATION";
  }
  if (
    [".py", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".sol"].includes(extname(norm)) ||
    /^(tools|contracts|scripts|src|app|frontend)\//.test(norm)
  ) {
    return "PRODUCT / CODE";
  }
  return "UNKNOWN / REVIEW";
}

function generated(path) {
  const lower = path.toLowerCase();
  return (
    lower.includes(".map") ||
    lower.includes(".pyc") ||
    path.startsWith("docs/activation/living-forge/") ||
    path.startsWith("docs/activation/reality/")
  );
}

export function porcelain(root) {
  try {
    const out = execFileSync("git", ["-C", root, "status", "--porcelain"], {
      encoding: "utf8",
      timeout: 8000,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return out
      .split("\n")
      .filter((l) => l.length >= 4)
      .map((line) => {
        const code = line.slice(0, 2);
        let path = line.slice(3).trim();
        if (path.includes(" -> ")) path = path.split(" -> ").pop();
        return [code, path];
      });
  } catch {
    return [];
  }
}

export function explainDirtyTree({ root, rows = null } = {}) {
  const list = rows || porcelain(root);
  const grouped = Object.fromEntries(GROUPS.map((g) => [g, []]));
  for (const [code, path] of list) {
    const group = classify(path);
    grouped[group].push({ path, code, generated: generated(path) });
  }
  const groups = [];
  for (const name of GROUPS) {
    const items = grouped[name];
    if (!items.length) continue;
    groups.push({
      group: name,
      count: items.length,
      generated_n: items.filter((i) => i.generated).length,
      human_review_likely: name !== "OPS / GENERATED NOISE",
      sample: items.slice(0, 8).map((i) => i.path),
      items,
    });
  }
  return {
    schema: "qpf.ops.dirty_tree.v1",
    read_only: true,
    clean: list.length === 0,
    total: list.length,
    groups,
    authority: "Observational. Does not stage, reset, commit, push, or clean.",
  };
}

export function renderDirtyTreeText(report) {
  if (report.clean) return "DIRTY TREE: clean working tree";
  const lines = [`DIRTY TREE  ·  ${report.total} path(s)  ·  read-only`, ""];
  for (const g of report.groups) {
    lines.push(
      `${g.group}: ${g.count} files  generated=${g.generated_n}  (${g.human_review_likely ? "review likely" : "likely noise"})`,
    );
    for (const p of g.sample) lines.push(`  - ${p}`);
    lines.push("");
  }
  lines.push("No files were staged, reset, committed, or discarded.");
  return lines.join("\n");
}
