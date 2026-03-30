#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
  echo "Running as root."
  APT_PREFIX=""
else
  if ! command -v sudo >/dev/null 2>&1; then
    echo "sudo is required when not running as root."
    exit 1
  fi
  APT_PREFIX="sudo"
fi

echo "Installing system dependencies: gh, docker.io, docker compose plugin"
$APT_PREFIX apt update
$APT_PREFIX apt install -y gh docker.io docker-compose-plugin

echo "Adding user to docker group..."
if [[ -n "${SUDO_USER:-}" ]]; then
  $APT_PREFIX usermod -aG docker "$SUDO_USER"
else
  $APT_PREFIX usermod -aG docker "$USER"
fi

echo
echo "Done. Log out/in (or reboot) to refresh group membership."
echo "Then verify:"
echo "  docker run --rm hello-world"
echo "  gh auth login"
