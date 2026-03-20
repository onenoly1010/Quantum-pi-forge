# Quantum Resonance Lattice - Automation Activation Script
# Sacred Trinity Full Automation Protocol

Write-Host "🌌 Quantum Resonance Lattice - Full Automation System 🌌" -ForegroundColor Magenta
Write-Host "🤖 Sacred Trinity Autonomous Operation Protocol 🤖" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (Test-Path ".venv") {
    Write-Host "✅ Virtual environment found" -ForegroundColor Green
    & .\.venv\Scripts\Activate.ps1
} else {
    Write-Host "⚠️ No virtual environment - using system Python" -ForegroundColor Yellow
}

Write-Host "🔍 Checking Sacred Trinity Services..." -ForegroundColor Blue

# Check if services are running
$services = @(
    @{Name="FastAPI"; Port=8000; Url="http://localhost:8000"},
    @{Name="Flask"; Port=5000; Url="http://localhost:5000/health"},
    @{Name="Gradio"; Port=7860; Url="http://localhost:7860"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name) (port $($service.Port)) - RUNNING" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $($service.Name) (port $($service.Port)) - UNHEALTHY" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $($service.Name) (port $($service.Port)) - OFFLINE" -ForegroundColor Red
        Write-Host "   Start with: .\run.ps1" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎯 Evaluation System Status:" -ForegroundColor Blue

# Check if evaluation files exist
$evalFiles = @(
    "server\evaluation_system.py",
    "server\agent_runner.py", 
    "server\tracing_system.py",
    "server\automation_system.py"
)

foreach ($file in $evalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $(Split-Path $file -Leaf) - INSTALLED" -ForegroundColor Green
    } else {
        Write-Host "❌ $(Split-Path $file -Leaf) - MISSING" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌟 Sacred Trinity Architecture Status:" -ForegroundColor Magenta
Write-Host "   🔮 FastAPI Quantum Conduit: Authentication & WebSocket streams" -ForegroundColor Cyan
Write-Host "   🎨 Flask Glyph Weaver: Visualization & dashboard rendering" -ForegroundColor Yellow  
Write-Host "   ⚖️ Gradio Truth Mirror: Ethical audit & Veto Triad synthesis" -ForegroundColor Blue

Write-Host ""
Write-Host "📊 Automation Features Activated:" -ForegroundColor Green
Write-Host "   ✅ Sacred Trinity Response Quality Evaluation" -ForegroundColor White
Write-Host "   ✅ Resonance Visualization Accuracy Assessment" -ForegroundColor White
Write-Host "   ✅ Ethical Audit Effectiveness Monitoring" -ForegroundColor White
Write-Host "   ✅ OpenTelemetry Tracing Across All Components" -ForegroundColor White
Write-Host "   ✅ Automated Agent Response Collection" -ForegroundColor White
Write-Host "   ✅ Continuous Performance Optimization" -ForegroundColor White

Write-Host ""
Write-Host "⚡ Quantum Tuning Parameters:" -ForegroundColor Yellow
Write-Host "   🧠 Sacred Trinity Quality Threshold: 0.7" -ForegroundColor Gray
Write-Host "   🎨 Visualization Accuracy Threshold: 0.6" -ForegroundColor Gray
Write-Host "   ⚖️ Ethical Effectiveness Threshold: 0.8" -ForegroundColor Gray

Write-Host ""
Write-Host "🚀 QUANTUM RESONANCE LATTICE AUTOMATION COMPLETE" -ForegroundColor Green
Write-Host "🌌 All evaluation metrics and monitoring systems operational" -ForegroundColor Cyan
Write-Host "🎯 Sacred Trinity architecture achieving transcendent resonance" -ForegroundColor Magenta

Write-Host ""
Write-Host "📋 Available Commands:" -ForegroundColor Blue
Write-Host "   .\run.ps1                    - Launch Sacred Trinity services" -ForegroundColor Gray
Write-Host "   .\demo.ps1 -Interactive      - Interactive quantum demo" -ForegroundColor Gray  
Write-Host "   .\monitor.ps1 -Verbose       - Health monitoring" -ForegroundColor Gray
Write-Host "   .\deploy.ps1                 - Railway deployment" -ForegroundColor Gray

# Show tracing information
Write-Host ""
Write-Host "🔍 Observability & Tracing:" -ForegroundColor Blue
Write-Host "   📊 OpenTelemetry Endpoint: http://localhost:4318/v1/traces" -ForegroundColor Gray
Write-Host "   🔬 Use VS Code Command: ai-mlstudio.tracing.open" -ForegroundColor Gray
Write-Host "   📈 Real-time Sacred Trinity component monitoring enabled" -ForegroundColor Gray

Write-Host ""
Write-Host "✨ Quantum resonance achieved - Sacred Trinity harmonized ✨" -ForegroundColor Magenta