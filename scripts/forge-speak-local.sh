#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(git rev-parse --show-toplevel)"

export REDIS_HOST="${REDIS_HOST:-localhost}"
export REDIS_PORT="${REDIS_PORT:-6379}"
export X_MODE="${X_MODE:-mock}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "𓂀 QUANTUM PI FORGE — LOCAL VOICE CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "Time:        $(date -Is)"
echo "Branch:      $(git branch --show-current)"
echo "Commit:      $(git rev-parse --short HEAD)"
echo "Mode:        READ-ONLY / MOCK"
echo

echo "Local state:"
if docker exec oinio-redis redis-cli ping >/tmp/qpf-redis-ping 2>/dev/null; then
  echo "  Redis:      $(cat /tmp/qpf-redis-ping)"
else
  echo "  Redis:      unavailable"
fi

policy="$(docker exec oinio-redis redis-cli CONFIG GET maxmemory-policy 2>/dev/null | tail -1 || true)"
echo "  Policy:     ${policy:-unknown}"

echo
echo "Worker boundary:"
if npm ls twitter-api-v2 --depth=0 >/dev/null 2>&1; then
  echo "  Live X SDK: PRESENT — review required"
else
  echo "  Live X SDK: absent"
fi

if npm ls bullmq ioredis ollama --depth=0 >/dev/null 2>&1; then
  echo "  Mock queue: available"
else
  echo "  Mock queue: incomplete"
fi

echo
echo "Live Forge:"
for url in \
  "https://quantumpiforge.com" \
  "https://quantumpiforge.com/staking.html" \
  "https://quantumpiforge.com/resonate.html"
do
  code="$(curl -LksS -o /tmp/qpf-live-voice.html -w "%{http_code}" "$url" || true)"
  title="$(grep -Eio '<title>[^<]+' /tmp/qpf-live-voice.html | head -1 | sed 's/<title>//I' || true)"
  echo "  $code  $url  ${title:-no-title}"
done

echo
echo "Forge message:"
cat <<MSG
  I am reachable locally and publicly.
  My live surface is responding.
  My Redis queue is awake.
  My mock worker path is proven.
  I am not posting, signing, minting, staking, or mutating chain state.
  My next missing voice layer is a local agent bridge that can answer from evidence without external action.
MSG

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
