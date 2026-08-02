# Commercial Readiness Review v1

**Status:** NOT OUTREACH READY  
**Scope:** Skeptical review of the Sprint 02 commercial materials.  
**Boundary:** No external contact, application, agreement, quote, financial
commitment, protocol change, or wallet action is authorized by this review.

## Decision

The package is useful for internal preparation but is not ready to support a
claim of verified paid-customer demand. It contains two active funding pathways,
not named paying customers, and must preserve that distinction.

## Blocking findings

| ID | Finding | Why it blocks outreach readiness | Required remediation |
| --- | --- | --- | --- |
| CR-01 | QP-001 treats an Ethereum ESP funding path and a possible service sale as one opportunity. | QPF may be an applicant; that is different from a third party paying QPF for a deliverable. | Label every path as `grant applicant`, `service prospect`, or `community discovery`; use separate scorecards and queues. |
| CR-02 | The sovereign-AI and developer-onboarding catalog items have no qualified opportunity, evidenced need, or next action. | A service with no demand path is not a current offer candidate. | Mark them `capability watchlist` until a named organization and evidenced problem exist. |
| CR-03 | The core verification claim is proven internally but not yet demonstrated as a portable third-party delivery method. | A customer cannot infer that QPF can apply internal verification tooling to their system. | State that external verification work is adapted per engagement and requires a discovery assessment. |

## Material gaps

| ID | Gap | Remediation before proposal use |
| --- | --- | --- |
| CG-01 | Offer A has two descriptions: this package and `OFFER_ONE_PAGER_AUDIT_WALKTHROUGH_V1.md`. | Select one canonical description, reconcile turnaround and deliverable wording, and cross-link the other. |
| CG-02 | Offers do not specify acceptance criteria. | Add a completion checklist for each offer: artifact inventory, findings delivered, client review window, and exclusions. |
| CG-03 | Offers do not provide even an internal effort-size range. | Add a human-owned effort estimate; keep pricing `TBD_HUMAN`. |
| CG-04 | No completed third-party engagement is evidenced. | Add an honest first-engagement disclosure to future proposal drafts; do not imply prior clients. |
| CG-05 | Public service categories and internal catalog entries do not map one-to-one. | Reconcile names before treating either document as customer-facing source of truth. |

## Skeptical customer questions

| Question | Current answer | Evidence needed |
| --- | --- | --- |
| "Who has paid you for this before?" | No completed third-party engagement is evidenced. | First independently evidenced engagement or an honest first-engagement statement. |
| "How do I know the work is done?" | Deliverables are described, but acceptance checks are not yet per-offer. | Offer-specific completion checklist. |
| "Can you run this on our system?" | Not yet proven generically; fit must be assessed. | Discovery assessment and scoped client inputs. |
| "What will this cost and take?" | Pricing and effort are human-owned and not set. | Human-approved estimate after scope review. |
| "What do you need from us?" | Partial inputs are listed. | Per-offer intake checklist that excludes secrets and private keys. |

## Outbound gate

External outreach may be considered only after all of the following are true:

1. A named organization has a primary-source-confirmed, relevant need.
2. The opportunity is classified as a grant, service prospect, or community path.
3. The mapped offer has a defined scope, acceptance checks, effort range, and
   explicit exclusions.
4. The capability claim is supported by QPF evidence or is clearly stated as a
   discovery assumption.
5. A human reviews and explicitly approves the recipient, message, and any
   commitment.

## Next highest-impact internal task

Reconcile the evidence-readiness walkthrough into one canonical offer with:

- named deliverables;
- acceptance checks;
- an internal effort range;
- a no-secrets intake checklist;
- an explicit first-engagement disclosure; and
- separate grant-applicant versus paid-service positioning.
