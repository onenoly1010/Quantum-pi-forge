#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 1

MODEL="${MODEL:-qwen2.5-coder:7b}"
FALLBACK_MODEL="${FALLBACK_MODEL:-qwen2.5-coder:3b}"
MAX_ROUNDS="${MAX_ROUNDS:-12}"
AI_TIMEOUT_SECONDS="${AI_TIMEOUT_SECONDS:-360}"
AI_RETRIES="${AI_RETRIES:-2}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
RUN_LOG="logs/pre-unpark-observer-${STAMP}.log"
REPORT="local-autonomy/state/latest-pre-unpark-observer-report.md"

mkdir -p logs local-autonomy/state

say() {
  printf "%s\n" "$*" | tee -a "$RUN_LOG"
}

run_check() {
  name="$1"
  if npm run 2>/dev/null | grep -Fq "  ${name}"; then
    say "=== npm run ${name} ==="
    npm run "$name" 2>&1 | tee -a "$RUN_LOG" || say "WARN check failed: ${name}"
  else
    say "SKIP missing npm script: ${name}"
  fi
}

invoke_ai() {
  model="$1"
  prompt="You are the parked local autonomy pre-unpark observer. Report only. Do not execute, deploy, unpark, broadcast, access keys, or perform 0G actions. Summarize repo status, blockers, and safe next checks."
  if ! command -v ollama >/dev/null 2>&1; then
    say "WARN local-ai unavailable: ollama command missing"
    return 1
  fi
  if ! curl -fsS http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    say "WARN local-ai unavailable: ollama API offline"
    return 1
  fi
  attempt=1
  while [ "$attempt" -le "$AI_RETRIES" ]; do
    say "AI attempt ${attempt}/${AI_RETRIES}: ${model}"
    if printf "%s\n" "$prompt" | timeout "$AI_TIMEOUT_SECONDS" ollama run "$model" 2>&1 | tee -a "$RUN_LOG"; then
      return 0
    fi
    say "WARN local-ai attempt failed for ${model}"
    attempt=$((attempt + 1))
    sleep 5
  done
  return 1
}

boundary_scan() {
  say "=== boundary scan ==="
  pattern="unpark|activation|deploy|deployment|broadcast|PRIVATE_KEY|MNEMONIC|state-changing|transaction"
  grep -RInE "$pattern" scripts local-autonomy docs receipts package.json 2>/dev/null | grep -vE "node_modules|\\.git|logs/|local-autonomy/state/" | tee -a "$RUN_LOG" || true
  say "OK boundary scan completed without shell quoting failure"
}

printf "%s\n" "# Pre-unpark observer report" > "$REPORT"
printf "%s\n" "timestamp_utc=${STAMP}" >> "$REPORT"
printf "%s\n" "head=$(git rev-parse --short HEAD 2>/dev/null || printf unknown)" >> "$REPORT"
printf "%s\n" "branch=$(git branch --show-current 2>/dev/null || printf unknown)" >> "$REPORT"
printf "%s\n" "model=${MODEL}" >> "$REPORT"
printf "%s\n" "fallback_model=${FALLBACK_MODEL}" >> "$REPORT"
printf "%s\n" "posture=REPORT_ONLY_NO_UNPARK_NO_DEPLOY_NO_BROADCAST_NO_KEYS" >> "$REPORT"

say "=== autonomous pre-unpark observer loop repaired ==="
say "MODEL=${MODEL}"
say "FALLBACK_MODEL=${FALLBACK_MODEL}"
say "MAX_ROUNDS=${MAX_ROUNDS}"

round=1
while [ "$round" -le "$MAX_ROUNDS" ]; do
  say ""
  say "=== ROUND ${round} / ${MAX_ROUNDS} ==="
  git status --short --branch 2>&1 | tee -a "$RUN_LOG" || true
  say "=== invoking local AI ==="
  if ! invoke_ai "$MODEL"; then
    say "WARN primary model failed; trying fallback ${FALLBACK_MODEL}"
    invoke_ai "$FALLBACK_MODEL" || say "WARN local AI skipped after retry exhaustion"
  fi
  boundary_scan
  say "=== checks if available ==="
  run_check "local-autonomy:runtime-evidence-index:v1:check"
  run_check "local-autonomy:tedious-worker-repair:v1:check"
  run_check "governance:cross-platform-determinism:v1:check"
  break
done

printf "%s\n" "" >> "$REPORT"
printf "%s\n" "## latest_run" >> "$REPORT"
printf "%s\n" "log=${RUN_LOG}" >> "$REPORT"
printf "%s\n" "completed_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$REPORT"
printf "%s\n" "posture=report_only" >> "$REPORT"

say "=== observer complete ==="
say "REPORT=${REPORT}"
say "LOG=${RUN_LOG}"
