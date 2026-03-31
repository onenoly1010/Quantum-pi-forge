# IMMEDIATE ACTION ITEMS - March 31, 2026

## 🎯 Goals for Today

✅ **quantumpiforge.com** → Cloudflare Pages  
✅ **Backend services** → Railway  
✅ **All new env vars configured**  
✅ **Vercel removed & cleaned up**  

---

## 🚀 PHASE 1: Verify & Prepare (30 mins)

### Step 1: Verify Cloudflare Setup

```bash
# Check if wrangler is installed and authenticated
wrangler whoami

# Should show your Cloudflare account info
# If not: npm install -g wrangler && wrangler login
```

### Step 2: Verify GitHub SSH Keys

```bash
# Test SSH connection to GitHub
ssh -T git@github.com

# Should show: "Hi onenoly1010! You've successfully authenticated..."
```

### Step 3: Verify local build works

```bash
cd /home/kris/forge/Quantum-pi-forge
npm run build:cf

# Should complete without errors and create ./out directory
```

---

## 🌐 PHASE 2: Deploy Main Repo to Cloudflare Pages (45 mins)

### Quick Checklist

```bash
cd /home/kris/forge/Quantum-pi-forge

# 1. Build
npm run build:cf

# 2. Deploy to Cloudflare Pages
wrangler pages deploy out --project-name quantumpiforge

# 3. Note the deployment URL (e.g., https://quantumpiforge.pages.dev)

# 4. Test it works
curl https://quantumpiforge.pages.dev
```

**After deployment:**
- ✅ App should load at https://quantumpiforge.pages.dev
- ✅ CSS/JS should load (no 404s)
- ✅ Navigation should work

---

## 🔗 PHASE 3: Configure quantumpiforge.com Domain (20 mins)

### In Cloudflare Dashboard:

1. **Navigate to Cloudflare** → quantumpiforge.com domain
2. **Go to Pages** → quantumpiforge project
3. **Add Custom Domain** → `quantumpiforge.com`
4. **Verify DNS** records are set:
   ```
   @ (root)        A  104.21.x.x (Cloudflare any-cast)
   ```

### Verify DNS:

```bash
# Test resolution (takes 5-15 min to propagate)
dig quantumpiforge.com
nslookup quantumpiforge.com

# Should resolve to Cloudflare IP
```

### Test Production URL:

```bash
# Should load the app
curl https://quantumpiforge.com

# Verify certificate
openssl s_client -connect quantumpiforge.com:443 < /dev/null | grep subject
```

---

## 🔐 PHASE 4: Set Environment Variables in Cloudflare (10 mins)

### In Cloudflare Pages Settings:

1. **Go to Pages** → quantumpiforge project → **Settings** → **Environment variables**
2. **Add Production Variables:**
   ```
   CORE_URL = https://api.quantumpiforge.com
   NODE_NAME = oinio-mainnet-1
   DEFAULT_MODEL = llama3.2:latest
   ```

3. **Save and redeploy** if needed

---

## 🐳 PHASE 5: Deploy Backend to Railway (30 mins)

### Quick Steps:

```bash
# 1. Go to https://railway.app (login with GitHub)
# 2. Click "New Project"
# 3. Select "Deploy from GitHub repo"
# 4. Search for: onenoly1010/oinio-server
# 5. Click "Deploy"
```

### Configure in Railway Dashboard:

1. **Project** → **Settings** → **Deployments**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

2. **Project** → **Variables**
   ```
   DATABASE_URL = [your Postgres URL if applicable]
   NODE_ENV = production
   CORE_URL = https://quantumpiforge.com
   API_KEY = [your secret keys]
   ```

3. **Deployments** → click to deploy

### Bind Custom Domain:

1. **Project** → **Deployments** → **Networking** → **Domains**
2. **Add Custom Domain** → `api.quantumpiforge.com`
3. Railway provides CNAME target
4. Add DNS record in Cloudflare:
   ```
   api → CNAME → [railway-domain].railway.app
   ```

---

## ✅ PHASE 6: Verification & Testing (20 mins)

### Front-end Verification

```bash
# Test homepage
curl -I https://quantumpiforge.com
# Should return: HTTP/2 200

# Test navigation works
# Test CSS loads
# Test images load
```

### Back-end Verification

```bash
# Test API endpoint
curl -I https://api.quantumpiforge.com/health
# Should return: HTTP/2 200 (or 401 if requires auth)

# Check logs in Railway dashboard
```

### Full Flow Test

1. Open https://quantumpiforge.com in browser
2. Open DevTools → Network tab
3. Check for any failed requests (should be 0 if 404s)
4. Check Console for errors
5. Test any API calls to verify they reach Railway backend

---

## 🧹 PHASE 7: Cleanup (30 mins)

### Remove Vercel Artifacts

```bash
cd /home/kris/forge/Quantum-pi-forge

# Remove Vercel files
rm -f vercel.json .vercelignore
rm -rf vercel-backup

# Remove old build outputs if any
rm -rf .vercel

# Commit cleanup
git add -A
git commit -m "chore: remove Vercel configuration, migrate to Cloudflare Pages + Railway"
git push origin main
```

### Apply to Other Repos

Repeat PHASE 1-7 for:
- quantum-pi-forge-ignited
- quantum-pi-forge-fixed
- quantum-pi-forge-site
- quantum-resonance-clean
- (any other static sites)

---

## 📊 CRITICAL CHECKLIST (Do NOT skip)

- [ ] Wrangler is authenticated
- [ ] `npm run build:cf` completes
- [ ] Deployed to quantumpiforge.pages.dev
- [ ] DNS propagated (dig shows Cloudflare IPs)
- [ ] quantumpiforge.com loads
- [ ] SSL certificate valid
- [ ] Env vars set in Cloudflare
- [ ] Backend deployed to Railway
- [ ] Backend custom domain resolves
- [ ] Frontend can call backend APIs
- [ ] No 404/403 errors
- [ ] No console errors in DevTools
- [ ] Vercel config files removed
- [ ] Git commit pushed

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| `wrangler` not found | `npm install -g @cloudflare/wrangler` |
| Build fails | `rm -rf .next out node_modules && npm install && npm run build:cf` |
| DNS not resolving | Wait 5-15 min for propagation, then `dig quantumpiforge.com` |
| API not reachable | Check Railway logs, verify env vars set |
| HTTPS certificate error | Cloudflare auto-issued, wait 5-10 min |
| 404 on custom domain | Verify domain binding in Pages settings |

---

## 📞 Support Resources

- **Cloudflare Status**: https://www.cloudflarestatus.com
- **Railway Status**: https://status.railway.app
- **Cloudflare Docs**: https://developers.cloudflare.com
- **Railway Docs**: https://docs.railway.app

---

**START TIME**: [When you run Phase 1]  
**TARGET COMPLETION**: 4-5 hours from start  
**SUCCESS**: quantumpiforge.com loads via Cloudflare Pages ✅

