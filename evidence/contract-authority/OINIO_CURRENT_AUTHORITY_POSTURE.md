# OINIO Current Authority Posture

## Verified Contract

`0xbEbC1A40A18632CeE19D220647E7aD296A1A5F37`

Network: 0G Aristotle / chainId `16661`

## Verified Wallet

`0x353663cd664bB3e034Dc0f308D8896C0a242e4cd`

## Verified Balance

`962,839,002.79598073 OINIO`

## Verified Owner State

`owner()` resolves to:

`0x353663cd664bB3e034Dc0f308D8896C0a242e4cd`

## Verified Owner Powers

Read-only `eth_call` simulation shows the owner wallet can call:

- `mint(address,uint256)`
- `transferOwnership(address)`
- `renounceOwnership()`

Read-only simulation also shows a non-owner address cannot call those owner-gated functions.

## Corrected Conclusion

The OINIO owner authority is live.

The prior working assumption that secret keys or owner authority may have been burned or renounced is not supported by current evidence.

The MetaMask wallet should be treated as a high-risk authority wallet.

## Safety Boundary

No transaction has been signed.

No state has been changed.

No ownership transfer, renounce, mint, burn, or contract mutation is authorized by this evidence record.

## Recommended Next Decision

Before any on-chain correction, choose one custody policy:

1. Transfer ownership to hardened custody.
2. Renounce ownership permanently.
3. Keep owner authority temporarily, with strict manual custody controls.

Renounce should only be considered if permanent mint-disablement and loss of owner recovery paths are intended.
