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
5. Once complete, the page shows: established / not established / unknown /
   method / limits, plus a link to the **public receipt in the registry**

The status link **is** the credential. The token never leaves the URL fragment;
the server only sees it when the customer's own page asks for status.

The private status page is only the claimant's private view of the same
result. It is **not** the receipt, not authoritative, and not a second
publication channel. The authoritative record is the public receipt in
`onenoly1010/qpf-verification-registry`. `/verification-artifact.html` is an
example artifact page, never a claim receipt.

Intake is currently closed: `SUBMISSIONS_OPEN = false` in
`functions/api/claim.js` makes POST and PUT return 503.

## The contract (v2, qpfo0:99d797bd)

**REGISTERED → INSPECT → VERIFY → PUBLIC RECEIPT → DELIVER.**

A claim is `complete` only when its public receipt is independently present
in the registry and verified against the registry's `main` history. A
verifier producing a result, or an operator saying so, is not enough.
`functions/api/claim.js` enforces this on the operator PUT and fails closed:

- `checking` or `complete` is refused (409) until `registryUrl` is set.
- `registryUrl` and `receiptUrl` must pin a registry file at a 40-hex commit
  (`https://github.com/onenoly1010/qpf-verification-registry/blob/<sha>/<path>`
  or the `raw.githubusercontent.com` equivalent). The Worker fetches that file
  read-only and requires it to contain the claim ref, and requires GitHub's
  `compare/main...<sha>` to report `identical` or `behind`, so a commit that
  exists only in a fork is rejected.
- `registryUrl` is permanent once set; a registered claim cannot be `declined`.
- `complete` is refused unless `receiptUrl` passes the same check.
- If the registry, the file, or the GitHub API cannot be reached or verified,
  including unauthenticated rate limits (60 requests/hour per IP), the PUT is
  refused. Retry later; never work around it.

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
| Tests | `tests/claim/` (`node --test tests/claim/`; there is no `npm run test:claim` script) |

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

### Intake decision

Decide at intake whether the claim is testable against public artifacts and
public-safe (see "What a public receipt may contain"). A declined web-form
claim stays private and is never registered:

```bash
curl -X PUT https://quantumpiforge.com/api/claim \
  -H 'content-type: application/json' \
  -H "x-qpf-admin: $QPF_ADMIN_TOKEN" \
  -d '{"ref":"QPF-2026-B2XRRD","status":"declined"}'
```

A decline or refusal is **never** a `FAILED` result. `FAILED` is a verification
outcome and exists only for a registered claim. Once a claim is registered it
follows the public registry contract to the end; there is no hidden or
"declined after registration" category, and the code refuses `declined` for a
registered claim.

### 1. Register (before any inspection)

Commit a row for the ref to `receipts/INDEX.md` → "Registered claims" in
`onenoly1010/qpf-verification-registry` (status `REGISTERED`), push it to
`main`, and take the pinned URL of that file at that commit. Then record it:

```bash
REG="https://github.com/onenoly1010/qpf-verification-registry/blob/<40-hex sha>/receipts/INDEX.md"
curl -X PUT https://quantumpiforge.com/api/claim \
  -H 'content-type: application/json' \
  -H "x-qpf-admin: $QPF_ADMIN_TOKEN" \
  -d "{\"ref\":\"QPF-2026-B2XRRD\",\"status\":\"checking\",\"registryUrl\":\"$REG\"}"
```

### 2. Inspect, 3. Verify

Run the review. The method and criteria do not change with the outcome.

### 4. Public receipt

Commit `receipts/<ref>.md` (e.g. `receipts/QPF-2026-B2XRRD.md`) and the
"Delivered receipts" row in `receipts/INDEX.md` to `main`, then take the
pinned URL of the receipt file at that commit.

### 5. Complete and deliver

```bash
RECEIPT="https://github.com/onenoly1010/qpf-verification-registry/blob/<40-hex sha>/receipts/QPF-2026-B2XRRD.md"
curl -X PUT https://quantumpiforge.com/api/claim \
  -H 'content-type: application/json' \
  -H "x-qpf-admin: $QPF_ADMIN_TOKEN" \
  -d "{
    \"ref\":\"QPF-2026-B2XRRD\",
    \"status\":\"complete\",
    \"result\":{
      \"verified\":[\"...\"],
      \"unverified\":[\"...\"],
      \"unknown\":[\"...\"],
      \"method\":\"...\",
      \"limits\":\"...\",
      \"receiptUrl\":\"$RECEIPT\"
    }
  }"
```

The claimant then sees the same result on their private status page, with the
link to the public receipt. That is delivery; the receipt was already public.

Statuses: `received` | `checking` | `declined` | `complete`.

### What a public receipt may contain

- Claim ref, the claim text and its scope, the verification result
  (`ESTABLISHED` / `FAILED` / `UNKNOWN`), the public evidence and links, and
  verification metadata (method, limits, commits, hashes, dates).
- **Not** `decision` (the claimant's private reason for asking).
- **Not** `project`, unless the claimant explicitly gave it as public-safe.
- No unnecessary personal information, no doxxing, no character judgments, and
  no accusations of wrongdoing.
- Never: the status token, the `ref:` → token mapping, IP addresses or `rl:`
  keys, `QPF_ADMIN_TOKEN`, or internal operator notes. Keep internal notes out
  of `method` and `limits`, which the claimant sees.

Third-party claims (about someone else's public project) are allowed, but the
claim must be bounded to public technical artifacts and public-safe. QPF
verifies the claim; it never pronounces on a person.

### Trust boundary

The code refuses to mark a claim complete without a verified public receipt.
It cannot stop the registry owner from force-pushing or rewriting the
registry after the check, and it cannot make a human do the registry commits.
Registry integrity depends on the repository's governance (who can push to
`main`, branch protection, outside copies). A registry check that fails or
cannot run means the claim does not advance.

## Known limits (honest list)

- **No payment rail yet.** The stub button must be replaced with a hosted
  checkout link (Stripe Payment Link) when the operator creates one — one
  attribute change, no redesign.
- **Offer-terms sequencing:** decided Oct 7, 2026: the v2 terms apply (fee
  settled after intake acceptance and before public registration, registration
  before work, every result published). The earlier "free private result, pay
  afterwards" loop is withdrawn. Payment activation is still on hold.
- **Still-email entry points elsewhere:** `deploy/work-with-us.html`,
  `deploy/founding-builders-pilot.html`, `deploy/support.html` keep
  `mailto:` flows (not part of this loop).
- Rate limit: 5 submissions/hour per IP; honeypot drops bot posts silently.
- Claim content lives in KV plaintext — customers are told to send public
  references only, never secrets (existing notice kept on the page).
- Registering claims and committing receipts to the public registry are
  manual operator steps. The code only refuses to advance a claim until those
  commits exist on the registry's `main` and name the claim ref.

## Test evidence

- `node --test tests/claim/` → 24/24 pass (validation, honeypot, rate limit,
  capability-link auth, admin auth, result round-trip, missing-config 503,
  closed-intake gate, v2 contract gates in `contract.test.js`)
- Full local build (`node scripts/build.js`) green; `verify-entry-surfaces`
  exit 0; built offer page contains the form and **zero** `mailto:` links
- HTTP end-to-end simulation (static site + real function + in-memory KV):
  submit → status link → operator update → result visible → auth failures
  honest — 13/13 pass
