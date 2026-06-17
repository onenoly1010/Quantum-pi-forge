# 0G Gated DA Upload Dry-Run v1

This proof demonstrates that a future 0G Storage / DA upload path must first verify the sealed payload hash and then pass through the wallet preflight gate before any downstream upload command can run.

## Verified flow
1. Read `0g-storage-payload-hash-proof-v1`.
2. Recompute the local payload SHA-256.
3. Require the hash to match the sealed receipt.
4. Execute the simulator only through `wallet-preflight-gate-v1.sh`.
5. Stop before any real storage write, signing, broadcast, funding, approval, or chain-state mutation.

## Payload
- Path: `payloads/storage-da/sample-audit-payload-v1.json`
- Bytes: `391`
- SHA-256: `67085bcdbbe36946fe19cea7b288e8bd4b4c1cf0199653a8189238c924b0f7c2`
- Expected content address: `sha256:67085bcdbbe36946fe19cea7b288e8bd4b4c1cf0199653a8189238c924b0f7c2`

## Safety
- Wallet preflight gate passed: `true`
- Payload hash match: `true`
- Simulator received: `true`
- Private key used: `false`
- Transaction signed: `false`
- Transaction broadcast: `false`
- Storage write attempted: `false`
- Chain-state mutated: `false`
