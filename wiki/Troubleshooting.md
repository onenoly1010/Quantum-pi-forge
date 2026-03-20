# 🔧 Troubleshooting

Common issues and their resolutions.

## 1. "Supabase unavailable"
*   **Cause:** Missing or incorrect `SUPABASE_URL`/`SUPABASE_KEY` env vars.
*   **Fix:** Check `.env` file and Railway variables.

## 2. WebSocket 1008 Policy Violation
*   **Cause:** Invalid or expired JWT token.
*   **Fix:** Re-authenticate via `POST /token` and reconnect.

## 3. "Phantom backend/ checksum errors"
*   **Cause:** Railway caching issues with Docker layers.
*   **Fix:** Force a rebuild without cache in Railway dashboard.

## 4. Visualizations not rendering
*   **Cause:** Flask template error or missing transaction data.
*   **Fix:** Check Flask logs for Jinja2 errors. Verify `tx_hash` exists in DB.
