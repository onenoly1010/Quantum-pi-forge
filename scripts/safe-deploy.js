import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const MANIFEST_PATH = "./cache/deployment-manifest.json";
const LIVE_DEPLOY = process.env.LIVE_DEPLOY === "YES";

async function main() {
  console.log("=== OINIO safe deploy engine ===");
  console.log(`Mode: ${LIVE_DEPLOY ? "LIVE DEPLOY" : "DRY RUN ONLY"}\n`);

  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing manifest: ${MANIFEST_PATH}. Run: node scripts/preflight-0g-deploy.js`);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

  const provider = new ethers.JsonRpcProvider(manifest.rpcUrl, Number(manifest.expectedChainId));
  const network = await provider.getNetwork();

  if (network.chainId.toString() !== manifest.chainId) {
    throw new Error(`Chain mismatch: manifest=${manifest.chainId}, provider=${network.chainId}`);
  }

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  if (wallet.address.toLowerCase() !== manifest.deployer.toLowerCase()) {
    throw new Error(`Deployer mismatch: manifest=${manifest.deployer}, wallet=${wallet.address}`);
  }

  const artifact = JSON.parse(fs.readFileSync(manifest.artifactPath, "utf8"));
  if (!artifact.abi || !artifact.bytecode || artifact.bytecode === "0x") {
    throw new Error("Artifact missing abi or bytecode");
  }

  const bytecodeHash = ethers.keccak256(artifact.bytecode);
  if (bytecodeHash !== manifest.artifactBytecodeHash) {
    throw new Error("Artifact bytecode hash mismatch. Re-run preflight.");
  }

  if (!manifest.routerAddress) {
    throw new Error("Manifest has no routerAddress. Set OINIO_ROUTER_ADDRESS and re-run preflight before live deployment.");
  }

  const routerCode = await provider.getCode(manifest.routerAddress);
  if (routerCode === "0x") {
    throw new Error("Router has no bytecode at live deploy time");
  }

  const routerCodeHash = ethers.keccak256(routerCode);
  if (routerCodeHash !== manifest.routerCodeHash) {
    throw new Error("Router bytecode hash mismatch. Re-run preflight.");
  }

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const deployTx = await factory.getDeployTransaction(BigInt(manifest.initialSupplyWei));
  const estimatedGas = await provider.estimateGas({
    ...deployTx,
    from: wallet.address
  });

  console.log(`RPC URL: ${manifest.rpcUrl}`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log(`Deployer: ${wallet.address}`);
  console.log(`Initial supply: ${manifest.initialSupplyTokens} OINIO`);
  console.log(`Manifest deploy gas: ${manifest.estimatedGas}`);
  console.log(`Current estimated deploy gas: ${estimatedGas.toString()}`);
  console.log(`Router: ${manifest.routerAddress}`);
  console.log(`Artifact hash: ${bytecodeHash}`);
  console.log(`Router hash: ${routerCodeHash}`);

  if (!LIVE_DEPLOY) {
    console.log("\n✅ Dry run passed. No transactions were sent.");
    console.log("To execute live deployment, run exactly:");
    console.log("  LIVE_DEPLOY=YES node scripts/safe-deploy.js");
    return;
  }

  console.log("\n🚀 LIVE_DEPLOY=YES confirmed. Sending deployment transaction...");
  const oinio = await factory.deploy(BigInt(manifest.initialSupplyWei));
  await oinio.waitForDeployment();

  const contractAddress = await oinio.getAddress();
  const deployTxHash = oinio.deploymentTransaction()?.hash || "";

  console.log(`✅ Contract deployed: ${contractAddress}`);
  console.log(`Deployment tx: ${deployTxHash}`);

  console.log(`\n🔗 Sending router initialization: ${manifest.routerAddress}`);
  const setRouterTx = await oinio.setRouter(manifest.routerAddress);
  const setRouterReceipt = await setRouterTx.wait();

  const configuredRouter = await oinio.router();
  if (configuredRouter.toLowerCase() !== manifest.routerAddress.toLowerCase()) {
    throw new Error(`Router verification failed: expected=${manifest.routerAddress}, got=${configuredRouter}`);
  }

  const receipt = {
    timestamp: new Date().toISOString(),
    contractAddress,
    deployTxHash,
    routerAddress: configuredRouter,
    setRouterTxHash: setRouterTx.hash,
    setRouterBlockNumber: setRouterReceipt.blockNumber,
    manifest
  };

  fs.writeFileSync("./cache/deployment-receipt.json", JSON.stringify(receipt, null, 2) + "\n");
  console.log("\n🎉 Deployment and router configuration complete.");
  console.log("Receipt written to ./cache/deployment-receipt.json");
}

main().catch((err) => {
  console.error("\n❌ Safe deploy failed:");
  console.error(err.message || err);
  process.exit(1);
});
