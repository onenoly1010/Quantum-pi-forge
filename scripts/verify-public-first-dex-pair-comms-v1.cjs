const fs = require("fs");
const r = JSON.parse(fs.readFileSync("receipts/governance/public-first-dex-pair-comms-v1.json", "utf8"));
for (const x of ["PUBLIC_FIRST_DEX_PAIR_COMMS_GITHUB_POSTED", "https://github.com/onenoly1010/Quantum-pi-forge/pull/328#issuecomment-4714539964", "https://bdde187c.quantumpiforge.pages.dev", "FIRST_PAIR_FINAL_STATE_SEALED", "0x2067319DC61CCdCDc13ABe0c72Ea3D7318AaeE", "0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8"]) {
  if (!JSON.stringify(r).includes(x)) {
    console.error("missing " + x);
    process.exit(1);
  }
}
if (r.boundary.privateKeyUsed || r.boundary.broadcast || r.boundary.approvals || r.boundary.transfers || r.boundary.liquidityAdded || r.boundary.factoryMutation) process.exit(1);
console.log("PASS public-first-dex-pair-comms-v1");
