const fs = require("fs");
const receiptPath = "receipts/execution/v2-first-pair-final-state-seal-v1.json";
const indexPath = "deploy/index.html";
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
let html = fs.readFileSync(indexPath, "utf8");
const pair = receipt.pairAddress;
const factory = receipt.factory;
const status = receipt.status;
const txHash = receipt.txHash;
const txBlock = String(receipt.txBlockNumber);
const observedBlock = String(receipt.observedBlockNumber);
html = html.replace(/const PAIR\s*=\s*"0x[a-fA-F0-9]{40}";/, `const PAIR  = "${pair}";`);
if (!html.includes("FORGE_FIRST_PAIR_FINAL_STATE_SEAL")) {
  html = html.replace(
    /const PAIR\s*=\s*"0x[a-fA-F0-9]{40}";/,
    match => `${match}\n  window.FORGE_FIRST_PAIR_FINAL_STATE_SEAL = ${JSON.stringify({ status, factory, pairAddress: pair, txHash, txBlockNumber: receipt.txBlockNumber, observedBlockNumber: receipt.observedBlockNumber, pairConfirmed: receipt.pairConfirmed })};\n  window.FORGE_DEX_FACTORY_ADDRESS = "${factory}";\n  window.FORGE_LIQUIDITY_PAIR_ADDRESS = "${pair}";`
  );
} else {
  html = html.replace(/window\.FORGE_FIRST_PAIR_FINAL_STATE_SEAL\s*=\s*\{[\s\S]*?\};/, `window.FORGE_FIRST_PAIR_FINAL_STATE_SEAL = ${JSON.stringify({ status, factory, pairAddress: pair, txHash, txBlockNumber: receipt.txBlockNumber, observedBlockNumber: receipt.observedBlockNumber, pairConfirmed: receipt.pairConfirmed })};`);
  html = html.replace(/window\.FORGE_DEX_FACTORY_ADDRESS\s*=\s*"0x[a-fA-F0-9]{40}";/, `window.FORGE_DEX_FACTORY_ADDRESS = "${factory}";`);
  html = html.replace(/window\.FORGE_LIQUIDITY_PAIR_ADDRESS\s*=\s*"0x[a-fA-F0-9]{40}";/, `window.FORGE_LIQUIDITY_PAIR_ADDRESS = "${pair}";`);
}
if (!html.includes("FIRST_PAIR_FINAL_STATE_SEALED")) {
  html = html.replace(
    /<h3 class="text-white font-bold mb-2 text-lg">💧 OINIO DEX<\/h3>/,
    `<h3 class="text-white font-bold mb-2 text-lg">💧 OINIO DEX</h3>\n                    <div class="text-xs font-mono text-emerald-400 mb-2">FIRST_PAIR_FINAL_STATE_SEALED</div>\n                    <div class="text-xs font-mono text-zinc-400 break-all">Factory: ${factory}</div>\n                    <div class="text-xs font-mono text-zinc-400 break-all">Pair: ${pair}</div>\n                    <div class="text-xs font-mono text-zinc-500">CreatePair tx block: ${txBlock} • Observed seal block: ${observedBlock}</div>`
  );
}
fs.writeFileSync(indexPath, html);
console.log(JSON.stringify({ updated: indexPath, status, factory, pairAddress: pair, txHash, txBlockNumber: receipt.txBlockNumber, observedBlockNumber: receipt.observedBlockNumber }, null, 2));
