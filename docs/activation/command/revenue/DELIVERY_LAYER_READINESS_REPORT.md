# DELIVERY_LAYER_READINESS_REPORT

**Status:** `NO_SEND_DESIGN_READY`  
**Scope:** Revenue outreach delivery only. No external delivery, credential activation, or payment action is performed by this report.

## Current delivery components

| Component | Current state | Delivery suitability |
| --- | --- | --- |
| Outreach queue, drafts, and approval receipts | Present | Reusable source of approved delivery envelopes |
| Delivery evidence receipts | Present | Reusable evidence convention; provider confirmation capture is absent |
| `press-agent/src/bots/twitter.js` | Present | Public X posting only; does not support private outreach |
| Discord and Telegram bot modules | Present | Not a valid substitute for prospect-specific outreach without an approved channel and configured credentials |
| Press Agent API | Present | Article-generation/publishing surface; not an outreach orchestration API |
| Contact-form client | Absent | Required for any supported, policy-approved form delivery |
| Authenticated X capability | Absent | Required for any X delivery; current X credentials are empty |

## Missing components

1. A delivery-envelope schema that binds an approved target, channel, content hash, authorization, and idempotency key.
2. A no-send-by-default delivery orchestrator with an explicit live-mode gate.
3. Channel adapters:
   - X public post adapter for expressly public communications.
   - X private-message adapter only if a provider-supported, authorized API capability exists.
   - Per-provider contact-form adapters only after the target form, consent requirements, and anti-abuse constraints are explicitly supported.
4. Provider-confirmation capture that records a message ID, permalink, response ID, or confirmed form submission.
5. Persistent delivery state and retry controls. The existing Press Agent uses in-memory storage and cannot provide durable delivery evidence.
6. Presence-only configuration validation for the new delivery secrets and non-secret policy settings.

## Recommended implementation path

### Phase 1 — Delivery core

Create a local delivery module with:

- `delivery-envelope-v1`: target, channel, message reference, SHA-256 content hash, authorization reference, idempotency key, and requested mode.
- State transitions: `PREPARED` -> `AUTHORIZED` -> `EXECUTING` -> `EXECUTED` -> `VERIFIED`, plus `BLOCKED` and `FAILED`.
- Default `OUTREACH_DELIVERY_MODE=disabled`; dry-run may validate envelopes but never call a provider.
- Append-only JSON evidence receipts stored under `receipts/outreach/delivery/`.

### Phase 2 — Channel adapters

1. **X public:** reuse the existing OAuth 1.0a signing helper only for approved public posts. Require a specific public-post approval and capture the returned post ID/permalink.
2. **X private:** do not implement until an approved API plan and scopes explicitly support private messaging. Do not repurpose public-post credentials.
3. **Contact forms:** implement a separate adapter per form only after the form endpoint, anti-bot requirements, terms, and response semantics are verified. Default all unknown forms to `BLOCKED`.

### Phase 3 — Evidence and controls

- Write a `DELIVERY_ATTEMPT` receipt before provider invocation.
- Write an `EXECUTED` receipt only from the provider response.
- Write `VERIFIED` only from an independent confirmation or stable provider identifier.
- Enforce idempotency on `target + channel + content hash`; duplicate requests return the original receipt without redelivery.
- Keep an operator-visible status index with no credential or sensitive payload exposure.

## Required configuration

Store all secrets only in the local runtime environment or a secret manager. Never commit them.

| Setting | Purpose | Required for |
| --- | --- | --- |
| `OUTREACH_DELIVERY_MODE` | `disabled`, `dry_run`, or `live` | All delivery runs |
| `OUTREACH_EVIDENCE_DIR` | Local receipt directory | Durable evidence |
| `TWITTER_API_KEY` | X OAuth consumer key | Approved public X posts |
| `TWITTER_API_SECRET` | X OAuth consumer secret | Approved public X posts |
| `TWITTER_ACCESS_TOKEN` | X access token | Approved public X posts |
| `TWITTER_ACCESS_SECRET` | X access-token secret | Approved public X posts |
| `PRESS_AGENT_LIVE_X_POST=1` | Existing explicit live X gate | Approved public X posts |
| Provider-specific form configuration | Endpoint identifier and non-secret policy metadata | A supported contact-form adapter |

Private X outreach additionally requires a provider-supported messaging capability and scopes; it must not be inferred from public-post credentials.

## Security considerations

- Keep secrets out of the repository, receipts, logs, and terminal output.
- Validate configuration by presence only.
- Require explicit channel allowlists and per-delivery authorization references.
- Never bypass CAPTCHA, anti-bot controls, consent requirements, or site terms.
- Do not log unneeded prospect data; evidence records should store references and hashes rather than duplicate message bodies.
- Enforce no-send by default and reject unknown channels/forms.
- Never conflate delivery success with a partnership, engagement, payment, or revenue event.

## Estimated effort

| Work item | Estimate |
| --- | ---: |
| Delivery envelope, state machine, receipt writer, and dry-run tests | 0.5-1 day |
| Public X adapter with idempotency and provider evidence | 0.5 day after credentials and a public-post use case are available |
| Per-provider contact-form adapter | 0.5-1 day each after form requirements are verified |
| Status index and operational documentation | 0.25 day |

## Authorization boundary

Implementation may proceed in no-send and dry-run modes. Live external delivery remains blocked until the required channel capability, credentials, and provider-confirmation path are configured and verified.
