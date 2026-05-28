import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.OG_RPC_URL || "https://evmrpc.0g.ai";
const EXPECTED_CHAIN_ID = 16661n;
const ARTIFACT_PATH = "./artifacts/src/OINIO.sol/OINIO.json";
const MANIFEST_PATH = "./cache/deployment-manifest.json";
const INITIAL_SUPPLY = ethers.parseUnits("1000000000", 18);
const ROUTER_ADDRESS = process.env.OINIO_ROUTER_ADDRESS || "";

async function main() {
  console.log("=== OINIO 0G Aristotle deploy preflight ===");
  console.log("Mode: READ ONLY — no transactions will be sent\n");

  if (!fs.existsSync(ARTIFACT_PATH)) {
    throw new Error(`Missing artifact: ${ARTIFACT_PATH}. Run: npx hardhat compile`);
  }

  const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));
  if (!artifact.abi || !artifact.bytecode || artifact.bytecode === "0x") {
    throw new Error("Artifact missing abi or bytecode");
  }

  const bytecodeHash = ethers.keccak256(artifact.bytecode);

  const provider = new ethers.JsonRpcProvider(RPC_URL, Number(EXPECTED_CHAIN_ID));
  const network = await provider.getNetwork();

  console.log(`RPC URL: ${RPC_URL}`);
  console.log(`Detected chainId: ${network.chainId}`);
  console.log(`Expected chainId: ${EXPECTED_CHAIN_ID}`);

  if (network.chainId !== EXPECTED_CHAIN_ID) {
    throw new Error(`Wrong chain: expected ${EXPECTED_CHAIN_ID}, got ${network.chainId}`);
  }

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set. Preflight needs it only to derive deployer address and estimate deployment.");
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const balance = await provider.getBalance(wallet.address);
  const feeData = await provider.getFeeData();

  console.log(`Deployer: ${wallet.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} 0G`);
  console.log(`RPC gasPrice: ${feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") : "unavailable"} gwei`);
  console.log(`Artifact bytecode hash: ${bytecodeHash}`);

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const deployTx = await factory.getDeployTransaction(INITIAL_SUPPLY);
  const estimatedGas = await provider.estimateGas({
    ...deployTx,
    from: wallet.address
  });

  const gasPrice = feeData.gasPrice ?? ethers.parseUnits("11", "gwei");
  const estimatedCost = estimatedGas * gasPrice;

  console.log(`Initial supply: ${ethers.formatUnits(INITIAL_SUPPLY, 18)} OINIO`);
  console.log(`Estimated deploy gas: ${estimatedGas.toString()}`);
  console.log(`Estimated deploy cost: ${ethers.formatEther(estimatedCost)} 0G`);

  if (balance < estimatedCost) {
    throw new Error("Insufficient balance for estimated deploy cost");
  }

  let routerCodeHash = "";
  if (ROUTER_ADDRESS) {
    if (!ethers.isAddress(ROUTER_ADDRESS)) {
      throw new Error(`Invalid OINIO_ROUTER_ADDRESS: ${ROUTER_ADDRESS}`);
    }

    const routerCode = await provider.getCode(ROUTER_ADDRESS);
    console.log(`Router candidate: ${ROUTER_ADDRESS}`);
    console.log(`Router bytecode present: ${routerCode !== "0x" ? "YES" : "NO"}`);

    if (routerCode === "0x") {
      throw new Error("Router candidate has no bytecode on 0G Aristotle");
    }

    routerCodeHash = ethers.keccak256(routerCode);
    console.log(`Router bytecode hash: ${routerCodeHash}`);
  } else {
    console.log("Router candidate: not set");
    console.log("Manifest will be generated without router setup. Live deploy will skip router configuration unless an EVM router is configured and proven.");
  }

  fs.mkdirSync("./cache", { recursive: true });

  const manifest = {
    timestamp: new Date().toISOString(),
    mode: "read-only-preflight",
    rpcUrl: RPC_URL,
    chainId: network.chainId.toString(),
    expectedChainId: EXPECTED_CHAIN_ID.toString(),
    deployer: wallet.address,
    artifactPath: ARTIFACT_PATH,
    artifactBytecodeHash: bytecodeHash,
    initialSupplyWei: INITIAL_SUPPLY.toString(),
    initialSupplyTokens: ethers.formatUnits(INITIAL_SUPPLY, 18),
    estimatedGas: estimatedGas.toString(),
    gasPriceWei: gasPrice.toString(),
    estimatedCostWei: estimatedCost.toString(),
    routerAddress: ROUTER_ADDRESS,
    routerCodeHash
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✅ Manifest generated at ${MANIFEST_PATH}`);
  console.log("✅ Preflight passed. No transactions were sent.");
}

main().catch((err) => {
  console.error("\n❌ Preflight failed:");
  console.error(err.message || err);
  process.exit(1);
});
