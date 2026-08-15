# SCCB v1 Bootstrap Procedure

One-time (or rare) controlled credential setup. **Never** paste secrets into agent chat.

## Authorization required

```text
GO CREDENTIAL_BOOTSTRAP <provider>
```

Examples:

- `GO CREDENTIAL_BOOTSTRAP cloudflare`
- `GO CREDENTIAL_BOOTSTRAP github`
- `GO CREDENTIAL_BOOTSTRAP delivery`

Without this GO, the CLI refuses plan generation unless `--authorized` is used **by the human operator** who holds that GO.

## What bootstrap does

1. Discover required credentials for capabilities  
2. Classify environment (development / test / production)  
3. Instruct secure store placement (`pass insert`)  
4. Register **metadata only**  
5. Validate presence (not print values)  
6. Associate with capabilities  
7. Optional connectivity check (non-secret result)  
8. Write non-secret bootstrap receipt under `receipts/sccb/`

## What bootstrap never does

- Dump secret values into agent context or logs  
- Commit secrets to Git  
- Enable wallet signing, mint, LP, or Pi  
- Rotate production credentials without explicit operator action  

## Operator steps (local terminal)

```bash
# 1. Plan (after human GO)
npm run sccb -- bootstrap plan --authorized --provider cloudflare --env development

# 2. Insert secret OUTSIDE chat (example)
pass insert qpf/providers/cloudflare/api-token

# 3. Register metadata only
npm run sccb -- bootstrap register-metadata --id cloudflare-api-token --env development

# 4. Validate presence (uses pass when --pass is set)
npm run sccb -- bootstrap validate --id cloudflare-api-token --pass

# 5. Review associations
npm run sccb -- status
```

## Delivery credentials (existing pattern)

Already documented in `docs/activation/command/revenue/DELIVERY_CREDENTIAL_SETUP.md` and injected via `press-agent/scripts/run-with-delivery-credentials.sh`. SCCB catalogs `delivery-x` to unify policy/audit; migration of the shell inject path is optional, not required for v1 correctness.

## Exit criteria for a provider

- [ ] Metadata registered, status active after validate  
- [ ] Secret only in `pass` (or approved store)  
- [ ] Capability association shows ready  
- [ ] Non-secret receipt written  
- [ ] No secret in git / chat / logs  
