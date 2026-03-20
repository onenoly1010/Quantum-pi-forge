#!/bin/bash
# Setup Branch Protection Rules for main branch
# This script applies branch protection rules to the main branch using GitHub CLI or API
#
# Requirements:
#   - GitHub CLI (gh) installed and authenticated, OR
#   - GITHUB_TOKEN environment variable with repo scope
#
# Usage:
#   ./setup-branch-protection.sh

set -e

# Auto-detect repository from git remote
REPO_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
if [ -n "$REPO_URL" ]; then
    # Extract owner/repo from URL (handles both HTTPS and SSH)
    REPO=$(echo "$REPO_URL" | sed -E 's#.*[:/]([^/]+/[^/]+?)(\.git)?$#\1#')
else
    # Fallback to hardcoded value
    REPO="onenoly1010/pi-forge-quantum-genesis"
    echo "⚠️  Could not auto-detect repository, using default: $REPO"
fi

BRANCH="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/../branch-protection-config.json"

echo "🔒 Branch Protection Setup for $REPO"
echo "================================================"
echo ""

# Check if gh CLI is available and authenticated
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    if gh auth status &> /dev/null; then
        echo "✅ GitHub CLI authenticated"
        USE_GH_CLI=true
    else
        echo "⚠️  GitHub CLI not authenticated"
        USE_GH_CLI=false
    fi
else
    echo "⚠️  GitHub CLI not found"
    USE_GH_CLI=false
fi

# Check for GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN not set"
    HAS_TOKEN=false
else
    echo "✅ GITHUB_TOKEN is set"
    HAS_TOKEN=true
fi

echo ""

# If neither gh CLI nor token is available, show manual instructions
if [ "$USE_GH_CLI" = false ] && [ "$HAS_TOKEN" = false ]; then
    echo "❌ Cannot apply branch protection automatically"
    echo ""
    echo "Please use one of the following methods:"
    echo ""
    echo "Method 1: GitHub CLI"
    echo "  1. Install GitHub CLI: https://cli.github.com/"
    echo "  2. Authenticate: gh auth login"
    echo "  3. Run this script again"
    echo ""
    echo "Method 2: GitHub Token"
    echo "  1. Create a token at: https://github.com/settings/tokens"
    echo "  2. Grant 'repo' scope"
    echo "  3. Export token: export GITHUB_TOKEN=your_token_here"
    echo "  4. Run this script again"
    echo ""
    echo "Method 3: Manual Configuration"
    echo "  1. Go to: https://github.com/$REPO/settings/branches"
    echo "  2. Follow the steps in: .github/branch-protection-config.json"
    echo ""
    exit 1
fi

# Prepare the branch protection payload
echo "📝 Preparing branch protection configuration..."

PAYLOAD=$(cat <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Lint and Test",
      "Build and Package",
      "API Health Check",
      "healthcheck"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": false,
    "bypass_pull_request_allowances": {}
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF
)

echo "✅ Configuration prepared"
echo ""

# Apply branch protection using available method
if [ "$USE_GH_CLI" = true ]; then
    echo "🚀 Applying branch protection rules using GitHub CLI..."
    echo ""
    
    # Using gh api command to set branch protection
    echo "$PAYLOAD" | gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/$REPO/branches/$BRANCH/protection" \
        --input -
    
    echo ""
    echo "✅ Branch protection rules applied successfully!"
    
elif [ "$HAS_TOKEN" = true ]; then
    echo "🚀 Applying branch protection rules using GitHub API..."
    echo ""
    
    # Using curl with GITHUB_TOKEN
    response=$(curl -s -w "\n%{http_code}" -X PUT \
        -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "https://api.github.com/repos/$REPO/branches/$BRANCH/protection" \
        -d "$PAYLOAD")
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo "✅ Branch protection rules applied successfully!"
    else
        echo "❌ Failed to apply branch protection rules"
        echo "HTTP Status: $http_code"
        echo "Response: $response_body"
        exit 1
    fi
fi

echo ""
echo "================================================"
echo "Branch Protection Summary"
echo "================================================"
echo ""
echo "✅ Require pull request reviews before merging"
echo "   - Minimum approvals: 1"
echo "   - Dismiss stale reviews: Yes"
echo "   - Require code owner reviews: Yes"
echo ""
echo "✅ Require status checks to pass before merging"
echo "   - Require branches up to date: Yes"
echo "   - Status checks:"
echo "     • Lint and Test"
echo "     • Build and Package"
echo "     • API Health Check"
echo "     • healthcheck"
echo ""
echo "✅ Require conversation resolution: Yes"
echo "✅ Require linear history: Yes"
echo "✅ Include administrators: Yes"
echo "✅ Restrict force pushes: Yes"
echo "✅ Restrict deletions: Yes"
echo ""
echo "🎉 Branch protection setup complete!"
echo ""
echo "To verify, visit: https://github.com/$REPO/settings/branch_protection_rules"
echo ""
