# Verification Portal v1

**Phase:** 8.4 — Public Verification (current)  
**Mode:** PUBLIC WORKFLOW — not an activation path  
**Objective:** Make the project independently verifiable.

```text
Before: Can the creator prove what was built?
Now:    Can others verify what was built without trusting the creator?
```

### Public conclusion

> Phase 8 establishes the project's trust foundation. From this point, progress is measured less by new internal documentation and more by independent, reproducible verification. The next milestone is demonstrating that different reviewers, on different systems, can execute the same verification process and reach the same conclusions. Economic functionality—including minting and liquidity—remains intentionally disabled until a separate governance authorization is satisfied.

**Internal vs external language:** Receipts may record project milestones as “sealed.” That is **project governance terminology**, not an external certification. Multi-report consensus is **verification evidence** for later governance review—not an auto-mint unlock.

**Reproducibility and governance (scoped claim):** Reproducible verification is a strong technical maturity signal. “Other people, other machines, same conclusions” provides a **strong technical foundation** for future governance discussions about economic activation—it does **not** determine whether or when economics should be enabled. Adoption, funding, and community trust remain separate questions beyond technical quality alone.

**Refinement:** completing 8.4 does **not** require a single magical external report. 8.4 delivers the **public surface**. **Phase 8.5** runs a **multi-report** architecture (quorum, diversity, conflict resolution, SLA) so verification is consensus-driven before Phase 9.0 — not a second single gatekeeper.

---

## Phase 8.4 deliverables

| Deliverable | Location |
| --- | --- |
| Public verification portal | https://quantumpiforge.com/deployed-addresses · this pack |
| Deployed contract registry | [CONTRACT_REGISTRY_V1.md](../CONTRACT_REGISTRY_V1.md) |
| Builder quickstart | [BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md) |
| Governance documentation | Safe policy · security boundaries |
| Mint authority explanation | [MINT_AUTHORITY_EXPLANATION_V1.md](../governance/MINT_AUTHORITY_EXPLANATION_V1.md) |
| Clear operational status | [ACTIVATION_STATUS.md](../ACTIVATION_STATUS.md) — mint/liquidity/launch **NOT AUTHORIZED** |

## Phase 8.4 success criteria

- [ ] A third party can **locate** every deployed contract (portal + registry).  
- [ ] A third party can **reproduce** the published verification steps.  
- [ ] Documentation is **internally consistent** (site ↔ registry ↔ receipts posture).  

## Portal map

```text
Verification Portal
├── Deployed addresses (live site)
├── Contract registry
├── Verification guide
├── Builder quickstart
├── Governance boundaries
├── Known limitations
└── Submit a verification report
```

| Piece | Link |
| --- | --- |
| **Live portal** | https://quantumpiforge.com/deployed-addresses |
| **Portal index** | this document |
| **Contract registry** | [docs/CONTRACT_REGISTRY_V1.md](../CONTRACT_REGISTRY_V1.md) |
| **Verification guide** | [FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md) |
| **Independent process (8.5)** | [INDEPENDENT_VERIFICATION_PROCESS_V1.md](./INDEPENDENT_VERIFICATION_PROCESS_V1.md) |
| **Builder quickstart** | [docs/BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md) |
| **Genesis entry** | [docs/GENESIS_VERIFICATION_V1.md](../GENESIS_VERIFICATION_V1.md) |
| **Activation status** | [docs/ACTIVATION_STATUS.md](../ACTIVATION_STATUS.md) |
| **Governance boundaries** | [SECURITY_BOUNDARIES_V1.md](../SECURITY_BOUNDARIES_V1.md) · [SAFE_GOVERNANCE_POLICY_V1.md](../governance/SAFE_GOVERNANCE_POLICY_V1.md) · [MINT_AUTHORITY_EXPLANATION_V1.md](../governance/MINT_AUTHORITY_EXPLANATION_V1.md) |
| **Known limitations** | [KNOWN_LIMITATIONS_V1.md](./KNOWN_LIMITATIONS_V1.md) |
| **Submit a report** | [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md) → [open issue](https://github.com/onenoly1010/Quantum-pi-forge/issues/new) |

---

## Current governed state (must still hold after you verify)

| Claim | Expected finding |
| --- | --- |
| Mint activation | **NOT AUTHORIZED** |
| Liquidity activation | **NOT AUTHORIZED** |
| Economic launch | **NOT AUTHORIZED** |
| Technical contracts on 16661 | **Live** (bytecode present) |
| Docs on `main` | Genesis + Safe policy + mint authority explanation |

```text
Capability  ≠  Permission  ≠  Activation
```

---

## Minimal independent path (no project knowledge required)

1. Open https://quantumpiforge.com/deployed-addresses  
2. Note chain ID **16661**, RPC `https://evmrpc.0g.ai`, disabled mint/signing  
3. Pick one token address → check code on https://chainscan.0g.ai  
4. Optionally re-run the RPC curls in [FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md)  
5. File a report using [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md)  

**Success:** independent confirmation (or honest drift report).  
**Not success:** a transaction executed.

---

## Phase roadmap (external evidence lane)

```text
Phase 8.4  Public Verification Portal
        ↓
Phase 8.5  Independent Verification Reports  (multiple over time)
        ↓
Phase 8.6  Builder Reproducibility
        ↓
Phase 8.7  Operational Readiness
        ↓
Phase 9.0  Governance Decision
        ↓
Future activation decisions (if approved)
```

| Phase | Objective | Success criterion |
| --- | --- | --- |
| **8.4** | Public verification | Locate contracts; reproduce steps; docs consistent |
| **8.5** | Independent reports | Multi-report consensus (proposed \(m=3\)); diversity; conflict protocol; SLA — see architecture doc |
| **8.6** | Builder reproducibility | Clean clone; deps; docs; expected outputs match |
| **8.7** | Operational readiness | Monitoring, recovery, incident, release — **no** token economics |
| **9.0** | Governance decision | Based on **evidence from 8.4–8.7**, not schedule alone |

Internal activation-policy docs after 8.3 are **paused**.

---

## Related seals

- `FIRST_EXTERNAL_VERIFICATION_READY` — invitation sealed  
- `PHASE_8_3_MINT_AUTHORITY_EXPLANATION_SEALED` — authority explained, not exercised  
- `PHASE_8_2_SAFE_GOVERNANCE_POLICY_SEALED` — control constraints  

---

*Phase 8.4 — public verification workflow. Restraint remains the evidence.*
