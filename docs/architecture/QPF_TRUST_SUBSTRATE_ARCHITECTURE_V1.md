# QPF Trust-Substrate Architecture v1

**Status:** Architectural specification (design documentation) — not an operational
status report, not a marketing artifact, not an unlock.
**Authority order:** Where this document and
[`docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md`](../protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md)
or [`docs/review/VERIFICATION_STATUS_TABLE_V1.md`](../review/VERIFICATION_STATUS_TABLE_V1.md)
disagree about what exists or what is verified, those documents win.
**Scope:** This document defines architectural intent, boundaries, and acceptance
criteria. It does not activate, authorize, or claim any capability beyond what the
repository already establishes.

> TRUTH-DOMAIN NOTE (per `TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md`): except where a
> statement cites an inspectable repository artifact, this document is **Domain 3 —
> design intent**. Statements marked IMPLEMENTED reference Domain 1 artifacts;
> SPECIFIED statements reference normative drafts (Domain 3); PROPOSED and
> UNVERIFIED statements are direction of travel only.

## Capability labels

| Label | Meaning in this document |
| --- | --- |
| **IMPLEMENTED** | Code, tests, or sealed receipts exist in this repository and can be inspected or executed locally today. |
| **SPECIFIED** | A normative design document exists; implementation may be absent or partial. |
| **EXPERIMENTAL** | A local, lab, or partial path exists; not a production or network claim. |
| **PROPOSED** | Architectural requirement introduced or consolidated by this document; not previously specified as its own requirement. |
| **UNVERIFIED** | Claimed nowhere verifiable in the repository; treated as unresolved. |

## 1. Purpose

This document codifies, as an engineering artifact, a structural distinction that
existing QPF canon asserts but does not state in one place:

> **QPF is not a model factory. It is a verification substrate.**

The purpose is to give an independent engineer a single, reviewable specification
of:

1. the layer boundaries that separate models, agents, identity, verification,
   execution, authorization, and settlement;
2. the epistemic boundary that separates cryptographic validity from semantic
   correctness and from real-world truth;
3. the portability property that makes a QPF verification artifact independent of
   the provider that produced the underlying intelligence; and
4. the economic and protocol-layer theses that follow from those boundaries —
   stated as architectural intent, not as demonstrated market position.

This document composes with, and does not replace, the normative protocol package
in `docs/protocol/qpf-v1/` and the claim posture in
`docs/review/VERIFICATION_STATUS_TABLE_V1.md`.

## 2. Architectural Thesis

**Thesis (PROPOSED as a consolidated statement; every clause below is grounded in
existing canon):** Quantum Pi Forge is architected so that the value it provides
is *independent, reproducible evaluation of evidence about artifacts and state
transitions*, rather than the manufacture of intelligence.

Existing canon already states the components of this thesis:

- "Implementation MUST NOT treat model output as authoritative."
  (`docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md`, Purpose)
- "Intelligence may propose. Deterministic infrastructure constrains. Execution
  produces evidence. Cryptography establishes provenance. Verification evaluates
  evidence. Trust Policy determines acceptance. Governance makes the final
  decision." (same document, Fundamental Principle)
- "AUTHORIZATION ≠ VERIFICATION" and "VERIFICATION ≠ GOVERNANCE DECISION"
  (`src/verification/README.md`, `src/verification/verify-level0.js:4-5`)
- The defensible public description: "an independently developed, evidence-first
  sovereign AI and governance platform centered on deterministic verification,
  cryptographic receipts, local AI execution, and auditable deployment artifacts"
  (`docs/review/VERIFICATION_STATUS_TABLE_V1.md`)

The central question the architecture answers is **not** "is this AI output true?"
It is:

> **Can an independent verifier reproduce and validate the evidence supporting the
> claimed state transition, without trusting the originating agent or model
> provider?**

This document treats that question as the defining design constraint of the
verification layer.

## 3. System Boundary

QPF, as specified, is the set of deterministic, evidence-producing, and
evidence-evaluating components in this repository and its declared protocol
surface:

| Inside the QPF boundary | Outside the QPF boundary |
| --- | --- |
| Canonicalization, hashing, receipt grammar, evidence bundles, verification semantics, verifier profiles, trust policy evaluation | Foundation models and their training/serving infrastructure |
| Identity artifact schema and content addressing (`qpf.identity.verifiable-ai.v1`) | Agents that produce candidate artifacts (whether QPF-operated or third-party) |
| Governance receipts, authorization gates, publication-scope and operating-model checks | Authorization decisions themselves (human/governance acts) |
| Read-only evidence lanes, claim maps, external verification suite | Execution environments that act on the world (deploys, wallets, chains) |
| Specifications for how settlement claims would be evidenced | Economic settlement systems (exchanges, liquidity, minting, custody) |

Two boundary rules are normative:

1. **No component inside the boundary acquires authority outside its explicitly
   defined boundary** (restating the protocol's fundamental principle).
2. **Nothing outside the boundary becomes trustworthy by touching the boundary.**
   A model, agent, host, or platform does not become verified because its output
   was hashed.

## 4. Layer Model

```text
┌──────────────────────────────────────────────────────────────┐
│ 5. EXTERNAL SETTLEMENT / ECONOMIC LAYER (outside QPF)        │
│    mints, liquidity, staking, bridges, custody, markets      │
├──────────────────────────────────────────────────────────────┤
│ 4. QPF VERIFICATION LAYER (this architecture's center)       │
│    artifact → receipt → attestation → evidence bundle →      │
│    trust resolution → policy evaluation → verification       │
│    result → verification receipt                             │
├──────────────────────────────────────────────────────────────┤
│ 3. OINIO IDENTITY / PROVENANCE LAYER                         │
│    content-addressed identity artifacts, lineage digests,    │
│    epistemic state labels — distinct from model execution    │
├──────────────────────────────────────────────────────────────┤
│ 2. AGENT LAYER (not necessarily QPF-controlled)              │
│    reasoning, action proposals, claim production, state      │
│    changes, external interaction                             │
├──────────────────────────────────────────────────────────────┤
│ 1. MODEL LAYER (commodity / replaceable)                     │
│    local Ollama models, 0G-hosted compute, external          │
│    foundation-model APIs, future providers                   │
└──────────────────────────────────────────────────────────────┘
```

Ordering rule: a higher layer consumes the outputs of a lower layer as *evidence
inputs*, never as authority. The layers below the verification layer generate
claims; the verification layer evaluates them; above it, **authorization** and
**execution** are not layers in this model but *gated decisions* (human /
governance acts, per `QPF_VERIFICATION_PROTOCOL_V1.md` — governance sits outside
the pure verification crypto path), and **settlement** (layer 5) is an external
economic event. Success at any layer or gate does not propagate to another (§10).

## 5. Model Layer

**Classification: IMPLEMENTED as replaceable integration; provider independence is
SPECIFIED here as an architectural requirement.**

Established by the repository:

- Local Ollama inference is an operational path: `LOCAL_AI_SETUP.md`,
  `Modelfile`, and the Hermes lane (`scripts/hermes-run.sh`,
  `scripts/hermes-write-receipt.cjs`, `scripts/verify-hermes-receipt.cjs`) run
  local models and emit replayable, schema-bound receipts
  (`evidence/hermes/schemas/receipt-v1.schema.json`; `npm run verify:receipt`).
- 0G-hosted compute is a second, independent path with dual access modes (router
  abstraction and direct provider), documented with observed HTTP evidence in
  `docs/ARCHITECTURE.md` and the runtime priority policy in
  `OINIO_COMPUTE_RUNTIME_POLICY_20260531.md`.
- Externally hosted OpenAI-compatible endpoints appear only as a fallback class in
  the same runtime policy.

The architectural requirement this layer must satisfy:

- **M1.** QPF verification semantics, receipt grammar, canonicalization, and
  evidence formats MUST NOT depend on a particular model provider. No verifier
  input may require a vendor-specific field.
- **M2.** A model's output is, at most, a candidate artifact plus execution
  metadata. The protocol already states this invariant: models "MUST NOT be a
  trust root, signing authority, or governance decider" and "may appear in
  execution metadata only" (`QPF_VERIFICATION_PROTOCOL_V1.md`, Architectural
  invariants).
- **M3.** Replacing the model (Ollama ↔ 0G ↔ a future provider) MUST NOT change
  the meaning of any verification result over the same artifact bytes.

## 6. Agent Layer

**Classification: SPECIFIED (protocol invariants) with EXPERIMENTAL local
implementations.**

Agents in this architecture may reason, execute actions, produce claims, consume
evidence, modify state, and interact with external systems. The repository
establishes:

- EXPERIMENTAL: local Guardian/Soul-style agent paths on Ollama
  (`docs/review/VERIFICATION_STATUS_TABLE_V1.md` row E-01; local agent scripts;
  observer design notes).
- SPECIFIED: agent capability classes and approval classes under SCCB
  (`docs/sccb/IMPLEMENTATION_VERIFICATION.md`): PREAUTHORIZED, CONDITIONAL,
  HUMAN_APPROVAL, FORBIDDEN — with always-approve agent modes explicitly unable
  to elevate FORBIDDEN or skip HUMAN.
- SPECIFIED: agents operate without root authority
  (`docs/ARCHITECTURE.md` — "no central control point or root authority").

Architectural requirements:

- **A1.** QPF does not, by design, control all agents that may interact with the
  protocol. An external agent MUST be able to produce evidence in the same
  formats and have it evaluated by the same semantics. (This is the reading of
  the external verification suite's premise — "an outsider can test QPF without
  becoming a mechanism for changing QPF," `external-verification/v1/README.md`.)
- **A2.** An agent's self-description is evidence about the agent, not proof of
  behavior. Agent identity claims enter the verification layer only through
  receipts and attestations, never through narrative.
- **A3.** Agent-layer failure (hallucination, compromise, misconfiguration) MUST
  degrade to a verification outcome (`fail` / `partial` / `unavailable`), never
  to silent acceptance.

## 7. OINIO Identity / Provenance Layer

**Classification: SPECIFIED (Step A/B/C artifacts) with partial IMPLEMENTATION.**

Only capabilities actually established by the repository are claimed here:

- SPECIFIED: the `qpf.identity.verifiable-ai.v1` artifact type
  (`docs/protocol/qpf-v1/12-identity-artifact.md`,
  `schemas/qpf/v1/identity-verifiable-ai.schema.json`). Identity scope is
  `knowledge_body` — explicitly not a legal person, not human equivalence.
- IMPLEMENTED: content-addressed `identity_id` derivation
  (`src/verification/identity-id.js`, golden vector
  `tests/verification/identity-id.test.js`):
  `identity_id = "qpfid0:" + sha256_hex(canonicalize(stable_body))` using the
  existing JCS canonicalizer and SHA-256 digest helpers.
- IMPLEMENTED: identity evidence binding as a normal artifact through existing
  machinery (`src/verification/identity-bind.js`,
  `tests/verification/identity-bind.test.js`) — originating receipt, Level 0
  `evidence_binding`, and `qpfpkg0:` package manifest, with no new verifier.
- SPECIFIED: identity-level epistemic states `DECLARED`, `UNVERIFIED`, `VERIFIED`,
  `ATTRIBUTED`, `DERIVED`, `UNKNOWN`, with the rule that `VERIFIED` never means
  human-authored (`12-identity-artifact.md`, §4).
- SPECIFIED: append-only lineage via digest links (`parent_digest`,
  `genesis_digest`), with lineage conflicts treated as a review condition, not a
  silent overwrite.

The architectural point this layer supports: **persistent identity and provenance
are distinct from model execution**. An identity artifact is bytes with a
content-derived identifier; it can be produced, bound, and verified regardless of
which model (if any) generated its content. Nothing in this layer is claimed to
be an OINIO Genesis artifact; per `12-identity-artifact.md` §7, no Genesis
artifact exists, and none is created here.

## 8. QPF Verification Layer

**Classification: IMPLEMENTED at Level 0; SPECIFIED for layers 1–10 of the
protocol package.**

This is the central layer of the architecture. Its role is to **independently
evaluate verification artifacts and evidence**, not to trust the originating
agent or model provider.

Established by the repository:

- IMPLEMENTED: canonical serialization (`jcs-rfc8785`), SHA-256 digests, Level 0
  verification (`quantum-pi-forge-verify/v1`) in `src/verification/` with tests
  under `tests/verification/`; skill declaration `src/verification/SKILL.md`;
  schemas under `schemas/qpf/v1/`.
- IMPLEMENTED: deterministic aggregation semantics in
  `src/verification/semantics.js` — top-level `pass` / `fail` / `partial` /
  `unavailable`, with missing data aggregating to `unavailable` (never automatic
  cryptographic `fail`) and known violations aggregating to `fail`.
- IMPLEMENTED: deterministic result and package identifiers (`result-id.js`,
  `package.js`) with external golden-vector reproduction (`verify:external:v1`,
  `external-verification/v1/fixtures/t2b-golden/`): an outsider re-derives
  `qpfv0:` and `qpfpkg0:` identifiers from supplied inputs.
- SPECIFIED: the twelve-layer normative package (receipt, attestation, evidence
  bundle, verify skill, key lifecycle, trust root, trust policy, verification
  receipt, verification semantics, verifier profile; capability negotiation
  DEFERRED) in `docs/protocol/qpf-v1/`.
- IMPLEMENTED: the local evidence bundle (`npm run verify:evidence`): evidence
  index, receipt hash, claim map, drift guard, and snapshot anchor
  (`evidence/INDEX.md`), reproduced from a fresh clone in
  `docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md`.

Normative requirements for this layer:

- **V1.** Verification is a pure function of declared inputs: artifact bytes,
  receipt, trust material, and policy. Same inputs MUST yield the same result on
  an independent implementation (`09-verification-semantics.md`: "MUST be stable
  across independent implementations for the same vectors").
- **V2.** The verifier MUST fail closed: unknown states are reported as
  `unavailable` or `partial`, never promoted to `pass`.
- **V3.** The verifier MUST NOT treat model output, agent narrative, or provider
  claims as authoritative inputs; only declared, checkable artifacts are inputs.
- **V4.** Verification results are evidence for governance; they are not
  authorization, not execution, and not settlement (see §10).

## 9. External Settlement Layer

**Classification: outside QPF's verification authority; current posture
IMPLEMENTED-BUT-GATED to NOT-AUTHORIZED across all economic surfaces.**

Economic settlement — minting, liquidity, staking, bridging, yield routing,
custody, treasury movement — is architecturally downstream of verification and
governance, never entailed by them. The repository's current posture, which this
document preserves without modification:

- `docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`:
  `COMMERCIAL_ACTIVATION = NOT_ACTIVE`, `PUBLIC_MINT_OPEN = NO`,
  `LIQUIDITY = NO`, `YIELD / STAKING / BRIDGE = NO`,
  `RESTRAINT = INTENTIONAL`; each economic gate "needs its own authorization.
  Bundling 'activate everything' is forbidden by doctrine."
- `docs/SECURITY_BOUNDARIES_V1.md`: mint, liquidity, staking, bridge, treasury,
  and site wallet signing are hard-off by default; restraint is recorded as
  governance choice, not accident.
- `docs/review/VERIFICATION_STATUS_TABLE_V1.md` rows G-01 through G-08: economic
  capabilities are "Implemented but gated" or "Experimental," never Verified as
  live.

Requirement:

- **S1.** No verification result, of any level, from any verifier, creates an
  economic entitlement, triggers settlement, or authorizes an economic action.
  Economic actions require their own explicit human/governance GO under existing
  gates.

## 10. Verification / Authorization / Execution / Settlement Separation

The architecture preserves, as a hard invariant:

```text
VERIFY ≠ AUTHORIZE ≠ EXECUTE ≠ SETTLE
```

Repository grounding:

- `src/verification/README.md`: "AUTHORIZATION ≠ VERIFICATION. VERIFICATION ≠
  GOVERNANCE DECISION."
- `docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`: "Capability ≠ Permission ≠
  Activation ≠ Revenue," and the staged chain "Technical truth → Deployment
  evidence → Independent verification → Governance decision → Economic activation
  → Markets → Possible protocol revenue," where each arrow is a separate gate
  that pays no wallet.
- `QPF_VERIFICATION_PROTOCOL_V1.md`: governance is the final contextual decision
  and sits **outside** the pure verification crypto path.
- `docs/ai/AUTHORIZATION_WORKFLOW.md`: "Do not treat a successful technical check
  as permission for a separate external or financial action."

Consequence rules:

1. A `pass` verification result does not authorize a merge, deploy, mint, or
   transfer.
2. An authorization does not execute anything; execution is a separately gated
   act with its own receipts.
3. An execution does not settle value; settlement is an external economic event
   with its own evidence requirements.
4. Success at any stage MUST NOT be represented, in any artifact, as success at a
   later stage.

## 11. Evidence and Epistemic Boundaries

This section is the epistemic core of the specification.

### 11.1 Three separations

| Property | Established by | Does NOT establish |
| --- | --- | --- |
| **Cryptographic validity** | Hashes match; signatures verify; canonical encoding is well formed | That the claim the artifact carries is true |
| **Semantic correctness** | The artifact's fields are internally consistent and correctly describe its own evidence | That the described real-world event occurred as described |
| **Real-world truth** | Independent observation of the world (outside the artifact) | — (outside what any artifact can self-certify) |

A valid signature over a false statement is a valid signature over a false
statement. A canonical, well-formed, hash-matched evidence bundle whose prose
claims an event that never occurred is cryptographically VALID-shaped and
semantically false. QPF verification operates on the first column and, where
reproduction is declared and checkable, part of the second. It does not, and by
this specification MUST NOT claim to, establish the third.

### 11.2 Preserved epistemic states

- Verification outcomes (IMPLEMENTED, `src/verification/semantics.js`;
  SPECIFIED, `09-verification-semantics.md`): `pass`, `fail`, `partial`,
  `unavailable` — fail-closed, with missing evidence never promoted to `pass`
  and never misreported as a cryptographic violation.
- Identity/claim epistemic states (SPECIFIED, `12-identity-artifact.md` §4):
  `DECLARED`, `UNVERIFIED`, `VERIFIED`, `ATTRIBUTED`, `DERIVED`, `UNKNOWN`.
- External verdicts (IMPLEMENTED, `external-verification/v1/README.md`):
  `CONFIRM`, `PARTIAL`, `BLOCKED`, `FAIL` — with an infrastructure outage scored
  `BLOCKED`, not `FAIL`.

### 11.3 Recorded ambiguity (not resolved here)

The commissioning language for this document referenced a four-state epistemic
set `VALID / INVALID / INCOMPLETE / CONFLICT`. Inspection of the repository did
not locate those four terms as a defined status enumeration in the verification
stack or protocol package; the existing frozen enums are the ones listed in
§11.2. Per the governing instruction to preserve frozen state and record
ambiguity rather than invent resolution:

- This document **preserves** the existing enums and does not introduce
  `VALID / INVALID / INCOMPLETE / CONFLICT` as verifier semantics.
- If that four-state set is intended as a future aggregation vocabulary, it is
  **PROPOSED** only, and its mapping onto `pass/fail/partial/unavailable` (e.g.,
  INCOMPLETE ≈ partial/unavailable; CONFLICT as a multi-verifier disagreement
  state above single-verifier semantics) is left as an open question (§20).

Uncertainty MUST NOT be collapsed into `pass` (or "VALID"-language) merely
because an artifact is well formed.

## 12. Portability and Provider Independence

**Classification: architectural requirement and acceptance criterion (PROPOSED as
a named property; composed from existing SPECIFIED invariants).**

**Property P-IND (provider-independent verification):**

> A QPF verification artifact — artifact digest set, receipt, attestation,
> evidence bundle, and verification result — remains independently verifiable,
> with identical semantics and identical derived identifiers, when the
> originating model provider, agent framework, hosting provider, or economic
> platform is replaced.

Testable consequences (acceptance criteria):

1. **C1 (implemented today, local).** The T2-B golden pack
   (`external-verification/v1/fixtures/t2b-golden/`) reproduces `qpfv0:` and
   `qpfpkg0:` identifiers from raw inputs with no QPF service, wallet, RPC, or
   narrative. This is the smallest working demonstration of the property.
2. **C2 (acceptance criterion).** For any receipt produced through the Hermes
   (Ollama) lane, replacing the model with a different local model and re-running
   the same declared inputs must produce evidence that the same verifier accepts
   or rejects under the same semantics — receipt replay
   (`npm run verify:receipt`) is model-agnostic by construction.
3. **C3 (acceptance criterion, not yet demonstrated).** An evidence bundle
   produced against a 0G-hosted inference path must verify identically when the
   bundle is evaluated on infrastructure with no 0G account, endpoint, or
   credential. **UNVERIFIED** — no cross-provider fixture pack exists today.
4. **C4 (acceptance criterion, not yet demonstrated).** Verification of any
   artifact MUST NOT require network access to the originating provider. Level 0
   is offline by construction (file digests and receipt binding); higher levels
   involving trust-root or evidence retrieval are SPECIFIED only.

This document does **not** claim the property is universally achieved. C1 is
demonstrated; C2–C4 are acceptance criteria for future conformance work.

## 13. Adversarial Verification Considerations

This architecture assumes an adversarial environment and connects to QPF's
existing adversarial work without extending it:

- **Representations diverge from behavior.** The SCCB threat model treats agent
  context, logs, and chat as an adversarial surface and requires metadata-only
  projections of credentials and capabilities
  (`docs/sccb/THREAT_MODEL.md`). Adversarial tests prove (with synthetic
  fixtures) that secrets stay out of agent context and that authority is
  machine-verifiable (`sccb/test/adversarial.verification.test.js`,
  `docs/sccb/IMPLEMENTATION_VERIFICATION.md`).
- **Prose can be false while fields are valid.** The canon-boundary discipline
  (`docs/canon/INDEX.md`) records that even canonical documents' self-statements
  are "a claim, not a fact," and the truth-domain separation layer
  (`TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md`) forbids assertive language
  ("verified", "confirmed") outside independently reproducible claims.
- **Observation-channel integrity matters.** Evidence entering the verification
  layer is only as strong as the observation that produced it; self-reported
  telemetry is Domain 2 — "self-reported and non-auditable"
  (`TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md`; status table row E-05: never promote
  self-reported telemetry to Verified).
- **An honest-looking artifact is not sufficient evidence.** Receipts prove
  execution conditions; attestations expand provenance; neither equals trust
  acceptance (`QPF_VERIFICATION_PROTOCOL_V1.md`, layer invariants).
- **Independent reproduction outranks originating narrative.** The external
  verification suite exists so a third party can confirm, partially confirm,
  block, or falsify QPF assertions without trusting QPF
  (`external-verification/v1/README.md`), and public reproduction from a clean
  clone is recorded at
  `docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md`.
- **Replay and forgery resistance** are existing design constraints:
  `params_hash` binding, one-time consume, and optional TTL on approvals
  (`docs/sccb/THREAT_MODEL.md`).

Nothing in this section claims these mechanisms are complete; the SCCB report
itself lists explicit non-actions and residual risks.

## 14. Economic Architecture

This section states the structural economic thesis. It is an analysis of
infrastructure dependency, not a claim about revenue, valuation, adoption, or
market position. No quantitative market claims are made.

### 14.1 Model-centric structure (contrast case)

```text
CAPITAL → COMPUTE → MODEL → USERS → REVENUE
```

An organization whose core product is a frontier foundation model carries
substantial ongoing infrastructure requirements: competitive model capability
depends on continued access to compute, training data, research talent, and
serving/deployment infrastructure. Capital is converted into compute; compute
into model capability; capability into users; users into revenue, which must
recur to fund the next cycle. The infrastructure dependency is **structural**:
it follows from what the product *is*.

### 14.2 Verification-centric structure (QPF's intended position)

```text
AGENTS → EVIDENCE → VERIFICATION → TRUST → ECOSYSTEM VALUE
```

QPF's intended position does not require QPF to manufacture the underlying
intelligence. Agents (QPF-operated or third-party) act and produce claims; those
claims are bound to evidence; the verification layer evaluates evidence
deterministically; reproducible verification results are the basis on which
other parties can decide what to trust; ecosystem value, if any, accrues to the
extent that independent parties actually rely on that verification.

Two precision rules:

1. **This does not mean verification has zero cost.** Verification requires
   engineering, conformance fixtures, key management, evidence retention, and
   review. The claim is narrower: QPF's primary infrastructure dependency is
   *structurally different* from a company whose core product is a frontier
   foundation model, because verification evaluates artifacts and does not
   require owning the means of producing intelligence.
2. **This is a design posture, not a demonstrated market outcome.** Whether an
   ecosystem values QPF verification is an empirical question this document does
   not answer (see §20, open questions).

### 14.3 Boundary to settlement

Economic activity is outside the verification authority boundary (§9, §10).
QPF MUST NOT manufacture economic activity merely to demonstrate traction; the
canon already encodes this as intentional restraint
(`docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`, `docs/SECURITY_BOUNDARIES_V1.md`).

## 15. Non-Goals

QPF, as specified by this architecture, does not seek to:

1. train the world's best foundation model;
2. own every agent using the protocol;
3. become the exclusive execution environment;
4. require a particular model provider;
5. equate cryptographic validity with real-world truth;
6. guarantee that an observed input is itself truthful;
7. become the settlement authority for every ecosystem;
8. manufacture economic activity merely to demonstrate traction.

Additional non-goals established by existing canon and restated here for
completeness:

9. replacing GitHub, Cloudflare, or Pi portals
   (`QPF_VERIFICATION_PROTOCOL_V1.md`, Non-goals);
10. model-as-trust-root, and automatic economic unlock from a `pass` result
    (same);
11. AI truth detection: the verification layer evaluates evidence about
    artifacts and state transitions; it does not adjudicate the truth of
    arbitrary natural-language claims (§11);
12. legal personhood or human equivalence for any identity artifact
    (`12-identity-artifact.md` §1, §5).

No additional non-goals are introduced beyond those supported by existing
repository architecture.

## 16. Security / Trust Assumptions

- **Hash and signature primitives.** Level 0 uses SHA-256 via Node `crypto`
  (transitional; always labeled); protocol v1 prefers BLAKE3 and Ed25519 with
  JCS canonical encoding (`QPF_VERIFICATION_PROTOCOL_V1.md`, Cryptographic
  requirements; `src/verification/README.md`). The SHA-256→BLAKE3 transition is
  a recorded conflict note in that document and remains open.
- **Verifier integrity.** A compromised or defective verifier is out of scope of
  what verification can self-certify; mitigation is independent re-implementation
  and golden vectors (V1, §12 C1).
- **Trust material.** Key issuance, rotation, and revocation are SPECIFIED
  (layers 5–6) but not implemented; until they are, signature-bearing artifacts
  are evaluated under declared profiles and the absence of a signature is
  `SIGNATURE_UNAVAILABLE`, never silently passed (`src/verification/semantics.js`).
- **Observation channels.** Receipts assert execution conditions; the integrity
  of the observation that produced a receipt is an evidence-quality question,
  not a cryptographic one (§13).
- **Secret handling.** Secrets are never placed in agent context, logs, receipts,
  or git (`docs/sccb/IMPLEMENTATION_VERIFICATION.md`); this document introduces
  no credentials and changes none.
- **Lone-steward governance.** Required independent review gates are recorded as
  not meaningful under single-steward conditions
  (`docs/governance/LONE_STEWARD_GOVERNANCE_BASELINE_V1.md`); claims in this
  document should be read with that governance posture in mind.

## 17. Failure States

| Failure | Required behavior |
| --- | --- |
| Missing artifact, receipt, or trust material | `unavailable` (never automatic cryptographic `fail`; never `pass`) |
| Hash mismatch, malformed receipt, binding mismatch, invalid claimed signature | `fail` with the specific reason code (`src/verification/semantics.js`) |
| Requested verification level unsupported | `partial` at best, with `level_achieved` reported |
| External infrastructure outage during external verification | `BLOCKED`, not `FAIL` (`external-verification/v1/README.md`) |
| Conflicting addresses or evidence across documents | Mark conflict, keep both pending independent verification, fix the canonical matrix first — do not pick a winner in public copy (`VERIFICATION_STATUS_TABLE_V1.md`, On-chain address discipline) |
| Model/provider failure | Degrades to evidence-level outcomes; never to silent acceptance (§6 A3); router failure is not project failure while an alternate provider path is operational (`OINIO_COMPUTE_RUNTIME_POLICY_20260531.md`) |
| Lineage conflict in identity artifacts | Review condition, not silent overwrite (`12-identity-artifact.md` §6) |
| UNKNOWN governance or verification state | Treated as not healthy: `UNKNOWN ≠ HEALTHY`; prepared ≠ verified ≠ approved ≠ executed (repository operating contract; `docs/governance/github-ecosystem-registry-v1.json` `unknownIsHealthy: false`) |

## 18. Acceptance Criteria

This specification is satisfied as a document when all of the following hold
(and each is checkable by reading this document against its citations):

1. QPF is established as verification infrastructure, not a model provider
   (§1–§4, §8).
2. Model, agent, identity, verification, execution, authorization, and
   settlement boundaries are explicit (§4–§10).
3. Nothing in the document implies QPF must compete in the frontier-model
   compute race (§5, §14).
4. No claim of adoption, market position, standardization, or universal truth is
   made (§14, §19, §20).
5. Cryptographic validity is explicitly distinguished from semantic correctness
   and real-world truth (§11).
6. Existing frozen epistemic enums are preserved, and the
   `VALID/INVALID/INCOMPLETE/CONFLICT` reference is recorded as an unresolved
   ambiguity rather than silently adopted (§11.2–11.3).
7. Provider independence is defined as a testable property with acceptance
   criteria, and its current demonstration level is honestly labeled (§12).
8. Existing adversarial-verification work is connected without overstating its
   conclusions (§13).
9. Economic activity remains outside the verification authority boundary; no
   economic rail, mint, stake, liquidity, bridge, credential, threshold, or
   deployment behavior is enabled or modified (§9, §10, §14.3).
10. An independent engineer can review this document against the repository
    without hidden assumptions: every existing-capability assertion carries a
    path citation.

## 19. Relationship to Existing QPF Protocols

This document is an architectural overlay, not a competing source of truth.

| Existing canon | Relationship |
| --- | --- |
| `docs/architecture/QPF_TRUST_SUBSTRATE_ECONOMIC_GEOMETRY_V1.md` | Companion overlay: codifies the economic-geometry, protocol-neutrality, public-falsifiability, and participation-without-capture theses that follow from this document's layer boundaries; cites this document, never redefines it |
| `docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md` and layer specs 01–12 | Normative protocol semantics; this document cites, never redefines |
| `src/verification/` (Level 0, semantics, result/package IDs, identity-id/bind) | Implemented base this document classifies as IMPLEMENTED |
| `docs/review/VERIFICATION_STATUS_TABLE_V1.md` (+ JSON twin) | Claim posture authority; this document's labels are consistent with its Verified / Implemented-but-gated / Experimental / Planned classes |
| `TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md` | Epistemic discipline this document applies to itself |
| `docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`, `docs/SECURITY_BOUNDARIES_V1.md` | Economic boundary sources for §9, §10, §14.3 |
| `docs/sccb/` (threat model, implementation verification, adversarial tests) | Adversarial and authority-boundary evidence for §13, §16 |
| `external-verification/v1/` | Independent-verification surface for §8, §12, §13 |
| `evidence/INDEX.md` and `docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md` | Evidence lanes and public reproduction record |
| `docs/ai/AI_POLICY.md`, `docs/ai/AUTHORIZATION_WORKFLOW.md`, `.qpf/task-contracts/` | Authority discipline under which this document was produced |

**Protocol-layer thesis (architectural intent, not adoption claim):** QPF is
designed according to a protocol-layer thesis in which verification remains
independent of the intelligence provider — in the same way that Internet
protocols were designed to remain independent of any particular network
operator. The analogy is architectural only. This document does **not** claim
that QPF is "TCP/IP for AI," an industry standard, universally adopted, or
ecosystem-dominant; no external-adoption evidence exists in the repository, and
none is asserted (see §20).

## 20. Open Questions / Unverified Claims

| # | Question / claim | State |
| --- | --- | --- |
| OQ-1 | Does any external party rely on QPF verification today? | **UNVERIFIED** — no adoption evidence in repository; none claimed |
| OQ-2 | Cross-provider evidence-bundle conformance (§12 C3) | **UNVERIFIED** — no fixture pack exists |
| OQ-3 | The intended role of `VALID / INVALID / INCOMPLETE / CONFLICT` as an aggregation vocabulary (§11.3) | **UNRESOLVED** — recorded ambiguity; existing enums preserved |
| OQ-4 | SHA-256 → BLAKE3 transition milestone | **SPECIFIED, unresolved** — conflict note stands in protocol v1 |
| OQ-5 | Trust root / key lifecycle (layers 5–6) and attestation level (L1+) implementation | **SPECIFIED, not started** (`src/verification/README.md` milestone table) |
| OQ-6 | Independent multi-report verification quorum (Phase 8.5, m=3) | **OPEN, n=0 eligible** (`docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`) — external corroboration not achieved |
| OQ-7 | Whether the economic thesis of §14.2 describes a viable ecosystem position | **UNVERIFIED** — empirical, outside repository evidence |
| OQ-8 | OINIO Genesis identity artifact | **Intentionally absent** pending later authorization (`12-identity-artifact.md` §7) |

---

## Document control

| Field | Value |
| --- | --- |
| Version | 1.0.0 |
| Task contract | `.qpf/task-contracts/copilot__codify-qpf-trust-substrate-thesis.json` |
| Production mode | Specification only; no code, protocol, economic, credential, or deployment change |
| Change control | Changes to capability classifications require corresponding evidence changes in the cited canonical documents |
