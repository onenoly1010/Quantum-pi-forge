#!/bin/bash
# Smart Inference Router (8GB-optimized)

set -euo pipefail

PROMPT="$1"
TASK_ID="${2:-default}"

STATE_FILE="$HOME/offline-dev-guardian/guardian/model_state.json"
LOG_FILE="$HOME/offline-dev-guardian/logs/guardian.log"

# Defaults
LOCAL_MODEL="qwen2.5-coder:7b"
EXTERNAL_CMD="cline"  # <-- CHANGE THIS if needed

COOLDOWN=600  # 10 minutes

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [infer:$TASK_ID] $*" >> "$LOG_FILE"
}

# Init state file
if [ ! -f "$STATE_FILE" ]; then
    echo '{}' > "$STATE_FILE"
fi

now() {
    date +%s
}

last_fail() {
    jq -r ".\"$1\" // 0" "$STATE_FILE"
}

set_fail() {
    tmp=$(mktemp)
    jq ".\"$1\"=$(now)" "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

cooldown_active() {
    local last=$(last_fail "$1")
    local now_ts=$(now)
    (( now_ts - last < COOLDOWN ))
}

# System load guard
LOAD=$(awk '{print $1}' /proc/loadavg)
SWAP_USED=$(free | awk '/Swap/{print $3}')

if (( $(echo "$LOAD > 2.0" | bc -l) )) || [ "$SWAP_USED" -gt 0 ]; then
    log "System overloaded → skipping inference"
    echo "no_action"
    exit 0
fi

# 1. Try external (if not cooling down)
if ! cooldown_active "external"; then
    log "Trying external model..."

    if RESPONSE=$($EXTERNAL_CMD --prompt "$PROMPT" 2>&1); then
        echo "$RESPONSE"
        exit 0
    else
        log "External failed → cooldown"
        set_fail "external"
    fi
else
    log "External on cooldown"
fi

# 2. Fallback to local 7B
log "Using local model ($LOCAL_MODEL)"

if RESPONSE=$(ollama run "$LOCAL_MODEL" "$PROMPT" 2>&1); then
    echo "$RESPONSE"
    exit 0
else
    log "Local inference failed"
fi

echo "no_action"
exit 1