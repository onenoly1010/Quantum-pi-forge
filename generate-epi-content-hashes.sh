#!/bin/bash
# EPI v1.1 Content Hash Generator
# Computes cryptographic SHA-256 hashes for every file in the evidence manifest
# Run this from the repository root

MANIFEST="EVIDENCE_BINDING_LAYER_EPI_v1.1_MANIFEST.json"
COMMIT="f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7"

echo "🔐 EPI v1.1 Content Hash Verification"
echo "===================================="
echo "Root commit: $COMMIT"
echo ""

files=(
  "src/circuit-do/index.js"
  "test/circuit-breaker.test.ts"
  "src/light-client/header-chain.ts"
  "src/svl-wasm/src/lib.rs"
  "docs/TRUTH_DOMAIN_SEPARATION.md"
  "docs/EPI_v1.0.md"
  "../../.forge-daemon/guardian.sh"
  "../../.forge-daemon/smart_infer.sh"
  "../../.forge-daemon/rules.json"
  "install-forge.sh"
)

echo "Calculating content hashes:"
echo "---------------------------"

for file in "${files[@]}"; do
  if git cat-file -e "$COMMIT:$file" 2>/dev/null; then
    hash=$(git show "$COMMIT:$file" | sha256sum | awk '{print $1}')
    echo "✅ $file"
    echo "   $hash"
    
    # Update manifest in place
    temp=$(mktemp)
    jq --arg file "$file" --arg hash "$hash" \
      '.evidence_index |= map(if .file_path == $file then .content_hash_sha256 = $hash else . end)' \
      "$MANIFEST" > "$temp" && mv "$temp" "$MANIFEST"
  else
    echo "⚠️  $file not found in commit $COMMIT"
  fi
  echo ""
done

echo "✅ Complete. Manifest updated with cryptographic content hashes."
echo ""
echo "Verification command for any file:"
echo "  git show $COMMIT:<path> | sha256sum"