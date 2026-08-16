# CANONICAL_IDENTITY_V1

**Document type:** W1 Gate Result — Identity Audit Record  
**Status:** `UNVERIFIED`  
**Gate outcome:** W1 HOLD — Canonical identity is not yet independently established  
**Created:** 2026-08-16  
**Version:** 1.0.0  
**Supersedes:** none  
**Next gate:** W1 PASS requires resolution of all six blockers below  

---

## Gate Summary

The W1 identity audit did not fail. It prevented an invalid W2.

The audit established that the evidence available in this repository is insufficient to independently confirm which contract set is canonical, who deployed it, and whether the identity claims made in existing documents are supported by cryptographic or on-chain proof. That is the correct and rigorous output of an evidence-first gate.

> **"Unresolved" is the successful output here.**  
> It demonstrates that the verification methodology is capable of refusing to manufacture certainty when the evidence does not support it.

This document is a public, version-controlled boundary between:

- what QPF **claims**
- what QPF **can prove**
- what **remains unresolved**

It must not be rewritten to imply resolution until each blocker below is independently closed.

---

## W1 State Machine

```
Audit
  └─► W1 identity record (this document, Status: UNVERIFIED)
        └─► resolve blockers → produce minimum evidence bundle
              └─► independently establish canonical identity
                    └─► W1 PASS
                          └─► manifest
                                └─► #748 integration
                                      └─► proof experiment
```

The path **Audit → pick a contract → manifest → verifier says yes** is closed.

---

## Blocker Register

Blockers are grouped by nature. All six must be closed before Status can advance to `VERIFIED`.

### Group A — Deployment-Identity Blockers

#### CI-001 — Competing contract sets

| Field | Value |
|-------|-------|
| **Current state** | Two candidate OINIO Token addresses exist in this repository (`0x75995EC0...` and `0x709f23C7...`). Only the second matches the current build artifact bytecode. `artifact-deployment-mapping-v1.json` has zero mappings. OINIOModelRegistry and HeartbeatMonitor both have size/hash discrepancies between build artifact and live on-chain code. |
| **Bytecode finding** | `0x709f23C7A7172E137427576abB5Eb8959E2A57c1` runtime bytecode SHA-256 `31394bbb...` **matches** local artifact `OINIOToken` (2280 bytes) ✅. `0x67aD7169...` (OINIOModelRegistry) on-chain: 9850 bytes / `cd1a676d...` vs artifact 9710 bytes / `fe2e045f...` ❌. `0x5E50b92E...` (HeartbeatMonitor) on-chain hash `a9e8eeC5...` vs artifact `e0efebc8...` ❌. |
| **Important** | One matching contract does not establish the entire three-contract set. |
| **Evidence source** | `evidence/build-artifact-manifest-v1.json`; `evidence/live-rpc-correspondence-v1.json` (collected 2026-08-03T04:52:18Z, block `0x26b3ec8`); `docs/CONTRACT_REGISTRY_V1.md` |

**Resolution requires:**
1. Deployment transaction for each candidate contract address (OINIOToken ×2, OINIOModelRegistry, HeartbeatMonitor).
2. Independently retrieved deployed runtime bytecode for each.
3. Independently computed SHA-256 hash of each runtime bytecode.
4. Exact source commit that produced the build artifact.
5. Reproducible compilation settings (compiler version, optimizer, EVM target).
6. Explicit bytecode comparison result: match or mismatch with justification.

---

#### CI-002 — Unexplained `0xbebc1a…` token

| Field | Value |
|-------|-------|
| **Current state** | `token-OINIO-0xbebc1a40a18632cee19d220647e7ad296a1a5f37-2026.04.15.csv` is committed to the repository root. The address `0xbebc1a...` does not appear in `CONTRACT_REGISTRY_V1.md`, the broadcast output, or the build artifact manifest. No deployment transaction, chain, deployer, or relationship to the later `0x75995EC0...` / `0x709f23C7...` addresses is documented. |
| **Evidence source** | Repository root CSV file; absence of this address in `evidence/artifact-deployment-mapping-v1.json`, `docs/CONTRACT_REGISTRY_V1.md`, and `broadcast/Deploy.s.sol/16661/` |

**Resolution requires:**
1. Chain ID on which `0xbebc1a...` is deployed.
2. Deployment transaction hash and block number.
3. Deployer address.
4. Deployment timestamp.
5. Runtime bytecode and independently computed hash.
6. Explicit statement of relationship (or non-relationship) to later OINIO contract addresses.

---

#### CI-003 — Two deployer identities

| Field | Value |
|-------|-------|
| **Current state** | The committed CSV shows transfers involving both `0x353663cd664bb3e034dc0f308d8896c0a242e4cd` (recipient/counterparty) and `0xfed48a76661a5ce0c8f446dc1bfdba2cb3e58458` (initiating address). The broadcast `run-latest.json` `from` field is empty. No documented relationship between these addresses, no deployment transaction attribution, and no explicit treatment of any "compromised/untrusted" designation exists in the repository. |
| **Evidence source** | `token-OINIO-0xbebc1a...csv` rows 2-4; `broadcast/Deploy.s.sol/16661/run-latest.json` |

**Resolution requires:**
1. Transaction histories for all deployer/counterparty addresses above.
2. Actual deployment transactions attributing contract creation to a specific sender.
3. Evidence connecting or formally separating these identities.
4. Explicit documented treatment of any address designated compromised or untrusted.

---

### Group B — Evidence Limitation

#### CI-004 — Runtime configuration unavailable

| Field | Value |
|-------|-------|
| **Current state** | `audit-listener` reads `CHAIN_ID` and `DEX_CONTRACT` from environment variables at runtime (`audit-listener/src/config.js`). No committed `.env`, no `.env.example` with resolved values, no deployment receipt recording which chain and contract address the service actually monitored. It is not possible to verify from this repository what the audit-listener observed or whether it was pointed at the canonical contract set. |
| **Evidence source** | `audit-listener/src/config.js` lines containing `process.env.CHAIN_ID` and `process.env.DEX_CONTRACT`; absence of resolved environment in `audit-listener/` directory |

**Resolution requires:**
1. Committed or archived evidence of the environment configuration actually used during the audit period.
2. Resolved `CHAIN_ID` value (decimal and hex).
3. Resolved `DEX_CONTRACT` address.
4. Timestamp and version of that configuration.
5. If no audit run log exists: explicit acknowledgement that this evidence class is absent and the audit-listener findings are therefore unevidenced.

---

### Group C — Authority / Provenance Blockers

#### CI-005 — Self-authorizing canonical claims

| Field | Value |
|-------|-------|
| **Current state** | `docs/IDENTITY_LOCK.md` declares Status: `LOCKED AND VERIFIED` and claims "verified through cryptographic proof and social consensus across 7+ platforms." The GPG key fingerprint field reads `⚠️ PLACEHOLDER - TO BE COMPLETED BEFORE SUCCESSION CEREMONY`. The key commitment SHA-256 field is also a placeholder. The document's verification claims are therefore self-referential: the document asserts verification without producing the artifact that would constitute verification. |
| **Evidence source** | `docs/IDENTITY_LOCK.md` — GPG Key Fingerprint and Key Commitment sections |

**Resolution requires:**
1. Actual GPG public key or verifiable key fingerprint.
2. Signed commits or signed artifacts produced by that key, independently verifiable.
3. Actual multisig configuration or transactions, if claimed.
4. Independent third-party evidence (e.g. signed attestations, cross-platform verification links) supporting the distributed-identity claim.
5. If cryptographic evidence does not exist: formal downgrade of the status field from `LOCKED AND VERIFIED` to `CLAIMED / INTENDED` with a documented path to verification.

---

#### CI-006 — Missing cryptographic identity infrastructure

| Field | Value |
|-------|-------|
| **Current state** | No GPG key material, no multisig artifacts, no signed release tags, and no social-consensus evidence are present in the repository. The "distributed identity cluster" claim in `IDENTITY_LOCK.md` rests entirely on the document's own assertions. `artifact-deployment-mapping-v1.json` is empty (zero mappings), so no deployment event is cryptographically linked to a known key or identity. |
| **Evidence source** | `docs/IDENTITY_LOCK.md`; `evidence/artifact-deployment-mapping-v1.json` (`"mappings": []`); absence of `*.asc`, signed tags, and multisig transaction records in repository |

**Resolution requires:**
1. Actual GPG/multisig/social-consensus evidence, if it exists — produce artifacts, do not re-assert claims.
2. At minimum one signed artifact (commit, release tag, or deployment receipt) traceable to a documented key.
3. If evidence does not exist: formal, version-controlled downgrade of all `LOCKED`, `VERIFIED`, and `distributed identity cluster` language to `CLAIMED / INTENDED` status, with an explicit record of what is intended and what has not yet been produced.

---

## Blocker Classification Summary

| ID | Nature | Current state |
|----|--------|---------------|
| CI-001 | Deployment-identity | Two candidate token addresses; two of three contracts have size/hash discrepancy |
| CI-002 | Deployment-identity | Committed token address with no chain provenance |
| CI-003 | Deployment-identity | Two deployer identities, no transaction attribution |
| CI-004 | Evidence limitation | Runtime configuration not captured; audit-listener monitoring scope unknown |
| CI-005 | Authority / provenance | Self-authorizing canonical claims; placeholder GPG infrastructure |
| CI-006 | Authority / provenance | No cryptographic identity artifacts exist |

CI-001 through CI-003 share the same resolution path: on-chain transaction evidence.  
CI-004 requires a committed or archived configuration record from the actual audit run.  
CI-005 and CI-006 require cryptographic artifacts or formal status downgrade — they cannot be closed by documentation alone.

---

## What W1 Established (Positive Findings)

The audit produced the following confirmed, evidence-supported findings:

1. **OINIOToken at `0x709f23C7A7172E137427576abB5Eb8959E2A57c1`** has runtime bytecode that matches the local build artifact (SHA-256 `31394bbb3e75a9de2b10c92a43ce23aaf8898d43305926308e85a6bc4638ac1f`, 2280 bytes). This is a positive signal for that single address.

2. **OINIOModelRegistry and HeartbeatMonitor** have measurable size and hash discrepancies between the local build artifact and the on-chain code at the addresses listed in `CONTRACT_REGISTRY_V1.md`. These discrepancies are precisely documented and are the kind of evidence the eventual identity document needs.

3. **`artifact-deployment-mapping-v1.json`** exists and has the correct schema, but contains zero mappings. The schema is sound; the evidence bundle it is designed to hold is empty.

4. The W1 process demonstrated that the verification methodology can and does refuse to manufacture certainty. That refusal is itself a governance asset.

---

## Minimum Evidence Bundle (Next Phase)

Before this document's Status can change from `UNVERIFIED`, the following bundle must be produced and committed under `evidence/`:

```
evidence/
  canonical-identity/
    CI-001-contract-deployment-proofs.md      # deployment txs, bytecode, hashes, compiler settings
    CI-001-bytecode-comparison-result.md      # explicit match/mismatch table for all three contracts
    CI-002-token-0xbebc1a-provenance.md       # chain, deployment tx, deployer, relationship statement
    CI-003-deployer-identity-resolution.md   # tx histories, attribution, compromise/trust treatment
    CI-004-audit-listener-config-evidence.md # committed env snapshot or absence acknowledgement
    CI-005-gpg-artifacts.md                  # key material or formal status downgrade record
    CI-006-cryptographic-identity-proof.md   # signed artifacts or formal downgrade record
```

Each file must contain primary evidence (transactions, bytecode, key material), not assertions.

---

## Governance Note

This document may be updated only to:

1. Record the closure of a blocker when its minimum evidence bundle entry is committed.
2. Record a formal status downgrade (CI-005 / CI-006) when evidence cannot be produced.
3. Advance Status to `VERIFIED` when all six blockers are closed.

It must not be edited to smooth or resolve contradictions without the corresponding evidence.

---

*CANONICAL_IDENTITY_V1.md — W1 Gate Record — Status: UNVERIFIED*
