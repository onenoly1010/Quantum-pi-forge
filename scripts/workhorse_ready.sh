#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting Linux workhorse onboarding..."
echo

echo "[1/4] Baseline bootstrap report"
bash "$ROOT_DIR/scripts/bootstrap_linux_workhorse.sh"
echo

echo "[2/4] Initialize OINIO control plane"
bash "$ROOT_DIR/scripts/setup_oinio_control_plane.sh"
echo

echo "[3/4] Agent preflight"
if bash "$ROOT_DIR/scripts/agent_preflight.sh" "$ROOT_DIR"; then
  echo
  echo "Workhorse is ready."
  exit 0
fi

echo
echo "[4/4] Remaining blockers detected"
echo "Run these commands in your local terminal (interactive sudo required):"
echo
echo "  sudo apt update"
echo "  sudo apt install -y gh docker.io docker-compose-plugin"
echo "  sudo usermod -aG docker \"$USER\""
echo "  # logout/login, then:"
echo "  docker run --rm hello-world"
echo "  gh auth login"
echo
echo "Then rerun:"
echo "  bash scripts/agent_preflight.sh $ROOT_DIR"

exit 1
