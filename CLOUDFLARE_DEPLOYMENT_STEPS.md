# 🚀 Quantum Pi Forge → Cloudflare Pages Deployment

## Current Status
- ✅ Build Complete: `.next/` directory (5.1 MB)
- ✅ Build ID: vZbms4MxaPaogoO4AV2vm
- ❌ Authentication: Invalid API token (9109 error)
- ❌ Deployment: Blocked pending valid credentials

---

## 🔐 Step 1: Clear Invalid Token (Run in YOUR terminal)

```bash
cd /home/kris/forge/Quantum-pi-forge

# Clear the invalid static token
unset CLOUDFLARE_API_TOKEN
unset CLOUDFLARE_API_KEY

# Verify they're cleared
env | grep CLOUDFLARE
```

---

## 🌐 Step 2: Authenticate via Browser OAuth (Run in YOUR terminal)

```bash
npx wrangler login
```

**What happens:**
1. Browser window opens automatically
2. Ensure you're logged in as: **onenoly1010@gmail.com**
3. Click **Allow** to authorize Wrangler
4. Terminal will confirm: `✓ Successfully logged in`

---

## 📤 Step 3: Deploy to Cloudflare Pages (Run in YOUR terminal)

```bash
npx wrangler pages deploy .next --project-name=quantum-pi-forge-fixed
```

**Expected output:**
```
✓ Uploading... [████████████] 100%
✓ Deployment complete
✓ Your site is live at: https://quantum-pi-forge-fixed.pages.dev
```

---

## ✅ Step 4: Verify Deployment

```bash
# Check deployment list
wrangler pages deployment list --project-name=quantum-pi-forge-fixed

# Visit your live site
open https://quantum-pi-forge-fixed.pages.dev
```

---

## 🛡️ Why OAuth is Better Than Static Tokens

| Aspect | Static Token | OAuth |
|--------|--------------|-------|
| **Expiration** | Manual refresh | Auto-refresh |
| **Permissions** | Error-prone | Automatic scoping |
| **Security** | Single point of failure | Credential isolation |
| **Resilience** | Breaks on expiry | Adaptive |
| **Sovereign Ops** | Fragile | Sustainable |

---

## 📋 Pre-Deployment Checklist

- [ ] Cloudflare account active
- [ ] `wrangler login` completed
- [ ] Browser authentication successful
- [ ] `.next/` directory exists
- [ ] `quantum-pi-forge-fixed` Pages project exists (or will auto-create)

---

## 🆘 Troubleshooting

### Error: "CLOUDFLARE_API_TOKEN still set"
```bash
# Reload your shell
exec bash

# Verify
env | grep CLOUDFLARE
```

### Error: "Project not found"
```bash
# Wrangler will auto-create the project
# Or manually create:
wrangler pages project create quantum-pi-forge-fixed
```

### Error: "Browser doesn't open"
```bash
# Manual OAuth link (check Wrangler output)
# Copy URL from terminal and paste into browser manually
```

---

## 🎯 Next: Custom Domain (Optional)

Once deployment succeeds:
```bash
# Add your custom domain to Cloudflare Pages
wrangler pages domain add quantum-pi-forge-fixed yourdomain.com
```

---

**Build Ready**: ✅ Yes  
**Authenticated**: ⏳ Pending your OAuth  
**Deployment Ready**: ⏳ After Step 2  
**Live**: ⏳ After Step 3

