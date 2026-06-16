const fs = require("fs");
const ethers = require("ethers");
const SELECTION = "receipts/execution/v2-first-pair-final-execution-command-selection-v1.json";
const OUT = "receipts/execution/v2-first-pair-final-live-prebroadcast-probe-v1.json";
const RPC = "https://evmrpc.0g.ai";
const factoryAbi = ["function getPair(address,address) view returns (address)"];
async function main(){
  const selection = JSON.parse(fs.readFileSync(SELECTION, "utf8"));
  const provider = new ethers.JsonRpcProvider(RPC);
  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();
  const factory = new ethers.Contract(selection.selectedTransaction.target, factoryAbi, provider);
  const tokenA = "0xD1De4F87C8b195f21254b7163dDA9370D8Df593d";
  const tokenB = "0x1f3aa82227281ca364bfb3d253b0f1af1da6473e";
  const getPair = await factory.getPair(tokenA, tokenB);
  const factoryCode = await provider.getCode(selection.selectedTransaction.target);
  const tokenACode = await provider.getCode(tokenA);
  const tokenBCode = await provider.getCode(tokenB);
  const pairExists = getPair !== "0x0000000000000000000000000000000000000000";
  if (Number(network.chainId) !== 16661) throw new Error("wrong chainId: " + network.chainId.toString());
  if (pairExists) throw new Error("pair already exists: " + getPair);
  const receipt = { schema:"qpf.v2.first-pair-final-live-prebroadcast-probe.v1", status:"FINAL_LIVE_PREFLIGHT_READY_NO_BROADCAST", network:"0G Aristotle Mainnet", chainId:Number(network.chainId), rpcUrl:RPC, observedBlockNumber:blockNumber, selectedCommandHash:selection.selectedTransaction.commandHash, selectionHash:selection.selectionHash, factory:selection.selectedTransaction.target, tokenA, tokenB, liveFactoryGetPair:getPair, pairExists, codePresent:{ factory:factoryCode !== "0x", tokenA:tokenACode !== "0x", tokenB:tokenBCode !== "0x" }, boundaries:{ privateKeyUsed:false, broadcast:false, approvals:false, transfers:false, liquidityAdded:false, createPairCalled:false, feeToMutation:false }, generatedAt:new Date().toISOString() };
  fs.writeFileSync(OUT, JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify(receipt, null, 2));
}
main().catch(e => { console.error("FINAL_LIVE_PREFLIGHT_FAILED", e.message); process.exit(1); });
