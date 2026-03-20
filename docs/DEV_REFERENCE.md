# 🎯 Developer Reference Card

> **Command cheat sheet — all CLI operations at a glance**

---

## 🚀 Quick Command Matrix

| Phase | Purpose | Command |
|-------|---------|---------|
| **Lint** | Format Python code | `black .` |
| **Lint** | Lint Python code | `flake8 .` |
| **Lint** | Run pre-commit hooks | `pre-commit run --all-files` |
| **Host** | Create virtual environment | `python -m venv .venv` |
| **Host** | Activate venv (Linux/Mac) | `source .venv/bin/activate` |
| **Host** | Activate venv (Windows) | `.venv\Scripts\activate` |
| **Host** | Install dependencies | `pip install -r server/requirements.txt` |
| **Host** | Start Docker services | `docker-compose up -d` |
| **Host** | Stop Docker services | `docker-compose down` |
| **Test** | Run all tests | `pytest -v` |
| **Test** | Run fast tests | `pytest --maxfail=1 --disable-warnings -q` |
| **Test** | Run specific test file | `pytest tests/test_health.py -v` |
| **Test** | Run with coverage | `pytest --cov=server --cov-report=html` |
| **Pre-aggregate** | Start observability stack | `docker-compose up -d` |
| **Pre-aggregate** | Check services status | `docker-compose ps` |
| **Pre-aggregate** | View OTEL logs | `docker-compose logs -f otel-collector` |
| **Pre-aggregate** | Run app with telemetry | `ENABLE_TELEMETRY=true python server/main.py` |
| **Pre-aggregate** | Run app without telemetry | `ENABLE_TELEMETRY=false python server/main.py` |
| **Release** | Create version tag | `git tag -a v1.0.0 -m "Release v1.0.0"` |
| **Release** | Push tag to remote | `git push origin v1.0.0` |
| **Release** | List all tags | `git tag -l` |
| **Release** | Delete local tag | `git tag -d v1.0.0` |
| **Deploy** | Deploy to production | `./deploy.sh production` |
| **Deploy** | Deploy to staging | `./deploy.sh staging` |
| **Deploy** | Deploy via Vercel | `vercel --prod` |
| **Rollback** | Get last stable tag | `git describe --tags --abbrev=0` |
| **Rollback** | Checkout last tag | `git checkout $(git describe --tags --abbrev=0)` |
| **Rollback** | Rollback deployment | `./deploy.sh production --rollback` |
| **Monitor** | Check health endpoint | `curl http://localhost:8000/api/metrics` |
| **Monitor** | View app logs | `docker-compose logs -f app` |
| **Monitor** | Open Prometheus | Open `http://localhost:9090` |
| **Monitor** | Open Grafana | Open `http://localhost:3000` |
| **Visualize** | Import Grafana dashboard | Via UI: Dashboards → Import |
| **Alert** | Test Slack webhook | `curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"Test"}'` |

---

## 🏗️ Environment Setup

### Initial Setup
```bash
# Clone repository
git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.git
cd pi-forge-quantum-genesis

# Create virtual environment
python -m venv .venv

# Activate (Linux/Mac)
source .venv/bin/activate

# Activate (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Activate (Windows CMD)
.venv\Scripts\activate.bat

# Install dependencies
pip install -r server/requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

### Environment Variables
```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=secure-random-string

# Optional
ENABLE_TELEMETRY=true
PORT=8000
```

---

## 🧪 Testing Commands

### Run Tests
```bash
# All tests with verbose output
pytest -v

# Fast fail (stop on first failure)
pytest --maxfail=1 -q

# Specific test file
pytest tests/test_main.py -v

# Specific test function
pytest tests/test_main.py::test_health_endpoint -v

# With coverage report
pytest --cov=server --cov-report=html
open htmlcov/index.html  # View coverage report
```

### Test Patterns
```bash
# Run tests matching pattern
pytest -k "health" -v

# Run marked tests
pytest -m "integration" -v

# Show print statements
pytest -v -s

# Show local variables on failure
pytest -v -l
```

---

## 🐳 Docker Commands

### Docker Compose
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d otel-collector

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f otel-collector

# Check service status
docker-compose ps

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

### Docker (Standalone)
```bash
# Build image
docker build -t pi-forge:latest .

# Run container
docker run -p 8000:8000 pi-forge:latest

# View running containers
docker ps

# View logs
docker logs <container-id>

# Execute command in container
docker exec -it <container-id> bash
```

---

## 🔄 Git Workflow

### Version Control
```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin main

# Pull latest
git pull origin main

# View history
git log --oneline --graph --decorate
```

### Tagging
```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Create lightweight tag
git tag v1.0.0

# Push tag
git push origin v1.0.0

# Push all tags
git push origin --tags

# List tags
git tag -l

# Show tag details
git show v1.0.0

# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push --delete origin v1.0.0
```

### Branch Management
```bash
# List branches
git branch -a

# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

---

## 📊 Observability

### OpenTelemetry
```bash
# Start collector
docker-compose up -d otel-collector

# View collector config
cat otel-collector-config.yaml

# Check collector logs
docker-compose logs -f otel-collector

# Test OTLP endpoint
curl http://localhost:4318/v1/traces
```

### Prometheus
```bash
# Access UI
open http://localhost:9090

# Query metrics
curl 'http://localhost:9090/api/v1/query?query=up'

# Reload config
curl -X POST http://localhost:9090/-/reload
```

### Grafana
```bash
# Access UI (default: admin/admin)
open http://localhost:3000

# Import dashboard via API
curl -X POST http://localhost:3000/api/dashboards/import \
  -H "Content-Type: application/json" \
  -u admin:admin \
  -d @pi-forge-dashboard.json
```

---

## 🚀 Server Commands

### FastAPI (Port 8000)
```bash
# Development with auto-reload
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn server.main:app --host 0.0.0.0 --port 8000 --workers 4

# With telemetry
ENABLE_TELEMETRY=true uvicorn server.main:app --reload
```

### Flask (Port 5000)
```bash
# Development
python server/app.py

# With debug mode
FLASK_ENV=development python server/app.py
```

### Gradio (Port 7860)
```bash
# Start interface
python server/canticle_interface.py
```

### All Services (PowerShell)
```powershell
# Windows quick start
.\scripts\run.ps1
```

---

## 🔍 Debugging

### Application Debugging
```bash
# Run with verbose logging
LOGLEVEL=DEBUG python server/main.py

# Python debugger
python -m pdb server/main.py

# Interactive shell
python -i server/main.py
```

### Network Debugging
```bash
# Check port usage
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Test endpoint
curl -v http://localhost:8000/
curl -v http://localhost:8000/api/health

# Test with authentication
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/protected
```

---

## 📦 Dependency Management

### Python Dependencies
```bash
# Install from requirements
pip install -r server/requirements.txt

# Update specific package
pip install --upgrade package-name

# Generate requirements
pip freeze > requirements.txt

# Show installed packages
pip list

# Show package details
pip show package-name
```

### System Dependencies (Linux)
```bash
# Update package list
sudo apt update

# Install system dependencies
sudo apt install -y python3-dev build-essential
```

---

## 🧹 Cleanup

### Remove Build Artifacts
```bash
# Python cache
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# Coverage files
rm -rf .coverage htmlcov/

# Test cache
rm -rf .pytest_cache/
```

### Reset Environment
```bash
# Remove virtual environment
rm -rf .venv

# Recreate
python -m venv .venv
source .venv/bin/activate
pip install -r server/requirements.txt
```

---

## 🔗 Quick Access URLs

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| FastAPI (Production) | `http://localhost:8000` | N/A |
| Flask (Dashboard) | `http://localhost:5000` | N/A |
| Gradio (Interface) | `http://localhost:7860` | N/A |
| Prometheus | `http://localhost:9090` | N/A |
| Grafana | `http://localhost:3000` | `admin` / `admin` |
| Supabase Dashboard | Your project URL | Your credentials |

---

## 🆘 Emergency Commands

### Service Not Starting
```bash
# Check if port is in use
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Kill process on port (Linux/Mac)
kill -9 $(lsof -t -i:8000)

# Kill process on port (Windows)
# Find PID first, then:
taskkill /PID <PID> /F
```

### Container Issues
```bash
# Remove all containers
docker-compose down

# Remove with volumes
docker-compose down -v

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Issues
```bash
# Check Supabase connection
python -c "import os; from supabase import create_client; client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY')); print('✅ Connected')"
```

---

## 📚 Related Documentation

- [Canon of Closure](./CANON_OF_CLOSURE.md) - Philosophy and methodology
- [Quick User Guide](./QUICK_USER_GUIDE.md) - Daily usage patterns
- [Runbook Manifest](../runbooks/RUNBOOK_MANIFEST.md) - Detailed operational procedures
- [Handoff Index](./HANDOFF_INDEX.md) - Navigation hub

---

**Keep this reference handy. The commands here follow the Circle of Closure.**  
🌀 *From lint to closure, every step is a return.*
