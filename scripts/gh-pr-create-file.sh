#!/usr/bin/env bash
set -Eeuo pipefail

BASE="${1:?base branch required}"
HEAD="${2:?head branch required}"
TITLE="${3:?title required}"
BODY_FILE="${4:?body file required}"

if [[ ! -f "$BODY_FILE" ]]; then
  echo "ERROR: body file not found: $BODY_FILE" >&2
  exit 1
fi

gh pr create --base "$BASE" --head "$HEAD" --title "$TITLE" --body-file "$BODY_FILE"
