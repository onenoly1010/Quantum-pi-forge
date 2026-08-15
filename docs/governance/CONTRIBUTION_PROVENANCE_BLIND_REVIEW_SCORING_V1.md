# Contribution Provenance Blind Review Scoring v1

**Status:** FROZEN OPERATIONAL SCORING  
**Mode:** MANUAL-FIRST · EVIDENCE-BOUND · NON-AUTOMATED DECISION SUPPORT  

This document implements the status-adjacency scoring procedure for the Contribution Provenance Ledger blind review protocol.

It does not change the ledger schema, expand the status taxonomy, or authorize automatic scoring. It defines a small manual decision procedure so the first 5–10 row blind review sample can be scored consistently.

---

## Core rule

Score reproducibility from the supplied packet only.

For **Status** scoring:

1. Check for an exact Author/Reviewer match.
2. If not exact, check whether the two statuses are adjacent in the frozen lifecycle map.
3. If adjacent, make a separate human judgment about whether the **same supplied evidence** reasonably supports both readings.

Only when both adjacency **and** shared evidentiary support are true is the row eligible for a Status near-match.

---

## Frozen lifecycle adjacency map

Only the following pairs are adjacent:

```text
Draft          ↔ Human Decision
Draft          ↔ AI Generated

Human Decision ↔ Verified          (only when evidence shows explicit human decision)

AI Generated   ↔ Under Review
Under Review   ↔ Verified

Verified       ↔ Production

Any            ↔ Superseded        (only when evidence shows replacement)
Any            ↔ Invalidated       (only when evidence shows rejection)
```

Any unlisted pair is a material disagreement by default.

---

## Manual Status scoring checklist

Apply this per row:

1. **Exact match?**
   - Yes → Status = `Exact`
   - No → continue
2. **Adjacent in the frozen map?**
   - No → Status = `Disagree`
   - Yes → continue
3. **Does the same supplied evidence reasonably support both readings?**
   - Yes → Status = `Adjacent`
   - No → Status = `Disagree`

This checklist is the operative implementation rule.

---

## Human Decision ↔ Verified gate

`Human Decision ↔ Verified` is a special-case adjacent pair.

Accept it as a near-match **only** when the packet contains a clear human decision artifact, such as:

- a decision record
- an explicit specification
- an acceptance note
- another direct record showing human decision authority

If the evidence only shows AI-produced work that later passed tests or verification, do **not** accept `Human Decision ↔ Verified` as a near-match.

---

## Decision table

| Author Status | Reviewer Status | Adjacent? | Extra condition | Status result |
| --- | --- | --- | --- | --- |
| Same | Same | — | — | Full agreement |
| Draft | Human Decision | Yes | Evidence supports both | Near-match |
| Draft | AI Generated | Yes | Evidence supports both | Near-match |
| Human Decision | Verified | Yes | Evidence shows explicit human decision | Near-match |
| AI Generated | Under Review | Yes | Evidence supports both | Near-match |
| Under Review | Verified | Yes | Evidence supports both | Near-match |
| Verified | Production | Yes | Evidence supports both | Near-match |
| Any | Superseded | Yes | Evidence shows replacement | Near-match |
| Any | Invalidated | Yes | Evidence shows rejection | Near-match |
| All other pairs | — | No | — | Material disagreement |

This table is a mechanical aid only. It does not replace human evidentiary judgment.

---

## Per-row recording standard

For every scored row, record at minimum:

| Field | Required content |
| --- | --- |
| Author Status | Author's private-key status |
| Reviewer Status | Blind reviewer status |
| Status comparison | `Exact` \| `Adjacent` \| `Disagree` |
| Evidence supports both | `Yes` \| `No` |
| Short reason | One or two sentences |

If `Adjacent` is accepted, the reason must explain why the same evidence supports both readings.

Use template:

`docs/governance/templates/CONTRIBUTION_PROVENANCE_BLIND_REVIEW_ROW_SCORE_V1.template.txt`

---

## Relationship to final row scoring

Status scoring feeds the final row result as follows:

- `Exact` supports **Pass**
- `Adjacent` with evidence support makes the row eligible for **Soft Pass**
- `Disagree`, or an adjacent pair without evidentiary support, pushes the row toward **Fail**

Role, Attribution, Confidence, and Evidence Sufficiency are still scored separately under the frozen thresholds.

---

## Light automation boundary

If a helper sheet or workbook formula is added later, automation must remain limited to:

- exact-match detection
- adjacency lookup from the frozen pair list
- returning `Exact`, `Candidate Near`, or `Disagree`

Automation must **not** decide:

- whether the evidence supports both readings
- whether the `Human Decision ↔ Verified` gate is satisfied
- the final row score on its own

Those judgments stay manual.

---

## Audit trail rule

Do not expand the adjacency map during first use.

If repeated disputes appear:

- improve evidence pointers
- strengthen primary evidence
- clarify operational label definitions

Do **not** change the frozen schema or widen adjacency as an ad hoc fix for a single disagreement.

---

## Ready state

This procedure is ready for immediate manual use on the first 5–10 row blind review sample.
