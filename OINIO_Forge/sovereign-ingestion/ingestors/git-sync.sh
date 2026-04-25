#!/bin/bash
# OINIO Sovereign Ingestion Engine - Git Footprint Sync
# Recursively syncs all git repositories in forge workspace and prepares for vectorization

set -e

FORGE_ROOT="/home/kris/forge"
INGEST_PATH="${FORGE_ROOT}/OINIO_Forge/sovereign-ingestion/state/pending"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BATCH_ID="git_${TIMESTAMP}"

echo "🔄 OINIO Sovereign Git Ingestor"
echo "============================="
echo "Batch ID: ${BATCH_ID}"
echo "Started: $(date)"
echo ""

mkdir -p "${INGEST_PATH}/${BATCH_ID}"

# Find all git repositories
find "${FORGE_ROOT}" -type d -name ".git" -prune | while read git_dir; do
    repo_path=$(dirname "${git_dir}")
    repo_name=$(basename "${repo_path}")
    
    echo "  Processing: ${repo_name}"
    
    cd "${repo_path}"
    
    # Pull latest changes
    git pull --quiet --all > /dev/null 2>&1 || true
    
    # Get last 24 hours of changes
    git log --pretty=format:'%H|%an|%ai|%s' --since="24 hours ago" > "${INGEST_PATH}/${BATCH_ID}/${repo_name}_commits.log"
    
    # Generate unified diff of changes
    git diff HEAD@{1.day.ago} HEAD > "${INGEST_PATH}/${BATCH_ID}/${repo_name}_diff.patch" 2>/dev/null || true
    
    # Flatten repository to text using repo2text pattern
    if command -v repo2text &> /dev/null; then
        repo2text . --output "${INGEST_PATH}/${BATCH_ID}/${repo_name}_flattened.md" > /dev/null 2>&1
    else
        # Fallback simple flattening
        find . -type f \( -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.md" -o -name "*.sh" -o -name "*.toml" -o -name "*.yaml" \) \
            -not -path "./.git/*" \
            -exec echo -e "\n--- FILE: {} ---\n" \; -exec cat {} \; > "${INGEST_PATH}/${BATCH_ID}/${repo_name}_flattened.md" 2>/dev/null
    fi
    
    cd "${FORGE_ROOT}"
done

# Write batch metadata
cat > "${INGEST_PATH}/${BATCH_ID}/metadata.json" <<EOF
{
  "batch_id": "${BATCH_ID}",
  "timestamp": $(date +%s),
  "source": "git",
  "type": "technical_footprint",
  "ingestor": "git-sync.sh",
  "status": "pending"
}
EOF

echo ""
echo "✅ Git sync complete"
echo "Batch stored at: ${INGEST_PATH}/${BATCH_ID}"
echo "Files processed: $(ls -1 "${INGEST_PATH}/${BATCH_ID}" | wc -l)"

# Trigger chunker pipeline
touch "${INGEST_PATH}/${BATCH_ID}/.ready"