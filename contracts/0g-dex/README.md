# 0G DEX - Uniswap V2 Fork Contracts

## Overview

This directory contains **reference implementations** of Uniswap V2 contracts for deployment to 0G Aristotle Mainnet.

> **Note**: The actual deployment infrastructure is located in `/contracts/0g-uniswap-v2/` which uses Foundry for testing and deployment.

## Contracts

### Core Contracts
- **UniswapV2Factory.sol** - Factory contract for creating trading pairs
- **UniswapV2Pair.sol** - LP token and pair management contract  
- **UniswapV2Router02.sol** - Router for swaps and liquidity operations

### Purpose

These contracts serve as:
1. **Reference** for understanding Uniswap V2 architecture
2. **Source** for Python deployment scripts that need ABI/bytecode
3. **Documentation** of the exact contract versions being deployed

## Deployment

For actual deployment, use the Foundry-based infrastructure:

```bash
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis/contracts/0g-uniswap-v2
./scripts/setup.sh
./scripts/deploy.sh
```

Or use the Python deployment script:

```bash
python scripts/deploy_0g_dex.py
```

## Architecture

```
┌─────────────────────────────────────────┐
│         UniswapV2Factory                │
│  (Creates and tracks all pairs)        │
└──────────────┬──────────────────────────┘
               │ creates
               ▼
┌─────────────────────────────────────────┐
│         UniswapV2Pair                   │
│  (Individual trading pair contract)    │
│  - Manages reserves                     │
│  - Mints/burns LP tokens                │
│  - Executes swaps                       │
└─────────────────────────────────────────┘
               ▲
               │ interacts with
               │
┌─────────────────────────────────────────┐
│       UniswapV2Router02                 │
│  (User-facing swap interface)          │
│  - Multi-hop swaps                      │
│  - Add/remove liquidity                 │
│  - Native 0G wrapping (W0G)            │
└─────────────────────────────────────────┘
```

## Integration with 0G

### Native Token Wrapping
The Router integrates with W0G (Wrapped 0G) to enable trading of the native 0G token.

### Network Configuration
- **Chain ID**: 16661
- **RPC**: https://evmrpc.0g.ai
- **Explorer**: https://chainscan.0g.ai

## Key Differences from Ethereum

1. **Solidity Version**: Adapted for 0.5.16 (core) and 0.6.6 (periphery)
2. **Gas Optimizations**: Tested for 0G's gas pricing model
3. **W0G Integration**: Uses W0G instead of WETH

## Security Considerations

- Contracts are **battle-tested** Uniswap V2 code
- Minimal modifications for 0G compatibility
- Audited code base (Uniswap V2 audits applicable)
- Factory ownership via `feeToSetter` should use multisig

## Testing

Tests are located in `/contracts/0g-uniswap-v2/test/`:

```bash
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis/contracts/0g-uniswap-v2
forge test -vvv
```

## Resources

- [Uniswap V2 Documentation](https://docs.uniswap.org/contracts/v2/overview)
- [Uniswap V2 Core Repository](https://github.com/Uniswap/v2-core)
- [Uniswap V2 Periphery Repository](https://github.com/Uniswap/v2-periphery)
- [0G Documentation](https://docs.0g.ai)

## License

GPL-3.0 (following Uniswap V2 licensing)
