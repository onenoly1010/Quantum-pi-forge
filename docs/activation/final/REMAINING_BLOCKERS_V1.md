# Remaining Blockers v1 (finite)

**Rule:** Each blocker has root cause, evidence, and recommended resolution. No infinite reopen.

---

### B-01 Dual on-chain address sets (canon ambiguity)

| Field | Content |
| --- | --- |
| **Status** | BLOCKED (public canon / activation language) |
| **Root cause** | Broadcast CREATE set ≠ docs/public-mint set; both have code on Aristotle |
| **Evidence** | `contracts/DEPLOYED_ADDRESSES.md`; `docs/activation/evidence/G-05-*` |
| **Impact** | Public mint prompts, human doorway, and deploy receipts can disagree on “the” token |
| **Resolution** | Human selects **one** canon set (or explicitly documents both as historical + active). Update wallet prompts + public HTML to match. Re-run **only** G-05 matrix row checks after change |

**Broadcast (CREATE verified):**

- OINIOToken `0x709f23C7A7172E137427576abB5Eb8959E2A57c1` — bytecode **MATCH** current artifact  
- Registry `0x25A9C5A244EAf688E078C387616e2380A0589562`  
- Heartbeat `0xd1d5147f38E74855a133Cd75cE7b040eBE6324a0`  

**Docs/mint prompts (code present, not broadcast CREATE):**

- OINIOToken `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58`  
- Registry `0x67aD7169184581f23D1E10B39d4eb4e98293E87a`  
- Heartbeat `0x5E50b92E57e854659f7D98c733088aABd551C49F`  

---

### B-02 Untrusted owner on Ownable contracts

| Field | Content |
| --- | --- |
| **Status** | BLOCKED (security / Phase 7) |
| **Root cause** | `owner()` → `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` (documented untrusted/frozen) |
| **Evidence** | G-05 eth_call owner probes; `docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md` |
| **Impact** | Admin/owner paths not guardian-Safe controlled |
| **Resolution** | Confirm guardian Safe on Aristotle; plan ownership transfer only under human authorization + fresh receipts. Do not automate |

---

### B-03 Incomplete local bytecode match (Registry / Heartbeat / docs token)

| Field | Content |
| --- | --- |
| **Status** | BLOCKED (full “verified deployment” claim) |
| **Root cause** | Current `contracts/out` artifacts hash ≠ on-chain runtime except broadcast OINIOToken |
| **Evidence** | `G-05-bytecode-compare-*.json` |
| **Impact** | Cannot claim full source↔chain identity for all contracts |
| **Resolution** | Recover deploy-time commit/compiler settings; rebuild; re-compare. Or pin artifact hashes from deploy era |

---

### B-04 Interactive wallet acceptance suite missing

| Field | Content |
| --- | --- |
| **Status** | BLOCKED (operational wallet readiness) |
| **Root cause** | No automated/browser E2E for MetaMask scenarios; WC/Safe/HW not integrated as deps |
| **Evidence** | `WALLET_VERIFICATION_REPORT_V1.md`; package.json has `ethers` only |
| **Impact** | Prior MetaMask issues cannot be closed as PASS |
| **Resolution** | Run manual or Playwright acceptance checklist (report § scenarios); record PASS/FAIL per scenario with screenshots/logs. Code changes only with linked issue + regression proof |

---

### B-05 Empty security headers file

| Field | Content |
| --- | --- |
| **Status** | OPEN residual (security hardening) |
| **Root cause** | `deploy/_headers` and `out/_headers` are **0 bytes** |
| **Evidence** | `wc -c deploy/_headers out/_headers` → 0 |
| **Impact** | No CSP/security headers from Pages `_headers` mechanism |
| **Resolution** | Author CSP/security headers; rebuild; verify on deploy host. Not required to invent content in this stop |

---

### B-06 Gate evidence uncommitted

| Field | Content |
| --- | --- |
| **Status** | OPEN (repo hygiene) |
| **Root cause** | No auto-commit after G-05–G-08 evidence generation |
| **Evidence** | `git status` dirty list |
| **Impact** | Evidence not yet durable in git history |
| **Resolution** | See `RECOMMENDED_COMMIT_PLAN_V1.md` — human authorize only |

---

### Explicitly NOT blockers for “parked verification”

| Item | Why not blocking parked verification |
| --- | --- |
| Hosted CI green | Local verifiers are canon when hosted CI drifts |
| Live yield/staking | Intentionally gated |
| Pi mainnet bridge | Planned / experimental |

---

## Recommended resolution order

1. B-01 canon address decision (unblocks truthful public language)  
2. B-02 guardian ownership plan (unblocks trust)  
3. B-04 wallet acceptance (unblocks UX claims)  
4. B-03 bytecode pin (unblocks “fully verified” language)  
5. B-05 headers (hardening)  
6. B-06 commit evidence (durability)  
