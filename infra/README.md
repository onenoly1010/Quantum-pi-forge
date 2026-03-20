# Infrastructure - Testnet Deployment

## Overview

This directory contains infrastructure configuration for deploying Pi Forge Quantum Genesis to Railway in a safe, testnet-only environment. All configurations enforce strict safety constraints to prevent accidental mainnet deployments.

## Directory Structure

```
infra/
├── README.md                      # This file
├── SECRETS.md                     # Required secrets documentation (NO VALUES)
├── railway.toml                   # Railway deployment manifest (testnet)
├── docker-compose.testnet.yml     # Full stack testnet compose file
└── railway/
    └── README.md                  # Detailed Railway deployment guide
```

## Architecture

Pi Forge Quantum Genesis deploys as a "Quantum Resonance Lattice" with three primary services:

1. **FastAPI Server** (Port 8000) - Production API with Supabase auth & WebSocket
2. **Flask Dashboard** (Port 5000) - Quantum resonance visualization
3. **Gradio Interface** (Port 7860) - Ethical AI audit tool

Optional advanced services:
- **Guardian Coordinator** - Multi-guardian consensus orchestration
- **Guardian Bot** - Automated monitoring and alerting
- **PostgreSQL Database** - Testnet data persistence (local only)

## Deployment Options

### Option 1: Railway (Recommended for Production Testnet)

Railway provides managed hosting with:
- Automatic HTTPS/SSL
- Health monitoring
- Rollback capabilities
- Environment secret management

**Setup Guide**: See [`railway/README.md`](railway/README.md)

**Quick Start**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up --service fastapi-server
```

### Option 2: Docker Compose (Local Testing)

Full stack local deployment for development:

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set testnet values
# Ensure APP_ENVIRONMENT=testnet

# Start full stack
docker-compose -f infra/docker-compose.testnet.yml up

# Or start specific services
docker-compose -f infra/docker-compose.testnet.yml up fastapi-server flask-dashboard

# With guardian services
docker-compose -f infra/docker-compose.testnet.yml --profile guardian up
```

### Option 3: GitHub Actions (CI/CD)

Automated deployment via GitHub Actions workflow:

**Workflow**: `.github/workflows/deploy-testnet.yml`

Triggers:
- Manual workflow dispatch
- Push to `testnet` branch (optional)
- Pull request labeled `deploy-testnet` (optional)

**Prerequisites**:
- Add secrets to GitHub repository (see `SECRETS.md`)
- Configure Railway CLI token in GitHub secrets

## Safety Guarantees

### Built-in Safety Mechanisms

All deployment configurations enforce these constraints:

1. **Environment Enforcement**
   - `APP_ENVIRONMENT` MUST equal `testnet`
   - Deployment aborts if not testnet

2. **Zero-Value Transactions**
   - `NFT_MINT_VALUE` MUST equal `0` or be unset
   - All Pi transactions are testnet sandbox with no real value

3. **Kill Switch Protection**
   - Deployment aborts if `GUARDIAN_KILL_SWITCH=on`
   - Allows emergency halt of all operations

4. **Mainnet Prevention**
   - `FORCE_DEPLOY_TO_MAINNET` MUST NOT exist
   - Mainnet requires separate PR with documented approvals

5. **Pi Network Sandbox**
   - `PI_NETWORK_MODE` MUST equal `sandbox`
   - All Pi SDK calls use testnet endpoints

### Enforcement Points

Safety checks occur at multiple layers:

- **Configuration Files**: Hard-coded `APP_ENVIRONMENT=testnet`
- **GitHub Actions**: Pre-deployment safety gate job
- **Docker Compose**: Environment variables default to safe values
- **Railway Manifest**: Template enforces testnet variables

## Operator Checklist

Before any deployment, operators MUST verify:

- [ ] All secrets configured in deployment platform (Railway/GitHub)
- [ ] `APP_ENVIRONMENT=testnet` verified in environment
- [ ] `NFT_MINT_VALUE=0` or unset
- [ ] `PI_NETWORK_MODE=sandbox`
- [ ] `FORCE_DEPLOY_TO_MAINNET` does NOT exist
- [ ] `GUARDIAN_KILL_SWITCH` is NOT `on` (unless testing kill switch)
- [ ] All Pi Network credentials are testnet/sandbox credentials
- [ ] No production secrets committed to repository
- [ ] Railway project linked to correct repository
- [ ] Deployment target verified as testnet environment

## Secrets Management

**CRITICAL**: Never commit secrets to the repository.

All secrets must be configured in:
- **Railway**: Project Settings → Variables
- **GitHub Actions**: Repository Settings → Secrets and Variables → Actions

Required secrets documented in: [`SECRETS.md`](SECRETS.md)

## Rollback Strategy

### Primary: Railway CLI Rollback

```bash
# View deployment history
railway status --service fastapi-server

# Rollback to previous deployment
railway rollback --service fastapi-server
```

### Secondary: Re-deploy Known Good Image

```bash
# Using GitHub Actions workflow
# Manually trigger .github/workflows/rollback.yml

# Or via Railway CLI
railway up --detach --service fastapi-server --image ghcr.io/onenoly1010/pi-forge-quantum-genesis:v1.2.3
```

### Manual Workflow

GitHub Actions provides a manual rollback workflow:

1. Go to Actions → Rollback Testnet Deployment
2. Click "Run workflow"
3. Select service and deployment ID
4. Confirm rollback

## Monitoring

### Health Checks

All services expose health endpoints:

- FastAPI: `GET /health` → `{"status": "healthy", "environment": "testnet"}`
- Flask: `GET /health` → HTML health status page
- Gradio: `GET /` → Gradio UI root

### Smoke Tests

Automated smoke test script: `scripts/smoke_test.sh`

```bash
# Run smoke tests against deployed environment
./scripts/smoke_test.sh https://your-deployment-url.up.railway.app

# Expected output:
# ✅ FastAPI health check passed
# ✅ Environment is testnet
# ✅ All safety checks passed
```

### Logging

- **Railway**: Real-time logs in dashboard or via `railway logs`
- **Local**: Docker Compose logs via `docker-compose logs -f`
- **GitHub Actions**: Workflow run logs in Actions tab

## Mainnet Deployment

Mainnet deployment is **NOT** included in this PR and requires:

1. **Separate Infrastructure PR** with mainnet configuration
2. **5/5 Guardian Approvals** documented in PR description
3. **Security Audit** of all code changes
4. **Explicit `FORCE_DEPLOY_TO_MAINNET=true`** flag (separate PR only)
5. **Real-value transaction testing** with guardian oversight
6. **Incident response plan** documented and approved

This testnet infrastructure explicitly prevents mainnet deployment to ensure safety.

## Troubleshooting

### Common Issues

**Build Failures**
- Check `railway.toml` builder is set to `DOCKERFILE`
- Verify all dependencies in `server/requirements.txt` are valid
- Review build logs: `railway logs --service <service-name>`

**Environment Variable Issues**
- Verify variables set in Railway dashboard
- Check `.env` file for local Docker Compose
- Ensure no typos in variable names

**Health Check Failures**
- Confirm service is listening on `$PORT` (Railway injects this)
- Check service logs for startup errors
- Verify Supabase URL and key are correct

**Safety Gate Failures**
- Review GitHub Actions workflow logs
- Verify all safety variables are set correctly
- Ensure `FORCE_DEPLOY_TO_MAINNET` does not exist

## Support

- **Railway Issues**: [Railway Discord](https://discord.gg/railway)
- **Pi Forge Issues**: [GitHub Issues](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues)
- **Deployment Questions**: Open a GitHub Discussion

## Version History

- **v1.0.0** (2025-12-10): Initial testnet infrastructure
  - Railway manifest with safety gates
  - Docker Compose testnet configuration
  - GitHub Actions CI/CD with pre-deployment checks
  - Rollback workflow
  - Comprehensive documentation

---

**Remember**: This infrastructure is testnet-only by design. Mainnet requires separate approval process.
