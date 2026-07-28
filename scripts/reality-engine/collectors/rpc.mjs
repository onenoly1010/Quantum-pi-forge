/**
 * RPC collector — chain, block, dual contract sets, watch balances (labeled).
 * Read-only. Never invents endpoints.
 */
import {
  ethBlockNumber,
  ethCall,
  ethChainId,
  ethGetBalance,
  ethGetCode,
  SIG,
  codeMeta,
  decodeAddress,
  weiToEthString,
} from "../lib/rpc.mjs";
import { sha256Json, utcStamp } from "../lib/io.mjs";

function normalizeWatchEntry(entry) {
  if (typeof entry === "string") {
    return { label: entry, address: entry, role: null, gas_critical: false };
  }
  if (entry && typeof entry === "object" && entry.address) {
    return {
      label: entry.label || entry.address,
      address: entry.address,
      role: entry.role || null,
      gas_critical: !!entry.gas_critical,
    };
  }
  return null;
}

async function probeContract(rpcUrl, name, address) {
  const entry = {
    name,
    address: address.toLowerCase(),
    status: "PASS",
    has_code: false,
    code_bytes: 0,
    code_sha256: null,
    owner: null,
    owner_status: null,
    error: null,
  };
  try {
    const code = await ethGetCode(rpcUrl, address);
    Object.assign(entry, codeMeta(code));
    if (!entry.has_code) {
      entry.status = "FAIL";
      entry.owner_status = "NO_CODE";
      return entry;
    }
    try {
      const raw = await ethCall(rpcUrl, address, SIG["owner()"]);
      entry.owner = decodeAddress(raw);
      entry.owner_status = entry.owner ? "OK" : "EMPTY";
    } catch (e) {
      entry.owner_status = "NOT_OWNABLE_OR_REVERT";
      entry.owner_error = String(e.message || e).slice(0, 200);
    }
  } catch (e) {
    entry.status = "UNAVAILABLE";
    entry.error = String(e.message || e).slice(0, 300);
  }
  return entry;
}

async function probeRegistryBinding(rpcUrl, registry, getterSig) {
  const out = {
    registry: registry.toLowerCase(),
    getter: getterSig,
    token: null,
    status: "PASS",
    error: null,
  };
  try {
    const sel = SIG[getterSig];
    if (!sel) {
      out.status = "FAIL";
      out.error = `unknown selector for ${getterSig}`;
      return out;
    }
    const raw = await ethCall(rpcUrl, registry, sel);
    out.token = decodeAddress(raw);
    if (!out.token) {
      out.status = "FAIL";
      out.error = "empty token address";
    }
  } catch (e) {
    out.status = "UNAVAILABLE";
    out.error = String(e.message || e).slice(0, 300);
  }
  return out;
}

export async function collectRpc(expected) {
  const timestamp = utcStamp();
  const rpcUrl = expected.chain.rpc_url;
  const expectedChainId = expected.chain.chain_id;
  const gasWarnWei = BigInt(expected.gas_warn_wei || "1000000000000000"); // 0.001 native default

  const base = {
    source: "rpc",
    collector: "rpc",
    timestamp,
    rpc_url: rpcUrl,
    rpc_url_source: expected.chain.rpc_url_source || "expected-config",
    status: "PASS",
    chainId: null,
    block: null,
    chain_ok: false,
    contracts: {},
    bindings: {},
    balances: [],
    gas_alerts: [],
    errors: [],
  };

  try {
    base.chainId = await ethChainId(rpcUrl);
    base.block = await ethBlockNumber(rpcUrl);
    base.chain_ok = base.chainId === expectedChainId;
    if (!base.chain_ok) {
      base.status = "FAIL";
      base.errors.push(
        `chainId measured ${base.chainId} != expected ${expectedChainId}`,
      );
    }
  } catch (e) {
    base.status = "UNAVAILABLE";
    base.errors.push(String(e.message || e).slice(0, 300));
    base.payload_sha256 = sha256Json(base);
    return base;
  }

  for (const [setKey, set] of Object.entries(expected.contracts || {})) {
    const setOut = { label: set.label || setKey, roles: {} };
    for (const role of ["token", "registry", "heartbeat"]) {
      if (!set[role]) continue;
      setOut.roles[role] = await probeContract(rpcUrl, `${setKey}.${role}`, set[role]);
    }
    base.contracts[setKey] = setOut;

    if (set.registry && set.registry_token_getter) {
      base.bindings[setKey] = await probeRegistryBinding(
        rpcUrl,
        set.registry,
        set.registry_token_getter,
      );
      if (base.bindings[setKey].token && set.token) {
        const match =
          base.bindings[setKey].token.toLowerCase() === set.token.toLowerCase();
        base.bindings[setKey].matches_expected_token = match;
        if (!match) {
          base.bindings[setKey].status = "DRIFT";
          base.status = base.status === "UNAVAILABLE" ? base.status : "DRIFT";
        }
      }
    }
  }

  const watch = Array.isArray(expected.watch_balances) ? expected.watch_balances : [];
  for (const raw of watch) {
    const w = normalizeWatchEntry(raw);
    if (!w || !/^0x[a-fA-F0-9]{40}$/.test(w.address)) continue;
    try {
      const wei = await ethGetBalance(rpcUrl, w.address);
      const entry = {
        label: w.label,
        address: w.address.toLowerCase(),
        role: w.role,
        gas_critical: w.gas_critical,
        wei: wei.toString(),
        native: weiToEthString(wei),
        status: "PASS",
        low_gas: wei < gasWarnWei,
      };
      if (entry.low_gas && w.gas_critical) {
        entry.status = "LOW_GAS";
        base.gas_alerts.push({
          label: w.label,
          address: entry.address,
          native: entry.native,
          wei: entry.wei,
          warn_wei: gasWarnWei.toString(),
        });
      }
      base.balances.push(entry);
    } catch (e) {
      base.balances.push({
        label: w.label,
        address: w.address.toLowerCase(),
        role: w.role,
        gas_critical: w.gas_critical,
        status: "UNAVAILABLE",
        error: String(e.message || e).slice(0, 200),
      });
    }
  }

  if (base.gas_alerts.length && base.status === "PASS") {
    base.status = "LOW_GAS";
  }

  for (const set of Object.values(base.contracts)) {
    for (const role of Object.values(set.roles || {})) {
      if (role.status === "FAIL" || role.status === "UNAVAILABLE") {
        if (base.status === "PASS" || base.status === "LOW_GAS") base.status = role.status;
      }
    }
  }

  base.payload_sha256 = sha256Json({
    chainId: base.chainId,
    block: base.block,
    contracts: base.contracts,
    bindings: base.bindings,
    balances: base.balances.map((b) => ({
      address: b.address,
      wei: b.wei,
      status: b.status,
    })),
  });
  return base;
}
