#!/usr/bin/env python3
"""
Minimal test server to check if FastAPI can start
"""

import os

import uvicorn
from fastapi import FastAPI

app = FastAPI(title="Test Server")

@app.get("/health")
async def health():
    return {"status": "ok", "message": "Test server running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting test server on port {port}")
    uvicorn.run("test_server:app", host="0.0.0.0", port=port, log_level="info")