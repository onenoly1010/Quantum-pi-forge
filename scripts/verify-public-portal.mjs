#!/usr/bin/env node
/**
 * verify-public-portal.mjs
 * Read-only check: live portal + Aristotle RPC against published expectations.
 * Does not sign, broadcast, mint, or open liquidity.
 *
 * Usage: node scripts/verify-public-portal.mjs
 *    or: npm run verify:public-portal
 */

const RPC = process.env.RPC_URL || "https://evmrpc.0g.ai";
const PORTAL =
  process.env.PORTAL_URL || "https://quantumpiforge.com/deployed-addresses";
const STATUS_JSON =
  process.env.STATUS_JSON_URL ||
  "https://quantumpiforge.com/verification-status-v1.json";

const CORE = [
  ["OINIO Token", "0x75995EC0fdf881189850aeD864cB3f43c0DFCb58", 2281],
  ["Model Registry", "0x67aD7169184581f23D1E10B39d4eb4e98293E87a", 9850],
  ["Heartbeat", "0x5E50b92E57e854659f7D98c733088aABd551C49F", 2571],
  ["ForgeRegistry", "0x6011c341a01c80f489a5c3Ab751987A55142F04e", 4132],
  ["DEX Factory", "0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8", 18951],
  ["DEX Router", "0x2c70129E50BF88eCD59b89d63af2e8920aCF3951", 18953],
  ["DEX Pair", "0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE", 14954],
  ["Safe Guardian", "0x8d088B88219D072aB035502065ee2410c2cb4389", 171],
];

const PAIR = "0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE";

async function rpc(method, params) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(JSON.stringify(body.error));
  return body.result;
}

function codeBytes(hex) {
  if (!hex || hex === "0x" || hex === "0x0") return 0;
  return Math.floor((hex.length - 2) / 2);
}

function fail(msg) {
  console.error(`FAIL  ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`OK    ${msg}`);
}

async function main() {
  console.log("QPF public portal verification (read-only)");
  console.log(`RPC    ${RPC}`);
  console.log(`Portal ${PORTAL}`);
  console.log(`Time   ${new Date().toISOString()}`);
  console.log("");

  const chainId = await rpc("eth_chainId", []);
  if (chainId === "0x4115") ok(`chainId ${chainId} (16661)`);
  else fail(`chainId expected 0x4115 got ${chainId}`);

  const portalRes = await fetch(PORTAL, {
    headers: { "user-agent": "qpf-verify-public-portal/1.0" },
  });
  if (!portalRes.ok) fail(`portal HTTP ${portalRes.status}`);
  else ok(`portal HTTP ${portalRes.status}`);
  const html = await portalRes.text();

  for (const needle of [
    "16661",
    "NOT AUTHORIZED",
    "Round 1",
    "0x75995EC0fdf881189850aeD864cB3f43c0DFCb58",
  ]) {
    if (html.includes(needle)) ok(`portal contains ${needle.slice(0, 24)}`);
    else fail(`portal missing ${needle}`);
  }

  for (const [name, addr, expected] of CORE) {
    const code = await rpc("eth_getCode", [addr, "latest"]);
    const n = codeBytes(code);
    const onPage = html.toLowerCase().includes(addr.toLowerCase());
    if (n > 0 && onPage) {
      const sizeNote =
        expected && n === expected ? ` (${n} bytes match registry)` : ` (${n} bytes)`;
      ok(`${name}${sizeNote}`);
    } else {
      fail(`${name}: code_bytes=${n} on_portal=${onPage}`);
    }
  }

  const reserves = await rpc("eth_call", [
    { to: PAIR, data: "0x0902f1ac" },
    "latest",
  ]);
  const zero = /^0x0*$/.test(reserves);
  if (zero) ok("pair reserves empty (liquidity not seeded)");
  else fail(`pair reserves not empty: ${reserves.slice(0, 66)}…`);

  try {
    const stRes = await fetch(STATUS_JSON, {
      headers: { "user-agent": "qpf-verify-public-portal/1.0" },
    });
    if (stRes.ok) {
      const st = await stRes.json();
      if (st?.economic?.public_mint === "NOT_AUTHORIZED") {
        ok("status JSON: public_mint NOT_AUTHORIZED");
      } else {
        fail("status JSON missing economic.public_mint NOT_AUTHORIZED");
      }
      if (st?.phase?.["8_5_status"] === "OPEN") ok("status JSON: 8.5 OPEN");
    } else {
      console.log(`WARN  status JSON HTTP ${stRes.status} (optional until deploy)`);
    }
  } catch (e) {
    console.log(`WARN  status JSON: ${e.message}`);
  }

  console.log("");
  if (process.exitCode) {
    console.log("RESULT: FAIL — see lines above");
    process.exit(1);
  }
  console.log("RESULT: PASS");
  console.log("Economic features remain NOT AUTHORIZED.");
  console.log(
    "File a report: https://github.com/onenoly1010/Quantum-pi-forge/issues/new?title=External%20verification%3A%20YYYY-MM-DD"
  );
}

main().catch((e) => {
  console.error("ERROR", e);
  process.exit(1);
});
