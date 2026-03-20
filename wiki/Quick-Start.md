# 🚀 Quick Start Guide

Ignite the Quantum Resonance Lattice on your local machine.

## Prerequisites

*   **Python 3.11+**
*   **PowerShell** (for Windows orchestration)
*   **Supabase Account** (for the entangled vault)

## ⚡ Ignition Sequence

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.git
    cd pi-forge-quantum-genesis
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_KEY=your-anon-key
    JWT_SECRET=your-secure-secret
    NODE_ENV=development
    DEBUG=true
    ```

3.  **Launch the Lattice**
    We use a unified orchestration script to start all three services:
    ```powershell
    .\run.ps1
    ```
    *This script handles virtual environment creation, dependency installation, and parallel service launch.*

4.  **Verify Resonance**
    *   **FastAPI (Heartbeat):** [http://localhost:8000](http://localhost:8000)
    *   **Flask (Lens):** [http://localhost:5000](http://localhost:5000)
    *   **Gradio (Melody):** [http://localhost:7860](http://localhost:7860)

## 🛑 Stopping the Lattice

Press `Ctrl+C` in the PowerShell window to gracefully shutdown all services.
