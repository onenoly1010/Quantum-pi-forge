#!/usr/bin/env bash
# Install example user systemd units for autonomy pulse (NO_WALLET_TOUCH).
# Usage: bash scripts/living-forge/systemd/install-user-units.sh
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
UNIT_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
mkdir -p "$UNIT_DIR"

sed "s|%h/Quantum-pi-forge|$ROOT|g" "$SCRIPT_DIR/qpf-autonomy-pulse.service" >"$UNIT_DIR/qpf-autonomy-pulse.service"
cp "$SCRIPT_DIR/qpf-autonomy-pulse.timer" "$UNIT_DIR/qpf-autonomy-pulse.timer"

systemctl --user daemon-reload
systemctl --user enable --now qpf-autonomy-pulse.timer
systemctl --user status qpf-autonomy-pulse.timer --no-pager
echo "Installed with ROOT=$ROOT NO_WALLET_TOUCH=true"
