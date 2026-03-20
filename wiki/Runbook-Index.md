# 📖 Runbook Index

Standard Operating Procedures for the Quantum Resonance Lattice.

## Daily Operations
*   [[Monitoring]] - Checking system health.
*   [[Troubleshooting]] - Resolving common alerts.

## Maintenance
*   **Database Backup:** Automated via Supabase. Manual snapshots recommended before major upgrades.
*   **Token Rotation:** Rotate `JWT_SECRET` every 90 days.
*   **Dependency Updates:** Review `requirements.txt` monthly.

## Emergency Procedures
*   **TRC (Tactical Renewal Command):** Restart services.
*   **Lockdown:** Disable payment verification endpoint during security incidents.
