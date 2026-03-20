# INFRA-002: Fully wired testnet deployment — Railway + GH Actions + rollback

## 🎯 Overview

This PR adds a complete, production-ready testnet deployment infrastructure for **Pi Forge Quantum Genesis**. All configurations are safe-by-default with multiple layers of safety enforcement to prevent accidental mainnet deployments.

## 📦 What's Included

This PR adds the following infrastructure files:

### Deployment Manifests
- **`infra/railway.toml`** - Railway deployment manifest with testnet-only configuration
  - Four services: FastAPI, Flask, Gradio, and optional Guardian Coordinator
  - Enforces `APP_ENVIRONMENT=testnet` and `NFT_MINT_VALUE=0`
  - Template placeholders for Railway project IDs (operators must configure)

- **`infra/docker-compose.testnet.yml`** - Full-stack testnet environment for local staging
  - Services: FastAPI (8000), Flask (5000), Gradio (7860), Guardian API (8001), PostgreSQL
  - All services configured with `APP_ENVIRONMENT=testnet`
  - Guardian services set `NFT_MINT_VALUE=0`
  - No secrets committed (uses .env file)

### CI/CD Workflows
- **`.github/workflows/deploy-testnet.yml`** - Automated testnet deployment workflow
  - **Safety Gate Job**: Aborts deployment if:
    - `APP_ENVIRONMENT` ≠ `testnet`
    - `NFT_MINT_VALUE` ≠ `0`
    - `GUARDIAN_KILL_SWITCH` = `on`
    - `FORCE_DEPLOY_TO_MAINNET` exists
    - `PI_NETWORK_MODE` ≠ `sandbox`
  - **Test Job**: Runs Python 3.11 unit tests before deployment
  - **Build Job**: Builds and pushes Docker images to GHCR (uses `secrets.GITHUB_TOKEN`)
  - **Deploy Job**: Railway CLI deployment (template - requires `secrets.RAILWAY_TOKEN` and project ID)
  - **Smoke Test Job**: Post-deployment validation (template - requires deployment URLs)
  - **Rollback Job**: Automatic rollback notification on failure

- **`.github/workflows/rollback.yml`** - Manual rollback workflow
  - Requires workflow_dispatch with confirmation input
  - Uses `secrets.RAILWAY_TOKEN` and Railway project ID (template placeholders)
  - Rollback to previous deployment or specific deployment ID
  - Audit logging for all rollback operations

### Testing & Validation
- **`scripts/smoke_test.sh`** - Executable smoke test script
  - Tests FastAPI, Flask, and Gradio endpoints
  - Validates `APP_ENVIRONMENT=testnet`
  - Checks for mainnet indicators (fails if found)
  - Supports local and deployed endpoint testing
  - Environment variable or default localhost ports

### Documentation
- **`infra/README.md`** - Comprehensive infrastructure guide
  - Architecture overview
  - Deployment options (Railway, Docker Compose, GitHub Actions)
  - Safety guarantees and enforcement points
  - Operator checklist
  - Rollback strategies
  - Monitoring and troubleshooting

- **`infra/SECRETS.md`** - Required secrets documentation
  - Lists all required secret names (NO VALUES)
  - Supabase, JWT, Pi Network, Railway, GHCR tokens
  - Scope and purpose for each secret
  - Secret rotation policy and best practices
  - Security guidelines

## 🔒 Safety Features

### Multi-Layer Safety Enforcement

This infrastructure enforces testnet-only deployment at multiple layers:

1. **Configuration Layer**: Hard-coded `APP_ENVIRONMENT=testnet` in docker-compose.yml
2. **Workflow Layer**: Pre-deployment safety gate checks all environment variables
3. **Build Layer**: Docker build args set `APP_ENVIRONMENT=testnet`, `NFT_MINT_VALUE=0`
4. **Runtime Layer**: Services validate environment on startup

### Safety Gates in deploy-testnet.yml

The workflow **ABORTS** deployment if:
- ❌ Workflow confirmation ≠ `"testnet"`
- ❌ `APP_ENVIRONMENT` ≠ `testnet`
- ❌ `NFT_MINT_VALUE` ≠ `0`
- ❌ `GUARDIAN_KILL_SWITCH` = `on`
- ❌ `FORCE_DEPLOY_TO_MAINNET` exists
- ❌ `PI_NETWORK_MODE` ≠ `sandbox`

### No Secrets Committed

All files use template placeholders or GitHub Actions secrets syntax:
- `${{ secrets.RAILWAY_TOKEN }}` for Railway CLI
- `${{ secrets.GITHUB_TOKEN }}` for GHCR
- `${{ secrets.SUPABASE_URL }}` and `${{ secrets.SUPABASE_KEY }}`
- `${VARIABLE}` or `${VARIABLE:-default}` for environment variables
- NO actual secret values in any committed files

## 🚀 Operator Instructions

### Before Merging This PR

1. **Review all files** in the PR to ensure no secrets are committed
2. **Verify safety gates** in `.github/workflows/deploy-testnet.yml`
3. **Approve and merge** this PR to add infrastructure files

### After Merging This PR

#### 1. Configure Secrets in GitHub

Navigate to **Repository Settings → Secrets and Variables → Actions** and add:

**Required Secrets:**
```
RAILWAY_TOKEN          # Railway CLI token (from `railway whoami --token`)
SUPABASE_URL           # Testnet Supabase URL (https://your-project.supabase.co)
SUPABASE_KEY           # Testnet Supabase anon key
PI_NETWORK_APP_ID      # Pi Network sandbox/testnet app ID
PI_NETWORK_API_KEY     # Pi Network sandbox/testnet API key
```

**Optional Secrets (for GHCR):**
```
GHCR_TOKEN             # GitHub PAT with packages:write (or use auto GITHUB_TOKEN)
```

**Safety Variables (configure in Railway or workflow):**
```
APP_ENVIRONMENT=testnet          # REQUIRED: Must be exactly "testnet"
NFT_MINT_VALUE=0                 # REQUIRED: Must be 0
PI_NETWORK_MODE=sandbox          # REQUIRED: Must be "sandbox"
PI_SANDBOX_MODE=true             # REQUIRED: Must be true
```

#### 2. Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Create new project (or link existing)
railway init

# Note your project ID (shown in output or dashboard)
# Replace <YOUR_RAILWAY_PROJECT_ID> in workflow files
```

#### 3. Configure Railway Environment Variables

In **Railway Dashboard → Project Settings → Variables**, add:

```bash
APP_ENVIRONMENT=testnet
NFT_MINT_VALUE=0
PI_NETWORK_MODE=sandbox
PI_SANDBOX_MODE=true
SUPABASE_URL=<your-testnet-supabase-url>
SUPABASE_KEY=<your-testnet-supabase-key>
JWT_SECRET=<generated-secret>  # openssl rand -hex 32
PI_NETWORK_APP_ID=<sandbox-app-id>
PI_NETWORK_API_KEY=<sandbox-api-key>
LOG_LEVEL=INFO
```

#### 4. Update GitHub Workflow with Railway Project ID

Edit `.github/workflows/deploy-testnet.yml`:

**Find and replace** `<YOUR_RAILWAY_PROJECT_ID>` with your actual Railway project ID.

**Uncomment** Railway CLI deployment commands in the `deploy-railway` job:

```yaml
# Before (template):
# railway link <YOUR_RAILWAY_PROJECT_ID>
# railway up --service fastapi-server

# After (configured):
railway link abc123-def456-ghi789
railway up --service fastapi-server
```

#### 5. Local Testing (Optional)

Before deploying to Railway, test locally:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and set testnet values
# Ensure APP_ENVIRONMENT=testnet

# 3. Start services
docker-compose -f infra/docker-compose.testnet.yml up

# 4. Run smoke tests
./scripts/smoke_test.sh http://localhost:8000
```

#### 6. Deploy to Railway

**Option A: Manual Deployment**
```bash
railway up --service fastapi-server
railway up --service flask-dashboard
railway up --service gradio-interface
```

**Option B: Automated via GitHub Actions**
```bash
# Go to Actions → Deploy to Testnet
# Click "Run workflow"
# Enter "testnet" in confirmation field
# Click "Run workflow"
```

#### 7. Verify Deployment

```bash
# Get Railway deployment URL
railway status --service fastapi-server

# Run smoke tests against deployed URL
./scripts/smoke_test.sh https://your-app.up.railway.app

# Check health endpoints
curl https://your-fastapi.up.railway.app/health
curl https://your-flask.up.railway.app/health
curl https://your-gradio.up.railway.app/
```

## 📋 Required Secrets Summary

### GitHub Actions Secrets
Add these in **Repository Settings → Secrets and Variables → Actions**:

| Secret Name | Purpose | How to Get |
|------------|---------|------------|
| `RAILWAY_TOKEN` | Railway CLI authentication | `railway whoami --token` after `railway login` |
| `SUPABASE_URL` | Testnet Supabase project URL | Supabase dashboard (testnet project) |
| `SUPABASE_KEY` | Testnet Supabase anon key | Supabase dashboard → Project Settings → API |
| `PI_NETWORK_APP_ID` | Pi Network testnet app ID | Pi Developer Portal (sandbox app) |
| `PI_NETWORK_API_KEY` | Pi Network testnet API key | Pi Developer Portal (sandbox app) |
| `GHCR_TOKEN` | GitHub Container Registry (optional) | GitHub Settings → Developer → PAT |

### Railway Environment Variables
Add these in **Railway Dashboard → Project Settings → Variables**:

| Variable Name | Required Value | Notes |
|--------------|----------------|-------|
| `APP_ENVIRONMENT` | `testnet` | MUST be exactly "testnet" |
| `NFT_MINT_VALUE` | `0` | MUST be 0 for testnet safety |
| `PI_NETWORK_MODE` | `sandbox` | MUST be "sandbox" |
| `PI_SANDBOX_MODE` | `true` | MUST be true |
| `SUPABASE_URL` | (your testnet URL) | Same as GitHub secret |
| `SUPABASE_KEY` | (your testnet key) | Same as GitHub secret |
| `JWT_SECRET` | (generated) | Generate: `openssl rand -hex 32` |
| `PI_NETWORK_APP_ID` | (sandbox ID) | Same as GitHub secret |
| `PI_NETWORK_API_KEY` | (sandbox key) | Same as GitHub secret |
| `LOG_LEVEL` | `INFO` or `DEBUG` | Logging verbosity |

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] All secrets configured in GitHub Actions
- [ ] All environment variables configured in Railway
- [ ] `APP_ENVIRONMENT=testnet` in Railway
- [ ] `NFT_MINT_VALUE=0` in Railway
- [ ] `PI_NETWORK_MODE=sandbox` in Railway
- [ ] Railway project created and linked
- [ ] Railway project ID updated in workflow files
- [ ] Railway CLI deployment commands uncommented
- [ ] All Pi Network credentials are testnet/sandbox credentials
- [ ] No production secrets in .env or committed files
- [ ] `FORCE_DEPLOY_TO_MAINNET` does NOT exist anywhere
- [ ] `GUARDIAN_KILL_SWITCH` is NOT set to `on`
- [ ] Smoke test script is executable (`chmod +x scripts/smoke_test.sh`)
- [ ] Local docker-compose testing completed successfully

## 🔄 Rollback Instructions

If deployment fails or issues arise:

### Option 1: GitHub Actions Rollback Workflow
1. Go to **Actions → Rollback Testnet Deployment**
2. Click **"Run workflow"**
3. Select service to rollback
4. Type **"ROLLBACK"** in confirmation field
5. Provide rollback reason
6. Click **"Run workflow"**

### Option 2: Railway CLI Manual Rollback
```bash
# View deployment history
railway status --service fastapi-server

# Rollback to previous deployment
railway rollback --service fastapi-server

# Or rollback to specific deployment
railway rollback --service fastapi-server --to <deployment-id>
```

### Option 3: Re-deploy Known Good Image
```bash
# Re-deploy last known good image from GHCR
railway up --detach --service fastapi-server \
  --image ghcr.io/onenoly1010/pi-forge-quantum-genesis-fastapi:testnet-latest
```

## 🚫 Mainnet Deployment

**IMPORTANT**: This infrastructure is **testnet-only by design**.

Mainnet deployment requires:
1. **Separate Infrastructure PR** with mainnet-specific configuration
2. **5/5 Guardian Approvals** documented in PR description with signatures
3. **Security Audit** of all code changes and infrastructure
4. **Explicit `FORCE_DEPLOY_TO_MAINNET=true`** flag (separate PR only)
5. **Real-value transaction testing** with multi-guardian oversight
6. **Incident response plan** documented and approved by all guardians

This PR explicitly prevents mainnet deployment through multiple safety gates. Any attempt to deploy to mainnet will **abort** the deployment.

## 🔍 Testing This PR

After merging, test the infrastructure:

```bash
# 1. Local Docker Compose
docker-compose -f infra/docker-compose.testnet.yml up
./scripts/smoke_test.sh http://localhost:8000

# 2. GitHub Actions (Dry Run)
# - Go to Actions → Deploy to Testnet
# - Click "Run workflow"
# - Workflow will run safety checks and tests
# - Deploy step will show template placeholder message

# 3. Railway Deployment (After Configuration)
railway up --service fastapi-server
./scripts/smoke_test.sh https://your-app.up.railway.app
```

## 📚 Documentation

Comprehensive documentation is included:

- **`infra/README.md`**: Complete infrastructure guide with deployment options, safety features, and troubleshooting
- **`infra/SECRETS.md`**: Detailed secrets management guide with rotation policy
- **`infra/railway/README.md`**: Railway-specific deployment guide

## 🎉 Summary

This PR provides:
- ✅ Safe-by-default testnet deployment infrastructure
- ✅ Multi-layer safety enforcement (config, workflow, build, runtime)
- ✅ Railway, Docker Compose, and GitHub Actions support
- ✅ Automated CI/CD with pre-deployment safety gates
- ✅ Rollback capabilities (automated and manual)
- ✅ Comprehensive documentation and operator guides
- ✅ Smoke testing and health check validation
- ✅ **ZERO secrets committed** (all templates and placeholders)
- ✅ Mainnet deployment prevention

---

**Next Steps After Merge:**
1. Configure secrets in GitHub and Railway (see operator instructions above)
2. Update Railway project ID in workflow files
3. Test locally with docker-compose
4. Deploy to Railway manually or via GitHub Actions
5. Run smoke tests to validate deployment
6. Monitor logs and health endpoints

**Questions?**
- See `infra/README.md` for detailed guidance
- See `infra/SECRETS.md` for secrets configuration
- Open a GitHub Discussion for deployment questions
- Report issues via GitHub Issues

---

**Remember**: This infrastructure is testnet-only. Mainnet requires separate PR with guardian approvals.
