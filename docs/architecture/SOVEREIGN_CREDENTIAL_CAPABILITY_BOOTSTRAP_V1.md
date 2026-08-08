# Sovereign Credential & Capability Bootstrap (SCCB) v1

**Status:** IMPLEMENTED (v1 runtime) — see `sccb/` and `docs/sccb/`  
**Authorization:** `GO SCCB_DESIGN` (design) + `GO SCCB_BUILD` (implementation)  
**Does not authorize:** real secret intake, production signing, Pi start, mint/LP unlock, fund movement  
**Runtime path:** `sccb/src/` · **Tests:** `npm run test:sccb` · **CLI:** `node sccb/src/cli.js`

**North star:**

> The human should not be the integration bus.  
> You establish authority once. The system securely establishes capability.  
> Agents operate within explicit policy. Sensitive actions cross a defined approval boundary.  
> Everything is auditable.

**Role split:**

| Human | System |
| --- | --- |
| Define intent | Discover, configure, place credentials |
| Establish / change policy | Validate, store, rotate (when allowed) |
| Approve exceptions / high-risk | Execute authorized classes |
| Irreversible economic/custodial decisions | Verify, document, report, retry |

---

## 1. Problem statement

Today QPF/OINIO has **fragments** of the right model (Guardian, wallet governance docs, `pass` + delivery inject, evidence/AI capability registries) but **no unified layer**. Operators repeatedly hunt for:

- API keys, tokens, wallet config  
- which env belongs to which service  
- old repos, Pi endpoints, prior decisions  
- “where did I put the Cloudflare token?”

Agents then stall waiting for conversational paste of secrets—which is both high-friction and high-risk.

SCCB is **not** “a secret manager for the agent to dump keys into chat.”  
SCCB is **capability + authorization + execution isolation**.

---

## 2. Non-goals (v1)

- Unrestricted agent custody of all private keys  
- “Always approve” as blank check for new risk classes  
- Replacing GitHub/CF/Pi portal UIs entirely  
- Unlocking mint, LP, or public economic activation  
- Building five parallel credential systems  

---

## 3. Existing machinery to reuse

| Fragment | Location | Reuse as |
| --- | --- | --- |
| GPG `pass` store | `~/.password-store/qpf/` | Encrypted secret backend (v1) |
| Delivery inject | `press-agent/scripts/run-with-delivery-credentials.sh` | Pattern: scoped secret → child env only |
| Delivery setup policy | `docs/activation/command/revenue/DELIVERY_CREDENTIAL_SETUP.md` | Intake rules (local terminal, never chat) |
| Evidence capability registry | `deploy/capability-registry-v1.json` + scripts | Schema inspiration; keep **separate** from provider credentials |
| AI capability table | `docs/ai/CAPABILITY_REGISTRY.md` | Work-type sources + human approval columns |
| Authorization workflow | `docs/ai/AUTHORIZATION_WORKFLOW.md` | Default inspect; escalate merges/deploy/finance/secrets |
| Guardian approvals | `server/guardian_approvals.py`, CLI | Human yes/no audit trail for high-risk decisions |
| Wallet/mint phase docs + receipts | `docs/governance/`, `receipts/governance/` | Policy library for economic boundaries |
| Evidence / receipts culture | Hermes, execution receipts | Operation audit chain |

**Do not rebuild** `pass` or discard Guardian—**compose** them.

---

## 4. Architecture overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     HUMAN AUTHORITY                          │
│  intent · policy · bootstrap GO · exception Yes/No · revoke  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              SCCB POLICY ENGINE + GUARDIAN                    │
│  standing | conditional | human-required | forbidden          │
└───────┬─────────────────────────────┬───────────────────────┘
        │                             │
┌───────▼──────────┐         ┌────────▼──────────┐
│ CAPABILITY        │         │ APPROVAL GATE      │
│ REGISTRY (meta)   │         │ (record decision)  │
│ id, provider,     │         └────────┬───────────┘
│ scopes, expiry,   │                  │
│ allowed ops       │         ┌────────▼──────────┐
└───────┬───────────┘         │ EXECUTION BROKER   │
        │                     │ (no secret in LLM  │
┌───────▼──────────┐         │  context)          │
│ SECURE STORE      │◄────────│ inject → run → scrub│
│ pass / OS keyring │         └────────┬───────────┘
│ (future HSM/signer)│                  │
└───────────────────┘         ┌────────▼──────────┐
                              │ EXTERNAL SYSTEM    │
                              │ CF, Railway, Pi,   │
                              │ chain, GitHub…     │
                              └────────┬───────────┘
                                       │
                              ┌────────▼──────────┐
                              │ EVIDENCE RECEIPT   │
                              │ request→policy→    │
                              │ approval→result    │
                              └───────────────────┘
```

**Agent path (desired):**

```text
Agent → Intent (capability + params)
     → Policy Engine
     → Approval / standing auth
     → Execution Broker (secret never enters model context)
     → Network / API / Signer
     → Receipt
```

**Forbidden path:**

```text
Agent → Private key in prompt → Network
```

---

## 5. Core concepts

### 5.1 Credential

Encrypted material that proves identity to a provider (API token, OAuth refresh material, etc.).  
**Never** logged, committed, or returned to the LLM context after intake.

### 5.2 Capability

Named, least-privilege operation class, e.g.:

| Capability ID | Meaning |
| --- | --- |
| `cloudflare.pages.deploy` | Deploy static site to named Pages project |
| `cloudflare.pages.read` | List projects / deployments |
| `github.pr.create` | Open PR on allowed repos |
| `github.pr.merge` | Merge (always human unless standing policy) |
| `railway.service.read` | Health / status |
| `pi.api.payment.read` | Read payment status (if ever provisioned) |
| `wallet.0g.treasury.read` | Balance / tx history |
| `wallet.0g.treasury.transfer` | Transfer (human or strict conditional) |
| `delivery.x.public_post` | Existing delivery path |
| `qpf.site.funnel.verify` | Production funnel smoke (no secret) |

### 5.3 Policy classes

| Class | Behavior | Examples |
| --- | --- | --- |
| **Standing** | Auto if capability + limits match | Health check, funnel verify, read deploy list |
| **Conditional** | Auto only if params match allowlist | Deploy to project `quantumpiforge` from `main` only |
| **Human** | Explicit Yes/No | New destination, large transfer, credential change, production merge, Pi publish |
| **Forbidden** | Always deny | Export private keys, mint/LP while LOCKED, chat paste of secrets |

### 5.4 Bootstrap session

One-time (or rare) operator-authorized intake:

1. Human issues `GO CREDENTIAL_BOOTSTRAP <provider>` (or multi-provider with explicit list).  
2. Secure local intake (terminal `pass insert`, future GUI, never casual chat).  
3. Classify → validate (minimal live check) → store encrypted.  
4. Write **capability metadata** (no secret).  
5. Write **bootstrap receipt**.  
6. Discard plaintext from process memory / agent context.

---

## 6. Data model (v1 sketch)

### 6.1 Capability record (metadata only — safe to commit or store unencrypted)

```json
{
  "capability_id": "cloudflare.pages.deploy",
  "provider": "cloudflare",
  "credential_ref": "pass:qpf/providers/cloudflare/api-token",
  "account_label": "CF-01",
  "scopes_declared": ["pages:write", "account:read"],
  "allowed_targets": ["quantumpiforge", "oinio-dashboard"],
  "policy_class": "conditional",
  "requires_human_if": ["target_not_in_allowlist", "branch_not_main"],
  "last_validated_utc": null,
  "status": "PROVISIONED|EXPIRED|REVOKED|UNKNOWN",
  "created_utc": "...",
  "notes": "metadata only; secret never here"
}
```

### 6.2 Operation receipt (auditable)

```json
{
  "request_id": "...",
  "capability_id": "cloudflare.pages.deploy",
  "actor": "agent|human|cron",
  "params_hash": "...",
  "policy_decision": "ALLOW|DENY|ESCALATE",
  "approval_id": null,
  "execution_started_utc": "...",
  "execution_result": "SUCCESS|FAIL",
  "evidence_refs": [],
  "secret_exposed_to_llm": false
}
```

### 6.3 Separation from existing evidence registry

| Registry | Purpose |
| --- | --- |
| `deploy/capability-registry-v1.json` | **What the project can prove as evidence** (Hermes, CI, etc.) |
| SCCB capability registry (new) | **What the project may invoke as a provider operation** |

Do **not** collapse these without an explicit schema migration plan.

---

## 7. Secret classification (what may be stored)

| Class | Examples | Store in SCCB v1? | Notes |
| --- | --- | --- | --- |
| **API tokens** | CF, Railway, GitHub PAT (scoped) | Yes (`pass`) | Least privilege tokens preferred |
| **OAuth client secrets** | As needed | Yes | Rotate on schedule |
| **Webhook secrets** | Pi webhooks | Yes | |
| **Wallet private keys / seeds** | EOAs | **Prefer not on laptop** | Prefer hardware/remote signer; if ever stored, separate high-risk policy + never LLM-visible |
| **Passphrases for GPG** | — | No in agent | OS/operator |
| **Pi App secrets** | App ID + API key | Yes when portal provisioned | App ID is semi-public; API key secret |

**Must never be stored in repo, chat, receipts, or agent transcripts.**

---

## 8. Laptop vs external signer

| Asset | Preferred home |
| --- | --- |
| CF / Railway / GitHub tokens | Laptop `pass` (v1) |
| Delivery social keys | Laptop `pass` (already) |
| Production treasury keys | External signer / hardware / multisig when possible |
| Read-only RPC | No secret or public RPC |
| Agent runtime | Capabilities only; no export of raw keys to model |

**Compromise of laptop** → revoke provider tokens; wallet keys if co-located are higher loss — design favors **not** co-locating high-value keys with agent host long-term.

---

## 9. Wallet transaction flow (target)

```text
Agent formulates Intent
  → Policy: amount, destination, contract, network
  → If standing/conditional match → prepare
  → If human required → Guardian/approval UI
  → Signer (local secure or external) signs
  → Broadcast
  → Receipt
```

Agent may see: addresses, amounts, calldata summary, simulation result.  
Agent must **not** see: raw private key, seed, full signing material.

**While economics LOCKED:** all mint/LP/transfer capabilities remain **Forbidden** or **Human-only with explicit economic GO** outside SCCB standing policy.

---

## 10. Human approval UX (target)

```text
TRANSACTION / ACTION READY

Capability:  wallet.0g.treasury.transfer
From:        Treasury-01
To:          0x…
Network:     0G Aristotle (16661)
Amount:      …
Reason:      …
Policy:      HUMAN_REQUIRED

[YES — SIGN]  [NO — CANCEL]
```

Deploy analog:

```text
Capability: cloudflare.pages.deploy
Project:    quantumpiforge
Branch:     main
Policy:     CONDITIONAL match → auto OR HUMAN for first use
```

**“Always approve” mode must never mean:** any capability, any target, any amount.  
It may only mean: **auto-approve standing/conditional policies already sealed.**

---

## 11. Threat model (v1)

| Threat | Mitigation |
| --- | --- |
| Secret leaked into LLM context | Execution broker; secrets only in subprocess env; never in tool return values |
| Agent prompt injection → exfiltrate secrets | Broker never returns secret material; capability ops return status/hashes only |
| Compromised agent process | Least privilege credentials; short-lived env; revoke tokens |
| Compromised laptop | Encrypt at rest (`pass`/GPG); prefer HW for high-value keys; revoke |
| Standing policy too broad | Explicit allowlists; separate GO to widen policy |
| Always-approve misuse | Hard bind to sealed policy document; cannot invent new capability classes |
| Malicious PR expands allowlist | Policy changes require human review / PR |
| Replay of old approval | Receipt IDs + param hashes; time bounds |
| Supply chain (malicious script using inject) | Allowlisted executables for broker; code review |
| Operator social engineering via agent | High-risk always human; display full intent |

**Out of scope v1:** nation-state against offline GPG; physical theft of unlocked session (OS mitigations).

---

## 12. Integration with existing QPF systems

| System | Integration |
| --- | --- |
| Guardian | Backing store for HUMAN approvals; reuse IDs in receipts |
| AUTHORIZATION_WORKFLOW | Default matrix maps to policy classes |
| Evidence ledger / Hermes | Operation receipts as evidence objects |
| Production funnel | Uses capabilities that need **no** secrets first (`qpf.site.funnel.verify`) |
| Pi | Capability `pi.*` only after `GO PI_PORTAL_RECORD` + bootstrap; default Forbidden |
| Economics | All mint/LP capabilities Forbidden until separate economic GO |
| CF Pages deploy | First non-delivery vertical slice candidate |

---

## 13. Emergency revocation

| Action | Effect |
| --- | --- |
| Revoke capability | Mark metadata REVOKED; broker denies |
| Revoke credential | Delete/rotate `pass` entry; invalidate provider token at source |
| Kill switch | Global “SCCB_EXECUTION=off” env/file checked by broker |
| Economic lock | Existing public/economic LOCKED remains higher authority |

---

## 14. Agent-to-agent delegation (later)

v1: single broker, human policy.  
v2+: agent A requests capability on behalf of agent B with **subset scopes** and time limit; still no secret visibility.

---

## 15. Minimum implementation plan (when `GO SCCB_BUILD` exists)

| Step | Deliverable | Exit criteria |
| --- | --- | --- |
| M0 | This design accepted | Human ACK |
| M1 | Metadata schema + empty registry file + verify script | Schema validates; no secrets in git |
| M2 | Broker CLI: `sccb run <capability> -- …` using `pass` inject | Delivery path migrated or CF dry-run |
| M3 | Policy file (standing/conditional/human/forbidden) | Unit tests for decisions |
| M4 | Human approval hook (CLI or Guardian) | Receipt on escalate |
| M5 | First vertical: `delivery.x.public_post` **or** `cloudflare.pages.read` | Live success receipt without LLM seeing secret |
| M6 | Docs: operator bootstrap guide | Matches DELIVERY pattern |
| Later | Wallet prepare-only; Pi after portal; rotation jobs | Separate GOs |

**Explicit non-order:** do not start with wallet private keys or Pi marketplace.

---

## 16. Answers to design questions (concise)

| Question | v1 answer |
| --- | --- |
| What stores exist? | `pass`/GPG; delivery inject; ad-hoc env files (to migrate) |
| What can be reused? | pass, inject pattern, Guardian, auth docs, evidence receipt culture |
| What must never be stored? | Secrets in git/chat/receipts; prefer not seeds on agent host |
| Laptop vs external signer? | API tokens on laptop pass; high-value keys external when possible |
| Wallet authorization? | Intent → policy → human/conditional → signer |
| Standing policies? | Declarative allowlists in versioned policy file |
| Emergency revocation? | Capability+credential revoke + global kill switch |
| Capability without secret visibility? | Broker injects only into child process |
| Machine compromise? | Encrypt, least privilege, revoke, prefer HW for treasury |
| Human approval? | Guardian/CLI/UI; bound to param hash |
| Automated execution? | Only standing/conditional sealed policies |
| Always-approve? | Only pre-sealed classes—not new capabilities |
| Fit Guardian/evidence? | Approvals + receipts as first-class |
| Plug CF/GitHub/Pi/0G? | Capability IDs per provider; shared broker |

---

## 17. Current production / economic / Pi boundaries

| Surface | SCCB impact |
| --- | --- |
| quantumpiforge.com | Untouched by design phase |
| Economics LOCKED | All economic capabilities Forbidden until separate GO |
| Pi dormant | No bootstrap of Pi until portal + GO |
| Observation active | Continues |

---

## 18. Authorization ladder

| Command | Meaning |
| --- | --- |
| `GO SCCB_DESIGN` | This document (design only) |
| `GO SCCB_BUILD_M1` | Schema + empty registry + verify (no secret intake) |
| `GO CREDENTIAL_BOOTSTRAP <provider>` | Secure local intake for one provider |
| `GO SCCB_VERTICAL <capability>` | Wire broker for one capability |
| **Not implied** | Economic unlock, Pi start, secret paste in chat |

---

## 19. Design decision record

| Decision | Choice |
| --- | --- |
| Secret backend v1 | `pass` + GPG (exists) |
| Secrets in LLM context | Never |
| Evidence vs provider registries | Separate |
| First vertical | Delivery **or** CF read/deploy (TBD at build) |
| Wallet keys in SCCB v1 | Prefer out-of-scope / external signer |
| Relation to always-approve | Standing policies only |

---

## 20. Status

```text
SCCB v1:     IMPLEMENTED (sccb/)
Build:       GO SCCB_BUILD complete (machinery only)
Secrets:     NOT INGESTED (fixtures in tests only)
Bootstrap:   Framework ready; requires GO CREDENTIAL_BOOTSTRAP
Production:  UNCHANGED
Economics:   LOCKED (capabilities FORBIDDEN)
Pi:          DORMANT (pi.read FORBIDDEN)
Signing:     DISABLED
```

**Operator docs:** `docs/sccb/`  
**Human operates authority. System operates machinery—within that authority.**
