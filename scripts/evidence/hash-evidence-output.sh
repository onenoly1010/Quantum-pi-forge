#!/usr/bin/env bash
set -euo pipefail

target="${1:?usage: hash-evidence-output.sh <file>}"

if [ ! -f "$target" ]; then
  echo "missing file: $target" >&2
  exit 1
fi

sha256sum "$target" | awk '{print $1}'
