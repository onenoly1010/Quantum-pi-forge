# Offline Dev Guardian

> A local AI coding stack that installs cleanly and keeps working.

No API keys. No monthly bills. No cloud dependency.

---

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