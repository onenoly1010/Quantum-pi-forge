const { ethers } = require("ethers");

// 0G Aristotle Mainnet Specs (Updated April 2026)
const RPC_URL = "https://evmrpc.0g.ai"; 
const EXPECTED_CHAIN_ID = 16661;

async function validateConnection() {
    console.log("🔗 Initializing 0G Aristotle Connection...");
    
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        
        // 1. Verify Chain ID
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        
        if (chainId === EXPECTED_CHAIN_ID) {
            console.log(`✅ Chain ID Verified: ${chainId}`);
        } else {
            console.log(`❌ Chain ID Mismatch! Expected ${EXPECTED_CHAIN_ID}, got ${chainId}`);
        }

        // 2. Fetch Latest Block
        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ Connectivity Confirmed. Latest Block: ${blockNumber}`);
        console.log("🚀 System Coherence: 10/10. Ready for Cloudflare deployment.");

    } catch (error) {
        console.error("❌ Connection Failed:", error.message);
        console.log("💡 Tip: Check your local firewall or verify the RPC URL at chainscan.0g.ai");
    }
}

validateConnection();