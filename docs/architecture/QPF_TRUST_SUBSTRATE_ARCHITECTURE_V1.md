# QPF Trust-Substrate Architecture v1

| Field | Value |
| --- | --- |
| Status | **SPECIFIED** architectural distinction — not a protocol freeze, not an activation |
| Document type | Architecture specification |
| Authority | Composes existing QPF canon; does **not** replace `docs/protocol/qpf-v1/` |
| Mode | Design / boundary document |
| Economic effect | None. Does not authorize mint, liquidity, staking, bridge, credentials, or settlement |
| Date | 2026-09-04 |

**Claim-status vocabulary used in this document**

| Label | Meaning |
| --- | --- |
| `IMPLEMENTED` | Present in repository code or executable scripts and locally exercisable |
| `SPECIFIED` | Normative or constraint text exists; implementation may be partial or absent |
| `EXPERIMENTAL` | Present as a path, kit, or rehearsal; not a production trust root |
| `PROPOSED` | Introduced by this document as an architectural reading of existing canon |
| `UNVERIFIED` | Not established by repository evidence |

This document is **not** marketing copy. Present-tense capability claims are limited to what the repository already implements or specifies.

---

## 1. Purpose

Codify Quantum Pi Forge’s structural distinction from model-centric AI organizations.

**Thesis (architectural intent, `PROPOSED` as a framing; grounded in existing protocol invariants):**

> QPF is not a model factory. It is a verification substrate.

The intended engineering question is not “which model is best?” It is:

> Can an independent verifier reproduce and validate the evidence supporting a claimed state transition, without trusting the originating model, agent, host, or economic platform?

This document:

- separates model, agent, identity/provenance, verification, authorization, execution, and settlement;
- records what the repository already implements versus what it only specifies;
- preserves frozen protocol semantics;
- does **not** treat architectural intent as externally demonstrated adoption.

**Normative source of verification semantics:** `docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md` (`SPECIFIED`, draft freeze of layers 1–10).

**Implemented verification slice:** `src/verification/` Level 0 (`IMPLEMENTED`: artifact location, receipt structure, content-hash binding). Levels 1+ remain unimplemented.

---

## 2. Architectural Thesis

### 2.1 Model factory (contrast class)

A model-centric organization sells or operates intelligence as the primary product:

```text
CAPITAL → COMPUTE → MODEL → USERS → REVENUE
```

Competitive position in that class depends on continued access to compute, data, research talent, and deployment infrastructure. This document makes **no quantitative cost claims**.

QPF may *use* models. QPF is not architecturally defined as the manufacturer of those models.

### 2.2 Verification substrate (QPF class)

A verification-centric organization evaluates evidence about work performed elsewhere:

```text
AGENTS → EVIDENCE → VERIFICATION → TRUST → ECOSYSTEM VALUE
```

“Ecosystem value” here is a **design position**, not a measured market outcome (`UNVERIFIED` as adoption/revenue).

QPF’s intended position does **not** require QPF to manufacture the underlying intelligence. That does **not** mean verification has zero cost. It means the primary infrastructure dependency is structurally different from a company whose core product is a frontier foundation model.

Verification still requires:

- canonicalization and hashing;
- receipt and evidence storage;
- verifier implementations and test vectors;
- (specified, not fully implemented) keys, trust roots, and policies;
- human governance for authorization.

### 2.3 Protocol-layer thesis (intent, not adoption)

Analogy only: the Internet’s useful property is that applications can change while the packet-verification rules remain independent of any one application vendor.

**Defensible proposition (`PROPOSED` intent):**

> QPF is designed according to a protocol-layer thesis in which verification remains independent of the intelligence provider.

**Not claimed:**

- QPF is already “TCP/IP for AI”;
- QPF is an industry standard;
- universal adoption exists;
- ecosystem dominance exists.

Architectural intent ≠ externally demonstrated adoption.

### 2.4 Fundamental protocol principle (existing canon)

From `QPF_VERIFICATION_PROTOCOL_V1.md` (`SPECIFIED`):

```text
Intelligence may propose.
Deterministic infrastructure constrains.
Execution produces evidence.
Cryptography establishes provenance.
Verification evaluates evidence.
Trust Policy determines acceptance.
Governance makes the final decision.

No model, verifier, transport, receipt, attestation, or policy
may acquire authority outside its explicitly defined boundary.
```

Level 0 code restates a subset (`IMPLEMENTED`):

```text
AUTHORIZATION ≠ VERIFICATION
VERIFICATION ≠ GOVERNANCE DECISION
```

This architecture document adds the settlement distinction already present in economic-gate documents:

```text
VERIFY ≠ AUTHORIZE ≠ EXECUTE ≠ SETTLE
```

Success at one boundary does not establish success at the next.

---

## 3. System Boundary

### 3.1 Inside the QPF verification substrate

| Concern | Status |
| --- | --- |
| Canonical encoding of artifacts (JCS RFC 8785) | `IMPLEMENTED` in `src/verification/canonical.js` |
| Content hashing (SHA-256, algorithm-labeled) | `IMPLEMENTED` transitional; protocol primary is BLAKE3 (`SPECIFIED`, not implemented) |
| Level 0 verify: artifact + receipt bind | `IMPLEMENTED` (`verifyLevel0`) |
| Identity artifact schema + content-addressed `identity_id` | Schema `SPECIFIED`; derivation/bind `IMPLEMENTED` |
| Evidence index / evidence receipt / claim-map scripts | `IMPLEMENTED` as project-evidence tooling (SHA-256, generally unsigned) |
| Hermes-style execution receipts with authority envelope | `IMPLEMENTED` as operational receipts; not the full `qpf.receipt.v1` crypto form |
| Verification Protocol v1 layers 1–10 | `SPECIFIED` (normative draft) |
| Trust root / key lifecycle / Ed25519 signing path | `SPECIFIED`; not a unified production implementation |
| Evidence Bundle / Attestation / Verification Receipt objects | `SPECIFIED`; not a complete portable bundle implementation |
| Capability negotiation (protocol layer 11) | **DEFERRED** — do not invent |

### 3.2 Outside the QPF verification substrate

| Concern | Boundary |
| --- | --- |
| Training or hosting a frontier foundation model | Not QPF’s product definition |
| Owning every agent that emits QPF artifacts | Not required |
| Being the exclusive execution runtime | Not required |
| Economic settlement, mint, LP, staking, bridge | Separate gates; currently **not authorized** (`SPECIFIED` + operational restraint) |
| Legal personhood of OINIO | Explicitly denied by identity spec |
| Real-world truth of observed inputs | Outside cryptographic verification |

### 3.3 What “independent verification layer” means

QPF can sit beside heterogeneous:

- models (local Ollama, hosted foundation models, 0G-hosted compute, future providers);
- agents (reasoners, executors, claim producers);
- execution environments (laptop, CI, 0G path, other hosts);
- identity systems (QPF identity artifacts; external platform accounts);
- economic ecosystems (Pi, 0G, others)

**without QPF owning those systems**, provided those systems emit or can be bound to QPF-verifiable artifacts and receipts.

Whether that property holds for an arbitrary external system today is **not** universally demonstrated (`UNVERIFIED` as a global interoperability claim). It is an architectural requirement (see §12).

---

## 4. Layer Model

```text
┌─────────────────────────────────────────────────────────┐
│ 5. External Settlement / Economic Layer                  │
│    mint · liquidity · staking · bridge · payout · fee    │
│    OUTSIDE verification authority                        │
└───────────────────────────▲──────────────────────────────┘
                             │ consumes results; never implied
┌───────────────────────────┴──────────────────────────────┐
│ 4. QPF Verification Layer     ← this substrate           │
│    canonicalize · hash · bind · evaluate evidence        │
│    emit pass/fail/partial/unavailable (and receipts)     │
└───────────────────────────▲──────────────────────────────┘
                             │ evidence / artifacts / receipts
┌───────────────────────────┴──────────────────────────────┐
│ 3. OINIO Identity / Provenance Layer                     │
│    persistent identity artifacts, lineage fields,        │
│    platform-cluster registry (see limits in §7)          │
└───────────────────────────▲──────────────────────────────┘
                             │ claims, actions, artifacts
┌───────────────────────────┴──────────────────────────────┐
│ 2. Agent Layer                                           │
│    reason · act · produce claims · consume evidence      │
│    QPF does not necessarily control these agents         │
└───────────────────────────▲──────────────────────────────┘
                             │ probabilistic proposal
┌───────────────────────────┴──────────────────────────────┐
│ 1. Model Layer                                           │
│    local / hosted / 0G / future providers                │
│    never a trust root                                    │
└─────────────────────────────────────────────────────────┘
```

Authorization and execution are **not** additional product layers owned by verification. They are separate concerns that may be implemented by QPF operational machinery, external operators, or not at all. See §10.

---

## 5. Model Layer

**Role:** probabilistic proposal. Models generate text, plans, patches, or other candidate artifacts.

**Status of QPF model use:**

| Path | Status |
| --- | --- |
| Local Ollama / sovereign local-AI kit | `EXPERIMENTAL` product/ops path (`LOCAL_AI_SETUP.md`, local-ai reports) |
| Externally hosted foundation models | Operational use may exist in agent workflows; **not** a QPF trust root |
| 0G-hosted computation | `EXPERIMENTAL` dual-path access documented in `docs/ARCHITECTURE.md` (router vs direct provider). Billing/path health is observational, not a verification proof of model quality |
| Future model providers | In scope for the portability requirement; not pre-certified |

**Invariants (`SPECIFIED` by protocol; partially enforced by Level 0 not calling models):**

- Models **MUST NOT** be trust roots, signing authorities, or governance deciders.
- Models **MUST NOT** override policy or verification results.
- Models **MAY** appear in execution metadata only.
- The Verify Skill **MUST NOT** call models as part of the trust-decision path (`04-verify-skill.md`).

QPF **MUST NOT** be architecturally dependent on a particular model provider. Current operational convenience (e.g. a working 0G direct-provider path) is not an architectural lock-in.

---

## 6. Agent Layer

**Role:** entities that may reason, execute actions, produce claims, consume evidence, modify state, or interact with external systems.

QPF does **not** necessarily control these agents. Existing control-plane wrappers (`docs/OINIO_CONTROL_PLANE.md`) are a local operator convenience (`IMPLEMENTED` as config/wrapper setup), not proof that QPF owns the agent ecosystem.

**Invariants:**

- Agents propose; they do not become the verifier.
- Agent “always approve” modes **MUST NOT** silently override trust policy (`07-trust-policy.md`).
- An agent-produced narrative is not evidence. Evidence is the artifact + receipt + (specified) attestation/bundle.
- SCCB threat model (`docs/sccb/THREAT_MODEL.md`, `SPECIFIED`/`EXPERIMENTAL` capability broker) treats agent context as an adversarial surface (prompt injection, secret leakage, allowlist expansion). That threat model is operational security, not a claim that SCCB is the verification substrate.

---

## 7. OINIO Identity / Provenance Layer

Describe only what the repository establishes. Do not upgrade aspiration to capability.

### 7.1 Verifiable AI identity artifact (`SPECIFIED` + partial `IMPLEMENTED`)

`docs/protocol/qpf-v1/12-identity-artifact.md` defines `qpf.identity.verifiable-ai.v1`.

Established:

- Identity sits **above** the existing verification stack; it does not introduce a parallel verifier.
- Scope is `knowledge_body`. It is not a legal person, biological person, or human equivalent.
- `identity_id = qpfid0: || sha256(jcs(stable_body))` is `IMPLEMENTED` (`src/verification/identity-id.js`) with golden vectors.
- Binding an identity file to a Level 0 receipt is `IMPLEMENTED` (`identity-bind.js`).
- A bind `pass` means: file matches receipt **and** declared `identity_id` matches derivation. It does **not** authorize Genesis, merge, deploy, wallet, or economic action.

Identity epistemic states (`SPECIFIED` in 12-identity-artifact.md; **not** the same enum as Level 0):

| State | Meaning |
| --- | --- |
| `DECLARED` | Declared without sufficient receipt-bound evidence |
| `UNVERIFIED` | Evidence insufficient or unavailable |
| `VERIFIED` | Relevant artifact/evidence binding has a Level 0 pass |
| `ATTRIBUTED` | Separate attribution evidence |
| `DERIVED` | Derivative artifact + lineage link |
| `UNKNOWN` | Cannot presently be established |

`VERIFIED` never means human-authored.

### 7.2 OINIO Genesis

**Not created.** The identity spec states no Genesis artifact is created by Step A. `identities/oinio/genesis.json` remains intentionally absent until later authorization (`SPECIFIED` non-scope).

### 7.3 Identity Lock registry

`docs/IDENTITY_LOCK.md` describes OINIO as a distributed platform-cluster (GitHub, X, Telegram, Discord, on-chain display name). Treat as an **identity-cluster registry document**. Several verification fields in that file remain placeholders (GPG fingerprint, wallet address, Discord user id). Those placeholders are **not** cryptographic identity proofs.

### 7.4 OINIO as sovereign agent (`docs/ARCHITECTURE.md`)

That document describes OINIO as a sovereign, non-root agent using 0G compute paths, local orchestration, and diagnostics. That is an **agent/runtime description**, not a proof that persistent provenance is complete.

**Architectural reading (`PROPOSED`, consistent with §7.1):** persistent identity/provenance is distinct from model execution. A model completion is not an identity. An identity artifact is not a model.

---

## 8. QPF Verification Layer

This is the central layer.

### 8.1 Role

Independently evaluate verification artifacts/evidence rather than blindly trusting the originating agent or model provider.

Core question:

```text
Can an independent verifier reproduce and validate the evidence
supporting the claimed state transition?
```

This is **not** “AI truth detection.”

### 8.2 Protocol pipeline (`SPECIFIED`)

```text
artifact
  → receipt
  → attestation
  → evidence bundle
  → trust resolution
  → policy evaluation
  → verification semantics
  → verification result
  → signed verification receipt
  → (governance decision — outside pure crypto path)
```

### 8.3 What is implemented today

Level 0 (`src/verification/verify-level0.js`, `IMPLEMENTED`):

1. Locate artifact
2. Locate execution receipt
3. Check receipt structure
4. Check artifact content hash against receipt claim
5. Check receipt↔artifact binding
6. Signature check only if claimed **and** a verify primitive exists; otherwise `unavailable` / `not_applicable`
7. Emit structured `VerificationResult`

Level 0 **does not** implement attestation (L1), evidence retrieval (L2), reproduction (L3), trust-root discovery, or trust-policy composition.

Project-level evidence scripts (`npm run verify:evidence`, independent verification) check committed evidence indexes/receipts/claim maps. That is **repository evidence hygiene**, a different plane from on-chain deploy verification (`docs/VERIFICATION.md`) and from protocol Level 0.

### 8.4 Protocol statuses (frozen; do not replace)

From `09-verification-semantics.md` and Level 0 aggregation:

| Status | Meaning |
| --- | --- |
| `pass` | Required checks for the requested level succeeded |
| `fail` | Known violation (hash mismatch, bad signature, revoked key, policy denial, …) |
| `partial` | Incomplete evidence or incomplete check set; or Level 0 ok but higher level unavailable |
| `unavailable` | Required capability or material not present |

Missing information **MUST NOT** automatically become cryptographic `fail`.
Known violations **MUST** produce `fail`.
Uncertainty **MUST NOT** collapse into `pass` because an artifact is well-formed.

Reproduction is a **dimension** (`reproduction`: pass / fail / unavailable / not_requested), not a synonym for hash validity.

---

## 9. External Settlement Layer

Settlement is any transfer of economic entitlement: mint, liquidity, staking, bridge, fee routing, payout, treasury movement.

Existing restraint (`SPECIFIED` + operational):

- `docs/SECURITY_BOUNDARIES_V1.md` — public mint off; liquidity/staking/bridge gated; site wallet signing disabled
- `docs/governance/ECONOMIC_SOVEREIGNTY_GATE_V1.md` — model documented; live revenue / wallet action / automated fees **false**
- `docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md` — `Capability ≠ Permission ≠ Activation ≠ Revenue`
- Protocol non-goal: automatic economic unlock from a `pass` result

Verification may *inform* a later settlement decision. Verification **MUST NOT** perform settlement.

---

## 10. Verification / Authorization / Execution / Settlement Separation

```text
VERIFY     ≠  AUTHORIZE  ≠  EXECUTE  ≠  SETTLE
```

| Verb | Question | Owner class |
| --- | --- | --- |
| **Observe** | What was seen on which channel? | Observer / environment |
| **Produce evidence** | What artifact and receipt were emitted? | Actor (human, agent, system) |
| **Canonicalize** | Is the representation deterministic? | Verifier / producer using QPF rules |
| **Cryptographic integrity** | Do hashes/signatures match declared algorithms and keys? | Verifier |
| **Verify** | Do required checks succeed under a profile/policy? | Independent verifier |
| **Authorize** | May this action be taken? | Governance / human / policy engine **outside** verify |
| **Execute** | Was the action performed? | Execution environment |
| **Settle** | Was economic entitlement transferred? | Economic rails / chain / off-chain payer |

`docs/architecture/PROTOCOL_ADAPTER_LAYER_V1.md` (`SPECIFIED`, dry-run only) classifies whether an intent would require signing, RPC mutation, deployment, funding, or liquidity, and **rejects live execution by default**. That adapter is not settlement and not authorization.

Hermes-style `authorityBoundary` fields record execution constraints. They are envelope evidence, not authorization.

---

## 11. Evidence and Epistemic Boundaries

### 11.1 Three distinct evaluations

| Evaluation | Answers | Does not answer |
| --- | --- | --- |
| **Cryptographic validity** | Was the canonical artifact hashed/signed as claimed? | Is the claim true in the world? |
| **Semantic correctness** | Do fields mean what the schema says; do bindings line up? | Is the observed input truthful? |
| **Real-world truth** | What actually happened in the world? | Not established by a valid signature or hash |

A valid signature, hash, or canonical artifact does **not** automatically prove that the underlying claim is true.

`TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md` (`SPECIFIED` for grant/audit language) separates:

1. independently reproducible fact;
2. self-reported telemetry;
3. design intent.

This architecture inherits that separation. Design intent in this file is labeled. Self-reported runtime health is not Domain-1 verification.

### 11.2 Protocol statuses remain authoritative

Do not replace `pass` / `fail` / `partial` / `unavailable` with another enum in implementations.

### 11.3 Review overlay: VALID / INVALID / INCOMPLETE / CONFLICT

The quartet `VALID` / `INVALID` / `INCOMPLETE` / `CONFLICT` is **not** a frozen protocol enum in `docs/protocol/qpf-v1/`. Isolated uses exist (e.g. multi-report marking a bad report `INVALID`; identity lineage conflicts as a review condition).

This document records the quartet as a **reviewer-facing overlay** (`PROPOSED` mapping only):

| Overlay | Maps onto existing canon | Must not be read as |
| --- | --- | --- |
| `VALID` | protocol `pass` on the requested checks | real-world truth; authorization; settlement |
| `INVALID` | protocol `fail` (known violation) | “the prose is false” in general |
| `INCOMPLETE` | `partial` or `unavailable` | automatic `fail` |
| `CONFLICT` | disagreeing independent reports (`NO_CONSENSUS` / `CONSENSUS_DRIFT` in multi-report architecture); identity lineage conflict | silent overwrite; auto-`pass` of one side |

**Ambiguity (preserved, not resolved):** no single repository artifact freezes `VALID|INVALID|INCOMPLETE|CONFLICT` as the machine-facing verification result type. Implementations **MUST** continue to emit protocol statuses.

### 11.4 Identity epistemic states

Remain as specified in §7.1. Do not collapse `DECLARED` / `UNVERIFIED` / `VERIFIED` / `ATTRIBUTED` / `DERIVED` / `UNKNOWN` into Level 0 `pass`.

---

## 12. Portability and Provider Independence

### 12.1 Property (architectural requirement)

**QPF Portability Property (`PROPOSED` as named property; consistent with evidence-bundle and verify-skill specs):**

> A QPF verification artifact should remain independently verifiable when the originating model provider, agent framework, hosting provider, or economic platform is replaced.

Classification:

| Aspect | Classification |
| --- | --- |
| Independence from a particular model provider | **Architectural requirement** (this document + protocol model boundary) |
| Offline crypto checks when material is local | **Specified** acceptance criterion (`03-evidence-bundle.md`, `04-verify-skill.md`) |
| Level 0 hash-bind reproducibility on a checkout | **Implemented** acceptance criterion for the Level 0 slice |
| Universal achievement across arbitrary providers | **Not claimed** |

### 12.2 Testable acceptance criteria (Level 0 slice, `IMPLEMENTED` target)

An independent engineer with the artifact bytes, the receipt, and `src/verification` **MUST** be able to obtain the same Level 0 status (modulo timestamp) without:

- calling the originating model provider;
- possessing the originating agent’s runtime;
- holding economic-rail credentials.

Golden tests in `tests/verification/level0.test.js` already encode hash mismatch → `fail`, missing material → `unavailable`, no silent upgrade of level > 0.

### 12.3 Specified but unimplemented portability surface

Full portability as intended by protocol v1 additionally requires portable evidence bundles, declared verifier profiles, trust-root pinning, and optional reproduction. Those are **acceptance criteria for later milestones**, not present-tense capabilities.

---

## 13. Adversarial Verification Considerations

Connect to existing work. Do not overstate conclusions.

### 13.1 Representation vs behavior

Protocol invariant: model output is not authoritative. A well-formed artifact can describe behavior that did not occur. Observation-channel integrity is a separate concern (`docs/ops/EXTERNAL_OBSERVATION_*`, operational — not a completed universal sensor).

### 13.2 Prose vs machine-verifiable fields

Verify Skill **MUST** return structured codes, not free-form model prose as authority (`04-verify-skill.md`).

Consequence: prose can contain false claims while machine-verifiable fields remain valid. A Level 0 `pass` on a file digest does not validate sentences inside the file.

### 13.3 Honest-looking artifacts

An artifact that looks complete is not necessarily sufficient evidence. Missing required objects are `partial` / `unavailable`, not `pass`. Multi-report architecture (`docs/community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md`, `SPECIFIED` process architecture) exists because a single report is a fragile substitute for “trust the builder.”

### 13.4 Independent reproduction vs originating narrative

`docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md` and `docs/evidence/INDEPENDENT_VERIFICATION_V1.md` document **read-only reproduction of committed evidence bundles**. That is stronger than trusting a narrative. It is **not** a proof of real-world events beyond what those bundles bind.

`docs/community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md` failure modes (do not treat as empirically measured rates):

- single point of failure;
- collusion (builder under another name);
- localized environment error;
- trust substitution (“trust verifier A”).

Disagreeing reports halt / escalate. They do not auto-activate anything.

### 13.5 SCCB / agent adversary

`docs/sccb/THREAT_MODEL.md` covers secret leakage into LLM context, prompt injection, compromised agent process, replayed approvals, and allowlist expansion. Residual risk is acknowledged (e.g. unlocked local signer). This is adjacent operational security, not a completed proof that QPF verification is adversarially sound at protocol levels 1–3.

---

## 14. Economic Architecture

### 14.1 Structural difference

| | Model-centric | Verification-centric (QPF intent) |
| --- | --- | --- |
| Core product | Model capability | Evaluable evidence and verification results |
| Primary dependency | Ongoing frontier compute/data/talent | Verifier implementations, evidence availability, governance discipline |
| Cost | Non-zero and typically dominated by training/serving | Non-zero and dominated by verification engineering, storage, review — **not claimed to be cheaper in dollars** |
| Revenue coupling | Users of the model | `UNVERIFIED`. Economic rails exist as designed objects; commercial activation is **NOT_ACTIVE** |

### 14.2 Value events vs paid events

`ECONOMIC_SOVEREIGNTY_GATE_V1.md` lists documentable readiness events (`VERIFY_ACTION`, `PROOF_GENERATION`, `RECEIPT_SEAL`, `REPLAY_VALIDATION`, `AGENT_ID_BIND`, …). They are **not** live paid events under that gate.

### 14.3 Restraint is intentional

Empty pools and disabled mint are documented as governance restraint, not incomplete accidents (`SECURITY_BOUNDARIES_V1.md`). This architecture document does not move those switches.

---

## 15. Non-Goals

QPF does not seek to:

- train the world’s best foundation model;
- own every agent using the protocol;
- become the exclusive execution environment;
- require a particular model provider;
- equate cryptographic validity with real-world truth;
- guarantee that an observed input is itself truthful;
- become the settlement authority for every ecosystem;
- manufacture economic activity merely to demonstrate traction;
- treat model output as a trust root (`SPECIFIED` protocol non-goal);
- automatically unlock economics from a `pass` result (`SPECIFIED`);
- invent protocol layer 11 (capability negotiation) before layers 1–10 work (`SPECIFIED` freeze);
- replace GitHub / Cloudflare / Pi portals (`SPECIFIED` v1 non-goal);
- forbid offline verification by requiring a centralized remote authority when material is local (`SPECIFIED`);
- create OINIO Genesis, mint, liquidity, staking, bridge, or credentials as a side effect of this document.

---

## 16. Security / Trust Assumptions

Assumptions that current design relies on. Violation degrades guarantees.

1. **Canonicalization assumption.** Independent verifiers use the declared encoder (JCS RFC 8785 for current identity/Level 0 paths). Non-canonical JSON MUST NOT be hashed where the protocol requires canonical serialization.
2. **Hash algorithm transparency.** Digests carry an algorithm id. Current implemented default is SHA-256. Protocol v1 prefers BLAKE3 (`SPECIFIED`; `UNVERIFIED` as implemented default).
3. **No secret-in-artifact.** Receipts and bundles MUST NOT embed private keys or tokens (`01-receipt.md`, `03-evidence-bundle.md`).
4. **Local material for offline checks.** Pure crypto checks assume referenced bytes are present locally.
5. **Observation channel.** Receipts record *declared* environment claims. They do not, by themselves, prove the observation channel was uncompromised (`UNVERIFIED` as a general guarantee).
6. **Trust roots are explicit.** “Trust the model” and “trust the GitHub UI alone” are forbidden as implicit roots (`06-trust-root.md`). Production roots require out-of-band governance (`SPECIFIED`; production roots `UNVERIFIED`).
7. **Human governance remains outside verify.** High-risk authorization stays human-gated (mint/deploy/wallet).
8. **Adversarial agent context.** Prompts and tool outputs may be hostile (SCCB). Verification code paths MUST NOT take model prose as authority.

---

## 17. Failure States

| Condition | Expected substrate behavior |
| --- | --- |
| Artifact missing | `unavailable` (not `fail`) |
| Receipt missing | `unavailable` |
| Hash mismatch / binding mismatch | `fail` |
| Malformed receipt | `fail` (structure) |
| Claimed signature, no verify primitive | `unavailable` (Level 0) |
| Requested level > implemented level | `unavailable` or `partial`; **no silent upgrade** |
| Missing evidence object in a bundle | `partial` or `unavailable` (`SPECIFIED`) |
| Known policy denial / revoked key | `fail` (`SPECIFIED`) |
| Independent reports disagree | `CONFLICT` overlay / `NO_CONSENSUS`; do not auto-activate |
| Valid crypto over a false prose claim | cryptographic `pass` **and** unresolved semantic/world question — do not collapse |
| Attempted economic action without GO | refuse / no-go per security boundaries; verification document unchanged |
| Provider replacement without portable bundle | portability requirement **fails** for that case; do not claim success |

---

## 18. Acceptance Criteria

An independent engineer can accept this architecture if and only if:

1. QPF is described as verification infrastructure, not a model provider.
2. Model, agent, identity, verification, authorization, execution, and settlement boundaries are explicit.
3. QPF is not required to compete in the frontier-model compute race.
4. No unsupported adoption, market-position, or universal-truth claims appear.
5. Cryptographic validity is distinguished from semantic correctness and real-world truth.
6. Protocol `pass` / `fail` / `partial` / `unavailable` remain the machine-facing statuses; `VALID` / `INVALID` / `INCOMPLETE` / `CONFLICT` are overlay only.
7. Provider independence is defined as a testable architectural property, not a completed universal fact.
8. Existing adversarial-verification and multi-report work is cited without inflating conclusions.
9. Economic activity remains outside verification authority; this document enables no rail.
10. Existing canonical protocol semantics are not modified.
11. Status labels (`IMPLEMENTED` / `SPECIFIED` / `EXPERIMENTAL` / `PROPOSED` / `UNVERIFIED`) can be checked against the cited paths.

---

## 19. Relationship to Existing QPF Protocols

| Artifact | Relationship |
| --- | --- |
| `docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md` | Normative verification architecture. This document **does not** change it. |
| `docs/protocol/qpf-v1/09-verification-semantics.md` | Authoritative result codes |
| `docs/protocol/qpf-v1/12-identity-artifact.md` | Identity layer schema and epistemic states |
| `src/verification/*` | Implemented Level 0 + identity-id/bind |
| `docs/ARCHITECTURE.md` | OINIO agent / 0G compute access description — runtime, not this substrate spec |
| `docs/VERIFICATION.md` | On-chain deployment verification scripts — different plane |
| `docs/SECURITY_BOUNDARIES_V1.md` | Commercial/irreversible action off-by-default |
| `docs/governance/ECONOMIC_SOVEREIGNTY_GATE_V1.md` | Economic model documented; live rails off |
| `docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md` | Capability ≠ permission ≠ activation ≠ revenue |
| `docs/architecture/PROTOCOL_ADAPTER_LAYER_V1.md` | Dry-run intent classification; no live execution |
| `docs/community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md` | Process architecture for independent reports |
| `docs/evidence/INDEPENDENT_VERIFICATION_V1.md` | Read-only evidence reproduction command |
| `docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md` | Documented reproduction at a pinned commit |
| `TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md` | Claim-domain language rules |
| `docs/sccb/THREAT_MODEL.md` | Agent/capability adversarial surface |
| `docs/IDENTITY_LOCK.md` | Platform-cluster identity registry (placeholder fields remain) |
| `docs/OINIO_CONTROL_PLANE.md` | Local operator wrappers |

**Hash conflict (already recorded in protocol inspection; preserved):** protocol v1 prefers BLAKE3; dominant implemented hash is SHA-256. Transitional dual-hash via declared algorithm id is the specified migration path. This document does not pick a new default.

**Namespace conflict (already recorded; preserved):** “verification” in `docs/VERIFICATION.md` means deploy/contract assertions. Protocol “verification” means evidence evaluation. Keep namespaced.

---

## 20. Open Questions / Unverified Claims

Recorded rather than resolved.

1. **Unified overlay enum.** Should `VALID|INVALID|INCOMPLETE|CONFLICT` ever become a protocol-level result type, or remain reviewer language? Current freeze: overlay only.
2. **Production trust roots.** No production Ed25519 trust-root set is established as protocol infrastructure (`UNVERIFIED`).
3. **BLAKE3 migration milestone.** Specified; not implemented.
4. **Levels 1–3.** Attestation, evidence retrieval, reproduction — specified; not implemented in `src/verification`.
5. **OINIO Genesis.** Specified as future-gated; artifact absent.
6. **IDENTITY_LOCK cryptographic fields.** GPG fingerprint, key commitment, some platform IDs are placeholders.
7. **Heterogeneous provider conformance.** No repository evidence shows that arbitrary external model providers already emit QPF-portable bundles (`UNVERIFIED`).
8. **Observation-channel integrity.** No general proof that declared environments match actual environments.
9. **External adoption.** No claim of standard status or ecosystem dominance.
10. **Economic value realization.** No live protocol cashflow is claimed; future amounts undefined.
11. **Inspection-doc drift.** `docs/protocol/qpf-v1/REPOSITORY_INSPECTION.md` states `src/verification/` was empty at packaging time. That statement is historically dated; Level 0 now exists. This is a documentation lag, not a protocol change.
12. **Whether QPF “provides an independent verification layer across” all listed ecosystems today.** Architecturally intended. Empirically: Level 0 and project-evidence scripts work on this repository’s artifacts. Cross-ecosystem independence is an unmet general demonstration.

---

## Document control

| Field | Value |
| --- | --- |
| Version | 1.0.0 |
| Filename | `docs/architecture/QPF_TRUST_SUBSTRATE_ARCHITECTURE_V1.md` |
| Supersedes | None |
| Normative peer | `docs/protocol/qpf-v1/` (unchanged) |
| Activation effect | None |
