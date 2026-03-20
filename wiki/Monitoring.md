# 🩺 Monitoring

Observability for the Quantum Resonance Lattice.

## Harmony Sentinel

The **Harmony Sentinel** is our internal monitoring agent.
*   **Metric:** Latency (target < 5ns for core, < 100ms for web).
*   **Metric:** Resonance Index (target > 0.7).

## Tools

*   **Railway Logs:** Real-time stdout/stderr from containers.
*   **Supabase Dashboard:** Database performance and query stats.
*   **Uptime Robot:** External ping check on `/health` endpoints.

## Alerts

*   **High Latency:** > 500ms response time.
*   **Error Rate:** > 1% 5xx errors.
*   **Dissonance:** Resonance Index < 0.6.
