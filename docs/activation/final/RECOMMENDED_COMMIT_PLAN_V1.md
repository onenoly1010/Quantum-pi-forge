# Recommended Commit Plan v1

**Policy:** No automatic commit or push. Human authorizes each step.  
**Exclude by default:** `cache/compile-cache.json` (build artifact).  
**Also exclude unless intentional:** anything under `out/` if gitignored; local logs.

## Current dirty classification (post-gate)

| Path | Class | Recommended action |
| --- | --- | --- |
| `contracts/DEPLOYED_ADDRESSES.md` | AI evidence product (G-05) | **Commit** (Commit A) |
| `docs/activation/activation-gate-state-v1.json` | Checkpoint | **Commit** (Commit A or B) |
| `docs/activation/evidence/G-0*` | Gate evidence | **Commit** (Commit B) |
| `docs/activation/final/*` | Final deliverables | **Commit** (Commit B) |
| `cache/compile-cache.json` | Build artifact | **Leave uncommitted** / discard / gitignore if needed |

Already committed baseline: `ce275b8` (claim hygiene + protocol).  
Local `main` ahead of `origin/main` by **4** (includes `ce275b8`); **push not authorized**.

---

## Logical commits (only if authorized)

### Commit A — Deployment matrix truth

**Purpose:** Make RPC-verified addresses durable.

```
contracts/DEPLOYED_ADDRESSES.md
```

Suggested message:

```
docs(contracts): populate DEPLOYED_ADDRESSES from live RPC G-05

Record dual address sets, bytecode match results, and untrusted owner residual.
No deploy, no ownership transfer, no push.
```

### Commit B — Activation gate evidence + final package

**Purpose:** Seal verification lane artifacts.

```
docs/activation/activation-gate-state-v1.json
docs/activation/evidence/G-01-recheck-20260716T194717Z.md
docs/activation/evidence/G-02-build-integrity-20260716T194734Z.md
docs/activation/evidence/G-02-build-log-20260716T194734Z.txt
docs/activation/evidence/G-03-runtime-integrity-20260716T194900Z.md
docs/activation/evidence/G-03-runtime-smoke-20260716T194900Z.txt
docs/activation/evidence/G-04-wallet-verification-20260716T194921Z.md
docs/activation/evidence/G-04-wallet-verifier-log-20260716T195000Z.txt
docs/activation/evidence/G-05-bytecode-compare-20260716T195200Z.json
docs/activation/evidence/G-05-bytecode-compare-broadcast-set-20260716T195300Z.json
docs/activation/evidence/G-05-contract-rpc-20260716T195100Z.json
docs/activation/evidence/G-05-contract-verification-20260716T195100Z.md
docs/activation/evidence/G-06-documentation-audit-20260716T195400Z.md
docs/activation/evidence/G-07-security-20260716T195400Z.md
docs/activation/evidence/G-08-activation-report-20260716T195500Z.md
docs/activation/final/
```

Suggested message:

```
docs(activation): seal G-01..G-08 evidence and final activation package

Include wallet/deployment/security reports and remaining blockers.
No code refactor. No push.
```

### Commit C — (optional later) Wallet E2E evidence only

After manual MetaMask checklist:

```
docs/activation/evidence/wallet-e2e/*
```

Do **not** mix with unrelated refactors.

### Do not commit without separate authorization

- `cache/compile-cache.json`  
- Any private keys, `.env`, broadcast secrets  
- Force-push or amend of published history  

### Push

**Separate authorization required.** Default: keep local until human says push.

---

## After commits

- Do **not** restart PASS gates.  
- If only docs/evidence committed: no G-02 rebuild required for activation status.  
- If wallet or contract **code** changes later: re-open only affected gates (G-04/G-05/G-07 as applicable).  
