# QPF Security Boundaries V1

**Mode:** CONSTRAINT DOCUMENT — not an unlock  

## Hard “off” by default (commercial / irreversible)

| Action | Boundary |
|--------|----------|
| Public mint open | **OFF** — `mint_allowed=false`, `public_mint_active=false` |
| Live mint execution | **NO-GO** — Phase 33 `NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED` |
| Path execution | **REVIEW_ONLY_NOT_EXECUTABLE** |
| Live execution script | **null** |
| Broadcast | **false** on commercial mint path |
| Final human signing for public mint | **false** until separate phase |
| Liquidity seeding | **Not authorized** — pair empty by design until receipt + funding |
| Staking activation | **Gated** |
| Bridge activation | **Gated** |
| Treasury / yield execution | **Gated** |
| Site wallet signing / broadcast | **Disabled** on public pages |
| Seed phrase / private key collection | **Never** on site or agent paths |

## Intentional “on” (technical presence)

| Item | Boundary |
|------|----------|
| Contract deployment on 16661 | **Live** |
| Read-only RPC / explorer | **Allowed** |
| Public docs + receipts | **Allowed** |
| Controlled mint verification history | **Evidence only** — not public open |
| Wallet preflight (non-executing) | **Allowed** when no keys used |
| DEX pair existence | **Live** without liquidity |

## Safety notice (public surface)

From deployed-addresses:

- No private keys, seeds, or mnemonics stored on site or in repo.  
- Connect-wallet patterns (if any) are for **read-only** state.  
- Any live deploy, mint, liquidity, staking, or production authorization needs **separate human approval** and signed transaction **outside** the static site.

## Abort conditions (mint path, if ever activated later)

Abort if:

- chainId ≠ 16661  
- wrong token or registry address  
- unexpected function path  
- native value > 0 where not expected  
- wallet asks for seed/private key  
- wallet includes liquidity/staking/bridge/yield/treasury actions  
- human final signing approval missing  
- policy still shows `mint_allowed=false`  

## What “restraint” means

Empty pool and disabled mint are **not** incomplete accidents. They are **governance restraint** until:

1. evidence is inspectable by strangers,  
2. controlled path is explicit,  
3. human GO is explicit,  
4. funding/commercial timing is intentional.

## Related receipts

- `receipts/governance/public-mint-policy-final-v1.json`  
- `receipts/governance/phase-33-public-mint-execution-no-go-v1.json`  
- `receipts/governance/phase-19-final-public-mint-decision-review-no-go-v1.json`  
- `receipts/governance/public-mint-execution-path-spec-v1.json`  
- `receipts/governance/guardian-authority-reconciliation-v1.json`  

---

*Security Boundaries V1 — protects the infrastructure proof layer.*
