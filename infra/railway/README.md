# Railway Deployment Guide - TESTNET ONLY

> **📌 Note**: This document is part of the deployment documentation suite.  
> For the complete deployment guide, see the **[Deployment Dashboard](../../docs/DEPLOYMENT_DASHBOARD.md)**.

## Overview

This guide walks you through deploying Pi Forge Quantum Genesis to Railway in a safe, testnet-only configuration.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Install via `npm i -g @railway/cli` or `brew install railway`
3. **GitHub Repository**: This repository must be connected to Railway
4. **Secrets Ready**: Have all required secrets from `infra/SECRETS.md` ready

## Safety Notice

⚠️ **CRITICAL SAFETY REQUIREMENTS** ⚠️

This deployment configuration is **TESTNET ONLY**. Before proceeding:

- ✅ Verify `APP_ENVIRONMENT=testnet` in all configurations
- ✅ Ensure `NFT_MINT_VALUE=0` (zero-value transactions only)
- ✅ Confirm `PI_NETWORK_MODE=sandbox` (testnet sandbox)
- ✅ Verify `FORCE_DEPLOY_TO_MAINNET` does NOT exist
- ✅ Check `GUARDIAN_KILL_SWITCH` is NOT set to 'on'

**Mainnet deployments require a separate PR with documented 5/5 guardian approvals.**

## Step 1: Connect Repository to Railway

### Option A: Via Railway Dashboard (Recommended)

1. Log in to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub account
4. Select `onenoly1010/pi-forge-quantum-genesis`
5. Railway will auto-detect the `Dockerfile` and `railway.toml`

### Option B: Via Railway CLI

```bash
# Login to Railway
railway login

# Link to existing project (if created) or create new
railway init

# Link to this repository
railway link
```

## Step 2: Configure Testnet Environment

### 2.1 Set Environment Variables

In Railway Dashboard → Project Settings → Variables, add:

**Required Safety Variables:**
```
APP_ENVIRONMENT=testnet
NFT_MINT_VALUE=0
PI_NETWORK_MODE=sandbox
PI_SANDBOX_MODE=true
```

**Required Secrets:** (See `infra/SECRETS.md` for details)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-secure-random-string
PI_NETWORK_APP_ID=your-testnet-app-id
PI_NETWORK_API_KEY=your-testnet-api-key
```

**Optional Configuration:**
```
LOG_LEVEL=INFO
CORS_ORIGINS=https://your-frontend.vercel.app
GUARDIAN_KILL_SWITCH=off
```

### 2.2 Verify Safety Configuration

Run this command locally to validate your Railway environment:

```bash
# Using Railway CLI
railway variables

# Verify output contains:
# APP_ENVIRONMENT=testnet
# NFT_MINT_VALUE=0
# PI_NETWORK_MODE=sandbox
```

**If any safety variable is incorrect, DO NOT DEPLOY. Fix configuration first.**

## Step 3: Deploy Services

### 3.1 Deploy FastAPI Server (Primary)

```bash
# Deploy main FastAPI service
railway up --service fastapi-server

# Monitor deployment
railway logs --service fastapi-server
```

Expected output:
```
✅ Build successful
✅ Deployed to: https://fastapi-server-production-XXXX.up.railway.app
✅ Health check passing
```

### 3.2 Deploy Flask Dashboard (Optional)

```bash
# Deploy Flask dashboard
railway up --service flask-dashboard

# Monitor
railway logs --service flask-dashboard
```

### 3.3 Deploy Gradio Interface (Optional)

```bash
# Deploy Gradio ethics interface
railway up --service gradio-interface

# Monitor
railway logs --service gradio-interface
```

### 3.4 Deploy Guardian Services (Advanced Only)

```bash
# Only if you need guardian coordination
railway up --service guardian-coordinator
```

## Step 4: Verify Deployment

### 4.1 Run Smoke Tests

```bash
# Run automated smoke tests
./scripts/smoke_test.sh https://your-fastapi-server.up.railway.app

# Expected output:
# ✅ FastAPI health check passed
# ✅ APP_ENVIRONMENT=testnet verified
# ✅ NFT_MINT_VALUE=0 verified
# ✅ All safety checks passed
```

### 4.2 Manual Verification

Visit your deployed URLs and verify:

1. **FastAPI**: `https://your-fastapi-server.up.railway.app/health`
   - Should return: `{"status": "healthy", "environment": "testnet"}`

2. **Flask Dashboard**: `https://your-flask-dashboard.up.railway.app/health`
   - Should display health check page with testnet indicator

3. **Gradio Interface**: `https://your-gradio-interface.up.railway.app`
   - Should show ethics audit interface with testnet banner

## Step 5: Configure Custom Domains (Optional)

In Railway Dashboard → Service Settings → Domains:

1. Add custom domain (e.g., `testnet-api.yourdomain.com`)
2. Configure DNS records as instructed
3. Railway auto-provisions SSL certificates

## Troubleshooting

### Build Failures

```bash
# Check build logs
railway logs --service fastapi-server

# Common issues:
# - Missing environment variables → Set in Railway dashboard
# - Dockerfile not found → Verify railway.toml points to correct Dockerfile
# - Dependencies failed → Check server/requirements.txt
```

### Deployment Safety Violations

If deployment is blocked by safety checks:

1. Verify environment variables in Railway dashboard
2. Ensure `APP_ENVIRONMENT=testnet`
3. Confirm `FORCE_DEPLOY_TO_MAINNET` does NOT exist
4. Check GitHub Actions workflow logs for specific violation

### Health Check Failures

```bash
# Check service logs
railway logs --service fastapi-server --tail 100

# Verify service is listening on correct port
# Railway injects $PORT environment variable
```

### Rollback Instructions

If deployment fails or introduces issues:

```bash
# Option 1: Rollback via Railway CLI
railway rollback --service fastapi-server

# Option 2: Use GitHub Actions rollback workflow
# Trigger manually from GitHub Actions tab

# Option 3: Re-deploy last known good image
railway up --detach --service fastapi-server --image ghcr.io/onenoly1010/pi-forge-quantum-genesis:v1.2.3
```

## Monitoring and Maintenance

### View Logs

```bash
# Real-time logs
railway logs --service fastapi-server --follow

# Historical logs
railway logs --service fastapi-server --tail 500
```

### Check Metrics

In Railway Dashboard → Service → Metrics:
- CPU usage
- Memory usage
- Network traffic
- Request count

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Re-deploy
railway up --service fastapi-server
```

## Security Best Practices

1. **Never commit secrets** - Use Railway environment variables only
2. **Rotate secrets regularly** - Update in Railway dashboard monthly
3. **Monitor logs** - Check for unauthorized access attempts
4. **Enable 2FA** - On both GitHub and Railway accounts
5. **Audit deployments** - Review Railway activity logs weekly

## Support

- Railway Documentation: https://docs.railway.app
- Pi Forge Issues: https://github.com/onenoly1010/pi-forge-quantum-genesis/issues
- Railway Discord: https://discord.gg/railway

## Next Steps

After successful testnet deployment:

1. Run comprehensive integration tests
2. Monitor for 24-48 hours before announcing
3. Document any issues or improvements
4. For mainnet deployment, create separate PR with guardian approvals

---

**Remember**: This is a TESTNET deployment. Mainnet requires explicit guardian approval and separate configuration.
