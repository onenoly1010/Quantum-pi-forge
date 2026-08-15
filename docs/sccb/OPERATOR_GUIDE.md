# SCCB v1 Operator Guide

## Quick start

```bash
# Machine-verifiable authority (chat GO is not authorization)
npm run sccb -- authority

# Agent CAPABILITY grants (never raw tokens)
npm run sccb -- grants

# Full synthetic verification + evidence receipt
npm run verify:sccb

# List capabilities (no secrets)
npm run sccb:capabilities

# Control plane status
npm run sccb:status

# Safe dry-run invoke
npm run sccb -- invoke --capability qpf.site.funnel.verify --operation verify

# Conditional deploy (dry-run)
npm run sccb -- invoke --capability cloudflare.deploy --operation deploy \
  --params '{"target":"quantumpiforge","branch":"main"}' --dry-run

# Run tests
npm run test:sccb
```

## Mental model

- You authorize policy and bootstrap once.  
- Agents request capabilities; SCCB decides allow / escalate / deny.  
- Secrets stay in `pass` (or test memory fixtures) and enter **child process env only**.  
- Every invoke can produce a receipt under `receipts/sccb/` with **no secret values**.  

## Common workflows

### A. Inspect without side effects

Use PREAUTHORIZED capabilities or `--dry-run`.

### B. Action that needs human approval

1. Agent/CLI invoke → `APPROVAL_REQUIRED` + `approval_id`  
2. Review params (hashes and redacted fields)  
3. `approve --decision APPROVED|REJECTED`  
4. Re-invoke with same params  

### C. First-time credential for a provider

See [BOOTSTRAP_PROCEDURE.md](./BOOTSTRAP_PROCEDURE.md). Requires `GO CREDENTIAL_BOOTSTRAP`.

### D. Incident

See [EMERGENCY_RECOVERY.md](./EMERGENCY_RECOVERY.md).

## Safety rails (do not bypass)

| Do not | Why |
| --- | --- |
| Paste private keys into chat | Agent context leak |
| Commit `*.local.json` with real tokens | Git exposure |
| Set `SCCB_WALLET_SIGNING=enabled` casually | Fund risk |
| Treat agent always-approve as policy override | Privilege escalation |
| Enable mint/LP via SCCB alone | Economics LOCKED separately |
| Activate Pi via SCCB alone | Pi dormant until portal + GO |

## Integration points

| QPF surface | Integration |
| --- | --- |
| Delivery inject script | Pattern source; optional future thin wrapper |
| Production funnel verify | `qpf.site.funnel.verify` capability |
| CF Pages deploy | `cloudflare.deploy` (after bootstrap) |
| Guardian | Parallel approval concept; SCCB local store in v1 |
| Evidence ledger | SCCB receipts are non-secret evidence objects |

## Production posture (preserved)

- quantumpiforge.com remains canonical  
- economics LOCKED  
- mint / liquidity LOCKED  
- Pi dormant  
- no real funds move  
- no real wallet transaction signed  
- no real secret imported by this build  
