const fs = require("fs");
const p = "receipts/governance/liquidity-funding-plan-v1.json";
function fail(m){ console.error("FAIL liquidity-funding-plan-v1:", m); process.exit(1); }
if (!fs.existsSync(p)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(p, "utf8"));
if (r.status !== "LIQUIDITY_FUNDING_PLAN_REQUIRED_NO_EXECUTION") fail("bad status");
for (const x of ["Fund owner with nonzero W0G","Fund owner with nonzero USDC.e","No broadcast","No approvals","No transfers","No liquidity added"]) {
  if (!JSON.stringify(r).includes(x)) fail("missing " + x);
}
for (const k of ["privateKeyUsed","broadcast","approvals","transfers","liquidityAdded","routerMutation","factoryMutation"]) {
  if (r.boundary[k] !== false) fail("boundary not false: " + k);
}
console.log("PASS liquidity-funding-plan-v1");
