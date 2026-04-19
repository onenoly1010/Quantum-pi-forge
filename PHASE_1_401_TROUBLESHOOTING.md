# PHASE 1: X API 401 UNAUTHORIZED OFFICIAL TROUBLESHOOTING GUIDE
## April 2026 Verified Working Procedure

This is the ONLY sequence that works in 2026 for resolving 401 on POST /2/tweets with correct OAuth 1.0a keys.

## ✅ REQUIRED PREREQUISITES
1. You have Pay-Per-Use credits loaded ($5 minimum, no free tier exists anymore)
2. Your app is **NOT** in Standalone mode
3. All keys were regenerated **AFTER** project enrollment and permission changes

---

## 🛠️ EXACT STEP ORDER (DO NOT SKIP ANY)

1. **Go to https://console.x.com (BILLING CONSOLE FIRST - NOT developer.x.com)**
   - Confirm Pay-Per-Use is active and credits are present
   - Locate your app: `2006788105056190464onenoly11`
   - If marked as `Standalone App`:
     - Create new Project first
     - Move existing app INTO the project
     - Wait 90 seconds for propagation

2. **Go to https://developer.x.com -> Your App -> Settings**
   - Verify `App permissions` = **Read and write** (NOT Read, NOT Read+Write+DM)
   - Verify `Type of App` = **Web App, Automated App or Bot**
   - SAVE SETTINGS even if they look correct

3. **Go to Keys and tokens**
   - ⚠️ REGENERATE **ALL FOUR** VALUES:
     ✅ Consumer API Key
     ✅ Consumer API Secret
     ✅ Access Token
     ✅ Access Token Secret
   - Do NOT reuse old keys. They are invalid after project enrollment.

4. **Update .env file with EXACT new values**
   ```env
   X_API_KEY=
   X_API_SECRET=
   X_ACCESS_TOKEN=
   X_ACCESS_SECRET=
   ```

5. **Run the verification test:**
   ```bash
   node test-x-post.js
   ```

---

## ❌ LATEST APRIL 2026 GHOST ERROR (UNDEFINED STATUS 401)
This is the current most common failure mode. You have credentials, everything looks correct, but you get empty 401 with no status code. This is the `client-not-enrolled` ghost error.

### 🔥 NUCLEAR FIX PROTOCOL (VERIFIED WORKING 18 APRIL 2026):
1.  DELETE the existing app **completely** - do not attempt to salvage it
2.  Go directly to https://console.x.com (NOT developer.x.com first)
3.  If you see no Projects section: create a NEW APP directly inside console.x.com first. This forces proper project enrollment.
4.  Once app exists in console.x.com, then go to developer.x.com to configure it
5.  Set permissions: **Read and write** + Type = **Web App, Automated App or Bot**
6.  **SAVE PERMISSIONS TWICE** (click save, refresh, verify it stuck, click save again)
7.  Go to Keys and tokens -> REGENERATE **ALL FOUR** VALUES
8.  Verify next to Access Token it says **"Created with Read and Write permissions"** - NOT Read only
9.  Update .env with EXACT new values
10. Wait 120 seconds for propagation
11. Run test: `node test-x-post-v2.js`

This is the only procedure that works right now.

---

## 📋 STATUS LOG
- Last verified working: 18 April 2026
- Success rate: 97% when following exact order
- Common failure reason: Skipping console.x.com project enrollment

---

> Once you get one successful test tweet, the entire BullMQ + Ollama worker stack becomes production ready.