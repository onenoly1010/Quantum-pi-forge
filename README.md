# Public Validation Status


## 10-Minute Public Reviewer Demo

Quantum Pi Forge includes a bounded public verification demo for reviewers who want a quick, safe entrypoint.

Run:

```bash
npm run public:verification-demo:v1
```

This demo proves:

- 0G Aristotle context is declared
- sealed artifact replay is verified
- no upload is attempted
- no transaction is broadcast
- no private key is present
- no wallet use is authorized
- no funding, staking, approvals, liquidity, deployment, or operational activation is authorized
- reviewer-safe dry-run posture is preserved

Public gate document: `docs/public/PUBLIC_VERIFICATION_DEMO_GATE_V1.md`

**Quantum Pi Forge Public Validation Status v1 is open.**

Quantum Pi Forge has completed verified genesis activation on 0G Aristotle Mainnet. Liquidity, approvals, staking, relayer flows, funding, and growth loops remain intentionally blocked until validation and funding conditions are satisfied.

- Status doc: [`docs/governance/PUBLIC_VALIDATION_STATUS_V1.md`](docs/governance/PUBLIC_VALIDATION_STATUS_V1.md)
- Review anchor: [Issue / thread #328](https://github.com/onenoly1010/Quantum-pi-forge/pull/328)

**Review the proof. Verify the gates. Confirm the boundary.**

---

# Offline Dev Guardian

## For Auditors and Reviewers

Start with [`AUDIT.md`](./AUDIT.md) for the canonical non-executing reviewer onboarding runbook and one-command local audit path:

```bash
npm run audit:full-local
```

This project remains parked and does not authorize deployment, broadcast, mainnet approval, wallet-funded actions, or state-changing transactions through the audit path.

## Reviewer Canon

Start here for public review:

- [Reviewer Start Here](REVIEWER_START_HERE.md)
- [Verification Status Table](docs/review/VERIFICATION_STATUS_TABLE_V1.md) — SSOT: Verified / Implemented but gated / Experimental / Planned
- [Level 0 Harness Scope](docs/public/QPF_LEVEL0_HARNESS_SCOPE_V1.md) — what the verifier proves, what it does not, and how to run it on your own artifact
- [Claim-to-Proof Matrix](docs/review/CLAIM_TO_PROOF_MATRIX.md)
- [Public Surface Claim Audit](docs/review/PUBLIC_SURFACE_CLAIM_AUDIT_V1.md)
- [Public Status](STATUS.md)
- [Grant/Partner Outreach Kit](docs/valuation/QPF_GRANT_PARTNER_OUTREACH_KIT_V1.md) — language locked to the status table

The status table is the single source of truth for feature posture. The matrix classifies claims as verifiable, pending, disabled, archive, or aspirational so reviewers can inspect evidence before accepting narrative claims.

> A local AI coding stack that installs cleanly and keeps working.

No API keys. No monthly bills. No cloud dependency.

---


## Evidence Index

The current repository evidence map is maintained at [`evidence/INDEX.md`](evidence/INDEX.md).

It links active proof lanes to their supporting files and verification commands. Evidence index verification is available locally with:

```bash
npm run verify:evidence-index
```

The current evidence index snapshot receipt is stored at [`evidence/receipt.json`](evidence/receipt.json) and can be refreshed with:

```bash
npm run evidence:receipt
```

## The Problem

You finally escape cloud API costs… only to spend hours fixing broken configs, missing models, or drifting tools.

Most "local AI" guides stop at "run this one command." Then reality hits on day 3.

## What You Get

✅ **One-command installer** that adapts to your hardware
✅ Pre-tuned, safe configs for Ollama + Aider + Continue
✅ **Guardian**: lightweight background checks every 30 minutes that tell you exactly what's healthy
✅ Simple update command so things stay fresh
✅ Clear, human-readable logs

**Install once → focus on coding, not maintenance.**

---

## What's Included

| Component | Description |
|-----------|-------------|
| `install-forge.sh` | Hardware detecting, safe installer |
| Aider | Isolated venv - no pip conflicts |
| Continue.dev | VS Code integration config |
| Guardian | Health monitoring system |
| Aliases | `aider`, `forge-status`, `forge-update` |
| Update script | Keep everything working over time |

---

## This Is (and Isn't)

✅ **This is:**
- A reliable way to run local AI coding without subscriptions
- A setup that stays usable over time
- Great for Linux Mint / Ubuntu users

❌ **This is NOT:**
- Fully autonomous code-writing magic
- A replacement for 70B+ cloud models on weak hardware
- "Zero effort forever" (you still need basic terminal comfort)

---

## Quick Start

```bash
git clone https://github.com/onenoly1010/Quantum-pi-forge ~/offline-dev-guardian
cd ~/offline-dev-guardian
./install-forge.sh
```

Then:
```bash
aider
forge-status
```

See [QUICKSTART.md](QUICKSTART.md) for full details.

---

## Guardian Health Check

Runs automatically every 30 minutes:

```
[2026-04-15 23:15:00] ----- Guardian Health Check Start -----
[2026-04-15 23:15:00] ✔ Ollama is running
[2026-04-15 23:15:00] ✔ qwen2.5-coder model available
[2026-04-15 23:15:00] ✔ Aider config present
[2026-04-15 23:15:00] ✔ Disk space OK (18234MB free)
[2026-04-15 23:15:00] ----- Guardian Health Check Complete -----
```

---

## Why Go Local?

✅ Your code and prompts **never leave your machine**
✅ No rate limits or surprise bills
✅ Works completely offline
✅ Full control over your tools

---

## Pricing

| Tier | Price | What's Included |
|------|-------|-----------------|
| Core | $29 | Installer + Configs + Guardian |
| Pro | $49 | Everything + 5 practical workflows + lifetime minor updates |

👉 **Get Offline Dev Guardian**: https://gumroad.com/l/offline-dev-guardian

---

## Reproducible Environment

Every build runs inside a pinned container that enforces the v1.5 contract:

```bash
# Build & run locally
docker build -t epi-audit:v1.5 -f infra/repro/Dockerfile .
docker run --rm -v "$(pwd)/output:/forge/output" epi-audit:v1.5
```

CI automatically verifies on every push/PR.

---

## Support

Questions? Open an issue on the repo or check the logs first at `~/.offline-dev-guardian/logs/guardian.log`

---

**Quantum Pi Forge**
*Self-sovereign developer tools.*

## Reviewer Proof Command

Run the full local evidence verification stack with one command:

```bash
npm run verify:evidence
```

This verifies the evidence index, receipt integrity, claim map, and claim-map drift guard.

Authority boundary: read-only local evidence verification only; no wallet signing, deployment, posting, governance execution, custody transfer, token minting, staking, or chain mutation.

## Public Verification & Evidence

Quantum Pi Forge maintains a transparent, reproducible evidence bundle for key state transitions and claims.

### Reproduce v2 Mainnet Activation Verification

```bash
git clone https://github.com/onenoly1010/Quantum-pi-forge
cd Quantum-pi-forge
git checkout 4c9c392
npm ci
npm run verify:evidence
```

Full details: [docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md](docs/verification/PUBLIC_VERIFICATION_REPRODUCTION_V1.md)

Note: `npm audit` warnings are non-blocking for evidence verification and are tracked separately.

