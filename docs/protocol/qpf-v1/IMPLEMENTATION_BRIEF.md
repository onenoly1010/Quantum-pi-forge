# Quantum Pi Forge Verification Protocol — Implementation Brief

You are implementing the Quantum Pi Forge Verification Protocol v1 inside the existing repository.

## Primary directive

Do **NOT** redesign the protocol.

Do **NOT** replace the protocol with a generic AI-agent framework.

Do **NOT** treat model output as trusted.

Do **NOT** introduce centralized authority where the specification defines local or content-addressed verification.

Treat `docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md` as the architectural source of truth.

Before changing code:

1. Inspect the existing repository.  
2. Identify existing verification, evidence, governance, receipt, hashing, deployment, and CI components.  
3. Reuse existing infrastructure where compatible.  
4. Identify conflicts between the existing implementation and this protocol.  
5. Produce an implementation plan before making broad changes.  

**Baseline inspection:** see [REPOSITORY_INSPECTION.md](./REPOSITORY_INSPECTION.md) (completed for protocol packaging).

## Architectural invariants

```text
MODEL / AGENT           → proposes
DETERMINISTIC ENVELOPE  → constrains authority and execution
ARTIFACT                → produced object
RECEIPT                 → proves execution conditions
ATTESTATION             → expands provenance
EVIDENCE BUNDLE         → packages content-addressed evidence
VERIFY SKILL            → machine-readable verification
TRUST ROOT              → bootstrap trust
KEY LIFECYCLE           → signing identities
TRUST POLICY            → contextual acceptance
VERIFICATION RESULT     → current verification computation
VERIFICATION RECEIPT    → signed historical verification event
GOVERNANCE              → final contextual decision
```

## Implementation order

Implement in this **exact** order:

1. Canonical serialization  
2. Hashing utilities  
3. Receipt schema and validator  
4. Policy binding  
5. Attestation schema and validator  
6. Evidence object / bundle handling  
7. Trust root and key records  
8. Key lifecycle validation  
9. Trust policy parser and evaluator  
10. Verification semantics and result codes  
11. Verify interface  
12. Verifier profile  
13. Capability negotiation (**DEFERRED** until 1–12 solid)  
14. Verification receipt  
15. End-to-end verification pipeline  
16. Test vectors  
17. Documentation  
18. CLI/API integration  

## Cryptographic requirements

- **BLAKE3** for content hashing (primary)  
- **Ed25519** for signatures  
- **JCS** (or explicitly specified deterministic encoding)  

Never hash non-canonical JSON when the protocol requires canonical serialization.  
Never sign a mutable or ambiguously serialized representation.

## Fail-closed behavior

Distinguish: `pass` | `fail` | `partial` | `unavailable`.

Missing information MUST NOT automatically become cryptographic failure.  
Known violations MUST produce `fail`.

## Model boundary

Models may appear in execution metadata.

Models MUST NOT:

- become trust roots  
- become signing authorities  
- authorize arbitrary execution  
- override policy  
- override verification results  
- make governance decisions  

## Implementation discipline

For each milestone:

1. Inspect existing code.  
2. State the files that will change.  
3. Implement the smallest coherent change.  
4. Add tests.  
5. Run the relevant tests.  
6. Report failures honestly.  
7. Do not silently modify unrelated architecture.  
8. Do not claim verification that was not actually performed.  
9. **Stop** — do not auto-advance to the next milestone.  

## Deliverable

A complete, independently testable pipeline:

```text
artifact → receipt → attestation → evidence bundle
  → trust resolution → policy evaluation
  → verification semantics → verification result
  → signed verification receipt
```

Usable offline when trust records, evidence, and verifier capabilities are local.

## Milestone gating prompt (for agents)

```text
Implement milestone N only.
Make the smallest coherent changes.
Add tests.
Run the tests.
Do not proceed to milestone N+1.
```

---

## First session requirement (completed for packaging)

Repository inspection only — no protocol implementation yet.

Return:

1. Existing relevant components  
2. Existing hashing/signature infrastructure  
3. Existing receipt/evidence infrastructure  
4. Existing governance infrastructure  
5. Conflicts with this protocol  
6. Missing components  
7. Proposed file-level implementation plan  
8. Test strategy  
9. First implementation milestone  

→ See [REPOSITORY_INSPECTION.md](./REPOSITORY_INSPECTION.md)
