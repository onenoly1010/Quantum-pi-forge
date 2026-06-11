# Mainnet Cutover Preflight Boundary v1

## Status

SEALED_PREFLIGHT_BLOCKED.

This document records a discovery-only preflight for future mainnet cutover.

No cutover was executed.

No deployment was executed.

No broadcast was executed.

## Base State

- Base main commit: `f8852ee`
- Branch: `autonomous/mainnet-cutover-preflight-v1`
- Mode: discovery only

## Baseline Verification

The following checks passed before preflight sealing:

- `autonomous:mainnet-cutover-readiness-boundary:v1:check`
- `governance:pr-231-post-merge:v1:check`
- `governance:supervised-activation-dry-run-4-evidence:v1:check`
- `press-agent:credential-completion-boundary:v1:check`
- `autonomous:supervised-activation:v1:check`
- `autonomous:network-activation-readiness:v2:check`
- `build`

## Secret Presence Result

Present:

- `DISCORD_WEBHOOK_URL`

Missing or empty:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `ZERO_G_W0G`
- `ZERO_G_FACTORY`
- `ZERO_G_ROUTER`
- `ZERO_G_UNIVERSAL_ROUTER`
- `ZERO_G_W0G_TESTNET`
- `ZERO_G_FACTORY_TESTNET`
- `ZERO_G_ROUTER_TESTNET`
- `ZERO_G_UNIVERSAL_ROUTER_TESTNET`
- `CATALYST_POOL_ADDRESS`
- `MODEL_ROYALTY_NFT_ADDRESS`
- `COSIGN_PRIVATE_KEY`

## Candidate Surfaces Discovered

Deployment and verification surfaces exist, including:

- `scripts/preflight-0g-deploy.js`
- `scripts/deploy-0g-mainnet.js`
- `scripts/deploy_0g_dex.py`
- `scripts/deploy-direct.js`
- `scripts/safe-deploy.js`
- `scripts/verification/verify-all.sh`
- `.github/workflows/verify-deployments.yml`

These surfaces were inspected only.

They were not executed.

## Preflight Result

Mainnet cutover is not ready to execute.

Blocking reasons:

- required secrets are incomplete
- Telegram broadcast credentials are missing
- Twitter broadcast credentials are missing
- Cloudflare deploy credentials are missing
- 0G mainnet verification/deploy secrets are missing
- Pi deployment verification addresses are missing
- rollback plan has not been sealed
- explicit operator approval gate has not been sealed

## Claim Boundary

This preflight confirms:

- preflight discovery completed
- baseline verifiers passed
- required secret names were identified
- local secret presence was checked without printing secret values
- mainnet cutover is blocked

This preflight does not claim:

- mainnet cutover complete
- mainnet cutover ready to execute
- unsupervised autonomy active
- site deployment complete
- contract deployment complete
- Telegram broadcast live
- Twitter broadcast live
- external multichannel broadcast proven

## Next Authorized Lane

The next valid lane is:

`mainnet-cutover-gate-definition-v1`

That lane may define exact go/no-go gates.

It must not perform mainnet cutover.
