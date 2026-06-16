const fs = require("fs");
const p = "receipts/governance/liquidity-readiness-preflight-v1.json";
function fail(m){ console.error("FAIL liquidity-readiness-preflight-v1:", m); process.exit(1); }
if (!fs.existsSync(p)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(p, "utf8"));
if (r.schema !== "qpf.governance.liquidity-readiness-preflight.v1") fail("bad schema");
if (r.status !== "LIQUIDITY_READINESS_PREFLIGHT_READ_ONLY_COMPLETE") fail("bad status");
for (const x of ["0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8","0x2c70129E50BF88eCD59b89d63af2e8920aCF3951","0xD1De4F87C8b195f21254b7163dDA9370D8Df593d","0x1f3aa82227281ca364bfb3d253b0f1af1da6473e","0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE"]) {
  if (!JSON.stringify(r).includes(x)) fail("missing " + x);
}
if (r.factoryPairMatches !== true) fail("factory pair mismatch");
for (const k of ["privateKeyUsed","broadcast","approvals","transfers","liquidityAdded","routerMutation","factoryMutation"]) {
  if (r.boundary[k] !== false) fail("boundary not false: " + k);
}
console.log("PASS liquidity-readiness-preflight-v1");
