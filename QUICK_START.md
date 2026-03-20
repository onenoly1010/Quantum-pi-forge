# 🚀 Pi Network Mainnet - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
pip install -r server/requirements.txt
```

### 2. Setup Database
```bash
# Copy SQL to Supabase SQL Editor and execute:
cat supabase_migrations/001_payments_schema.sql
```

### 3. Configure Environment
```bash
# Copy and edit .env file
cp .env.example .env

# Required variables:
export PI_NETWORK_MODE=mainnet
export PI_NETWORK_APP_ID=your-app-id
export PI_NETWORK_API_KEY=your-api-key
export PI_NETWORK_WEBHOOK_SECRET=your-webhook-secret
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_KEY=your-anon-key
```

### 4. Configure Pi Developer Portal
```
1. Go to: https://developer.pi
2. App Settings → Webhook URL: https://your-domain.com/api/pi-webhooks/payment
3. Generate webhook secret → Add to .env as PI_NETWORK_WEBHOOK_SECRET
```

### 5. Deploy
```bash
railway up
# or
vercel deploy
```

---

## 🧪 Test in Sandbox First

```bash
# Use sandbox mode for testing
export PI_NETWORK_MODE=testnet
export PI_SANDBOX_MODE=true
export PI_NETWORK_APP_ID=sandbox-app-id
export PI_NETWORK_API_KEY=sandbox-api-key

# Run server
uvicorn server.main:app --reload
```

---

## 📋 Verification Checklist

Run the test script:
```bash
./scripts/test_pi_integration.sh
```

Should show: **✅ ALL TESTS PASSED! 10/10**

---

## 🎯 API Endpoints

### Payment Flow:
1. `POST /api/payments/approve` - Approve payment
2. `POST /api/payments/complete` - Complete payment
3. `POST /api/pi-webhooks/payment` - Webhook receiver

### Testing:
- `GET /api/pi-network/status` - Check configuration
- `GET /health` - Server health

---

## 🔑 Required Environment Variables

```bash
# Critical for mainnet
PI_NETWORK_MODE=mainnet
PI_NETWORK_APP_ID=required
PI_NETWORK_API_KEY=required
PI_NETWORK_WEBHOOK_SECRET=required

# Database
SUPABASE_URL=required
SUPABASE_KEY=required
JWT_SECRET=required
```

---

## 📚 Documentation

- **Full Deployment Guide:** [docs/PI_NETWORK_DEPLOYMENT_GUIDE.md](docs/PI_NETWORK_DEPLOYMENT_GUIDE.md)
- **API Reference:** [docs/PI_PAYMENT_API_REFERENCE.md](docs/PI_PAYMENT_API_REFERENCE.md)
- **Implementation Summary:** [MAINNET_INTEGRATION_COMPLETE.md](MAINNET_INTEGRATION_COMPLETE.md)

---

## 🆘 Troubleshooting

**"PI_NETWORK_API_KEY not set"**
```bash
railway variables set PI_NETWORK_API_KEY=your-key
```

**"Invalid webhook signature"**
- Check PI_NETWORK_WEBHOOK_SECRET matches Pi Portal
- Verify webhook URL is HTTPS

**Database errors**
- Run migration: `supabase_migrations/001_payments_schema.sql`
- Check RLS policies

---

## ✅ Go Live

When ready for production:
```bash
# Switch to mainnet
export PI_NETWORK_MODE=mainnet
export PI_SANDBOX_MODE=false

# Use production credentials
export PI_NETWORK_APP_ID=mainnet-app-id
export PI_NETWORK_API_KEY=mainnet-api-key

# Deploy
railway up
```

Verify:
```bash
curl https://your-domain.com/api/pi-network/status
# Should show: "mainnet_ready": true
```

---

## 🎉 You're Ready!

Your Pi Network mainnet integration is complete and production-ready!

**Test Payment:**
1. Open app in Pi Browser
2. Initiate payment (amount: 0.15 Pi)
3. Approve in Pi app
4. Verify in database: `SELECT * FROM payments ORDER BY created_at DESC LIMIT 1;`

---

**Need Help?** See [docs/PI_NETWORK_DEPLOYMENT_GUIDE.md](docs/PI_NETWORK_DEPLOYMENT_GUIDE.md)
