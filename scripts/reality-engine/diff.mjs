/**
 * Diff engine — compare previous vs current Reality Engine snapshots.
 * Emits structured events + human-readable summary lines.
 */
import {
  ALERT_DIR,
  DIFF_DIR,
  LATEST_DIFF,
  LATEST_STATE,
  PREV_STATE,
  ensureDirs,
  fileStamp,
  readJson,
  sha256Json,
  utcStamp,
  writeJson,
} from "./lib/io.mjs";
import { join } from "node:path";

function pushEvent(events, severity, category, code, message, detail = null) {
  events.push({
    severity, // info | change | alert
    category,
    code,
    message,
    detail,
  });
}

function diffSafe(prev, curr, events) {
  if (!curr) return;
  if (curr.status === "NOT_CONFIGURED") {
    if (!prev || prev.status === "NOT_CONFIGURED") {
      pushEvent(
        events,
        "info",
        "safe",
        "SAFE_NOT_CONFIGURED",
        "Guardian Safe address not configured (unchanged valid negative reality)",
      );
    } else {
      pushEvent(
        events,
        "alert",
        "safe",
        "SAFE_BECAME_UNCONFIGURED",
        "Safe was previously measured; now NOT_CONFIGURED",
      );
    }
    return;
  }

  if (!prev || prev.status === "NOT_CONFIGURED") {
    pushEvent(events, "change", "safe", "SAFE_FIRST_OBSERVATION", "First Safe observation", {
      threshold: curr.threshold,
      owners: curr.owners,
      nonce: curr.nonce,
    });
    return;
  }

  if (prev.threshold !== curr.threshold) {
    pushEvent(events, "alert", "safe", "SAFE_THRESHOLD_CHANGED", "Safe threshold changed", {
      from: prev.threshold,
      to: curr.threshold,
    });
  } else {
    pushEvent(
      events,
      "info",
      "safe",
      "SAFE_THRESHOLD_UNCHANGED",
      `Threshold unchanged (${curr.threshold})`,
    );
  }

  const po = JSON.stringify([...(prev.owners || [])].map((a) => a.toLowerCase()).sort());
  const co = JSON.stringify([...(curr.owners || [])].map((a) => a.toLowerCase()).sort());
  if (po !== co) {
    pushEvent(events, "alert", "safe", "SAFE_OWNERS_CHANGED", "Safe owners changed", {
      from: prev.owners,
      to: curr.owners,
    });
  } else {
    pushEvent(
      events,
      "info",
      "safe",
      "SAFE_OWNERS_UNCHANGED",
      `Owners unchanged (count ${curr.owners?.length ?? 0})`,
    );
  }

  if (prev.nonce !== curr.nonce) {
    pushEvent(events, "change", "safe", "SAFE_NONCE_ADVANCED", "Safe transaction executed (nonce advanced)", {
      from: prev.nonce,
      to: curr.nonce,
    });
  } else {
    pushEvent(
      events,
      "info",
      "safe",
      "SAFE_NONCE_UNCHANGED",
      `Nonce unchanged (${curr.nonce})`,
    );
  }

  if (prev.balance_wei != null && curr.balance_wei != null && prev.balance_wei !== curr.balance_wei) {
    pushEvent(events, "change", "safe", "SAFE_BALANCE_CHANGED", "Safe native balance changed", {
      from: prev.balance_native,
      to: curr.balance_native,
      from_wei: prev.balance_wei,
      to_wei: curr.balance_wei,
    });
  }

  if (!!prev.nested_architecture !== !!curr.nested_architecture) {
    pushEvent(
      events,
      "alert",
      "safe",
      "SAFE_NESTING_CHANGED",
      "Nested Safe architecture flag changed",
      { from: prev.nested_architecture, to: curr.nested_architecture },
    );
  }
}

function diffBalances(prevRpc, currRpc, events) {
  const prev = new Map((prevRpc?.balances || []).map((b) => [b.address, b]));
  const currList = currRpc?.balances || [];
  for (const c of currList) {
    const p = prev.get(c.address);
    if (c.low_gas || c.status === "LOW_GAS") {
      pushEvent(
        events,
        "alert",
        "balances",
        "LOW_GAS",
        `Low native balance: ${c.label} (${c.native})`,
        c,
      );
    }
    if (p && p.wei != null && c.wei != null && p.wei !== c.wei) {
      pushEvent(events, "change", "balances", "BALANCE_CHANGED", `Balance changed: ${c.label}`, {
        from: p.native,
        to: c.native,
        address: c.address,
      });
    }
  }
  if (currRpc?.gas_alerts?.length) {
    pushEvent(
      events,
      "alert",
      "balances",
      "EXECUTION_CHAIN_GAS_RISK",
      `${currRpc.gas_alerts.length} gas-critical address(es) below warn threshold — nested Safe execution may stall`,
      { alerts: currRpc.gas_alerts },
    );
  }
}

function flattenContractOwners(rpcSlice) {
  const map = {};
  if (!rpcSlice?.contracts) return map;
  for (const [setKey, set] of Object.entries(rpcSlice.contracts)) {
    for (const [role, c] of Object.entries(set.roles || {})) {
      map[`${setKey}.${role}`] = {
        address: c.address,
        owner: c.owner,
        code_sha256: c.code_sha256,
        has_code: c.has_code,
        status: c.status,
      };
    }
  }
  return map;
}

function diffRpc(prev, curr, events) {
  if (!curr) return;

  if (curr.status === "UNAVAILABLE") {
    pushEvent(events, "alert", "rpc", "RPC_UNAVAILABLE", "RPC collector unavailable", {
      errors: curr.errors,
    });
    return;
  }

  if (!prev) {
    pushEvent(events, "change", "rpc", "RPC_FIRST_OBSERVATION", "First RPC observation", {
      chainId: curr.chainId,
      block: curr.block,
    });
  } else {
    if (prev.chainId !== curr.chainId) {
      pushEvent(events, "alert", "rpc", "CHAIN_ID_CHANGED", "Chain ID changed", {
        from: prev.chainId,
        to: curr.chainId,
      });
    } else {
      pushEvent(
        events,
        "info",
        "rpc",
        "CHAIN_REACHABLE",
        `Chain reachable (id ${curr.chainId}, block ${curr.block})`,
      );
    }
  }

  const prevMap = flattenContractOwners(prev);
  const currMap = flattenContractOwners(curr);
  const keys = new Set([...Object.keys(prevMap), ...Object.keys(currMap)]);
  for (const k of keys) {
    const p = prevMap[k];
    const c = currMap[k];
    if (!p && c) {
      pushEvent(events, "change", "contracts", "CONTRACT_FIRST_SEEN", `First seen ${k}`, c);
      continue;
    }
    if (p && !c) {
      pushEvent(events, "alert", "contracts", "CONTRACT_DISAPPEARED", `No longer present ${k}`, p);
      continue;
    }
    if (p.has_code && !c.has_code) {
      pushEvent(events, "alert", "contracts", "CONTRACT_CODE_REMOVED", `Code removed at ${k}`, {
        address: c.address,
      });
    }
    if (p.code_sha256 && c.code_sha256 && p.code_sha256 !== c.code_sha256) {
      pushEvent(events, "alert", "contracts", "CONTRACT_CODE_CHANGED", `Bytecode hash changed ${k}`, {
        address: c.address,
        from: p.code_sha256,
        to: c.code_sha256,
      });
    }
    if (p.owner && c.owner && p.owner !== c.owner) {
      pushEvent(events, "alert", "contracts", "CONTRACT_OWNER_CHANGED", `Owner changed ${k}`, {
        address: c.address,
        from: p.owner,
        to: c.owner,
      });
    }
  }

  // Binding drift
  for (const [setKey, b] of Object.entries(curr.bindings || {})) {
    if (b.status === "DRIFT") {
      pushEvent(
        events,
        "alert",
        "contracts",
        "REGISTRY_TOKEN_BINDING_DRIFT",
        `Registry token binding drift (${setKey})`,
        b,
      );
    }
  }
}

function diffGit(prev, curr, events) {
  if (!curr || curr.status !== "PASS") {
    if (curr?.status === "UNAVAILABLE") {
      pushEvent(events, "alert", "git", "GIT_UNAVAILABLE", "Git collector unavailable");
    }
    return;
  }
  if (!prev) {
    pushEvent(events, "change", "git", "GIT_FIRST_OBSERVATION", "First git observation", {
      head: curr.head,
      branch: curr.branch,
    });
    return;
  }
  if (prev.head !== curr.head) {
    pushEvent(events, "change", "git", "GIT_HEAD_MOVED", "Repository HEAD moved", {
      from: prev.head,
      to: curr.head,
      branch: curr.branch,
    });
  } else {
    pushEvent(
      events,
      "info",
      "git",
      "GIT_HEAD_UNCHANGED",
      `HEAD unchanged (${(curr.head || "").slice(0, 12)}…) on ${curr.branch}`,
    );
  }
  if (curr.dirty) {
    pushEvent(
      events,
      "info",
      "git",
      "GIT_DIRTY_TREE",
      `Working tree dirty (${curr.dirty_count} paths)`,
    );
  }
}

export function runDiff({ previous = null, current = null } = {}) {
  ensureDirs();
  const curr = current || readJson(LATEST_STATE);
  if (!curr) {
    throw new Error("No current state at state/latest.json — run collect first");
  }
  const prev = previous || readJson(PREV_STATE);

  const events = [];
  const timestamp = utcStamp();

  diffRpc(prev?.collectors?.rpc, curr?.collectors?.rpc, events);
  diffSafe(prev?.collectors?.safe, curr?.collectors?.safe, events);
  diffBalances(prev?.collectors?.rpc, curr?.collectors?.rpc, events);
  diffGit(prev?.collectors?.git, curr?.collectors?.git, events);

  const alerts = events.filter((e) => e.severity === "alert");
  const changes = events.filter((e) => e.severity === "change");

  const diff = {
    schema: "reality-engine-diff-v0",
    timestamp,
    previous_run_at: prev?.timestamp || null,
    current_run_at: curr.timestamp,
    previous_payload_sha256: prev?.payload_sha256 || null,
    current_payload_sha256: curr.payload_sha256,
    first_run: !prev,
    alert_count: alerts.length,
    change_count: changes.length,
    events,
    summary_lines: events.map(
      (e) => `${e.severity === "alert" ? "!" : e.severity === "change" ? "~" : "✓"} [${e.category}] ${e.message}`,
    ),
  };
  diff.payload_sha256 = sha256Json(diff);

  writeJson(LATEST_DIFF, diff);
  writeJson(join(DIFF_DIR, `diff-${fileStamp(timestamp)}.json`), diff);

  if (alerts.length) {
    writeJson(join(ALERT_DIR, `alert-${fileStamp(timestamp)}.json`), {
      timestamp,
      alert_count: alerts.length,
      alerts,
    });
  }

  return diff;
}

// Allow CLI: node scripts/reality-engine/diff.mjs
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("diff.mjs")) {
  try {
    const d = runDiff();
    console.log(JSON.stringify({ ok: true, alert_count: d.alert_count, change_count: d.change_count }, null, 2));
    console.log(d.summary_lines.join("\n"));
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
}
