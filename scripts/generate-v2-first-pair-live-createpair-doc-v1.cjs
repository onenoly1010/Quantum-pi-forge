const fs = require("fs");
const r = JSON.parse(fs.readFileSync("receipts/execution/v2-first-pair-live-createpair-execution-v1.json", "utf8"));
const p = "docs/deployments/0g-dex-first-pair-live-createpair-execution-v1.md";
const lines = [
  "# 0G DEX First Pair Live createPair Execution v1",
  "",
  "Status: LIVE_CREATEPAIR_EXECUTED",
  "",
  "## Result",
  "",
  "- Network: " + r.network,
  "- Chain ID: " + r.chainId,
  "- Factory: " + r.factory,
  "- Token A: " + r.tokenA,
  "- Token B: " + r.tokenB,
  "- Transaction hash: " + r.txHash,
  "- Transaction block: " + r.txBlockNumber,
  "- Pair address: " + r.pairAddress,
  "- Gas used: " + r.gasUsed,
  "",
  "## Boundary",
  "",
  "This execution called only Factory.createPair(W0G, USDC.e). It did not approve tokens, transfer tokens, add liquidity, or mutate feeTo.",
  "",
  "## Post-Execution State",
  "",
  "The pair address is now nonzero and must be used for any future liquidity or routing documentation."
];
fs.writeFileSync(p, lines.join("\n") + "\n");
