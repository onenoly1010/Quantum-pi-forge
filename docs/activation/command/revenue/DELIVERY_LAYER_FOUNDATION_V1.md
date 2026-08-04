# Delivery Layer Foundation v1

**Status:** `NO_SEND_FOUNDATION_IMPLEMENTED`

## Implementation plan and modules

| Module | Responsibility |
| --- | --- |
| `press-agent/src/delivery/config.js` | Reads no-send delivery configuration and performs presence-only credential checks. |
| `press-agent/src/delivery/adapters.js` | Defines the adapter contract and no-send default adapters for X public posts, email, contact forms, and other approved channels. |
| `press-agent/src/delivery/evidence-store.js` | Persists append-only transition receipts and the latest durable delivery state. |
| `press-agent/src/delivery/service.js` | Enforces the delivery state machine and live-mode gate. |
| `press-agent/src/tests/delivery.test.js` | Covers transitions, credential blocking, live-gate blocking, and evidence retention. |

## Evidence schema

Every receipt uses `qpf.delivery_evidence.v1` and contains:

```text
event
atUtc
deliveryId
delivery.target
delivery.channel
delivery.messageReference
delivery.messageSha256
delivery.authorizationReference
details
```

Message bodies and credentials are excluded from receipts. The message hash binds the approved content to its evidence trail.

## State machine

```text
PREPARED -> AUTHORIZED -> SENT -> CONFIRMED -> VERIFIED
```

`SENT` is written only after an adapter returns a successful provider result. `CONFIRMED` requires an independent provider identifier. `VERIFIED` requires an evidence reference. Credential, policy, and live-gate failures generate `BLOCKED` evidence without fabricating a successful state.

## Configuration

Copy `press-agent/.env.example` to the untracked local `press-agent/.env`. Keep:

- `OUTREACH_DELIVERY_MODE=disabled` during development.
- `OUTREACH_EVIDENCE_DIR` pointed to a durable local receipt directory.
- Channel credentials in local environment or a secret manager only.

The current adapters are intentionally no-send. A future live adapter must be implemented and tested for its specific provider before delivery can occur.

## Tests

Run:

```bash
cd press-agent
npm test
```

The tests use temporary evidence directories and do not invoke any network provider.
