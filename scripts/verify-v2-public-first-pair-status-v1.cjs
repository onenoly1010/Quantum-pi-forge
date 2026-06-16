const fs = require("fs");
const receipt = JSON.parse(fs.readFileSync("receipts/execution/v2-first-pair-final-state-seal-v1.json", "utf8"));
const html = fs.readFileSync("deploy/index.html", "utf8");
const required = [
  receipt.status,
  receipt.factory,
  receipt.pairAddress,
  receipt.txHash,
  String(receipt.txBlockNumber),
  String(receipt.observedBlockNumber),
  "FORGE_FIRST_PAIR_FINAL_STATE_SEAL",
  "FORGE_DEX_FACTORY_ADDRESS",
  "FORGE_LIQUIDITY_PAIR_ADDRESS"
];
const missing = required.filter(x => !html.includes(x));
if (missing.length) {
  console.error("Missing public first-pair status values:", missing);
  process.exit(1);
}
console.log("PASS v2-public-first-pair-status-v1");
