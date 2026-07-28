/**
 * Reality Brief — human-readable daily ops report from latest state + diff.
 */
import {
  LATEST_BRIEF,
  LATEST_DIFF,
  LATEST_STATE,
  BRIEF_DIR,
  ensureDirs,
  fileStamp,
  readJson,
  utcStamp,
  writeText,
} from "./lib/io.mjs";
import { join } from "node:path";

function mark(ok) {
  return ok ? "✓" : "✗";
}

export function buildBrief({ state = null, diff = null } = {}) {
  ensureDirs();
  const s = state || readJson(LATEST_STATE);
  const d = diff || readJson(LATEST_DIFF);
  if (!s) throw new Error("No state/latest.json — run collect first");

  const ts = s.timestamp || utcStamp();
  const rpc = s.collectors?.rpc || {};
  const safe = s.collectors?.safe || {};
  const git = s.collectors?.git || {};

  const lines = [];
  lines.push("QPF REALITY BRIEF");
  lines.push(`Generated: ${ts}`);
  lines.push(`Engine: reality-engine-v0 (read-only)`);
  lines.push("");

  lines.push("Blockchain");
  if (rpc.status === "UNAVAILABLE") {
    lines.push(`${mark(false)} Chain reachable — RPC UNAVAILABLE`);
    if (rpc.errors?.length) lines.push(`  ${rpc.errors[0]}`);
  } else {
    lines.push(
      `${mark(rpc.chain_ok)} Chain reachable (id ${rpc.chainId}, block ${rpc.block})`,
    );
    const sets = Object.keys(rpc.contracts || {});
    let codeOk = true;
    for (const sk of sets) {
      for (const role of Object.values(rpc.contracts[sk].roles || {})) {
        if (!role.has_code) codeOk = false;
      }
    }
    lines.push(
      `${mark(codeOk)} Contract code present on tracked sets (${sets.join(", ") || "none"})`,
    );
    for (const [bk, b] of Object.entries(rpc.bindings || {})) {
      const bindOk = b.status === "PASS" && b.matches_expected_token !== false;
      lines.push(
        `${mark(bindOk)} Registry→token binding ${bk}: ${b.token || "—"} (${b.status})`,
      );
    }
    // Owner residual note (common untrusted owner)
    const owners = new Set();
    for (const sk of sets) {
      for (const role of Object.values(rpc.contracts[sk].roles || {})) {
        if (role.owner) owners.add(role.owner);
      }
    }
    if (owners.size) {
      lines.push(
        `· Contract owner(s) observed: ${[...owners].join(", ")}`,
      );
      lines.push(
        `· Note: dual address sets still tracked until human canon decision (B-01)`,
      );
    }
  }

  if (safe.status === "NOT_CONFIGURED") {
    lines.push(`${mark(true)} Guardian Safe — NOT_CONFIGURED (valid negative reality)`);
  } else if (safe.status === "UNAVAILABLE" || safe.status === "FAIL") {
    lines.push(`${mark(false)} Guardian Safe — ${safe.status}`);
    if (safe.error) lines.push(`  ${safe.error}`);
  } else {
    const nest = safe.nested_architecture ? "nested" : "flat";
    lines.push(
      `${mark(safe.status === "PASS" || safe.status === "DRIFT")} Guardian Safe ${safe.safe} — ${safe.threshold}-of-${safe.owners?.length ?? "?"} · nonce ${safe.nonce} · ${nest}`,
    );
    if (safe.balance_native != null) {
      lines.push(`· Guardian native balance: ${safe.balance_native}`);
    }
    if (safe.nested_architecture) {
      for (const n of safe.nested_owners || []) {
        if (!n.looks_like_safe) continue;
        lines.push(
          `· Nested ${n.label || "Safe"} ${n.address.slice(0, 10)}… — ${n.threshold}-of-${n.owners?.length ?? "?"} · bal ${n.balance_native}`,
        );
      }
    }
    if (safe.expected_compare?.status === "DRIFT") {
      lines.push(`! Expected owner/threshold pin DRIFT (see state/latest.json)`);
    }
  }

  // Execution-chain balances
  const bals = rpc.balances || [];
  if (bals.length) {
    lines.push("");
    lines.push("Execution-chain balances (gas)");
    for (const b of bals) {
      const low = b.low_gas || b.status === "LOW_GAS";
      lines.push(
        `${mark(!low)} ${b.label}: ${b.native ?? "—"} native${low ? "  LOW_GAS" : ""}`,
      );
    }
    if (rpc.gas_alerts?.length) {
      lines.push(
        `! ${rpc.gas_alerts.length} gas-critical address(es) below warn threshold — Guardian chain may stall`,
      );
    }
  }
  lines.push("");

  lines.push("Repository");
  if (git.status === "PASS") {
    lines.push(
      `${mark(true)} Branch ${git.branch} @ ${(git.head || "").slice(0, 12)}…`,
    );
    lines.push(
      git.dirty
        ? `· Working tree dirty (${git.dirty_count} paths) — not a chain fault`
        : `${mark(true)} Working tree clean`,
    );
  } else {
    lines.push(`${mark(false)} Git status unavailable`);
  }
  lines.push("");

  lines.push("Infrastructure");
  lines.push("· Cloudflare collector: deferred (v0)");
  lines.push("");

  lines.push("Alerts");
  const alerts = (d?.events || []).filter((e) => e.severity === "alert");
  const changes = (d?.events || []).filter((e) => e.severity === "change");
  if (!d) {
    lines.push("· Diff not available (run full pipeline)");
  } else if (d.first_run) {
    lines.push("· First run — baseline established (no prior comparison)");
  } else if (!alerts.length) {
    lines.push("None");
  } else {
    for (const a of alerts) {
      lines.push(`! ${a.message}`);
    }
  }
  if (changes.length) {
    lines.push("");
    lines.push("Changes since last run");
    for (const c of changes) {
      lines.push(`~ ${c.message}`);
    }
  }
  lines.push("");

  lines.push("Evidence");
  lines.push(`· state: docs/activation/reality/state/latest.json`);
  lines.push(`· diff:  docs/activation/reality/diffs/latest.json`);
  lines.push(`· trust: live RPC > evidence JSON > sealed receipts > markdown`);
  lines.push("");
  lines.push("Policy: read-only. No sign / spend / broadcast.");

  return lines.join("\n") + "\n";
}

export function writeBrief(opts = {}) {
  const text = buildBrief(opts);
  const ts = utcStamp();
  writeText(LATEST_BRIEF, text);
  writeText(join(BRIEF_DIR, `brief-${fileStamp(ts)}.md`), text);
  return { text, path: LATEST_BRIEF };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("brief.mjs")) {
  try {
    const { text, path } = writeBrief();
    process.stdout.write(text);
    console.error(`Wrote ${path}`);
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
}
