# 🔮 Universal Agentic Proxy Setup
## OINIO Quantum Forge
### Single endpoint for all Big 5 models with full Cline tool capabilities

---

## ✅ Deployed Files
| File | Purpose |
|------|---------|
| `config.yaml` | LiteLLM gateway configuration with all models |
| `.env.proxy` | Environment variables template for API keys |
| `forge-proxy.service` | Systemd service for persistent operation |

---

## 🚀 Quick Start

### 1. Install LiteLLM
```bash
pip install 'litellm[proxy]'
```

### 2. Add your API keys
Edit `.env.proxy` and insert your API keys
```bash
nano .env.proxy
source .env.proxy
```

### 3. Start the proxy
```bash
# Run foreground test
litellm --config config.yaml

# Install as permanent system service
sudo cp forge-proxy.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now forge-proxy
```

---

## 🔌 Connect to Cline / VS Code

### Cline Extension Settings:
1. Open Cline settings
2. Set **Custom API Endpoint**: `http://localhost:4000/v1`
3. Set **API Key**: `anything` (can be empty string)
4. Now you can select ANY model from the dropdown:
   - `claude-3-7-sonnet`
   - `gpt-4o`
   - `gemini-pro-1.5`
   - `grok-3`
   - `deepseek-v3`
   - `deepseek-coder-local`
   - `qwen-2.5-coder-local`

✅ **ALL models will automatically get full Cline tool capabilities**:
- Read / write files
- Execute terminal commands
- Git operations
- Submodule management
- Full filesystem access to all 28 repos

---

## 🎯 Agent Swarm Assignment
| Model | Role | Best For |
|-------|------|----------|
| **DeepSeek Local** | Code Monkey | Rust refactoring, compile fixes, heavy lifting |
| **Grok 3** | Real-time Researcher | 0G devnet updates, PQC standards, breaking changes |
| **Gemini Pro 1.5** | Context King | Scan all 28 repos, submodule conflict resolution |
| **GPT-4o** | Logical Auditor | Signature verification, Sacred Trinity compliance |
| **Claude 3.7 Sonnet** | Orchestrator | Planning, architecture, cross-repo coordination |

---

## 📡 Endpoint Status
```bash
# Check proxy health
curl http://localhost:4000/health

# List available models
curl http://localhost:4000/v1/models
```

---

## ⚠️ Important
This runs 100% locally on your machine. No requests go through third-party gateways after LiteLLM routes them directly to each provider. Tool execution remains entirely within Cline / MCP layer, models never get direct shell access.

Gateway is running on port 4000. You can now switch models in 1 click from the Cline sidebar while keeping full agency capabilities.