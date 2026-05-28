# OINIO Compute Authentication Note — 0G Compute Router

Date: 2026-05-28  
Baseline commit: `958bb54`

## Summary

OINIO now has two separate 0G integration paths:

1. EVM deployment path
2. 0G Compute API path

These paths use different credentials and must not be mixed.

## EVM Deployment Credential

Environment variable:

`PRIVATE_KEY`

Purpose:

- Signs EVM deployment transactions.
- Used by `scripts/preflight-0g-deploy.js` to derive deployer address and estimate gas.
- Used by `scripts/safe-deploy.js` only when `LIVE_DEPLOY=YES`.

Must not be used for:

- 0G Compute Router API calls.
- Model discovery.
- Model inference.
- Frontend API requests.

## 0G Compute Credential

Environment variable:

`OG_COMPUTE_API_KEY`

Purpose:

- Authorizes requests to 0G Compute Router inference endpoints.
- Used by `scripts/query-0g-compute-model.js`.
- Not required for public `/models` discovery at the time of testing.
- Required for `/chat/completions` inference at the time of testing.

Must not be used for:

- EVM deployment.
- Contract ownership.
- Wallet signing.
- `LIVE_DEPLOY`.

## Observed Behavior

`scripts/check-0g-compute-router.js`:

- Endpoint: `/models`
- API key present: `NO`
- Result: `HTTP 200`
- Models returned: `13`

`scripts/query-0g-compute-model.js`:

- Endpoint: `/chat/completions`
- API key present: `NO`
- Result: `HTTP 401`
- Error code: `missing_authorization`
- Message: `Missing authorization header`

## Rule

Do not paste or store secrets in committed files.

Use:

- `PRIVATE_KEY` only for local EVM deployment workflows.
- `OG_COMPUTE_API_KEY` only for 0G Compute API inference workflows.

These credentials are independent.
