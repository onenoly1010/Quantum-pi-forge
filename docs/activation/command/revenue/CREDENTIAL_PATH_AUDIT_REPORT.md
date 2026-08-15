# CREDENTIAL_PATH_AUDIT_REPORT

**Audited at:** `2026-08-01T01:05:41Z`  
**Scope:** Press Agent and revenue-delivery foundation credential paths.  
**Method:** Presence-only inspection. No credential values were read, displayed, copied, or written.

## Outcome

The delivery foundation cannot access outreach credentials because its expected local runtime
configuration is absent and the repository secret store does not contain the required
channel-specific secrets. The existing GitHub CLI authentication is a repository-management
credential in the OS keyring; it is not available to, or suitable for, outreach delivery.

No external delivery was attempted.

## Locations searched

| Location | Result |
| --- | --- |
| Repository `.env`, `.env.local`, `press-agent/.env`, and `press-agent/.env.local` | Absent |
| Home-level `/home/kris/.env` | Absent |
| Environment of the current delivery process | No delivery configuration, X, email, contact-form, Discord, Telegram, or WordPress variables present |
| `press-agent/.env.example` | Present; template only |
| Press Agent source and GitHub Actions workflow | Present; identifies expected variable names and integrations |
| GitHub repository Actions secrets | `DISCORD_WEBHOOK_URL` exists; no X/Twitter or Telegram secret is configured |
| GitHub repository Actions variables | None configured |
| OS keychain tooling | GitHub CLI is authenticated through the keyring; no Linux Secret Service or macOS Keychain tool is available |
| Password-store | Not initialized |
| Cloud secret-store CLI | Azure CLI unavailable; no supported cloud secret-store client available |
| Copilot local configuration | Configuration files exist, but no readable delivery credential configuration was found |

## Existing integrations

| Integration | Configuration path | Current capability |
| --- | --- | --- |
| X public posting | `press-agent/src/bots/twitter.js` | OAuth 1.0a public-post scaffold only; not private outreach |
| Delivery foundation X channel | `press-agent/src/delivery/adapters.js` | No-send adapter; requires X credentials before validation can pass |
| Discord | `press-agent/src/bots/discord.js` and GitHub Actions | Repository secret exists, but not injected into the local runtime; not approved as a prospect-outreach channel |
| Telegram | `press-agent/src/bots/telegram.js` and GitHub Actions | Scaffold exists; credentials are absent |
| WordPress | `press-agent/src/publishers/wordpress.js` | CMS publishing only; local credential is absent and unrelated to prospect outreach |
| Email | Delivery foundation configuration only | No provider adapter or credential configuration exists |
| Contact forms | Delivery foundation configuration only | No provider-specific adapter, endpoint configuration, or credentials exist |

The `press-agent-communications.yml` workflow uses delivery-channel secrets only for a health
smoke check. It does not invoke the governed revenue delivery state machine and must not be
treated as an outreach execution path.

## Credential and configuration status

| Credential or setting | Required by | Expected location | Current status | Exact configuration step |
| --- | --- | --- | --- | --- |
| `OUTREACH_DELIVERY_MODE` | Delivery state machine | Local `press-agent/.env` or process environment | **Not configured** | Set to `disabled` for normal no-send operation; set to `live` only during a separately authorized activation. |
| `OUTREACH_EVIDENCE_DIR` | Delivery evidence store | Local `press-agent/.env` or process environment | **Not configured** | Set a local writable path for delivery receipts before live activation. |
| `OUTREACH_LIVE_SEND_ACK` | Live-delivery safety gate | Local `press-agent/.env` or process environment | **Not configured** | Set to `ENABLE_APPROVED_DELIVERY` only for an authorized live delivery session. |
| `TWITTER_API_KEY` | X public-post adapter | Local `press-agent/.env`; GitHub Actions secret for CI only | **Missing** | Create or retrieve an X application consumer key, store it in the approved local secret source, and inject it into the Press Agent runtime. |
| `TWITTER_API_SECRET` | X public-post adapter | Local `press-agent/.env`; GitHub Actions secret for CI only | **Missing** | Store the matching X application consumer secret in the approved local secret source and inject it into the runtime. |
| `TWITTER_ACCESS_TOKEN` | X public-post adapter | Local `press-agent/.env`; GitHub Actions secret for CI only | **Missing** | Create or retrieve an authorized X access token for the approved public-post account and inject it into the runtime. |
| `TWITTER_ACCESS_SECRET` | X public-post adapter | Local `press-agent/.env`; GitHub Actions secret for CI only | **Missing** | Store the matching X access-token secret in the approved local secret source and inject it into the runtime. |
| `PRESS_AGENT_LIVE_X_POST` | Existing X public-post scaffold | Local `press-agent/.env` or process environment | **Not configured** | Set to `1` only after public-post authorization, credential verification, and provider-evidence support are complete. |
| `DISCORD_WEBHOOK_URL` | Existing Discord bot | GitHub Actions secret and, if locally used, `press-agent/.env` | **Found in GitHub Actions only** | Inject it into a local runtime secret source only if a separately approved Discord delivery use case is established. Do not repurpose it for prospect outreach. |
| `TELEGRAM_BOT_TOKEN` | Existing Telegram bot | Local `press-agent/.env`; GitHub Actions secret | **Missing** | Configure only if Telegram becomes an approved channel with a validated recipient and evidence path. |
| `TELEGRAM_CHAT_ID` | Existing Telegram bot | Local `press-agent/.env`; GitHub Actions secret | **Missing** | Configure only with the approved Telegram recipient/channel identifier after policy validation. |
| `EMAIL_PROVIDER` | Future email adapter | Local `press-agent/.env` or secret manager | **Not configured** | Select an approved email provider and implement its adapter before configuring this setting. |
| `EMAIL_API_KEY` | Future email adapter | Local secret source or secret manager | **Missing** | Create a least-privilege provider key only after the email adapter and provider-confirmation capture are implemented. |
| `EMAIL_FROM` | Future email adapter | Local `press-agent/.env` or process environment | **Not configured** | Configure a verified sender identity after selecting the provider. |
| Contact-form provider configuration | Future contact-form adapter | Per-provider local configuration and secret source | **Not configured** | Validate the target form's terms and supported submission method, then implement and configure a dedicated adapter. |
| `WORDPRESS_APP_PASSWORD` | WordPress publisher | Local `press-agent/.env` | **Missing** | Configure only for CMS publishing; it does not enable revenue outreach. |
| GitHub CLI keyring token | GitHub CLI | OS keyring | **Found** | No action for revenue delivery. It must not be used as a substitute for channel credentials. |

## Why delivery remains blocked

1. No local `.env` file or process-level delivery configuration exists.
2. The X credentials required by the only credential-aware delivery adapter are absent locally
   and are not present in GitHub Actions secrets.
3. Default delivery adapters are intentionally no-send; credentials alone cannot make email,
   private X, or contact-form delivery occur.
4. No approved provider-specific email or contact-form adapter can produce a delivery
   confirmation identifier.
5. The delivery mode and explicit live acknowledgement are not configured.

## Shortest safe recovery path

1. Choose one authorized channel that the current foundation can support. At present, that can
   only be a specifically approved public X post after a real X adapter with confirmation
   capture is implemented; it is not private prospect outreach.
2. Restore or create only that channel's credentials in an approved local secret source, then
   load them into the Press Agent runtime without committing a `.env` file.
3. Configure the non-secret delivery settings and a writable evidence directory.
4. Implement and test the channel's provider adapter, including response identifier/permalink
   capture and idempotency.
5. Run a presence-only credential check and a dry-run. Keep
   `OUTREACH_DELIVERY_MODE=disabled` until a separate final activation authorization.

This audit does not request or expose credentials. It establishes that the required outreach
credentials and delivery configuration are currently absent from the locations available to the
delivery system.
