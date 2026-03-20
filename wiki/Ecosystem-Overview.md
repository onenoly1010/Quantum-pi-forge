# 🌍 Ecosystem Overview

The Pi Forge Quantum Genesis ecosystem extends beyond the code.

## Components

*   **The Lattice:** The core software (FastAPI + Flask + Gradio).
*   **The Vault:** Supabase (PostgreSQL) for persistent storage of state and history.
*   **The Network:** Pi Network for value transfer and user identity.
*   **The Forge:** The community of developers and guardians maintaining the system.

## Data Flow

1.  **Input:** User initiates a payment on Pi Network.
2.  **Trigger:** Payment success triggers a webhook to FastAPI.
3.  **Processing:** FastAPI verifies the payment and updates Supabase.
4.  **Broadcast:** FastAPI sends a WebSocket message to connected clients.
5.  **Visualization:** Flask generates the resonance visualization.
6.  **Audit:** Gradio analyzes the transaction for ethical alignment.
7.  **Output:** The user sees the visualization and the ethical score.

## Integration Points

*   **Pi SDK:** JavaScript library for frontend integration.
*   **Supabase Client:** Python library for backend database access.
*   **OpenAI/LLM:** (Optional) For generating ethical narratives.
