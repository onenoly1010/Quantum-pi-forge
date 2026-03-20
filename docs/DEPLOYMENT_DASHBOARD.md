# 🚀 Deployment Dashboard
## Your Complete Guide to Deploying Quantum Pi Forge

**Last Updated**: 2025-12-21  
**Maintained By**: GitHub Agent (Coordinator)  
**Canon Alignment**: ✅ Verified  
**Continuity**: Anyone can maintain/extend this dashboard

This dashboard is the **canonical entry point** for all deployment tasks across the Quantum Pi Forge constellation. It consolidates deployment knowledge from all existing guides into a single, authoritative source of truth.

> **📌 Note**: This document consolidates information from:
> - `DEPLOYMENT.md` - Vercel/Railway basics
> - `DEPLOY_MANUAL.md` - Railway manual setup
> - `docs/PRODUCTION_DEPLOYMENT.md` - Production deployment
> - `docs/PI_NETWORK_DEPLOYMENT_GUIDE.md` - Pi Network integration  
> - `infra/railway/README.md` - Railway testnet deployment
> - `ledger-api/RUNBOOK.md` - Operations reference

---

## 📑 Quick Navigation

### Getting Started
- [Prerequisites](#-prerequisites)
- [Platform Overview](#-platform-overview)

### Deployment Guides
- [Railway Backend Setup](#-railway-backend-setup)
- [Vercel Frontend Setup](#-vercel-frontend-setup)
- [Supabase Database Setup](#️-supabase-database-setup)

### Configuration
- [Environment Variables Reference](#-environment-variables-reference)
- [Deployment Verification](#-deployment-verification)

### Operations
- [Troubleshooting](#-troubleshooting)
- [Maintenance & Monitoring](#-maintenance--monitoring)
- [Quick Reference](#-quick-reference)

---

## 🧭 Prerequisites

### Before You Begin

Complete this checklist before starting deployment:

- [ ] **GitHub account** with access to `onenoly1010/pi-forge-quantum-genesis`
- [ ] **Railway account** - Sign up at [railway.app](https://railway.app)
- [ ] **Vercel account** - Sign up at [vercel.com](https://vercel.com)
- [ ] **Supabase account** - Sign up at [supabase.com](https://supabase.com)
- [ ] **Pi Network Developer account** - Register at [developer.pi](https://developer.pi)
- [ ] **Node.js 18+** installed locally (for testing)
- [ ] **Python 3.11+** installed locally (for backend testing)

### Required Tools

Install these command-line tools:

```bash
# Railway CLI
npm install -g @railway/cli

# Vercel CLI (optional, for manual deployments)
npm install -g vercel

# Supabase CLI (optional, for migrations)
npm install -g supabase
```

Verify installations:
```bash
railway --version
vercel --version
supabase --version
node --version
python --version
```

---

## 🌐 Platform Overview

### Architecture

The Quantum Pi Forge uses a distributed architecture across three primary platforms:

```
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│  Vercel             │      │  Railway            │      │  Supabase           │
│  (Frontend)         │─────▶│  (Backend)          │─────▶│  (Database)         │
│                     │      │                     │      │                     │
│ - Static files      │      │ - FastAPI           │      │ - PostgreSQL        │
│ - Serverless funcs  │      │ - Python 3.11       │      │ - Auth              │
│ - index.html        │      │ - Port: $PORT       │      │ - Real-time         │
│ - Pi integration    │      │ - Docker-based      │      │ - Row Level Security│
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
         │                            │                            │
         └────────────────────────────┼────────────────────────────┘
                                      │
                          ┌───────────▼──────────┐
                          │  Pi Network Mainnet  │
                          │  (Blockchain)        │
                          │                      │
                          │ - Payment processing │
                          │ - Webhook callbacks  │
                          │ - Transaction ledger │
                          └──────────────────────┘
```

### Service Responsibilities

| Platform | Purpose | Status | URL Pattern | Build Time |
|----------|---------|--------|-------------|------------|
| **Railway** | Backend API, WebSockets, Payment Processing | Required | `https://*.railway.app` | 3-5 min |
| **Vercel** | Static frontend, Serverless functions | Required | `https://*.vercel.app` | 1-2 min |
| **Supabase** | Database, Authentication, Real-time | Required | `https://*.supabase.co` | Instant |
| **Pi Network** | Blockchain integration, Payments | Required | `https://api.minepi.com` | N/A |

### Data Flow

1. **User visits Vercel frontend** → Static HTML/JS served
2. **Frontend calls Railway API** → FastAPI backend processes request
3. **Backend queries Supabase** → PostgreSQL database returns data
4. **Payment initiated** → Pi Network SDK communicates with mainnet
5. **Webhook callback** → Pi Network → Railway backend → Supabase update

### Deployment Environments

| Environment | Purpose | Safety Level | Pi Network Mode |
|-------------|---------|--------------|-----------------|
| **Local Development** | Code changes, testing | Safe | Sandbox (testnet) |
| **Testnet Deployment** | Integration testing | Safe | Sandbox (testnet) |
| **Production Mainnet** | Live users, real Pi | ⚠️ CRITICAL | Mainnet (production) |

---

## 🚂 Railway Backend Setup

Railway hosts the FastAPI backend, which handles all server-side logic, WebSocket connections, and Pi Network payment processing.

###  Step 1: Create Railway Project

#### Option A: Via Railway Dashboard (Recommended)

1. Navigate to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub account
4. Select `onenoly1010/pi-forge-quantum-genesis`
5. Railway auto-detects `Dockerfile` and `railway.toml`
6. Click **"Deploy Now"**

#### Option B: Via Railway CLI

```bash
# Login to Railway
railway login

# Initialize new project
railway init

# Link to existing project (if already created)
railway link
```

### Step 2: Configure Environment Variables

In **Railway Dashboard → Project → Variables**, add these environment variables:

#### 🔴 Critical Variables (Production Mainnet)

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here

# JWT Authentication
JWT_SECRET=your-secure-random-32-char-string

# Pi Network Mainnet Configuration
PI_NETWORK_MODE=mainnet
PI_NETWORK_APP_ID=your-mainnet-app-id
PI_NETWORK_API_KEY=your-mainnet-api-key
PI_NETWORK_API_ENDPOINT=https://api.minepi.com
PI_SANDBOX_MODE=false

# Webhook Security (CRITICAL)
PI_NETWORK_WEBHOOK_SECRET=your-webhook-secret-from-pi-portal

# Server Configuration
PORT=${{RAILWAY_PORT}}  # Auto-assigned by Railway (do not modify)
DEBUG=false
LOG_LEVEL=INFO
ENVIRONMENT=production
```

#### 🟡 Testnet Variables (Safe Testing)

For testnet/sandbox deployments:

```bash
# Testnet Safety Configuration
APP_ENVIRONMENT=testnet
NFT_MINT_VALUE=0
PI_NETWORK_MODE=sandbox
PI_SANDBOX_MODE=true
PI_NETWORK_APP_ID=your-sandbox-app-id
PI_NETWORK_API_KEY=your-sandbox-api-key
```

#### 🟢 Optional Variables

```bash
# Tracing & Observability
AZURE_TRACING_GEN_AI_CONTENT_RECORDING_ENABLED=true
QUANTUM_TRACING_ENABLED=true

# CORS Configuration
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com

# Guardian Alerts (optional)
GUARDIAN_SLACK_WEBHOOK_URL=your-slack-webhook

# Additional Secrets
PI_NETWORK_WALLET_PRIVATE_KEY=your-wallet-key  # Only if sending Pi to users
```

### Step 3: Configure Deployment Settings

In **Railway Dashboard → Settings → Deploy**:

| Setting | Value | Notes |
|---------|-------|-------|
| **Builder** | Dockerfile | Auto-detected from `railway.toml` |
| **Start Command** | `python -m uvicorn server.main:app --host 0.0.0.0 --port $PORT` | Set in `railway.toml` |
| **Health Check Path** | `/health` | Configured in `railway.toml` |
| **Health Check Timeout** | 100 seconds | For slow cold starts |
| **Restart Policy** | On Failure | Auto-restart on crashes |
| **Max Retries** | 10 | Before giving up |

### Step 4: Deploy to Railway

#### Automated Deployment (via Git)

Railway auto-deploys when you push to the `main` branch:

```bash
git add .
git commit -m "🚀 Deploy to Railway"
git push origin main
```

Railway detects the push and automatically builds/deploys.

#### Manual Deployment (via CLI)

```bash
# Deploy current directory
railway up

# Deploy specific service
railway up --service fastapi-server

# Monitor deployment
railway logs --follow
```

### Step 5: Verify Railway Deployment

#### Test Health Endpoint

```bash
# Get deployment URL
railway status

# Test health endpoint
curl https://your-app.railway.app/health

# Expected response:
# {
#   "status": "healthy",
#   "service": "FastAPI Quantum Conduit",
#   "port": 8000,
#   "supabase_connected": true,
#   "pi_network_mode": "mainnet",
#   "timestamp": 1734739200.123
# }
```

#### Verify Service Status

```bash
# Check Railway logs
railway logs --tail 100

# Look for startup messages:
# ✅ "Application startup complete"
# ✅ "Uvicorn running on http://0.0.0.0:8000"
# ✅ "Supabase connection successful"
```

#### Test API Endpoints

```bash
# Test root endpoint
curl https://your-app.railway.app/

# Test Pi Network status
curl https://your-app.railway.app/api/pi-network/status

# Test WebSocket (requires wscat)
wscat -c wss://your-app.railway.app/ws/collective-insight
```

---

## ▲ Vercel Frontend Setup

Vercel hosts the static frontend (HTML/JS/CSS) and serverless API functions for Pi Network authentication.

### Step 1: Import Repository

1. Navigate to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select `onenoly1010/pi-forge-quantum-genesis`
4. Vercel auto-detects configuration from `vercel.json`

### Step 2: Configure Build Settings

Vercel automatically reads these settings from `vercel.json`, but verify:

| Setting | Value | Source |
|---------|-------|--------|
| **Framework Preset** | Other | Auto-detected |
| **Build Command** | `npm run build` | `vercel.json` |
| **Output Directory** | `public` | `vercel.json` |
| **Install Command** | `npm install` | Default |
| **Node.js Version** | 18.x | Default |

### Step 3: Configure Environment Variables

In **Vercel Dashboard → Settings → Environment Variables**:

```bash
# Pi Network App Secret (for serverless functions)
PI_APP_SECRET=your-pi-app-secret-from-developer-portal

# Optional: Alert Integrations
GUARDIAN_SLACK_WEBHOOK_URL=your-slack-webhook-url

# Optional: Email Alerts
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_API_KEY=your-mailgun-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM=noreply@yourdomain.com
```

**Important**: Do NOT set `SUPABASE_URL` or `SUPABASE_KEY` on Vercel. These belong on Railway backend only.

### Step 4: Deploy to Vercel

#### Automated Deployment (via Git)

Vercel auto-deploys when you push to `main`:

```bash
git add .
git commit -m "🚀 Deploy to Vercel"
git push origin main
```

#### Manual Deployment (via CLI)

```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Step 5: Verify Vercel Deployment

#### Test Frontend

```bash
# Visit your Vercel URL
https://your-project.vercel.app

# Should load the main interface
```

#### Test Serverless Function

```bash
# Test Pi Network identification endpoint
curl https://your-project.vercel.app/api/pi-identify

# Expected: 200 OK or Pi SDK response
```

#### Check Build Logs

In **Vercel Dashboard → Deployments → Latest**:
- ✅ "Build completed"
- ✅ "Deployment ready"
- ✅ No errors in logs

---

## 🗄️ Supabase Database Setup

Supabase provides PostgreSQL database, authentication, and real-time subscriptions.

### Step 1: Create Supabase Project

1. Navigate to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Choose your organization (or create one)
4. Set project details:
   - **Name**: `pi-forge-quantum-genesis`
   - **Database Password**: Generate a strong password (save securely!)
   - **Region**: Choose closest to Railway deployment (e.g., `us-east-1`)
5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning

### Step 2: Run Database Migrations

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New Query"**
3. Open `supabase_migrations/001_payments_schema.sql` in your local repository
4. Copy entire contents
5. Paste into SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. Verify: "Success. No rows returned"

#### Option B: Via Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Or apply specific migration
supabase db push --file supabase_migrations/001_payments_schema.sql
```

### Step 3: Configure Row Level Security (RLS)

Row Level Security ensures users can only access their own data.

#### Via Supabase Dashboard

1. Go to **Authentication → Policies**
2. Select table: `payments`
3. Click **"New Policy"**
4. Policy Name: `Users can view own payments`
5. Policy Definition:
   ```sql
   CREATE POLICY "Users can view own payments"
   ON payments FOR SELECT
   USING (auth.uid() = user_id);
   ```
6. Repeat for `transactions`, `users` tables

#### Via SQL Editor

Run this SQL to enable RLS:

```sql
-- Enable RLS on critical tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own payments
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert own payments
CREATE POLICY "Users can insert own payments"
ON payments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: System can update completed payments
CREATE POLICY "System can update payments"
ON payments FOR UPDATE
USING (true);
```

### Step 4: Get Connection Details

In **Supabase Dashboard → Settings → API**:

| Setting | Value | Use |
|---------|-------|-----|
| **Project URL** | `https://xxx.supabase.co` | `SUPABASE_URL` on Railway |
| **anon/public key** | `eyJhbGc...` | `SUPABASE_KEY` on Railway |
| **service_role key** | `eyJhbGc...` | ⚠️ Keep secret, do not use in frontend |

Copy these values to Railway environment variables (Step 2 of Railway setup).

### Step 5: Verify Supabase Setup

#### Test Connection from Railway

```bash
# Via Railway CLI
railway run python -c "
from supabase import create_client
import os
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))
print('✅ Connection successful')
print(client.table('payments').select('*').limit(1).execute())
"
```

#### Test in SQL Editor

Run test queries:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Test payments table
SELECT * FROM payments LIMIT 1;

-- Test views
SELECT * FROM payment_analytics LIMIT 1;
```

Expected: All queries return successfully (may have no rows yet).

---

## 🔐 Environment Variables Reference

### Complete Environment Variable Matrix

This table shows which environment variables are required on each platform:

| Variable | Railway | Vercel | Supabase | Required | Example Value |
|----------|---------|--------|----------|----------|---------------|
| `SUPABASE_URL` | ✅ | ❌ | N/A | Yes | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | ✅ | ❌ | N/A | Yes | `eyJhbGc...` |
| `JWT_SECRET` | ✅ | ❌ | ❌ | Yes | 32+ char random string |
| `PI_NETWORK_MODE` | ✅ | ❌ | ❌ | Yes | `mainnet` or `sandbox` |
| `PI_NETWORK_APP_ID` | ✅ | ❌ | ❌ | Yes | From Pi Developer Portal |
| `PI_NETWORK_API_KEY` | ✅ | ❌ | ❌ | Yes | From Pi Developer Portal |
| `PI_NETWORK_API_ENDPOINT` | ✅ | ❌ | ❌ | Yes | `https://api.minepi.com` |
| `PI_NETWORK_WEBHOOK_SECRET` | ✅ | ❌ | ❌ | Yes | From Pi Developer Portal |
| `PI_APP_SECRET` | ❌ | ✅ | ❌ | Yes | For Vercel serverless auth |
| `PORT` | ✅ | ❌ | ❌ | Auto | `${{RAILWAY_PORT}}` (dynamic) |
| `DEBUG` | ✅ | ❌ | ❌ | No | `false` |
| `LOG_LEVEL` | ✅ | ❌ | ❌ | No | `INFO` or `DEBUG` |
| `ENVIRONMENT` | ✅ | ❌ | ❌ | No | `production` or `testnet` |
| `CORS_ORIGINS` | ✅ | ❌ | ❌ | No | Comma-separated URLs |
| `GUARDIAN_SLACK_WEBHOOK_URL` | ✅ | ✅ | ❌ | No | Slack webhook URL |
| `PI_SANDBOX_MODE` | ✅ | ❌ | ❌ | Testnet | `true` or `false` |
| `APP_ENVIRONMENT` | ✅ | ❌ | ❌ | Testnet | `testnet` |
| `NFT_MINT_VALUE` | ✅ | ❌ | ❌ | Testnet | `0` |

### Generating Secrets

Use these commands to generate secure random strings:

```bash
# JWT_SECRET (32 characters minimum)
openssl rand -hex 32

# Generic secret (base64 encoded)
openssl rand -base64 32

# Strong password (44 characters)
openssl rand -base64 32 | tr -d "=+/" | cut -c1-44

# UUID (alternative for JWT_SECRET)
python -c "import uuid; print(uuid.uuid4())"
```

### Environment-Specific Variables

#### Production Mainnet
```bash
PI_NETWORK_MODE=mainnet
PI_SANDBOX_MODE=false
PI_NETWORK_API_ENDPOINT=https://api.minepi.com
DEBUG=false
LOG_LEVEL=INFO
ENVIRONMENT=production
```

#### Testnet Sandbox
```bash
APP_ENVIRONMENT=testnet
NFT_MINT_VALUE=0
PI_NETWORK_MODE=sandbox
PI_SANDBOX_MODE=true
DEBUG=true
LOG_LEVEL=DEBUG
ENVIRONMENT=testnet
```

---

## ✅ Deployment Verification

### Pre-Deployment Checklist

Complete before deploying to production:

- [ ] **Railway environment variables configured**
  - [ ] `SUPABASE_URL` set
  - [ ] `SUPABASE_KEY` set
  - [ ] `JWT_SECRET` generated (32+ chars)
  - [ ] `PI_NETWORK_MODE` set correctly
  - [ ] `PI_NETWORK_APP_ID` from Pi Portal
  - [ ] `PI_NETWORK_API_KEY` from Pi Portal
  - [ ] `PI_NETWORK_WEBHOOK_SECRET` from Pi Portal
- [ ] **Supabase database configured**
  - [ ] Project created
  - [ ] Migrations run successfully
  - [ ] RLS policies enabled
  - [ ] Connection tested
- [ ] **Pi Developer Portal configured**
  - [ ] App created (mainnet or sandbox)
  - [ ] Webhook URL set: `https://your-app.railway.app/api/pi-webhooks/payment`
  - [ ] Webhook secret generated and saved
  - [ ] Payment scopes enabled
- [ ] **Vercel project configured**
  - [ ] Project imported
  - [ ] `PI_APP_SECRET` set
  - [ ] Build successful
- [ ] **Configuration files committed**
  - [ ] `railway.toml` in repository
  - [ ] `vercel.json` in repository
  - [ ] `.env.example` updated
  - [ ] `.env` NOT committed (in `.gitignore`)
- [ ] **For testnet deployments**
  - [ ] `APP_ENVIRONMENT=testnet`
  - [ ] `NFT_MINT_VALUE=0`
  - [ ] `PI_SANDBOX_MODE=true`
- [ ] **For mainnet deployments**
  - [ ] Guardian approval obtained (if required)
  - [ ] Security audit completed
  - [ ] Backup strategy in place

### Post-Deployment Verification

Run these checks after deployment:

#### 1. Railway Backend Health

```bash
curl https://your-app.railway.app/health

# Expected response:
{
  "status": "healthy",
  "service": "FastAPI Quantum Conduit",
  "port": 8000,
  "supabase_connected": true,
  "pi_network_mode": "mainnet",
  "timestamp": 1734739200.123
}
```

#### 2. Vercel Frontend

```bash
# Visit in browser
https://your-project.vercel.app

# Expected: Frontend loads with no console errors

# Check serverless function
curl https://your-project.vercel.app/api/pi-identify

# Expected: 200 OK
```

#### 3. Supabase Connection

Test from Railway backend:

```bash
curl https://your-app.railway.app/api/db/test

# Or use Railway CLI
railway run python -c "
from supabase import create_client
import os
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))
result = client.table('payments').select('count').execute()
print(f'✅ Database connection successful. Row count: {result}')
"
```

#### 4. Pi Network Integration

```bash
# Check Pi Network status
curl https://your-app.railway.app/api/pi-network/status

# Expected response:
{
  "mode": "mainnet",
  "connected": true,
  "app_id": "your-app-id",
  "api_configured": true,
  "mainnet_ready": true
}
```

#### 5. WebSocket Connectivity

```bash
# Install wscat if needed
npm install -g wscat

# Test WebSocket endpoint
wscat -c wss://your-app.railway.app/ws/collective-insight

# Expected: Connection established, no immediate disconnect
```

### Automated Verification Script

Run the included verification script:

```bash
python verify_production.py

# Expected output:
# ✅ Railway backend responding
# ✅ Supabase connection successful
# ✅ Pi Network API accessible
# ✅ Vercel frontend deployed
# ✅ All health checks passed
# 🎉 PRODUCTION READY!
```

### Deployment Success Criteria

Your deployment is successful when ALL of these are true:

- ✅ Railway backend health check returns 200 OK
- ✅ Vercel frontend loads in browser without errors
- ✅ Supabase database accepts connections
- ✅ Pi Network webhook verification passes
- ✅ All required environment variables configured
- ✅ No errors in Railway logs
- ✅ No errors in Vercel deployment logs
- ✅ Payment flow test succeeds (testnet)
- ✅ WebSocket connections work
- ✅ CORS configured correctly (no browser console errors)

---

## 📚 Additional Resources

### Official Documentation

- [Railway Deployment Guide](../infra/railway/README.md) - Testnet-only Railway setup
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md) - Sacred Trinity production details
- [Pi Network Integration](./PI_NETWORK_DEPLOYMENT_GUIDE.md) - Pi Network mainnet setup
- [Docker Development](./DOCKER_DEVELOPMENT_GUIDE.md) - Local Docker environment
- [Ledger API Runbook](../ledger-api/RUNBOOK.md) - Operations quick reference

### Automation Scripts

- `deploy.sh` - Automated Railway deployment with safety checks
- `verify_production.py` - Post-deployment verification
- `scripts/build.js` - Vercel build script
- `scripts/smoke_test.sh` - Endpoint smoke tests

### Configuration Files

- `railway.toml` - Railway service configuration
- `vercel.json` - Vercel build and routing configuration
- `Dockerfile` - Railway container definition
- `.env.example` - Environment variable template
- `docker-compose.yml` - Local development stack

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Railway
railway login                    # Login to Railway
railway link                     # Link to existing project
railway up                       # Deploy current directory
railway logs                     # View deployment logs
railway logs --follow            # Stream logs in real-time
railway status                   # Show deployment status
railway variables                # List environment variables
railway variables set KEY=value  # Set environment variable
railway service restart          # Restart service

# Vercel
vercel login                     # Login to Vercel
vercel link                      # Link to existing project
vercel                           # Deploy to preview
vercel --prod                    # Deploy to production
vercel logs                      # View function logs
vercel ls                        # List deployments
vercel inspect                   # Show deployment details

# Supabase
supabase login                   # Login to Supabase
supabase link                    # Link to existing project
supabase db push                 # Push migrations
supabase db pull                 # Pull schema changes
supabase db dump                 # Export database

# Health checks
curl https://your-app.railway.app/health
curl https://your-project.vercel.app

# Environment check
railway variables
vercel env ls
```

### Essential URLs

| Service | Purpose | URL Template |
|---------|---------|--------------|
| **Railway Dashboard** | Backend deployment | `https://railway.app/project/your-project-id` |
| **Railway Service** | Live backend API | `https://your-service.railway.app` |
| **Vercel Dashboard** | Frontend deployment | `https://vercel.com/your-team/your-project` |
| **Vercel Deployment** | Live frontend | `https://your-project.vercel.app` |
| **Supabase Dashboard** | Database management | `https://app.supabase.com/project/your-project-id` |
| **Supabase Database** | Direct DB connection | `https://your-project.supabase.co` |
| **Pi Developer Portal** | App configuration | `https://developer.pi/your-app-id` |
| **GitHub Repository** | Source code | `https://github.com/onenoly1010/pi-forge-quantum-genesis` |

### Common Environment Variables

| Variable | Production Value | Testnet Value |
|----------|------------------|---------------|
| `PI_NETWORK_MODE` | `mainnet` | `sandbox` |
| `PI_SANDBOX_MODE` | `false` | `true` |
| `DEBUG` | `false` | `true` |
| `LOG_LEVEL` | `INFO` | `DEBUG` |
| `ENVIRONMENT` | `production` | `testnet` |
| `APP_ENVIRONMENT` | - | `testnet` |
| `NFT_MINT_VALUE` | - | `0` |

### Deployment Timelines

| Task | Estimated Time |
|------|----------------|
| Create Railway project | 5 minutes |
| Configure Railway environment | 10 minutes |
| Railway first deployment | 3-5 minutes |
| Create Supabase project | 3 minutes |
| Run database migrations | 2 minutes |
| Configure Supabase RLS | 5 minutes |
| Create Vercel project | 5 minutes |
| Vercel first deployment | 1-2 minutes |
| Configure Pi Developer Portal | 10 minutes |
| End-to-end testing | 15 minutes |
| **Total** | **~60 minutes** |

---

## ✅ Deployment Success Criteria

Your deployment is successful when ALL of these criteria are met:

### Technical Criteria

- ✅ **Railway backend health check returns 200 OK**
- ✅ **Vercel frontend loads in browser without errors**
- ✅ **Supabase database accepts connections**
- ✅ **Pi Network webhook verification passes**
- ✅ **All environment variables configured**
- ✅ **No errors in Railway logs**
- ✅ **No errors in Vercel deployment logs**
- ✅ **Payment flow test succeeds (testnet)**
- ✅ **WebSocket connections work**
- ✅ **CORS configured correctly**

### Security Criteria

- ✅ **All secrets stored securely** (not in code)
- ✅ **HTTPS enabled** on all platforms (automatic)
- ✅ **RLS policies enabled** on Supabase tables
- ✅ **JWT_SECRET** is 32+ characters
- ✅ **Webhook signature verification** enabled

### Operational Criteria

- ✅ **Monitoring configured** (health checks, alerts)
- ✅ **Backup strategy** in place (Supabase automatic backups)
- ✅ **Rollback procedure** documented and tested
- ✅ **Team has access** to all platforms

---

**Congratulations!** 🎉 If all criteria are met, your Quantum Pi Forge deployment is live and operational!


---

## 🔧 Troubleshooting

This section covers the most common deployment issues and their solutions.

### Common Issues & Solutions

#### Issue 1: Railway Build Fails

**Symptoms:**
```
❌ Build failed: Dockerfile not found
❌ ERROR: failed to solve: failed to read dockerfile
```

**Root Causes:**
- `Dockerfile` missing from repository root
- `railway.toml` pointing to wrong Dockerfile path
- Railway not configured to use Dockerfile builder

**Solutions:**

1. **Verify Dockerfile exists:**
   ```bash
   ls -la Dockerfile
   
   # Should show: -rw-r--r-- 1 user user 1638 Dec 21 00:00 Dockerfile
   ```

2. **Check railway.toml configuration:**
   ```bash
   cat railway.toml
   
   # Should contain:
   # [build]
   # builder = "DOCKERFILE"
   # dockerfilePath = "Dockerfile"
   ```

3. **Verify Railway dashboard settings:**
   - Go to Railway Dashboard → Settings → Build
   - Ensure "Builder" is set to "Dockerfile"
   - Check "Dockerfile Path" is "Dockerfile"

4. **Check Railway logs for specific error:**
   ```bash
   railway logs --tail 100
   ```

5. **Rebuild from scratch:**
   ```bash
   # Remove Railway service
   railway service delete fastapi-server
   
   # Recreate service
   railway up --service fastapi-server
   ```

#### Issue 2: Supabase Connection Failed

**Symptoms:**
```
❌ Database connection error: Invalid credentials
❌ supabase_connected: false
❌ HTTPError: 401 Unauthorized
```

**Root Causes:**
- Incorrect `SUPABASE_URL` or `SUPABASE_KEY`
- Supabase project paused (free tier inactivity)
- RLS policies blocking connection
- Network/firewall issues

**Solutions:**

1. **Verify credentials in Railway:**
   ```bash
   railway variables
   
   # Check SUPABASE_URL and SUPABASE_KEY are set correctly
   ```

2. **Get fresh credentials from Supabase:**
   - Go to Supabase Dashboard → Settings → API
   - Copy "Project URL" → Update `SUPABASE_URL`
   - Copy "anon/public" key → Update `SUPABASE_KEY`
   - Update Railway variables

3. **Check Supabase project status:**
   - Go to Supabase Dashboard → Home
   - If paused, click "Restore project"

4. **Test credentials locally:**
   ```bash
   python -c "
   from supabase import create_client
   import os
   
   url = 'https://your-project.supabase.co'
   key = 'your-anon-key'
   
   try:
       client = create_client(url, key)
       result = client.table('payments').select('*').limit(1).execute()
       print('✅ Connection successful')
       print(result)
   except Exception as e:
       print(f'❌ Connection failed: {e}')
   "
   ```

5. **Check RLS policies:**
   ```sql
   -- In Supabase SQL Editor, check RLS status
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   
   -- Temporarily disable RLS for testing (re-enable after!)
   ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
   ```

6. **Restart Railway service:**
   ```bash
   railway service restart fastapi-server
   ```

#### Issue 3: Pi Network Webhook Fails

**Symptoms:**
```
❌ Webhook verification failed
❌ Invalid signature
❌ 403 Forbidden on webhook endpoint
```

**Root Causes:**
- `PI_NETWORK_WEBHOOK_SECRET` doesn't match Pi Developer Portal
- Webhook URL not publicly accessible
- HTTPS not enabled
- Signature verification logic incorrect

**Solutions:**

1. **Verify webhook secret matches:**
   - Go to Pi Developer Portal → Your App → Settings
   - Copy webhook secret EXACTLY (no extra spaces)
   - Update `PI_NETWORK_WEBHOOK_SECRET` in Railway
   ```bash
   railway variables set PI_NETWORK_WEBHOOK_SECRET=your-exact-secret
   railway service restart fastapi-server
   ```

2. **Verify webhook URL is public:**
   ```bash
   # Test webhook endpoint is accessible
   curl -X POST https://your-app.railway.app/api/pi-webhooks/payment      -H "Content-Type: application/json"      -d '{"test": true}'
   curl -X POST https://your-app.railway.app/api/pi-webhooks/payment \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   
   # Expected: Response (even if verification fails, endpoint should respond)
   ```

3. **Check Pi Developer Portal configuration:**
   - Go to Pi Developer Portal → Your App → Settings
   - Verify webhook URL: `https://your-app.railway.app/api/pi-webhooks/payment`
   - Must be HTTPS (Railway provides this automatically)
   - Click "Test Webhook" to send test event

4. **Check Railway logs for details:**
   ```bash
   railway logs --tail 100 | grep -i webhook
   
   # Look for:
   # - "Webhook received: ..."
   # - Signature comparison details
   # - Verification errors
   ```

5. **Test webhook manually:**
   ```bash
   # Generate test webhook signature (if you have the secret)
   python -c "
   import hmac
   import hashlib
   import json
   
   secret = 'your-webhook-secret'
   payload = json.dumps({'test': True})
   signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
   
   print(f'Signature: {signature}')
   "
   
   # Use signature in request
   curl -X POST https://your-app.railway.app/api/pi-webhooks/payment      -H "Content-Type: application/json"      -H "X-Pi-Signature: $signature"      -d '{"test": true}'
   ```

#### Issue 4: Vercel Serverless Function Timeout

**Symptoms:**
```
❌ Function execution timed out (10s on Hobby, 60s on Pro)
❌ 504 Gateway Timeout
```

**Root Causes:**
- Function execution exceeds time limit
- Slow database queries
- External API calls taking too long
- Cold start overhead

**Solutions:**

1. **Optimize function code:**
   - Reduce database queries
   - Use connection pooling
   - Cache external API responses
   - Minimize dependencies

2. **Check Vercel plan limits:**
   - Hobby plan: 10 second timeout
   - Pro plan: 60 second timeout
   - Upgrade if needed: [vercel.com/pricing](https://vercel.com/pricing)

3. **Add timeout handling:**
   ```javascript
   export default async function handler(req, res) {
     const timeout = setTimeout(() => {
       res.status(504).json({ error: 'Function timeout' });
     }, 9000); // 9s for Hobby plan buffer
     
     try {
       // Your function logic
       const result = await yourFunction();
       clearTimeout(timeout);
       res.status(200).json(result);
     } catch (error) {
       clearTimeout(timeout);
       res.status(500).json({ error: error.message });
     }
   }
   ```

4. **Move heavy processing to Railway:**
   - Vercel: Lightweight API routes only
   - Railway: Heavy processing, long-running tasks

5. **Check Vercel function logs:**
   - Go to Vercel Dashboard → Deployments → Functions
   - Click function name → View logs
   - Look for slow operations

#### Issue 5: CORS Errors

**Symptoms:**
```
❌ Access to fetch blocked by CORS policy
❌ No 'Access-Control-Allow-Origin' header present
❌ CORS error in browser console
```

**Root Causes:**
- Railway backend not configured to allow Vercel domain
- `CORS_ORIGINS` not set or incorrect format
- Preflight OPTIONS request failing
- Mixed HTTP/HTTPS

**Solutions:**

1. **Set CORS_ORIGINS in Railway:**
   ```bash
   railway variables set CORS_ORIGINS=https://your-project.vercel.app,https://www.yourdomain.com
   railway service restart fastapi-server
   ```

2. **Verify CORS configuration in code:**
   Check `server/main.py` has CORS middleware:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Test CORS with curl:**
   ```bash
   curl -H "Origin: https://your-project.vercel.app"      -H "Access-Control-Request-Method: POST"      -H "Access-Control-Request-Headers: Content-Type"      -X OPTIONS      https://your-app.railway.app/api/test
   
   # Should return:
   # Access-Control-Allow-Origin: https://your-project.vercel.app
   # Access-Control-Allow-Methods: POST
   ```

4. **Check browser console:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Look for failed OPTIONS requests (preflight)
   - Check response headers

5. **Temporary wildcard (testing only):**
   ```bash
   # For testing only, DO NOT use in production
   railway variables set CORS_ORIGINS=*
   railway service restart fastapi-server
   ```

6. **Ensure HTTPS on both ends:**
   - Vercel: Always HTTPS (automatic)
   - Railway: Always HTTPS (automatic)
   - Do NOT mix HTTP and HTTPS

#### Issue 6: Port Conflicts (Local Development)

**Symptoms:**
```
❌ Address already in use: 0.0.0.0:8000
❌ OSError: [Errno 48] Address already in use
```

**Solutions:**

1. **Find process using port:**
   ```bash
   # On Linux/Mac
   lsof -i :8000
   
   # On Windows
   netstat -ano | findstr :8000
   ```

2. **Kill process:**
   ```bash
   # On Linux/Mac
   kill -9 <PID>
   
   # On Windows
   taskkill /PID <PID> /F
   ```

3. **Use different port:**
   ```bash
   # Run on different port
   uvicorn server.main:app --port 8001
   
   # Or set PORT environment variable
   PORT=8001 uvicorn server.main:app
   ```

#### Issue 7: Database Migration Failures

**Symptoms:**
```
❌ relation "payments" does not exist
❌ column "payment_id" does not exist
❌ syntax error at or near "CREATE"
```

**Solutions:**

1. **Verify migration file exists:**
   ```bash
   ls -la supabase_migrations/001_payments_schema.sql
   ```

2. **Run migration in Supabase SQL Editor:**
   - Copy entire contents of `supabase_migrations/001_payments_schema.sql`
   - Paste into Supabase SQL Editor
   - Click "Run"
   - Check for errors in output

3. **Check if tables already exist:**
   ```sql
   -- In Supabase SQL Editor
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

4. **Drop and recreate (CAUTION: Deletes data!):**
   ```sql
   -- Only use in development/testnet!
   DROP TABLE IF EXISTS payments CASCADE;
   DROP TABLE IF EXISTS transactions CASCADE;
   DROP TABLE IF EXISTS logical_accounts CASCADE;
   
   -- Then re-run migration
   ```

5. **Check Supabase logs:**
   - Go to Supabase Dashboard → Database → Logs
   - Look for migration errors

#### Issue 8: Environment Variable Not Found

**Symptoms:**
```
❌ KeyError: 'SUPABASE_URL'
❌ Environment variable not set
```

**Solutions:**

1. **List all Railway variables:**
   ```bash
   railway variables
   ```

2. **Set missing variable:**
   ```bash
   railway variables set VARIABLE_NAME=value
   ```

3. **Check variable in Railway Dashboard:**
   - Go to Railway Dashboard → Variables tab
   - Verify all required variables are set

4. **Restart service after adding variables:**
   ```bash
   railway service restart fastapi-server
   ```

#### Issue 9: JWT Token Expired

**Symptoms:**
```
❌ 401 Unauthorized
❌ Token has expired
```

**Solutions:**

1. **Check JWT expiration time:**
   ```python
   # Default is 30 minutes in most configurations
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

2. **Generate new token:**
   ```bash
   # Request new token from auth endpoint
   curl -X POST https://your-app.railway.app/token      -H "Content-Type: application/json"      -d '{"username": "user", "password": "pass"}'
   ```

3. **Increase token expiration (if appropriate):**
   ```bash
   railway variables set JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```

#### Issue 10: SSL/TLS Certificate Errors

**Symptoms:**
```
❌ SSL certificate verify failed
❌ Certificate has expired
```

**Solutions:**

1. **Check Railway SSL status:**
   - Railway provides automatic SSL certificates
   - Check Railway Dashboard → Settings → Domains

2. **Verify domain configuration:**
   ```bash
   # Check SSL certificate
   openssl s_client -connect your-app.railway.app:443 -servername your-app.railway.app
   ```

3. **Clear DNS cache:**
   ```bash
   # On Mac
   sudo dscacheutil -flushcache

   # On Linux
   sudo systemd-resolve --flush-caches
   
   # On Windows
   ipconfig /flushdns
   ```

4. **Wait for DNS propagation:**
   - DNS changes can take 24-48 hours to fully propagate
   - Check DNS status: https://whatsmydns.net

### Debug Commands

Quick reference for debugging:

```bash
# Railway logs
railway logs --tail 100
railway logs --follow

# Railway environment variables
railway variables

# Railway service status
railway status

# Test Railway locally with same environment
railway run python -m uvicorn server.main:app --host 0.0.0.0 --port 8000

# Vercel logs
vercel logs
vercel logs --follow

# Vercel deployment info
vercel ls
vercel inspect

# Test Railway health endpoint
curl https://your-app.railway.app/health | jq

# Test with verbose output
curl -v https://your-app.railway.app/health

# Check SSL certificate
openssl s_client -connect your-app.railway.app:443 -servername your-app.railway.app

# Test WebSocket connection
wscat -c wss://your-app.railway.app/ws/collective-insight

# Check DNS resolution
nslookup your-app.railway.app
dig your-app.railway.app

# Test from different network
curl --interface 0.0.0.0 https://your-app.railway.app/health
```

### Getting Help

If you're still stuck:

1. **Search existing issues**: [github.com/onenoly1010/pi-forge-quantum-genesis/issues](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues)
2. **Check platform status**:
   - Railway: [status.railway.app](https://status.railway.app)
   - Vercel: [vercel-status.com](https://www.vercel-status.com)
   - Supabase: [status.supabase.com](https://status.supabase.com)
3. **Review documentation**:
   - Railway Docs: [docs.railway.app](https://docs.railway.app)
   - Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
   - Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
   - Pi Network Docs: [developers.minepi.com](https://developers.minepi.com)
4. **Open a new issue**: Provide logs, error messages, and steps to reproduce

---

## 🔄 Maintenance & Monitoring

### Regular Maintenance Tasks

#### Daily

- [ ] Check Railway logs for errors
  ```bash
  railway logs --tail 100 | grep -i error
  ```
- [ ] Monitor Pi Network payment webhooks
  ```bash
  railway logs | grep -i "webhook received"
  ```
- [ ] Verify health endpoints responding
  ```bash
  curl https://your-app.railway.app/health
  curl https://your-project.vercel.app
  ```

#### Weekly

- [ ] Review Supabase usage metrics
  - Go to Supabase Dashboard → Settings → Usage
  - Check database size, bandwidth, API requests
- [ ] Check Railway credit usage
  - Go to Railway Dashboard → Usage
  - Monitor monthly spend
- [ ] Test full payment flow (testnet)
  ```bash
  # Test payment approval
  curl -X POST https://your-app.railway.app/api/payments/approve     -H "Content-Type: application/json"     -H "Authorization: Bearer YOUR_JWT"     -d '{"payment_id": "test_123", "amount": 0.15}'
  curl -X POST https://your-app.railway.app/api/payments/approve      -H "Content-Type: application/json"      -H "Authorization: Bearer YOUR_JWT"      -d '{"payment_id": "test_123", "amount": 0.15}'
  ```
- [ ] Review deployment logs
  - Railway: Check for warnings
  - Vercel: Check build performance

#### Monthly

- [ ] Update dependencies
  ```bash
  # Check outdated packages
  npm audit
  pip list --outdated
  
  # Update and test
  npm update
  pip install --upgrade -r server/requirements.txt
  ```
- [ ] Review and rotate secrets
  ```bash
  # Generate new JWT_SECRET
  openssl rand -hex 32
  
  # Update in Railway
  railway variables set JWT_SECRET=new-secret
  ```
- [ ] Test disaster recovery procedures
  - Backup Supabase database
  - Test restoring from backup
  - Document recovery time
- [ ] Review database backups
  - Go to Supabase Dashboard → Database → Backups
  - Verify automatic backups enabled
  - Test restore process

### Monitoring Endpoints

#### Health Checks

```bash
# Railway health
curl https://your-app.railway.app/health

# Expected response:
{
  "status": "healthy",
  "service": "FastAPI Quantum Conduit",
  "port": 8000,
  "supabase_connected": true,
  "pi_network_mode": "mainnet",
  "timestamp": 1734739200.123
}
```

#### Detailed Status

```bash
# Railway detailed status
curl https://your-app.railway.app/api/status

# Expected response:
{
  "service": "FastAPI Quantum Conduit",
  "version": "1.0.0",
  "status": "operational",
  "uptime_seconds": 3600,
  "database": {
    "connected": true,
    "response_time_ms": 15
  },
  "pi_network": {
    "mode": "mainnet",
    "api_accessible": true
  }
}
```

#### Database Health

```bash
# Test database connection
curl https://your-app.railway.app/api/db/health

# Expected response:
{
  "status": "connected",
  "pool_size": 10,
  "available_connections": 8
}
```

#### Pi Network Status

```bash
# Check Pi Network integration
curl https://your-app.railway.app/api/pi-network/status

# Expected response:
{
  "mode": "mainnet",
  "connected": true,
  "app_id": "your-app-id",
  "api_configured": true,
  "webhook_configured": true,
  "mainnet_ready": true
}
```

### Setting Up Alerts

#### Railway Alerts

1. Go to Railway Dashboard → Project → Settings → Notifications
2. Enable deployment notifications:
   - Deploy started
   - Deploy succeeded
   - Deploy failed
   - Service crashed
3. Add notification channels:
   - Email
   - Slack webhook
   - Discord webhook

#### Supabase Alerts

1. Go to Supabase Dashboard → Database → Webhooks
2. Create webhook for critical events:
   - Database approaching storage limit
   - High CPU usage
   - Failed queries spike
3. Configure webhook URL (can point to Railway backend)

#### Custom Guardian Alerts

Configure Guardian alerts in Railway:

```bash
railway variables set GUARDIAN_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

Guardian alerts will notify you of:
- Payment processing errors
- Database connection failures
- Pi Network API issues
- High error rates

### Backup Procedures

#### Database Backups (Supabase)

**Automatic Backups:**
1. Go to Supabase Dashboard → Database → Backups
2. Enable automatic daily backups (included in Pro plan)
3. Set retention period (7 days, 14 days, 30 days)

**Manual Backup:**
```bash
# Export database to SQL file
pg_dump -h db.your-project.supabase.co   -U postgres   -d postgres   --clean --if-exists   > backup_$(date +%Y%m%d).sql

# Or use Supabase CLI
supabase db dump -f backup_$(date +%Y%m%d).sql
```

**Test Restore:**
```bash
# Restore from backup (on test database!)
psql -h db.your-test-project.supabase.co   -U postgres   -d postgres   < backup_20241221.sql

# Or use Supabase CLI
supabase db push --dry-run
```

#### Configuration Backups

All configuration is version-controlled in Git:

```bash
# Backup configuration files
git pull origin main

# Export Railway environment variables
railway variables > railway_vars_backup_$(date +%Y%m%d).txt

# IMPORTANT: Do not commit railway_vars_backup.txt!
# Store securely offline
```

#### Disaster Recovery Checklist

- [ ] Supabase database backup tested monthly
- [ ] Railway environment variables documented
- [ ] Vercel project configuration documented
- [ ] Pi Developer Portal credentials stored securely
- [ ] Recovery procedure documented and tested
- [ ] Recovery time objective (RTO): < 1 hour
- [ ] Recovery point objective (RPO): < 24 hours


---

## 🔗 Navigation

- [🏠 Back to README](../README.md)
- [📖 Start Here](./QUICK_START.md)
- [🏗️ Architecture](./ARCHITECTURE.md)
- [🔐 Security](./VERIFICATION.md)
- [🤖 API Reference](./API.md)

---

**Remember**: This dashboard is a living document. As you discover issues or improvements, update this guide to help future deployments. Sovereignty through shared knowledge! 🌌✨
