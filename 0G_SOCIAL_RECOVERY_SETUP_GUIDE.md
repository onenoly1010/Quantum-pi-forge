# 0G Social Recovery Setup Guide

This guide documents the 0G social recovery and guardian security setup for the Quantum Pi Forge project on 0G Aristotle Mainnet.

## Guardian Safe

- Address: `0x8d088B88219D072aB035502065ee2410c2cb4389`
- Network: 0G Aristotle Mainnet, Chain ID 16661
- RPC: https://evmrpc.0g.ai
- Safe version: 1.4.1
- Threshold: 1-of-4
- Owners: 4 (private)
- Modules: none
- Guard: none

## Files

| File | Purpose |
|------|---------|
| `contracts/ZeroGSocialRecovery.sol` | Social recovery module (gated, not deployed) |
| `contracts/script/DeploySocialRecovery.s.sol` | Recovery module deployment script (gated) |
| `contracts/script/DeployYieldRouter.s.sol` | Phase 7 yield-routing deployment script |
| `scripts/broadcast-phase7.sh` | Broadcast helper for Phase 7 deployment |
| `scripts/0g_social_recovery.py` | Guardian CLI tool |
| `receipts/governance/phase-7-guardian-address-intake-v1.json` | Guardian intake receipt |
| `receipts/governance/guardian-completion-acceptance-v1.json` | Safe acceptance seal |
| `receipts/governance/phase-7-authorization-proposal-v1.json` | Authorization proposal |
| `receipts/governance/phase-7-pre-execution-validation-v1.json` | Pre-execution validation |
| `receipts/governance/0g-skills-prereq-readiness-v1.json` | 0G skills readiness |

## Phase 7 Deployment (Broadcast Authorized)

```bash
export DEPLOYER_KEY='0xYOUR_PRIVATE_KEY_HERE'
cd ~/Quantum-pi-forge
bash scripts/broadcast-phase7.sh
```

Expected outcome:
- `YieldRouterFactory` deployed
- `FeeCollector` address computed as nonce 3 of factory
- `LegacyVault` at nonce 0, `PioneerRewards` at nonce 1, `OperationalTreasury` at nonce 2
- `FeeCollector` owner set to the Guardian Safe
- Safe must later call `FeeCollector.activate()` via `execTransaction`

## Social Recovery (Gated)

The `ZeroGSocialRecovery` module is created but not authorized for production deployment. To enable:

1. Deploy `ZeroGSocialRecovery` with ForgeRegistry address and threshold
2. Add module to Safe via `owner.call(abi.encodeWithSignature("enableModule(address)", MODULE_ADDRESS))`
3. Test mock recovery with guardian signatures

## Safety

- No owner addresses are published in this repository.
- All wallet actions are gated behind explicit authorization.
- Evidence verification: `npm run verify:evidence`