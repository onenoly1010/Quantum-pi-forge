# DELIVERY_CREDENTIAL_SETUP

**Status:** `NO_SEND_CREDENTIAL_PATH_READY`  
**Scope:** Secure configuration only. This document does not authorize, schedule, or perform
external delivery.

## Official credential source

The official local source for delivery secrets is a GPG-encrypted
[`pass`](https://www.passwordstore.org/) store. The canonical entry namespace is:

```text
qpf/revenue-delivery/<VARIABLE_NAME>
```

`press-agent/scripts/run-with-delivery-credentials.sh` reads only the secret entries required
for a named channel and injects them into its child process environment. It never writes a
secret to the repository, `.env` template, receipt, or log. The local `.env` file is reserved
for non-secret delivery settings and is ignored by Git.

GitHub Actions secrets are a separate CI mirror, not the runtime source for local outreach.
They must use identical variable names and be set only when a workflow genuinely requires
them. Do not use a GitHub CLI keyring credential as an outreach credential.

## Access control and ownership

Kris, the authorized project operator, controls the GPG key and the `pass` store. The AI may
validate presence and format through the health check but must never read, print, export, or
commit a credential. A delivery process receives only the credentials for its selected channel
and only for its own lifetime.

## Required variables

| Variable | Source | Required for |
| --- | --- | --- |
| `OUTREACH_DELIVERY_MODE` | Local ignored `press-agent/.env` | Delivery safety mode |
| `OUTREACH_EVIDENCE_DIR` | Local ignored `press-agent/.env` | Receipt storage |
| `OUTREACH_LIVE_SEND_ACK` | Local ignored `press-agent/.env` | Explicit live-delivery gate |
| `TWITTER_API_KEY` | `pass` | Future approved X public post |
| `TWITTER_API_SECRET` | `pass` | Future approved X public post |
| `TWITTER_ACCESS_TOKEN` | `pass` | Future approved X public post |
| `TWITTER_ACCESS_SECRET` | `pass` | Future approved X public post |
| `PRESS_AGENT_LIVE_X_POST` | Local ignored `press-agent/.env` | Existing X public-post gate |
| `EMAIL_PROVIDER` | Local ignored `press-agent/.env` | Future email adapter |
| `EMAIL_API_KEY` | `pass` | Future email adapter |
| `EMAIL_FROM` | Local ignored `press-agent/.env` | Future email adapter |
| `CONTACT_FORM_PROVIDER` | Local ignored `press-agent/.env` | Future contact-form adapter |
| `CONTACT_FORM_ENDPOINT` | Local ignored `press-agent/.env` | Future contact-form adapter |
| `CONTACT_FORM_API_KEY` | `pass` | Future contact-form adapter |

Private X messaging is not supported by the current system. Public X credentials do not
authorize or enable private outreach.

## Initial setup

1. Install `pass` and ensure an operator-controlled GPG key is available locally.
2. Initialize the store once:

   ```bash
   pass init "<operator-gpg-key-fingerprint-or-email>"
   ```

3. Add each required secret locally, using the exact variable name as the entry suffix:

   ```bash
   pass insert -m qpf/revenue-delivery/TWITTER_API_KEY
   ```

   The command securely prompts on the local terminal. Do not paste a secret into chat,
   source code, documentation, a shell history, or an unencrypted file.

4. Create `press-agent/.env` from `.env.example`, keeping delivery disabled:

   ```dotenv
   OUTREACH_DELIVERY_MODE=disabled
   OUTREACH_EVIDENCE_DIR=../../receipts/outreach/delivery
   OUTREACH_LIVE_SEND_ACK=
   PRESS_AGENT_LIVE_X_POST=
   ```

5. Restrict the local file:

   ```bash
   chmod 600 press-agent/.env
   ```

The repository root ignores `.env` and `.env.*`; never force-add either file.

## Application access

Run a local process through the channel-scoped wrapper:

```bash
cd press-agent
scripts/run-with-delivery-credentials.sh x_public -- npm run check:delivery-credentials
```

The wrapper supports `x_public`, `email`, and `contact_form`. It fails closed when `pass` is
unavailable or a required entry is empty. It does not change delivery mode or invoke an adapter.
The current adapters remain no-send, even if credentials are present.

## Credential health validation

Run the health check without a wrapper to validate non-secret configuration:

```bash
cd press-agent
npm run check:delivery-credentials
```

Run it through the wrapper only to validate that a selected channel's credentials are available:

```bash
scripts/run-with-delivery-credentials.sh x_public -- npm run check:delivery-credentials
```

The report contains only each variable name and one of:

- `configured`
- `missing`
- `invalid format`

It never prints credential values. A successful configuration health report does not authorize
external delivery.

## Rotation and revocation

1. Rotate the credential at its provider.
2. Replace the corresponding `pass` entry locally.
3. Update the identically named GitHub Actions secret only if that workflow needs it.
4. Run the health check through the channel wrapper.
5. Revoke the prior provider credential after validation.
6. Record the rotation date, credential type, and operator in an evidence receipt without
   recording the secret or a derivative of it.

Immediately revoke and replace a credential if it is exposed, copied to an unapproved location,
or used outside its approved scope.

## Security rules

- Never commit credentials, `.env` files, evidence containing secrets, or shell transcripts.
- Keep `OUTREACH_DELIVERY_MODE=disabled` unless a separate activation authorization permits
  a live attempt.
- Do not set both delivery gates solely to test configuration.
- Use least-privilege provider credentials and channel-specific entries.
- Do not reuse public X, CI, CMS, or GitHub credentials for private outreach.
- Do not bypass provider terms, consent requirements, CAPTCHAs, or anti-abuse controls.
