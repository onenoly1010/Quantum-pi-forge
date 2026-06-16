const fs = require("fs");
const p = "receipts/governance/liquidity-approval-command-hash-blocked-v1.json";
function fail(m){ console.error("FAIL liquidity-approval-command-hash-blocked-v1:", m); process.exit(1); }
if (!fs.existsSync(p)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(p, "utf8"));
const body = JSON.stringify(r);
if (r.schema !== "qpf.governance.liquidity-approval-command-hash-blocked.v1") fail("bad schema");
if (r.status !== "APPROVAL_COMMAND_HASH_BLOCKED_UNTIL_FUNDED") fail("bad status");
for (const x of ["Owner W0G balance is zero","Owner USDC.e balance is zero","Exact intended approval amounts are not known","Approval command hash must not be generated from zero balances or guessed amounts"]) {
  if (!body.includes(x)) fail("missing blocking reason: " + x);
}
for (const x of ["No private key use","No broadcast","No approvals","No transfers","No liquidity added","No router mutation","No factory mutation"]) {
  if (!body.includes(x)) fail("missing explicit non-goal: " + x);
}
for (const k of ["privateKeyUsed","broadcast","approvals","transfers","liquidityAdded","routerMutation","factoryMutation"]) {
  if (!r.boundary || r.boundary[k] !== false) fail("boundary not false: " + k);
}
console.log("PASS liquidity-approval-command-hash-blocked-v1");
