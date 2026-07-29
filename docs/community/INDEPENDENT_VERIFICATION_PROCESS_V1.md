# Independent Verification Process v1

**Phase:** 8.5 (process definition; reports accumulate after 8.4 portal is public)  
**Mode:** REPEATABLE EXTERNAL PROCESS — not a transaction  
**Principle:** One independent verification is valuable. **Multiple** independent verifications are the stronger signal. A single report is **not** the only gate.

---

## Purpose

Define how independent reviewers verify QPF without builder hand-holding, and how the project captures those results as evidence.

```text
SUCCESS: external confirmation of published reality (or honest drift)
NOT SUCCESS: activation transaction executed
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

## Accumulation (not a single gate)

| Signal | Meaning |
| --- | --- |
| 0 reports | 8.4 infrastructure may exist; 8.5 not yet evidenced |
| 1 report | Valuable first signal — keep inviting more |
| 2+ independent reports | Stronger evidence for later 9.0 review |
| Drift reports | Successful verification events if method + timestamps are clear |

Project maintainers may index reports in `docs/community/verification-reports/` or link issues from a short index when volume warrants — without inventing verifiers.

---

## Boundaries

Reviewers and maintainers **do not** use this process to:

- open mint or seed liquidity  
- request seed phrases or private keys  
- treat a single PASS as economic authorization  

---

## Related

- Portal: [VERIFICATION_PORTAL_V1.md](./VERIFICATION_PORTAL_V1.md)  
- Guide: [FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md)  
- Limitations: [KNOWN_LIMITATIONS_V1.md](./KNOWN_LIMITATIONS_V1.md)  
- Roadmap: [ACTIVATION_ROADMAP.md](../ACTIVATION_ROADMAP.md)  

---

*Phase 8.5 process — measurable external evidence over internal assertion.*
