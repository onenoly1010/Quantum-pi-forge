# SUPREME CREDENTIALS - QVM 3.0 RECURSION PROTOCOL
# LOCAL DEVELOPMENT RUN SCRIPT

# Ensure the terminal is in the correct directory (pi-forge-quantum-genesis)
# Load environment variables from a .env file if it exists
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        Set-Item -Path "env:$name" -Value $value
    }
    Write-Host "✅ .env file loaded."
} else {
    Write-Warning "⚠️ .env file not found. Please ensure SUPABASE_URL and SUPABASE_KEY are set manually."
}

# Activate virtual environment if it exists
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "🐍 Activating Python virtual environment..."
    . .venv\Scripts\Activate.ps1
} else {
    Write-Warning "⚠️ Python virtual environment not found. Dependencies might not be installed."
}

# Launch the FastAPI application using uvicorn
Write-Host "🚀 Launching QVM 3.0 Supabase Resonance Bridge..."
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload

