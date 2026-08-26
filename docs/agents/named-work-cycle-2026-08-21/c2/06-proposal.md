# Proposal — cycle 2026-08-21-c2

```text
AGENT: Proposal
ROLE: declared operating role
TASK: one bounded proposal from verified cycle-2 evidence; do not auto-execute
RESULT: EXECUTED (proposal only)
```

Cycle 1 already proposed a **landing-copy GO** for the $500 certificate. That proposal stands. This file does **not** replace it.

## Problem

The live public status document still pins **`main_commit_short: 22f3028`** and labels Phase 8.5 **soft SLA as OPEN** after **2026-08-13**, while:

- git tip is `e43cd55` (#785);
- hard SLA **2026-08-29T15:02:00Z** is eight days away;
- eligible reports **n=0**.

A reviewer who trusts the JSON will verify the wrong commit and think the soft SLA is still running. That is an evidence-integrity defect on a `deploy/**` file that Cloudflare Pages publishes from `main`.

## Evidence

- Live `https://quantumpiforge.com/verification-status-v1.json` → `22f3028`, `8_5_soft_sla_status: OPEN`, n=0, hard SLA 2026-08-29 (fetched 2026-08-21).
- Same bytes on `origin/main` `deploy/verification-status-v1.json` (`updated_at_utc: 2026-08-04`).
- Cycle 1 Public Page already marked the SHA pin CONTRADICTED; this cycle adds the missed soft-SLA label.
- Builder Support cycle 2: leftover empty Copilot branches are a separate hygiene item, **not** bundled here.

## Proposed action

One **status-freshness GO** against `e43cd55`:

1. Set `source.main_commit` / `main_commit_short` to `e43cd55c9dc3549cb4ebebde6351a8dca82f0bd4` / `e43cd55`.
2. Set `8_5_soft_sla_status` to an honest missed/elapsed label (not OPEN).
3. Leave economic block **LOCKED**. Do not change $500 HTML in the same PR.
4. Note in `core_contracts` that the named pair’s W0G is QPF-custom `0xD1De4F87…`, not official `0x1Cd0690f…`.
5. Bump `updated_at_utc`. Keep `this_file_authorizes_economics: false`.

## Expected benefit

Public status matches git and calendar. Independent 8.5 reviewers (if a later send GO lands) will hash the right tree.

## Dependencies

- Human GO that includes **`deploy/**` edit**.
- Cloudflare Pages will publish on merge to `main` — treat **merge of that PR as the publish GO**, or split “commit on branch” vs “merge.”
- Landing $500 remains the cycle-1 proposal; do not sneak it into this pin.

## Authorization required

Named **status-pin GO** (docs/deploy JSON only). Merge/publish is either included in that GO or a follow-up GO. This file does **not** authorize it.

## Risks

- Touching `deploy/` publishes. A pin-only change is still a production Pages deploy.
- Mixing landing HTML into the same PR would expand blast radius.
- Changing 8.5 copy might be misread as closing Round 1; keep `8_5_status: OPEN` until quorum or an explicit close GO.

## Verification method

After a future GO: live JSON `main_commit_short` == `git rev-parse --short origin/main`; soft SLA not OPEN; economic keys still NOT_AUTHORIZED / LOCKED; pair `getReserves` still 0/0.

**NOT EXECUTED:** JSON edit, merge, Pages deploy, outreach send, Copilot branch delete.
