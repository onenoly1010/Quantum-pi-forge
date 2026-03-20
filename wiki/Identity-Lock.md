# 🔐 Identity Lock

Security and Identity management.

## Authentication
*   **Supabase Auth:** We use Supabase (GoTrue) for user management.
*   **Pi Auth:** Pi Network authentication is linked to Supabase users via `uid`.

## RLS (Row Level Security)
*   **Principle:** "Users can only see their own data."
*   **Implementation:** PostgreSQL Policies on `payment_records` and `resonance_states`.

## JWT Entanglement
*   **Token:** A single JWT signed by `JWT_SECRET`.
*   **Scope:** Valid for FastAPI, Flask (if protected), and WebSocket connections.
*   **Expiry:** Short-lived tokens with refresh mechanism.
