#!/usr/bin/env node
/**
 * QPF AI briefing CLI — adapter over existing cockpit/verify/project-state.
 *
 * Usage:
 *   node scripts/ai-brief.mjs                 # cached brief (no regenerate)
 *   node scripts/ai-brief.mjs --refresh       # run existing ai-cockpit --quick first
 *   node scripts/ai-brief.mjs --contract
 *   node scripts/ai-brief.mjs --contradictions
 *   node scripts/ai-brief.mjs --dirty-tree
 *
 * Never: commit, push, sign, broadcast, wallet, spend.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureContract } from "./lib/brief-contract.mjs";
import { renderContradictionText, scanContradictions } from "./lib/brief-contradictions.mjs";
import { explainDirtyTree, renderDirtyTreeText } from "./lib/brief-dirty-tree.mjs";
import { runBriefAndWrite } from "./lib/brief-assemble.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));

function help() {
  console.log(`QPF AI brief (read-only)

  node scripts/ai-brief.mjs                 morning brief (cached reports)
  node scripts/ai-brief.mjs --refresh       regenerate via scripts/ai-cockpit.sh --quick
  node scripts/ai-brief.mjs --contract      contract envelope only
  node scripts/ai-brief.mjs --contradictions
  node scripts/ai-brief.mjs --dirty-tree
`);
}

async function main() {
  if (args.has("--help") || args.has("-h")) {
    help();
    return;
  }
  if (args.has("--contract")) {
    const c = ensureContract({ root: ROOT, refresh: args.has("--refresh") });
    console.log(c.state);
    console.log("at", c.at);
    console.log("git", c.live_git.branch, c.live_git.commit_short, "dirty", c.live_git.dirty_count);
    return;
  }
  if (args.has("--contradictions")) {
    console.log(renderContradictionText(scanContradictions({ root: ROOT })));
    return;
  }
  if (args.has("--dirty-tree")) {
    console.log(renderDirtyTreeText(explainDirtyTree({ root: ROOT })));
    return;
  }
  const { text } = await runBriefAndWrite({ root: ROOT, refresh: args.has("--refresh") });
  process.stdout.write(text + "\n");
}

main().catch((e) => {
  console.error(e.stack || e.message || e);
  process.exit(1);
});
