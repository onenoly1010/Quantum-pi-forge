# ⚡ Offline Dev Guardian — Quick Start

Get a fully local AI coding setup (Ollama + Aider + Continue) running in under 30 minutes — with automatic health checks.

---

## 1. Run the Installer

```bash
cd ~/offline-dev-guardian
./install-forge.sh
```

The script will:
- Install Ollama
- Pull the right model (7B or 14B based on your RAM)
- Set up Aider in a clean venv
- Configure Continue for VS Code
- Install the Guardian health checks

Note: Model download can take 5–20 minutes depending on your connection.

## 2. Restart your terminal

This loads the helpful aliases (aider, forge-status, etc.).

## 3. Test It

Option A — Terminal (fastest):
```bash
aider
```

Option B — VS Code:
- Install the Continue extension
- Restart VS Code
- Open the Continue sidebar and start chatting

## 4. Verify the System

```bash
forge-status
```

You should see clean output like:
```
✔ Ollama is running
✔ qwen2.5-coder model available
✔ Aider config present
✔ Disk space OK
```

---

### Daily Commands

```bash
aider                  # Start AI coding session
forge-status           # Check system health
forge-update           # Refresh models & Aider
```

---

### If Something Goes Wrong

```bash
cat ~/offline-dev-guardian/logs/guardian.log
```

Common fixes:
- Low RAM → use the 7B model (already handled by installer)
- Ollama not running → restart your machine or run `ollama serve`
- Model missing → `ollama pull qwen2.5-coder:14b`

---

You now have a private, zero-recurring-cost AI dev environment that checks itself every 30 minutes.