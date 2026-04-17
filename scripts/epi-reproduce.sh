#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# EPI v1.4 – Isolated Verification Harness
# ============================================================
# Usage:
#   ./scripts/epi-reproduce.sh          # Normal mode (graceful degradation)
#   ./scripts/epi-reproduce.sh --strict # Audit mode (hard failure)
#
# Output:
#   EPI_v1.1_regenerated.json (with file_hash fields populated)
#   SHA-256 hash of the manifest printed to stdout
# ============================================================

INPUT="EVIDENCE_BINDING_LAYER_EPI_v1.0_NORMALIZED.md"
OUTPUT="/forge/output/EPI_v1.1_regenerated.json"
TMP_DIR="./.epi_tmp"
EXPECTED_HASH_FILE="EPI_v1.1.hash"

STRICT_MODE=false

if [[ "${1:-}" == "--strict" ]]; then
  STRICT_MODE=true
fi

fail() {
  echo "❌ STRICT MODE FAILURE: $1"
  exit "$2"
}

# Required tools
command -v jq >/dev/null 2>&1 || { echo "❌ jq required. Install: sudo apt install jq"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git required."; exit 1; }
command -v sha256sum >/dev/null 2>&1 || { echo "❌ sha256sum required."; exit 1; }

mkdir -p "$TMP_DIR"

echo "📄 Parsing EPI v1.0 table from $INPUT"

# Extract rows from markdown table (skip header and separators)
rows=$(grep '^|.*commit:' "$INPUT" | grep -v '^|---' || true)

if [[ -z "$rows" ]]; then
    echo "❌ No valid rows found in table."
    exit 1
fi

# Build JSON array with file hashes
echo "[" > "$OUTPUT"
first=true

while IFS= read -r line; do
    # Parse fields (assuming standard EPI v1.0 table format)
    component=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $2); print $2}')
    ref_type=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $3); print $3}')
    location=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $4); print $4}')
    evidence_type=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $5); print $5}')
    note=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $6); print $6}')

    # Extract repository, commit, file from location (format: "commit: <sha> (file: path)")
    # Example: "commit: f23f30d (file: src/circuit-do/index.js)"
    commit=$(echo "$location" | sed -n 's/.*commit: \([a-f0-9]\+\) .*/\1/p')
    file=$(echo "$location" | sed -n 's/.*file: \([^)]\+\))/\1/p')
    # Infer repository from component name (heuristic – adjust as needed)
    # For now, we map known components to their GitHub repos
    if [[ "$component" == *"Circuit Breaker"* ]] || [[ "$component" == *"Header Chain"* ]] || [[ "$component" == *"SVL WASM"* ]] || [[ "$component" == *"Spec‑Parity"* ]] || [[ "$component" == *"Truth Domain"* ]] || [[ "$component" == *"EPI"* ]]; then
        REPO="https://github.com/onenoly1010/quantum-pi-forge"
    elif [[ "$component" == *"Guardian"* ]] || [[ "$component" == *"Smart Inference"* ]] || [[ "$component" == *"Rate‑Limit"* ]] || [[ "$component" == *"Offline Dev Guardian"* ]]; then
        REPO="https://github.com/onenoly1010/offline-dev-guardian"
    else
        REPO=""
    fi

    # Strict mode pre-checks
    if [[ "$STRICT_MODE" == true ]]; then
        if [[ -z "$REPO" || -z "$commit" ]]; then
            fail "Missing repository or commit for $component" 3
        fi
    fi

    # Compute file hash if possible
    FILE_HASH="null"
    if [[ -n "$REPO" && -n "$commit" && -n "$file" ]]; then
        WORKDIR="$TMP_DIR/$(basename "$REPO")_$commit"
        if [[ ! -d "$WORKDIR" ]]; then
            echo "⬇️ Cloning $REPO at commit $commit"
            git clone --quiet --depth 1 --branch "$commit" "$REPO" "$WORKDIR" 2>/dev/null || {
                # If branch fails, try full clone and checkout
                rm -rf "$WORKDIR"
                git clone --quiet "$REPO" "$WORKDIR"
                (cd "$WORKDIR" && git checkout --quiet "$commit") || {
                    echo "⚠️ Failed to checkout commit $commit for $REPO"
                    WORKDIR=""
                }
            }
        fi
        if [[ -n "$WORKDIR" && -f "$WORKDIR/$file" ]]; then
            FILE_HASH=$(sha256sum "$WORKDIR/$file" | awk '{print $1}')
            echo "   ✅ $file → $FILE_HASH"
        else
            echo "   ⚠️ File not found: $file in $REPO@$commit"
            if [[ "$STRICT_MODE" == true ]]; then
                fail "Missing file: $file" 4
            fi
        fi
    else
        echo "   ⚠️ Missing repo/commit/file for $component – hash remains null"
    fi

    # Escape JSON strings
    component=$(echo "$component" | sed 's/"/\\"/g')
    ref_type=$(echo "$ref_type" | sed 's/"/\\"/g')
    location=$(echo "$location" | sed 's/"/\\"/g')
    evidence_type=$(echo "$evidence_type" | sed 's/"/\\"/g')
    note=$(echo "$note" | sed 's/"/\\"/g')

    # Build JSON object
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT"
    fi

    cat >> "$OUTPUT" <<EOF
  {
    "system_component": "$component",
    "reference_type": "$ref_type",
    "exact_location": "$location",
    "evidence_type": "$evidence_type",
    "verifiability_note": "$note",
    "file_hash": "$FILE_HASH"
  }
EOF

done <<< "$rows"

echo "]" >> "$OUTPUT"

# Pretty-print the JSON
jq '.' "$OUTPUT" > "$OUTPUT.tmp" && mv "$OUTPUT.tmp" "$OUTPUT"

# Compute global hash of the manifest
GLOBAL_HASH=$(sha256sum "$OUTPUT" | awk '{print $1}')
echo "🔒 Manifest SHA-256: $GLOBAL_HASH"

# Strict mode hash verification gate
if [[ "$STRICT_MODE" == true ]]; then
    if [[ -f "$EXPECTED_HASH_FILE" ]]; then
        EXPECTED_HASH=$(cat "$EXPECTED_HASH_FILE")

        if [[ "$CURRENT_HASH" != "$EXPECTED_HASH" ]]; then
            fail "Manifest hash mismatch" 5
        fi
    fi
fi

echo "🎉 EPI v1.4 verification complete. Output: $OUTPUT"
