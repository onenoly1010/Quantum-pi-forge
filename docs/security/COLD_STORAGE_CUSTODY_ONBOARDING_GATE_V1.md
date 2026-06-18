# Cold Storage Custody Onboarding Gate v1

## Status

COLD_STORAGE_CUSTODY_ONBOARDING_GATE_V1=true
MODE=CUSTODY_PREPARATION_ONLY
DEVICE_RECEIPT_PENDING=true
PUBLIC_ADDRESS_PENDING=true
SEED_PHRASE_ONLINE=false
PRIVATE_KEY_EXPORT_ALLOWED=false
FUNDS_MOVEMENT_AUTHORIZED=false
WALLET_SIGNING_AUTHORIZED=false
RPC_MUTATION_AUTHORIZED=false
DEPLOYMENT_AUTHORIZED=false
LIQUIDITY_AUTHORIZED=false
TOKEN_APPROVAL_AUTHORIZED=false
MAINNET_MUTATION_AUTHORIZED=false

## Purpose

This gate prepares Quantum Pi Forge for cold-storage custody onboarding without authorizing funding movement, wallet signing, deployment, liquidity, token approvals, or any mainnet mutation.

The cold-storage wallet is treated as a custody boundary only. Its public receiving address may be recorded after device setup. Seed phrase, private key, recovery material, PIN, passphrase, or signing secrets must never be typed into the laptop, browser, terminal, GitHub, ChatGPT, MetaMask import flow, cloud notes, screenshots, or any online system.

## Allowed

- Receive and inspect the unopened hardware wallet package.
- Set up the device using manufacturer instructions.
- Record only the public receiving address after verification on the device screen.
- Create a custody receipt with public address only.
- Perform no-funds local documentation and verification.
- Prepare a future tiny test-receive plan behind a separate explicit gate.

## Not Authorized

- Typing or pasting the seed phrase anywhere digital.
- Exporting or importing private keys.
- Funding movement.
- Wallet signing.
- Contract deployment.
- Token approvals.
- Liquidity actions.
- Bridge actions.
- Mainnet mutation.
- Using the cold wallet as an operational hot wallet.

## Required Future Gate

Any test receive, transfer, approval, bridge, deployment, liquidity action, or other live wallet operation requires a separate explicit operational custody gate after the public address is documented and verified.
