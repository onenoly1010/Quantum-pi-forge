# Claim intake — live deployment checklist + customer-facing ambiguity audit (V1)

**Status: FROZEN.** The implementation is complete and tested; this document is
pre-deployment review only. No feature work until the operator makes the
deployment decision.

**The loop as approved:** LAND → SUBMIT → PRIVATE STATUS LINK → CHECKING →
RESULT/RECEIPT → PAYMENT (button inactive at launch).

---

## A. Deployment checklist

### Phase 0 — decisions that must happen BEFORE the push

- [ ] **D1 — Fee timing (BLOCKER, see B1).** Choose one coherent model; the
      page copy, status timeline, and published v2 terms (gist +
      `deploy/open-gates-v1.json`) must all say the same thing. Exact copy
      options in B1.
- [ ] **D2 — What the $250 buys under D1** (review itself / published
      package / receipt registration). One customer-facing sentence required
      before launch (B5).

### Phase 1 — push and deploy

- [ ] Files (all isolated; does not touch the other in-flight work):
      `functions/api/claim.js` (new), `deploy/claim-client.js` (new),
      `deploy/claim-status.html` (new), `deploy/verification-request.html`,
      `scripts/build.js`, `wrangler.pages.toml`, `package.json`
      (+`test:claim`), `tests/claim/claim.test.js` (new),
      `docs/CLAIM_INTAKE_RUNBOOK_V1.md`, this file.
- [ ] Commit on `feat/ext001-llms-faq` or cherry-pick to a clean branch.
- [ ] Push → workflow triggers confirmed: `deploy/**` and
      `wrangler.pages.toml` are both in the workflow path list.
      (Note B13: `functions/api/*` is *not* in the path list — harmless for
      this push, since `deploy/**` changes trigger it.)
- [ ] GitHub Actions build green (it runs `verify-entry-surfaces`).

### Phase 2 — post-deploy verification (commands in the runbook)

- [ ] `POST /api/claim` with a test claim → `200 {ok, ref, statusUrl}`.
      **If `503 "intake storage is not configured"`:** the KV binding did
      not apply on direct upload — add `QPF_CLAIMS`
      (id `f12af0792499477b8fa23b9d24c79d78`) to the Pages project bindings
      in the Cloudflare dashboard, redeploy, retest.
- [ ] `GET /api/claim?t=<token>` → `200`, status `received`.
- [ ] Set the operator secret:
      `npx wrangler pages secret put QPF_ADMIN_TOKEN --project-name=quantumpiforge`
      Then `PUT` with header → `200`; wrong header → `403`.
      (If PUT still returns 503 after setting the secret, redeploy —
      function env can require a redeploy to take effect.)
- [ ] `/claim-status.html` returns `200` and carries `noindex`.
- [ ] **IP gotcha:** rate limit is 5 submissions/hour/IP. The stranger
      walk-through plus smoke tests can lock your own home IP out for an
      hour. Budget test submissions or test from a different network.

### Phase 3 — the live stranger walk-through (clean browser/device)

- [ ] Enter from the homepage (`REQUEST VERIFICATION` hero button), not a
      direct URL — confirm a first-timer understands the offer box.
- [ ] Submit a real-shaped claim → success panel with ref + link appears.
- [ ] Copy the link, close the browser, reopen the link cold → status shows.
- [ ] Open the link in a *different* browser/device → status shows
      (server-stored; should work — verify anyway).
- [ ] Click "Open status page" from the success panel → **expected defect
      B2** (loses the token). Confirm it, then fix in the step-5 pass.
- [ ] Check every hesitation against register B; fix only
      hesitation-relevant copy (the operator's step 5).

### Phase 4 — payment activation (operator's step 6, after the walk-through)

- [ ] Create the hosted checkout (Stripe Payment Link, CAD $250; second
      link for +$100 priority if B7 is kept).
- [ ] Replace the inert stub (one change) and update the "nothing is owed"
      copy to match D1.
- [ ] Re-run the stranger path end-to-end **with a real payment** before
      announcing anything.

---

## B. Customer-facing ambiguity register

Every item found by walking the built loop as a stranger. Severity:
**BLOCKER** = resolve pre-deploy · **STEP-5** = fix in the walk-through pass
· **BACKLOG** = register, don't act now · **OK** = checked, no action.

### B1 — Fee timing: three sources, three stories — BLOCKER

Where: offer box (`CAD $250 … always published`), intro copy ("committed to
the public registry **before work begins**"), payment stub ("nothing is owed
at submission"), status timeline (`received → checking → result`, no payment
stage), published v2 terms (fee **invoiced before work**).

The stranger cannot answer *"Do I owe money, when, and what do I get if I
never pay?"* Typical SaaS instinct says "card first", so they may hesitate
to submit; or they assume free and no payment ever occurs. Three
self-consistent models — pick one, then align one sentence on the offer
page, one line on the status page, and the terms:

- **A — Pay after result (the loop as described):**
  *"You get the full result first. Payment is requested only afterward; a
  submitted claim never triggers a charge on its own."*
  Reconcile: (i) v2 terms "invoiced before work" are stale — re-publish
  (operator-authored, including machine file `open-gates-v1.json`);
  (ii) revenue depends on goodwill after delivery — the honest commercial
  risk of this model; (iii) what payment gates (B5).
- **B — Pay before work (current published terms):**
  *"Intake and your private status link are free. Checking begins after
  checkout."* The timeline must not advance to `checking` before payment —
  enforceable by procedure since stages are advanced manually, but the
  label "Checking — reviewed against public evidence" would be premature
  if shown pre-payment.
- **C — Hybrid (value-first without breaking v2):**
  *"Submitting and intake are free. The result is shown to you privately on
  your status page. The CAD $250 fee publishes the evidence package on the
  record."* Keeps fee-before-publication, gives the human something
  valuable before money, and makes payment buy a concrete thing — the
  closest fit to *"a human gets something valuable before deciding whether
  to pay"* while leaving published terms true.

### B5 — What does the $250 buy? — BLOCKER (same decision as B1)

The page never states what payment unlocks: the review? the published
package? the receipt link? Under A/C the sentence must appear before
submit; under B it implicitly gates the work. **No launch without one
explicit sentence.**

### B2 — "Open status page" button drops the private token — STEP-5

Success panel anchor → `/claim-status.html` (no fragment). The customer
clicks it seconds after being told to save their link and gets "This page
needs your private status link…" — reads like a failure right after success.
Fix: append the token to the href when the panel shows (one line; queued
for the step-5 pass per the freeze).

### B3 — Self-contradictory recovery wording — STEP-5

`deploy/claim-status.html` (~line 64): *"Nobody can resend it — the link
itself is the access… and the operator can issue a replacement."* Both
cannot stand side by side; the stranger cannot tell whether losing the link
is fatal. Fix: state it once — if lost, quote the reference through the
registry issue path; the operator looks up the claim by reference and
issues a new link (which the runbook enables).

### B4 — No time expectation anywhere — STEP-5

Nothing says when a stage should change. Even an honest *"no published SLA
yet — the stage on this page changes when the work does"* beats silence,
which reads as abandonment.

### B7 — Priority option unexpressible — BACKLOG

Offer box advertises optional **CAD $100 priority scheduling**; the form
has no way to request it and no checkout exists. Resolve when Stripe
activates (second payment link) or via a form flag later — not now.

### B8 — "This price is an offer, not proof of a customer or a sale" — BACKLOG (operator call)

Internal-audience honesty on a customer-facing page. Directive-compliant
and truthful; alternatively rephrase as customer-relevant honesty (*"no one
has bought this yet — you would be the first"*). Tone decision; not
blocking.

### B13 — CI trigger gap — BACKLOG (non-blocking)

Workflow path list omits `functions/api/*`. This push triggers via
`deploy/**`, so launch is unaffected; a future edit touching only the
function would silently not deploy. Add the path in a routine CI commit.

### Checked — OK, no action

- **B6** Publication consent disclosed **before** submit ✓.
- **B9** Decline path consistent pre-submit and on the status page ✓.
- **B10** Reachability: homepage hero/nav/footer CTAs, `/try` cross-link,
  sitemap entry ✓; no page still describes the old email flow ✓.
- **B11** Rate-limited strangers get an honest message ✓ (operator testing
  gotcha noted in Phase 2).
- **B12** Honeypot invisible and non-focusable ✓.
- No-JS visitor sees an explicit "nothing is submitted" notice ✓.

---

## C. Decision requested

1. **D1/D2:** choose model **A**, **B**, or **C** — I then make the copy
   and terms wording match it (wording only; the freeze stays in force).
2. Go / no-go for the Phase 1 push.
3. Set `QPF_ADMIN_TOKEN` yourself, or give me the go to generate one and
   add it via wrangler.


