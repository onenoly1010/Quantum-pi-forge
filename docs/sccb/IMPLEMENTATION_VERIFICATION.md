# SCCB Implementation Verification Report

**Mode:** synthetic fixtures only  
**Real credentials:** off-limits  
**Command:** `npm run verify:sccb`

## Authorization boundary (machine-verifiable)

Sealed file: `sccb/config/authority-state.v1.json`

| Phase | Status |
| --- | --- |
| design | AUTHORIZED |
| implementation | AUTHORIZED |
| implementation_verification | AUTHORIZED |
| **credential_bootstrap** | **NOT_AUTHORIZED** |
| wallet_signing | NOT_AUTHORIZED |
| wallet_broadcast | NOT_AUTHORIZED |
| pi_activation | NOT_AUTHORIZED |
| economics_unlock | NOT_AUTHORIZED |
| production_deploy_via_sccb | NOT_AUTHORIZED |

**Rules (enforced):**

- Chat phrases (`GO SCCB_*`, `GO CREDENTIAL_BOOTSTRAP`) are **not** authorization  
- Agent always-approve **does not** bypass policy  
- Real bootstrap requires sealed `credential_bootstrap=AUTHORIZED` **plus** operator local `pass insert`  

Inspect live:

```bash
npm run sccb -- authority
```

## Diff inventory (implementation surface)

Primary tree: `sccb/` (source, config, tests, scripts) + `docs/sccb/` + architecture design doc.

| Area | Path |
| --- | --- |
| Secret abstraction | `sccb/src/secrets/` |
| Capability registry | `sccb/src/capabilities/` |
| Policy engine | `sccb/src/policy/` |
| Approvals | `sccb/src/approval/` |
| Broker + inject | `sccb/src/broker/` |
| Wallet prepare | `sccb/src/wallet/` |
| Bootstrap | `sccb/src/bootstrap/` |
| Control / emergency | `sccb/src/control/` |
| Authority state | `sccb/src/authority/` |
| Agent grants | `sccb/src/grants/` |
| Audit receipts | `sccb/src/audit/` |
| CLI | `sccb/src/cli.js` |
| Verify script | `sccb/scripts/verify-implementation.mjs` |

## Storage / encryption design

| Backend | At rest | Who can decrypt | Agent sees |
| --- | --- | --- | --- |
| **MemorySecretStore** | Process memory only (tests/fixtures) | In-process `loadForInject` | Metadata only |
| **PassSecretStore** | GPG via `pass` | Operator GPG agent + `pass show` into **child env** | Metadata + capability grants only |

**Pass store refuses** `storeSecret()` from agent-supplied material. Operator uses `pass insert` in a local terminal.

**Never plaintext in:** Git, agent chat/tool results, evidence receipts, credential-metadata JSON, (redacted) logs.

**Gitignored:** `sccb/config/*.local.json`

## Capability matrix (agent projection)

Agents receive:

```text
CAPABILITY: github.merge
```

not:

```text
GITHUB_TOKEN=actual_secret
```

```bash
npm run sccb -- grants
```

| Capability | Class | Credential id (metadata) |
| --- | --- | --- |
| qpf.site.funnel.verify | PREAUTHORIZED | none |
| cloudflare.pages.read | PREAUTHORIZED | cloudflare-api-token |
| cloudflare.deploy | CONDITIONAL | cloudflare-api-token |
| github.pr.create | CONDITIONAL | github-token |
| github.merge | HUMAN_APPROVAL | github-token |
| delivery.x.public_post | HUMAN_APPROVAL | delivery-x |
| wallet.prepare_transaction | CONDITIONAL | none |
| pi.read | FORBIDDEN | pi-api |
| wallet.sign_transaction | FORBIDDEN | wallet-signer |
| 0g.submit_transaction | FORBIDDEN | none |
| economics.mint | FORBIDDEN | none |
| economics.liquidity | FORBIDDEN | none |

## Approval matrix

| Class | Behavior |
| --- | --- |
| **Standing (PREAUTHORIZED)** | Auto for sealed low-risk ops when control plane clear |
| **Conditional** | Auto only if allowlists match; else escalate |
| **Approval required (HUMAN)** | Prepare → human Yes/No bound to `params_hash` |
| **Forbidden** | Deny until new policy + sealed authority phase |

Always-approve agent mode cannot elevate FORBIDDEN or skip HUMAN.

## Adversarial tests covered

- Fake API key / password / wallet credential non-disclosure  
- Expired / revoked / disabled credentials  
- Unauthorized capability requests  
- Approval denial  
- Emergency stop + capability revoke  
- CAPABILITY grant projection (no tokens)  
- Wallet prepare without private key  
- Real bootstrap denied by sealed authority  
- Synthetic bootstrap plan allowed  
- Audit receipt safety  
- Pass store refuses agent secret write  

```bash
npm run test:sccb
npm run verify:sccb
```

## Evidence

Verification writes:

```text
receipts/sccb/*-implementation-verification.json
```

Fields include authority hash, matrices, test results, file inventory hashes, explicit non-actions.

## Explicit non-actions of this cycle

- No real secret intake  
- No deploy  
- No wallet connect/sign  
- No fund movement  
- No Pi activation  
- No economics unlock  

## Next authorization (when ready)

1. Human updates `sccb/config/authority-state.v1.json` → `credential_bootstrap.status = AUTHORIZED` (PR or operator-controlled edit).  
2. Operator runs local `pass insert` (never chat).  
3. `npm run sccb -- bootstrap plan --real --provider <provider>`  
4. Register metadata + validate presence only.  

**Still separate later:** wallet signing, Pi, economics, production deploy via SCCB.
