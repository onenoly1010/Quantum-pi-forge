"""
Pi Forge Quantum Genesis - Ledger API
Main FastAPI application entry point.
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from ledger_api.db import init_db, get_engine
from ledger_api.api.v1 import transactions, treasury, reconcile, allocation_rules

# Configure logging
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO"),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Environment configuration
APP_ENVIRONMENT = os.environ.get("APP_ENVIRONMENT", "testnet")
NFT_MINT_VALUE = int(os.environ.get("NFT_MINT_VALUE", "0"))
SERVICE_NAME = os.environ.get("SERVICE_NAME", "ledger-api")
API_VERSION = os.environ.get("API_VERSION", "v1")

# Safety checks
if NFT_MINT_VALUE != 0:
    raise RuntimeError(
        f"❌ SAFETY VIOLATION: NFT_MINT_VALUE must be 0 for testnet-only operation. "
        f"Current value: {NFT_MINT_VALUE}"
    )

if APP_ENVIRONMENT not in ["testnet", "development"]:
    logger.warning(
        f"⚠️  APP_ENVIRONMENT is '{APP_ENVIRONMENT}'. "
        "Ensure all safety measures are in place for non-development environments."
    )

logger.info(f"✅ Starting {SERVICE_NAME} in {APP_ENVIRONMENT} mode")
logger.info(f"✅ Safety check passed: NFT_MINT_VALUE={NFT_MINT_VALUE}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("🚀 Ledger API starting up...")
    
    try:
        # Initialize database tables
        init_db()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🛑 Ledger API shutting down...")


# Create FastAPI application
app = FastAPI(
    title="Pi Forge Quantum Genesis - Ledger API",
    description="""
    ## Ledger API for Pi Forge Quantum Genesis
    
    Single source of truth for financial transactions and treasury management.
    
    ### Features
    - **Transactions**: Create and query ledger transactions
    - **Allocation Engine**: Automatic fund distribution based on rules
    - **Treasury Status**: Real-time treasury balance and account information
    - **Reconciliation**: Compare internal ledger with external blockchain state
    - **Allocation Rules**: Configure automatic fund allocation (Guardian only)
    - **Audit Trail**: Complete audit logging of all changes
    
    ### Authentication
    - Public endpoints: Transaction list, treasury status, allocation rules (read)
    - Guardian endpoints: Create/update allocation rules, reconciliation
    - JWT Bearer token required for Guardian operations
    
    ### Safety
    - Testnet-only mode enforced (NFT_MINT_VALUE=0)
    - Pi Network on-chain operations stubbed
    - All allocation rules validated (must sum to 100%)
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(transactions.router, prefix="/api/v1")
app.include_router(treasury.router, prefix="/api/v1")
app.include_router(reconcile.router, prefix="/api/v1")
app.include_router(allocation_rules.router, prefix="/api/v1")


@app.get("/", tags=["health"])
async def root():
    """Root endpoint - health check."""
    return {
        "service": SERVICE_NAME,
        "version": API_VERSION,
        "status": "healthy",
        "environment": APP_ENVIRONMENT,
        "nft_mint_value": NFT_MINT_VALUE,
        "message": "Pi Forge Quantum Genesis - Ledger API"
    }


@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint.
    Verifies database connectivity and service status.
    """
    try:
        # Test database connection
        engine = get_engine()
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "service": SERVICE_NAME,
        "version": API_VERSION,
        "environment": APP_ENVIRONMENT,
        "database": db_status,
        "nft_mint_value": NFT_MINT_VALUE,
        "safety_mode": "testnet-only"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "type": type(exc).__name__
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.environ.get("SERVICE_PORT", "8001"))
    
    uvicorn.run(
        "ledger_api.main:app",
        host="0.0.0.0",
        port=port,
        reload=os.environ.get("RELOAD", "false").lower() == "true"
    )
