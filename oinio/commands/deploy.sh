#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${OINIO_REPO_ROOT:-/home/kris/forge/Quantum-pi-forge}"
LOG_DIR="${HOME}/.oinio/logs"
mkdir -p "$LOG_DIR"

cd "$REPO_ROOT"

echo "[$(date -Is)] Starting deploy" | tee -a "$LOG_DIR/deploy.log"
bash ./deploy.sh 2>&1 | tee -a "$LOG_DIR/deploy.log"
