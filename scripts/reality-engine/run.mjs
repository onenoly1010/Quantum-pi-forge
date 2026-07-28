#!/usr/bin/env node
/**
 * Reality Engine v0 — collect → store → diff → brief
 * Read-only. No signing. No invented RPC/Safe endpoints.
 *
 * Usage:
 *   node scripts/reality-engine/run.mjs
 *   node scripts/reality-engine/run.mjs --collect-only
 *   node scripts/reality-engine/run.mjs --diff-only
 *   node scripts/reality-engine/run.mjs --brief-only
 *   node scripts/reality-engine/run.mjs --with-claim-map
 */
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { collectRpc } from "./collectors/rpc.mjs";
import { collectSafe } from "./collectors/safe.mjs";
import { collectGit } from "./collectors/git.mjs";
import { runDiff } from "./diff.mjs";
import { writeBrief } from "./brief.mjs";
import { runClaimMap } from "./claim-map.mjs";
import {
  HISTORY_DIR,
  LATEST_STATE,
  PREV_STATE,
  ensureDirs,
  fileStamp,
  loadExpected,
  pruneHistory,
  readJson,
  sha256Json,
  utcStamp,
  writeJson,
} from "./lib/io.mjs";

function parseArgs(argv) {
  return {
    collectOnly: argv.includes("--collect-only"),
    diffOnly: argv.includes("--diff-only"),
    briefOnly: argv.includes("--brief-only"),
    withClaimMap: argv.includes("--with-claim-map"),
  };
}

async function collectAll() {
  ensureDirs();
  const expected = loadExpected();
  const timestamp = utcStamp();

  const [rpc, safe, git] = await Promise.all([
    collectRpc(expected),
    collectSafe(expected),
    collectGit(expected),
  ]);

  const snapshot = {
    schema: "reality-engine-snapshot-v0",
    engine: "reality-engine-v0",
    timestamp,
    policy: expected.policy,
    chain: {
      expected_chain_id: expected.chain.chain_id,
      rpc_url: expected.chain.rpc_url,
      rpc_url_source: expected.chain.rpc_url_source,
    },
    collectors: { rpc, safe, git },
  };
  snapshot.payload_sha256 = sha256Json({
    rpc: rpc.payload_sha256,
    safe: safe.payload_sha256,
    git: git.payload_sha256,
  });

  // Rotate previous ← latest
  if (existsSync(LATEST_STATE)) {
    copyFileSync(LATEST_STATE, PREV_STATE);
  }

  writeJson(LATEST_STATE, snapshot);
  writeJson(join(HISTORY_DIR, `snapshot-${fileStamp(timestamp)}.json`), snapshot);
  pruneHistory(48);

  return snapshot;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.briefOnly) {
    const { text } = writeBrief();
    process.stdout.write(text);
    return;
  }

  if (args.diffOnly) {
    const d = runDiff();
    console.log(`diff alerts=${d.alert_count} changes=${d.change_count} first_run=${d.first_run}`);
    console.log(d.summary_lines.join("\n"));
    const { text } = writeBrief({ diff: d });
    process.stdout.write("\n" + text);
    return;
  }

  const snapshot = await collectAll();
  console.error(
    `collected @ ${snapshot.timestamp} rpc=${snapshot.collectors.rpc.status} safe=${snapshot.collectors.safe.status} git=${snapshot.collectors.git.status}`,
  );

  if (args.collectOnly) {
    console.log(JSON.stringify({
      ok: true,
      timestamp: snapshot.timestamp,
      payload_sha256: snapshot.payload_sha256,
      rpc: snapshot.collectors.rpc.status,
      safe: snapshot.collectors.safe.status,
      git: snapshot.collectors.git.status,
      block: snapshot.collectors.rpc.block,
      chainId: snapshot.collectors.rpc.chainId,
    }, null, 2));
    return;
  }

  const d = runDiff({ current: snapshot, previous: readJson(PREV_STATE) });
  console.error(`diff alerts=${d.alert_count} changes=${d.change_count} first_run=${d.first_run}`);

  const { text, path } = writeBrief({ state: snapshot, diff: d });
  process.stdout.write(text);
  console.error(`brief → ${path}`);

  if (args.withClaimMap) {
    const { report, md } = runClaimMap({ state: snapshot });
    process.stdout.write("\n" + md);
    console.error(
      `claim-map → DOC_DRIFT=${report.summary.doc_drift} alerts=${report.summary.alerts}`,
    );
  }

  // Exit non-zero only on hard infrastructure failure, not on first-run or informational drift
  const rpcBad = snapshot.collectors.rpc.status === "UNAVAILABLE";
  if (rpcBad) process.exit(2);
}

main().catch((e) => {
  console.error(e.stack || e.message || e);
  process.exit(1);
});
