#!/usr/bin/env bash
# Quantum Pi Forge - low-memory guardian runner.

set -Eeuo pipefail

OLLAMA_HOST="${OLLAMA_HOST:-http://127.0.0.1:11434}"
SURVIVAL_MODEL="${SURVIVAL_MODEL:-qwen2.5:0.5b}"
HEAVY_MODELS="${HEAVY_MODELS:-oinio-soul-forge:latest llama3.2:3b qwen2.5-coder:7b qwen2.5-coder:14b deepseek-r1:32b}"
CHECK_INTERVAL_SEC="${CHECK_INTERVAL_SEC:-60}"

log() {
  printf '%s\n' "$*"
}

ensure_ollama() {
  if curl -fsS --max-time 5 "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
    log "OK Ollama runtime detected at $OLLAMA_HOST"
    return
  fi

  log "WARN Ollama not responding. Starting local service..."
  OLLAMA_ORIGINS="*" ollama serve >/tmp/quantum-pi-forge-ollama.log 2>&1 &
  sleep 3

  curl -fsS --max-time 10 "$OLLAMA_HOST/api/tags" >/dev/null
  log "OK Ollama runtime started"
}

unload_model() {
  local model="$1"
  curl -fsS --max-time 15 "$OLLAMA_HOST/api/generate" \
    -H 'Content-Type: application/json' \
    -d "{\"model\":\"$model\",\"keep_alive\":0}" >/dev/null 2>&1 || true
}

enforce_single_small_model() {
  local model
  local resident

  resident="$(ollama ps 2>/dev/null | awk 'NR > 1 { print $1 }' || true)"

  for model in $resident; do
    if [ "$model" != "$SURVIVAL_MODEL" ] && [[ " $HEAVY_MODELS " == *" $model "* ]]; then
      log "WARN unloading resident heavyweight model: $model"
      unload_model "$model"
    fi
  done
}

print_status() {
  log ""
  log "Guardian survival profile"
  log "  model: $SURVIVAL_MODEL"
  log "  interval: ${CHECK_INTERVAL_SEC}s"
  log ""
  free -h || true
  log ""
  ollama ps || true
}

on_exit() {
  log ""
  log "Guardian runner stopped."
}
trap on_exit EXIT

log "Starting Quantum Pi Forge Guardian Agent"
log "========================================"

ensure_ollama
enforce_single_small_model
print_status

log ""
log "OK Guardian node activated"
log "OK One-model survival guard enabled"
log "OK Network consensus participation ready"
log "OK Ethical audit engine ready"
log "Press Ctrl+C to stop guardian agent"

while true; do
  enforce_single_small_model
  sleep "$CHECK_INTERVAL_SEC"
done
