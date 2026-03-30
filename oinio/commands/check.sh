#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${OINIO_REPO_ROOT:-/home/kris/forge/Quantum-pi-forge}"
LOG_DIR="${HOME}/.oinio/logs"
mkdir -p "$LOG_DIR"

cd "$REPO_ROOT"

echo "[$(date -Is)] Running health checks" | tee -a "$LOG_DIR/check.log"
python3 verify_server.py 2>&1 | tee -a "$LOG_DIR/check.log"
