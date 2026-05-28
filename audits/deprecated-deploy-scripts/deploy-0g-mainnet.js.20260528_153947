import hre from "hardhat";
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting deployment to 0G Aristotle Mainnet");
  console.log("==============================================\n");

  // Get deployer wallet
  const [deployer] = await ethers.getSigners();
  console.log(`✅ Deployer address: ${deployer.address}`);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`✅ Deployer balance: ${ethers.formatEther(balance)} 0G\n`);

  // Deployment parameters
  const GAS_PRICE = ethers.parseUnits("11", "gwei");
  const GAS_LIMIT = 2500000;
  const INITIAL_SUPPLY = ethers.parseUnits("1000000000", 18);
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  console.log(`⚙️  Deployment parameters:`);
  console.log(`   Gas Price: 11 GWEI`);
  console.log(`   Gas Limit: 2,500,000`);
  console.log(`   Initial Supply: 1,000,000,000 OINIO`);
  console.log(`   Router Address: ${ROUTER_ADDRESS}\n`);

  // Deploy contract
  console.log("📤 Deploying OINIO.sol contract...");
  const OINIO = await ethers.getContractFactory("OINIO");
  const oinio = await OINIO.deploy(INITIAL_SUPPLY, {
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT
  });

  await oinio.waitForDeployment();
  const contractAddress = await oinio.getAddress();
  const deployTxHash = oinio.deploymentTransaction().hash;

  console.log(`✅ Contract deployed successfully!`);
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Deployment Hash: ${deployTxHash}\n`);

  // Wait for transaction finality
  console.log("⏳ Waiting for block confirmation...");
  await ethers.provider.waitForTransaction(deployTxHash, 2);
  console.log("✅ Transaction finalized\n");

  // Call setRouter function
  console.log("📤 Initializing router configuration...");
  const setRouterTx = await oinio.setRouter(ROUTER_ADDRESS, {
    gasPrice: GAS_PRICE,
    gasLimit: 100000
  });

  const routerReceipt = await setRouterTx.wait();
  console.log(`✅ Router initialized successfully!`);
  console.log(`   Router Transaction Hash: ${setRouterTx.hash}`);
  console.log(`   Block Number: ${routerReceipt.blockNumber}\n`);

  // Verify router was set correctly
  const verifiedRouter = await oinio.router();
  console.log(`🔍 Verification:`);
  console.log(`   Configured Router: ${verifiedRouter}`);
  console.log(`   Router matches expected: ${verifiedRouter.toLowerCase() === ROUTER_ADDRESS.toLowerCase() ? "✅ YES" : "❌ NO"}\n`);

  console.log("🎉 DEPLOYMENT COMPLETE");
  console.log("==============================================");
  console.log(`Final Contract Address: ${contractAddress}`);
  console.log(`Router Initialization Hash: ${setRouterTx.hash}`);
  console.log("\n✅ OINIO contract is live on 0G Aristotle Mainnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });