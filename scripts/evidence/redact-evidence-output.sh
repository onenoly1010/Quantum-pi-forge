#!/usr/bin/env bash
set -euo pipefail

project_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Redact project root before HOME so repo paths become [PROJECT_ROOT], not [HOME]/forge/...
sed \
  -e "s|${project_root}|[PROJECT_ROOT]|g" \
  -e "s|${HOME}|[HOME]|g" \
  -e "s/[A-Za-z0-9_]*TOKEN[A-Za-z0-9_]*=.*/[REDACTED_TOKEN]=[REDACTED]/g" \
  -e "s/[A-Za-z0-9_]*SECRET[A-Za-z0-9_]*=.*/[REDACTED_SECRET]=[REDACTED]/g" \
  -e "s/[A-Za-z0-9_]*PASSWORD[A-Za-z0-9_]*=.*/[REDACTED_PASSWORD]=[REDACTED]/g" \
  -e "s/[A-Za-z0-9_]*PRIVATE[A-Za-z0-9_]*=.*/[REDACTED_PRIVATE]=[REDACTED]/g" \
  -e "s/[A-Za-z0-9_]*MNEMONIC[A-Za-z0-9_]*=.*/[REDACTED_MNEMONIC]=[REDACTED]/g" \
  -e "s/[A-Za-z0-9_]*SEED[A-Za-z0-9_]*=.*/[REDACTED_SEED]=[REDACTED]/g" \
  -e "s/[A-Za-z0-9_]*KEY[A-Za-z0-9_]*=.*/[REDACTED_KEY]=[REDACTED]/g"
