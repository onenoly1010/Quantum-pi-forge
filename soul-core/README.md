# Soul Core

Minimal sovereign loop: input → AI → output → memory.

## Deploy

1. **Create KV namespace:**
   - Go to Cloudflare dashboard → KV → Create namespace named `MEMORY`
   - Copy the namespace ID

2. **Update wrangler.toml:**
   - Replace `YOUR_KV_NAMESPACE_ID_HERE` with your KV namespace ID

3. **Install & login:**
   ```bash
   npm install
   npx wrangler login
   ```

4. **Add OpenAI secret:**
   ```bash
   npx wrangler secret put OPENAI_API_KEY
   ```

5. **Test locally:**
   ```bash
   npm run dev
   ```

6. **Deploy:**
   ```bash
   npm run deploy
   ```

## Test

```bash
curl -X POST https://soul-core.<your-subdomain>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"input": "What is the smallest viable sovereign loop?"}'