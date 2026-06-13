# Press Agent Read-Only Readiness v1

## Purpose

This document records a read-only press-agent / comms readiness inspection.

No message was sent. No bot was activated. No webhook was invoked. No secret value is printed or committed.

## Canonical Baseline

The check starts from canonical `main` after the current funder audit handoff lane.

Required proof commands pass before comms inspection:

- `npm run governance:cross-platform-determinism:v1:check`
- `npm run governance:current-funder-audit-handoff:v1:check`
- `npm run verify:evidence`

## Environment File Presence

- Root `.env` present: `true`
- `press-agent/.env` present: `true`

## Press Agent Credential Key Presence

Only key names were inspected. Secret values were not printed.

- `DISCORD_WEBHOOK_URL` key present: `true`
- `TELEGRAM_BOT_TOKEN` key present: `true`
- `TELEGRAM_CHAT_ID` key present: `true`
- `TWITTER_API_KEY` key present: `true`
- `TWITTER_API_SECRET` key present: `true`
- `TWITTER_ACCESS_TOKEN` key present: `true`
- `TWITTER_ACCESS_SECRET` key present: `true`
- `PRESS_AGENT_LIVE_X_POST` key present: `true`

## Configuration Hygiene Finding

`press-agent/.env` contains malformed command-like lines: `true`

These lines should be removed from the local uncommitted runtime environment file before any live press-agent operation.

## Existing Press-Agent Verification Scripts

Existing package scripts include:

- `press-agent:discord-only-proof:v1:check`
- `press-agent:credential-completion-boundary:v1:check`
- `comms:press-agent-discord-parked-broadcast:v1:check`

## Send / Publish Surfaces Detected

Read-only scan identified send or publish capable code paths for:

- Discord
- Telegram
- Twitter/X
- WordPress

Any live use must remain gated by explicit human approval.

## Execution Boundary

This readiness lane is strictly non-executing:

- no Discord send
- no Telegram send
- no Twitter/X post
- no WordPress publish
- no deployment
- no unpark
- no key use beyond local key-name presence inspection
- no chain mutation
- no token action
- no Cloudflare publish
- no mainnet action

The execution receipt remains absent:

- `receipts/execution/v2-mainnet-cutover-execution-v1.json`

## Next Safe Step

Before live communication, clean `press-agent/.env` so it contains only valid `KEY=value` entries, then rerun a read-only verifier.
