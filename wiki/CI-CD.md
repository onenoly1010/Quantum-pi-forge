# 🔄 CI/CD Pipeline

Continuous Integration and Deployment strategy.

## GitHub Actions

We use GitHub Actions for automated testing and deployment.

### Workflows
*   `test.yml`: Runs `pytest` on every push to `main`.
*   `deploy.yml`: Triggers Railway deployment on successful merge to `main`.

## Railway Integration

Railway is configured to auto-deploy from the `main` branch.
*   **Build Command:** `docker build ...`
*   **Start Command:** `uvicorn server.main:app ...`

## Quality Gates
*   **Linting:** `flake8` must pass.
*   **Tests:** All unit tests must pass.
*   **Security:** No secrets in code (checked by `trufflehog` or similar).
