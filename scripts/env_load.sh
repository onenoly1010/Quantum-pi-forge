#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-/home/kris/forge/Quantum-pi-forge/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[env_load] missing env file: $ENV_FILE" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

echo "[env_load] loaded: $ENV_FILE"
echo "CORE_URL=${CORE_URL:-}"
echo "OLLAMA_HOST=${OLLAMA_HOST:-}"
echo "DEFAULT_MODEL=${DEFAULT_MODEL:-}"
echo "NODE_NAME=${NODE_NAME:-}"
