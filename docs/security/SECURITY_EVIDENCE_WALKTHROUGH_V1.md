# Security Evidence Walkthrough v1

This walkthrough is the reviewer-facing bridge for the sealed security evidence in Quantum Pi Forge. It connects human-readable security documents to machine-readable receipts and the repository evidence verification command.

## Start here

```bash
npm run verify:evidence
bash scripts/security/security-evidence-walkthrough-v1.sh
```

## Scope

| Lane | Purpose | Status |
| --- | --- | --- |
| Wallet/preflight access | Proves wallet and preflight controls are discoverable through receipts. | Validated |
| 0G Storage/DA | Proves payload integrity, positive gated dry-run, negative tamper rejection, and final lane status. | Sealed |

## Wallet/preflight evidence

| Receipt ID | Receipt path | SHA-256 |
| --- | --- | --- |
| 0g-wallet-access-control-mapping-v1 | `receipts/security/0g-wallet-access-control-mapping-v1.json` | `7e8efa91cead56a4583e48361d5028410264dfdb413bfe03d424b7ec2f5df096` |
| wallet-preflight-gate-v1 | `receipts/security/evidence/wallet-preflight-gate-v1.json` | `e495f67407f121c74cc3ff6328e433bb6c5c02945b4c7d879b2c3670b26a971b` |
| wallet-preflight-gated-command-proof-v1 | `receipts/security/evidence/wallet-preflight-gated-command-proof-v1.json` | `33e3db2ee33ebfc60efc30f1a1250badc766d228ccb1b242a1fa771a6a769b08` |
| wallet-preflight-negative-test-v1 | `receipts/security/evidence/wallet-preflight-negative-test-v1.json` | `16bcefddd9f7a7f719bcbe3e2093b975f3bf44e0d4c25bcc0ab1af76f2158c13` |
| wallet-preflight-verifier-v1 | `receipts/security/wallet-preflight-verifier-v1.json` | `5ba04a8f94f34085ab6f813f4f0f918c3a67a5a4bc6ad1e103187ad260df4c85` |

## Storage/DA evidence

| Receipt ID | Receipt path | SHA-256 |
| --- | --- | --- |
| 0g-storage-da-access-policy-v1 | `receipts/security/evidence/0g-storage-da-access-policy-v1.json` | `0ed479357563dc7901ccd84fcbd313d7baf7683c4cd360475c5944441f767948` |
| 0g-storage-payload-hash-proof-v1 | `receipts/security/evidence/0g-storage-payload-hash-proof-v1.json` | `ab6345e2415e60c905a2a37b9c7f18833ba46e44a49113c54782c8f2b914a0a7` |
| 0g-gated-da-upload-dry-run-v1 | `receipts/security/evidence/0g-gated-da-upload-dry-run-v1.json` | `4c5b96e353b20c3874c360c95059a09c4cd287f27b1f118cbea28ea308669fe0` |
| 0g-gated-da-upload-negative-test-v1 | `receipts/security/evidence/0g-gated-da-upload-negative-test-v1.json` | `6d28ca5c6dedacc5c6a2c988e4dac8faf5d63d364d1bdc93a45a19b007de12e8` |
| 0g-storage-da-lane-status-v1 | `receipts/security/evidence/0g-storage-da-lane-status-v1.json` | `a7510cc1d933074d72e4d686ad88a19b19e8189f2949cd2b19ff86eba799e904` |

## Forbidden list

- Private keys: `false`
- Transaction signing: `false`
- Transaction broadcast: `false`
- Storage write: `false`
- Chain-state mutation: `false`

## Reviewer model

1. Discovery: start with this document.
2. Verification: run `scripts/security/security-evidence-walkthrough-v1.sh`.
3. Integrity: run `npm run verify:evidence`.
4. Boundary: confirm private keys, signing, broadcast, storage writes, and chain mutation remain false.
