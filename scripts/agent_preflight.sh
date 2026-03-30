#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-$(pwd)}"
FAILED=0

check_cmd() {
  local cmd="$1"
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "[ok] command: $cmd"
  else
    echo "[x] command missing: $cmd"
    FAILED=1
  fi
}

check_path() {
  local path="$1"
  if [[ -e "$path" ]]; then
    echo "[ok] path: $path"
  else
    echo "[x] path missing: $path"
    FAILED=1
  fi
}

echo "Agent preflight for: $ROOT_DIR"
echo

check_cmd git
check_cmd python3
check_cmd node
check_cmd npm
check_cmd curl

if command -v docker >/dev/null 2>&1; then
  echo "[ok] command: docker"
else
  echo "[x] command missing: docker"
  FAILED=1
fi

if command -v gh >/dev/null 2>&1; then
  echo "[ok] command: gh"
else
  echo "[!] optional command missing: gh (recommended for repo automation)"
fi

check_path "$ROOT_DIR/.git"
check_path "$ROOT_DIR/server/main.py"
check_path "$ROOT_DIR/server/requirements.txt"
check_path "$ROOT_DIR/scripts/setup_oinio_control_plane.sh"

if [[ -f "${HOME}/.oinio/config.yaml" ]]; then
  echo "[ok] control-plane config: ${HOME}/.oinio/config.yaml"
else
  echo "[x] control-plane config missing: ${HOME}/.oinio/config.yaml"
  FAILED=1
fi

if [[ -x "${HOME}/.oinio/commands/deploy.sh" ]]; then
  echo "[ok] deploy command wrapper is executable"
else
  echo "[x] deploy wrapper missing: ${HOME}/.oinio/commands/deploy.sh"
  FAILED=1
fi

echo
if [[ "$FAILED" -eq 0 ]]; then
  echo "PASS: agent preflight complete"
  exit 0
fi

echo "FAIL: agent preflight found blockers"
exit 1
