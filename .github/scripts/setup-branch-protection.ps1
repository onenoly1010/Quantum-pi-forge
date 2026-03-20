# Setup Branch Protection Rules for main branch
# This script applies branch protection rules to the main branch using GitHub CLI or API
#
# Requirements:
#   - GitHub CLI (gh) installed and authenticated, OR
#   - GITHUB_TOKEN environment variable with repo scope
#
# Usage:
#   .\setup-branch-protection.ps1

$ErrorActionPreference = "Stop"

# Auto-detect repository from git remote
$REPO_URL = git config --get remote.origin.url 2>$null
if ($REPO_URL) {
    # Extract owner/repo from URL (handles both HTTPS and SSH)
    if ($REPO_URL -match '[:/]([^/]+/[^/]+?)(\.git)?$') {
        $REPO = $matches[1]
    } else {
        $REPO = "onenoly1010/pi-forge-quantum-genesis"
        Write-Host "⚠️  Could not auto-detect repository, using default: $REPO" -ForegroundColor Yellow
    }
} else {
    # Fallback to hardcoded value
    $REPO = "onenoly1010/pi-forge-quantum-genesis"
    Write-Host "⚠️  Could not auto-detect repository, using default: $REPO" -ForegroundColor Yellow
}

$BRANCH = "main"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$CONFIG_FILE = Join-Path $SCRIPT_DIR "..\branch-protection-config.json"

Write-Host "🔒 Branch Protection Setup for $REPO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if gh CLI is available and authenticated
$USE_GH_CLI = $false
$HAS_TOKEN = $false

if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "✅ GitHub CLI found" -ForegroundColor Green
    $ghAuthStatus = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub CLI authenticated" -ForegroundColor Green
        $USE_GH_CLI = $true
    } else {
        Write-Host "⚠️  GitHub CLI not authenticated" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  GitHub CLI not found" -ForegroundColor Yellow
}

# Check for GITHUB_TOKEN
if ([string]::IsNullOrEmpty($env:GITHUB_TOKEN)) {
    Write-Host "⚠️  GITHUB_TOKEN not set" -ForegroundColor Yellow
} else {
    Write-Host "✅ GITHUB_TOKEN is set" -ForegroundColor Green
    $HAS_TOKEN = $true
}

Write-Host ""

# If neither gh CLI nor token is available, show manual instructions
if (-not $USE_GH_CLI -and -not $HAS_TOKEN) {
    Write-Host "❌ Cannot apply branch protection automatically" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use one of the following methods:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Method 1: GitHub CLI" -ForegroundColor Cyan
    Write-Host "  1. Install GitHub CLI: https://cli.github.com/"
    Write-Host "  2. Authenticate: gh auth login"
    Write-Host "  3. Run this script again"
    Write-Host ""
    Write-Host "Method 2: GitHub Token" -ForegroundColor Cyan
    Write-Host "  1. Create a token at: https://github.com/settings/tokens"
    Write-Host "  2. Grant 'repo' scope"
    Write-Host "  3. Set environment variable: `$env:GITHUB_TOKEN = 'your_token_here'"
    Write-Host "  4. Run this script again"
    Write-Host ""
    Write-Host "Method 3: Manual Configuration" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/$REPO/settings/branches"
    Write-Host "  2. Follow the steps in: .github\branch-protection-config.json"
    Write-Host ""
    exit 1
}

# Prepare the branch protection payload
Write-Host "📝 Preparing branch protection configuration..." -ForegroundColor Cyan

$PAYLOAD = @'
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
'@

Write-Host "✅ Configuration prepared" -ForegroundColor Green
Write-Host ""

# Apply branch protection using available method
if ($USE_GH_CLI) {
    Write-Host "🚀 Applying branch protection rules using GitHub CLI..." -ForegroundColor Cyan
    Write-Host ""
    
    # Using gh api command to set branch protection
    $PAYLOAD | gh api `
        --method PUT `
        -H "Accept: application/vnd.github+json" `
        -H "X-GitHub-Api-Version: 2022-11-28" `
        "/repos/$REPO/branches/$BRANCH/protection" `
        --input -
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Branch protection rules applied successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Failed to apply branch protection rules" -ForegroundColor Red
        exit 1
    }
    
} elseif ($HAS_TOKEN) {
    Write-Host "🚀 Applying branch protection rules using GitHub API..." -ForegroundColor Cyan
    Write-Host ""
    
    # Using Invoke-RestMethod with GITHUB_TOKEN
    $headers = @{
        "Accept" = "application/vnd.github+json"
        "Authorization" = "Bearer $env:GITHUB_TOKEN"
        "X-GitHub-Api-Version" = "2022-11-28"
    }
    
    try {
        $response = Invoke-RestMethod `
            -Uri "https://api.github.com/repos/$REPO/branches/$BRANCH/protection" `
            -Method Put `
            -Headers $headers `
            -Body $PAYLOAD `
            -ContentType "application/json"
        
        Write-Host "✅ Branch protection rules applied successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to apply branch protection rules" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Branch Protection Summary" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Require pull request reviews before merging" -ForegroundColor Green
Write-Host "   - Minimum approvals: 1"
Write-Host "   - Dismiss stale reviews: Yes"
Write-Host "   - Require code owner reviews: Yes"
Write-Host ""
Write-Host "✅ Require status checks to pass before merging" -ForegroundColor Green
Write-Host "   - Require branches up to date: Yes"
Write-Host "   - Status checks:"
Write-Host "     • Lint and Test"
Write-Host "     • Build and Package"
Write-Host "     • API Health Check"
Write-Host "     • healthcheck"
Write-Host ""
Write-Host "✅ Require conversation resolution: Yes" -ForegroundColor Green
Write-Host "✅ Require linear history: Yes" -ForegroundColor Green
Write-Host "✅ Include administrators: Yes" -ForegroundColor Green
Write-Host "✅ Restrict force pushes: Yes" -ForegroundColor Green
Write-Host "✅ Restrict deletions: Yes" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Branch protection setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To verify, visit: https://github.com/$REPO/settings/branch_protection_rules" -ForegroundColor Cyan
Write-Host ""
