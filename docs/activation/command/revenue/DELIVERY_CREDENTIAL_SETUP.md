# Delivery Credential Setup

**Status:** ACTIVE configuration contract  
**Scope:** Secure path only. No outbound sends. No secret values in this document or any committed file.  
**Related:** `CREDENTIAL_PATH_AUDIT_REPORT.md` (local), press-agent credential boundary, secret-rotation freeze (lifted 2026-07-30)

---

## 1. Official credential source

| Layer | Location | Purpose |
| --- | --- | --- |
| **Primary (local runtime)** | OS keychain / secret service **or** gitignored local env file | Delivery layer processes running on the operator machine |
| **Secondary (CI only)** | GitHub Actions repository secrets | Automated Discord diagnostics and non-outreach CI jobs |
| **Forbidden** | Any file inside the git working tree (including `.env` that is tracked) | Prevents accidental commit / exposure |

**Preferred local mechanisms (in order):**

1. OS keychain / secret store  
   - Linux: `secret-tool` / libsecret  
   - macOS: Keychain Access  
   - Windows: Credential Manager  
2. Encrypted secret manager loaded at process start (e.g. age / sops decrypted into memory only)  
3. Gitignored dotenv file **outside** the repository root or explicitly listed in `.gitignore` (already covers `.env`, `.env.*`, `.env.generated`)

Applications **must** load credentials only through the approved loader path. They must never hard-code, print, or log secret values.

---

## 2. Required variables

Presence is required for the corresponding channel to be considered **configured**. Values are never inspected beyond length / format checks that cannot reconstruct the secret.

| Variable | Channel | Format expectation (non-secret) | Required for delivery |
| --- | --- | --- | --- |
| `DISCORD_WEBHOOK_URL` | Discord | URL starting with `https://discord.com/api/webhooks/` or `https://discordapp.com/api/webhooks/` | Yes (CI + local) |
| `TWITTER_API_KEY` | X (Twitter) | Non-empty string | Yes for X channel |
| `TWITTER_API_SECRET` | X (Twitter) | Non-empty string | Yes for X channel |
| `TWITTER_ACCESS_TOKEN` | X (Twitter) | Non-empty string | Yes for X channel |
| `TWITTER_ACCESS_SECRET` | X (Twitter) | Non-empty string | Yes for X channel |
| `EMAIL_PROVIDER_API_KEY` | Email | Non-empty string (provider-specific) | Yes for email channel |
| `EMAIL_FROM` | Email | Valid email address format | Yes for email channel |
| `CONTACT_FORM_ENDPOINT` | Contact form | HTTPS URL | Optional (if contact-form path is used) |

**Notes**

- Telegram variables remain intentionally EMPTY under the existing press-agent boundary and are out of scope for this revenue delivery path.
- `DISCORD_WEBHOOK_URL` is the only credential currently known to exist in GitHub Actions secrets.
- All other delivery credentials are expected to be supplied only via the local mechanism.

---

## 3. How applications access credentials

1. Process starts with an explicit “delivery mode” flag or script entrypoint.
2. Loader reads **only** from the approved local source (keychain or gitignored env).
3. Loader returns a presence map + opaque handles; it never returns the raw secret to logging or stdout.
4. Delivery code uses the handle for the single authorized action, then discards it.
5. If any required variable for the selected channel is missing or fails the format check, the process exits with a non-zero status and a presence-only report. No send is attempted.

Reference health-check command (presence only):

```bash
node scripts/delivery-credential-health-check.mjs
```

---

## 4. Rotation procedure

1. Operator generates / rotates the credential at the provider (X Developer Portal, email provider, Discord webhook regeneration, etc.).
2. Operator stores the new value in the **local** approved store only.
3. Operator runs the presence-only health check and confirms `configured` for the rotated channel.
4. Old credential is revoked at the provider after the new one is confirmed working.
5. CI secrets (Discord) are updated only through the GitHub repository secrets UI by the repository owner; never via a committed file or PR.

Rotation is a **human-controlled** action. No automated rotation scripts that write secrets into the repository are permitted.

---

## 5. Access control

| Role | Access |
| --- | --- |
| **Human operator (founder)** | Sole authority to place, rotate, or revoke delivery credentials |
| **Local delivery process** | Read-only access to the local store for the duration of a single authorized run |
| **GitHub Actions** | Access only to secrets explicitly configured in repository settings (currently Discord webhook) |
| **Agents / AI sessions** | **Never** request, receive, or print secret values. May only run the presence-only health check and report status |

---

## 6. Security rules (non-negotiable)

1. **No secrets in the repository.** `.gitignore` already excludes `.env`, `.env.*`, and related patterns. Do not force-add them.
2. **Presence-only inspection.** Health checks and logs may report `configured` / `missing` / `invalid_format`. They must never echo, truncate, or hash-reveal credential values.
3. **Human identity for outbound.** Automated delivery remains gated. First outbound messages for the revenue expedition stay under explicit human send decision (see offer one-pager and contact action list).
4. **No credential requests in chat.** Agents must refuse any request to paste or confirm secret values.
5. **Fail closed.** Missing or invalid credentials → process aborts before any network send.

---

## 7. Validation procedure

### 7.1 Presence-only health check

```bash
node scripts/delivery-credential-health-check.mjs
```

Expected output shape (example):

```
DISCORD_WEBHOOK_URL          configured
TWITTER_API_KEY              missing
TWITTER_API_SECRET           missing
TWITTER_ACCESS_TOKEN         missing
TWITTER_ACCESS_SECRET        missing
EMAIL_PROVIDER_API_KEY       missing
EMAIL_FROM                   missing
CONTACT_FORM_ENDPOINT        missing

SUMMARY: 1 configured, 7 missing, 0 invalid_format
EXIT: 1   # non-zero while any required channel is incomplete
```

### 7.2 Format checks (non-secret)

- Discord webhook: must start with the known Discord webhook prefix and contain a non-empty path segment after the prefix.
- Email from: must match a simple `local@domain` pattern.
- Contact form endpoint: must start with `https://`.
- All others: non-empty after trim.

No cryptographic or provider-side validation is performed by the health check (that would require using the secret).

---

## 8. Setup instructions (operator)

1. Choose local store (keychain preferred).
2. Place each required variable using the store’s native tool.  
   Example (Linux secret-tool):
   ```bash
   secret-tool store --label="QPF Delivery Discord" service qpf-delivery key DISCORD_WEBHOOK_URL
   # paste value when prompted; never echo it into shell history
   ```
3. Alternatively, create a file **outside** the repo or ensure it is covered by `.gitignore`, then export or load it only for the delivery process.
4. Run the health check until the channels you intend to enable report `configured`.
5. Keep human-send as the default for the first revenue expedition targets.

---

## 9. Current known state (as of credential path audit)

- Local runtime configuration: **absent**
- GitHub Actions: only `DISCORD_WEBHOOK_URL` present
- X / email / contact-form credentials: **unavailable** in local runtime
- No credentials exposed or requested during the audit

This document establishes the secure path. Credentials may be connected later through the local mechanism only.

---

**End of contract.**  
No secret values appear above. No outreach is authorized by the existence of this file.
