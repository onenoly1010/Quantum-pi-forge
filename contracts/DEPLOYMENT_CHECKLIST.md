# OINIO Smart Contracts Deployment Checklist

This checklist ensures safe and successful deployment of OINIO smart contracts to Pi Network.

## Pre-Deployment Verification

### ✅ Code Quality
- [x] All contracts compile without errors
- [x] All 37 tests pass (15 OINIOToken + 22 OINIOModelRegistry)
- [x] No compiler warnings (Solidity 0.8.20)
- [x] Gas usage optimized and within limits
  - OINIOToken: ~679K gas
  - OINIOModelRegistry: ~2.03M gas

### ✅ Security Checklist
- [x] Using OpenZeppelin v5.0.0 audited contracts
- [x] ReentrancyGuard implemented on registerModel
- [x] Access control via ownership checks
- [x] Safe math (Solidity 0.8.20 built-in overflow protection)
- [x] Events emitted for all state changes
- [x] Input validation on all public functions
- [x] No unbounded loops in critical paths
- [x] transferModel properly removes from previous owner's list

### ✅ Code Review
- [x] Automated code review completed
- [x] Bug in transferModel identified and fixed
- [x] Additional test added for transfer fix verification

## Testnet Deployment Steps

### 1. Environment Setup
```bash
cd contracts
cp .env.example .env
# Edit .env with your testnet private key
```

Required environment variables:
- `PRIVATE_KEY`: Deployer's private key
- `RPC_URL_TESTNET`: https://api.testnet.minepi.com/rpc
- `CHAIN_ID_TESTNET`: 2025

### 2. Pre-Flight Check
```bash
# Verify compilation
forge build

# Run all tests
forge test -vv

# Check gas usage
forge test --gas-report
```

### 3. Deploy to Pi Testnet
```bash
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_TESTNET \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### 4. Post-Deployment Verification
- [ ] Save contract addresses from deployment output
- [ ] Verify contracts on Pi Network block explorer
- [ ] Test token transfer on testnet
- [ ] Test model registration on testnet
- [ ] Test model metadata update on testnet
- [ ] Test model transfer on testnet
- [ ] Verify staking mechanics work correctly
- [ ] Check that events are emitted properly

### 5. Integration Testing
- [ ] Update frontend with testnet contract addresses
- [ ] Test full user flow: approve → register → update → transfer
- [ ] Verify ABI compatibility with frontend
- [ ] Test edge cases (insufficient balance, unauthorized access, etc.)

## Mainnet Deployment Steps

### 1. Final Security Review
- [ ] Review all testnet test results
- [ ] Confirm no issues found during testnet operation
- [ ] Double-check all contract parameters
- [ ] Verify deployer wallet has sufficient Pi for gas

### 2. Environment Setup
```bash
# Use production private key (NEVER commit this)
export PRIVATE_KEY=0x...
export RPC_URL_MAINNET=https://rpc.mainnet.pi.network
```

### 3. Deploy to Pi Mainnet
```bash
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_MAINNET \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --slow  # Use --slow for mainnet to avoid rate limits
```

### 4. Post-Mainnet Deployment
- [ ] Save contract addresses (CRITICAL!)
- [ ] Verify contracts on Pi Network mainnet explorer
- [ ] Transfer ownership if needed
- [ ] Update frontend with mainnet addresses
- [ ] Announce contract addresses to community
- [ ] Document deployment in repository

## Contract Addresses

### Testnet (Chain ID: 2025)
- **OINIOToken**: `[To be filled after deployment]`
- **OINIOModelRegistry**: `[To be filled after deployment]`
- **Block Explorer**: https://testnet.minepi.com/
- **Deployed At**: [Date and block number]

### Mainnet (Chain ID: 314159)
- **OINIOToken**: `[To be filled after deployment]`
- **OINIOModelRegistry**: `[To be filled after deployment]`
- **Block Explorer**: https://pi.blockscout.com/
- **Deployed At**: [Date and block number]

## Emergency Procedures

### If Deployment Fails
1. Check gas price and network status
2. Verify private key has sufficient balance
3. Check RPC endpoint availability
4. Review error messages in deployment output
5. Try again with increased gas limit if needed

### If Contract Has Issues After Deployment
1. **DO NOT PANIC** - Contracts are immutable
2. Document the issue thoroughly
3. If critical: Deploy new version with fixes
4. If minor: Document workaround in integration guide
5. Notify users if necessary

### Ownership Transfer (if needed)
```bash
# Transfer OINIOToken ownership
cast send <TOKEN_ADDRESS> "transferOwnership(address)" <NEW_OWNER> \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Transfer OINIOModelRegistry ownership
cast send <REGISTRY_ADDRESS> "transferOwnership(address)" <NEW_OWNER> \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

## Testing Commands Reference

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test testRegisterModel

# Run with verbosity
forge test -vvvv

# Run with gas report
forge test --gas-report

# Check coverage
forge coverage

# Clean and rebuild
forge clean && forge build
```

## Verification Commands

```bash
# Verify token contract
forge verify-contract <TOKEN_ADDRESS> \
  src/OINIOToken.sol:OINIOToken \
  --chain-id 2025 \
  --constructor-args $(cast abi-encode "constructor(address)" <DEPLOYER_ADDRESS>)

# Verify registry contract
forge verify-contract <REGISTRY_ADDRESS> \
  src/OINIOModelRegistry.sol:OINIOModelRegistry \
  --chain-id 2025 \
  --constructor-args $(cast abi-encode "constructor(address,address)" <TOKEN_ADDRESS> <OWNER_ADDRESS>)
```

## Success Criteria

- ✅ All tests pass (37/37)
- ✅ Contracts compile without warnings
- ✅ Gas usage within acceptable limits
- ✅ Security review completed
- ✅ Testnet deployment successful
- ✅ Integration tests pass
- ✅ Mainnet deployment successful
- ✅ Contracts verified on block explorer
- ✅ Frontend integration working
- ✅ Documentation complete

## Support

For issues during deployment:
1. Check the [README.md](README.md) troubleshooting section
2. Review Foundry documentation: https://book.getfoundry.sh/
3. Open an issue on GitHub with deployment logs

## Notes

- Always test on testnet first
- Never commit private keys
- Keep deployment logs for reference
- Document any issues encountered
- Update this checklist after deployment
