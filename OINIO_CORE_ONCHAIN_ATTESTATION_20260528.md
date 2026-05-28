# OINIO Core On-Chain Attestation — 2026-05-28

## Network

- Chain: 0G Aristotle L1
- RPC: `https://evmrpc.0g.ai`

## Verified Contract

- OINIO Core: `0x6011c341a01c80f489a5c3Ab751987A55142F04e`

## Verification Results

### Bytecode

`eth_getCode(address, "latest")` returned deployed bytecode.

- Result: `BYTECODE PRESENT`
- Code length chars: `8266`
- Prefix: `0x608060405234801561000f575f5ffd5b50600436`

### ERC-20 Identity

Read-only `eth_call` probes returned:

- `name()`: `OINIO`
- `symbol()`: `OINIO`

### Historical Event Log

`eth_getLogs` found one historical event for the OINIO Core contract.

- Event signature topic: `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`
- Event type: `Transfer(address,address,uint256)`
- Sender topic: zero address
- Interpretation: genesis mint-style token creation event
- Block number: `0x1e65f1a`
- Transaction hash: `0x3d768430ab02659be395afcc116b4c70739f0590dac3b0818da3088d8a104ba9`
- Data: `0x00000000000000000000000000000000000000001963287775ff892a51000000`

## Deprecated / Rejected Addresses

The following addresses returned `NO BYTECODE` under `eth_getCode(address, "latest")` and must not be represented as active production contracts:

- `0x881699a92b26c175b798d6f7b4e3f2a1d5c7b9a6`
- `0x1C3A93bC97675B4C4DF29951bdc7446cd741772b`
- `0x4673f0137Ad734eAd213F908a51E2f93f2721B5C`
- `0x8a56E85A7d46DDE42c2FcCC31eC7283b654f928c`

## Conclusion

The tested on-chain evidence confirms `0x6011c341a01c80f489a5c3Ab751987A55142F04e` as the only verified live OINIO Core contract in this audit set. The contract contains deployed bytecode, responds to ERC-20 identity calls as `OINIO`, and has a historical genesis mint-style Transfer event from the zero address.

