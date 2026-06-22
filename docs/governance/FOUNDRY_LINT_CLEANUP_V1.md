# Foundry Lint Cleanup v1

Resolves Foundry lint notes without opening execution, using wallets, accessing private keys, signing, broadcasting, deploying, or performing live execution.

Fixed scope:
- contracts/src/OINIOToken.sol: plain imports to named imports
- contracts/src/OINIOModelRegistry.sol: plain imports to named imports; AIModel to AiModel; oinioToken to OINIO_TOKEN; references updated
- contracts/script/Deploy.s.sol: plain imports to named imports; console import added; registry.OINIO_TOKEN() reference updated
- contracts/script/BirthGenesisHeartbeat.s.sol: plain imports to named imports; console import added
- contracts/script/RegisterGenesisAgent.s.sol: plain imports to named imports; console import added

Verified locally:
- cd contracts && forge lint
- cd contracts && forge build
- npm run governance:mainnet-execution-result:v1:check
- npm run governance:v2-mainnet-cutover-execution:v1:check
- npm run verify:evidence

Boundary posture:
- wallet_actions=false
- private_key_access=false
- signing_attempted=false
- transaction_broadcast=false
- deploy_attempted=false
- live_execution=false
