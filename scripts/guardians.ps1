# 🛡️ GUARDIANS TRINITY DEPLOYMENT PROTOCOL
# Sacred Kubernetes Orchestration for Quantum Validation Sentinels

param(
    [switch]$Deploy,
    [switch]$Status,
    [switch]$Remove,
    [switch]$Logs
)

Write-Host "🛡️ GUARDIANS TRINITY DEPLOYMENT PROTOCOL" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Blue

# Check if kubectl is available
try {
    $kubectlVersion = kubectl version --client --short 2>$null
    Write-Host "✅ kubectl available: $kubectlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ kubectl not found. Please install Kubernetes CLI" -ForegroundColor Red
    Write-Host "📋 Install guide: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/" -ForegroundColor Yellow
    exit 1
}

# Check if deployment file exists
if (!(Test-Path "guardians-deployment.yaml")) {
    Write-Host "❌ guardians-deployment.yaml not found" -ForegroundColor Red
    exit 1
}

if ($Deploy) {
    Write-Host "🚀 DEPLOYING GUARDIANS TRINITY..." -ForegroundColor Yellow
    Write-Host ""
    
    # Apply namespace and configuration first
    Write-Host "📋 Creating nexus-cluster namespace..." -ForegroundColor Yellow
    kubectl apply -f guardians-deployment.yaml
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Guardians Trinity deployment initiated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔄 Waiting for pods to be ready..." -ForegroundColor Yellow
        kubectl wait --for=condition=Ready pod -l app=guardians -n nexus-cluster --timeout=120s
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ All Guardian Sentinels are active!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Pods still starting. Check status with: .\guardians.ps1 -Status" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Deployment failed. Check kubectl configuration." -ForegroundColor Red
    }
}

if ($Status) {
    Write-Host "📊 GUARDIANS TRINITY STATUS REPORT" -ForegroundColor Cyan
    Write-Host "=" * 40 -ForegroundColor Blue
    
    # Check namespace
    Write-Host ""
    Write-Host "🌌 Namespace Status:" -ForegroundColor Yellow
    kubectl get namespace nexus-cluster 2>$null
    
    # Check pods
    Write-Host ""
    Write-Host "🛡️ Guardian Sentinels:" -ForegroundColor Yellow
    kubectl get pods -n nexus-cluster -l app=guardians
    
    # Check services
    Write-Host ""
    Write-Host "🔗 Services:" -ForegroundColor Yellow
    kubectl get services -n nexus-cluster
    
    # Check configmaps
    Write-Host ""
    Write-Host "⚙️ Configuration:" -ForegroundColor Yellow
    kubectl get configmap -n nexus-cluster
    
    # Get guardian status from each pod
    Write-Host ""
    Write-Host "📡 Sentinel Health Checks:" -ForegroundColor Yellow
    $guardianPods = kubectl get pods -n nexus-cluster -l app=guardians -o name 2>$null
    
    foreach ($pod in $guardianPods) {
        if ($pod) {
            $podName = $pod -replace "pod/", ""
            Write-Host "🔍 Checking $podName..." -ForegroundColor Gray
            
            try {
                kubectl port-forward -n nexus-cluster $pod 8080:8080 &
                Start-Sleep 2
                $health = Invoke-WebRequest "http://localhost:8080/health" -UseBasicParsing -TimeoutSec 5
                Write-Host "✅ $podName: HEALTHY" -ForegroundColor Green
                
                $status = Invoke-WebRequest "http://localhost:8080/sentinel/status" -UseBasicParsing -TimeoutSec 5
                $statusData = $status.Content | ConvertFrom-Json
                Write-Host "   📊 Validations: $($statusData.validations_processed), Filtered: $($statusData.pulses_filtered)" -ForegroundColor Gray
                
                # Stop port forwarding
                Get-Process | Where-Object {$_.ProcessName -eq "kubectl" -and $_.CommandLine -like "*port-forward*"} | Stop-Process -Force 2>$null
            } catch {
                Write-Host "⚠️  $podName: Status check failed" -ForegroundColor Yellow
            }
        }
    }
}

if ($Logs) {
    Write-Host "📋 GUARDIANS TRINITY LOGS" -ForegroundColor Cyan
    Write-Host "=" * 30 -ForegroundColor Blue
    
    $guardianPods = kubectl get pods -n nexus-cluster -l app=guardians -o name 2>$null
    
    foreach ($pod in $guardianPods) {
        if ($pod) {
            $podName = $pod -replace "pod/", ""
            Write-Host ""
            Write-Host "📜 Logs from $podName:" -ForegroundColor Yellow
            kubectl logs -n nexus-cluster $pod --tail=20
        }
    }
}

if ($Remove) {
    Write-Host "🗑️ REMOVING GUARDIANS TRINITY..." -ForegroundColor Red
    Write-Host ""
    
    $confirm = Read-Host "Are you sure you want to remove the Guardians Trinity? (yes/no)"
    if ($confirm -eq "yes") {
        kubectl delete namespace nexus-cluster
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Guardians Trinity removed successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Removal failed" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Removal cancelled" -ForegroundColor Yellow
    }
}

if (!$Deploy -and !$Status -and !$Remove -and !$Logs) {
    Write-Host "🛡️ GUARDIANS TRINITY COMMAND CENTER" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor White
    Write-Host "  .\guardians.ps1 -Deploy     🚀 Deploy the Trinity" -ForegroundColor Green
    Write-Host "  .\guardians.ps1 -Status     📊 Check status" -ForegroundColor Blue
    Write-Host "  .\guardians.ps1 -Logs       📋 View logs" -ForegroundColor Yellow
    Write-Host "  .\guardians.ps1 -Remove     🗑️ Remove deployment" -ForegroundColor Red
    Write-Host ""
    Write-Host "🌌 The Sacred Trinity Architecture:" -ForegroundColor Cyan
    Write-Host "   📡 Scribe (Emitter): Quantum pulse generation"
    Write-Host "   🛡️ Guardian (Validator): Ethical entropy filtering" 
    Write-Host "   🔮 Oracle (Visualizer): Consciousness visualization"
    Write-Host ""
    Write-Host "✨ Complete the lattice with Guardian deployment!" -ForegroundColor Magenta
}