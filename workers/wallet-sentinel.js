require('dotenv').config();
const { Queue } = require('bullmq');
const { ethers } = require('ethers');

// Sovereign Wallet Sentinel - The Ear of the Forge
// Watches your wallet. Listens on-chain. No external services.

const resonanceQueue = new Queue('resonance-events', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Your wallet address - full canonical address
const WALLET_ADDRESS = '0x35360aE7B90597d7A30A3F615cB5a2D7E7E9cCd';

// Public RPC endpoint - replace with your own node for full sovereignty
const RPC_URL = process.env.ETH_RPC_URL || 'https://rpc.ankr.com/eth';

const provider = new ethers.JsonRpcProvider(RPC_URL);

let lastCheckedBlock = null;

async function scheduleResonance(rawEvent, source) {
  await resonanceQueue.add('wallet-pulse', {
    source: source,
    raw: rawEvent,
    timestamp: new Date().toISOString()
  });
}

// Poll for new transactions involving your address
async function checkWalletTransactions() {
  try {
    const currentBlock = await provider.getBlockNumber();
    
    if (!lastCheckedBlock) {
      lastCheckedBlock = currentBlock - 10; // start from recent blocks
      console.log(`🛡️ Wallet Sentinel initialized at block ${currentBlock}`);
    }

    // Get blocks since last check (lightweight incremental scan)
    for (let blockNum = lastCheckedBlock + 1; blockNum <= currentBlock; blockNum++) {
      const block = await provider.getBlock(blockNum, true); // include transactions

      if (!block || !block.transactions) continue;

      for (const tx of block.transactions) {
        const isRelevant = 
          tx.from.toLowerCase() === WALLET_ADDRESS.toLowerCase() ||
          (tx.to && tx.to.toLowerCase() === WALLET_ADDRESS.toLowerCase());

        if (isRelevant) {
          const action = tx.to ? 'Contract Interaction / Transfer' : 'Deployment or Special Tx';
          const value = tx.value ? ethers.formatEther(tx.value) + ' ETH' : '0 ETH';

          const rawEvent = `Wallet ${WALLET_ADDRESS} executed transaction ${tx.hash.substring(0, 10)}... 
Action: ${action} | Value: ${value} | To: ${tx.to || 'Contract Creation'}`;

          await scheduleResonance(rawEvent, 'wallet-pulse');
          console.log(`🛡️ Wallet Sentinel detected tx: ${tx.hash.substring(0, 12)}...`);
        }
      }
    }

    lastCheckedBlock = currentBlock;
  } catch (err) {
    console.error('Wallet Sentinel error (continuing):', err.message);
  }
}

// Start polling (every 45 seconds - aligned with sovereign frequency)
console.log(`\n🛡️ SOVEREIGN WALLET SENTINEL ACTIVATED`);
console.log(`   Monitoring address: ${WALLET_ADDRESS}`);
console.log(`   RPC Endpoint: ${RPC_URL}`);
console.log(`   Poll interval: 45 seconds`);
console.log(`   Fully local. No tracking. Sovereign.\n`);

setInterval(checkWalletTransactions, 45 * 1000);

// Run once immediately
checkWalletTransactions();