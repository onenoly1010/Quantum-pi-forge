# EXT-005 — Outreach Experiment Template v1

**Status:** PREPARATION_ONLY. No outreach has been sent under this document.
All bucket entries below are placeholders (`TBD by human operator`) and all
funnel counters are `0`. This artifact defines the *offer* and the *tracking
structure* for a bounded, human-run outreach experiment. It does not itself
constitute outreach, does not authorize outreach, and does not claim any
market result.

**Why this exists:** a market-validation memo argued that QPF's public
surface is self-referential ("verify us") rather than demand-driven ("verify
your thing"), and recommended running one real, bounded outreach experiment
instead of publishing another internal strategy document. This artifact is
the minimal scaffold that lets a human operator run that experiment without
inventing the structure ad hoc, while keeping the repository's own evidence
and protocol layers untouched.

**What this does not do:**
- It does not send any message to anyone.
- It does not name any real outreach target (see "Bucket Definitions" — every
  entry is `TBD by human operator`, matching the existing convention in
  `docs/outreach/QPF_OINIO_MANUAL_OUTREACH_TARGET_SHORTLIST_V1.md`).
- It does not increment any funnel counter. All counters start at `0` and may
  only be updated by a human operator recording a real, timestamped event.
- It does not authorize any on-chain, economic, or production action. Per
  `docs/ai/AI_POLICY.md` and `docs/ai/AUTHORIZATION_WORKFLOW.md`, research and
  planning artifacts inform but never authorize execution.

Canonical sources this artifact must stay consistent with:
[`docs/review/VERIFICATION_STATUS_TABLE_V1.md`](../review/VERIFICATION_STATUS_TABLE_V1.md),
[`docs/governance/github-ecosystem-registry-v1.json`](../governance/github-ecosystem-registry-v1.json).

---

## 1. Frozen public offer (the four-line contract)

Every package delivered under this experiment must return exactly these four
elements — no more, no fewer:

```text
YOU GIVE:  one public artifact + one falsifiable sentence
WE RETURN:
  1. Evidence      — what was fetched, hashes, sources
  2. Verification  — pass / fail / gated
  3. Limitations   — what this check does NOT prove
  4. Receipt       — stable IDs, reproducible locally
```

Every package must also carry an explicit line: **"This is not an audit."**

## 2. Honest product levels (scope discipline for outreach)

Only accept an outreach job at a level deliverable this week. Anything above
that must be labeled `gated`, not attempted.

| Level | Job | Example | Deliverable this week? |
| --- | --- | --- | --- |
| 0 | These bytes are those bytes | Source file, README, metadata JSON, published receipt | Yes |
| 1 | On-chain code at address A is digest D on chain C at time T | `eth_getCode` + SHA-256, empty reserves | Yes |
| 2 | Claimed source compiles to that bytecode | Foundry/Sourcify-style rebuild | Gated unless already built |
| 3 | Claimed behavior holds under named checks | Tests, invariants, permission probes | Gated |
| 4 | Agent did only what the policy allowed | Signed action receipts, tool-call logs | Gated — do not lead with this |

## 3. One-sentence offer (send this, not a deck)

```text
I can check one public claim against public bytes and send back a short
package: what matches, what doesn't, and what this check cannot prove.
No wallet, no token, no signup. Send the URL and the sentence you want tested.
```

The first outreach message must not lead with "QPF", "0G", "Guardians", or any
civilization/sovereignty framing.

## 4. Bucket definitions (targets TBD by human operator)

No target is selected in this document. Selecting, contacting, and evaluating
targets is a human action outside repository scope.

### Bucket A — Small-chain / alt-L1 deployments
Target Name / Organization: TBD by human operator
Reason for Fit: explorer verification is weak; a live-claim dispute (address,
pair, reserves) is a real, boundable job at Level 0–1.
Approval Status: PENDING_HUMAN_SELECTION

### Bucket B — Grant / artifact-evaluation / reproducibility threads
Target Name / Organization: TBD by human operator
Reason for Fit: reviewer needs proof that commit C produced artifact A; a
content-addressed package is a better object than a screenshot.
Approval Status: PENDING_HUMAN_SELECTION

### Bucket C — 0G / DeAI builders who published "we deployed X"
Target Name / Organization: TBD by human operator
Reason for Fit: "docs vs deploy" mismatch claims are a Level 1 job.
Approval Status: PENDING_HUMAN_SELECTION

### Bucket D — Researchers/indie hackers asking for reproduction
Target Name / Organization: TBD by human operator
Reason for Fit: explicit ask to reproduce a result maps directly to Level 0–2.
Approval Status: PENDING_HUMAN_SELECTION

**Required approval before any send:** before any message is sent, the human
operator must approve the target, bucket, exact message body, artifact link,
channel, and timing — consistent with the existing approval gate in
`docs/outreach/QPF_OINIO_MANUAL_OUTREACH_TARGET_SHORTLIST_V1.md`.

## 5. Funnel tracker (all counters start at 0; human-updated only)

| Stage | Count | Last updated (UTC) | Evidence link |
| --- | --- | --- | --- |
| Contacted | 0 | — | — |
| Responses | 0 | — | — |
| Accepted a verification | 0 | — | — |
| Submitted artifact + claim | 0 | — | — |
| Completed package delivered | 0 | — | — |
| Shared result unprompted | 0 | — | — |
| Sent a second artifact | 0 | — | — |
| Offered to pay or cite | 0 | — | — |

A count may only be incremented by a human operator citing a real, external,
timestamped event (a message sent, a reply received, a package delivered).
No agent may increment these counters.

## 6. Drop-off interpretation (decide changes, not verdicts, at n=20)

| Drop-off | Meaning | Change |
| --- | --- | --- |
| No replies | Offer is invisible or reads as a token pitch | Shorter offer, different rooms, drop the QPF name from the first message |
| Replies, no artifacts | They wanted conversation, not a check | Ask for one URL in the first reply |
| Artifacts, shrug at result | Package is too abstract or too weak | Add a one-page human summary on top of the JSON |
| Love result, won't pay | Service is real, pricing is later | Ask for a public citation or a second job |
| Want safety verdicts | Wrong job for this offer | Refuse, label `gated`, point at auditors |

Twenty contacts is enough to learn; it is not enough to declare
product-market fit. If 0/20 reply, treat the channel as having failed first,
not necessarily the job — change rooms before changing the offer itself.

## 7. What this experiment must not do

- Must not be presented as, or mixed with, the $29/$49 installer, DEX pair
  state, or any civilization/Guardian/Pi-bridge narrative.
- Must not claim a safety verdict ("is this contract safe") at any level;
  refuse and point to auditors/scanners instead.
- Must not treat "accepted a verification" as authorization for any on-chain,
  economic, or production action — outreach results are observational
  evidence only.
- Results, once real, are published as funnel numbers only (Section 5,
  updated in place) — not as a new philosophy document, and not merged into
  the protocol or evidence layers without their own review.
