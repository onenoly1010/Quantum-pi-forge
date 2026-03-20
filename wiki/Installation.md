# 📦 Installation Guide

Detailed instructions for setting up the Pi Forge Quantum Genesis environment.

## System Requirements

*   **OS:** Windows 10/11 (Recommended for PowerShell scripts), Linux, or macOS.
*   **Python:** Version 3.11 or higher.
*   **Docker:** (Optional) For containerized deployment.

## 🛠️ Manual Setup

If you prefer not to use the `run.ps1` orchestrator, follow these steps:

### 1. Virtual Environment

Create and activate a Python virtual environment:

**Windows:**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate
```

**Linux/macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Dependencies

Install the required Python packages:

```bash
pip install -r server/requirements.txt
```

### 3. Environment Variables

Ensure your `.env` file is correctly populated. See [[Quick Start]] for the template.

### 4. Database Setup

1.  Create a new project in Supabase.
2.  Run the SQL migration scripts located in `scripts/db_schema.sql` (if available) or manually create the tables:
    *   `payment_records`
    *   `resonance_states`
    *   `audits`
3.  Enable Row Level Security (RLS) on all tables.

## 🐳 Docker Setup

For a containerized experience:

1.  **Build the Image:**
    ```bash
    docker build -t pi-forge-quantum-genesis .
    ```

2.  **Run the Container:**
    ```bash
    docker run -p 8000:8000 -p 5000:5000 -p 7860:7860 --env-file .env pi-forge-quantum-genesis
    ```

*Note: The Dockerfile is optimized for Railway deployment but works locally for testing.*
