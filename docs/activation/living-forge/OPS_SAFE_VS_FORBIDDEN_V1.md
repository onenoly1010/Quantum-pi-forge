# Living Forge — Safe to Run vs Still Forbidden

**Release tag:** `autonomy-day3-stable` → **`d034537`**  
**Commits:** `c67739f` (#665), `4ae0bfe` (#666), `d034537` (#667)  
**Standing boundary:** `NO_WALLET_TOUCH=true`

This is an **ops note**, not an economic unlock.  
Capability on disk ≠ permission to move funds.

---

## Always set

```bash
export NO_WALLET_TOUCH=true
# Never export PRIVATE_KEY / DEPLOYER_PRIVATE_KEY / COSIGN_PRIVATE_KEY / MNEMONIC for these jobs
```

---

## Safe to run (local, non-executing)

| Command | What it does |
| --- | --- |
| `npm run living-forge:seed-reset` | Restore clean queue seed (local runtime only) |
| `npm run living-forge:seed` | Merge task definitions into queue |
| `npm run living-forge:once` | One P3 cycle (verify/classify/admin) |
| `npm run living-forge:drain` | Drain eligible low-risk P3 tasks |
| `npm run living-forge:unstick-claims` | Requeue expired leases |
| `npm run living-forge:wallet-preflight:safe` | **Check-only** wallet preflight gate (no follow-on command) |
| `npm run living-forge:admin:all` | Stale-doc scan, PR classify (no merge), grant-tracker diff |
| `npm run kpi:snapshot` | KPI + alerts → `artifacts/kpi/` (gitignored history) |
| `npm run autonomy:eod` | End-of-day summary from local KPI/events |
| `npm run autonomy:pulse` | 15m-style pulse: unstick → one cycle → KPI |
| `npm run autonomy:day2:verify` / `autonomy:day3:verify` | Deterministic verify suites |
| `bash scripts/living-forge/systemd/install-user-units.sh` | Optional local 15m timer (still non-signing) |

**Safe outcomes include:** docs/receipts/heartbeats, queue updates, PR **classification reports**, grant tracker hashes, evidence/build checks.

---

## Still forbidden (without separate explicit GO)

| Action | Why |
| --- | --- |
| Sign / broadcast txs | P0 — keys + chain mutation |
| Transfer / spend / withdraw | P0 — funds movement |
| Deploy contracts / liquidity / mint / stake / bridge | Economic activation; separate gates |
| Auto-merge PRs | Classify ≠ merge; human decides |
| Portal login / KYC **as Kris** | Identity / legal |
| Send email/Discord/X **as Kris** | Outbound as principal |
| Export keys / reveal secrets | Security |
| Set `NO_WALLET_TOUCH=false` for Living Forge jobs | Breaks standing boundary |
| Run preflight **with a follow-on gated command** that spends/signs | Preflight is check-only in autonomy lane |

---

## Human-only surface

See `HUMAN_ACTION_QUEUE_V1.md` (template) and runtime refresh from scheduler:

1. Receiving destination form  
2. AUTHORIZE TO RECEIVE  
3. Guild follow-up **send** (package prep is OK; send is human)  
4. Revenue offer **send**  
5. Spiral / physical readiness confirmations  

---

## Fresh-clone smoke (expected green)

```bash
git clone https://github.com/onenoly1010/Quantum-pi-forge.git
cd Quantum-pi-forge
git checkout autonomy-day3-stable   # or main at/after 4ae0bfe
export NO_WALLET_TOUCH=true
npm run living-forge:seed-reset
npm run autonomy:day3:verify
```

---

## Explicit non-claims

- No protocol revenue or yield is activated by this stack.  
- `SAFE_CANDIDATE` on a PR is **not** permission to merge.  
- Local pulse/timer does **not** authorize mainnet cutover.
