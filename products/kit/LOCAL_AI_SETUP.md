# Local AI Agent Setup for Quantum Pi Forge

This document guides you through setting up a local AI agent using Continue + Ollama to manage your deployments independently of cloud services.

## Prerequisites

- [Ollama](https://ollama.com) installed
- [Continue extension](https://marketplace.visualstudio.com/items?itemName=Continue.continue) in VS Code

## Quick Start

### 1. Pull a Model

```bash
ollama pull llama3.3
```

Or for larger capability:

```bash
ollama pull deepseek-r1:32b
```

### 2. Start Ollama

```bash
ollama serve
```

The API will be available at `http://localhost:11434`

### 3. Configure Continue

Edit `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Local-Agent",
      "provider": "ollama",
      "model": "llama3.3",
      "apiBase": "http://localhost:11434"
    }
  ]
}
```

## Agent Roles for Quantum Pi Forge

| Role | Command | Purpose |
|------|---------|---------|
| **Architect** | Analyze root, map GitHub Actions, identify deprecated hosting artifacts | Map deployment infrastructure |
| **Executor** | Generate Cloudflare Pages deploy.yml | Deploy to Cloudflare |
| **Auditor** | Verify env vars point to consolidated paths | Validate configuration |

## Usage in VS Code

1. Open Quantum Pi Forge in VS Code
2. Press `Cmd+Shift+L` (or `Ctrl+Shift+L` on Windows) to open Continue sidebar
3. Select "Local-Agent" model
4. Start issuing commands from the role tables above
