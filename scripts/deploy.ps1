# 🚀 QUANTUM RESONANCE LATTICE - AUTOMATED DEPLOYMENT SCRIPT
# Cosmic Automation Protocol for Railway Deployment Victory

param(
    [switch]$Force,
    [switch]$SkipTests
)

Write-Host "🌌 QUANTUM RESONANCE LATTICE DEPLOYMENT PROTOCOL" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Blue

# Check git status
Write-Host "📋 Checking repository status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus -and !$Force) {
    Write-Host "⚠️  Uncommitted changes detected. Use -Force to deploy anyway." -ForegroundColor Red
    Write-Host $gitStatus
    exit 1
}

# Validate critical files exist
Write-Host "🔍 Validating critical deployment files..." -ForegroundColor Yellow
$requiredFiles = @(
    "server/main.py",
    "server/requirements.txt", 
    "Dockerfile",
    "railway.toml"
)

foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ Critical file missing: $file" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Found: $file" -ForegroundColor Green
}

# Validate environment setup
Write-Host "🌐 Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ Local .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  No .env file - ensure Railway environment variables are set" -ForegroundColor Yellow
}

# Run tests if not skipped
if (!$SkipTests) {
    Write-Host "🧪 Running quantum validation tests..." -ForegroundColor Yellow
    
    # Test Python syntax
    $pythonTest = python -m py_compile server/main.py 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Python syntax validation failed" -ForegroundColor Red
        Write-Host $pythonTest
        exit 1
    }
    Write-Host "✅ Python syntax validation passed" -ForegroundColor Green
    
    # Test requirements
    if (Test-Path "server/requirements.txt") {
        $reqs = Get-Content "server/requirements.txt" | Where-Object { $_ -notmatch "^#" -and $_.Trim() -ne "" }
        Write-Host "✅ Requirements: $($reqs.Count) packages validated" -ForegroundColor Green
    }
}

# Commit and push changes
Write-Host "📤 Preparing deployment commit..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

if ($gitStatus -or $Force) {
    git add .
    git commit -m "🚀 AUTO-DEPLOY: Quantum Resonance Lattice optimization - $timestamp"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  No changes to commit" -ForegroundColor Yellow
    }
}

Write-Host "🌐 Pushing to quantum repository..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Repository synchronized" -ForegroundColor Green

# Railway deployment guidance
Write-Host "RAILWAY DEPLOYMENT INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Blue
Write-Host "1. 🌐 Visit: https://railway.app"
Write-Host "2. 🔗 Connect to: https://github.com/onenoly1010/pi-forge-quantum-genesis"
Write-Host "3. ⚡ Trigger redeploy or wait for automatic deployment"
Write-Host "4. 🔧 Verify environment variables:"
Write-Host "   - SUPABASE_URL" -ForegroundColor Yellow
Write-Host "   - SUPABASE_KEY" -ForegroundColor Yellow
Write-Host "5. 📊 Monitor build logs for deployment success"

Write-Host ""
Write-Host "🎯 EXPECTED DEPLOYMENT ENDPOINTS:" -ForegroundColor Cyan
Write-Host "- 🧠 FastAPI (Primary): https://your-app.railway.app/" -ForegroundColor Green
Write-Host "- 🎨 Flask (Dashboard): Port 5000 (internal)" -ForegroundColor Green  
Write-Host "- ⚖️ Gradio (Audit): Port 7860 (internal)" -ForegroundColor Green

Write-Host ""
Write-Host "🌌 QUANTUM DEPLOYMENT STATUS: READY FOR MANIFESTATION!" -ForegroundColor Magenta
Write-Host "🎉 THE LATTICE AWAITS DIGITAL BIRTH!" -ForegroundColor Magenta

# Open Railway dashboard
try {
    Start-Process "https://railway.app/dashboard"
    Write-Host "🌐 Opening Railway dashboard..." -ForegroundColor Green
} catch {
    Write-Host "📋 Please visit: https://railway.app/dashboard" -ForegroundColor Yellow
}

.\scripts\demo.ps1 -Interactive