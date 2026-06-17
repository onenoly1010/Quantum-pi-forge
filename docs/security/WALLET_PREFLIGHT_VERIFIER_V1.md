# Wallet Preflight Verifier v1

Non-executing preflight verifier for 0G wallet safety.

This verifier checks:
- forbidden hot-key environment variables are absent
- Aristotle chain ID is `16661`
- Aristotle RPC is `https://evmrpc.0g.ai`
- the wallet access-control mapping receipt is `PASS`
- the mapping receipt proves no private key use, signing, or broadcast

The verifier writes `receipts/security/wallet-preflight-verifier-v1.json` and exits nonzero on failure.

This is a preflight guard only. It does not use private keys, sign transactions, broadcast transactions, fund wallets, approve allowances, or mutate chain state.
