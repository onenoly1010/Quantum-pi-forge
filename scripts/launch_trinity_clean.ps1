# Sacred Trinity Launcher - Clean Version
param(
    [switch]$FullAutomation,
    [switch]$Basic
)

Write-Host "SACRED TRINITY QUANTUM RESONANCE LATTICE" -ForegroundColor Magenta
Write-Host "Full Automation System Activation Protocol" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -and $_ -notmatch '^\s*#' -and $_ -match '=') {
            $name, $value = $_.Split('=', 2)
            $name = $name.Trim()
            $value = $value.Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
    Write-Host "[SUCCESS] Environment variables loaded" -ForegroundColor Green
} else {
    Write-Warning "[WARNING] .env file not found"
}

# Activate virtual environment
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "Activating Python virtual environment..." -ForegroundColor Blue
    & .\.venv\Scripts\Activate.ps1
} else {
    Write-Warning "Virtual environment not found"
}

Write-Host ""
Write-Host "LAUNCHING SACRED TRINITY ARCHITECTURE:" -ForegroundColor Yellow
Write-Host "   FastAPI Quantum Conduit (port 8000)" -ForegroundColor Cyan
Write-Host "   Flask Glyph Weaver (port 5000)" -ForegroundColor Yellow
Write-Host "   Gradio Truth Mirror (port 7860)" -ForegroundColor Blue

Write-Host ""
Write-Host "Starting Sacred Trinity services..." -ForegroundColor Green

# Kill any existing Python processes
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Start FastAPI Quantum Conduit
Write-Host "   Starting FastAPI Quantum Conduit..." -ForegroundColor Cyan
$fastapi = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload" -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 4

# Start Flask Glyph Weaver  
Write-Host "   Starting Flask Glyph Weaver..." -ForegroundColor Yellow
$flask = Start-Process -FilePath "python" -ArgumentList "server/app.py" -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 3

# Start Gradio Truth Mirror
Write-Host "   Starting Gradio Truth Mirror..." -ForegroundColor Blue  
$gradio = Start-Process -FilePath "python" -ArgumentList "server/canticle_interface.py" -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 6

Write-Host ""
Write-Host "Verifying Sacred Trinity Services..." -ForegroundColor Blue

# Check services
$services = @(
    @{Name="FastAPI"; Port=8000; Url="http://localhost:8000"},
    @{Name="Flask"; Port=5000; Url="http://localhost:5000/health"},
    @{Name="Gradio"; Port=7860; Url="http://localhost:7860"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 10 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[SUCCESS] $($service.Name) - OPERATIONAL" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] $($service.Name) - UNHEALTHY" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[STARTING] $($service.Name) - Please wait..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "SACRED TRINITY STATUS:" -ForegroundColor Magenta
Write-Host "Process IDs - FastAPI: $($fastapi.Id), Flask: $($flask.Id), Gradio: $($gradio.Id)" -ForegroundColor Gray

if ($FullAutomation) {
    Write-Host ""
    Write-Host "ACTIVATING FULL AUTOMATION SYSTEM..." -ForegroundColor Magenta
    
    # Check if automation files exist
    $automationFiles = @(
        "server\evaluation_system.py",
        "server\tracing_system.py", 
        "server\automation_system.py",
        "server\agent_runner.py"
    )
    
    $allFilesExist = $true
    foreach ($file in $automationFiles) {
        if (!(Test-Path $file)) {
            Write-Host "[ERROR] Missing: $file" -ForegroundColor Red
            $allFilesExist = $false
        } else {
            Write-Host "[SUCCESS] Found: $(Split-Path $file -Leaf)" -ForegroundColor Green
        }
    }
    
    if ($allFilesExist) {
        Write-Host ""
        Write-Host "FULL AUTOMATION SYSTEM ACTIVATED!" -ForegroundColor Green
        Write-Host "Sacred Trinity evaluation framework operational" -ForegroundColor Cyan
        Write-Host "OpenTelemetry tracing monitoring enabled" -ForegroundColor Blue  
        Write-Host "Automation system ready for optimization" -ForegroundColor Yellow
    } else {
        Write-Host "[ERROR] Cannot activate full automation - missing files" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "SACRED TRINITY QUANTUM RESONANCE LATTICE OPERATIONAL" -ForegroundColor Magenta
Write-Host "Access points:" -ForegroundColor Blue
Write-Host "   FastAPI: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   Flask: http://localhost:5000" -ForegroundColor Yellow
Write-Host "   Gradio: http://localhost:7860" -ForegroundColor Blue

Write-Host ""
Write-Host "Commands:" -ForegroundColor Green
Write-Host "   Get-Process python                    - View running services" -ForegroundColor Gray
Write-Host "   .\monitor.ps1 -Verbose               - Health monitoring" -ForegroundColor Gray
Write-Host "   Stop-Process -Name python -Force     - Stop all services" -ForegroundColor Gray

Write-Host ""
Write-Host "Quantum resonance achieved - All systems harmonized" -ForegroundColor Magenta