# V2 Live Cutover Body Implementation Plan v1

generated_utc: 2026-06-15T18:32:41Z

## Current Finding

The sealed cutover wrapper is present and hash-bound, but the live execution body is intentionally not implemented.

## Existing Sealed Command

npm run autonomous:v2-mainnet-cutover:execute -- --require-command-hash --receipt receipts/execution/v2-mainnet-cutover-execution-v1.json

## Blocker

scripts/v2-mainnet-cutover-execute.cjs currently stops at: live execution body intentionally not implemented in this repair lane

## Candidate Live Execution Bodies Found

contracts/0g-uniswap-v2/script/Deploy.s.sol
contracts/0g-uniswap-v2/scripts/deploy.sh
contracts/0g-uniswap-v2/scripts/post-deploy.sh
contracts/oinio-memorial-bridge/deploy.sh
contracts/script/BirthGenesisHeartbeat.s.sol
contracts/script/Deploy.s.sol
contracts/script/RegisterGenesisAgent.s.sol
scripts/preflight-0g-deploy.js
scripts/safe-deploy.js
scripts/verify_0g_dex.py

## Disabled Legacy Scripts
scripts/deploy-0g-mainnet.js:1:console.error("BLOCKED: this legacy live-broadcast deploy script has been disabled.");
scripts/deploy-direct.js:1:console.error("BLOCKED: this legacy live-broadcast deploy script has been disabled.");
scripts/compile-and-deploy.js:1:console.error("BLOCKED: this legacy live-broadcast deploy script has been disabled.");

## Required Implementation Rule

The final live body must preserve all gates:

- exact sealed command hash
- --require-command-hash
- exact receipt path
- QPF_MAINNET_CUTOVER_EXECUTE=YES
- explicit RPC / deploy target
- explicit operator-controlled broadcast flag
- execution receipt creation only after the selected body succeeds

## Do Not Claim

FULL_ACTIVATION_COMPLETED must remain false until receipts/execution/v2-mainnet-cutover-execution-v1.json exists and verifies.
