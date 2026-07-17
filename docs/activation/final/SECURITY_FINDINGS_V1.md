# Security Findings v1

**Scope:** Activation-lane security evidence. Not a full third-party audit.

## Findings

### S-01 Owner is historically untrusted wallet — **HIGH**

| Field | Content |
| --- | --- |
| **Evidence** | G-05 `owner()` → `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` on token/registry/heartbeat probes |
| **Context** | Same address flagged in `docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md` |
| **Risk** | If Ownable admin functions remain reachable, control plane is not guardian-Safe |
| **Status** | Open residual (B-02) |
| **Action** | Human-led ownership / Safe migration plan; no automatic transfer |

### S-02 Dual deployment identity — **MEDIUM**

| Field | Content |
| --- | --- |
| **Evidence** | Two full address sets with code; wallet prompts use docs set; broadcast matches artifact for token only |
| **Risk** | Users may approve/spend against wrong contract |
| **Status** | Open (B-01) |
| **Action** | Canon decision + update all prompts/UI |

### S-03 Empty `_headers` — **LOW–MEDIUM**

| Field | Content |
| --- | --- |
| **Evidence** | `deploy/_headers` and `out/_headers` size 0 |
| **Risk** | No CSP/HSTS/etc. from Cloudflare Headers file |
| **Status** | Open (B-05) |

### S-04 DAO chain switch swallows errors — **LOW–MEDIUM**

| Field | Content |
| --- | --- |
| **Evidence** | `deploy/dao.html` `wallet_switchEthereumChain` `.catch(() => {})` |
| **Risk** | User continues on wrong chain without clear failure |
| **Status** | Documented; fix only with linked issue + regression test |

### S-05 Signing intentionally blocked — **POSITIVE CONTROL**

| Field | Content |
| --- | --- |
| **Evidence** | Phase-32 gate `NO_GO_SIGNING_NOT_AUTHORIZED`; wallet preflight PASS non-executing |
| **Risk** | N/A — protective |
| **Status** | Working as designed |

### S-06 Dependency audit clean (snapshot) — **POSITIVE**

| Field | Content |
| --- | --- |
| **Evidence** | `npm audit` total vulnerabilities **0** at G-07 probe |
| **Status** | Snapshot only; re-check when lockfile changes |

### S-07 No private keys in agent env / no tracked root `.env` — **POSITIVE**

| Field | Content |
| --- | --- |
| **Evidence** | G-01/G-07 checks |
| **Status** | Snapshot |

### S-08 XSS/CSRF full suite — **NOT RUN**

| Field | Content |
| --- | --- |
| **Status** | Residual — do not claim covered |

## Security verdict for activation

Safe to claim: **parked, non-executing, evidence-first posture with known high residual on ownership and address canon.**  

Unsafe to claim: **production-ready wallet + admin security.**
