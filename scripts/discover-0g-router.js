import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.OG_RPC_URL || "https://evmrpc.0g.ai";
const EXPECTED_CHAIN_ID = 16661n;

const candidates = [
  process.env.OINIO_ROUTER_ADDRESS || "",
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
].filter(Boolean);

async function main() {
  console.log("=== 0G Aristotle router discovery ===");
  console.log("Mode: READ ONLY — no transactions will be sent\n");

  const provider = new ethers.JsonRpcProvider(RPC_URL, Number(EXPECTED_CHAIN_ID));
  const network = await provider.getNetwork();

  console.log(`RPC URL: ${RPC_URL}`);
  console.log(`Detected chainId: ${network.chainId}`);
  console.log(`Expected chainId: ${EXPECTED_CHAIN_ID}\n`);

  if (network.chainId !== EXPECTED_CHAIN_ID) {
    throw new Error(`Wrong chain: expected ${EXPECTED_CHAIN_ID}, got ${network.chainId}`);
  }

  for (const address of candidates) {
    console.log(`Candidate: ${address}`);

    if (!ethers.isAddress(address)) {
      console.log("  valid address: NO\n");
      continue;
    }

    const code = await provider.getCode(address);
    const hasCode = code !== "0x";
    console.log(`  valid address: YES`);
    console.log(`  bytecode present: ${hasCode ? "YES" : "NO"}`);

    if (hasCode) {
      console.log(`  bytecode bytes: ${(code.length - 2) / 2}`);
      console.log(`  bytecode hash: ${ethers.keccak256(code)}`);
    } else {
      console.log("  verdict: reject — no contract bytecode on 0G Aristotle");
    }

    if (address.toLowerCase() === "0x7a250d5630b4cf539739df2c5dacb4c659f2488d") {
      console.log("  warning: this is Ethereum Uniswap V2 Router02; do not use unless bytecode is proven on 0G.");
    }

    console.log("");
  }

  console.log("✅ Discovery complete. No transactions were sent.");
}

main().catch((err) => {
  console.error("\n❌ Router discovery failed:");
  console.error(err.message || err);
  process.exit(1);
});
