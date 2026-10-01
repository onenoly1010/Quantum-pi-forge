# Claim intake runbook — the email-free customer loop (V1)

Status: built and tested locally, **not deployed**. Deployment requires an
explicit human go (push → Cloudflare Pages workflow).

## What exists now

A stranger can do this without email, account, or wallet:

1. Open `/verification-request.html`
2. Fill the form (project, one claim, ≥1 public link, decision)
3. Submit → receives a **reference** (e.g. `QPF-2026-B2XRRD`) and a
   **private status link** (`/claim-status.html#t=<128-bit token>`)
4. Reopen the link anytime to see: received → checking → result
5. Result page shows: established / not established / unknown / method / limits,
   plus the published receipt link

The status link **is** the credential. The token never leaves the URL fragment;
the server only sees it when the customer's own page asks for status.

Payment: the button on the page is **intentionally inert**
("Pay CAD $250 — checkout coming online"). Nothing is charged; nothing is owed.

## Components

| Piece | Path |
|---|---|
| Endpoint (POST/GET/PUT `/api/claim`) | `functions/api/claim.js` |
| Form + status client | `deploy/claim-client.js` |
| Offer page (form) | `deploy/verification-request.html` |
| Private status page (noindex) | `deploy/claim-status.html` |
| Build wiring | `scripts/build.js` (staticFiles + function copy) |
| KV binding | `wrangler.pages.toml` → `QPF_CLAIMS` (id `f12af0792499477b8fa23b9d24c79d78`) |
| Tests (15, all passing) | `tests/claim/claim.test.js` (`npm run test:claim`) |

## Activation checklist (human go required)

1. Review the diff on branch `feat/ext001-llms-faq` (keeps the other
   in-flight work untouched) or cherry-pick to a clean branch.
2. Push → `.github/workflows/cloudflare-pages.yml` builds `out/` and runs
   `wrangler pages deploy` (project `quantumpiforge`).
3. After deploy, verify the binding took: POST a claim at
   `https://quantumpiforge.com/api/claim`. A `503 "intake storage is not
   configured"` means the KV binding did not apply — add `QPF_CLAIMS`
   (namespace id above) to the Pages project bindings in the dashboard.
4. Set the operator secret (enables status updates):
   `npx wrangler pages secret put QPF_ADMIN_TOKEN --project-name=quantumpiforge`
   (choose a long random value; until set, PUT returns an honest 503).
5. Run the loop once yourself as a customer would.

## Operating the queue

List recent submissions (KV):

```bash
# Note: the root wrangler config does not declare QPF_CLAIMS, so use the
# namespace id directly (published in wrangler.pages.toml).
NS=f12af0792499477b8fa23b9d24c79d78
npx wrangler kv key list --namespace-id $NS --remote --prefix 'ref:'
```

Look up a customer's token by their reference:

```bash
npx wrangler kv key get "ref:QPF-2026-B2XRRD" --namespace-id $NS --remote
```

Advance a claim:

```bash
curl -X PUT https://quantumpiforge.com/api/claim \
  -H 'content-type: application/json' \
  -H "x-qpf-admin: $QPF_ADMIN_TOKEN" \
  -d '{"ref":"QPF-2026-B2XRRD","status":"checking"}'
```

Complete a claim with its result:

```bash
curl -X PUT https://quantumpiforge.com/api/claim \
  -H 'content-type: application/json' \
  -H "x-qpf-admin: $QPF_ADMIN_TOKEN" \
  -d '{
    "ref":"QPF-2026-B2XRRD",
    "status":"complete",
    "result":{
      "verified":["..."],
      "unverified":["..."],
      "unknown":["..."],
      "method":"...",
      "limits":"...",
      "receiptUrl":"/verification-artifact.html"
    }
  }'
```

Statuses: `received` | `checking` | `declined` | `complete`.
`declined` renders the intake-declined message with "no charge is raised".

## Known limits (honest list)

- **No payment rail yet.** The stub button must be replaced with a hosted
  checkout link (Stripe Payment Link) when the operator creates one — one
  attribute change, no redesign.
- **Offer-terms sequencing:** published v2 terms say the fee is settled
  before work begins; the desired customer loop described by the operator
  has payment after result. Reconciling that is an operator decision —
  not changed here.
- **Still-email entry points elsewhere:** `deploy/work-with-us.html`,
  `deploy/founding-builders-pilot.html`, `deploy/support.html` keep
  `mailto:` flows (not part of this loop).
- Rate limit: 5 submissions/hour per IP; honeypot drops bot posts silently.
- Claim content lives in KV plaintext — customers are told to send public
  references only, never secrets (existing notice kept on the page).
- Publishing accepted claims to the public registry is still a manual
  operator step (unchanged).

## Test evidence

- `npm run test:claim` → 15/15 pass (validation, honeypot, rate limit,
  capability-link auth, admin auth, result round-trip, missing-config 503)
- Full local build (`node scripts/build.js`) green; `verify-entry-surfaces`
  exit 0; built offer page contains the form and **zero** `mailto:` links
- HTTP end-to-end simulation (static site + real function + in-memory KV):
  submit → status link → operator update → result visible → auth failures
  honest — 13/13 pass
