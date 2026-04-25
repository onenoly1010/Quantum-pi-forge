import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Starting DIRECT deployment to 0G Aristotle Mainnet");
  console.log("====================================================\n");

  // Connect to network
  const provider = new ethers.JsonRpcProvider("https://rpc-aristotle.0g.ai", 16661);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log(`✅ Deployer address: ${wallet.address}`);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
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

  // Read compiled contract bytecode and ABI
  const contractArtifact = JSON.parse(fs.readFileSync("./artifacts/src/OINIO.sol/OINIO.json", "utf8"));
  
  // Deploy contract
  console.log("📤 Deploying OINIO.sol contract...");
  const factory = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, wallet);
  const oinio = await factory.deploy(INITIAL_SUPPLY, {
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
  await provider.waitForTransaction(deployTxHash, 2);
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
  console.log("\n✅ OINIO contract is LIVE on 0G Aristotle Mainnet");
  console.log("✅ Forge has been activated successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });