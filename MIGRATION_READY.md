# ✅ MIGRATION PREP COMPLETE - Ready to Execute

**Date Prepared**: March 31, 2026  
**Status**: ✅ All prerequisites & documentation ready  
**Estimated Execution Time**: 4-5 hours  

---

## 📋 What Has Been Prepared

### ✅ Configuration Files Created/Updated

1. **wrangler.toml** (Updated)
   - Production environment routing configured
   - Staging environment configured
   - Build output directory: `./out` (correct for Cloudflare Pages)
   - Environment variables setup structure ready

2. **MIGRATION_PLAN.md** (Created)
   - Complete repository audit & categorization
   - Deployment strategy by platform
   - Environment variables mapping
   - Implementation checklist
   - Rollback procedures

3. **DEPLOYMENT_CLOUDFLARE.md** (Created)
   - Step-by-step Cloudflare Pages setup
   - Wrangler authentication & configuration
   - Custom domain binding
   - GitHub Actions CI/CD workflow
   - Troubleshooting guide

4. **DEPLOYMENT_RAILWAY.md** (Created)
   - Railway backend deployment guide
   - Environment variable configuration
   - CORS setup
   - Database integration (Supabase)
   - Monitoring & logging

5. **DEPLOYMENT_TODAY.md** (Created)
   - Quick reference for immediate actions
   - Phase-by-phase execution guide (7 phases)
   - Verification checklist
   - Critical DNS configuration steps

---

## 🎯 Exact Commands to Execute (Copy & Paste Ready)

### PHASE 1: Verify Setup (5 minutes)

```bash
# Check Wrangler installation
wrangler whoami

# If not installed:
npm install -g @cloudflare/wrangler

# Authenticate (opens browser)
wrangler login
```

### PHASE 2: Build for Cloudflare Pages (10 minutes)

```bash
cd /home/kris/forge/Quantum-pi-forge

# Verify build config
grep "output:" next.config.js

# Build
npm run build:cf

# Verify output
ls -la out/ | head -5

# Should see: index.html, _next/, favicon.ico, etc.
```

### PHASE 3: Deploy to Cloudflare Pages (5 minutes)

```bash
# Deploy to quantumpiforge project
wrangler pages deploy out --project-name quantumpiforge

# Expected output:
# ✌️  Uploading... [████████████] 100%
# ✓ Uploaded quantumpiforge along with XXX files
# ✓ Deployment complete! https://quantumpiforge.pages.dev
```

### PHASE 4: Configure Domain in Cloudflare UI

**Manual steps (browser)**:
1. Go to https://dash.cloudflare.com/
2. Select quantumpiforge.com domain
3. Go to **Pages** → **quantumpiforge** project
4. Click **Custom domains**
5. Add `quantumpiforge.com`
6. Verify/Activate

**Test DNS propagation**:
```bash
# May take 5-15 minutes to propagate
dig quantumpiforge.com
# OR
nslookup quantumpiforge.com

# Should eventually show Cloudflare nameservers/IPs
```

### PHASE 5: Set Environment Variables in Cloudflare

```bash
# Via CLI (if supported):
wrangler pages secret put CORE_URL --env production
# Enter: https://api.quantumpiforge.com

wrangler pages secret put NODE_NAME --env production  
# Enter: oinio-mainnet-1

# OR manually in Cloudflare UI:
# Pages → quantumpiforge → Settings → Environment variables
# Add:
# CORE_URL = https://api.quantumpiforge.com
# NODE_NAME = oinio-mainnet-1
# DEFAULT_MODEL = llama3.2:latest
```

### PHASE 6: Test Deployment

```bash
# Test pages.dev URL
curl -I https://quantumpiforge.pages.dev

# Test custom domain (after DNS propagates)
curl -I https://quantumpiforge.com

# Both should return HTTP/2 200
```

### PHASE 7: Deploy Backend to Railway

```bash
# Manual steps (browser):
# 1. Go to https://railway.app/dashboard
# 2. Click "New Project" → "Deploy from GitHub"
# 3. Find: onenoly1010/oinio-server
# 4. Select main branch → "Deploy"

# OR via CLI:
# npm install -g @railway/cli
# railway login
# cd /path/to/oinio-server
# railway up
```

### PHASE 8: Set Railway Environment Variables

```bash
# Via CLI:
railway variable add DATABASE_URL $DB_URL
railway variable add CORE_URL https://quantumpiforge.com
railway variable add NODE_ENV production

# OR in Railway UI:
# Project → Variables → Add each var
```

### PHASE 9: Configure Railway Custom Domain

**Manual steps (browser)**:
1. Railway Dashboard → Project → Deployments
2. Click your deployment → **Networking** → **Domains**
3. Click "Add Custom Domain" → `api.quantumpiforge.com`
4. Copy CNAME target
5. Add DNS record in Cloudflare:
   ```
   api → CNAME → [railway-provided-domain].railway.app
   ```

### PHASE 10: Cleanup Vercel

```bash
cd /home/kris/forge/Quantum-pi-forge

# Remove old Vercel files
rm -f vercel.json .vercelignore
rm -rf vercel-backup

# Commit
git add -A
git commit -m "chore: remove Vercel config, migrate to Cloudflare Pages + Railway"
git push origin main
```

---

## 📊 Current State of Repos

### Main Repo: Quantum-pi-forge

| Component | Current | Target | Status |
|-----------|---------|--------|--------|
| Frontend (Next.js) | Vercel | Cloudflare Pages | ✅ PREPARED |
| Domain | Vercel (paused) | Cloudflare | ✅ READY |
| Backend | N/A | Railway | ✅ READY |
| Database | N/A | Supabase (optional) | ✅ READY |

### Secondary Repos (Found)

```
quantum-pi-forge-ignited      → Cloudflare Pages
quantum-pi-forge-fixed        → Cloudflare Pages
quantum-pi-forge-site         → Cloudflare Pages
quantum-resonance-clean       → Cloudflare Pages
oinio-server                  → Railway
oinio-soul-system             → Railway
pi-mr-nft-contracts           → GitHub (source) + Render (optional)
```

---

## 🔐 Secrets/Environment Variables to Configure

### Cloudflare Pages (Production)

```
CORE_URL = https://api.quantumpiforge.com
NODE_NAME = oinio-mainnet-1
DEFAULT_MODEL = llama3.2:latest
TAILSCALE_IP = [if applicable]
```

### Railway (Backend)

```
DATABASE_URL = postgresql://...
SUPABASE_URL = https://xxx.supabase.co
SUPABASE_KEY = xxxxx
NODE_ENV = production
CORE_URL = https://quantumpiforge.com
API_KEY = [your secret]
PRIVATE_KEY = [blockchain private key - use Railway secrets]
JWT_SECRET = [use Railway secrets]
```

---

## ✨ Success Criteria

After completing all phases:

✅ `quantumpiforge.com` loads in browser  
✅ HTTPS certificate valid  
✅ CSS/JS load (no 404s)  
✅ Navigation works  
✅ API calls to `api.quantumpiforge.com` succeed  
✅ Environment variables accessible in app  
✅ No console errors in DevTools  
✅ Vercel deployment is removed/cleaned up  
✅ DNS properly configured  
✅ All secondary repos migrated (repeat process for each)  

---

## 📂 Generated Documentation Files

All files are in `/home/kris/forge/Quantum-pi-forge/`:

- `MIGRATION_PLAN.md` - Complete migration strategy
- `DEPLOYMENT_CLOUDFLARE.md` - Cloudflare Pages detailed guide
- `DEPLOYMENT_RAILWAY.md` - Railway backend guide
- `DEPLOYMENT_TODAY.md` - Quick reference for today
- `wrangler.toml` - Production configuration (updated)
- `next.config.js` - Already configured for static export

---

## ⚠️ Important Notes

1. **DNS Propagation**: Allow 5-15 minutes for DNS changes to propagate globally
2. **HTTPS Cert**: Cloudflare auto-issues; may take a few minutes to activate
3. **GitHub Secrets**: Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for CI/CD
4. **Railway Token**: Get from https://dashboard.railway.app/account/tokens
5. **CORS**: Configure in backend if frontend needs to call from different domain

---

## 🚀 NEXT STEPS (EXECUTE NOW)

### Immediate (Next 10 minutes):

1. **Execute PHASE 1** (Verify Wrangler):
   ```bash
   wrangler whoami
   # If fails: npm install -g @cloudflare/wrangler && wrangler login
   ```

2. **Execute PHASE 2** (Build):
   ```bash
   cd /home/kris/forge/Quantum-pi-forge
   npm run build:cf
   ```

3. **Execute PHASE 3** (Deploy):
   ```bash
   wrangler pages deploy out --project-name quantumpiforge
   ```

### Then (Next 15 minutes):

4. Configure domain in Cloudflare UI (manual)
5. Test DNS propagation
6. Set environment variables

### Finally (Next 30 minutes):

7. Deploy backend to Railway
8. Configure Railway domain & variables
9. Run full verification checklist
10. Cleanup Vercel config

---

## 📞 Quick Support

| Problem | Solution |
|---------|----------|
| Can't authenticate with Wrangler | `npm install -g @cloudflare/wrangler@latest` then `wrangler login` |
| Build fails | `rm -rf .next out node_modules && npm install && npm run build:cf` |
| Deploy fails | Check wrangler auth: `wrangler whoami` |
| Domain doesn't resolve | Check Cloudflare DNS records (Pages should auto-add A records) |
| API not reachable | Verify Railway deployment → check logs → verify env vars |

---

**Everything is ready. You have all documentation, configuration, and step-by-step instructions.**

**Start with PHASE 1 → PHASE 10 in order for best results.**

**Estimated total time: 4-5 hours including DNS propagation.**

Let's get quantumpiforge.com live on Cloudflare Pages! 🚀

