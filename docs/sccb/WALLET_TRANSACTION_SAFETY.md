# SCCB v1 Wallet / Transaction Safety Model

## Pipeline

```text
intent
  → policy evaluation
  → approval requirement
  → signer          (DISABLED in v1 default)
  → network         (DISABLED in v1 default)
  → verification / evidence
```

The agent must **not** require unrestricted exposure of a private key.

## What agents may see

- Addresses, amounts, network, operation type  
- Calldata presence / hash (not necessarily full calldata in receipts)  
- Policy decision, limits failures, prepare_id  

## What agents must never see

- Private keys, seeds, mnemonics  
- Raw signing material  

## v1 implementation

| Stage | Status |
| --- | --- |
| `wallet.prepare_transaction` | Implemented — prepare + limits |
| Policy / amount / destination limits | Implemented |
| `wallet.sign_transaction` | FORBIDDEN |
| `0g.submit_transaction` | FORBIDDEN |
| Economic mint / LP via wallet | FORBIDDEN (LOCKED) |

Signing is only theoretically enableable when **all** hold:

1. environment is `production`  
2. `signing_enabled: true` passed deliberately  
3. `SCCB_WALLET_SIGNING=enabled`  
4. capability policy no longer FORBIDDEN (requires separate GO)  

Default CLI `wallet sign` always refuses.

## CLI

```bash
npm run sccb -- wallet prepare --network 0g-galileo-testnet \
  --to 0x0000000000000000000000000000000000000001 --amount 0

npm run sccb -- wallet sign   # always refuses in v1
```

## Limits evaluated at prepare

- allowed networks  
- max amount (optional)  
- destination allowlist (optional)  
- economic ops (`mint`, liquidity) always fail limits  
