# Stale OpenZeppelin Submodule Path Repair v1

Removes stale submodule/index metadata for the old path lib/openzeppelin-contracts and preserves the canonical Foundry dependency path contracts/lib/openzeppelin-contracts.

Repair scope:
- old_path=lib/openzeppelin-contracts
- canonical_path=contracts/lib/openzeppelin-contracts
- stale_old_path_tracked=true

Verified locally:
- git submodule sync --recursive
- git submodule update --init --recursive --depth 1
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
