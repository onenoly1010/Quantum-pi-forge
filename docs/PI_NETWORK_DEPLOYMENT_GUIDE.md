# 🚀 Pi Network Mainnet Integration - Deployment Guide

> **📌 Note**: This document is part of the deployment documentation suite.  
> For the complete deployment guide, see the **[Deployment Dashboard](./DEPLOYMENT_DASHBOARD.md)**.

## Overview

This guide covers deploying Pi Forge Quantum Genesis with full Pi Network mainnet payment integration.

## ✅ Prerequisites

### 1. Pi Network Developer Account
- [ ] Register at [https://developer.pi](https://developer.pi)
- [ ] Create a mainnet app
- [ ] Obtain your **App ID** and **API Key**
- [ ] Configure webhook URL in Pi Developer Portal

### 2. Supabase Database
- [ ] Create a Supabase project
- [ ] Run the payments schema migration
- [ ] Configure Row Level Security (RLS) policies

### 3. Deployment Platform
- [ ] Railway/Vercel/Netlify account
- [ ] SSL certificate (automatic on most platforms)
- [ ] Custom domain (recommended for production)

---

## 📋 Step-by-Step Setup

### Step 1: Database Setup

1. **Apply Supabase Migration:**
```bash
# Navigate to Supabase SQL Editor
# Copy and execute: supabase_migrations/001_payments_schema.sql
```

2. **Verify Tables Created:**
```sql
-- Check if payments table exists
SELECT * FROM payments LIMIT 1;

-- Check views
SELECT * FROM payment_analytics LIMIT 1;
SELECT * FROM user_payment_summary LIMIT 1;
```

### Step 2: Environment Configuration

1. **Copy `.env.example` to `.env`:**
```bash
cp .env.example .env
```

2. **Configure CRITICAL environment variables:**

```bash
# Supabase (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=generate-secure-random-string

# Pi Network (REQUIRED for mainnet)
PI_NETWORK_MODE=mainnet
PI_NETWORK_APP_ID=your-mainnet-app-id
PI_NETWORK_API_KEY=your-mainnet-api-key
PI_NETWORK_API_ENDPOINT=https://api.minepi.com
PI_SANDBOX_MODE=false

# Webhook Security (REQUIRED)
PI_NETWORK_WEBHOOK_SECRET=your-webhook-secret

# Optional - Only if sending Pi to users
PI_NETWORK_WALLET_PRIVATE_KEY=your-wallet-private-key
```

### Step 3: Pi Developer Portal Configuration

1. **Configure Payment Callbacks:**
   - Go to Pi Developer Portal > Your App > Settings
   - Set **Payment Completion Callback URL**: `https://your-domain.com/api/payments/complete`
   - Set **Webhook URL**: `https://your-domain.com/api/pi-webhooks/payment`
   - Generate and save **Webhook Secret**

2. **App Permissions:**
   - Enable `payments` scope
   - Enable `username` scope (optional)
   - Enable `wallet_address` scope (optional)

### Step 4: Deploy to Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and Link Project:**
```bash
railway login
railway link
```

3. **Set Environment Variables:**
```bash
# Set all variables from .env
railway variables set SUPABASE_URL=https://...
railway variables set SUPABASE_KEY=...
railway variables set PI_NETWORK_MODE=mainnet
railway variables set PI_NETWORK_APP_ID=...
railway variables set PI_NETWORK_API_KEY=...
railway variables set PI_NETWORK_WEBHOOK_SECRET=...
```

4. **Deploy:**
```bash
railway up
```

### Step 5: Verify Deployment

1. **Check Health Endpoint:**
```bash
curl https://your-domain.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "FastAPI Quantum Conduit",
  "supabase_connected": true,
  "timestamp": 1702345678.123
}
```

2. **Check Pi Network Status:**
```bash
curl https://your-domain.com/api/pi-network/status
```

Expected response:
```json
{
  "network": "mainnet",
  "sandbox_mode": false,
  "api_configured": true,
  "app_configured": true,
  "mainnet_ready": true,
  "timestamp": 1702345678.123
}
```

---

## 🔐 Security Checklist

### Before Going Live:

- [ ] **SSL/TLS enabled** (automatic on Railway/Vercel)
- [ ] **Environment variables secured** (never commit to git)
- [ ] **Webhook secret configured** for signature verification
- [ ] **Row Level Security enabled** in Supabase
- [ ] **Rate limiting configured** (built-in, 60 req/min per IP)
- [ ] **CORS configured** for your frontend domain only
- [ ] **Monitoring enabled** (logs, alerts, metrics)

### Production Best Practices:

```bash
# Enable production mode
DEBUG=false
LOG_LEVEL=INFO
ENVIRONMENT=production

# Use strong JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Restrict CORS origins
CORS_ORIGINS=https://quantumpiforge.com,https://www.quantumpiforge.com
```

---

## 🧪 Testing Payment Flow

### 1. Test in Sandbox First:

```bash
# Use sandbox mode for testing
PI_NETWORK_MODE=testnet
PI_SANDBOX_MODE=true
PI_NETWORK_APP_ID=your-sandbox-app-id
PI_NETWORK_API_KEY=your-sandbox-api-key
```

### 2. Test Payment Endpoints:

```bash
# Approve payment
curl -X POST https://your-domain.com/api/payments/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "payment_id": "test_payment_123",
    "amount": 0.15,
    "user_id": "user_uuid",
    "metadata": {"type": "mining_boost"}
  }'

# Complete payment
curl -X POST https://your-domain.com/api/payments/complete \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "test_payment_123",
    "txid": "blockchain_tx_hash"
  }'
```

### 3. Monitor Logs:

```bash
# Railway logs
railway logs

# Check for:
# ✅ "Payment approved: payment_id"
# ✅ "Payment completed: payment_id"
# 📨 "Webhook received: completed for payment payment_id"
```

---

## 📊 Database Queries for Monitoring

### Check Payment Status:
```sql
SELECT 
    payment_id, 
    status, 
    amount, 
    resonance_state,
    created_at,
    completed_at
FROM payments 
ORDER BY created_at DESC 
LIMIT 10;
```

### Payment Analytics:
```sql
SELECT 
    payment_date,
    status,
    payment_count,
    total_amount,
    avg_amount
FROM payment_analytics
WHERE payment_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY payment_date DESC;
```

### User Statistics:
```sql
SELECT 
    u.email,
    ups.total_payments,
    ups.completed_payments,
    ups.total_pi_spent
FROM user_payment_summary ups
JOIN auth.users u ON u.id = ups.user_id
ORDER BY total_pi_spent DESC
LIMIT 10;
```

---

## 🚨 Troubleshooting

### Issue: "PI_NETWORK_API_KEY not set"
**Solution:** 
```bash
railway variables set PI_NETWORK_API_KEY=your-actual-key
railway restart
```

### Issue: "Invalid webhook signature"
**Solution:**
1. Verify webhook secret matches Pi Developer Portal
2. Check `PI_NETWORK_WEBHOOK_SECRET` environment variable
3. Ensure webhook URL uses HTTPS

### Issue: "Payment approval failed"
**Solution:**
1. Check Pi Network API status
2. Verify payment_id is valid
3. Check payment amount matches
4. Review logs: `railway logs | grep "Payment approval"`

### Issue: "Database error on payment insert"
**Solution:**
1. Verify Supabase migration ran successfully
2. Check RLS policies allow inserts
3. Ensure user is authenticated

---

## 🔄 Switching from Testnet to Mainnet

### When Ready for Production:

1. **Update Environment Variables:**
```bash
railway variables set PI_NETWORK_MODE=mainnet
railway variables set PI_SANDBOX_MODE=false
railway variables set PI_NETWORK_APP_ID=mainnet-app-id
railway variables set PI_NETWORK_API_KEY=mainnet-api-key
```

2. **Update Pi Developer Portal:**
   - Switch app to mainnet mode
   - Update webhook URLs to production domain
   - Regenerate webhook secret

3. **Redeploy:**
```bash
railway up
```

4. **Verify:**
```bash
curl https://your-domain.com/api/pi-network/status
# Should show: "network": "mainnet"
```

---

## 📈 Monitoring & Analytics

### Key Metrics to Track:

1. **Payment Success Rate:** `completed_payments / total_payments`
2. **Average Payment Amount:** From `payment_analytics`
3. **Payment Processing Time:** Check `processing_time_ns` in responses
4. **Webhook Delivery:** Monitor webhook endpoint logs

### Set Up Alerts:

```bash
# Monitor payment failures
SELECT COUNT(*) FROM payments 
WHERE status = 'failed' 
AND created_at >= NOW() - INTERVAL '1 hour';
```

---

## ✅ Go-Live Checklist

- [ ] Database schema deployed to Supabase
- [ ] All environment variables configured
- [ ] Pi Developer Portal webhooks configured
- [ ] SSL certificate active (HTTPS)
- [ ] Sandbox testing completed successfully
- [ ] Mainnet credentials added
- [ ] Frontend updated with production domain
- [ ] Monitoring and logging enabled
- [ ] Backup strategy in place
- [ ] Team has access to deployment logs

---

## 📞 Support Resources

- **Pi Network Docs:** [https://developers.minepi.com](https://developers.minepi.com)
- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **Railway Docs:** [https://docs.railway.app](https://docs.railway.app)
- **Pi Forge GitHub:** [https://github.com/onenoly1010/pi-forge-quantum-genesis](https://github.com/onenoly1010/pi-forge-quantum-genesis)

---

## 🎉 Success!

Once all steps are complete, your Pi Network mainnet integration is live! Users can now make payments directly through the Pi Browser, and your app will process them securely with full blockchain verification.

**Next Steps:**
- Monitor initial transactions closely
- Gather user feedback
- Optimize payment flow based on analytics
- Scale infrastructure as needed
