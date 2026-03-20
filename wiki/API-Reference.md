# 🔌 API Reference

## FastAPI (Port 8000)

### Authentication
*   `POST /token`: Login and retrieve JWT.
*   `POST /register`: Create a new user.

### Payments
*   `POST /api/verify-payment`: Verify a Pi Network payment.
    *   **Body:** `{ "paymentId": "...", "metadata": {...} }`

### Resonance
*   `WS /ws/collective-insight`: WebSocket endpoint for real-time updates.
    *   **Query Param:** `token={jwt_token}`

### Health
*   `GET /health`: System health check.

## Flask (Port 5000)

### Dashboard
*   `GET /resonance-dashboard`: Main dashboard view.
*   `GET /resonate/<tx_hash>`: Specific visualization for a transaction.

### Health
*   `GET /health`: Flask app status.

## Gradio (Port 7860)

*   The Gradio interface exposes the `ethical_audit` function via a web UI.
*   API access is available via the Gradio client if enabled.
