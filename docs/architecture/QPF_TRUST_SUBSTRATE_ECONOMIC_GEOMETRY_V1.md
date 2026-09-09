# QPF Trust-Substrate Economic Geometry v1

**Status:** Architectural specification (design documentation) — not an operational
status report, not a marketing artifact, not an unlock.
**Authority order:** Where this document and
[`docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md`](../protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md),
[`docs/review/VERIFICATION_STATUS_TABLE_V1.md`](../review/VERIFICATION_STATUS_TABLE_V1.md),
or [`QPF_TRUST_SUBSTRATE_ARCHITECTURE_V1.md`](./QPF_TRUST_SUBSTRATE_ARCHITECTURE_V1.md)
disagree about what exists or what is verified, those documents win.
**Scope:** This document codifies, as an overlay on the trust-substrate
architecture, three theses the commissioning narrative asserts but the canon did
not yet state in one place: the economic geometry of verification infrastructure,
the neutrality of the protocol, and the public falsifiability doctrine. It does
not activate, authorize, or claim any capability beyond what the repository
already establishes.

> TRUTH-DOMAIN NOTE (per `TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md`): except where a
> statement cites an inspectable repository artifact, this document is **Domain 3 —
> design intent**. The capability labels of
> `QPF_TRUST_SUBSTRATE_ARCHITECTURE_V1.md` (IMPLEMENTED / SPECIFIED /
> EXPERIMENTAL / PROPOSED / UNVERIFIED) apply unchanged.

## 1. Purpose

The base architecture document establishes *what* QPF is structurally: a
verification substrate whose layer boundaries separate models, agents, identity,
verification, execution, authorization, and settlement
(`QPF_TRUST_SUBSTRATE_ARCHITECTURE_V1.md` §1–§4). This document codifies *what
follows economically and politically* from that structure, as engineering-grade
design intent:

1. the economic geometry of a verification substrate, contrasted with the
   capital-scale geometry of a frontier-model organization (§2);
2. protocol neutrality — the posture that the verification layer is public,
   inspectable, reproducible, and capturable by no participant, including QPF
   itself (§3);
3. the public falsifiability doctrine — the standing invitation for any party to
   reproduce or refute QPF's published verification identities, with breaks
   treated as evidence (§4);
4. the participation thesis — how ecosystems, agents, enterprises, and
   applications plug into the verification layer without QPF owning the stack,
   including the OINIO identity layer's role (§5).

This document composes with, and does not replace, the base architecture
document. Nothing here modifies any capability classification, epistemic enum,
economic gate, or authorization boundary.

## 2. Economic Geometry

### 2.1 The contrast case, stated precisely

`QPF_TRUST_SUBSTRATE_ARCHITECTURE_V1.md` §14.1 records the model-centric
structure:

```text
CAPITAL → COMPUTE → MODEL → USERS → REVENUE
```

The commissioning narrative restates the same structural observation in
trajectory form:

```text
MISSION → CAPITAL CONSTRAINT → STRUCTURAL PIVOT → INFRASTRUCTURE PARTNERS → SCALE
```

Both describe one geometry: when the product *is* frontier intelligence,
capital intensity is structural. Compute, training data, research talent, and
serving infrastructure must be continuously re-acquired, and the organization's
corporate form bends around that constraint. This document adopts that reading
as the contrast case. It asserts nothing about any specific named company; the
reference case in the commissioning language is illustrative of the geometry,
not a claim about any organization's finances, governance, or motives.

### 2.2 The verification-centric participation flow

**Classification: PROPOSED (architectural intent), grounded clause-by-clause in
existing canon.**

The commissioning narrative states QPF's intended value flow as:

```text
TRUST → UTILITY → ECONOMIC ACTIVITY → QPF PARTICIPATION
```

and explicitly negates the paywall geometry:

```text
NOT: TRUST → PAYWALL → REVENUE
```

Codified as design intent, with each arrow defined against existing artifacts:

| Arrow | Meaning | Repository grounding |
| --- | --- | --- |
| TRUST | A verification result an independent party can reproduce without trusting QPF | Level 0 verifier `src/verification/`; golden-vector reproduction `external-verification/v1/fixtures/t2b-golden/`; public reproduction record `docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md` |
| → UTILITY | That reproducibility is useful to a third party's own decision-making | External verification suite premise: "an outsider can test QPF without becoming a mechanism for changing QPF" (`external-verification/v1/README.md`) |
| → ECONOMIC ACTIVITY | Parties build, transact, and operate on top of verification they can inspect | Architectural intent only; §9/S1 of the base document keeps settlement outside QPF's verification authority |
| → QPF PARTICIPATION | QPF participates in the ecosystem its verification enables, rather than taxing access to it | Design posture; no mechanism specified, implemented, or authorized here |

The negated flow is equally normative as intent: the verification artifacts
themselves — identifiers, receipts, evidence bundles, golden vectors — are
published and reproducible without payment, account, wallet, or permission
(`deploy/attack-kit.html`: "No wallet, no account"). Nothing in the intended
geometry gates verification behind a paywall, because a paywalled verification
result cannot be independently reproduced, and independent reproducibility is
the product (§12 C4 of the base document: verification MUST NOT require network
access to the originating provider).

### 2.3 What this geometry does not claim

1. **No adoption claim.** Whether any external party relies on QPF verification
   is UNVERIFIED (base document §20, OQ-1). The participation flow describes how
   value *would* accrue if the ecosystem adopts the substrate; it is not
   evidence that adoption has occurred.
2. **No revenue claim.** "QPF PARTICIPATION" is deliberately not "QPF REVENUE."
   Any future participation mechanism — fee, stake, grant, service, or other —
   requires its own specification, evidence, and human/governance GO under
   existing gates (`docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`;
   `docs/SECURITY_BOUNDARIES_V1.md`). This document specifies none.
3. **No zero-cost claim.** The base document's precision rule stands
   (§14.2): verification has real engineering, conformance, key-management,
   evidence-retention, and review costs. The claim is only that QPF's
   infrastructure dependency is structurally different from a frontier-model
   organization's, because verification evaluates artifacts and does not require
   owning the means of producing intelligence.
4. **No capture claim.** The geometry does not require QPF to capture the entire
   stack — see §5.

## 3. Protocol Neutrality

**Classification: PROPOSED as a consolidated posture; every element restates an
existing, citable property.**

The commissioning narrative states four neutrality commitments:

| Commitment | Codified meaning | Existing grounding |
| --- | --- | --- |
| Trust is public | Verification results and their derivation rules are published artifacts, not private assertions | Frozen public package EXT-001 (`docs/outreach/EXT-001/README.md`, `deploy/attack-kit/EXT-001/`); evidence index `evidence/INDEX.md` |
| Verification is inspectable | The verifier is source-available and its semantics are deterministic and documented | `src/verification/` (IMPLEMENTED, Level 0); semantics spec `docs/protocol/qpf-v1/09-verification-semantics.md` |
| Evidence is reproducible | An independent party re-derives the published identifiers from the published bytes alone | T2-B golden pack (base document §12 C1, demonstrated); EXT-001 Python reproducer (`docs/outreach/EXT-001/README.md` §3) |
| The protocol remains neutral | No participant — including QPF-operated infrastructure — is a trust root; semantics do not change with the provider, the agent, or the platform | M1–M3 (model layer), A1 (external agents use identical semantics), V3 (no narrative inputs), and P-IND (provider independence) in the base document |

Two boundary rules carry the neutrality posture:

1. **Neutrality is a property of semantics, not of governance.** The verifier
   evaluates declared inputs deterministically (V1). What an ecosystem *does*
   with a verification result is that ecosystem's governance act, outside the
   protocol (base document §10; `QPF_VERIFICATION_PROTOCOL_V1.md` — governance
   sits outside the pure verification crypto path).
2. **Neutrality does not mean neutrality about truth domains.** The protocol is
   neutral among providers and participants; it is not neutral between evidence
   and narrative. Self-reported claims remain Domain 2 and are never promoted
   (`TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md`; status table row E-05).

## 4. Public Falsifiability Doctrine

**Classification: IMPLEMENTED as a public surface; the doctrine below codifies
what the surface already does.**

The commissioning narrative issues a standing invitation: reproduce or refute,
and if it breaks, document it — a break is evidence, not a failure to hide.

The repository already operates this surface:

- **The attack kit** (`deploy/attack-kit.html`, frozen package
  `deploy/attack-kit/EXT-001/`): one frozen evidence package, two commands,
  Python 3.8+ standard library only. The claim under test is deliberately narrow
  — content identity of a pinned artifact plus reproduction of QPF's own `qpfv0:`
  / `qpfpkg0:` verification identities from the published files alone
  (`docs/outreach/EXT-001/README.md` §1–§3).
- **The external verification suite** (`external-verification/v1/`): an outsider
  renders CONFIRM / PARTIAL / BLOCKED / FAIL verdicts on QPF assertions without
  trusting QPF, with infrastructure outages scored BLOCKED, not FAIL.

The doctrine, stated normatively:

1. **A reproduced break is evidence.** A falsification of a published identity
   enters the same evidence discipline as a confirmation: it is documented,
   scoped, and answered in public artifacts, per the canon's conflict discipline
   (status table: mark conflict, keep both pending independent verification —
   do not pick a winner in public copy).
2. **Narrow claims are a feature.** The attack kit's scope is content identity,
   not a security or audit statement about the artifact's upstream project. The
   doctrine generalizes: every public falsifiability package must state its
   claim narrowly enough to be decidable.
3. **Freeze before challenge.** A package offered for public attack must be
   frozen — contents immutable, identities pre-published — so that a reproduced
   mismatch is attributable and not a moving target (`docs/outreach/EXT-001/README.md`:
   "Contents must not change; any change invalidates the published identities").
4. **Falsifiability is not self-certification.** A package that survives attack
   is evidence about that package's claim, nothing more. It does not verify
   adjacent claims, other layers, or the ecosystem (base document §10:
   success at any stage MUST NOT be represented as success at a later stage).

This document modifies no deploy artifact; it cites the existing surface.

## 5. Participation Without Capture

**Classification: PROPOSED (architectural intent).**

The commissioning narrative's closing posture:

```text
NOT: OWN EVERYTHING.
BUT: VERIFY ANYTHING.
```

Codified against the base architecture:

1. **Verify anything.** The provider-independence property P-IND (base document
   §12) is the engineering form of "verify anything": a QPF verification
   artifact remains independently verifiable, with identical semantics and
   identifiers, when the model provider, agent framework, hosting provider, or
   economic platform is replaced. Any ecosystem — ones named in the
   commissioning narrative and ones that do not exist yet — is a candidate
   producer and consumer of the same artifact grammar, evaluated by the same
   semantics (A1). Whether any named ecosystem actually integrates is UNVERIFIED;
   no integration evidence exists in the repository and none is claimed.
2. **Not own everything.** Non-goals 1–8 of the base document (§15) already
   exclude training frontier models, owning every agent, exclusive execution,
   provider lock-in, and settlement authority. This document restates them as
   the capture boundary: the substrate is designed so that QPF's value does not
   depend on owning the layers above or below the verification layer.
3. **OINIO as the persistent identity layer.** The OINIO identity/provenance
   layer (base document §7) supplies content-addressed, append-only identity
   artifacts that persist independently of any model execution — the durable
   context to which an agent's claims and receipts bind. Identity scope remains
   `knowledge_body`: explicitly not a legal person, not human equivalence
   (`12-identity-artifact.md` §1, §5).
4. **The agent as economic actor — within the gates.** In the intended
   architecture, agents (QPF-operated or third-party) are the actors whose
   claims, actions, and proposed state transitions are bound to evidence and
   evaluated. An agent participating in economic activity is a *subject* of
   verification, never a *source* of authority: agent capability classes under
   SCCB cannot elevate FORBIDDEN or skip HUMAN approval, and every economic
   action remains behind its own explicit human/governance GO (base document
   §6, §9 S1, §10). Nothing in this section creates, activates, or authorizes
   any economic capability for any agent.

## 6. Relationship to Existing Canon

This document is an architectural overlay, not a competing source of truth.

| Existing canon | Relationship |
| --- | --- |
| `docs/architecture/QPF_TRUST_SUBSTRATE_ARCHITECTURE_V1.md` | Base layer model, boundaries, epistemics, P-IND, economic boundary; this document extends its §14 and cites it throughout, never redefines it |
| `docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md` and layer specs 01–12 | Normative protocol semantics; unchanged |
| `src/verification/` and `external-verification/v1/` | Implemented verification and independent-verification surfaces cited in §3–§4 |
| `deploy/attack-kit.html`, `deploy/attack-kit/EXT-001/`, `docs/outreach/EXT-001/README.md` | Existing public falsifiability surface codified in §4; not modified |
| `docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`, `docs/SECURITY_BOUNDARIES_V1.md` | Economic gates preserved; §2.3 and §5.4 route all participation claims through them |
| `docs/review/VERIFICATION_STATUS_TABLE_V1.md` | Claim posture authority; this document introduces no new capability claims |
| `TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md` | Epistemic discipline this document applies to itself |
| `docs/ai/AI_POLICY.md`, `docs/ai/AUTHORIZATION_WORKFLOW.md`, `.qpf/task-contracts/` | Authority discipline under which this document was produced |

## 7. Open Questions / Unverified Claims

| # | Question / claim | State |
| --- | --- | --- |
| EG-1 | Does any external party rely on QPF verification today? | **UNVERIFIED** — restates base OQ-1; no adoption evidence; none claimed |
| EG-2 | What mechanism, if any, would implement "QPF participation" (§2.2)? | **PROPOSED, unspecified** — requires its own specification and authorization under existing economic gates |
| EG-3 | Has any party outside this repository reproduced or refuted EXT-001? | **UNVERIFIED** — the surface is published; no third-party result is recorded in the repository |
| EG-4 | Whether the participation geometry of §2.2 describes a viable ecosystem position | **UNVERIFIED** — empirical, outside repository evidence |

---

## Document control

| Field | Value |
| --- | --- |
| Version | 1.0.0 |
| Task contract | `.qpf/task-contracts/copilot__update-qpf-infrastructure-architecture.json` |
| Production mode | Specification only; no code, protocol, economic, credential, or deployment change |
| Change control | Changes to capability classifications require corresponding evidence changes in the cited canonical documents |
