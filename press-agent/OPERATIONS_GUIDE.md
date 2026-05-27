# Press Agent Operations Guide

## Purpose

The Press Agent coordinates outbound project communications across configured channels such as Discord, Telegram, and X/Twitter.

## Local Start

Run:

    cd press-agent
    npm install
    npm start

## Health Check

Run:

    curl http://localhost:3001/health

## Environment

Copy the example file:

    cp .env.example .env

Then configure the channels you intend to use.

Common keys:

    PORT=3001
    DISCORD_WEBHOOK_URL=
    TELEGRAM_BOT_TOKEN=
    TELEGRAM_CHAT_ID=
    TWITTER_API_KEY=
    TWITTER_API_SECRET=
    TWITTER_ACCESS_TOKEN=
    TWITTER_ACCESS_SECRET=

## Safe Operating Rules

- Never commit .env.
- Never print secrets in logs.
- Use private test channels before public posting.
- Treat Twitter/X as dry-run unless the real posting client is wired in.

## Verification

From the repository root:

    ./verify-press-agent.sh
