const fs = require("fs");
const ethers = require("ethers");
const EXEC = "receipts/execution/v2-first-pair-live-createpair-execution-v1.json";
const OUT = "receipts/execution/v2-first-pair-final-state-seal-v1.json";
const RPC = "https://evmrpc.0g.ai";
const abi = ["function getPair(address,address) view returns (address)"];
async function main() {
  const exec = JSON.parse(fs.readFileSync(EXEC, "utf8"));
  const provider = new ethers.JsonRpcProvider(RPC);
  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();
  if (Number(network.chainId) !== 16661) throw new Error("wrong chainId: " + network.chainId.toString());
  const factory = new ethers.Contract(exec.factory, abi, provider);
  const livePair = await factory.getPair(exec.tokenA, exec.tokenB);
  if (String(livePair).toLowerCase() !== String(exec.pairAddress).toLowerCase()) throw new Error("live pair mismatch: " + livePair);
  const receipt = {
    schema: "qpf.v2.first-pair-final-state-seal.v1",
    status: "FIRST_PAIR_FINAL_STATE_SEALED",
    network: "0G Aristotle Mainnet",
    chainId: 16661,
    rpcUrl: RPC,
    observedBlockNumber: blockNumber,
    factory: exec.factory,
    tokenA: exec.tokenA,
    tokenB: exec.tokenB,
    txHash: exec.txHash,
    txBlockNumber: exec.txBlockNumber,
    pairAddress: exec.pairAddress,
    liveFactoryGetPair: livePair,
    pairConfirmed: true,
    boundaries: { privateKeyUsed:false, broadcast:false, approvals:false, transfers:false, liquidityAdded:false, createPairCalled:false, feeToMutation:false },
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(OUT, JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify(receipt, null, 2));
}
main().catch((e) => { console.error("FIRST_PAIR_FINAL_STATE_SEAL_FAILED", e.message); process.exit(1); });
