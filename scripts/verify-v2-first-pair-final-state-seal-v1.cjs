const fs = require("fs");
const p = "receipts/execution/v2-first-pair-final-state-seal-v1.json";
function fail(m){ console.error("FAIL v2-first-pair-final-state-seal-v1:", m); process.exit(1); }
if (!fs.existsSync(p)) fail("missing final state seal receipt");
const r = JSON.parse(fs.readFileSync(p, "utf8"));
if (r.schema !== "qpf.v2.first-pair-final-state-seal.v1") fail("bad schema");
if (r.status !== "FIRST_PAIR_FINAL_STATE_SEALED") fail("bad status");
if (r.chainId !== 16661) fail("bad chainId");
if (r.factory !== "0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8") fail("bad factory");
if (r.tokenA !== "0xD1De4F87C8b195f21254b7163dDA9370D8Df593d") fail("bad tokenA");
if (r.tokenB !== "0x1f3aa82227281ca364bfb3d253b0f1af1da6473e") fail("bad tokenB");
if (r.pairAddress !== "0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE") fail("bad pair address");
if (String(r.liveFactoryGetPair).toLowerCase() !== String(r.pairAddress).toLowerCase()) fail("live getPair mismatch");
if (r.pairConfirmed !== true) fail("pair not confirmed");
for (const k of ["privateKeyUsed","broadcast","approvals","transfers","liquidityAdded","createPairCalled","feeToMutation"]) if (r.boundaries[k] !== false) fail("boundary not false: " + k);
console.log("PASS v2-first-pair-final-state-seal-v1");
