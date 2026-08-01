# Weekly Commercial Metrics v1

**Purpose:** Produce an honest weekly view of the visitor-to-client journey.
Metrics are operational signals, not traction claims. Unknown values remain
`not tracked`; they are never estimated.

## Weekly report template

```text
Week ending:
Prepared by:
Public-site health:

Traffic
- Work With page visits:
- CTA email-link activations:
- Referral sources:
- Data source:

Inquiries
- New qualified inquiries:
- Discovery conversations:
- Proposals sent:
- Paid engagements:

Conversion blockers
- Visitor-to-inquiry:
- Inquiry-to-discovery:
- Discovery-to-proposal:
- Proposal-to-engagement:

Actions completed this week:
Planned experiment for next week:
```

## Collection rules

1. Confirm `https://quantumpiforge.com/work-with-us.html` and
   `/deployed-addresses` return HTTP 200 before reporting traffic or inquiry
   conclusions.
2. Count an inquiry only after a human receives an email or direct message.
   A `mailto:` link cannot prove that an email was sent.
3. Count a paid engagement only after independent payment evidence exists.
   Do not record payment details, wallet addresses, or credentials here.
4. Record the source for every non-null metric. If no privacy-respecting
   analytics or inquiry log exists, report `not tracked`.
5. Turn the most repeated blocker into one bounded website, proposal, or
   onboarding improvement for the following week.

## Initial baseline

| Metric | Initial status | Reason |
| --- | --- | --- |
| Work With page visits | `not tracked` | No analytics source is configured. |
| CTA email-link activations | `not tracked` | A static mailto link has no delivery confirmation. |
| Qualified inquiries | `not tracked` | Requires a human-maintained inquiry log. |
| Proposals sent | `not tracked` | Requires a human-maintained proposal log. |
| Paid engagements | `not tracked` | Requires independent payment evidence. |

The current public improvement is a structured project-brief CTA and a
published three-step engagement path. Measure its effect only after a
privacy-respecting data source is deliberately chosen.
