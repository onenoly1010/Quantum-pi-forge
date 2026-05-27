# Press Agent Bot Setup Guide

## Discord

Create a Discord webhook and set:

    DISCORD_WEBHOOK_URL=

## Telegram

Create a bot with BotFather and set:

    TELEGRAM_BOT_TOKEN=
    TELEGRAM_CHAT_ID=

## X / Twitter

Expected keys:

    TWITTER_API_KEY=
    TWITTER_API_SECRET=
    TWITTER_ACCESS_TOKEN=
    TWITTER_ACCESS_SECRET=

The current Twitter adapter may be dry-run until a real posting client is configured.

## Security

- Store production credentials in GitHub Secrets.
- Keep local credentials in press-agent/.env.
- Do not paste private keys, bot tokens, or webhooks into public logs.
