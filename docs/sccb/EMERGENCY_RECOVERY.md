# SCCB v1 Emergency Recovery Procedure

## Controls

| Control | Effect |
| --- | --- |
| **Emergency stop** | Denies all capability invocations |
| **Global pause** | Same as stop without emergency reason (can be set independently) |
| **Per-capability pause** | Blocks one capability |
| **Capability revoke** | Permanent deny until re-registered/un-revoked in code+control |
| **Credential revoke/disable** | Inject and policy deny for dependents |

## Immediate response

```bash
# 1. Stop all SCCB execution
npm run sccb -- emergency-stop --reason "suspected compromise"

# 2. Revoke affected capabilities
npm run sccb -- capability-revoke --id cloudflare.deploy

# 3. Mark credential revoked in SCCB metadata
npm run sccb -- credential-revoke --id cloudflare-api-token

# 4. At provider dashboard: rotate/invalidate the real token
#    (Cloudflare, GitHub, etc.) — do this outside agent chat

# 5. After rotation + re-bootstrap metadata:
npm run sccb -- emergency-clear --resume-global
npm run sccb -- bootstrap validate --id cloudflare-api-token --pass
```

## Recovery checklist

1. Confirm incident scope (capability / credential / environment).  
2. Emergency stop if active compromise.  
3. Revoke provider tokens at source.  
4. Mark SCCB credentials revoked.  
5. Revoke or pause capabilities.  
6. Rotate via local terminal only (`pass insert`) — never chat.  
7. Clear emergency stop only after verified rotation.  
8. Re-validate with non-destructive capability.  
9. Write non-secret incident note under `receipts/sccb/`.  
10. Do **not** re-enable wallet sign / mint / LP without separate GO.  

## Print from CLI

```bash
npm run sccb -- recovery
```

## Higher-authority locks

Even after SCCB recovery, these remain independently locked:

- economics (mint / LP)  
- Pi dormant  
- production economic gates  
- quantumpiforge.com canonical ops unchanged by SCCB  
