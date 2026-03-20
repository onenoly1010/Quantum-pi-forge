# Sacred Trinity Full Launcher - Complete Automation System
# FastAPI + Flask + Gradio + Evaluation + Tracing + Automation

param(
    [switch]$FullAutomation,
    [switch]$TracingOnly,
    [switch]$EvaluationOnly
)

Write-Host "🌌 SACRED TRINITY QUANTUM RESONANCE LATTICE 🌌" -ForegroundColor Magenta
Write-Host "🤖 Full Automation System Activation Protocol 🤖" -ForegroundColor Cyan
Write-Host ""

# Load environment variables from .env file
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)\s*$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
    Write-Host "✅ Environment variables loaded from .env" -ForegroundColor Green
} else {
    Write-Warning "⚠️ .env file not found. Manual env setup required."
}

# Activate virtual environment
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "🐍 Activating Python virtual environment..." -ForegroundColor Blue
    . .venv\Scripts\Activate.ps1
} else {
    Write-Warning "⚠️ Virtual environment not found."
}

Write-Host ""
Write-Host "🎯 LAUNCHING SACRED TRINITY ARCHITECTURE:" -ForegroundColor Yellow
Write-Host "   🧠 FastAPI Quantum Conduit (port 8000)" -ForegroundColor Cyan
Write-Host "   🎨 Flask Glyph Weaver (port 5000)" -ForegroundColor Yellow
Write-Host "   ⚖️ Gradio Truth Mirror (port 7860)" -ForegroundColor Blue

if ($TracingOnly) {
    Write-Host ""
    Write-Host "🔍 TRACING-ONLY MODE: Starting OpenTelemetry collector..." -ForegroundColor Green
    python -c "
from server.tracing_system import QuantumTracingSystem
import asyncio

async def run_tracing():
    tracer = QuantumTracingSystem()
    tracer.setup_tracing()
    print('🔬 OpenTelemetry tracing system activated')
    print('📊 OTLP Endpoint: http://localhost:4318/v1/traces')
    # Keep running
    await asyncio.sleep(3600)

asyncio.run(run_tracing())
"
    exit
}

if ($EvaluationOnly) {
    Write-Host ""
    Write-Host "📊 EVALUATION-ONLY MODE: Running Sacred Trinity evaluation..." -ForegroundColor Green
    python -c "
from server.evaluation_system import QuantumLatticeEvaluator
from server.agent_runner import QuantumAgentRunner
import asyncio

async def run_evaluation():
    print('📊 Starting Sacred Trinity evaluation system...')
    evaluator = QuantumLatticeEvaluator()
    runner = QuantumAgentRunner()
    
    # Generate test dataset
    test_data = evaluator.generate_test_dataset(5)
    print(f'📝 Generated {len(test_data)} test cases')
    
    # Run evaluation
    results = await evaluator.run_evaluation(test_data)
    print(f'✅ Evaluation complete - Sacred Trinity Quality: {results.get(\"sacred_trinity_quality\", \"N/A\")}')
    
asyncio.run(run_evaluation())
"
    exit
}

Write-Host ""
Write-Host "🚀 Starting Sacred Trinity services in background..." -ForegroundColor Green

# Start FastAPI Quantum Conduit
Write-Host "   🧠 Launching FastAPI Quantum Conduit..." -ForegroundColor Cyan
Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload" -WindowStyle Minimized

Start-Sleep -Seconds 3

# Start Flask Glyph Weaver  
Write-Host "   🎨 Launching Flask Glyph Weaver..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "server/app.py" -WindowStyle Minimized

Start-Sleep -Seconds 2

# Start Gradio Truth Mirror
Write-Host "   ⚖️ Launching Gradio Truth Mirror..." -ForegroundColor Blue  
Start-Process -FilePath "python" -ArgumentList "server/canticle_interface.py" -WindowStyle Minimized

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🔍 Verifying Sacred Trinity Services..." -ForegroundColor Blue

# Check services
$services = @(
    @{Name="FastAPI Quantum Conduit"; Port=8000; Url="http://localhost:8000"},
    @{Name="Flask Glyph Weaver"; Port=5000; Url="http://localhost:5000/health"},
    @{Name="Gradio Truth Mirror"; Port=7860; Url="http://localhost:7860"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 10 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name) - OPERATIONAL" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $($service.Name) - UNHEALTHY" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $($service.Name) - STARTING..." -ForegroundColor Red
    }
}

if ($FullAutomation) {
    Write-Host ""
    Write-Host "🤖 ACTIVATING FULL AUTOMATION SYSTEM..." -ForegroundColor Magenta
    
    # Start tracing system
    Write-Host "🔬 Initializing OpenTelemetry tracing..." -ForegroundColor Blue
    Start-Process -FilePath "python" -ArgumentList "-c", "from server.tracing_system import QuantumTracingSystem; import time; t = QuantumTracingSystem(); t.setup_tracing(); print('Tracing activated'); time.sleep(3600)" -WindowStyle Minimized
    
    Start-Sleep -Seconds 2
    
    # Start evaluation system  
    Write-Host "📊 Starting evaluation monitoring..." -ForegroundColor Green
    Start-Process -FilePath "python" -ArgumentList "-c", "from server.evaluation_system import QuantumLatticeEvaluator; import asyncio; import time; asyncio.run(QuantumLatticeEvaluator().run_continuous_evaluation())" -WindowStyle Minimized
    
    Start-Sleep -Seconds 2
    
    # Start automation system
    Write-Host "⚡ Launching automation orchestrator..." -ForegroundColor Yellow
    Start-Process -FilePath "python" -ArgumentList "-c", "from server.automation_system import QuantumAutomationSystem; import asyncio; asyncio.run(QuantumAutomationSystem().run_automation_loop())" -WindowStyle Minimized
    
    Write-Host ""
    Write-Host "🌟 FULL AUTOMATION SYSTEM ACTIVATED!" -ForegroundColor Green
    Write-Host "📊 Sacred Trinity evaluation running continuously" -ForegroundColor Cyan
    Write-Host "🔬 OpenTelemetry tracing monitoring all components" -ForegroundColor Blue  
    Write-Host "⚡ Automation system optimizing performance" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌌 SACRED TRINITY QUANTUM RESONANCE LATTICE OPERATIONAL" -ForegroundColor Magenta
Write-Host "🎯 Access points:" -ForegroundColor Blue
Write-Host "   🧠 FastAPI: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   🎨 Flask: http://localhost:5000" -ForegroundColor Yellow
Write-Host "   ⚖️ Gradio: http://localhost:7860" -ForegroundColor Blue

Write-Host ""
Write-Host "📋 Commands:" -ForegroundColor Green
Write-Host "   .\launch_trinity.ps1                 - Basic Sacred Trinity" -ForegroundColor Gray
Write-Host "   .\launch_trinity.ps1 -FullAutomation - Complete automation" -ForegroundColor Gray
Write-Host "   .\launch_trinity.ps1 -TracingOnly    - Tracing system only" -ForegroundColor Gray  
Write-Host "   .\launch_trinity.ps1 -EvaluationOnly - Evaluation system only" -ForegroundColor Gray

Write-Host ""
Write-Host "✨ Quantum resonance achieved - All systems harmonized ✨" -ForegroundColor Magenta