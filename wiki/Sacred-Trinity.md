# ⚛️ Sacred Trinity

The **Sacred Trinity** is the architectural pattern that defines the Quantum Resonance Lattice. It is a unified deployment of three distinct services, each serving a unique purpose.

## 1. The Pulsing Heartbeat (FastAPI)
*   **Port:** 8000
*   **Role:** Production Core, API, Auth, WebSockets.
*   **Technology:** Python, FastAPI, Uvicorn.
*   **Responsibility:** Handles the raw transaction data, manages user authentication via Supabase, and broadcasts real-time updates to the collective.

## 2. The Lyrical Lens (Flask)
*   **Port:** 5000
*   **Role:** Visualization Engine, Dashboard.
*   **Technology:** Python, Flask, Jinja2.
*   **Responsibility:** Transforms data into art. It renders the `resonance.html` templates and generates the procedural SVG fractals based on transaction hashes.

## 3. The Moral Melody (Gradio)
*   **Port:** 7860
*   **Role:** Ethical Audit, Interactive Interface.
*   **Technology:** Python, Gradio.
*   **Responsibility:** Provides a human-accessible interface for auditing the AI's decisions. It runs the `ethical_audit` simulations and displays the narratives.

## Entanglement

These three services are not isolated; they are **entangled**:
*   **Shared Database:** All connect to the same Supabase instance.
*   **Shared Identity:** JWT tokens allow users to move seamlessly between them.
*   **Shared Deployment:** They are deployed together in a single container/pod, sharing the same environment variables.
