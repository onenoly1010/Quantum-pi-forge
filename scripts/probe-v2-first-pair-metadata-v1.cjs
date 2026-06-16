const { ethers } = require('ethers');
const fs = require('fs');

const RPC_URL = process.env.RPC_URL || 'https://evmrpc.0g.ai';
const TOKEN_B = process.env.TOKEN_B || '';
const CHAIN_ID = 16661;
const W0G = '0xD1De4F87C8b195f21254b7163dDA9370D8Df593d';
const FACTORY = '0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8';
const ROUTER = '0x2c70129E50BF88eCD59b89d63af2e8920aCF3951';
const OUT = 'receipts/execution/v2-first-pair-metadata-probe-v1.json';
const erc20Abi = ['function name() view returns (string)','function symbol() view returns (string)','function decimals() view returns (uint8)'];
const factoryAbi = ['function getPair(address,address) view returns (address)'];
function fail(m){ console.error('FAIL first-pair-metadata-probe-v1:', m); process.exit(1); }
async function readToken(contract){ const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]); return { address: await contract.getAddress(), name, symbol, decimals: Number(decimals) }; }
(async()=>{
  if (ethers.isAddress(TOKEN_B) === false) fail('TOKEN_B must be set to a valid ERC20 address');
  if (TOKEN_B.toLowerCase() === W0G.toLowerCase()) fail('TOKEN_B must differ from W0G');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== CHAIN_ID) fail('unexpected chainId: ' + network.chainId);
  const w0g = new ethers.Contract(W0G, erc20Abi, provider);
  const tokenB = new ethers.Contract(TOKEN_B, erc20Abi, provider);
  const factory = new ethers.Contract(FACTORY, factoryAbi, provider);
  const [tokenAInfo, tokenBInfo, pair] = await Promise.all([readToken(w0g), readToken(tokenB), factory.getPair(W0G, TOKEN_B)]);
  const receipt = { schema: 'qpf.v2.first-pair-metadata-probe.v1', status: 'READ_ONLY_PROBE_COMPLETE_NO_BROADCAST', network: '0G Aristotle Mainnet', chainId: CHAIN_ID, rpcUrl: RPC_URL, factory: FACTORY, router: ROUTER, tokenA: tokenAInfo, tokenB: tokenBInfo, factoryGetPair: pair, pairExists: pair !== ethers.ZeroAddress, boundaries: { privateKeyUsed: false, broadcast: false, approvals: false, transfers: false, liquidityAdded: false, createPairCalled: false, feeToMutation: false }, generatedAt: new Date().toISOString() };
  fs.mkdirSync('receipts/execution', { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
})().catch(e => fail(e && e.message ? e.message : String(e)));
