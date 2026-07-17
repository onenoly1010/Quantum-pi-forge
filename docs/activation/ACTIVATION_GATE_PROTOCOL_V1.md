# Quantum Pi Forge — Activation Gate Protocol v1

**Mission:** Drive this repository to an objectively verifiable **ACTIVATION READY** state.

**Responsibility:** Maximize **confidence**, not change volume. **Evidence is the deliverable.**

**State file:** [`activation-gate-state-v1.json`](./activation-gate-state-v1.json)  
**Evidence directory:** `docs/activation/evidence/`  
**Root awareness (all agent work):** [`ROOT_AWARENESS_VERIFICATION_PROTOCOL_V1.md`](./ROOT_AWARENESS_VERIFICATION_PROTOCOL_V1.md)

**Prime constraint:** You are not optimizing for activity. You are optimizing for **verified state transition**. Every action must **reduce uncertainty**.

---

## Core Rules

1. Never invent.
2. Never assume.
3. Never skip verification.
4. Never repeat completed work.
5. Never overwrite evidence.
6. Never commit automatically.
7. Never push automatically.
8. Every modification requires a reason.
9. Every conclusion requires evidence.
10. Every gate has a measurable exit condition.
11. Missing evidence ⇒ `UNKNOWN`, never `TRUE`.
12. State-changing work requires an explicit human authorization phrase.
13. After PASS, ask only whether the activation requirement is satisfied — not how to improve further.

---

## State Management

Every gate has exactly one status:

| Status | Meaning |
| --- | --- |
| `NOT_STARTED` | Not begun |
| `IN_PROGRESS` | Currently under verification |
| `PASS` | Exit condition met; evidence sealed |
| `FAIL` | Exit condition not met; evidence of failure sealed |
| `BLOCKED` | Cannot complete; external or prerequisite blocker documented |

Once `PASS`: never revisit unless source code, dependencies, configuration, deployment, or chain state changes.

---

## Activation Sequence

Proceed in order. Do not skip.

| Gate | Focus | Exit condition |
| --- | --- | --- |
| G-01 | Repository Integrity | Deterministic health; clean/known state; remotes; lockfiles; reproducible install |
| G-02 | Build Integrity | All supported builds: compile, lint, types, bundle — zero errors |
| G-03 | Runtime Integrity | Frontend, backend, workers, APIs, env, routing — only confirmed issues repaired |
| G-04 | Wallet Verification | Supported wallet flows audited with repro/root-cause/repair/regression per bug |
| G-05 | Contract Verification | Live RPC `eth_getCode`, chain ID, bytecode compare; `DEPLOYED_ADDRESSES.md` only from verified results |
| G-06 | Documentation Audit | Every public statement: Verified / Implemented / Gated / Planned — no unsupported claims |
| G-07 | Security | Secrets, CSP, XSS, CSRF, deps, wallet, RPC, logging |
| G-08 | Activation Report | Build, Wallet, Deployment, Security, Documentation reports + remaining blockers |

---

## Termination

### ACTIVATION READY

All gates `PASS`. Evidence exists. No unresolved blockers. No automatic commit. No automatic push.

### BLOCKED

Produce exactly: blocker, evidence, root cause, proposed fix — then stop.

---

## Forbidden

- Endlessly refactor or optimize
- Rewrite passing code
- Revisit `PASS` gates without trigger
- Fabricate deployment status, blockchain state, or contract verification

## Success Definition

Not “perfect code.”  
An independently auditable repository where every activation requirement is either **PASS with evidence** or **BLOCKED with evidence**.
