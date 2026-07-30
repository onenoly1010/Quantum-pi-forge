# Queue Retries Schema v1

**Mode:** Living Forge autonomous queue (P3)  
**Posture:** `NO_WALLET_TOUCH=true`  
**Branch context:** `ops/autonomy-day3-admin-p3-v1` on `onenoly1010/Quantum-pi-forge`

## Task object (extended)

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string | yes | Stable task id |
| `priority` | 0–4 | yes | P0 human critical … P3 auto … P4 background |
| `status` | enum | yes | `open` \| `in_progress` \| `done` \| `failed` \| `dead_letter` |
| `action` | string | yes | Dispatcher key (must be policy allow-listed for P3) |
| `title` | string | yes | Human-readable |
| `risk` | `low` \| `medium` \| `high` | yes (v1+) | Auto-run only when `low` (or medium with explicit flag later) |
| `max_attempts` | number | no | Cap before dead-letter (default from thresholds) |
| `backoff_sec` | number | no | Base backoff after failure (default 60) |
| `depends_on` | string[] | no | Task ids that must be `done` before claim |
| `outcome` | enum | no | Last closed outcome: `success` \| `fail` \| `blocked` \| `escalated` \| `dead_letter` |
| `next_eligible_at_utc` | ISO string | no | Do not claim before this (retry backoff) |
| `consecutive_failures` | number | no | Failure streak for dead-letter |
| `idempotency_key` | string | no | Last claim attempt key |
| `claim_id` | string | no | Active lease id |
| `claim_lease_until_utc` | ISO string | no | Lease expiry |
| `recurring` | boolean | no | Re-open after TTL when done/failed |
| `no_wallet_touch` | boolean | no | Must be true for wallet-adjacent lanes |

## Retry policy

| Risk | Auto-retry | After max failures |
| --- | --- | --- |
| `low` | yes, with exponential-ish backoff | `dead_letter` |
| `medium` | 1 retry then escalate to human queue | `open` + escalated event |
| `high` | never auto-run | stay `open` / human |

### Backoff formula

```text
delay_sec = min(backoff_sec * 2^(consecutive_failures - 1), 3600)
next_eligible_at_utc = now + delay_sec
```

### Dead-letter

When `consecutive_failures >= max_attempts` (task or global default):

- `status = dead_letter`
- append `artifacts/kpi/dead-letter.jsonl`
- emit `dead_lettered`

## Claim eligibility (Day 3)

A P3 task is claimable only if all are true:

1. `status === "open"`
2. `priority === 3`
3. `risk` is missing or `low` (Day 3: medium/high not auto-claimed)
4. `next_eligible_at_utc` absent or ≤ now
5. every `depends_on` id is `done` (if present)
6. not `dead_letter`

## Machine schema file

`docs/activation/living-forge/queue/queue-retries-schema-v1.json`

## Non-claims

Does not authorize wallet, sign, transfer, deploy, or commercial activation.
