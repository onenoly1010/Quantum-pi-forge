# Railway Deployment Instructions for Backend Services

## ✅ Prerequisites

- [ ] Railway account created: https://railway.app
- [ ] GitHub account connected to Railway
- [ ] Backend repository ready (e.g., oinio-server)
- [ ] Dockerfile or buildpack auto-detection configured
- [ ] Environment variables documented

## 🚀 Step 1: Create Railway Service

### Option A: Web UI (Easiest)

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Find and select `onenoly1010/oinio-server` (or your backend repo)
5. Select `main` branch
6. Click "Deploy"

### Option B: CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend repo
cd /path/to/oinio-server

# Initialize Railway project
railway init

# Deploy
railway up
```

## 🏗️ Step 2: Configure Build Settings

In Railway dashboard → Project → Settings → Deployments:

```
Build Command: npm run build
Start Command: npm start
Port: 3000 (or your app port)
Node Version: 20 (or specify in .node-version)
```

## 🔐 Step 3: Add Environment Variables

### In Railway Dashboard:

1. Go to Project → Variables
2. Add each environment variable:

```
DATABASE_URL = postgresql://user:pass@host:5432/dbname
SUPABASE_URL = https://xxx.supabase.co
SUPABASE_KEY = xxxxx
NODE_ENV = production
CORE_URL = https://api.quantumpiforge.com
COINBASE_API_KEY = xxxxx
ETHERSCAN_API_KEY = xxxxx
```

### For Secrets (API keys, credentials):

Use Railway's secret variables (prefixed with $):

```bash
railway variable add PRIVATE_KEY $PRIVATE_KEY_VALUE
railway variable add JWT_SECRET $JWT_SECRET_VALUE
```

Or copy-paste in UI and Railway auto-encrypts them.

## 🗄️ Step 4: Add PostgreSQL Database (if needed)

1. In Railway dashboard → Create new service
2. Select "Database" → "PostgreSQL"
3. Railway auto-creates `DATABASE_URL` variable
4. Migrations run automatically (if configured)

To connect to database from another service:
```
DATABASE_URL: ${{ DATABASE_URL }}  # Railway auto-fills from database service
```

## 🌍 Step 5: Bind Custom Domain

### In Railway Dashboard:

1. Go to Project → Deployments → [Your deployment]
2. Under "Networking" → "Domains"
3. Click "Generate Domain" or "Add Custom Domain"
4. Enter: `api.quantumpiforge.com`

If using custom domain:
- Add CNAME record in Cloudflare DNS pointing to Railway domain
- Or Railway can manage DNS if domain transferred to Railway

```
# In Cloudflare DNS:
api.quantumpiforge.com → CNAME → yourapp.railway.app
```

## 📝 Step 6: Configure Dockerfile (if not auto-detected)

Create `Dockerfile` in repo root:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build if needed
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
```

Railway will auto-detect and use this.

## 🚀 Step 7: Deploy on Every Push

Railway auto-deploys on push to main. To control this:

1. Go to Project → Settings → Deploy on Push
2. Toggle "ON" to auto-deploy
3. Select branch (usually `main`)

## ✨ Step 8: Test Deployment

```bash
# Get the Railway domain URL
railway domain

# Test the endpoint
curl https://yourapp.railway.app/health

# Or test custom domain if configured
curl https://api.quantumpiforge.com/health

# Check logs in Railway dashboard or via CLI
railway logs --follow
```

## 🔄 Step 9: CI/CD Pipeline

Create `.github/workflows/deploy-railway.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches:
      - main
    paths:
      - 'oinio-server/**'  # Only deploy if backend code changes

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Get your Railway token: https://dashboard.railway.app/account/tokens

## 📊 Step 10: Monitor & Logs

### In Railway Dashboard:

1. Click "Logs" tab to see real-time logs
2. Click "Health" to see uptime/metrics
3. Click "Settings" for advanced config

### Via CLI:

```bash
# Follow logs in real-time
railway logs --follow

# Get specific number of logs
railway logs --lines 100

# Export logs
railway logs > logs.txt
```

## 🔗 Integrations with Cloudflare Pages

The frontend (on Cloudflare Pages) needs to call backend APIs on Railway:

### In Frontend Environment Variables

```
NEXT_PUBLIC_API_URL=https://api.quantumpiforge.com
```

### In API Calls

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

fetch(`${apiUrl}/v1/intents`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### CORS Configuration (if needed)

In backend `server.js` or `main.ts`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://quantumpiforge.com', 'https://quantumpiforge.pages.dev'],
  credentials: true
}));
```

## 🐛 Troubleshooting

### Build fails

```bash
# Check Node version
node --version  # Should be v20 or match Railway config

# Clean dependencies
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build
npm start
```

### Deployment won't trigger

```bash
# Check Railway token
railway whoami

# Re-authorize if needed
railway login --force

# Manual deploy
railway up
```

### Environment variables not working

1. Verify you're accessing them correctly:
   - Server-side: `process.env.VARIABLE_NAME`
   - Client-side: `process.env.NEXT_PUBLIC_NAME` (only)

2. Check Railway dashboard → Variables → verify they're set

3. Redeploy after changing variables:
   ```bash
   railway redeploy
   ```

### Domain not resolving

```bash
# If using custom domain, verify DNS in Cloudflare:
nslookup api.quantumpiforge.com

# Should show Railway nameservers or CNAME
```

### Cannot connect to database

1. Verify `DATABASE_URL` is set in Railway variables
2. Check PostgreSQL service exists in Railway project
3. Test connection locally with CLI tools
4. Check firewall rules in Railway dashboard

## 📋 Deployment Verification Checklist

- [ ] Build completes without errors
- [ ] Application starts successfully
- [ ] Custom domain resolves
- [ ] HTTPS certificate is valid
- [ ] Environment variables are accessible
- [ ] Database connection works (if applicable)
- [ ] API endpoints respond with 200 status
- [ ] CORS configured correctly if needed
- [ ] Logs show no errors
- [ ] Frontend can communicate with backend

## 🔗 Useful Links

- Railway Dashboard: https://dashboard.railway.app
- Railway Docs: https://docs.railway.app
- Railway CLI: https://github.com/railwayapp/cli

