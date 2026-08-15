# SCCB v1 Threat Model

## Assets

| Asset | Sensitivity |
| --- | --- |
| API tokens (CF, GitHub, delivery) | High — account takeover |
| Wallet keys / seeds | Critical — fund loss |
| Capability allowlists / policy files | Medium — privilege expansion |
| Approval records | Medium — replay / forgery |
| Agent context / logs / chat | Adversarial surface |

## Threats and mitigations

| Threat | Mitigation |
| --- | --- |
| Secret leaked into LLM context | Broker never returns secret material; inject only into child env |
| Prompt injection → exfiltrate secrets | Tool results redacted; metadata-only APIs |
| Compromised agent process | Least-privilege credentials; short-lived env; revoke at provider |
| Compromised laptop | `pass`/GPG at rest; prefer external signer for treasury |
| Standing policy too broad | Explicit allowlists; policy changes via PR/human |
| “Always approve” agent mode misuse | Hard-bound to sealed policy; cannot invent FORBIDDEN/HUMAN classes |
| Malicious PR expands allowlist | Human review of policy/capability files |
| Replay of old approval | `params_hash` binding + one-time consume + optional TTL |
| Supply chain (malicious inject command) | Command allowlist on broker inject |
| Operator social engineering via agent | High-risk always HUMAN or FORBIDDEN; full intent display |
| Secrets in Git | Metadata-only JSON; `.gitignore` for `*.local.json`; no real secrets in tests |
| Secrets in receipts/logs | `redactForAudit`, `verifyReceiptSafety`, `secret_exposed_to_llm: false` |

## Out of scope (v1)

- Nation-state against offline GPG
- Physical theft of unlocked unlocked session (OS mitigations)
- Full HSM / hardware wallet integration (design allows later)

## Residual risk

Laptop compromise with unlocked GPG agent can still use local tokens until provider revoke. Prefer scoped tokens and rapid rotation after incident (see [EMERGENCY_RECOVERY](./EMERGENCY_RECOVERY.md)).
