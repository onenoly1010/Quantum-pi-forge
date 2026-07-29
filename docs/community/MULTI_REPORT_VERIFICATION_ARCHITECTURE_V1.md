# Multi-Report Verification Architecture v1

**Phase:** 8.5  
**Mode:** GOVERNANCE PROCESS ARCHITECTURE — not an on-chain mint gate  
**Does not authorize:** mint, liquidity, signing, broadcast, or economic launch  

---

## Why multi-report (not single-gate)

A **single** independent verification is valuable but fragile:

| Failure mode | Risk of one verifier |
| --- | --- |
| Single point of failure | One busy, compromised, or mistaken reviewer blocks or falsely clears the signal |
| Collusion | One “external” party can be the builder under another name |
| Localized environment errors | Wrong RPC, cached page, regional DNS, or stale deploy misleads one observer |
| Trust substitution | Replacing “trust the builder” with “trust verifier A” is still a gatekeeper model |

**Multi-report independent verification** moves Phase 8.5 from a gatekeeper model toward a **consensus-of-evidence** model before Phase 9.0 governance review.

```text
One report   →  weak / informative signal
Many independent reports that agree  →  strong evidence for 9.0
Disagreeing reports  →  halt / escalate (do not auto-activate anything)
```

This architecture **does not** automatically open mint. It strengthens the **evidence pipeline** that Phase 9.0 will read.

---

## Scope of verification (what multi-reports cover)

Independent reviewers check (see also [INDEPENDENT_VERIFICATION_PROCESS_V1.md](./INDEPENDENT_VERIFICATION_PROCESS_V1.md)):

1. Contract addresses (portal + registry)  
2. Deployed bytecode presence (and optional digests)  
3. Governance documentation presence and readability  
4. Evidence receipts vs claimed posture (mint/liquidity **NOT AUTHORIZED**)  
5. Optional: build / `verify:evidence` instructions  

Expected agreed state if the published reality is correct:

```text
Mint activation:       NOT AUTHORIZED
Liquidity activation:  NOT AUTHORIZED
Economic launch:       NOT AUTHORIZED
Technical contracts:   LIVE on chain 16661
```

---

## 1. Quorum and thresholds

### Definitions

| Symbol | Meaning |
| --- | --- |
| \(n\) | Number of **accepted** independent verification reports in the window |
| \(m\) | Minimum number of **agreeing** reports required for a “consensus signal” |
| **Agree** | Same core findings on addresses, chain ID, code present, and economic gates **NOT AUTHORIZED** (or same documented drift set) |

### Proposed initial parameters (v1 — governance may reseal)

| Parameter | Proposed value | Rationale |
| --- | --- | --- |
| Minimum \(m\) for “8.5 consensus signal” | **3** | Above single-point; achievable for a small project |
| Soft target \(n\) | **≥ 3 distinct entities** | Matches \(m\) without over-engineering |
| Single report | **Informational only** | May seed 8.5; does **not** alone satisfy multi-report architecture |
| Phase 9.0 “evidence sufficient” | At least one **closed consensus window** with \(m\) agreements and no unresolved critical drift | Not a calendar date |

**Fail closed for economic claims:** if \(n < m\) or agreement &lt; \(m\), Phase 9.0 must **not** treat verification as “externally settled.”

### What a “pass” of multi-report means

| Result | Meaning |
| --- | --- |
| **CONSENSUS_CONFIRMED** | ≥ \(m\) independent reports agree on published state (or same minor non-blocking notes) |
| **CONSENSUS_DRIFT** | ≥ \(m\) reports agree that documentation/site **does not** match chain (actionable fix) |
| **NO_CONSENSUS** | Fewer than \(m\) reports, or conflicting findings without resolution |
| **WINDOW_EXPIRED** | SLA elapsed without \(m\) agreements (fail closed for 9.0 verification claim) |

None of these results flip `mint_allowed` or seed liquidity.

---

## 2. Verification diversity (anti-Sybil)

Reports must be attributable to **distinct** entities. Identity can be pseudonymous but must be **hard to forge in bulk**.

### Diversity requirements (v1)

A report is **eligible** for the quorum set only if:

| Check | Requirement |
| --- | --- |
| **Distinct identity** | Different GitHub account **or** other attested identity channel than other counted reports |
| **No self-collusion with builder** | Builder / core maintainer accounts do **not** count toward \(m\) (they may file **baseline** reports labeled `ROLE=MAINTAINER_BASELINE`) |
| **Method diversity (preferred)** | Prefer mix of methods across the set: browser+explorer, RPC curl, full clone+scripts — not five copy-paste clones of one method |
| **Temporal diversity (preferred)** | Prefer reports spanning different days / deploys when practical |
| **Geographic / infra diversity (optional)** | Different networks/RPCs noted if relevant to a discrepancy |

### Sybil resistance (lightweight, process-level)

| Control | Practice |
| --- | --- |
| Account age / activity | Prefer accounts with prior public history; brand-new accounts may be marked `SYBIL_RISK` and excluded from \(m\) unless vouched |
| Cryptographic optional | Optional: signed statement (wallet signature of a fixed verification digest) attached to the issue — **does not** move funds; increases distinctness |
| Maintainer adjudication | Maintainers may exclude reports from the quorum set with a written reason (sockpuppet, incomplete checklist, copy of another report) |
| Disclosure | If two reports share the same human (disclosed), count as **one** independent entity |

**Sybil rule of thumb:** if independence cannot be reasonably defended, do not count the report toward \(m\).

---

## 3. Conflict resolution

When multi-reports **disagree**:

### Classification

| Conflict type | Example |
| --- | --- |
| **Critical** | Different chain ID; code missing at published address; mint claimed open when policy says closed |
| **Material** | Registry vs portal address mismatch; empty pool vs reserves non-zero |
| **Minor** | Typos, outdated secondary links, Pages lag after merge |

### Protocol (v1)

```text
1. Freeze  — Do not treat the window as CONSENSUS_CONFIRMED
2. Index  — Link all conflicting issues in a maintainer note
3. Re-probe — Maintainer or a new independent verifier re-runs RPC/explorer checks (read-only)
4. Classify — critical / material / minor
5. Resolve:
     critical or material → FAIL CLOSED for 9.0 verification claim until fixed + re-verified
     minor → document; may still reach consensus on core claims if ≥ m agree on core
6. Optional escalation — Additional independent verifiers (raise effective m) to break ties
7. Never auto-activate — Disagreement never triggers mint, liquidity, or “force pass”
```

| Outcome | Next action |
| --- | --- |
| Critical drift confirmed | Fix docs/site/registry; open new verification window |
| False alarm (one bad report) | Mark report `INVALID` or `ENV_ERROR`; do not count toward \(m\) |
| Irreducible conflict | **Halt** Phase 9.0 verification claim; manual governance review only |

**Default bias:** fail closed on economic language; fail open only on **inviting more verifiers**, never on activation.

---

## 4. Time-to-Verify (SLA)

### Window model

| Parameter | Proposed v1 | Meaning |
| --- | --- | --- |
| **Window open** | When maintainers announce a verification round (or continuously for rolling 8.5) | Start collecting eligible reports |
| **Soft SLA** | **14 days** | Target time to gather ≥ \(m\) independent agreements |
| **Hard SLA** | **30 days** per announced round | If \(m\) not met → `WINDOW_EXPIRED` |
| **Rolling mode** | Always open | No hard fail; consensus = anytime \(m\) eligible agreements within a **90-day** sliding lookback for 9.0 review packs |

### On timeout

| Mode | Behavior |
| --- | --- |
| Announced round + hard SLA | **Fail closed** for that round’s “externally settled” claim; keep inviting; do not activate |
| Rolling mode | No auto-fail; Phase 9.0 simply lacks a fresh consensus pack if lookback empty |
| Partial results | Publish count: \(n\) reports, \(k\) agreements; transparency without fake consensus |

### Fallback mechanisms (allowed)

| Fallback | Not a fallback |
| --- | --- |
| Extend window with public note | Open mint to “unblock” |
| Request additional independent verifiers | Accept maintainer-only self-verification as multi-report |
| Fix docs and restart window | Ignore critical drift |

---

## Lifecycle (implementation sketch)

```text
8.4 Portal live
      ↓
8.5 Open (rolling or announced window)
      ↓
Reports filed (template + process)
      ↓
Eligibility filter (diversity / anti-Sybil)
      ↓
Agreement count vs m
      ↓
  ┌── CONSENSUS_CONFIRMED → index for 8.6/8.7/9.0 evidence pack
  ├── CONSENSUS_DRIFT     → fix → new window
  ├── NO_CONSENSUS        → invite more / wait SLA
  └── WINDOW_EXPIRED      → fail closed for that round; retry
```

Builder reproducibility (8.6) and operational readiness (8.7) then exercise a pipeline that already expects **multi-party evidence**, not a single trusted reviewer.

---

## Explicit non-goals

- On-chain automatic mint unlock from report count  
- Trusted setup that replaces human governance at 9.0  
- Counting sockpuppets or maintainer duplicates toward \(m\)  
- Using SLA timeout as a reason to activate economics  

---

## Related

| Doc | Role |
| --- | --- |
| [INDEPENDENT_VERIFICATION_PROCESS_V1.md](./INDEPENDENT_VERIFICATION_PROCESS_V1.md) | How to file a report |
| [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md) | Issue body template |
| [VERIFICATION_PORTAL_V1.md](./VERIFICATION_PORTAL_V1.md) | Public portal map (8.4) |
| [ACTIVATION_ROADMAP.md](../ACTIVATION_ROADMAP.md) | Phase order |
| [MINT_AUTHORITY_EXPLANATION_V1.md](../governance/MINT_AUTHORITY_EXPLANATION_V1.md) | Why mint stays closed |

---

*Phase 8.5 multi-report architecture — consensus of evidence, fail closed on activation claims.*
