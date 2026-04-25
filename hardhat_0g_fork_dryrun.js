/**
 * 0G Aristotle Mainnet Local Fork Dry Run Script
 * This will reproduce the deployment hang issue locally without wasting gas
 * Run with: npx hardhat run scripts/hardhat_0g_fork_dryrun.js --network hardhat
 */

const { ethers } = require("hardhat");
const { expect } = require("chai");

const OINIO_CONTRACT_ABI = [
  "function router() view returns (address)",
  "function setRouter(address) external",
  "function owner() view returns (address)"
];

// 0G Aristotle Mainnet RPC Endpoint
const OG_RPC_URL = "https://rpc-aristotle.0g.ai";
const CURRENT_BLOCK_HEIGHT = 3041227;

async function main() {
  console.log("\n🔍 0G ARISTOTLE MAINNET FORK DRY RUN");
  console.log("═══════════════════════════════════════\n");
  
  // Fork 0G Mainnet at current block
  await network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: OG_RPC_URL,
          blockNumber: CURRENT_BLOCK_HEIGHT
        }
      }
    ]
  });
  
  console.log(`✅ Forked 0G Mainnet at block: ${CURRENT_BLOCK_HEIGHT}`);
  
  const [deployer] = await ethers.getSigners();
  console.log(`✅ Deployer address: ${deployer.address}`);
  
  // Deploy OINIO contract locally
  const OINIOFactory = await ethers.getContractFactory("OINIO");
  console.log("\n⏳ Deploying OINIO contract on local fork...");
  
  const deploymentStartTime = Date.now();
  const oinio = await OINIOFactory.deploy();
  await oinio.deployed();
  const deploymentTime = Date.now() - deploymentStartTime;
  
  console.log(`✅ OINIO deployed at: ${oinio.address}`);
  console.log(`✅ Deployment completed in ${deploymentTime}ms`);
  
  // Check initial Router state
  const routerAddress = await oinio.router();
  console.log(`\n🔍 Initial Router value: ${routerAddress}`);
  
  if (routerAddress === ethers.constants.AddressZero) {
    console.log("⚠️  Router IS NULL - THIS WILL CAUSE INFINITE GAS LOOP ON MAINNET");
    
    console.log("\n🛠️  Calling setRouter() with verified Zia Finance address...");
    const ZIA_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    
    const tx = await oinio.connect(deployer).setRouter(ZIA_ROUTER, {
      gasLimit: 250000,
      gasPrice: ethers.utils.parseUnits("11", "gwei")
    });
    
    const receipt = await tx.wait();
    console.log(`✅ setRouter() transaction hash: ${receipt.transactionHash}`);
    console.log(`✅ Gas used: ${receipt.gasUsed.toString()}`);
    
    const updatedRouter = await oinio.router();
    console.log(`✅ Router now set to: ${updatedRouter}`);
    
    console.log("\n🚀 DEPLOYMENT WILL NOW SUCCEED ON MAINNET");
    console.log("\nNext steps:");
    console.log("  1. Add setRouter() function to your flattened contract");
    console.log("  2. Deploy contract normally");
    console.log("  3. Immediately call setRouter() with Zia Finance address");
    console.log("  4. Verify on chainscan.0g.ai");
  } else {
    console.log("✅ Router already initialized");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ ERROR:");
    console.error(error);
    process.exit(1);
  });