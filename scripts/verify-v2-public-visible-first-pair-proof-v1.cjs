const fs = require("fs");
const r = JSON.parse(fs.readFileSync("receipts/execution/v2-first-pair-final-state-seal-v1.json", "utf8"));
const files = ["deploy/index.html", "out/index.html"];
for (const file of files) {
  const h = fs.readFileSync(file, "utf8");
  for (const x of [r.status, r.factory, r.pairAddress, r.txHash, String(r.txBlockNumber), String(r.observedBlockNumber), "sealed-first-dex-pair-proof"]) {
    if (!h.includes(x)) {
      console.error(`missing ${x} in ${file}`);
      process.exit(1);
    }
  }
}
console.log("PASS v2-public-visible-first-pair-proof-v1");
