# 🛡️ For Guardians

The **Guardian Playbook** for maintaining the Quantum Resonance Lattice.

## 🩺 Health Monitoring

Regularly check the pulse of the system:

*   **FastAPI:** `GET /health` -> `{"status": "healthy", ...}`
*   **Flask:** `GET /health` -> Rendered status page.
*   **Logs:** Monitor the Railway or local console logs for "Application startup complete".

## 🚨 Incident Response

### Latency Breach
If the **Harmony Sentinel** reports a latency breach (> 5ns in the core, though practically > 100ms for web):
1.  Check database connection latency.
2.  Verify WebSocket heartbeat.
3.  Initiate **TRC (Tactical Renewal Command)**: Restart the affected service.

### Resonance Dissonance
If visualizations fail to render:
1.  Check the `resonance_states` table in Supabase.
2.  Verify the transaction hash integrity.
3.  Check the Flask logs for SVG generation errors.

## 🔐 Security Protocols

*   **RLS:** Ensure Row Level Security is active on all Supabase tables.
*   **JWT:** Rotate `JWT_SECRET` periodically.
*   **Audit Logs:** Review the `audits` table for anomalous ethical scores.

> *Guardians do not just fix bugs; they restore harmony.*
