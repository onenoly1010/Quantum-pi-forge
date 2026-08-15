# Independent Verification Process v1

**Phase:** 8.5 **Round 1 OPEN** (process active; reports accumulate into the ledger)  
**Mode:** REPEATABLE EXTERNAL PROCESS — not a transaction  
**Principle:** One independent verification is valuable but **fragile** (single point of failure, collusion, local env error). **Multiple independent reports** move 8.5 from a gatekeeper model toward consensus-of-evidence before Phase 9.0.  
**Architecture:** [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md) — quorum \(m\), diversity, conflict resolution, SLA.  
**Report index:** [verification-reports/INDEX_V1.md](./verification-reports/INDEX_V1.md) · **Round 1:** [PHASE_8_5_ROUND1_ACTIVATION_V1.md](./PHASE_8_5_ROUND1_ACTIVATION_V1.md)

---

## Purpose

Define how independent reviewers verify QPF without builder hand-holding, and how the project captures those results as evidence.

```text
SUCCESS: external confirmation of published reality (or honest drift)
NOT SUCCESS: activation transaction executed
NOT SUFFICIENT FOR 9.0: a single external report alone
```

---

## What to verify (checklist for reviewers)

| Area | What to check |
| --- | --- |
| **Contract addresses** | Listed on portal + [CONTRACT_REGISTRY_V1.md](../CONTRACT_REGISTRY_V1.md); explorers resolve |
| **Deployed bytecode** | `eth_getCode` non-empty; optional SHA-256 vs registry digests |
| **Governance documentation** | Safe policy, mint authority explanation, security boundaries present and readable |
| **Evidence receipts** | Sample receipts under `receipts/governance/` match claimed posture (mint/liquidity not open) |
| **Build / verify instructions** | Optional: clone + [BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md) / `npm run verify:evidence` |

Expected operational status after a correct verification:

```text
Mint activation:       NOT AUTHORIZED
Liquidity activation:  NOT AUTHORIZED
Economic launch:       NOT AUTHORIZED
Technical contracts:   LIVE on chain 16661
```

---

## Capture fields (every report)

Use [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md) and open a GitHub issue.

| Field | Required |
| --- | --- |
| Date (UTC) | Yes |
| Reviewer (name, handle, or anonymous ID) | Yes |
| Method (browser / RPC / clone) | Yes |
| What was verified (tick areas above) | Yes |
| Discrepancies | Yes (or “none”) |
| Resolution (if project responds) | When applicable |

Issue title pattern:

```text
External verification: YYYY-MM-DD
```

---

## Accumulation (multi-report — not a single gate)

| Signal | Meaning |
| --- | --- |
| 0 eligible reports | 8.4 complete; Round 1 open; 8.5 consensus **NOT_STARTED** |
| 1 eligible report | Valuable **but** single-point risk — keep inviting; does **not** alone settle 9.0 verification evidence |
| \(m\) agreeing independent reports (proposed **\(m = 3\)**) | **CONSENSUS_CONFIRMED** (or **CONSENSUS_DRIFT**) — see architecture doc |
| Conflicting reports | **Halt** consensus claim; conflict-resolution protocol; never auto-activate |
| Window expired without \(m\) | Fail closed for that round’s “externally settled” claim |

**Proposed quorum (v1):** minimum **3** independent, diversity-eligible agreements. Full parameters (diversity, SLA, conflicts): [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md).

Project maintainers may index reports in `docs/community/verification-reports/` or link issues from a short index when volume warrants — without inventing verifiers or counting Sybils toward \(m\).

---

## Boundaries

Reviewers and maintainers **do not** use this process to:

- open mint or seed liquidity  
- request seed phrases or private keys  
- treat a single PASS as economic authorization  
- treat multi-report consensus as automatic mint unlock (Phase 9.0 is still a separate human governance decision)  

---

## Related

- **Multi-report architecture:** [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md)  
- **PR #737 gate policy:** [../governance/PR_737_CONFORMANCE_AND_REPRODUCIBILITY_GATES_V1.md](../governance/PR_737_CONFORMANCE_AND_REPRODUCIBILITY_GATES_V1.md)  
- Portal: [VERIFICATION_PORTAL_V1.md](./VERIFICATION_PORTAL_V1.md)  
- Guide: [FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md)  
- Template: [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md)  
- Limitations: [KNOWN_LIMITATIONS_V1.md](./KNOWN_LIMITATIONS_V1.md)  
- Roadmap: [ACTIVATION_ROADMAP.md](../ACTIVATION_ROADMAP.md)  

---

*Phase 8.5 process — consensus of independent evidence; fail closed on activation claims.*
