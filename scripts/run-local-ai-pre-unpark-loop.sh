#!/usr/bin/env bash
set -euo pipefail
cd ~/forge/Quantum-pi-forge || exit 1

MODEL="${LOCAL_AI_MODEL:-qwen2.5-coder:7b}"
MAX_ROUNDS="${MAX_ROUNDS:-12}"

echo "=== autonomous pre-unpark loop ==="
echo "MODEL=$MODEL"
echo "MAX_ROUNDS=$MAX_ROUNDS"

for round in $(seq 1 "$MAX_ROUNDS"); do
  echo
  echo "=== ROUND $round / $MAX_ROUNDS ==="
  git fetch origin || true
  git status -sb || true

  if [ -f runtime/autonomous/HARD_STOP_PRE_UNPARK.txt ]; then
    echo "HARD STOP FILE FOUND"
    cat runtime/autonomous/HARD_STOP_PRE_UNPARK.txt
    exit 2
  fi

  if [ -f runtime/autonomous/READY_TO_UNPARK_CANDIDATE.txt ]; then
    echo "READY FILE FOUND"
    cat runtime/autonomous/READY_TO_UNPARK_CANDIDATE.txt
    exit 0
  fi

  PROMPT="$(printf "%s\n\nRepo status:\n%s\n\nOpen PRs:\n%s\n\nRecent commits:\n%s\n" "$(cat runtime/autonomous/pre-unpark-objective.txt)" "$(git status -sb 2>/dev/null || true)" "$(gh pr list --state open --json number,title,headRefName,url --jq '.[]' 2>/dev/null || true)" "$(git log --oneline --decorate --max-count=15 2>/dev/null || true)")"

  echo "=== invoking local AI ==="
  if command -v ollama >/dev/null 2>&1; then
    printf "%s\n" "$PROMPT" | ollama run "$MODEL" || true
  elif command -v aider >/dev/null 2>&1; then
    aider --message "$PROMPT" || true
  else
    echo "No local AI CLI found: expected ollama or aider."
    exit 1
  fi

  echo
  echo "=== boundary scan ==="
  if grep -RIn \\
    -e '"unpark_executed"[[:space:]]*:[[:space:]]*true' \\
    -e '"deployment_executed"[[:space:]]*:[[:space:]]*true' \\
    -e '"broadcast_executed"[[:space:]]*:[[:space:]]*true' \\
    -e '"state_changing_transaction_executed"[[:space:]]*:[[:space:]]*true' \\
    -e '"operator_execution_authority_granted"[[:space:]]*:[[:space:]]*true' \\
    -e '"command_hash_execution_authorized"[[:space:]]*:[[:space:]]*true' \\
    docs receipts scripts package.json 2>/dev/null; then
    printf "%s\n" "HARD STOP: forbidden true flag detected" > runtime/autonomous/HARD_STOP_PRE_UNPARK.txt
    cat runtime/autonomous/HARD_STOP_PRE_UNPARK.txt
    exit 2
  fi

  echo
  echo "=== checks if available ==="
  node -e 'const fs=require("fs"); const p=JSON.parse(fs.readFileSync("package.json","utf8")); for (const k of Object.keys(p.scripts||{}).sort()) { if (k.startsWith("governance:") && k.endsWith(":check")) console.log(k); }' | while read -r script; do
    echo "=== npm run $script ==="
    npm run "$script"
  done

  npm run build

  echo
  echo "=== objective scan ==="
  if grep -RIn -e "READY_TO_UNPARK_CANDIDATE" -e "ready_to_unpark_candidate" docs receipts scripts runtime package.json 2>/dev/null; then
    printf "%s\n" "READY_TO_UNPARK_CANDIDATE=true" "UNPARK_EXECUTED=false" "ACTIVATION_BOUNDARY_REACHED=true" "Verified by objective scan on $(date -Iseconds)" > runtime/autonomous/READY_TO_UNPARK_CANDIDATE.txt
    cat runtime/autonomous/READY_TO_UNPARK_CANDIDATE.txt
    exit 0
  fi
done

echo "MAX_ROUNDS reached without objective proof or hard stop."
exit 3
