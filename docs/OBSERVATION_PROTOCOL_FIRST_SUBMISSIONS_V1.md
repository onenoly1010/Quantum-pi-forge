# Observation protocol — first independent submissions (V1)

**Posture: observe the engine. Do not improve it.**

The live customer path exists. From here, the next measurement comes from the
world, not from us:

```
stranger → real problem → submission → useful result → trust → payment
```

Submission is **not** success. Completion is **not** success. A positive result
is **not** success. **Payment is the first unmistakable economic signal.**
Until then the commercial record stays **$0** — and that is the measurement,
not a failure.

## Prohibited from this point (until an operator says otherwise)

- No new features, no B4/B7/B8 work, no "polish" of the live path.
- No manufactured traffic, no seeding examples that look like customers, no
  using our own agents as if they were demand.
- No outreach, no funnel, no follow-up, no coaching a person toward the
  "right" behavior.
- No publishing anything about a submitter's identity or private content.
- No instrumentation added to the live pages without a separate, explicit
  authorization: adding analytics or referrer capture **changes the privacy
  posture** of a page that promises no account, no wallet, no email. That is a
  product decision, not an ops detail.

## What "independent submission" means

A claim submitted by a person who is:

- not the operator,
- not an agent or bot acting for the operator,
- not a self-test created during launch verification.

**Baseline at 2026-10-01T01:21Z:** 5 records exist, all self-tests
(`QPF-2026-ECEQTR`, `…TVUGBC`, `…5AUDPU`, `…VRFNT7`, `…GWDWTH`). Their project
fields say "self-test", "walkthrough", or "probe". **Any other reference is the
first independent submission until proven otherwise.**

## Honest observability (do not pretend we can see more)

| What we want to know | Can we observe it today? | How |
|---|---|---|
| That a submission arrived | **Yes** | `ref:` keys in KV; record appears in the queue |
| When it arrived | **Yes** | `createdAt` |
| What they submitted | **Yes** | claim text + public links in the record |
| Where the claim pointed / what it was for | **Yes** | the `decision` field |
| How they found QPF | **No** | no referrer capture, no analytics. Only if the person says so |
| Where they hesitated | **No** | incomplete submissions are not stored; only if the person says so |
| Whether they returned | **No** | status reads are not logged, deliberately. Only if the person says so |
| Whether they understood the result | **No** | only if the person says so |
| Whether they asked for the package | **Only via a channel a human used** | payment rail is inert; a person can only ask in writing through existing public channels |
| Whether they paid | **Yes, once the rail is live** | payment provider record. Today: impossible, so **no** |
| What they valued | **No** | only from what they say |

Everything marked **No** is `UNKNOWN`, and `UNKNOWN` stays `UNKNOWN` — it is
not filled in with a friendlier assumption.

## Where observations are recorded

- **Private log:** `~/.qpf-observations/FIRST_SUBMISSIONS_LOG.md` (mode 600,
  outside the repository). Never committed; it may contain a real person's
  words and identifying context.
- **Public record:** only what is already public by the published offer —
  a claim's text/scope/result once an evidence package is purchased — plus
  aggregate counts that contain no personal data.
- Published statements must keep the demonstrated / assumed / untested
  distinction the project already uses, and must never upgrade `UNKNOWN` into
  a claim.

## Recording discipline for the first submission

1. Record within the same day; verbatim quotes in quotation marks, marked as
   the person's words.
2. Mark every entry with its source: `observed` (in the record), `told to us`
   (the person said it), or `unknown`.
3. Never ask leading questions, never interview, never nudge behavior. If the
   person volunteers something, write it down; if they do not, write `unknown`.
4. Do not contact the person through any new channel, and never by email.
5. Do not treat the submission as a customer, a user, or traction in any
   public statement until money has moved.
6. If the first submission turns out to be a self-test or a bot, label it as
   such and do not count it as demand.
