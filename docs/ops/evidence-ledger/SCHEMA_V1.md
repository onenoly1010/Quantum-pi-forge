# Evidence ledger event schema v1

One JSON object per line in `events.jsonl`.

```json
{
  "ts_utc": "2026-08-07T19:32:00Z",
  "signal_class": "external",
  "stage": "request",
  "channel": "email",
  "summary": "Unsolicited request for verification of public deploy claim",
  "source_ref": "message-id or URL if any",
  "anonymous": true,
  "prior_qpf_involvement": false,
  "understood_problem": "unknown|yes|no",
  "asked_for_verification": true,
  "pricing_or_economic_question": false,
  "notes": "optional free text",
  "logged_by": "human|steward"
}
```

## Fields

| Field | Values / notes |
| --- | --- |
| `signal_class` | `external` (counts for demand) · `internal` (ops only) · `enablement` (funnel smoke) |
| `stage` | `visit` · `problem` · `try` · `request` · `conversation` · `pricing` · `economic_signal` · `funnel_smoke` |
| `channel` | `web` · `email` · `github` · `x` · `direct` · `other` |
| `prior_qpf_involvement` | `false` for true cold external |
| `asked_for_verification` | north-star boolean when stage ≥ request |

## Aggregates

Do not invent analytics. Counts are **manual** from this file until a real analytics source is deliberately added (separate GO; not required for this loop).
