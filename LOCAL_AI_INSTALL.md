# Local AI Agent Installation Guide

## Ollama Installation (Manual Steps Required)

Since system-wide installation requires sudo privileges, please run these commands manually in your terminal:

### Option 1: Install Ollama (Recommended)

```bash
# Download and run the installer
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version

# Pull a capable model
ollama pull llama3.3
# OR for larger models
ollama pull deepseek-r1:32b
```

### Option 2: Check if Already Installed

```bash
which ollama
```

## After Ollama is Installed

### 1. Start Ollama Server

```bash
ollama serve
```

Leave this running - it exposes `http://localhost:11434`

### 2. Configure Continue Extension

Create or edit `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Local-Agent",
      "provider": "ollama",
      "model": "llama3.3",
      "apiBase": "http://localhost:11434"
    }
  ],
  "tabAutocompleteModel": {
    "provider": "ollama",
    "model": "codellama",
    "apiBase": "http://localhost:11434"
  },
  "embeddingsProvider": {
    "provider": "ollama",
    "model": "nomic-embed-text"
  }
}
```

## Quick Install Verification

```bash
# Test Ollama is running
curl http://localhost:11434/api/version

# List available models
ollama list
```

## Usage Once Set Up

1. **VS Code**: Press `Cmd+Shift+L` (Mac) or `Ctrl+Shift+L` (Windows/Linux)
2. **Select Model**: Choose "Local-Agent" from the dropdown
3. **Start Chatting**: Use the role-based commands below

## Role-Based Commands for Deployments

### Architect Role
```
"Analyze the quantum-pi-forge-fixed root. Map all existing GitHub Actions. 
Identify any remaining Vercel artifacts or outdated RPC calls."
```

### Executor Role
```
"Generate a new .github/workflows/deploy.yml configured for 
Cloudflare Pages, replacing all deprecated Vercel CLI references."
```

### Auditor Role
```
"Verify all environment variables in ignited point to the new 
consolidated paths in fixed. Cross-reference package.json entry points."
```

### Diagnosis Role
```
"Examine the last failed GitHub Action run. Identify if the failure is 
a 403 Forbidden (Vercel check) or a 404 (Missing dependency)."
```

## Troubleshooting

### If Ollama won't start
```bash
# Check if port 11434 is in use
lsof -i :11434

# Kill any existing process
pkill -f ollama

# Restart
ollama serve
```

### If Continue can't connect
- Verify Ollama is running: `curl http://localhost:11434/api/version`
- Check config.json syntax is valid JSON
- Restart VS Code