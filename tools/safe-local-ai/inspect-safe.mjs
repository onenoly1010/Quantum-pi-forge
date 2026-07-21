#!/usr/bin/env node
/**
 * QPF Safe local inspector — READ ONLY (multi-chain)
 *
 * - No private keys
 * - No signing
 * - No broadcast
 *
 * Usage:
 *   node inspect-safe.mjs
 *   node inspect-safe.mjs --hygiene
 *   SAFE_ADDRESS=0x... NETWORK=aristotle node inspect-safe.mjs
 *   NETWORK=ethereum node inspect-safe.mjs
 *
 * Local AI: run from workspace terminal; paste stdout only (never keys).
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(join(__dirname, "safes.config.json"), "utf8"),
);

const SAFE_ABI = [
  "function getThreshold() view returns (uint256)",
  "function getOwners() view returns (address[])",
  "function nonce() view returns (uint256)",
  "function getModulesPaginated(address start, uint256 pageSize) view returns (address[] array, address next)",
  "function getGuard() view returns (address)",
  "function VERSION() view returns (string)",
];

const SENTINEL = "0x0000000000000000000000000000000000000001";
const ZERO = "0x0000000000000000000000000000000000000000";

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  return {
    hygiene: flags.has("--hygiene") || flags.has("-h"),
    json: flags.has("--json"),
  };
}

function resolveNetworkKey(entry) {
  if (process.env.NETWORK?.trim()) return process.env.NETWORK.trim();
  if (entry.network) return entry.network;
  // Back-compat: old single-network config
  if (config.network) return "_legacy";
  return "aristotle";
}

function getNetworkDef(key) {
  if (key === "_legacy" && config.network) {
    return {
      id: "legacy",
      name: config.network.name,
      chainId: config.network.chainId,
      rpcUrl: config.network.rpcUrl,
      explorer: config.network.explorer,
      safePrefix: "unknown",
    };
  }
  const n = config.networks?.[key];
  if (!n) {
    throw new Error(
      `Unknown network "${key}". Known: ${Object.keys(config.networks || {}).join(", ")}`,
    );
  }
  return n;
}

function resolveSafes() {
  const single = process.env.SAFE_ADDRESS?.trim();
  const networkFilter = process.env.NETWORK?.trim();

  if (single) {
    return [
      {
        id: "env",
        network: networkFilter || "aristotle",
        address: single,
        label: "SAFE_ADDRESS from env",
        role: "custom",
      },
    ];
  }

  let list = config.safes || [];
  if (networkFilter) {
    list = list.filter((s) => (s.network || "aristotle") === networkFilter);
  }
  return list;
}

function classify(threshold, ownerCount, minSecure) {
  const t = Number(threshold);
  const n = Number(ownerCount);
  if (t < minSecure) {
    return {
      grade: "WEAK",
      reason: `threshold ${t}/${n} allows execution with fewer than ${minSecure} signatures`,
    };
  }
  if (t === 1) {
    return {
      grade: "WEAK",
      reason: "1-of-n is EOA-equivalent for sweeper bots",
    };
  }
  if (t / n < 0.5) {
    return {
      grade: "WARN",
      reason: "threshold is majority-weak relative to owner count",
    };
  }
  return {
    grade: "SECURE",
    reason: `requires ${t} of ${n} independent signatures`,
  };
}

async function inspectOne(provider, entry, networkDef, minSecure) {
  const code = await provider.getCode(entry.address);
  const out = {
    id: entry.id,
    label: entry.label,
    role: entry.role,
    address: entry.address,
    network: networkDef.id,
    chainId: networkDef.chainId,
    networkName: networkDef.name,
    safeUiHint: `${networkDef.safePrefix || "chain"}:${entry.address}`,
    isContract: code !== "0x" && code.length > 2,
    codePrefix: code.slice(0, 18),
    configNotes: entry.notes || null,
  };

  if (!out.isContract) {
    out.error = "no contract code at address (not a Safe / wrong network)";
    out.hygiene = {
      grade: "ERROR",
      reason: "not a contract on this RPC",
    };
    return out;
  }

  const safe = new ethers.Contract(entry.address, SAFE_ABI, provider);

  try {
    const [threshold, owners, nonce] = await Promise.all([
      safe.getThreshold(),
      safe.getOwners(),
      safe.nonce(),
    ]);

    out.threshold = Number(threshold);
    out.owners = owners;
    out.ownerCount = owners.length;
    out.nonce = Number(nonce);
    out.hygiene = classify(threshold, owners.length, minSecure);

    // Flag owners with no code (cannot be nested Safe / ERC-1271 on this chain)
    out.ownerCodePresence = {};
    for (const o of owners) {
      const oc = await provider.getCode(o);
      out.ownerCodePresence[o] = oc !== "0x" && oc.length > 2 ? "contract" : "eoa_or_empty";
    }

    try {
      out.version = await safe.VERSION();
    } catch {
      out.version = null;
    }

    try {
      const guard = await safe.getGuard();
      out.guard = guard;
      out.guardEnabled = guard.toLowerCase() !== ZERO.toLowerCase();
    } catch {
      out.guard = null;
      out.guardEnabled = null;
    }

    try {
      const [modules] = await safe.getModulesPaginated(SENTINEL, 10);
      out.modules = modules;
      out.modulesCount = modules.length;
    } catch {
      out.modules = null;
      out.modulesCount = null;
    }
  } catch (err) {
    out.error = `Safe ABI read failed: ${err?.shortMessage || err?.message || err}`;
    out.hygiene = {
      grade: "ERROR",
      reason: "could not call getThreshold/getOwners",
    };
  }

  return out;
}

async function tryPendingQueue(chainId, safeAddress) {
  try {
    const SafeApiKit = (await import("@safe-global/api-kit")).default;
    const apiKit = new SafeApiKit({ chainId: BigInt(chainId) });
    const pending = await apiKit.getPendingTransactions(safeAddress);
    return {
      available: true,
      count: pending?.results?.length ?? 0,
      results: (pending?.results ?? []).slice(0, 10).map((tx) => ({
        safeTxHash: tx.safeTxHash,
        to: tx.to,
        value: tx.value,
        nonce: tx.nonce,
        confirmationsRequired: tx.confirmationsRequired,
        confirmations: tx.confirmations?.length ?? 0,
        isExecuted: tx.isExecuted,
      })),
    };
  } catch (err) {
    return {
      available: false,
      count: null,
      error: String(err?.message || err).slice(0, 240),
    };
  }
}

function printHuman(report) {
  console.log("=== QPF Safe Local Diagnostic (READ ONLY, multi-chain) ===");
  console.log(`Policy: ${report.policy.mode} | minSecureThreshold=${report.policy.minSecureThreshold}`);
  console.log(`Time: ${report.inspectedAtUtc}`);
  console.log("");

  for (const s of report.safes) {
    console.log(`--- ${s.label} ---`);
    console.log(`Network:   ${s.networkName} (chainId ${s.chainId})`);
    console.log(`Safe UI:   ${s.safeUiHint}`);
    console.log(`Address:   ${s.address}`);
    console.log(`Role:      ${s.role}`);
    if (s.error) {
      console.log(`ERROR:     ${s.error}`);
      console.log("");
      continue;
    }
    console.log(
      `Threshold: ${s.threshold} / ${s.ownerCount}  [${s.hygiene?.grade}] ${s.hygiene?.reason || ""}`,
    );
    console.log(`Nonce:     ${s.nonce}`);
    console.log(`Version:   ${s.version ?? "n/a"}`);
    console.log(`Guard:     ${s.guardEnabled ? s.guard : "none"}`);
    console.log(
      `Modules:   ${s.modulesCount == null ? "n/a" : s.modulesCount}`,
    );
    console.log("Owners:");
    for (const o of s.owners || []) {
      const kind = s.ownerCodePresence?.[o] || "?";
      console.log(`  - ${o}  (${kind})`);
    }
    if (s.configNotes) console.log(`Note:      ${s.configNotes}`);
    if (s.pending) {
      if (s.pending.available) {
        console.log(`Pending queue: ${s.pending.count} (via Safe API Kit)`);
      } else {
        console.log(
          `Pending queue: unavailable (${s.pending.error || "no tx service"})`,
        );
      }
    }
    console.log("");
  }

  if (report.hygieneSummary) {
    console.log("=== Hygiene summary ===");
    for (const line of report.hygieneSummary) console.log(line);
  }

  console.log("");
  console.log(
    "Reminder: eth: and og:/aristotle Safes do not share threshold state. Do not sign pending txs on WEAK Safes.",
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const minSecure = Number(
    process.env.MIN_SECURE_THRESHOLD || config.policy.minSecureThreshold,
  );

  const report = {
    inspectedAtUtc: new Date().toISOString(),
    policy: {
      ...config.policy,
      minSecureThreshold: minSecure,
    },
    safes: [],
  };

  const providerCache = new Map();

  for (const entry of resolveSafes()) {
    const netKey = resolveNetworkKey(entry);
    const networkDef = getNetworkDef(netKey);
    const rpcUrl = process.env.RPC_URL?.trim() || networkDef.rpcUrl;

    let provider = providerCache.get(rpcUrl);
    if (!provider) {
      provider = new ethers.JsonRpcProvider(rpcUrl, networkDef.chainId);
      providerCache.set(rpcUrl, provider);
    }

    const base = await inspectOne(provider, entry, networkDef, minSecure);

    if (process.env.SAFE_USE_API_KIT === "1") {
      base.pending = await tryPendingQueue(networkDef.chainId, entry.address);
    } else {
      base.pending = {
        available: false,
        count: null,
        error:
          "skipped (set SAFE_USE_API_KIT=1 to attempt Transaction Service)",
      };
    }

    report.safes.push(base);
  }

  if (args.hygiene) {
    report.hygieneSummary = report.safes.map((s) => {
      const grade = s.hygiene?.grade || "ERROR";
      const t =
        s.threshold != null ? `${s.threshold}/${s.ownerCount}` : "n/a";
      return `[${grade}] ${s.networkName || s.network} ${s.address} ${t} — ${s.hygiene?.reason || s.error || ""}`;
    });
  }

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHuman(report);
  }

  const weak = report.safes.some(
    (s) => s.hygiene?.grade === "WEAK" || s.hygiene?.grade === "ERROR",
  );
  process.exitCode = weak ? 2 : 0;
}

main().catch((err) => {
  console.error("inspect-safe failed:", err);
  process.exit(1);
});
