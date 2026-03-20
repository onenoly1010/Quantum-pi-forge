# 🐳 Sacred Trinity Docker Development Guide

## 🌌 Quantum Resonance Lattice - Containerized Development

This guide covers the complete Docker-based development environment for the Sacred Trinity Quantum Resonance Lattice.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (latest version)
- PowerShell 5.1+ (Windows)
- Git

### Environment Setup
```powershell
# Clone the repository
git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.git
cd pi-forge-quantum-genesis

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
notepad .env
```

### Launch the Lattice
```powershell
# Build and start all services
.\docker-dev.ps1 -Build -Up
```

### Verify Deployment
```powershell
# Check service health
.\docker-dev.ps1 -Logs

# Open services in browser
start http://localhost:8000  # FastAPI Quantum Conduit
start http://localhost:5000  # Flask Glyph Weaver
start http://localhost:7860  # Gradio Truth Mirror
```

## 🏗️ Architecture Overview

### Service Trinity
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ FastAPI         │    │ Flask           │    │ Gradio          │
│ Quantum Conduit │    │ Glyph Weaver    │    │ Truth Mirror    │
│ Port: 8000      │    │ Port: 5000      │    │ Port: 7860      │
│                 │    │                 │    │                 │
│ • Auth & WS     │    │ • Visualization │    │ • Ethics Audit  │
│ • Supabase      │    │ • SVG Generation│    │ • AI Evaluation │
│ • Payments      │    │ • Dashboard     │    │ • Veto Triad    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ OTLP Collector │
                    │ Port: 4318     │
                    │                │
                    │ • Tracing      │
                    │ • Metrics      │
                    │ • Logging      │
                    └─────────────────┘
```

### Supporting Services
- **Redis**: Caching and session storage
- **PostgreSQL**: Optional database (for advanced features)
- **OpenTelemetry Collector**: Centralized observability

## 🛠️ Development Workflow

### Daily Development
```powershell
# Start development environment
.\docker-dev.ps1 -Up

# View real-time logs
.\docker-dev.ps1 -Logs -Follow

# Stop all services
.\docker-dev.ps1 -Down
```

### Code Changes
```powershell
# Services auto-reload on code changes
# Edit files in server/ directory
# Changes reflect immediately in containers
```

### Debugging
```powershell
# Access container shell
docker exec -it quantum-lattice-fastapi-1 /bin/bash

# View specific service logs
docker logs quantum-lattice-fastapi-1

# Check container health
docker ps
```

## 🔧 Configuration

### Environment Variables
Create `.env` file with:
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# JWT Configuration
JWT_SECRET=your-secure-random-string

# Development Settings
DEBUG=true
LOG_LEVEL=INFO

# Optional: Database
POSTGRES_HOST=postgres
POSTGRES_DB=quantum_lattice
POSTGRES_USER=developer
POSTGRES_PASSWORD=password
```

### Service Configuration
- **FastAPI**: `server/main.py` - Primary application logic
- **Flask**: `server/app.py` - Visualization and legacy routes
- **Gradio**: `server/canticle_interface.py` - Ethical audit interface

## 📊 Monitoring & Observability

### Tracing
```powershell
# View traces in VS Code
# Use command: ai-mlstudio.tracing.open

# OTLP Collector endpoints:
# gRPC: localhost:4317
# HTTP: localhost:4318
```

### Health Checks
```powershell
# Check all services
curl http://localhost:8000/health
curl http://localhost:5000/health
# Gradio health via interface
```

### Logs
```powershell
# View all logs
.\docker-dev.ps1 -Logs

# View specific service
docker logs quantum-lattice-fastapi-1 -f
```

## 🧪 Testing

### Run Tests
```powershell
# Run in container
docker exec quantum-lattice-fastapi-1 python -m pytest tests/ -v

# Or use the task
# Run Quantum Tests task in VS Code
```

### Integration Testing
```powershell
# Test cross-service communication
# 1. Authenticate via FastAPI
# 2. Access Flask dashboard
# 3. Verify Gradio interface
```

## 🚢 Production Deployment

### Railway Deployment
```powershell
# Push to GitHub with Docker setup
git add .
git commit -m "Docker development environment"
git push origin main

# Railway auto-deploys using Dockerfile
# Set environment variables in Railway dashboard
```

### Docker Production
```bash
# Build production image
docker build -t quantum-lattice:latest .

# Run production container
docker run -p 8000:8000 \
  -e SUPABASE_URL=$SUPABASE_URL \
  -e SUPABASE_KEY=$SUPABASE_KEY \
  quantum-lattice:latest
```

## 🐛 Troubleshooting

### Common Issues

**Services won't start:**
```powershell
# Check Docker resources
docker system df

# Clean and rebuild
.\docker-dev.ps1 -Clean
.\docker-dev.ps1 -Build -Up
```

**Port conflicts:**
```powershell
# Check what's using ports
netstat -ano | findstr :8000

# Change ports in docker-compose.yml
```

**Environment variables:**
```powershell
# Validate .env file
Get-Content .env

# Check container environment
docker exec quantum-lattice-fastapi-1 env
```

### Performance Issues
```powershell
# Monitor resource usage
docker stats

# Check container logs for errors
.\docker-dev.ps1 -Logs
```

## 🔄 Development Commands Reference

```powershell
# Complete workflow
.\docker-dev.ps1 -Build -Up          # Build and start
.\docker-dev.ps1 -Logs -Follow       # Monitor logs
.\docker-dev.ps1 -Down               # Stop services
.\docker-dev.ps1 -Clean              # Clean environment

# Individual operations
.\docker-dev.ps1 -Build              # Build images only
.\docker-dev.ps1 -Up                 # Start services only
.\docker-dev.ps1 -Logs               # Show logs
.\docker-dev.ps1 -Down               # Stop services
.\docker-dev.ps1 -Clean              # Remove containers/images
```

## 🌟 Advanced Features

### Custom Development
- **Hot Reload**: Enabled for all Python services
- **Volume Mounts**: Source code changes reflect immediately
- **Network Isolation**: Services communicate via Docker network
- **Observability**: Full tracing and metrics collection

### Scaling
```powershell
# Scale services
docker-compose up -d --scale fastapi=3

# Load balancing with nginx
# Add nginx service to docker-compose.yml
```

### CI/CD Integration
```yaml
# .github/workflows/docker.yml
name: Docker Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build Docker image
      run: docker build -t quantum-lattice .
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenTelemetry](https://opentelemetry.io/)
- [Supabase Documentation](https://supabase.com/docs)

## 🎯 Next Steps

1. **Explore the Trinity**: Visit each service endpoint
2. **Make Changes**: Edit code and see hot reload in action
3. **Add Tracing**: Implement custom spans in your code
4. **Deploy**: Push to Railway or your preferred platform

---

*Welcome to the Quantum Resonance Lattice - where consciousness meets containerization!* 🌌✨