# SCCB v1 Architecture

**Sovereign Credential & Capability Bootstrap** — reusable infrastructure that eliminates repetitive credential friction while preserving human authority over consequential operations.

## Role split

| Role | Authority |
| --- | --- |
| **Human** | Intent, policy changes, bootstrap GO, exception approval, revoke, emergency stop |
| **SCCB** | Capability registry, policy evaluation, approval binding, secret inject, audit receipts |
| **Agents** | Operators within granted capabilities only |
| **Secrets** | Isolated from agent conversational/tool context |

## Pipeline

```text
Agent intent (capability + operation + params)
        ↓
Policy engine (PREAUTHORIZED | CONDITIONAL | HUMAN_APPROVAL | FORBIDDEN)
        ↓
Approval gate (standing / bound approval / escalate)
        ↓
Execution broker (optional secret inject → child only)
        ↓
External system (CF, GitHub, …) or dry-run / prepare-only
        ↓
Non-secret audit receipt (receipts/sccb/)
```

**Forbidden path:** Agent → private key in prompt → network.

## Package layout

| Path | Role |
| --- | --- |
| `sccb/src/secrets/` | SecretStore abstraction; Memory (test) + Pass (operator) backends |
| `sccb/src/capabilities/` | Provider capability registry (≠ evidence registry) |
| `sccb/src/policy/` | Policy evaluation |
| `sccb/src/approval/` | Human approval records bound to `params_hash` |
| `sccb/src/broker/` | Invoke path + inject |
| `sccb/src/wallet/` | Transaction prepare; sign disabled |
| `sccb/src/bootstrap/` | One-time bootstrap framework |
| `sccb/src/control/` | Revoke, pause, emergency stop |
| `sccb/src/audit/` | Receipt builder + safety checks |
| `sccb/src/cli.js` | Operator CLI |
| `sccb/config/` | Versioned capability sample + local state (gitignored) |
| `sccb/test/` | `node:test` suite |

## Reuse of existing QPF systems

| Existing | How SCCB reuses it |
| --- | --- |
| `pass` + GPG | Primary encrypted backend (`PassSecretStore`) |
| `press-agent/scripts/run-with-delivery-credentials.sh` | Inject-into-child pattern |
| `docs/ai/AUTHORIZATION_WORKFLOW.md` | Default human-required classes |
| `docs/ai/CAPABILITY_REGISTRY.md` | Work-type sources (kept separate) |
| `deploy/capability-registry-v1.json` | Evidence proofs — **not merged** with SCCB provider caps |
| Guardian approvals (`server/guardian_approvals.py`) | Conceptual approval trail; SCCB has local approval store (v1) |
| Receipts culture | `receipts/sccb/` non-secret audit objects |
| Economic lock docs | Mint/LP capabilities default FORBIDDEN |

SCCB does **not** replace pass, Guardian, or the evidence registry.

## Environment isolation

- **development / test:** Memory fixtures or pass entries under non-prod labels; signing hard-disabled.
- **production:** Pass backend + explicit GO for bootstrap; wallet sign still FORBIDDEN until separate GO + `SCCB_WALLET_SIGNING=enabled`.

## Related documents

- [Threat model](./THREAT_MODEL.md)
- [Capability specification](./CAPABILITY_SPEC.md)
- [Approval policy](./APPROVAL_POLICY_SPEC.md)
- [Bootstrap procedure](./BOOTSTRAP_PROCEDURE.md)
- [Credential lifecycle](./CREDENTIAL_LIFECYCLE.md)
- [Wallet safety](./WALLET_TRANSACTION_SAFETY.md)
- [Emergency recovery](./EMERGENCY_RECOVERY.md)
- [Operator guide](./OPERATOR_GUIDE.md)
- Design: `docs/architecture/SOVEREIGN_CREDENTIAL_CAPABILITY_BOOTSTRAP_V1.md`
