# 🚀 Manual Deployment Guide - Railway Web Dashboard

> **📌 Note**: This document is part of the deployment documentation suite.  
> For the complete deployment guide, see the **[Deployment Dashboard](docs/DEPLOYMENT_DASHBOARD.md)**.

## Quick Deploy (No CLI Required)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "🚀 Pi Network mainnet integration complete"
git push origin main
```

### Step 2: Deploy via Railway Dashboard

1. **Go to:** https://railway.app/dashboard
2. **Click:** "New Project"
3. **Select:** "Deploy from GitHub repo"
4. **Choose:** `onenoly1010/pi-forge-quantum-genesis`
5. **Click:** "Deploy Now"

### Step 3: Set Environment Variables

In Railway Dashboard → Your Project → Variables, add:

```bash
# Required - Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=generate-secure-random-string

# Required - Pi Network Mainnet
PI_NETWORK_MODE=mainnet
PI_NETWORK_APP_ID=your-mainnet-app-id
PI_NETWORK_API_KEY=your-mainnet-api-key
PI_NETWORK_API_ENDPOINT=https://api.minepi.com
PI_SANDBOX_MODE=false

# Required - Webhook Security
PI_NETWORK_WEBHOOK_SECRET=your-webhook-secret

# Optional
DEBUG=false
LOG_LEVEL=INFO
ENVIRONMENT=production
```

### Step 4: Deploy
- Railway will automatically build and deploy
- Watch the deployment logs
- Get your deployment URL: `https://your-app.railway.app`

### Step 5: Run Database Migration

1. Go to: https://app.supabase.com
2. Select your project
3. SQL Editor → New Query
4. Copy and paste: `supabase_migrations/001_payments_schema.sql`
5. Click "Run"

### Step 6: Configure Pi Developer Portal

1. Go to: https://developer.pi
2. Your App → Settings
3. Set Webhook URL: `https://your-app.railway.app/api/pi-webhooks/payment`
4. Generate webhook secret
5. Copy secret to Railway environment variables: `PI_NETWORK_WEBHOOK_SECRET`

### Step 7: Verify Deployment

```bash
# Test health
curl https://your-app.railway.app/health

# Test Pi Network status
curl https://your-app.railway.app/api/pi-network/status
```

## ✅ You're Live!

Your Pi Network mainnet integration is deployed! 🎉

---

## Alternative: Deploy via Git

If you have Railway connected to your GitHub:

```bash
git add .
git commit -m "🚀 Deploy mainnet"
git push origin main
```

Railway will auto-deploy from your connected repo.

---

## Need Help?

- **Documentation:** See `docs/PI_NETWORK_DEPLOYMENT_GUIDE.md`
- **API Reference:** See `docs/PI_PAYMENT_API_REFERENCE.md`
- **Railway Docs:** https://docs.railway.app
