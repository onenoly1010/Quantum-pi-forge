# Offline Dev Guardian - Quick Start

One command local AI coding stack that stays working. No API keys. No monthly bills. No cloud dependency.

---

## 🚀 Quick Install

```bash
git clone https://github.com/onenoly1010/Quantum-pi-forge ~/offline-dev-guardian
cd ~/offline-dev-guardian
./install-forge.sh
```

Installer will:
✅ Detect your RAM and select optimal model
✅ Install Ollama if missing
✅ Setup Aider in isolated venv (no pip conflicts)
✅ Install Guardian background health checks
✅ Add command aliases to your shell

---

## ✅ After Install

Restart your terminal then run:

| Command | What it does |
|---------|--------------|
| `aider` | Start coding with local AI |
| `forge-status` | Check full system health |
| `forge-update` | Update all components |

---

## 🛡️ Guardian Health Checks

Guardian automatically runs every 30 minutes and checks:
- Ollama service status
- Coding model availability
- Aider configuration integrity
- Free disk space
- System resource status

### View latest status:
```bash
forge-status
```

### Example healthy output:
```
[2026-04-15 23:15:00] ----- Guardian Health Check Start -----
[2026-04-15 23:15:00] ✔ Ollama is running
[2026-04-15 23:15:00] ✔ qwen2.5-coder:7b model available
[2026-04-15 23:15:00] ✔ Aider config present
[2026-04-15 23:15:00] ✔ Disk space OK (18234MB free)
[2026-04-15 23:15:00] ----- Guardian Health Check Complete -----
```

---

## 💻 First Time Using Aider

1. Go to your project directory
2. Run `aider`
3. Aider will automatically detect git repos
4. Start asking for code changes:
```
> add user authentication to this flask app
> refactor the payment processing function
> write tests for the api routes
```

---

## 🔧 Continue.dev VS Code Setup

Add this to your Continue `config.json` to use your local model:

```json
{
  "models": [
    {
      "title": "Local Qwen Coder",
      "provider": "ollama",
      "model": "qwen2.5-coder:7b",
      "apiBase": "http://localhost:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Local Autocomplete",
    "provider": "ollama",
    "model": "qwen2.5-coder:3b"
  }
}
```

---

## 📋 System Requirements

| RAM | Recommended Model | Performance |
|-----|-------------------|-------------|
| 32GB+ | qwen2.5-coder:14b | Excellent ✨ |
| 16GB+ | qwen2.5-coder:7b | Very Good ✓ |
| 12GB+ | qwen2.5-coder:7b-q4_K_M | Good ⚡ |
| <12GB | qwen2.5-coder:3b | Basic |

Supported: Linux Mint, Ubuntu 22.04+, Debian
Required: ~10GB free disk space

---

## 🔄 Updates

```bash
forge-update
```

Updates:
- Aider to latest version
- Ollama coding model
- Guardian scripts
- Configurations

---

## 📝 Logs

All Guardian logs are stored at:
```
~/.offline-dev-guardian/logs/guardian.log
```

---

## ❓ Troubleshooting

| Issue | Fix |
|-------|-----|
| Ollama not running | `systemctl --user start ollama` |
| Model missing | `forge-update` |
| Aider not found | Restart your terminal |
| Slow responses | Check you have enough free RAM |

---

## ✨ Why Local?

✅ **Your code never leaves your machine**
✅ No rate limits or surprise bills
✅ Works completely offline
✅ Full control over your tools
✅ No API keys required

---

## Pricing Tiers

- **Core Kit ($29):** Installer + Configs + Guardian
- **Pro ($49):** Everything + 5 practical workflows + lifetime minor updates

Get it at: https://gumroad.com/l/offline-dev-guardian