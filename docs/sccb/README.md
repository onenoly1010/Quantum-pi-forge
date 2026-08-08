# SCCB documentation index

| Document | Description |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and reuse map |
| [THREAT_MODEL.md](./THREAT_MODEL.md) | Threats and mitigations |
| [CAPABILITY_SPEC.md](./CAPABILITY_SPEC.md) | Capability catalog and fields |
| [APPROVAL_POLICY_SPEC.md](./APPROVAL_POLICY_SPEC.md) | PREAUTHORIZED / CONDITIONAL / HUMAN / FORBIDDEN |
| [BOOTSTRAP_PROCEDURE.md](./BOOTSTRAP_PROCEDURE.md) | One-time credential setup |
| [CREDENTIAL_LIFECYCLE.md](./CREDENTIAL_LIFECYCLE.md) | Rotate, revoke, environments |
| [WALLET_TRANSACTION_SAFETY.md](./WALLET_TRANSACTION_SAFETY.md) | Prepare-only wallet model |
| [EMERGENCY_RECOVERY.md](./EMERGENCY_RECOVERY.md) | Stop, revoke, recover |
| [OPERATOR_GUIDE.md](./OPERATOR_GUIDE.md) | Day-to-day operator CLI |
| [IMPLEMENTATION_VERIFICATION.md](./IMPLEMENTATION_VERIFICATION.md) | Synthetic verification report + authority boundary |

Implementation: `sccb/`

```bash
npm run verify:sccb   # adversarial + unit + evidence receipt
npm run sccb -- authority
npm run sccb -- grants
```
