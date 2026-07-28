/**
 * Safe collector — owners, threshold, nonce, native balance via RPC.
 * Nested owner probe: if an owner has code, measure its Safe views too.
 * Optional Safe Transaction Service only if URL is configured.
 * Read-only. Does not invent Safe addresses or API bases.
 */
import {
  ethCall,
  ethGetBalance,
  ethGetCode,
  ethBlockNumber,
  ethChainId,
  SIG,
  codeMeta,
  decodeAddressArray,
  decodeUint,
  weiToEthString,
} from "../lib/rpc.mjs";
import { sha256Json, utcStamp } from "../lib/io.mjs";

async function fetchPendingIfConfigured(safeTxServiceUrl, safeAddress) {
  if (!safeTxServiceUrl || typeof safeTxServiceUrl !== "string") {
    return {
      status: "NOT_CONFIGURED",
      note: "safe_tx_service_url not set; pending txs not queried (no invented API)",
      results: null,
    };
  }
  const base = safeTxServiceUrl.replace(/\/$/, "");
  const url = `${base}/api/v1/safes/${safeAddress}/multisig-transactions/?executed=false&limit=10`;
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
      return {
        status: "UNAVAILABLE",
        error: `HTTP ${res.status}`,
        url,
        results: null,
      };
    }
    const body = await res.json();
    const results = (body.results || []).map((tx) => ({
      safeTxHash: tx.safeTxHash,
      to: tx.to,
      value: tx.value,
      nonce: tx.nonce,
      isExecuted: tx.isExecuted,
      submissionDate: tx.submissionDate,
    }));
    return { status: "PASS", source: "safe_api", count: results.length, results };
  } catch (e) {
    return {
      status: "UNAVAILABLE",
      error: String(e.message || e).slice(0, 300),
      results: null,
    };
  }
}

async function probeSafeViews(rpcUrl, address, label = null) {
  const entry = {
    address: address.toLowerCase(),
    label,
    has_code: false,
    code_bytes: 0,
    code_sha256: null,
    owners: null,
    threshold: null,
    nonce: null,
    balance_wei: null,
    balance_native: null,
    looks_like_safe: false,
    status: "PASS",
    error: null,
  };
  try {
    const code = await ethGetCode(rpcUrl, address);
    Object.assign(entry, codeMeta(code));
    if (!entry.has_code) {
      entry.status = "EOA_OR_EMPTY";
      entry.looks_like_safe = false;
      const wei = await ethGetBalance(rpcUrl, address);
      entry.balance_wei = wei.toString();
      entry.balance_native = weiToEthString(wei);
      return entry;
    }
    try {
      const ownersRaw = await ethCall(rpcUrl, address, SIG["getOwners()"]);
      entry.owners = decodeAddressArray(ownersRaw);
      const thrRaw = await ethCall(rpcUrl, address, SIG["getThreshold()"]);
      const thr = decodeUint(thrRaw);
      entry.threshold = thr == null ? null : Number(thr);
      const nonceRaw = await ethCall(rpcUrl, address, SIG["nonce()"]);
      const n = decodeUint(nonceRaw);
      entry.nonce = n == null ? null : Number(n);
      entry.looks_like_safe =
        Array.isArray(entry.owners) &&
        entry.owners.length > 0 &&
        entry.threshold != null &&
        entry.threshold > 0;
      if (!entry.looks_like_safe) entry.status = "CODE_NOT_SAFE_VIEWS";
    } catch (e) {
      entry.status = "CODE_NOT_SAFE_VIEWS";
      entry.error = String(e.message || e).slice(0, 200);
    }
    const wei = await ethGetBalance(rpcUrl, address);
    entry.balance_wei = wei.toString();
    entry.balance_native = weiToEthString(wei);
  } catch (e) {
    entry.status = "UNAVAILABLE";
    entry.error = String(e.message || e).slice(0, 300);
  }
  return entry;
}

function compareOwners(expectedOwners, measuredOwners, mode = "exact") {
  if (!Array.isArray(expectedOwners) || !expectedOwners.length) {
    return { status: "SKIP", note: "no expected_owners pin" };
  }
  const exp = expectedOwners.map((a) => a.toLowerCase()).sort();
  const got = [...(measuredOwners || [])].map((a) => a.toLowerCase()).sort();
  if (mode === "subset") {
    const gotSet = new Set(got);
    const missing = exp.filter((a) => !gotSet.has(a));
    return {
      status: missing.length ? "DRIFT" : "PASS",
      mode: "subset",
      expected_subset: exp,
      measured: got,
      missing_expected: missing,
    };
  }
  const match = JSON.stringify(exp) === JSON.stringify(got);
  return {
    status: match ? "PASS" : "DRIFT",
    mode: "exact",
    expected: exp,
    measured: got,
  };
}

export async function collectSafe(expected) {
  const timestamp = utcStamp();
  const rpcUrl = expected.chain.rpc_url;
  const safeCfg = expected.safe || {};
  const address = safeCfg.address;

  const base = {
    source: "safe_rpc",
    collector: "safe",
    timestamp,
    chainId: null,
    block: null,
    safe: address ? String(address).toLowerCase() : null,
    label: safeCfg.label || "Guardian Safe",
    status: "NOT_CONFIGURED",
    owners: null,
    threshold: null,
    nonce: null,
    balance_native: null,
    balance_wei: null,
    has_code: null,
    nested_owners: [],
    nested_architecture: false,
    pending: null,
    expected_compare: null,
    note: null,
    error: null,
  };

  if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) {
    base.note =
      "Guardian Safe address not configured in expected-config (or GUARDIAN_SAFE_ADDRESS). Valid negative reality.";
    base.payload_sha256 = sha256Json(base);
    return base;
  }

  try {
    base.chainId = await ethChainId(rpcUrl);
    base.block = await ethBlockNumber(rpcUrl);

    const root = await probeSafeViews(rpcUrl, address, safeCfg.label || "Guardian Safe");
    base.has_code = root.has_code;
    base.code_bytes = root.code_bytes;
    base.code_sha256 = root.code_sha256;
    base.owners = root.owners;
    base.threshold = root.threshold;
    base.nonce = root.nonce;
    base.balance_wei = root.balance_wei;
    base.balance_native = root.balance_native;

    if (!root.has_code) {
      base.status = "FAIL";
      base.error = "configured Safe address has no code on this chain";
      base.payload_sha256 = sha256Json(base);
      return base;
    }
    if (!root.looks_like_safe) {
      base.status = "FAIL";
      base.error = root.error || "address has code but Safe view methods failed";
      base.payload_sha256 = sha256Json(base);
      return base;
    }

    base.status = "PASS";

    // Nested owner probe
    if (safeCfg.probe_nested_owners !== false && Array.isArray(base.owners)) {
      const labels = safeCfg.nested_labels || {};
      for (const owner of base.owners) {
        const label = labels[owner.toLowerCase()] || null;
        const nested = await probeSafeViews(rpcUrl, owner, label);
        base.nested_owners.push(nested);
        if (nested.looks_like_safe) base.nested_architecture = true;
      }
    }

    // Expected compare
    const ownerCmp = compareOwners(
      safeCfg.expected_owners,
      base.owners,
      safeCfg.expected_owners_mode || "exact",
    );
    const drift = [];
    if (
      safeCfg.expected_threshold != null &&
      base.threshold !== Number(safeCfg.expected_threshold)
    ) {
      drift.push({
        field: "threshold",
        expected: safeCfg.expected_threshold,
        measured: base.threshold,
      });
    }
    if (ownerCmp.status === "DRIFT") {
      drift.push({ field: "owners", ...ownerCmp });
    }
    // Nested Safes F69/F50F should be owners if listed
    if (Array.isArray(safeCfg.expected_owners) && safeCfg.expected_owners_mode === "subset") {
      // already in ownerCmp
    }
    // Flag if docs assume flat but nested_architecture true
    base.expected_compare = {
      status: drift.length ? "DRIFT" : "PASS",
      owner_compare: ownerCmp,
      drift,
      nested_architecture: base.nested_architecture,
    };
    if (drift.length) base.status = "DRIFT";

    base.pending = await fetchPendingIfConfigured(
      safeCfg.safe_tx_service_url,
      address,
    );
  } catch (e) {
    base.status = "UNAVAILABLE";
    base.error = String(e.message || e).slice(0, 400);
  }

  base.payload_sha256 = sha256Json({
    safe: base.safe,
    owners: base.owners,
    threshold: base.threshold,
    nonce: base.nonce,
    balance_wei: base.balance_wei,
    has_code: base.has_code,
    nested_architecture: base.nested_architecture,
    nested_owner_addrs: (base.nested_owners || []).map((n) => n.address),
  });
  return base;
}
