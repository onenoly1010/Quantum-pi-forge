# SCCB v1 — Sovereign Credential & Capability Bootstrap

Human = authority. SCCB = secure capability and policy machinery. Agents = operators within granted capabilities. Secrets = isolated from normal agent context.

## Commands

```bash
npm run test:sccb
npm run sccb -- help
npm run sccb:status
npm run sccb:capabilities
```

## Docs

See [`docs/sccb/`](../docs/sccb/) for architecture, threat model, capability/approval specs, bootstrap, credential lifecycle, wallet safety, emergency recovery, and operator guide.

Design record: [`docs/architecture/SOVEREIGN_CREDENTIAL_CAPABILITY_BOOTSTRAP_V1.md`](../docs/architecture/SOVEREIGN_CREDENTIAL_CAPABILITY_BOOTSTRAP_V1.md)

## Safety

- No real secrets ingested in this package’s tests (fixtures only).  
- Wallet signing and chain broadcast are disabled/FORBIDDEN.  
- Mint, LP, and Pi capabilities are FORBIDDEN.  
- Bootstrap requires explicit human authorization.  
