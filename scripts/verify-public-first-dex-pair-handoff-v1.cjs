const fs = require("fs");
const r = JSON.parse(fs.readFileSync("receipts/governance/public-first-dex-pair-handoff-v1.json", "utf8"));
const d = fs.readFileSync("docs/deployments/public-first-dex-pair-handoff-v1.md", "utf8");
for (const x of ["PUBLIC_FIRST_DEX_PAIR_HANDOFF_READY", r.liveUrl, r.pair, r.factory, r.txHash, "No private key use", "No liquidity added"]) {
  if (!d.includes(x) && !JSON.stringify(r).includes(x)) {
    console.error("missing handoff value:", x);
    process.exit(1);
  }
}
if (r.boundary.privateKeyUsed || r.boundary.broadcast || r.boundary.approvals || r.boundary.transfers || r.boundary.liquidityAdded || r.boundary.factoryMutation) process.exit(1);
console.log("PASS public-first-dex-pair-handoff-v1");
