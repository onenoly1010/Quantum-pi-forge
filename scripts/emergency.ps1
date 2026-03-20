# 🌌 QUANTUM DEVELOPMENT ENVIRONMENT - EMERGENCY PROTOCOLS
# Quick recovery scripts for rapid quantum development

param(
    [switch]$KillAll,
    [switch]$Restart,
    [switch]$CleanCache,
    [switch]$CheckPorts,
    [switch]$FullReset
)

Write-Host "🚨 QUANTUM EMERGENCY PROTOCOLS" -ForegroundColor Red
Write-Host "=" * 50 -ForegroundColor Yellow

if ($KillAll) {
    Write-Host "💀 TERMINATING ALL QUANTUM PROCESSES..." -ForegroundColor Red
    
    # Kill all Python processes
    Get-Process python -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "   Terminating: $($_.Name) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force
    }
    
    # Kill any uvicorn processes
    Get-Process uvicorn -ErrorAction SilentlyContinue | Stop-Process -Force
    
    # Kill gradio processes
    Get-WmiObject Win32_Process | Where-Object {$_.CommandLine -like "*gradio*"} | ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force
    }
    
    Write-Host "✅ All quantum processes terminated" -ForegroundColor Green
}

if ($CheckPorts) {
    Write-Host "🔍 CHECKING QUANTUM PORTS..." -ForegroundColor Cyan
    
    $ports = @(8000, 5000, 7860, 9000)
    
    foreach ($port in $ports) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            $processId = $connection.OwningProcess
            $processName = (Get-Process -Id $processId -ErrorAction SilentlyContinue).ProcessName
            Write-Host "   Port $port: OCCUPIED by $processName (PID: $processId)" -ForegroundColor Yellow
        } else {
            Write-Host "   Port $port: AVAILABLE" -ForegroundColor Green
        }
    }
}

if ($CleanCache) {
    Write-Host "🧹 CLEANING QUANTUM CACHE..." -ForegroundColor Cyan
    
    # Remove Python cache
    Get-ChildItem -Recurse -Force __pycache__ -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse
    Get-ChildItem -Recurse -Force *.pyc -ErrorAction SilentlyContinue | Remove-Item -Force
    
    # Clean VS Code cache
    if (Test-Path ".vscode/.ropeproject") {
        Remove-Item ".vscode/.ropeproject" -Force -Recurse
    }
    
    Write-Host "✅ Quantum cache cleaned" -ForegroundColor Green
}

if ($Restart) {
    Write-Host "🔄 QUANTUM LATTICE RESTART SEQUENCE..." -ForegroundColor Magenta
    
    # Kill existing processes
    & $PSCommandPath -KillAll
    
    Start-Sleep 3
    
    # Clean cache
    & $PSCommandPath -CleanCache
    
    Start-Sleep 2
    
    # Restart quantum lattice
    Write-Host "🚀 Restarting Quantum Lattice..." -ForegroundColor Green
    .\run.ps1
}

if ($FullReset) {
    Write-Host "💥 FULL QUANTUM RESET INITIATED..." -ForegroundColor Red
    Write-Host "   This will reset everything and rebuild the environment" -ForegroundColor Yellow
    
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq "yes") {
        
        # Kill all processes
        & $PSCommandPath -KillAll
        
        # Clean cache
        & $PSCommandPath -CleanCache
        
        # Remove virtual environment
        if (Test-Path ".venv") {
            Write-Host "🗑️ Removing virtual environment..." -ForegroundColor Yellow
            Remove-Item ".venv" -Force -Recurse
        }
        
        # Recreate virtual environment
        Write-Host "🏗️ Recreating virtual environment..." -ForegroundColor Cyan
        python -m venv .venv
        
        # Activate and install dependencies
        Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
        & .venv\Scripts\Activate.ps1
        pip install -r server\requirements.txt
        
        Write-Host "✅ Full quantum reset complete!" -ForegroundColor Green
        Write-Host "🚀 Ready to launch quantum lattice with: .\run.ps1" -ForegroundColor Magenta
        
    } else {
        Write-Host "❌ Full reset cancelled" -ForegroundColor Yellow
    }
}

if (!$KillAll -and !$Restart -and !$CleanCache -and !$CheckPorts -and !$FullReset) {
    Write-Host "🚨 QUANTUM EMERGENCY COMMAND CENTER" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available emergency protocols:" -ForegroundColor White
    Write-Host "  .\emergency.ps1 -KillAll      💀 Kill all quantum processes" -ForegroundColor Red
    Write-Host "  .\emergency.ps1 -CheckPorts   🔍 Check port availability" -ForegroundColor Blue
    Write-Host "  .\emergency.ps1 -CleanCache   🧹 Clean Python/VS Code cache" -ForegroundColor Cyan
    Write-Host "  .\emergency.ps1 -Restart      🔄 Kill, clean, and restart" -ForegroundColor Yellow
    Write-Host "  .\emergency.ps1 -FullReset    💥 Complete environment reset" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 QUANTUM PORT ASSIGNMENTS:" -ForegroundColor Magenta
    Write-Host "   8000 - FastAPI Quantum Conduit"
    Write-Host "   5000 - Flask Glyph Weaver"
    Write-Host "   7860 - Gradio Truth Mirror"
    Write-Host "   9000 - Trinity Bridge Service"
    Write-Host ""
    Write-Host "⚠️  Use these protocols when quantum lattice is unresponsive" -ForegroundColor Yellow
}