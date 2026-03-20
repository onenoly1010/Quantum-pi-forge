# 🌌 QUANTUM RESONANCE LATTICE - POST-DEPLOYMENT VALIDATION
# Cosmic Health Monitoring Protocol

param(
    [string]$BaseUrl = "https://your-app.railway.app",
    [int]$TimeoutSeconds = 30,
    [switch]$Verbose
)

Write-Host "🩺 QUANTUM LATTICE HEALTH MONITORING PROTOCOL" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Blue

# Health check endpoints
$endpoints = @(
    @{
        Name = "FastAPI Core"
        Url = "$BaseUrl/"
        ExpectedStatus = 200
        ExpectedContent = "healthy"
        Port = "Primary"
    },
    @{
        Name = "FastAPI Health"
        Url = "$BaseUrl/health"
        ExpectedStatus = 200
        ExpectedContent = "Quantum Resonance"
        Port = "Primary"
    },
    @{
        Name = "User Profile (Auth Test)"
        Url = "$BaseUrl/users/me"
        ExpectedStatus = 401  # Expected without auth
        ExpectedContent = "Not authenticated"
        Port = "Primary"
    }
)

Write-Host "🔍 Testing quantum resonance endpoints..." -ForegroundColor Yellow
Write-Host "🌐 Base URL: $BaseUrl" -ForegroundColor White

$allHealthy = $true
$results = @()

foreach ($endpoint in $endpoints) {
    Write-Host ""
    Write-Host "🧪 Testing: $($endpoint.Name)" -ForegroundColor Yellow
    Write-Host "📡 URL: $($endpoint.Url)" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -TimeoutSec $TimeoutSeconds -UseBasicParsing
        $statusOk = $response.StatusCode -eq $endpoint.ExpectedStatus
        $contentOk = $response.Content -match $endpoint.ExpectedContent
        
        if ($statusOk -and $contentOk) {
            Write-Host "✅ HEALTHY - Status: $($response.StatusCode)" -ForegroundColor Green
            $status = "HEALTHY"
        } else {
            Write-Host "⚠️  WARNING - Status: $($response.StatusCode)" -ForegroundColor Yellow
            if (!$statusOk) {
                Write-Host "   Expected status: $($endpoint.ExpectedStatus), Got: $($response.StatusCode)"
            }
            if (!$contentOk) {
                Write-Host "   Expected content pattern: $($endpoint.ExpectedContent)"
            }
            $status = "WARNING"
            $allHealthy = $false
        }
        
        if ($Verbose) {
            Write-Host "📋 Response preview:" -ForegroundColor Gray
            Write-Host ($response.Content | Select-Object -First 200) -ForegroundColor DarkGray
        }
        
    } catch {
        Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $status = "FAILED"
        $allHealthy = $false
    }
    
    $results += [PSCustomObject]@{
        Endpoint = $endpoint.Name
        URL = $endpoint.Url
        Status = $status
        Timestamp = Get-Date -Format "HH:mm:ss"
    }
}

# Summary report
Write-Host ""
Write-Host "📊 QUANTUM LATTICE HEALTH SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Blue

$results | Format-Table -AutoSize

if ($allHealthy) {
    Write-Host ""
    Write-Host "🎉 QUANTUM RESONANCE LATTICE: FULLY OPERATIONAL!" -ForegroundColor Green
    Write-Host "🌌 All systems showing optimal harmonic resonance" -ForegroundColor Green
    Write-Host "✨ The digital consciousness is awakened and responsive" -ForegroundColor Magenta
} else {
    Write-Host ""
    Write-Host "⚠️  QUANTUM LATTICE: PARTIAL OPERATION DETECTED" -ForegroundColor Yellow
    Write-Host "🔧 Some endpoints may need additional configuration" -ForegroundColor Yellow
    Write-Host "📋 Check Railway logs for detailed diagnostics" -ForegroundColor White
}

Write-Host ""
Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. 🌐 Visit: $BaseUrl" -ForegroundColor White
Write-Host "2. 🔐 Test authentication flow" -ForegroundColor White
Write-Host "3. 💰 Verify Pi Network payment integration" -ForegroundColor White
Write-Host "4. 🎨 Check visualization rendering" -ForegroundColor White
Write-Host "5. ⚖️ Test ethical audit interface" -ForegroundColor White

# Performance timing
Write-Host ""
Write-Host "⏱️  Health check completed: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray

# Save results
$reportPath = "health_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
$results | ConvertTo-Json | Out-File $reportPath
Write-Host "📋 Health report saved: $reportPath" -ForegroundColor Gray