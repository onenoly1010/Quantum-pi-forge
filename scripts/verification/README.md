# Verification Framework

This directory contains the comprehensive multi-chain deployment verification system for Pi Forge Quantum Genesis.

## Quick Start

```bash
# Run all verifications
./verify-all.sh all

# Run specific network
./verify-all.sh pi-network-mainnet
```

## Directory Structure

- **lib/** - Core library functions (colors, validators, formatters, assertions)
- **pi-network/** - Pi Network specific verification scripts
- **zero-g/** - 0G Network specific verification scripts
- **universal/** - Universal/generic verification scripts
- **verify-all.sh** - Master orchestration script

## Documentation

See [docs/VERIFICATION.md](../../docs/VERIFICATION.md) for comprehensive documentation including:
- Prerequisites and installation
- Environment variable configuration
- Usage examples
- Troubleshooting guide
- Adding new chains
- CI/CD integration

## Running Tests

Test the verification framework:
```bash
../../tests/verification-tests.sh
```

## Features

- ✅ Automated contract deployment verification
- ✅ Color-coded output with emojis
- ✅ Assertion framework with zero-tolerance error handling
- ✅ JSON and HTML report generation
- ✅ Multi-chain support (Pi Network, 0G, extensible)
- ✅ GitHub Actions integration
- ✅ Comprehensive error messages

## Requirements

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (cast, forge)
- bc (for floating point calculations)
- bash 4.0+

## Environment Variables

Set these before running verification:
- Pi Network: `CATALYST_POOL_ADDRESS`, `MODEL_ROYALTY_NFT_ADDRESS`
- 0G Network: `ZERO_G_W0G`, `ZERO_G_FACTORY`, `ZERO_G_ROUTER`

See `.env.verification.example` for complete list.
