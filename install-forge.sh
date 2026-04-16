#!/bin/bash
# Offline Dev Guardian Installer v1.2 (2026)
# Production-ready for Linux Mint / Ubuntu

set -euo pipefail

START_TIME=$(date +%s)
INSTALL_DIR="$HOME/offline-dev-guardian"
LOG_DIR="$INSTALL_DIR/logs"

echo "🚀 Starting Offline Dev Guardian v1.2 installation..."

# 1. Checks
if ! command -v apt-get >/dev/null 2>&1; then
    echo "❌ Error: Debian-based system (Mint/Ubuntu) required."
    exit 1
fi

TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')
if [ "$TOTAL_RAM" -lt 12000 ]; then
    MODEL_SIZE="7b"
    echo "⚠️  Low RAM (${TOTAL_RAM}MB) → using qwen2.5-coder:7b"
else
    MODEL_SIZE="14b"
    echo "✅ Using qwen2.5-coder:${MODEL_SIZE}"
fi

FREE_SPACE=$(df -m "$HOME" | awk 'NR==2 {print $4}')
if [ "$FREE_SPACE" -lt 10000 ]; then
    echo "⚠️  Warning: Low disk space (<10GB free). Model download may fail."
fi

# 2. Directories
mkdir -p "$INSTALL_DIR"/{guardian,configs,workflows,docs,logs}

# 3. Dependencies
echo "📦 Installing system dependencies..."
sudo apt-get update -qq
sudo apt-get install -y curl git python3-venv inotify-tools

# 4. Ollama
echo "🧠 Installing/Updating Ollama..."
if ! command -v ollama >/dev/null 2>&1; then
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Safer start + readiness check
if ! pgrep -x "ollama" >/dev/null; then
    echo "   Starting Ollama..."
    nohup ollama serve >/dev/null 2>&1 &
fi

echo "⏳ Waiting for Ollama to be ready..."
for i in {1..15}; do
    if curl -s http://localhost:11434 >/dev/null; then
        echo "✅ Ollama is ready"
        break
    fi
    sleep 2
done

# 5. Model pull with error handling
echo "📥 Pulling qwen2.5-coder:${MODEL_SIZE}..."
if ! ollama pull "qwen2.5-coder:${MODEL_SIZE}"; then
    echo "❌ Model download failed. Check network or disk space."
    exit 1
fi

# 6. Aider in venv
echo "🔧 Setting up Aider in isolated venv..."
python3 -m venv "$INSTALL_DIR/.venv"
"$INSTALL_DIR/.venv/bin/pip" install --upgrade pip
"$INSTALL_DIR/.venv/bin/pip" install --upgrade aider-chat

# 7. Aider config (dynamic model)
cat > "$INSTALL_DIR/configs/aider.conf.yml" << EOF
model: ollama/qwen2.5-coder:${MODEL_SIZE}
weak-model: ollama/qwen2.5-coder:7b
openai-api-base: http://localhost:11434/v1
openai-api-key: ollama
auto-commits: false
dirty-commits: false
subtree-only: true
EOF

# 8. Continue config (safe - only if missing)
mkdir -p "$HOME/.continue"
if [ ! -f "$HOME/.continue/config.yaml" ]; then
    cat > "$HOME/.continue/config.yaml" << EOF
name: Offline Dev Guardian
version: 1.0.0
schema: v1

models:
  - name: Forge Coder
    provider: ollama
    model: qwen2.5-coder:${MODEL_SIZE}
    apiBase: http://localhost:11434
    roles: [chat, edit, apply]

  - name: Forge Fast
    provider: ollama
    model: qwen2.5-coder:7b
    apiBase: http://localhost:11434
    roles: [autocomplete]
EOF
else
    echo "⚠️  Existing Continue config found — skipping overwrite."
fi

# 9. Aliases (guarded + aider alias)
ALIAS_FILE="$HOME/.bash_aliases"
if [ ! -f "$ALIAS_FILE" ]; then touch "$ALIAS_FILE"; fi

if ! grep -q "Offline Dev Guardian aliases" "$ALIAS_FILE"; then
    cat >> "$ALIAS_FILE" << EOF

# Offline Dev Guardian aliases
alias aider='$INSTALL_DIR/.venv/bin/aider'
alias forge-status='cd $INSTALL_DIR && echo "=== Guardian Logs ===" && tail -15 logs/guardian.log 2>/dev/null || echo "No logs yet"'
alias forge-update='cd $INSTALL_DIR && ./update.sh'
alias forge-start='echo "→ Type: aider  or open VS Code with Continue"'
EOF
    echo "✅ Aliases added."
fi

source "$ALIAS_FILE" 2>/dev/null || true

# 10. update.sh
cat > "$INSTALL_DIR/update.sh" << 'EOF'
#!/bin/bash
echo "🔄 Updating Offline Dev Guardian..."
cd "$HOME/offline-dev-guardian"
"$HOME/offline-dev-guardian/.venv/bin/pip" install --upgrade aider-chat
ollama pull qwen2.5-coder:14b || true
echo "✅ Update complete. Restart terminal for aliases."
EOF
chmod +x "$INSTALL_DIR/update.sh"

# 11. Productized Guardian Health Check v1.1
cat > "$INSTALL_DIR/guardian/guardian.sh" << 'EOF'
#!/bin/bash
# Offline Dev Guardian - Safe Health Check v1.1
# Read-only checks only. No auto-changes.

set -euo pipefail

LOGFILE="$HOME/offline-dev-guardian/logs/guardian.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

log() {
    echo "[$TIMESTAMP] $1" >> "$LOGFILE"
}

status_ok() {
    log "✔ $1"
}

status_warn() {
    log "⚠ $1"
}

status_fail() {
    log "✖ $1"
}

log "----- Guardian Health Check Start -----"

# 1. Ollama process
if pgrep -x "ollama" >/dev/null; then
    status_ok "Ollama is running"
else
    status_fail "Ollama is NOT running"
fi

# 2. Model check (flexible for qwen2.5-coder variants)
if ollama list | grep -q "qwen2.5-coder"; then
    status_ok "qwen2.5-coder model available"
else
    status_warn "qwen2.5-coder model not found (run: ollama pull qwen2.5-coder:14b)"
fi

# 3. Aider config
if [ -f "$HOME/offline-dev-guardian/configs/aider.conf.yml" ]; then
    status_ok "Aider config present"
else
    status_fail "Missing aider.conf.yml"
fi

# 4. Continue config
if [ -f "$HOME/.continue/config.yaml" ]; then
    status_ok "Continue.dev config present"
else
    status_warn "Continue.dev config missing (re-run installer or create manually)"
fi

# 5. Disk space
FREE_SPACE=$(df -m "$HOME" | awk 'NR==2 {print $4}')
if [ "$FREE_SPACE" -lt 10000 ]; then
    status_warn "Low disk space: ${FREE_SPACE}MB free (<10GB recommended)"
else
    status_ok "Disk space OK (${FREE_SPACE}MB free)"
fi

# 6. Log rotation (keep logs manageable)
MAX_SIZE=524288  # 512 KB
if [ -f "$LOGFILE" ] && [ "$(stat -c%s "$LOGFILE")" -gt "$MAX_SIZE" ]; then
    mv "$LOGFILE" "$LOGFILE.old"
    echo "[$TIMESTAMP] Log rotated due to size" > "$LOGFILE"
    status_warn "Log file rotated"
fi

# 7. Simple repo hygiene (only if inside the product dir)
if [ -d "$HOME/offline-dev-guardian/.git" ]; then
    if git -C "$HOME/offline-dev-guardian" status --porcelain | grep -q .; then
        status_warn "Uncommitted changes in Offline Dev Guardian folder"
    else
        status_ok "Product folder is clean"
    fi
fi

# 8. Summary
RUNNING_PROCS=$(ps aux | grep -E "ollama|aider" | grep -v grep | wc -l)
status_ok "Active related processes: $RUNNING_PROCS"

log "----- Guardian Health Check Complete -----"
echo "" >> "$LOGFILE"
EOF
chmod +x "$INSTALL_DIR/guardian/guardian.sh"

# 12. Systemd Timer + Service (clean 30 minute schedule)
loginctl enable-linger "$USER" 2>/dev/null || true

mkdir -p "$HOME/.config/systemd/user"

# Timer
cat > "$HOME/.config/systemd/user/offline-guardian.timer" << EOF
[Unit]
Description=Run Offline Dev Guardian every 30 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=30min
Unit=offline-guardian.service

[Install]
WantedBy=timers.target
EOF

# Service
cat > "$HOME/.config/systemd/user/offline-guardian.service" << EOF
[Unit]
Description=Offline Dev Guardian Health Check

[Service]
Type=oneshot
WorkingDirectory=$INSTALL_DIR
ExecStart=/bin/bash $INSTALL_DIR/guardian/guardian.sh
StandardOutput=append:$INSTALL_DIR/logs/guardian.log
StandardError=append:$INSTALL_DIR/logs/guardian.log
EOF

# Enable timer
systemctl --user daemon-reload
systemctl --user enable --now offline-guardian.timer 2>/dev/null || true

# 13. Summary
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo ""
echo "✅ Installation successful! (took ${ELAPSED}s)"
echo ""
echo "Quick start:"
echo "   1. Install 'Continue' VS Code extension"
echo "   2. Restart VS Code"
echo "   3. Test:   aider"
echo "   4. Check:  forge-status"
echo ""
echo "Guardian runs lightweight checks every ~30 minutes."
echo "Logs → $LOG_DIR/guardian.log"
echo "Run 'forge-update' to refresh dependencies."
echo ""
echo "You now have a self-maintaining local AI dev stack."