# Canonical Identity Evidence Bundle

This directory holds the minimum evidence required to close blockers CI-001 through CI-006
as documented in `docs/governance/CANONICAL_IDENTITY_V1.md`.

**Current status:** EMPTY — evidence not yet produced.

Each file listed below must be committed here before the corresponding blocker can be closed.

| File | Blocker | Required content |
|------|---------|-----------------|
| `CI-001-contract-deployment-proofs.md` | CI-001 | Deployment txs, runtime bytecode, SHA-256 hashes, compiler settings for all three OINIO contracts |
| `CI-001-bytecode-comparison-result.md` | CI-001 | Explicit match/mismatch table comparing build artifact vs on-chain bytecode |
| `CI-002-token-0xbebc1a-provenance.md` | CI-002 | Chain ID, deployment tx, deployer, deployment block/time, relationship statement |
| `CI-003-deployer-identity-resolution.md` | CI-003 | Transaction histories, deployment attribution, compromise/trust treatment |
| `CI-004-audit-listener-config-evidence.md` | CI-004 | Committed env snapshot with resolved CHAIN_ID and DEX_CONTRACT, or absence acknowledgement |
| `CI-005-gpg-artifacts.md` | CI-005 | GPG key material / signed artifacts, or formal status downgrade record |
| `CI-006-cryptographic-identity-proof.md` | CI-006 | Signed artifacts traceable to a documented key, or formal downgrade record |

See `docs/governance/CANONICAL_IDENTITY_V1.md` for the full blocker register and resolution requirements.
