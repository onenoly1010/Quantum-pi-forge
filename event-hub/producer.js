import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Configuration
const WORKER_URL = process.env.WORKER_URL || "http://localhost:8787";
const PUBLISH_TOKEN = process.env.PUBLISH_TOKEN;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL) || 4000;

if (!PUBLISH_TOKEN || !RPC_URL) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  [
    "function totalSupply() view returns (uint256)",
    "function currentRound() view returns (uint256)",
    "function alignmentScore() view returns (uint256)"
  ],
  provider
);

let lastBlock = 0;
let consecutiveErrors = 0;

async function publish(type, data) {
  try {
    await fetch(`${WORKER_URL}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PUBLISH_TOKEN}`
      },
      body: JSON.stringify({ type, data })
    });
  } catch (e) {
    console.error("Failed to publish event:", e.message);
  }
}

async function poll() {
  try {
    const [supply, blockNumber, round, score] = await Promise.all([
      contract.totalSupply().catch(() => 0n),
      provider.getBlockNumber(),
      contract.currentRound().catch(() => 0n),
      contract.alignmentScore().catch(() => 0n)
    ]);

    if (blockNumber === lastBlock) {
      return;
    }

    lastBlock = blockNumber;
    consecutiveErrors = 0;

    await publish("chain:update", {
      totalSupply: Number(ethers.formatEther(supply)),
      blockNumber: blockNumber,
      currentRound: Number(round),
      alignmentScore: Number(score) / 1e18,
      lastBlockTime: Date.now()
    });

    console.log(`[${new Date().toISOString()}] Block #${blockNumber} published`);

  } catch (e) {
    consecutiveErrors++;
    console.error(`Poll error (${consecutiveErrors}):`, e.message);

    await publish("chain:error", {
      error: e.message,
      consecutive: consecutiveErrors,
      timestamp: Date.now()
    });
  }
}

console.log("Starting OINIO RPC Producer");
console.log(`Worker endpoint: ${WORKER_URL}`);
console.log(`Poll interval: ${POLL_INTERVAL}ms`);

// Initial run
poll();

// Start polling loop
setInterval(poll, POLL_INTERVAL);

// Handle shutdown
process.on('SIGINT', () => {
  console.log("Shutting down producer");
  process.exit(0);
});