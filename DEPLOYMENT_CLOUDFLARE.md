# Cloudflare Pages Deployment Instructions

## ✅ Prerequisites

- [ ] Wrangler CLI installed: `npm install -g wrangler`
- [ ] Cloudflare account ready
- [ ] API token generated in Cloudflare dashboard
- [ ] GitHub repo connected to Cloudflare (if auto-deploy preferred)
- [ ] quantumpiforge.com domain in Cloudflare account

## 🚀 Step 1: Configure Wrangler Authentication

```bash
# Login to Cloudflare
wrangler login

# This opens your browser to authorize Cloudflare API access
```

If `wrangler login` fails, use API token method:

```bash
# Export your Cloudflare API token
export CLOUDFLARE_API_TOKEN="your_long_api_token_here"

# Verify authentication
wrangler whoami
```

Get your API token from: https://dash.cloudflare.com/profile/api-tokens

## 🏗️ Step 2: Build for Cloudflare Pages

```bash
cd /home/kris/forge/Quantum-pi-forge

# Build for Cloudflare Pages (outputs to ./out)
npm run build:cf

# Verify output exists
ls -la out/
```

Expected output directory structure:
```
out/
├── index.html
├── _next/
│   ├── static/
│   ├── data/
│   └── ...
├── favicon.ico
└── ...
```

## 🌐 Step 3: Deploy to Cloudflare Pages

### Option A: Direct Deployment (One-time)

```bash
# Deploy the out/ directory
wrangler pages deploy out --project-name quantumpiforge

# Output should show:
# ✌️  Uploading... [████████████] 100%
# ✓ Uploaded quantumpiforge along with 245 files
# ✓ Deployment complete! https://quantumpiforge.pages.dev
```

### Option B: GitHub Auto-Deploy (Recommended)

1. Go to Cloudflare Dashboard → Pages → Create project
2. Select "Connect to Git" → GitHub
3. Connect github.com/onenoly1010/Quantum-pi-forge
4. Production branch: `main`
5. Build command: `npm run build:cf`
6. Build output directory: `out`
7. Click "Save and Deploy"

Cloudflare will auto-deploy on every push to main.

## 🔒 Step 4: Configure Environment Variables

### In Cloudflare Dashboard:

1. Go to Pages → quantumpiforge → Settings → Environment variables
2. Add Production variables:
   ```
   CORE_URL = https://api.quantumpiforge.com
   NODE_NAME = oinio-mainnet-1
   DEFAULT_MODEL = llama3.2:latest
   ```
3. Click "Save"

### Or via CLI:

```bash
# Set production environment variables
wrangler pages deployment tail \
  --env production \
  quantumpiforge

# Use the Pages secret command if needed
wrangler pages secret put CORE_URL --text https://api.quantumpiforge.com --env production
```

## 🌍 Step 5: Bind Custom Domain (quantumpiforge.com)

### In Cloudflare Dashboard:

1. Go to Pages → quantumpiforge → Custom domains
2. Click "Add custom domain"
3. Enter: `quantumpiforge.com`
4. Click "Continue"
5. Verify ownership (usually auto-verified if you own the domain in Cloudflare)
6. Click "Activate domain"

### Verify DNS:

```bash
# Should resolve to Cloudflare Pages
dig +short quantumpiforge.com

# Should show Cloudflare IP addresses like:
# 104.21.x.x
# 172.67.x.x
```

## ✨ Step 6: Test Deployment

```bash
# Test the pages.dev URL first
curl https://quantumpiforge.pages.dev

# Then test custom domain
curl https://quantumpiforge.com

# Check certificate
openssl s_client -connect quantumpiforge.com:443 < /dev/null | grep -A 5 "subject="
```

Expected: HTTP 200 + Page loads + Valid SSL certificate

## 🔄 Step 7: Set Up Auto-Deploy Workflow

Create `.github/workflows/deploy-cloudflare-pages.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for Cloudflare Pages
        run: npm run build:cf
      
      - name: Deploy to Cloudflare Pages
        run: wrangler pages deploy out --project-name quantumpiforge
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Add GitHub Secrets:

1. Go to github.com/onenoly1010/Quantum-pi-forge → Settings → Secrets and variables
2. Add `CLOUDFLARE_API_TOKEN` (from Your Profile → API Tokens)
3. Add `CLOUDFLARE_ACCOUNT_ID` (from Cloudflare dashboard top-right)

## 🐛 Troubleshooting

### Build fails locally

```bash
# Clean and rebuild
rm -rf .next out node_modules
npm install
npm run build:cf
```

### Deployment fails

```bash
# Check wrangler auth
wrangler whoami

# Re-authenticate if needed
wrangler login

# Check project name exists in Cloudflare
wrangler pages project list
```

### Domain not resolving

```bash
# Force DNS update (may take 10-60 minutes)
nslookup quantumpiforge.com

# Check Cloudflare DNS records
# If needed, add A records pointing to Cloudflare Pages:
# @ → A → 104.21.x.x (Cloudflare anycast)
```

### Pages show "404 Not Found"

- Ensure `wrangler.toml` has `pages_build_output_dir = "out"`
- Ensure `next.config.js` has `output: 'export'`
- Verify `out/` directory has `index.html` after build

## 📋 Deployment Verification Checklist

- [ ] Build completes without errors (`npm run build:cf`)
- [ ] `out/` directory exists with content
- [ ] Initial deployment succeeds
- [ ] `quantumpiforge.pages.dev` loads
- [ ] Custom domain `quantumpiforge.com` resolves
- [ ] HTTPS certificate is valid
- [ ] Environment variables are set
- [ ] No 404 errors on homepage
- [ ] No console errors in DevTools
- [ ] Links and navigation work correctly

## 🔗 Useful Links

- Cloudflare Pages Dashboard: https://dash.cloudflare.com/
- Wrangler CLI Docs: https://developers.cloudflare.com/workers/wrangler/
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/

