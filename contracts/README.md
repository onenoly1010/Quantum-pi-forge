# 🛠️ Offline Dev Guardian

**A local AI coding stack that installs cleanly and keeps working.**

No API keys. No monthly bills. No cloud dependency.

---

## The Problem Most Local Setups Have

You finally escape cloud API costs… only to spend hours fixing broken configs, missing models, or drifting tools.

Most “local AI” guides stop at “run this one command.” Then reality hits on day 3.

---

## What Offline Dev Guardian Gives You

- One-command installer that adapts to your hardware
- Pre-tuned, safe configs for Ollama + Aider + Continue
- **Guardian**: lightweight background checks every 30 minutes that tell you exactly what’s healthy
- Simple update command so things stay fresh
- Clear, human-readable logs

Install once → focus on coding, not maintenance.

---

## What’s Included

- `install-forge.sh` — detects RAM, sets up everything safely
- Aider in isolated venv (no pip conflicts)
- Continue.dev config (won’t overwrite your existing one)
- Guardian health checks (Ollama, models, configs, disk space)
- Aliases: `aider`, `forge-status`, `forge-update`
- Update script + basic troubleshooting

---

## What This Is (and Isn’t)

**This is:**
- A reliable way to run local AI coding without subscriptions
- A setup that stays usable over time
- Great for Linux Mint / Ubuntu users

**This is not:**
- Fully autonomous code-writing magic
- A replacement for 70B+ cloud models on weak hardware
- “Zero effort forever” (you still need basic terminal comfort)

---

## Requirements

- Linux Mint or Ubuntu
- 12GB+ RAM recommended (16GB+ ideal for 14B models)
- ~10GB free disk space
- Basic comfort with the terminal

---

## Quick Start

```bash
cd ~/offline-dev-guardian
./install-forge.sh
```

Then:
```bash
aider
forge-status
```

See QUICKSTART.md for full details.

---

### Example Guardian Log

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

✅ Your code and prompts never leave your machine
✅ No rate limits or surprise bills
✅ Works offline
✅ Full control over your tools

---

## Pricing Tiers (for Gumroad)

**$29** — Core kit (installer + configs + Guardian)
**$49** — Everything + 5 practical workflows + lifetime minor updates

---

Ready to replace your API bills with a self-checking local stack?

👉 Get Offline Dev Guardian → (your-gumroad-link)

## Reproducing the EPI Environment (Hermetic v1.5)

Every build now runs inside a pinned container that enforces the v1.4 contract.

```bash
# Build & run locally
docker build -t epi-audit:v1.5 -f infra/repro/Dockerfile .
docker run --rm -v "$(pwd)/output:/forge/output" epi-audit:v1.5
```

CI automatically verifies on every push/PR.

---

Questions? Open an issue on the repo or check the logs first.
