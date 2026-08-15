# SCCB v1 Credential Lifecycle

## States

| Status | Meaning |
| --- | --- |
| `unknown` | Metadata registered; not yet validated |
| `active` | Usable for inject when policy allows |
| `disabled` | Temporarily unusable; material may remain in pass |
| `revoked` | Must not be used; memory backend drops material |
| `expired` | Treat as unusable until rotation |

## Lifecycle

```text
discover → classify → store (pass) → register metadata
    → validate (presence) → active
    → (optional) rotate → re-validate
    → disable | revoke
```

## Rules

1. **Secrets never** in agent prompts, logs, Git, or evidence receipts.  
2. **Metadata only** is safe to store in `sccb/config/credential-metadata.local.json` (gitignored).  
3. **Dev/test vs production** is an explicit `environment` field on metadata — never mix prod tokens into test fixtures.  
4. **Rotation:** create new pass entry / token at provider → update metadata path if needed → validate → revoke old token at provider.  
5. **Revocation:** `npm run sccb -- credential-revoke --id <id>` plus provider-side invalidate.  

## Least privilege

Prefer scoped tokens:

- Cloudflare: Pages write + account read for named projects only when possible  
- GitHub: fine-grained PAT limited to required repos  
- Delivery: channel-specific keys only  

## Wallet material

Prefer **external signer / hardware** for high-value keys. SCCB v1 does not require laptop custody of treasury keys. `wallet.sign_transaction` remains FORBIDDEN by default.
