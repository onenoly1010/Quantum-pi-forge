# LAUNCH RECEIPT — QPF claim intake, first live customer path

**Date:** 2026-10-01 (deploys and checks executed 2026-10-01 00:5x–01:1x UTC)
**Authorization:** operator "QPF LIVE LAUNCH AUTHORIZATION — GO LIVE", commercial
model **C**, minimum-wording changes only.
**Deployed commit:** `5bd96d4` (branch `feat/ext001-llms-faq`, pushed to
`origin`; CI workflow targets `main` only, so the deployment was made with the
project's own sanctioned script `npm run deploy:cf`).

**Pages deployment:** final production deployment
`https://4443061a.quantumpiforge.pages.dev` (project `quantumpiforge`, aliased
to `quantumpiforge.com`); live `version.json` reports commit
`80fb78c` = HEAD at build time. An earlier deploy (`614c63f0`) served the
B2/B3-fixed code while `version.json` still reported `9a7fa64`; that
provenance mismatch was found and corrected by rebuilding at HEAD and
redeploying.

---

## 1. What is now live

A stranger can complete this loop with **no email, no account, no wallet**:

LAND → SUBMIT → PRIVATE STATUS LINK → CHECKING → PRIVATE RESULT → (optional,
inactive) CAD $250 EVIDENCE PACKAGE

- `https://quantumpiforge.com/verification-request` — on-site form, no `mailto:`
- `https://quantumpiforge.com/api/claim` — POST create / GET status (capability
  token) / PUT operator-only update
- `https://quantumpiforge.com/claim-status` — private status page (noindex)
- Payment button present and **inert**: "Pay CAD $250 — checkout coming online"

## 2. Model C wording applied (the only content change beyond the frozen build)

| Location | Before | After |
|---|---|---|
| Offer box | "CAD $250 flat per claim … always published" | "Submit free · result delivered privately, free · CAD $250 then buys the complete evidence package (execution record, procedure and environment, available evidence, result, receipt) … payment never buys a favorable verdict" |
| Process cards 3–5 | "Pay & register — on the record first / Review / Publish" | "3. Review — free result first · 4. Decide — same work, same fee · 5. Purchase & publish — receipt on the record" |
| Intro | "…committed to the public registry before work begins" | "…the review runs free and your result reaches you privately … CAD $250 then purchases the evidence package, which is committed to the public registry at purchase" |
| Payment stub | "nothing is owed" | plus explicit "What CAD $250 buys" sentence |
| Status page | "no charge has been raised" | "your result arrives here first, free. CAD $250 later buys the complete evidence package … payment never buys a favorable verdict" |
| `open.html`, `index.html` | "pay one flat fee for the work of testing" / "Paid work is one flat fee" | result-first, package-purchase phrasing, "PACKAGE ALWAYS PUBLISHED ONCE PURCHASED" |
| `open-gates-v1.json` (machine terms) | invoice before registration | `payment_timing`: after private result, before purchase/registration; `payment_method`: hosted checkout (activation pending); added `standard_deliverable` |

Not touched (deliberately): the withdrawn $500 certificate notice (historical
record), `work-with-us.html`, `support.html`, `founding-builders-pilot.html`
(separate email flows, out of scope for this launch).

## 3. Secret handling

- `QPF_ADMIN_TOKEN`: generated locally with `openssl rand -hex 32`, stored only
  at `~/.qpf-admin-token` (mode 600, outside the repository), uploaded with
  `wrangler pages secret put`. The value was never printed, never committed,
  never placed in client code, never in a status URL, never in any output.
- Verification that the deployed function separates roles:
  **no header → 403**, **wrong header → 403**, **correct header → 200**.
- A redeploy was required after setting the secret (the first post-secret PUT
  returned `503 admin updates disabled — QPF_ADMIN_TOKEN not set`); after
  redeploy the operator path worked.

## 4. Live verification matrix (production)

| Check | Result |
|---|---|
| Homepage → offer page path exists | PASS |
| `POST /api/claim` valid submission | PASS — `200 {"ok":true,"ref":"QPF-2026-ECEQTR",…}` (KV binding applied on first deploy) |
| `GET /api/claim?t=<token>` own claim | PASS — 200 with the submitted claim |
| `GET` unknown well-formed token | PASS — honest `404 not found — check your status link` |
| `GET` malformed token | PASS — honest `400 invalid or missing status token` |
| `PUT` with no auth (customer) | PASS — **403** |
| `PUT` with wrong secret | PASS — **403** |
| `PUT` with correct secret (operator) | PASS — 200, status advanced |
| Result + receipt rendering in a real browser | PASS — 9/9 (result section, established/not-established/unknown lists, procedure, limits, receipt link → `/verification-artifact.html`) |
| Payment button visibly inactive | PASS — `disabled` + "checkout coming online" |
| No `mailto:` on the intake path | PASS — verified in HTML and in a live browser |
| No email asked of the submitter | PASS — no email field anywhere in the loop |
| Rate limit engages honestly | PASS — 5 submissions/hour/IP; the 5th blocked with an honest 429 message (this is why the invalid-link 400 path was verified by the 15 unit tests and the local E2E run, not by a further production POST) |
| Secret exposure | PASS — admin token absent from every response, all client code, all status URLs, the repository, and this transcript |

## 5. Clean-browser stranger walkthrough

Real headless Chrome, fresh profile (no cookies, no state), production URLs:
**19/19 passed.** Highlights:

- The four customer questions are answerable on the page: *what do I give you*
  (claim + public references), *what do I get back* (evidence package),
  *when do I pay* (result first, free), *what does CAD $250 buy* (execution
  record, procedure and environment, available evidence, result, receipt).
- Submission from a clean browser succeeded → `QPF-2026-GWDWTH` + private link.
- The private status link renders the timeline, states payment is not live, and
  never asks for money, an account, or an email.
- A bad token fails honestly; no unexpected console errors.

## 6. Defects found and fixed (launch-blocking only)

| Defect | Fix | Re-verified |
|---|---|---|
| **B2** "Open status page" dropped the private token, so a visitor clicking it seconds after success saw an error-looking page | anchor now receives the token-bearing href on success (`deploy/claim-client.js` + `id="claimDoneOpen"`) | live browser: PASS |
| **B3** status page contradicted itself on losing the link ("nobody can resend it"… "operator can issue a replacement") | single truthful sentence: the link is the access; quote the reference to have a new link issued | live browser: PASS |

Registered, **not** fixed (not launch-blocking): B4 no time expectation, B7
priority option unexpressible, B8 offer-tone, B13 CI path list omits
`functions/api/*`.

## 7. Environment observations and limits

- **Deployment path:** `.github/workflows/cloudflare-pages.yml` triggers on
  `main` only; the launch deployed with the project's own branch-locked script
  `npm run deploy:cf` (refuses a `main` checkout by design). Push to the
  feature branch was performed with the operator's existing SSH key.
- **KV eventual consistency:** measured ~1s for a fresh claim to be readable
  through its status link — no visitor-facing "not found" after submitting.
- **Pages secrets** need a redeploy to reach the running function (observed).
- **Self-test records left in KV** (no delete capability exists, and none was
  authorized): `QPF-2026-ECEQTR` (closed with an honest self-test result and a
  receipt link), `QPF-2026-5AUDPU`, `QPF-2026-VRFNT7`, `QPF-2026-GWDWTH`
  (all closed as self-test records). Any record from an interrupted probe run
  also self-identifies as a self-test in its project field.
- **Admin token location:** `~/.qpf-admin-token` (mode 600). Rotation = new
  `openssl rand -hex 32` → `wrangler pages secret put` → redeploy.

## 8. What this is not, and where the next evidence comes from

This is **not** adoption, traction, revenue, or market validation. It is the
first live customer path. **$0.**

The next evidence must come from an independent human: someone who finds the
page, hands it a real claim, receives a result, and decides whether the
package is worth CAD $250.

Operator follow-ups: run your own stranger pass from a different
device/network (this machine's IP is rate-limited for an hour); connect a real
Stripe Payment Link when ready; decide B4/B7/B8; and add `functions/api/*` to
the CI path list at the next routine commit.

Reproduce: `node --test tests/claim/claim.test.js` (15 tests) ·
`npm run test:verification` (78 tests) · `node scripts/build.js` · live
walkthrough script recorded in this session.

Note: `test:claim` was intentionally **not** added to the committed
`package.json`, because that file also carries an uncommitted line from another
in-flight workstream; the test file runs directly with `node --test`. Add the
script line at the next routine commit.


