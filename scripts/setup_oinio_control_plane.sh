#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OINIO_HOME="${HOME}/.oinio"
CONFIG_PATH="${OINIO_HOME}/config.yaml"
COMMANDS_DIR="${OINIO_HOME}/commands"
LOGS_DIR="${OINIO_HOME}/logs"

mkdir -p "$OINIO_HOME" "$COMMANDS_DIR" "$LOGS_DIR"

if [[ ! -f "$CONFIG_PATH" ]]; then
  cp "$REPO_ROOT/oinio/config.yaml.example" "$CONFIG_PATH"
  echo "Created $CONFIG_PATH from template"
else
  echo "Kept existing $CONFIG_PATH"
fi

cp "$REPO_ROOT/oinio/commands/deploy.sh" "$COMMANDS_DIR/deploy.sh"
cp "$REPO_ROOT/oinio/commands/check.sh" "$COMMANDS_DIR/check.sh"
cp "$REPO_ROOT/oinio/commands/logs.sh" "$COMMANDS_DIR/logs.sh"

chmod 700 "$COMMANDS_DIR"/*.sh
chmod 700 "$OINIO_HOME"
chmod 700 "$LOGS_DIR"
chmod 600 "$CONFIG_PATH"

echo "Control plane initialized at $OINIO_HOME"
echo "Commands: $COMMANDS_DIR/deploy.sh, $COMMANDS_DIR/check.sh, $COMMANDS_DIR/logs.sh"
