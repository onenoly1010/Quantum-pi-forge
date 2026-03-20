#!/usr/bin/env pwsh
# 🌌 Quantum Resonance Lattice - Docker Development Environment
# Sacred Trinity containerized development setup

param(
    [switch]$Build,
    [switch]$Up,
    [switch]$Down,
    [switch]$Logs,
    [switch]$Clean,
    [string]$Service = "all"
)

$ErrorActionPreference = "Stop"

function Write-QuantumHeader {
    Write-Host "🌌 QUANTUM RESONANCE LATTICE - DOCKER DEVELOPMENT" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

function Test-Docker {
    try {
        $null = docker --version
        Write-Host "✅ Docker is available" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker is not installed or not running" -ForegroundColor Red
        Write-Host "   Please install Docker Desktop and ensure it's running" -ForegroundColor Yellow
        return $false
    }
}

function Test-DockerCompose {
    try {
        $null = docker-compose --version
        Write-Host "✅ Docker Compose is available" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker Compose is not available" -ForegroundColor Red
        return $false
    }
}

function Test-EnvironmentFile {
    if (!(Test-Path ".env")) {
        Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
        Write-Host "   Copy .env.example to .env and configure your environment variables" -ForegroundColor Yellow
        return $false
    }
    Write-Host "✅ Environment file found" -ForegroundColor Green
    return $true
}

function Invoke-DockerBuild {
    Write-Host "🏗️  Building Sacred Trinity containers..." -ForegroundColor Blue
    try {
        docker-compose build
        Write-Host "✅ Build completed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Build failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

function Invoke-DockerUp {
    Write-Host "🚀 Starting Sacred Trinity services..." -ForegroundColor Blue
    try {
        if ($Service -eq "all") {
            docker-compose up -d
        }
        else {
            docker-compose up -d $Service
        }
        Write-Host "✅ Services started successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Service Endpoints:" -ForegroundColor Cyan
        Write-Host "   FastAPI Quantum Conduit: http://localhost:8000" -ForegroundColor White
        Write-Host "   Flask Glyph Weaver:      http://localhost:5000" -ForegroundColor White
        Write-Host "   Gradio Truth Mirror:     http://localhost:7860" -ForegroundColor White
        Write-Host "   OTLP Collector:          http://localhost:4318" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Health Checks:" -ForegroundColor Cyan
        Write-Host "   FastAPI: curl http://localhost:8000/health" -ForegroundColor White
        Write-Host "   Flask:   curl http://localhost:5000/health" -ForegroundColor White
        Write-Host ""
        Write-Host "🔍 View logs: .\docker-dev.ps1 -Logs" -ForegroundColor Yellow
        Write-Host "🛑  Stop services: .\docker-dev.ps1 -Down" -ForegroundColor Yellow
    }
    catch {
        Write-Host "❌ Failed to start services: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

function Invoke-DockerDown {
    Write-Host "🛑 Stopping Sacred Trinity services..." -ForegroundColor Blue
    try {
        docker-compose down
        Write-Host "✅ Services stopped successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to stop services: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Invoke-DockerLogs {
    Write-Host "📋 Showing Sacred Trinity service logs..." -ForegroundColor Blue
    try {
        if ($Service -eq "all") {
            docker-compose logs -f
        }
        else {
            docker-compose logs -f $Service
        }
    }
    catch {
        Write-Host "❌ Failed to show logs: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Invoke-DockerClean {
    Write-Host "🧹 Cleaning Docker environment..." -ForegroundColor Blue
    try {
        docker-compose down -v --remove-orphans
        docker system prune -f
        Write-Host "✅ Docker environment cleaned" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to clean environment: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Show-Help {
    Write-Host "🌌 Quantum Resonance Lattice - Docker Development Environment" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor White
    Write-Host "  .\docker-dev.ps1 [options]"
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor White
    Write-Host "  -Build          Build all containers"
    Write-Host "  -Up             Start all services"
    Write-Host "  -Down           Stop all services"
    Write-Host "  -Logs           Show service logs"
    Write-Host "  -Clean          Clean Docker environment"
    Write-Host "  -Service <name> Target specific service (fastapi, flask, gradio, otlp-collector)"
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor White
    Write-Host "  .\docker-dev.ps1 -Build -Up          # Build and start all services"
    Write-Host "  .\docker-dev.ps1 -Up                 # Start all services (if already built)"
    Write-Host "  .\docker-dev.ps1 -Logs -Service fastapi  # Show FastAPI logs only"
    Write-Host "  .\docker-dev.ps1 -Down               # Stop all services"
    Write-Host "  .\docker-dev.ps1 -Clean              # Clean environment"
    Write-Host ""
    Write-Host "SERVICES:" -ForegroundColor White
    Write-Host "  fastapi        - Quantum Conduit (port 8000)"
    Write-Host "  flask          - Glyph Weaver (port 5000)"
    Write-Host "  gradio         - Truth Mirror (port 7860)"
    Write-Host "  otlp-collector - OpenTelemetry Collector"
    Write-Host "  redis          - Caching (optional)"
    Write-Host "  postgres       - Local database (optional)"
}

# Main execution
Write-QuantumHeader

if ($args.Count -eq 0 -or $PSBoundParameters.ContainsKey('Help')) {
    Show-Help
    exit 0
}

# Pre-flight checks
if (!(Test-Docker)) { exit 1 }
if (!(Test-DockerCompose)) { exit 1 }
Test-EnvironmentFile

# Execute requested actions
if ($Build) { Invoke-DockerBuild }
if ($Up) { Invoke-DockerUp }
if ($Down) { Invoke-DockerDown }
if ($Logs) { Invoke-DockerLogs }
if ($Clean) { Invoke-DockerClean }

Write-Host ""
Write-Host "✨ Quantum Resonance Lattice Docker operations complete!" -ForegroundColor Green