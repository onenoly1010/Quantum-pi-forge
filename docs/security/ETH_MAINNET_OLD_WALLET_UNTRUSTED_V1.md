# ETH Mainnet Old Wallet Untrusted Boundary v1

Timestamp: 2026-06-17T15:37:39Z

OLD_ETH_WALLET_STATUS=COMPROMISED_OR_UNTRUSTED
OLD_ETH_WALLET=0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC
DRAIN_TARGET_OBSERVED=0x541B9034C82D7Fb564F12cA07037947ff5b4eF2f
DRAIN_TX=0x1fec3b41314e5066a2771ea608f6ed09580e10f45605838016f970394f40e7fd

## Boundary

- Do not fund this wallet.
- Do not use this wallet for liquidity.
- Do not use this wallet for approvals.
- Do not use this wallet for swaps.
- Do not use this wallet for future QPF operator actions.
- Treat this address as historical/read-only only.

## Evidence Summary

A successful plain ETH transfer was observed from the old wallet to the outgoing address after inbound funding.

Local triage found many PRIVATE_KEY references, mostly docs/placeholders/scripts. Shell history confirms PRIVATE_KEY was handled in local shell/runtime context, including live-capable transaction paths.

The wallet is frozen as untrusted regardless of whether the original leak path is fully proven.
