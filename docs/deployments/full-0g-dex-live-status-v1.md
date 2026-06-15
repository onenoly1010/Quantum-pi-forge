# Full 0G DEX Live Deployment Status v1

Status: LIVE_AND_SEALED
Network: 0G Aristotle Mainnet
Chain ID: 16661
Canonical Main Commit: aa9974f

## Deployed Contracts

### W0G

Address: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d

### UniswapV2Factory

Address: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
Deployment TX: 0xde4534d39d625dbf19bc9fe5b8f8d2190a10fa38b07a505434f2151e1a51a531
Deployment block: 36225254

### UniswapV2Router02

Address: 0x2c70129E50BF88eCD59b89d63af2e8920aCF3951
Deployment TX: 0x18db81bf5707aa966311c76526750a6b15f42d142f463bae05582bf268e3fb7e
Deployment block: 36225268

## Verified Wiring

Factory feeToSetter: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC
Pair init code hash: 0x0ee982e687af41950da5a27ca2e6e2dd7817c9186efbe5fc30f1f40f72d39853
Router factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
Router WETH/W0G: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d

## Local Verification Commands

npm run governance:v2-w0g-deployment-execution:v1:check
npm run governance:v2-full-dex-deployment-execution:v1:check
npm run build

## Receipt

receipts/execution/v2-full-dex-deployment-execution-v1.json

This status file records the live Factory + Router deployment only. Pair initialization and liquidity provisioning are separate future lanes.
