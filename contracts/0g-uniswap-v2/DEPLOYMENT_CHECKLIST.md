# 0G Uniswap V2 Fork - Deployment Checklist

## Pre-Deployment

### Environment Setup
- [ ] Foundry installed and updated (`foundryup`)
- [ ] Git initialized in project directory
- [ ] Dependencies installed via `./scripts/setup.sh`
- [ ] Contracts compiled successfully (`forge build`)
- [ ] All tests passing (`forge test`)

### Configuration
- [ ] `.env` file created from `.env.example`
- [ ] `PRIVATE_KEY` set (from funded wallet)
- [ ] `DEPLOYER` address set
- [ ] `FEE_TO_SETTER` configured (deployer initially, multisig for production)
- [ ] `RPC_URL` verified: https://evmrpc.0g.ai
- [ ] `CHAIN_ID` set to 16661

### Wallet Preparation
- [ ] Deployer wallet has at least 0.5 0G balance
- [ ] Private key securely stored (hardware wallet recommended)
- [ ] Backup of private key in secure location
- [ ] Test RPC connection successful

## Deployment Phase 1: W0G + Factory

### Pre-Flight Checks
- [ ] RPC connectivity test passed
- [ ] Deployer balance verified
- [ ] Gas price acceptable (<100 gwei)
- [ ] Chain ID confirmed as 16661

### Execute Deployment
- [ ] Run `./scripts/deploy.sh`
- [ ] W0G contract deployed successfully
- [ ] Factory contract deployed successfully
- [ ] PAIR_INIT_CODE_HASH logged and saved

### Verification
- [ ] W0G verified on Chainscan
- [ ] Factory verified on Chainscan
- [ ] W0G name is "Wrapped 0G"
- [ ] W0G symbol is "W0G"
- [ ] Factory feeToSetter is correct

## Deployment Phase 2: Router02

### Init Code Hash Update
- [ ] Copy PAIR_INIT_CODE_HASH from deployment logs
- [ ] Open `lib/v2-periphery/contracts/libraries/UniswapV2Library.sol`
- [ ] Replace init code hash in `pairFor()` function
- [ ] Save file
- [ ] Run `forge build` to recompile
- [ ] Build successful with no errors

### Execute Router Deployment
- [ ] Run `./scripts/deploy.sh --resume`
- [ ] Router02 deployed successfully
- [ ] Router verified on Chainscan

### Verification
- [ ] Router factory() matches Factory address
- [ ] Router WETH() matches W0G address
- [ ] All contracts visible on Chainscan

## Post-Deployment

### Create .env.launch
- [ ] Create `.env.launch` file
- [ ] Add `ZERO_G_W0G=<address>`
- [ ] Add `ZERO_G_FACTORY=<address>`
- [ ] Add `ZERO_G_UNIVERSAL_ROUTER=<address>`
- [ ] Add `ZERO_G_RPC=https://evmrpc.0g.ai`

### Validation
- [ ] Run `./scripts/post-deploy.sh`
- [ ] All contract validation checks passed
- [ ] Deployment report generated

### Functional Testing
- [ ] Test W0G deposit (wrap 0.01 0G)
- [ ] Test W0G withdrawal (unwrap 0.005 0G)
- [ ] Create test token pair (optional)
- [ ] Add initial liquidity (optional)
- [ ] Execute test swap (optional)

## Integration with Pi Forge

### Environment Configuration
- [ ] Copy addresses to root `.env` file
- [ ] Set `ZERO_G_W0G` in root .env
- [ ] Set `ZERO_G_FACTORY` in root .env
- [ ] Set `ZERO_G_UNIVERSAL_ROUTER` in root .env
- [ ] Set `ZERO_G_RPC` in root .env
- [ ] Set `ZERO_G_CHAIN_ID=16661` in root .env

### Backend Integration
- [ ] `server/config.py` created with 0G config
- [ ] `server/integrations/zero_g_swap.py` implemented
- [ ] Configuration validation passes
- [ ] Test swap client initialization

### Testing
- [ ] Backend can connect to 0G RPC
- [ ] Backend can read W0G contract
- [ ] Backend can query router
- [ ] Swap estimation works
- [ ] Transaction signing works (test environment)

## Security & Production

### Security Checklist
- [ ] Private keys secured (not in version control)
- [ ] `.env` added to `.gitignore`
- [ ] feeToSetter address documented
- [ ] Multisig plan for feeToSetter (production)
- [ ] Emergency pause procedure documented
- [ ] Incident response plan created

### Monitoring Setup
- [ ] Block explorer bookmarks saved
- [ ] Contract addresses documented
- [ ] Alert rules configured (optional)
- [ ] Gas price monitoring enabled
- [ ] Liquidity monitoring enabled

### Documentation
- [ ] Contract addresses saved in team wiki
- [ ] Deployment report shared with team
- [ ] Integration guide updated
- [ ] API documentation created
- [ ] Frontend integration examples provided

## Production Handoff

### Team Communication
- [ ] Deployment announcement sent
- [ ] Contract addresses shared
- [ ] Block explorer links provided
- [ ] Integration instructions distributed
- [ ] Support channels established

### Final Validation
- [ ] All contracts verified on Chainscan
- [ ] All addresses in production .env
- [ ] Backend integration tested
- [ ] Frontend integration ready
- [ ] Monitoring active
- [ ] Team trained on emergency procedures

## Success Criteria

✅ All contracts deployed and verified
✅ W0G wraps/unwraps 0G correctly
✅ Factory creates pairs successfully
✅ Router executes swaps with correct slippage
✅ Init code hash matches pair bytecode
✅ Pi Forge backend integration functional
✅ Documentation complete with all addresses
✅ Test swap executed successfully

## Rollback Plan

In case of critical issues:

1. **Do NOT** delete or modify deployed contracts
2. Pause frontend integration
3. Document the issue in detail
4. Assess impact on existing users (if any)
5. Deploy fixed contracts to new addresses
6. Update all configurations
7. Migrate liquidity if necessary
8. Notify all stakeholders

## Timeline Estimate

- **Setup & Configuration**: 30 minutes
- **Initial Deployment (W0G + Factory)**: 45 minutes
- **Hash Update & Router Deployment**: 15 minutes
- **Testing & Validation**: 30 minutes
- **Integration with Pi Forge**: 30 minutes
- **Documentation & Handoff**: 30 minutes

**Total**: ~2.5 hours

## Notes

- Keep deployment logs for troubleshooting
- Save all transaction hashes
- Document any deviations from plan
- Update this checklist with lessons learned

---

**Status**: ☐ Not Started | ◐ In Progress | ✅ Complete

**Last Updated**: [Date]
**Deployed By**: [Name]
**Environment**: 0G Aristotle Mainnet (Chain ID 16661)
