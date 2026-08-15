# SCCB Bootstrap Rehearsal — Procedure & Results

**Mode:** SYNTHETIC REHEARSAL ONLY  
**Real credential enrollment:** NOT PERFORMED / NOT AUTHORIZED  
**Authority file SHA-256:** `d97bd55563fc880dab4aadda3ae5cf3a7161a9beb3d1a89cfab0673e36e3c63a`  
**Rehearsal result:** `PASSED`  
**Evidence:** `receipts/sccb/2026-08-08T015936449Z-bootstrap-rehearsal.json`

> Do **not** paste real secrets into chat. Real intake is local `pass insert` only after sealed `credential_bootstrap=AUTHORIZED`.

## Principles

- Never paste secrets into chat, Git, agent context, or logs.
- Local interactive intake only: pass insert → GPG vault.
- Agents receive CAPABILITY grants, not raw tokens.
- Wallet: prefer external signer; do not store unrestricted private keys on agent host.
- Chat GO phrases are not authorization; sealed authority-state is.
- This rehearsal does not enroll real credentials.

## First wave (recommended when real enrollment is later authorized)

- **cloudflare-api-token** (cloudflare): Deploy and inspect Cloudflare Pages projects without pasting tokens into chat on every deploy.
- **github-token** (github): Open PRs and (with human approval) merge without re-pasting tokens.

### Deferred (not first wave)

- **delivery-x**: P2 — after CF/GitHub; may already be provisioned offline
- **pi-api**: P9 — do not enroll in first real bootstrap
- **wallet-signer**: P9 — not first bootstrap; design external signer first

---

## 1. Exactly what credentials / configuration are needed

| ID | Provider | What |
| --- | --- | --- |
| `cloudflare-api-token` | cloudflare | Cloudflare API token (Pages) |
| `github-token` | github | GitHub fine-grained or classic PAT (scoped) |
| `delivery-x` | delivery | X/Twitter delivery API keys |
| `pi-api` | pi | Pi App API key |
| `wallet-signer` | wallet | Wallet signer reference (prefer external) |

## 2. Why each is needed

| ID | Why |
| --- | --- |
| `cloudflare-api-token` | Deploy and inspect Cloudflare Pages projects without pasting tokens into chat on every deploy. |
| `github-token` | Open PRs and (with human approval) merge without re-pasting tokens. |
| `delivery-x` | Existing revenue delivery path; unify under SCCB policy/audit instead of ad-hoc env. |
| `pi-api` | Future Pi payment/status reads after portal provision. Currently capability FORBIDDEN. |
| `wallet-signer` | Enable prepare→policy→approve→sign pipeline without agent holding unrestricted keys. |

## 3. Capability each unlocks

### `cloudflare-api-token`
  - `cloudflare.pages.read` (PREAUTHORIZED) → agent sees `CAPABILITY: cloudflare.pages.read`
  - `cloudflare.deploy` (CONDITIONAL) → agent sees `CAPABILITY: cloudflare.deploy`

### `github-token`
  - `github.pr.create` (CONDITIONAL) → agent sees `CAPABILITY: github.pr.create`
  - `github.merge` (HUMAN_APPROVAL) → agent sees `CAPABILITY: github.merge`

### `delivery-x`
  - `delivery.x.public_post` (HUMAN_APPROVAL) → agent sees `CAPABILITY: delivery.x.public_post`

### `pi-api`
  - `pi.read` (FORBIDDEN) → agent sees `CAPABILITY: pi.read`

### `wallet-signer`
  - `wallet.sign_transaction` (FORBIDDEN) → agent sees `CAPABILITY: wallet.sign_transaction`

## 4. Scoping (read-only / short-lived)

### `cloudflare-api-token`
- Preferred: API Token (not Global API Key)
- Read-only possible: true
- Short-lived: Prefer tokens with expiration; rotate on schedule or after incident


### `github-token`
- Preferred: Fine-grained PAT limited to Quantum-pi-forge (and siblings you choose)
- Read-only possible: true
- Short-lived: 90-day expiry recommended; no SSO org tokens broader than needed


### `delivery-x`
- Preferred: App + user tokens limited to posting on QPF account only
- Read-only possible: false
- Short-lived: Rotate on compromise; platform-dependent expiry


### `pi-api`
- Preferred: App-scoped API key when Pi portal provides one
- Read-only possible: true
- Short-lived: Rotate if App recreated


### `wallet-signer`
- Preferred: External signer / hardware wallet / remote policy signer. Value should be a reference or connector id — NOT a raw seed.
- Read-only possible: false
- Short-lived: Session-bound signing approvals preferred
- **Strongly discouraged:** EOA private key or seed phrase on agent host laptop

## 5. Where stored

| ID | Backend | Path |
| --- | --- | --- |
| `cloudflare-api-token` | pass (GPG password-store) | `qpf/providers/cloudflare/api-token` |
| `github-token` | pass (GPG password-store) | `qpf/providers/github/token` |
| `delivery-x` | pass (existing delivery pattern) | `qpf/revenue-delivery/<ENV_NAME>` |
| `pi-api` | pass — only after pi_activation AUTHORIZED | `qpf/providers/pi/api-key` |
| `wallet-signer` | Prefer: no private key in pass. Optional: pass holds only a signer endpoint ref / key id | `qpf/providers/wallet/signer (reference only if used)` |

Metadata only may live in gitignored `credential-metadata.local.json`. **Never** secrets in Git.

## 6. Who / what can retrieve

| ID | Who | Agent sees |
| --- | --- | --- |
| `cloudflare-api-token` | SCCB broker inject path only (child process env) | CAPABILITY grants + metadata status, never token value |
| `github-token` | SCCB broker inject only | CAPABILITY: github.* — never GITHUB_TOKEN=… |
| `delivery-x` | Delivery inject script and/or SCCB broker (future thin wrap) | CAPABILITY: delivery.x.public_post only |
| `pi-api` | Broker inject after capability un-forbidden | CAPABILITY: pi.read (denied until policy change) |
| `wallet-signer` | Signer subsystem after wallet_signing AUTHORIZED — never LLM | CAPABILITY: wallet.prepare_transaction (intent summary only); sign remains FORBIDDEN by default |

## 7. Standing policy (automatic under sealed policy)

- `cloudflare.pages.read:list_projects` (via `cloudflare-api-token`)
- `cloudflare.pages.read:list_deployments` (via `cloudflare-api-token`)
- `cloudflare.pages.read:get_deployment` (via `cloudflare-api-token`)
- `wallet.prepare_transaction:prepare (unsigned intent only)` (via `wallet-signer`)

Also always standing without credentials: `qpf.site.funnel.verify`.

## 8. Actions requiring human approval

- `cloudflare.deploy:deploy when target/branch outside allowlist (quantumpiforge|oinio-dashboard + main)`
- `First production deploy via SCCB if production_deploy_via_sccb still NOT_AUTHORIZED`
- `github.pr.create:create_pr (CONDITIONAL — allowlisted repos only; mismatch escalates)`
- `github.merge:merge_pr (always HUMAN_APPROVAL)`
- `delivery.x.public_post:post (HUMAN_APPROVAL — external publish)`
- `Any sign path (when ever un-forbidden) → HUMAN + amount/destination policy`

## 9. Emergency revoke (one primary action)

```bash
npm run sccb -- emergency-stop --reason "compromise suspected"
```

Then:

- capability-revoke --id <id> for each affected capability
- credential-revoke --id <id> in SCCB metadata
- Invalidate tokens at provider dashboards (CF, GitHub, …)
- Optional: pass rm <path> after provider rotate

Full text: `docs/sccb/EMERGENCY_RECOVERY.md`

## 10. Compromise recovery

### Laptop
- emergency-stop
- Revoke all provider tokens at source
- Rotate GPG if agent/unlocked session compromised
- Re-bootstrap only after sealed authority re-confirmed

### Vault (`pass` / GPG)
- Assume secrets exposed if GPG passphrase compromised
- Rotate every token/key that lived in pass
- Re-create pass store under new GPG key if needed

### Agent process
- emergency-stop + revoke capabilities
- Secrets should not be in agent context; still rotate if inject was used during compromise window
- Review receipts/sccb for unexpected invokes

---

## Local interactive intake (real — future only)

1. 1. Seal credential_bootstrap=AUTHORIZED in authority-state.v1.json (human PR)
2. 2. Terminal (not chat): pass insert <pass_path>
3. 3. Paste secret only into pass (GPG)
4. 4. sccb bootstrap register-metadata --id <id>
5. 5. sccb bootstrap validate --id <id> --pass
6. 6. Non-secret receipt under receipts/sccb/

### Never

- Paste secret into LLM chat
- Commit secret to Git
- Log secret values
- Put unrestricted wallet seed on agent host for first bootstrap

### Wallet boundary

Prefer **external / hardware / policy signer**. SCCB orchestrates `wallet.prepare_transaction` without unrestricted private keys. Do **not** enroll raw seeds in first real bootstrap.

---

## Rehearsal run steps (this execution)

| Step | OK | Detail |
| --- | --- | --- |
| plan | yes | {"mode":"synthetic_verification"} |
| enroll_synthetic | yes | {"credential_id":"cloudflare-api-token","secret_value_returned":false,"status":"active"} |
| enroll_synthetic | yes | {"credential_id":"github-token","secret_value_returned":false,"status":"active"} |
| association | yes | {"rows":[{"capability_id":"qpf.site.funnel.verify","credential_id":null,"credential_status":null,"ready":true},{"capability_id":"cloudflare.pages.read","credential_id":"cloudflare-api-token","credential_status":"active","ready":true},{"capability_id":"cloudflare.deploy","credential_id":"cloudflare-api-token","credential_status":"active","ready":true},{"capability_id":"github.pr.create","credential_id":"github-token","credential_status":"active","ready":true},{"capability_id":"github.merge","credential_id":"github-token","credential_status":"active","ready":true},{"capability_id":"wallet.prepare_transaction","credential_id":null,"credential_status":null,"ready":true},{"capability_id":"0g.submit_transaction","credential_id":null,"credential_status":null,"ready":true},{"capability_id":"economics.mint","credential_id":null,"credential_status":null,"ready":true},{"capability_id":"economics.liquidity","credential_id":null,"credential_status":null,"ready":true}]} |
| standing_allow | yes | {"result":"SUCCESS"} |
| conditional_deploy_dry_run | yes | {"policy_decision":"ALLOW","result":"DRY_RUN"} |
| approval_required | yes | {"result":"APPROVAL_REQUIRED","approval_id":"fd9f7401-d5ee-42f0-a967-2e43b5fe3504"} |
| forbidden_deny | yes | {"result":"DENIED"} |
| wallet_prepare_no_key | yes | {"next_step":"signing_disabled"} |
| capability_grants_no_secret | yes | {"grant_lines":["CAPABILITY: qpf.site.funnel.verify","CAPABILITY: cloudflare.pages.read","CAPABILITY: cloudflare.deploy","CAPABILITY: github.pr.create","CAPABILITY: github.merge","CAPABILITY: delivery.x.public_post","CAPABILITY: pi.read","CAPABILITY: wallet.prepare_transaction","CAPABILITY: wallet.sign_transaction","CAPABILITY: 0g.submit_transaction","CAPABILITY: economics.mint","CAPABILITY: economics.liquidity"]} |
| emergency_stop | yes | {"result":"DENIED"} |
| real_bootstrap_still_denied | yes | {"real_denied":true} |

---

## Authority state (machine-verifiable)

| Phase | Expected for rehearsal |
| --- | --- |
| bootstrap_rehearsal | AUTHORIZED |
| credential_bootstrap | **NOT_AUTHORIZED** |
| wallet_signing / pi / economics | NOT_AUTHORIZED |

## Exact next authorization for real enrollment

1. Human reviews this document.  
2. Human sets `sccb/config/authority-state.v1.json` → `credential_bootstrap.status = AUTHORIZED`.  
3. Local terminal: `pass insert` only (never chat).  
4. `npm run sccb -- bootstrap plan --real --provider cloudflare` (then github).  
5. register-metadata + validate.

**Not sufficient:** this rehearsal pass, chat GO, always-approve, or silence.

---

## SCCB_BOOTSTRAP_REHEARSAL_PASSED

Real credential enrollment remains **blocked** until sealed `credential_bootstrap`.
