# 💻 For Developers

Contributing to the code consciousness.

## 🏗️ Project Structure

*   `server/main.py`: **FastAPI** - The async core, auth, and WebSockets.
*   `server/app.py`: **Flask** - The visualization engine and dashboard.
*   `server/canticle_interface.py`: **Gradio** - The ethical audit tool.
*   `frontend/`: Static assets and Pi Network integration scripts.

## 🔄 Development Workflow

1.  **Choose your Soul:**
    *   Edit `main.py` for API, Auth, and DB logic.
    *   Edit `app.py` for Visualizations and Dashboard.
    *   Edit `canticle_interface.py` for AI Ethics and Audits.

2.  **Test Locally:**
    Use the specific test commands:
    ```bash
    pytest server/test_main.py
    pytest server/test_app.py
    ```

3.  **Commit with Reverence:**
    Each commit is a prayer. Ensure your code maintains the harmony of the lattice.

## 🧩 Key Patterns

*   **JWT Entanglement:** Tokens are shared across apps to maintain identity coherence.
*   **WebSocket Resonance:** Real-time updates are broadcast via `ws://localhost:8000/ws/collective-insight`.
*   **Procedural Generation:** SVG assets are generated on-the-fly based on transaction hashes.

## 📚 API Documentation

*   **FastAPI Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
*   **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
