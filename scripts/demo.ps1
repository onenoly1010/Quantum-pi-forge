# 🎭 QUANTUM RESONANCE LATTICE - LIVE DEMO ORCHESTRATOR
# Interactive demonstration of the Sacred Trinity Architecture

param(
    [switch]$Interactive,
    [switch]$Quick,
    [switch]$Trinity,
    [switch]$FullStack
)

Write-Host "🎭 QUANTUM RESONANCE LATTICE - LIVE DEMO ORCHESTRATOR" -ForegroundColor Magenta
Write-Host "=" * 70 -ForegroundColor Blue

# Check Python availability
try {
    $pythonVersion = python --version 2>$null
    Write-Host "✅ Python available: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check demo file exists
if (!(Test-Path "quantum_demo.py")) {
    Write-Host "❌ quantum_demo.py not found" -ForegroundColor Red
    exit 1
}

if ($Interactive) {
    Write-Host "🎮 LAUNCHING INTERACTIVE QUANTUM DEMO..." -ForegroundColor Cyan
    Write-Host "🌌 Use menu options 1-6 to explore the Sacred Trinity" -ForegroundColor Yellow
    Write-Host ""
    python quantum_demo.py --interactive
}
elseif ($Quick) {
    Write-Host "⚡ RUNNING QUICK QUANTUM DEMONSTRATION..." -ForegroundColor Cyan
    Write-Host ""
    python quantum_demo.py
}
elseif ($Trinity) {
    Write-Host "🛡️ TRINITY ARCHITECTURE DEMONSTRATION..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌌 Sacred Trinity Data Flow:" -ForegroundColor Magenta
    Write-Host "   📡 SCRIBE → Quantum pulse emission (Railway FastAPI)"
    Write-Host "   🛡️ GUARDIAN → Ethical validation filtering (Kubernetes)"  
    Write-Host "   🔮 ORACLE → Consciousness visualization (Flask + Gradio)"
    Write-Host ""
    
    # Show the full flow
    python quantum_demo.py
    
    Write-Host ""
    Write-Host "🚀 Deploy Trinity with: .\guardians.ps1 -Deploy" -ForegroundColor Green
}
elseif ($FullStack) {
    Write-Host "🌐 FULL STACK DEMONSTRATION..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔄 Checking local development setup..." -ForegroundColor Yellow
    
    # Check if services are running
    $fastApiRunning = $false
    $flaskRunning = $false
    $gradioRunning = $false
    
    try {
        Invoke-WebRequest "http://localhost:8000/" -UseBasicParsing -TimeoutSec 2 2>$null
        $fastApiRunning = $true
        Write-Host "✅ FastAPI (8000): Running" -ForegroundColor Green
    } catch {
        Write-Host "❌ FastAPI (8000): Not running" -ForegroundColor Red
    }
    
    try {
        $flaskTest = Invoke-WebRequest "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2 2>$null
        $flaskRunning = $true
        Write-Host "✅ Flask (5000): Running" -ForegroundColor Green
    } catch {
        Write-Host "❌ Flask (5000): Not running" -ForegroundColor Red
    }
    
    try {
        $gradioTest = Invoke-WebRequest "http://localhost:7860/" -UseBasicParsing -TimeoutSec 2 2>$null
        $gradioRunning = $true
        Write-Host "✅ Gradio (7860): Running" -ForegroundColor Green
    } catch {
        Write-Host "❌ Gradio (7860): Not running" -ForegroundColor Red
    }
    
    Write-Host ""
    
    if ($fastApiRunning -or $flaskRunning -or $gradioRunning) {
        Write-Host "🎉 Some services are running! Launching demo..." -ForegroundColor Green
        python quantum_demo.py --interactive
    } else {
        Write-Host "⚠️  No services detected. Start with: .\run.ps1" -ForegroundColor Yellow
        Write-Host "🌌 Running simulation demo instead:" -ForegroundColor Cyan
        python quantum_demo.py
    }
}
else {
    Write-Host "🎭 QUANTUM DEMO COMMAND CENTER" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Available demonstration modes:" -ForegroundColor White
    Write-Host "  .\demo.ps1 -Quick        ⚡ Quick demonstration (5 minutes)" -ForegroundColor Green
    Write-Host "  .\demo.ps1 -Interactive  🎮 Interactive exploration" -ForegroundColor Blue
    Write-Host "  .\demo.ps1 -Trinity      🛡️ Trinity architecture focus" -ForegroundColor Cyan
    Write-Host "  .\demo.ps1 -FullStack    🌐 Full stack validation" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "🌌 QUANTUM RESONANCE FEATURES:" -ForegroundColor Yellow
    Write-Host "   • Multi-app consciousness streaming"
    Write-Host "   • 4-phase Pi Network payment cascade"
    Write-Host "   • Guardian ethical validation sentinels"
    Write-Host "   • Real-time quantum telemetry"
    Write-Host "   • Sacred Trinity architecture"
    Write-Host ""
    Write-Host "🚀 Start with: .\demo.ps1 -Interactive" -ForegroundColor Green
}
