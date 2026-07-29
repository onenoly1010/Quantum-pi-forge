# Known Limitations v1

**Phase:** 8.4 (Verification Portal)  
**Purpose:** Set external expectations. Not a punch-list to “fix by opening mint.”

## Verification / docs

| Limitation | Note |
| --- | --- |
| Dual / alternate contract addresses exist historically | Prefer `docs/CONTRACT_REGISTRY_V1.md` + live RPC; see also `contracts/DEPLOYED_ADDRESSES.md` dual-set notes |
| Bytecode digests are time-stamped probes | Recompute yourself; digests may lag re-probes |
| CI `npm audit` high may fail on `main` | Pre-existing dependency residual; not a mint gate |
| Public site vs git lag | After merge, wait for Cloudflare Pages if portal HTML just changed |

## Governance / control plane

| Limitation | Note |
| --- | --- |
| Guardian Safe accepted ≠ Safe is Ownable `owner()` | Residual untrusted owner documented (B-02); do not over-claim admin control |
| Safe threshold / owner EOAs not fully published | Verify in official Safe UI if required; not invented in git |
| Social recovery not production-authorized | Created / documented only |

## Economic / product

| Limitation | Note |
| --- | --- |
| Public mint not open | Policy + execution gates; UI disabled |
| DEX pair may exist with **empty** reserves | Technical readiness without liquidity event |
| Yield / staking / bridge not production-activated on public claims | Gated |
| Controlled mint history ≠ public open | Historical receipts are evidence of process, not a live launch |

## What this does **not** mean

Limitations are not invitations to:

- seed liquidity “to finish the empty pool”  
- flip mint flags without governance GO  
- treat chat confidence as on-chain truth  

---

*Known limitations — honesty for external verifiers.*
