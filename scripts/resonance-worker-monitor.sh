#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
mkdir -p receipts/resonance-workers
TS="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="receipts/resonance-workers/resonance-worker-${TS}.json"
BRANCH="$(git branch --show-current 2>/dev/null || echo unknown)"
COMMIT="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
STATUS="$(git status --short 2>/dev/null | tr "\n" ";" || true)"
NODE="$(node --version 2>/dev/null || echo unavailable)"
NPM="$(npm --version 2>/dev/null || echo unavailable)"
PROC="$(ps -eo pid,comm,args 2>/dev/null | grep -Ei "resonance|worker|ollama|node|python" | grep -v grep | head -n 40 | sed "s/\"/'/g" || true)"
VERIFY_EXIT="missing_script"
VERIFY_TAIL="review:static-boundary script not found"
if npm run 2>/dev/null | grep -q "review:static-boundary"; then set +e; VERIFY_TAIL="$(npm run review:static-boundary 2>&1 | tail -n 80 | sed "s/\"/'/g")"; VERIFY_EXIT="${PIPESTATUS[0]}"; set -e; fi
PRE="{\"schema\":\"qpf.resonance_worker_monitor.v1\",\"timestamp_utc\":\"$TS\",\"branch\":\"$BRANCH\",\"commit\":\"$COMMIT\",\"working_tree_status_short\":\"$STATUS\",\"runtime\":{\"node\":\"$NODE\",\"npm\":\"$NPM\"},\"observations\":{\"process_snapshot\":\"$PROC\"},\"verification\":{\"command\":\"npm run review:static-boundary\",\"exit\":\"$VERIFY_EXIT\",\"result_tail\":\"$VERIFY_TAIL\"},\"boundary\":{\"claim\":\"This receipt records local observation only.\"}}"
SHA="$(printf "%s" "$PRE" | sha256sum | awk "{print \$1}")"
printf "%s\n" "${PRE%?},\"sha256\":\"$SHA\"}" > "$OUT"
echo "$OUT"
echo "sha256=$SHA"
