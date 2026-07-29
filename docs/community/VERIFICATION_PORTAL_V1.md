# Verification Portal v1

**Phase:** 8.4 — Verification Portal & First Independent Verification  
**Mode:** PUBLIC WORKFLOW — not an activation path  
**Success metric:** Someone unfamiliar with QPF can independently reproduce the published state.

```text
Before Phase 8.x: Can the creator prove what was built?
Phase 8.4:        Can someone else verify what was built without trusting the creator?
```

---

## Portal map

```text
Verification Portal
├── Deployed addresses (live site)
├── Contract registry
├── Verification guide (this phase)
├── Builder quickstart
├── Governance boundaries
├── Known limitations
└── Submit a verification report
```

| Piece | Link |
| --- | --- |
| **Live portal** | https://quantumpiforge.com/deployed-addresses |
| **Deployed addresses (source)** | `deploy/deployed-addresses.html` |
| **Contract registry** | [docs/CONTRACT_REGISTRY_V1.md](../CONTRACT_REGISTRY_V1.md) |
| **Verification guide** | [docs/community/FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md) |
| **Builder quickstart** | [docs/BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md) |
| **Genesis entry** | [docs/GENESIS_VERIFICATION_V1.md](../GENESIS_VERIFICATION_V1.md) |
| **Activation status** | [docs/ACTIVATION_STATUS.md](../ACTIVATION_STATUS.md) |
| **Governance boundaries** | [docs/SECURITY_BOUNDARIES_V1.md](../SECURITY_BOUNDARIES_V1.md) · [SAFE_GOVERNANCE_POLICY_V1.md](../governance/SAFE_GOVERNANCE_POLICY_V1.md) · [MINT_AUTHORITY_EXPLANATION_V1.md](../governance/MINT_AUTHORITY_EXPLANATION_V1.md) |
| **Known limitations** | [docs/community/KNOWN_LIMITATIONS_V1.md](./KNOWN_LIMITATIONS_V1.md) |
| **Submit a report** | [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md) → open a GitHub issue |

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

## Phase roadmap (external validation lane)

| Phase | Objective | Success criterion |
| --- | --- | --- |
| **8.4** | Verification portal & first verification | Independent person follows public docs and verifies deployed state without builder assistance |
| **8.5** | Builder experience | Fresh clone + documented tooling reproduce published results |
| **8.6** | Community validation | External issues, bug reports, doc improvements, or verification reports |
| **8.7** | Operational readiness | Recovery, Safe process, monitoring, incident docs **without** enabling token economics |
| **9.0** | Governance review | All technical, operational, and community gates reviewed **before** any economic activation discussion |

Internal activation-policy docs after 8.3 are **paused**. Effort shifts to independent evidence.

---

## Related seals

- `FIRST_EXTERNAL_VERIFICATION_READY` — invitation sealed  
- `PHASE_8_3_MINT_AUTHORITY_EXPLANATION_SEALED` — authority explained, not exercised  
- `PHASE_8_2_SAFE_GOVERNANCE_POLICY_SEALED` — control constraints  

---

*Phase 8.4 — public verification workflow. Restraint remains the evidence.*
