#!/usr/bin/env bash
# Gate 1: Canon Directory Structure Validation
# Ensures canon/ directory layout, no stray files

set -euo pipefail

CANON_DIR="canon"
ALLOWED_FILES=("*.md" ".gitkeep")

echo "🔍 Running directory structure validation..."

if [ ! -d "$CANON_DIR" ]; then
  echo "❌ $CANON_DIR/ directory not found"
  exit 1
fi

# Check for stray files not matching allowed patterns
while IFS= read -r -d $'\0' file; do
  filename=$(basename "$file")
  allowed=0
  for pattern in "${ALLOWED_FILES[@]}"; do
    if [[ "$filename" == $pattern ]]; then
      allowed=1
      break
    fi
  done
  if [ "$allowed" -eq 0 ]; then
    echo "❌ Stray file not allowed: $file"
    exit 1
  fi
done < <(find "$CANON_DIR" -type f -print0)

echo "✅ Directory structure valid"