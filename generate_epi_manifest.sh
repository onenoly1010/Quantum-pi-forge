#!/usr/bin/env bash
set -euo pipefail

# -------------------------------
# Configuration
# -------------------------------
PRIMARY_REPO="${1:-$(pwd)}"
GUARDIAN_REPO="${2:-}"  # e.g., /path/to/guardian-scripts

# Primary commit abbreviation from evidence table
PRIMARY_COMMIT_ABBREV="ff25a24"

# Evidence entries (relative paths inside each repo)
# Format: "component|file_path|evidence_type|description|provenance"
# For primary repo entries
PRIMARY_ENTRIES=(
    "Circuit Breaker (Durable Object)|src/circuit-do/index.js|Code|Contains alarm() state transition logic and circuit state machine.|"
    "Circuit Breaker – failure threshold (3 failures)|test/circuit-breaker.test.ts|Code (test)|Simulates 3 consecutive failures, asserts OPEN state transition.|"
    "Header Chain Light Client|src/light-client/header-chain.ts|Code|Sequential header sync, parent hash validation, signature verification.|"
    "SVL WASM Kernel (MPT verification)|src/svl-wasm/src/lib.rs|Code (Rust)|verify_state_root() implementation and Merkle Patricia Trie proof logic.|"
    "Spec‑Parity Test Vectors|test/svl/fixtures/geth-trie|Test fixtures|Merkle Patricia Trie test vectors|Adapted from upstream Ethereum test suite"
    "Truth Domain Separation Specification|TRUTH_DOMAIN_SEPARATION_LAYER_v1.0.md|Documentation|Formal definitions: Fact, Internal State, Design Intent boundaries.|"
    "EPI v1.0 Evidence Binding Specification|EVIDENCE_BINDING_LAYER_EPI_v1.0.md|Documentation|Describes cryptographic evidence binding structure and verification protocol.|"
)

# Guardian repo entries (only if GUARDIAN_REPO is provided)
GUARDIAN_ENTRIES=(
    "Guardian Operator Loop|guardian/guardian_v2.sh|Code (bash)|Contains health check pipeline and action dispatch logic.|External guardian repository"
    "Smart Inference Router (tiered fallback)|guardian/smart_infer.sh|Code (bash)|External → local 3B priority routing, cooldown logic, load guard.|External guardian repository"
    "Rate‑Limit Detection Rule Set|guardian/rules.json|Config|JSON pattern matching for 429, rate limit headers, TPM thresholds.|External guardian repository"
    "Offline Dev Guardian – Installer|install-forge.sh|Code (bash)|One-command installer for Linux Mint / Debian systems.|External guardian repository"
)

# -------------------------------
# Check dependencies
# -------------------------------
if ! command -v jq &> /dev/null; then
    echo "jq not found. Attempting to install..."
    sudo apt update && sudo apt install -y jq || {
        echo "ERROR: Could not install jq. Please install manually and re-run."
        exit 1
    }
fi

# -------------------------------
# Helper function: get full SHA and content hash for a file in a given repo
# Usage: get_file_info <repo_path> <commit> <file_path>
# Outputs: full_sha content_hash
# -------------------------------
get_file_info() {
    local repo="$1"
    local commit="$2"
    local file="$3"
    cd "$repo"
    # Get full 40-char SHA
    local full_sha
    full_sha=$(git rev-parse "$commit")
    # Get content hash (SHA256 of blob)
    local content_hash
    content_hash=$(git show "$commit:$file" 2>/dev/null | sha256sum | awk '{print $1}')
    if [ -z "$content_hash" ]; then
        content_hash="FILE_NOT_FOUND_AT_THAT_COMMIT"
    fi
    echo "$full_sha $content_hash"
}

# -------------------------------
# Resolve primary repo commit full SHA
# -------------------------------
cd "$PRIMARY_REPO"
PRIMARY_FULL_SHA=$(git rev-parse "$PRIMARY_COMMIT_ABBREV")
echo "Primary repo full SHA: $PRIMARY_FULL_SHA"

# -------------------------------
# Build JSON manifest
# -------------------------------
# Start JSON structure
MANIFEST=$(jq -n \
    --arg gen_date "$(date -Iseconds)" \
    --arg primary_commit_abbrev "$PRIMARY_COMMIT_ABBREV" \
    --arg primary_full_sha "$PRIMARY_FULL_SHA" \
    --arg guardian_repo "${GUARDIAN_REPO:-}" \
    '{
        manifest_version: "1.0",
        schema: "https://quantumpiforge.com/ns/epi-v1.0",
        generated: $gen_date,
        generator: "Quantum Pi Forge EPI Tool (bash script)",
        repository_context: {
            primary_repo: "soul-feed",
            primary_commit_abbrev: $primary_commit_abbrev,
            primary_full_sha: $primary_full_sha,
            guardian_repo: $guardian_repo,
            guardian_commit_placeholder: "<guardian-repo-sha>"
        },
        evidence_entries: []
    }')

# -------------------------------
# Add primary repo entries
# -------------------------------
for entry in "${PRIMARY_ENTRIES[@]}"; do
    IFS='|' read -r component file_path evidence_type description provenance <<< "$entry"
    # Get file info
    read -r full_sha content_hash <<< $(get_file_info "$PRIMARY_REPO" "$PRIMARY_COMMIT_ABBREV" "$file_path")
    MANIFEST=$(echo "$MANIFEST" | jq \
        --arg comp "$component" \
        --arg ref_type "commit-sha" \
        --arg commit_abbrev "$PRIMARY_COMMIT_ABBREV" \
        --arg full_sha "$full_sha" \
        --arg file_path "$file_path" \
        --arg ev_type "$evidence_type" \
        --arg desc "$description" \
        --arg content_hash "$content_hash" \
        --arg prov "$provenance" \
        '.evidence_entries += [{
            component: $comp,
            reference_type: $ref_type,
            commit_abbrev: $commit_abbrev,
            full_sha: $full_sha,
            file_path: $file_path,
            evidence_type: $ev_type,
            description: $desc,
            content_hash: $content_hash,
            provenance: (if $prov == "" then null else $prov end)
        }]')
done

# -------------------------------
# Add guardian repo entries (if repo provided)
# -------------------------------
if [ -n "$GUARDIAN_REPO" ] && [ -d "$GUARDIAN_REPO/.git" ]; then
    echo "Guardian repo found. Resolving HEAD SHA..."
    cd "$GUARDIAN_REPO"
    GUARDIAN_FULL_SHA=$(git rev-parse HEAD)
    GUARDIAN_ABBREV=$(git rev-parse --short HEAD)
    echo "Guardian full SHA: $GUARDIAN_FULL_SHA"

    # Update repository context
    MANIFEST=$(echo "$MANIFEST" | jq \
        --arg guardian_full "$GUARDIAN_FULL_SHA" \
        --arg guardian_abbrev "$GUARDIAN_ABBREV" \
        '.repository_context.guardian_full_sha = $guardian_full | .repository_context.guardian_commit_abbrev = $guardian_abbrev')

    for entry in "${GUARDIAN_ENTRIES[@]}"; do
        IFS='|' read -r component file_path evidence_type description provenance <<< "$entry"
        read -r full_sha content_hash <<< $(get_file_info "$GUARDIAN_REPO" "HEAD" "$file_path")
        MANIFEST=$(echo "$MANIFEST" | jq \
            --arg comp "$component" \
            --arg ref_type "external-commit" \
            --arg commit_abbrev "$GUARDIAN_ABBREV" \
            --arg full_sha "$full_sha" \
            --arg file_path "$file_path" \
            --arg ev_type "$evidence_type" \
            --arg desc "$description" \
            --arg content_hash "$content_hash" \
            --arg prov "$provenance" \
            '.evidence_entries += [{
                component: $comp,
                reference_type: $ref_type,
                commit_abbrev: $commit_abbrev,
                full_sha: $full_sha,
                file_path: $file_path,
                evidence_type: $ev_type,
                description: $desc,
                content_hash: $content_hash,
                provenance: $prov
            }]')
    done
else
    echo "WARNING: Guardian repo not provided or invalid. Skipping guardian entries."
    # Add placeholders for completeness
    for entry in "${GUARDIAN_ENTRIES[@]}"; do
        IFS='|' read -r component file_path evidence_type description provenance <<< "$entry"
        MANIFEST=$(echo "$MANIFEST" | jq \
            --arg comp "$component" \
            --arg ref_type "external-commit" \
            --arg file_path "$file_path" \
            --arg ev_type "$evidence_type" \
            --arg desc "$description" \
            --arg prov "$provenance" \
            '.evidence_entries += [{
                component: $comp,
                reference_type: $ref_type,
                commit_abbrev: "<guardian-repo-sha>",
                full_sha: "PENDING",
                file_path: $file_path,
                evidence_type: $ev_type,
                description: $desc,
                content_hash: "PENDING",
                provenance: $prov
            }]')
    done
fi

# -------------------------------
# Add normalization status
# -------------------------------
MANIFEST=$(echo "$MANIFEST" | jq \
    --arg guardian_repo "${GUARDIAN_REPO:-}" \
    '.normalization_status = {
    immutable_commit_bound_references: true,
    no_branch_ambiguous_pointers: true,
    explicit_file_annotations: true,
    provenance_annotations: true,
    full_sha_expansion: true,
    guardian_sha_resolution: (if $guardian_repo != "" then true else false end),
    content_hashes_added: true
}')

# -------------------------------
# Output final manifest
# -------------------------------
echo "$MANIFEST" | jq '.' > evidence-manifest.json
echo "✅ Manifest written to evidence-manifest.json"