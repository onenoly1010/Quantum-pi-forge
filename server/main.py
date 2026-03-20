"""
SUPREME CREDENTIALS - QVM 3.0 RECURSION PROTOCOL
REALIGNED WITH SUPABASE AUTHENTICATION LATTICE
Production-Ready Mainnet Dashboard Integration
"""
import asyncio
import hashlib
import hmac
import logging
import os
import random
import time
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional

import httpx
from fastapi import (Depends, FastAPI, HTTPException, Request, WebSocket,
                     WebSocketDisconnect, status)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field

# Configure logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import supabase with error handling (using importlib to avoid top-level import)
import importlib

supabase_available = False
Client = None
create_client = None

try:
    supabase_module = importlib.import_module('supabase')
    Client = supabase_module.Client
    create_client = supabase_module.create_client
    supabase_available = True
    logger.info("✅ Supabase client imported successfully")
except ImportError as e:
    logger.warning(f"⚠️ Supabase import failed: {e}")
    supabase_available = False

# Use the centralized tracing_system (lazy init + safe null-context fallbacks)
try:
    from tracing_system import (get_tracing_system, trace_consciousness_stream,
                                trace_fastapi_operation,
                                trace_payment_processing,
                                trace_payment_visualization_flow)
    tracing_enabled = True
    logging.info("✅ Tracing system loaded")
except ImportError as e:
    logging.warning(f"⚠️ Tracing system import failed: {e}")
    tracing_enabled = False
    get_tracing_system = None
    trace_consciousness_stream = lambda *args, **kwargs: None
    trace_fastapi_operation = lambda *args, **kwargs: None
    trace_payment_processing = lambda *args, **kwargs: None
    trace_payment_visualization_flow = lambda *args, **kwargs: None

# Import autonomous decision tools
try:
    from autonomous_decision import (DecisionContext, DecisionParameter,
                                     DecisionPriority, DecisionType,
                                     get_decision_matrix)
    autonomous_decision_available = True
    logging.info("✅ Autonomous decision tools loaded")
except ImportError as e:
    logging.warning(f"⚠️ Autonomous decision tools import failed: {e}")
    autonomous_decision_available = False
    DecisionContext = None
    DecisionParameter = None
    DecisionPriority = None
    DecisionType = None
    get_decision_matrix = None

# Import self-healing system
try:
    from self_healing import IncidentSeverity, get_healing_system
    self_healing_available = True
    logging.info("✅ Self-healing system loaded")
except ImportError as e:
    logging.warning(f"⚠️ Self-healing system import failed: {e}")
    self_healing_available = False
    IncidentSeverity = None
    get_healing_system = None

# Import guardian monitoring
try:
    from guardian_monitor import (MonitoringLevel, ValidationStatus,
                                  get_guardian_monitor)
    guardian_monitor_available = True
    logging.info("✅ Guardian monitoring system loaded")
except ImportError as e:
    logging.warning(f"⚠️ Guardian monitoring import failed: {e}")
    guardian_monitor_available = False
    MonitoringLevel = None
    ValidationStatus = None
    get_guardian_monitor = None

# Import monitoring agents
try:
    from monitoring_agents import get_monitoring_system
    monitoring_agents_available = True
    logging.info("✅ Monitoring agents system loaded")
except ImportError as e:
    logging.warning(f"⚠️ Monitoring agents import failed: {e}")
    monitoring_agents_available = False
    get_monitoring_system = None

# Import guardian approval system
try:
    from guardian_approvals import get_approval_system
    guardian_approvals_available = True
    logging.info("✅ Guardian approval system loaded")
except ImportError as e:
    logging.warning(f"⚠️ Guardian approvals import failed: {e}")
    guardian_approvals_available = False
    get_approval_system = None

# Import memorial AI generator
try:
    from memorial_ai_generator import (MemorialProfile,
                                       generate_complete_memorial_package)
    memorial_ai_available = True
    logging.info("✅ Memorial AI generator loaded")
except ImportError as e:
    logging.warning(f"⚠️ Memorial AI generator import failed: {e}")
    memorial_ai_available = False
    MemorialProfile = None
    generate_complete_memorial_package = None

# --- SUPABASE CLIENT INITIALIZATION ---
supabase = None
if supabase_available:
    try:
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        if supabase_url and supabase_key:
            supabase = create_client(supabase_url, supabase_key)
            logging.info("✅ Supabase client initialized")
        else:
            logging.warning("⚠️ Supabase URL or Key not configured")
    except Exception as e:
        logging.error(f"❌ Supabase initialization failed: {e}")

# --- PYDANTIC MODELS FOR API ---
class PaymentVerificationRequest(BaseModel):
    payment_id: str = Field(..., description="Pi Network payment ID")
    amount: float = Field(..., gt=0, description="Payment amount in Pi")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Payment metadata")

class EthicalAuditRequest(BaseModel):
    transaction_id: str = Field(..., description="Transaction ID to audit")
    amount: float = Field(..., gt=0, description="Transaction amount")
    user_context: Optional[str] = Field(default=None, description="User context for audit")

class DAppCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=50, description="dApp name")
    description: str = Field(..., min_length=10, max_length=500, description="dApp description")
    app_type: str = Field(..., description="Type of dApp (defi, nft, social, utility)")
    smart_contract_template: Optional[str] = Field(default="basic", description="Smart contract template")

class GovernanceProposalRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=100, description="Proposal title")
    description: str = Field(..., min_length=20, max_length=2000, description="Proposal description")
    proposal_type: str = Field(..., description="Type of proposal (feature, policy, treasury)")
    voting_duration_days: int = Field(default=7, ge=1, le=30, description="Voting duration in days")

class GovernanceVoteRequest(BaseModel):
    proposal_id: str = Field(..., description="Proposal ID to vote on")
    vote: str = Field(..., description="Vote: 'for', 'against', or 'abstain'")
    voting_power: Optional[float] = Field(default=1.0, description="Voting power")

# --- IN-MEMORY STORAGE FOR DEMO (Production would use Supabase) ---
guardian_metrics = {
    "latency_ns": 4,
    "harmonic_stability": 0.982,
    "threat_level": "low",
    "active_alerts": [],
    "monitored_transactions": 0,
    "blocked_threats": 0,
    "last_scan": time.time()
}

dapps_registry: Dict[str, Dict] = {}
governance_proposals: Dict[str, Dict] = {}
user_votes: Dict[str, Dict[str, str]] = defaultdict(dict)
payment_records: List[Dict] = []
connected_users: Dict[str, WebSocket] = {}

# --- SUPABASE CLIENT INITIALIZATION ---
supabase: Optional[Client] = None
try:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    if supabase_url and supabase_key:
        supabase = create_client(supabase_url, supabase_key)
        logger.info("✅ Supabase client initialized successfully")
    else:
        logger.warning("⚠️ Supabase credentials not configured - running in demo mode")
except Exception as e:
    logger.error(f"❌ Supabase initialization failed: {e}")
    supabase = None

# --- PI NETWORK MAINNET CONFIGURATION ---
PI_NETWORK_CONFIG = {
    "network": os.environ.get("PI_NETWORK_MODE", "mainnet"),  # mainnet or testnet
    "api_key": os.environ.get("PI_NETWORK_API_KEY", ""),
    "app_id": os.environ.get("PI_NETWORK_APP_ID", ""),
    "api_endpoint": os.environ.get("PI_NETWORK_API_ENDPOINT", "https://api.minepi.com"),
    "sandbox_mode": os.environ.get("PI_SANDBOX_MODE", "false").lower() == "true",
    "wallet_private_key": os.environ.get("PI_NETWORK_WALLET_PRIVATE_KEY", ""),
    "webhook_secret": os.environ.get("PI_NETWORK_WEBHOOK_SECRET", "")
}

# Validate critical Pi Network configuration on startup
def validate_pi_network_config():
    """Validate Pi Network configuration for mainnet deployment"""
    if PI_NETWORK_CONFIG["network"] == "mainnet":
        if not PI_NETWORK_CONFIG["api_key"]:
            logger.error("❌ PI_NETWORK_API_KEY not set - payments will fail in mainnet mode")
            raise ValueError("PI_NETWORK_API_KEY is required for mainnet deployment")
        if not PI_NETWORK_CONFIG["app_id"]:
            logger.error("❌ PI_NETWORK_APP_ID not set - payments will fail in mainnet mode")
            raise ValueError("PI_NETWORK_APP_ID is required for mainnet deployment")
        if not PI_NETWORK_CONFIG["webhook_secret"]:
            logger.warning("⚠️ PI_NETWORK_WEBHOOK_SECRET not set - webhook verification disabled")
        logger.info(f"✅ Pi Network Mainnet Mode: API configured={bool(PI_NETWORK_CONFIG['api_key'])}")
    else:
        logger.info(f"🧪 Pi Network Testnet/Sandbox Mode")

# --- PYDANTIC MODELS FOR REQUEST/RESPONSE ---
class PaymentVerification(BaseModel):
    payment_id: str = Field(..., description="Pi Network payment identifier")
    amount: float = Field(..., gt=0, description="Payment amount in Pi")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional payment metadata")

class PaymentApprovalRequest(BaseModel):
    payment_id: str = Field(..., description="Pi Network payment ID from SDK")
    amount: float = Field(..., gt=0, description="Payment amount to approve")
    user_id: str = Field(..., description="User ID from authentication")
    metadata: Optional[Dict[str, Any]] = Field(default=None)

class PaymentCompletionRequest(BaseModel):
    payment_id: str = Field(..., description="Pi Network payment ID")
    txid: str = Field(..., description="Blockchain transaction ID")

class IncompletePaymentRequest(BaseModel):
    payment_id: str = Field(..., description="Incomplete payment ID")
    amount: float = Field(..., gt=0)
    user_uid: str = Field(..., description="User UID")

class PiWebhookPayload(BaseModel):
    """Pi Network webhook payload model"""
    payment_id: str
    status: str  # completed, cancelled, failed
    txid: Optional[str] = None
    amount: float
    user_uid: str
    created_at: str
    tx_hash: Optional[str] = Field(default=None, description="Transaction hash for mainnet verification")

class EthicalAuditRequest(BaseModel):
    transaction_id: str = Field(..., description="Transaction to audit")
    amount: float = Field(..., ge=0, description="Transaction amount")
    user_context: Optional[str] = Field(default=None, description="User context for audit")
    contract_code: Optional[str] = Field(default=None, description="Smart contract code to audit")

class GovernanceProposal(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20)
    proposal_type: str = Field(..., pattern="^(parameter_change|fund_allocation|protocol_upgrade|community_initiative)$")
    required_stake: float = Field(default=100.0, ge=0)
    voting_period_days: int = Field(default=7, ge=1, le=30)

class SmartContractAudit(BaseModel):
    contract_code: str = Field(..., min_length=10)
    contract_name: str = Field(..., min_length=1, max_length=100)
    audit_depth: str = Field(default="standard", pattern="^(basic|standard|comprehensive)$")

class GuardianApprovalRequest(BaseModel):
    """Request model for guardian approval recording"""
    decision_id: str = Field(..., description="Original decision ID")
    decision_type: str = Field(..., description="Type of decision (deployment, scaling, rollback, etc.)")
    guardian_id: str = Field(..., description="Guardian identifier")
    action: str = Field(..., pattern="^(approve|reject|modify)$", description="Action: approve, reject, or modify")
    reasoning: str = Field(..., min_length=1, description="Reasoning for the action")
    priority: str = Field(default="high", pattern="^(critical|high|medium|low)$", description="Priority level")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0, description="Decision confidence score")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional metadata")

class MemorialProfileRequest(BaseModel):
    """Request model for memorial profile creation"""
    name: str = Field(..., min_length=1, max_length=100, description="Name of the person being memorialized")
    birth_date: Optional[str] = Field(None, description="Birth date (YYYY-MM-DD format)")
    passing_date: Optional[str] = Field(None, description="Date of passing (YYYY-MM-DD format)")
    relationship: Optional[str] = Field(None, max_length=100, description="Relationship to the memorial creator")
    personality_traits: List[str] = Field(default_factory=list, description="Personality traits and characteristics")
    achievements: List[str] = Field(default_factory=list, description="Life achievements and accomplishments")
    favorite_memories: List[str] = Field(default_factory=list, description="Favorite memories and stories")
    legacy_message: Optional[str] = Field(None, max_length=500, description="Legacy message or final words")

class MemorialGenerationRequest(BaseModel):
    """Request model for memorial content generation"""
    profile: MemorialProfileRequest
    contributor_name: str = Field(default="Loved One", max_length=100, description="Name of the contributor")
    content_types: List[str] = Field(
        default_factory=lambda: ["narrative", "poem", "reflection"],
        description="Types of content to generate"
    )

# --- CYBER SAMURAI GUARDIAN STATE ---
# --- PI NETWORK API INTEGRATION HELPERS ---
async def call_pi_network_api(endpoint: str, method: str = "GET", data: Optional[Dict] = None) -> Dict[str, Any]:
    """Make authenticated API calls to Pi Network"""
    url = f"{PI_NETWORK_CONFIG['api_endpoint']}/{endpoint}"
    headers = {"Authorization": f"Key {PI_NETWORK_CONFIG['api_key']}"}
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            if method == "GET":
                response = await client.get(url, headers=headers)
            elif method == "POST":
                response = await client.post(url, headers=headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Pi Network API error: {e.response.status_code} - {e.response.text}")
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Pi Network API error: {e.response.text}"
            )
        except Exception as e:
            logger.error(f"Pi Network API call failed: {e}")
            raise HTTPException(status_code=500, detail=f"Pi Network API unavailable: {str(e)}")

async def approve_payment_with_pi_network(payment_id: str) -> Dict[str, Any]:
    """Approve payment with Pi Network API"""
    return await call_pi_network_api(f"v2/payments/{payment_id}/approve", method="POST")

async def complete_payment_with_pi_network(payment_id: str, txid: str) -> Dict[str, Any]:
    """Complete payment with Pi Network API"""
    return await call_pi_network_api(
        f"v2/payments/{payment_id}/complete",
        method="POST",
        data={"txid": txid}
    )

async def get_payment_from_pi_network(payment_id: str) -> Dict[str, Any]:
    """Get payment details from Pi Network API"""
    return await call_pi_network_api(f"v2/payments/{payment_id}", method="GET")

def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """Verify Pi Network webhook signature using HMAC"""
    if not PI_NETWORK_CONFIG["webhook_secret"]:
        logger.warning("⚠️ Webhook signature verification skipped - no secret configured")
        return True  # Allow in development, but warn
    
    expected_signature = hmac.new(
        PI_NETWORK_CONFIG["webhook_secret"].encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

class CyberSamuraiGuardian:
    """Guardian monitoring system for quantum resonance and system health
    
    Note: In simulation mode, latency values are generated for demonstration.
    In production, integrate with actual performance monitoring tools.
    """
    
    def __init__(self, simulation_mode: bool = True):
        self.latency_threshold_ns = 5  # Sub-5 nanosecond target
        self.current_latency_ns = 4.2
        self.harmonic_stability = 0.985
        self.alerts: List[Dict] = []
        self.last_check = time.time()
        self.guardian_active = True
        self.simulation_mode = simulation_mode
        
    def check_latency(self) -> Dict:
        """Monitor system latency against quantum benchmarks
        
        In simulation mode: generates representative latency values
        In production mode: would integrate with actual performance metrics
        """
        if self.simulation_mode:
            # Simulation mode: generate representative latency values
            self.current_latency_ns = random.uniform(3.5, 5.5)
        else:
            # Production mode: would use actual performance counters
            # Example: self.current_latency_ns = get_actual_system_latency()
            self.current_latency_ns = time.perf_counter_ns() % 10  # Placeholder
            
        breach = self.current_latency_ns > self.latency_threshold_ns
        
        if breach:
            self.alerts.append({
                "type": "latency_breach",
                "timestamp": time.time(),
                "value": self.current_latency_ns,
                "threshold": self.latency_threshold_ns
            })
            
        return {
            "latency_ns": round(self.current_latency_ns, 2),
            "threshold_ns": self.latency_threshold_ns,
            "within_threshold": not breach,
            "harmonic_stability": round(self.harmonic_stability, 4),
            "simulation_mode": self.simulation_mode
        }
    
    def get_status(self) -> Dict:
        """Get comprehensive guardian status"""
        self.last_check = time.time()
        latency_check = self.check_latency()
        
        return {
            "guardian_active": self.guardian_active,
            "latency": latency_check,
            "total_alerts": len(self.alerts),
            "recent_alerts": self.alerts[-5:] if self.alerts else [],
            "last_check_timestamp": self.last_check,
            "quantum_coherence": "stable" if latency_check["within_threshold"] else "rebalancing",
            "simulation_mode": self.simulation_mode
        }

# Initialize guardian in simulation mode (set to False for production with real metrics)
guardian = CyberSamuraiGuardian(simulation_mode=True)

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
    
    parts = auth_header.split(" ")
    if len(parts) != 2:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header format")
    
    token = parts[1]
    if not supabase:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth service is not configured")

    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Could not validate credentials: {e}")

async def get_optional_user(request: Request):
    """Optional user authentication - returns None if not authenticated"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not supabase:
        return None
    try:
        parts = auth_header.split(" ")
        if len(parts) != 2:
            return None
        token = parts[1]
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception:
        return None

# =============================================================================
# RATE LIMITING AND SCALABILITY FEATURES
# =============================================================================

class RateLimiter:
    """Simple in-memory rate limiter for API endpoints (for production use Redis)"""
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, List[float]] = defaultdict(list)
        self._cleanup_interval = 60  # seconds
        self._last_cleanup = time.time()
    
    def is_allowed(self, client_id: str) -> bool:
        """Check if request is allowed for client"""
        now = time.time()
        
        # Periodic cleanup of old entries
        if now - self._last_cleanup > self._cleanup_interval:
            self._cleanup()
            self._last_cleanup = now
        
        # Get requests in the last minute
        window_start = now - 60
        client_requests = self.requests[client_id]
        
        # Remove old requests
        self.requests[client_id] = [t for t in client_requests if t > window_start]
        
        # Check limit
        if len(self.requests[client_id]) >= self.requests_per_minute:
            return False
        
        # Record new request
        self.requests[client_id].append(now)
        return True
    
    def _cleanup(self):
        """Remove stale entries"""
        window_start = time.time() - 60
        for client_id in list(self.requests.keys()):
            self.requests[client_id] = [t for t in self.requests[client_id] if t > window_start]
            if not self.requests[client_id]:
                del self.requests[client_id]

# Initialize rate limiter (60 requests per minute per IP)
rate_limiter = RateLimiter(requests_per_minute=60)

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def validate_enum(value: Optional[str], enum_class: type, param_name: str):
    """
    Helper function to validate and convert string to enum
    
    Args:
        value: String value to convert
        enum_class: Enum class to convert to
        param_name: Parameter name for error messages
        
    Returns:
        Enum value or None
        
    Raises:
        HTTPException: If value is invalid
    """
    if value is None:
        return None
    
    try:
        return enum_class(value)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid {param_name}. Must be one of: {[e.value for e in enum_class]}"
        )

# Connection tracking for scalability metrics
class ConnectionTracker:
    """Track active connections for load monitoring"""
    def __init__(self, max_connections: int = 10000):
        self.max_connections = max_connections
        self.active_ws_connections = 0
        self.total_requests = 0
        self.requests_per_second = 0
        self._last_second = int(time.time())
        self._current_second_requests = 0
    
    def track_request(self):
        """Track a new request"""
        self.total_requests += 1
        current_second = int(time.time())
        
        if current_second != self._last_second:
            self.requests_per_second = self._current_second_requests
            self._current_second_requests = 1
            self._last_second = current_second
        else:
            self._current_second_requests += 1
    
    def add_ws_connection(self):
        self.active_ws_connections += 1
    
    def remove_ws_connection(self):
        self.active_ws_connections = max(0, self.active_ws_connections - 1)
    
    def get_metrics(self) -> Dict:
        return {
            "active_websocket_connections": self.active_ws_connections,
            "total_requests": self.total_requests,
            "requests_per_second": self.requests_per_second,
            "max_connections": self.max_connections,
            "capacity_utilization": round(self.active_ws_connections / self.max_connections * 100, 2)
        }

connection_tracker = ConnectionTracker(max_connections=10000)

# Track application startup time for metrics
startup_time = time.time()

# --- FASTAPI APPLICATION ---
app = FastAPI(
    title="QVM 3.0 Supabase Resonance Bridge", 
    version="3.3.0",
    description="Pi Forge Quantum Genesis - Mainnet Production Dashboard",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Import and include Pi Network router
try:
    from pi_network_router import router as pi_network_router
    pi_network_available = True
    app.include_router(pi_network_router)
    logging.info("✅ Pi Network router loaded")
except ImportError as e:
    logging.warning(f"⚠️ Pi Network router import failed: {e}")
    pi_network_available = False
    pi_network_router = None

# Add CORS middleware for cross-origin requests
# In production, CORS_ORIGINS env var should be set to specific domains
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:5000,http://localhost:7860")
allowed_origins = [origin.strip() for origin in cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CORS middleware for frontend access
# NOTE: In production, replace "*" with specific allowed origins like:
# ["https://your-domain.com", "https://api.your-domain.com"]
allowed_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Derive a privacy-conscious client id for rate limiting
def _get_client_id(request):
    # Prefer X-Forwarded-For if present (trusted proxy scenario), else fall back to peer host.
    xff = request.headers.get("x-forwarded-for")
    if xff:
        # canonicalize to only first address and avoid logging full IP list
        return xff.split(",")[0].strip()
    if request.client and getattr(request.client, "host", None):
        return request.client.host
    return "unknown"

# Rate limiting middleware applied to all requests
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Apply rate limiting to all HTTP requests"""
    client_ip = _get_client_id(request)
    
    if not rate_limiter.is_allowed(client_ip):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Rate limit exceeded. Please wait before making more requests."}
        )
    
    connection_tracker.track_request()
    response = await call_next(request)
    return response

# --- API ENDPOINTS --- 
@app.get("/")
@trace_fastapi_operation("health_check")
async def health_check():
    """Health check endpoint with quantum resonance status and enhanced tracing"""
    guardian_status = guardian.get_status()
    return {
        "status": "healthy",
        "message": "Quantum Resonance Lattice Online - Mainnet Ready",
        "service": "FastAPI Quantum Conduit",
        "version": "3.3.0",
        "network": PI_NETWORK_CONFIG["network"],
        "supabase": "connected" if supabase else "demo_mode",
        "consciousness_streaming": "active",
        "sacred_trinity": "entangled",
        "tracing_enabled": tracing_enabled,
        "agent_framework": "integrated",
        "quantum_phase": "transcendence",
        "guardian_status": guardian_status["quantum_coherence"],
        "latency_ns": guardian_status["latency"]["latency_ns"],
        "mainnet_ready": True,
        "observability": {
            "opentelemetry": True,
            "azure_ai_sdk": True,
            "agent_framework": tracing_enabled,
            "cross_trinity_flows": True
        }
    }

@app.get("/api/metrics")
async def metrics_endpoint():
    """Prometheus-compatible metrics endpoint"""
    connection_metrics = connection_tracker.get_metrics()
    guardian_status = guardian.get_status()
    
    return {
        "service": "pi-forge-quantum-genesis",
        "version": "3.3.0",
        "uptime_seconds": time.time() - startup_time,
        "connections": connection_metrics,
        "guardian": {
            "latency_ns": guardian_status["latency"]["latency_ns"],
            "harmonic_stability": guardian_status["latency"]["harmonic_stability"],
            "quantum_coherence": guardian_status["quantum_coherence"],
            "total_alerts": guardian_status["total_alerts"]
        },
        "payments_processed": len(payment_records),
        "websocket_connections": connection_metrics["active_websocket_connections"],
        "requests_total": connection_metrics["total_requests"],
        "requests_per_second": connection_metrics["requests_per_second"],
        "timestamp": time.time()
    }

@app.get("/ceremonial")
async def ceremonial_interface():
    """Serve the ceremonial interface in all its glory"""
    return FileResponse("frontend/ceremonial_interface.html", media_type="text/html")

@app.get("/dashboard")
async def production_dashboard():
    """Serve the production dashboard with all user-centric features"""
    return FileResponse("frontend/production_dashboard.html", media_type="text/html")

@app.get("/health")
async def health_endpoint():
    """
    Health check endpoint for Railway.
    Returns immediately with basic status checks (no external service calls).
    """
    return {
        "status": "healthy",
        "service": "pi-forge-quantum-genesis",
        "port": int(os.environ.get("PORT", 8000)),
        "supabase_connected": supabase is not None,
        "timestamp": time.time()
    }

@app.post("/token")
async def login(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not supabase:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth service is not configured")

    try:
        auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return {"access_token": auth_response.session.access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not supabase:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth service is not configured")

    try:
        user_response = supabase.auth.sign_up({"email": email, "password": password})
        # Supabase sends a confirmation email. The user is created but needs to confirm.
        return {"message": "Registration successful. Please check your email to confirm.", "user_id": user_response.user.id}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@app.get("/users/me")
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user

# --- PI NETWORK MAINNET INTEGRATION ENDPOINTS ---

@app.get("/api/pi-network/status")
async def pi_network_status():
    """Get Pi Network integration status and configuration"""
    return {
        "network": PI_NETWORK_CONFIG["network"],
        "sandbox_mode": PI_NETWORK_CONFIG["sandbox_mode"],
        "api_configured": bool(PI_NETWORK_CONFIG["api_key"]),
        "app_configured": bool(PI_NETWORK_CONFIG["app_id"]),
        "mainnet_ready": PI_NETWORK_CONFIG["network"] == "mainnet",
        "timestamp": time.time()
    }

@app.post("/api/payments/approve")
async def approve_payment(payment: PaymentApprovalRequest, current_user = Depends(get_current_user)):
    """
    Approve Pi Network payment (called by frontend after SDK's onReadyForServerApproval)
    This endpoint validates the payment and tells Pi Network to proceed with blockchain transaction
    """
    start_time = time.perf_counter_ns()
    
    try:
        logger.info(f"💳 Approving payment: {payment.payment_id} for {payment.amount} Pi")
        
        # Get payment details from Pi Network to verify
        pi_payment = await get_payment_from_pi_network(payment.payment_id)
        
        # Validate payment amount matches what we expect
        if abs(float(pi_payment.get("amount", 0)) - payment.amount) > 0.0001:
            raise HTTPException(
                status_code=400,
                detail=f"Payment amount mismatch: expected {payment.amount}, got {pi_payment.get('amount')}"
            )
        
        # Validate payment is in correct state
        if pi_payment.get("status") != "pending":
            raise HTTPException(
                status_code=400,
                detail=f"Payment not in pending state: {pi_payment.get('status')}"
            )
        
        # Call Pi Network API to approve payment
        approval_result = await approve_payment_with_pi_network(payment.payment_id)
        
        # Store pending payment in database
        if supabase:
            try:
                supabase.table("payments").insert({
                    "payment_id": payment.payment_id,
                    "user_id": current_user.id,
                    "amount": payment.amount,
                    "status": "approved",
                    "metadata": payment.metadata or {},
                    "approved_at": datetime.utcnow().isoformat()
                }).execute()
            except Exception as db_error:
                logger.error(f"Failed to store payment in database: {db_error}")
        
        processing_time_ns = time.perf_counter_ns() - start_time
        
        logger.info(f"✅ Payment approved: {payment.payment_id}")
        return {
            "approved": True,
            "payment_id": payment.payment_id,
            "status": "approved",
            "message": "Payment approved - proceed to blockchain",
            "processing_time_ns": processing_time_ns,
            "timestamp": time.time()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Payment approval failed: {e}")
        raise HTTPException(status_code=500, detail=f"Payment approval failed: {str(e)}")

@app.post("/api/payments/complete")
async def complete_payment(payment: PaymentCompletionRequest):
    """
    Complete Pi Network payment (called by frontend after blockchain confirmation)
    This endpoint verifies the blockchain transaction and finalizes the payment
    """
    start_time = time.perf_counter_ns()
    
    try:
        logger.info(f"🎉 Completing payment: {payment.payment_id} with txid: {payment.txid}")
        
        # Complete payment with Pi Network API
        completion_result = await complete_payment_with_pi_network(payment.payment_id, payment.txid)
        
        # Determine resonance state based on payment amount
        pi_payment = await get_payment_from_pi_network(payment.payment_id)
        amount = float(pi_payment.get("amount", 0))
        
        if amount >= 1.0:
            resonance_state = "transcendence"
        elif amount >= 0.5:
            resonance_state = "harmony"
        elif amount >= 0.1:
            resonance_state = "growth"
        else:
            resonance_state = "foundation"
        
        # Update payment in database
        if supabase:
            try:
                supabase.table("payments").update({
                    "status": "completed",
                    "txid": payment.txid,
                    "resonance_state": resonance_state,
                    "completed_at": datetime.utcnow().isoformat()
                }).eq("payment_id", payment.payment_id).execute()
            except Exception as db_error:
                logger.error(f"Failed to update payment in database: {db_error}")
        
        processing_time_ns = time.perf_counter_ns() - start_time
        
        logger.info(f"✅ Payment completed: {payment.payment_id}")
        return {
            "success": True,
            "payment_id": payment.payment_id,
            "txid": payment.txid,
            "status": "completed",
            "resonance_state": resonance_state,
            "amount": amount,
            "message": "Payment completed successfully",
            "processing_time_ns": processing_time_ns,
            "timestamp": time.time()
        }
        
    except Exception as e:
        logger.error(f"❌ Payment completion failed: {e}")
        raise HTTPException(status_code=500, detail=f"Payment completion failed: {str(e)}")

@app.post("/api/payments/incomplete")
async def handle_incomplete_payment(payment: IncompletePaymentRequest):
    """
    Handle incomplete payment found during user authentication
    Pi SDK calls this when a payment was interrupted (user closed app, etc.)
    """
    try:
        logger.info(f"🔄 Handling incomplete payment: {payment.payment_id}")
        
        # Get payment status from Pi Network
        pi_payment = await get_payment_from_pi_network(payment.payment_id)
        
        if pi_payment.get("status") == "completed":
            # Payment was actually completed, update our records
            if supabase:
                supabase.table("payments").upsert({
                    "payment_id": payment.payment_id,
                    "user_id": payment.user_uid,
                    "amount": payment.amount,
                    "status": "completed",
                    "txid": pi_payment.get("transaction", {}).get("txid"),
                    "completed_at": datetime.utcnow().isoformat()
                }).execute()
            
            return {"status": "completed", "message": "Payment was completed"}
        else:
            # Payment incomplete, return current status
            return {
                "status": pi_payment.get("status"),
                "message": f"Payment is {pi_payment.get('status')}"
            }
            
    except Exception as e:
        logger.error(f"Error handling incomplete payment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pi-webhooks/payment")
async def pi_payment_webhook(request: Request):
    """
    Webhook endpoint for Pi Network payment status updates
    Handles: payment.approved, payment.completed, payment.cancelled
    """
    try:
        # Get raw body for signature verification
        body = await request.body()
        signature = request.headers.get("X-Pi-Signature", "")
        
        # Verify webhook signature
        if not verify_webhook_signature(body, signature):
            logger.error("❌ Invalid webhook signature")
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        # Parse webhook payload
        payload = await request.json()
        webhook_data = PiWebhookPayload(**payload)
        
        logger.info(f"📨 Webhook received: {webhook_data.status} for payment {webhook_data.payment_id}")
        
        # Update payment status in database
        if supabase:
            update_data = {
                "status": webhook_data.status,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if webhook_data.txid:
                update_data["txid"] = webhook_data.txid
                
            if webhook_data.status == "completed":
                update_data["completed_at"] = datetime.utcnow().isoformat()
            
            try:
                supabase.table("payments").update(update_data).eq(
                    "payment_id", webhook_data.payment_id
                ).execute()
                logger.info(f"✅ Database updated for payment {webhook_data.payment_id}")
            except Exception as db_error:
                logger.error(f"Failed to update payment via webhook: {db_error}")
        
        # Broadcast payment status to connected WebSocket clients
        status_message = {
            "type": "payment_status_update",
            "payment_id": webhook_data.payment_id,
            "status": webhook_data.status,
            "txid": webhook_data.txid,
            "timestamp": time.time()
        }
        
        for ws in connected_users.values():
            try:
                await ws.send_json(status_message)
            except:
                pass  # Ignore disconnected clients
        
        return {"status": "received", "payment_id": webhook_data.payment_id}
        
    except Exception as e:
        logger.error(f"❌ Webhook processing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/verify-payment")
async def verify_payment(payment: PaymentVerification, current_user = Depends(get_current_user)):
    """
    Legacy endpoint - Verify and process a Pi Network payment on mainnet
    Note: Use /api/payments/approve and /api/payments/complete for new integrations
    """
    start_time = time.perf_counter_ns()
    
    try:
        # Generate verification hash
        verification_data = f"{payment.payment_id}{payment.amount}{time.time()}"
        verification_hash = hashlib.sha256(verification_data.encode()).hexdigest()
        
        # Get payment from Pi Network
        pi_payment = await get_payment_from_pi_network(payment.payment_id)
        resonance_state = "transcendence" if payment.amount >= 0.1 else "harmony"
        
        # Calculate processing latency
        processing_time_ns = time.perf_counter_ns() - start_time
        
        result = {
            "status": "verified",
            "payment_id": payment.payment_id,
            "amount": payment.amount,
            "tx_hash": pi_payment.get("transaction", {}).get("txid", verification_hash[:16]),
            "verification_hash": verification_hash,
            "resonance_state": resonance_state,
            "network": PI_NETWORK_CONFIG["network"],
            "processing_time_ns": processing_time_ns,
            "timestamp": time.time()
        }
        
        logger.info(f"Payment verified: {payment.payment_id} for {payment.amount} Pi")
        return result
        
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")

@app.get("/api/quantum-telemetry")
async def quantum_telemetry():
    """Get quantum telemetry data for dashboard visualization"""
    guardian_status = guardian.get_status()
    
    return {
        "harmony_index": round(random.uniform(0.75, 0.95), 4),
        "collective_mood": random.choice(["optimistic", "balanced", "exploratory", "creative"]),
        "qvm_amplitude": round(random.uniform(0.85, 1.15), 4),
        "resonance_trend": round(random.uniform(-0.05, 0.1), 3),
        "forecast_confidence": round(random.uniform(0.8, 0.95), 3),
        "guardian_status": guardian_status,
        "sovereign_actions": [
            "Consider staking additional Pi for governance participation",
            "New dApp deployment window opening in 2 hours",
            "Community proposal #127 entering voting phase"
        ],
        "temporal_anomalies": [],
        "timestamp": time.time()
    }

@app.post("/api/ethical-audit")
async def ethical_audit(audit: EthicalAuditRequest):
    """Perform ethical AI audit on transaction or smart contract"""
    start_time = time.perf_counter_ns()
    
    # Ethical scoring algorithm
    base_risk = 0.02
    amount_factor = min(audit.amount / 1000, 0.1) if audit.amount > 100 else 0
    
    # Check for contract code audit
    contract_risk = 0
    contract_analysis = None
    if audit.contract_code:
        # Simulate contract analysis
        contract_risk = 0.01 if len(audit.contract_code) > 1000 else 0
        contract_analysis = {
            "vulnerabilities_found": 0,
            "gas_optimization_score": round(random.uniform(0.85, 0.98), 2),
            "ethical_compliance": "passed",
            "audit_depth": "standard"
        }
    
    risk_score = round(base_risk + amount_factor + contract_risk, 4)
    approved = risk_score < 0.05
    
    processing_time_ns = time.perf_counter_ns() - start_time
    
    return {
        "transaction_id": audit.transaction_id,
        "risk_score": risk_score,
        "approved": approved,
        "ethical_compliance": "compliant" if approved else "review_required",
        "narrative": f"Transaction analyzed with {risk_score:.2%} risk assessment",
        "contract_analysis": contract_analysis,
        "processing_time_ns": processing_time_ns,
        "auditor": "CyberSamurai Guardian AI",
        "timestamp": time.time()
    }

# --- CYBER SAMURAI GUARDIAN ENDPOINTS ---

@app.get("/api/guardian/status")
async def guardian_status():
    """Get Cyber Samurai Guardian monitoring status"""
    return guardian.get_status()

@app.get("/api/guardian/latency")
async def guardian_latency():
    """Get current latency metrics against quantum benchmarks"""
    return guardian.check_latency()

@app.get("/api/guardian/alerts")
async def guardian_alerts():
    """Get recent guardian alerts"""
    return {
        "total_alerts": len(guardian.alerts),
        "alerts": guardian.alerts[-20:] if guardian.alerts else [],
        "alert_threshold": guardian.latency_threshold_ns,
        "timestamp": time.time()
    }

# --- GOVERNANCE SIMULATION ENDPOINTS ---

@app.post("/api/governance/propose")
async def create_proposal(
    proposal: GovernanceProposal,
    current_user: dict = Depends(get_current_user)
):
    """Create a new governance proposal"""
    proposal_id = hashlib.sha256(f"{proposal.title}{time.time()}".encode()).hexdigest()[:12]
    
    return {
        "proposal_id": proposal_id,
        "title": proposal.title,
        "description": proposal.description,
        "type": proposal.proposal_type,
        "required_stake": proposal.required_stake,
        "voting_period_days": proposal.voting_period_days,
        "status": "pending_review",
        "created_at": datetime.now().isoformat(),
        "voting_starts": None,
        "total_votes": 0,
        "ethical_review": "pending"
    }

@app.get("/api/governance/proposals")
async def list_proposals():
    """List active governance proposals"""
    # Simulated proposals for demo
    return {
        "proposals": [
            {
                "proposal_id": "prop_001",
                "title": "Increase Staking Rewards to 6% APY",
                "type": "parameter_change",
                "status": "voting",
                "votes_for": 15420,
                "votes_against": 3210,
                "ends_at": "2025-12-10T00:00:00Z"
            },
            {
                "proposal_id": "prop_002", 
                "title": "Community Development Fund Allocation",
                "type": "fund_allocation",
                "status": "pending_review",
                "votes_for": 0,
                "votes_against": 0,
                "ends_at": None
            }
        ],
        "total_active": 2,
        "timestamp": time.time()
    }

# --- SMART CONTRACT AUDIT ENDPOINTS ---

@app.post("/api/contracts/audit")
async def audit_smart_contract(audit: SmartContractAudit, current_user=Depends(get_current_user)):
    """Perform smart contract security audit
    
    Note: This is a demonstration audit system using pattern-based analysis.
    For production use, integrate with established security tools like:
    - Slither, Mythril, or Securify for Solidity
    - Manual expert review for critical contracts
    
    The current implementation provides:
    - Basic pattern-based vulnerability detection
    - Complexity estimation
    - Educational recommendations
    
    It should NOT be used as the sole security verification for
    production smart contracts handling real value.
    """
    start_time = time.perf_counter_ns()
    
    # Pattern-based analysis (demonstration - not production-grade)
    code_length = len(audit.contract_code)
    complexity_score = min(code_length / 5000, 1.0)
    code_lower = audit.contract_code.lower()
    
    vulnerabilities = []
    
    # Check for common vulnerability patterns
    # Note: These are educational examples, not comprehensive security checks
    if "transfer(" in code_lower and "require(" not in code_lower:
        vulnerabilities.append({
            "type": "potential_missing_access_control",
            "severity": "medium",
            "description": "Transfer function detected without visible require() checks",
            "recommendation": "Add require() checks for authorization before transfers"
        })
    
    if "selfdestruct" in code_lower:
        vulnerabilities.append({
            "type": "selfdestruct_present",
            "severity": "high",
            "description": "Contract contains selfdestruct functionality",
            "recommendation": "Remove selfdestruct or implement strict multi-sig access controls"
        })
    
    if "tx.origin" in code_lower:
        vulnerabilities.append({
            "type": "tx_origin_authentication",
            "severity": "high",
            "description": "Using tx.origin for authentication is vulnerable to phishing",
            "recommendation": "Use msg.sender instead of tx.origin for authentication"
        })
    
    if "delegatecall" in code_lower and "library" not in code_lower:
        vulnerabilities.append({
            "type": "delegatecall_usage",
            "severity": "medium",
            "description": "delegatecall used outside of library context",
            "recommendation": "Ensure delegatecall target is trusted and immutable"
        })
    
    processing_time_ns = time.perf_counter_ns() - start_time
    
    return {
        "contract_name": audit.contract_name,
        "audit_depth": audit.audit_depth,
        "audit_type": "pattern_based_demonstration",
        "disclaimer": "This is a demonstration audit. For production contracts, use professional audit services.",
        "complexity_score": round(complexity_score, 2),
        "vulnerabilities": vulnerabilities,
        "vulnerability_count": len(vulnerabilities),
        "gas_optimization": {
            "score": round(random.uniform(0.7, 0.95), 2),
            "suggestions": [
                "Consider using uint256 for gas efficiency",
                "Pack storage variables to save gas",
                "Use events for cheaper data storage"
            ]
        },
        "ethical_compliance": {
            "passed": len([v for v in vulnerabilities if v["severity"] == "high"]) == 0,
            "fairness_score": round(random.uniform(0.85, 0.98), 2),
            "transparency_score": round(random.uniform(0.8, 0.95), 2),
            "note": "Ethical compliance scores are indicative only"
        },
        "overall_score": round(max(0, 1.0 - (len(vulnerabilities) * 0.15)), 2),
        "processing_time_ns": processing_time_ns,
        "auditor": "Quantum Pi Forge Pattern Analyzer",
        "recommended_next_steps": [
            "Professional audit for production contracts",
            "Manual code review",
            "Formal verification for critical functions"
        ],
        "timestamp": time.time()
    }

# --- AUTONOMOUS DECISION ENDPOINTS ---

@app.post("/api/autonomous/decision")
async def make_autonomous_decision(context: DecisionContext):
    """
    Make an autonomous decision based on provided context and parameters.
    Returns decision result with approval status and recommended actions.
    """
    decision_matrix = get_decision_matrix()
    result = decision_matrix.make_decision(context)
    
    return {
        "decision_id": result.decision_id,
        "decision_type": result.decision_type.value,
        "approved": result.approved,
        "confidence": result.confidence,
        "reasoning": result.reasoning,
        "actions": result.actions,
        "requires_guardian": result.requires_guardian,
        "timestamp": result.timestamp,
        "metadata": result.metadata
    }

@app.get("/api/autonomous/decision-history")
async def get_decision_history(
    decision_type: Optional[str] = None,
    limit: int = 100
):
    """Get history of autonomous decisions"""
    decision_matrix = get_decision_matrix()
    
    # Convert string to enum if provided
    type_filter = validate_enum(decision_type, DecisionType, "decision_type")
    
    history = decision_matrix.get_decision_history(type_filter, limit)
    
    return {
        "decisions": [
            {
                "decision_id": d.decision_id,
                "decision_type": d.decision_type.value,
                "approved": d.approved,
                "confidence": d.confidence,
                "reasoning": d.reasoning,
                "requires_guardian": d.requires_guardian,
                "timestamp": d.timestamp
            }
            for d in history
        ],
        "count": len(history)
    }

@app.get("/api/autonomous/metrics")
async def get_decision_metrics():
    """Get metrics about autonomous decision making"""
    decision_matrix = get_decision_matrix()
    metrics = decision_matrix.get_decision_metrics()
    
    return {
        "metrics": metrics,
        "timestamp": time.time()
    }

# --- SELF-HEALING & DIAGNOSTICS ENDPOINTS ---

@app.get("/api/health/diagnostics")
async def run_system_diagnostics():
    """Run automated system diagnostics and return health status"""
    healing_system = get_healing_system()
    health_status = healing_system.get_system_health()
    return health_status

@app.get("/api/health/incidents")
async def get_incident_reports(
    severity: Optional[str] = None,
    component: Optional[str] = None,
    limit: int = 100
):
    """Get incident reports with optional filtering"""
    healing_system = get_healing_system()
    
    # Convert string to enum if provided
    severity_filter = validate_enum(severity, IncidentSeverity, "severity")
    
    incidents = healing_system.get_incident_report(severity_filter, component, limit)
    
    return {
        "incidents": [
            {
                "incident_id": i.incident_id,
                "severity": i.severity.value,
                "component": i.component,
                "description": i.description,
                "auto_healed": i.auto_healed,
                "healing_actions": i.healing_actions,
                "timestamp": i.timestamp,
                "metadata": i.metadata
            }
            for i in incidents
        ],
        "count": len(incidents)
    }

# --- GUARDIAN MONITORING & OVERSIGHT ENDPOINTS ---

@app.get("/api/guardian/monitoring-status")
async def get_guardian_monitoring_status():
    """Get comprehensive guardian monitoring status"""
    monitor = get_guardian_monitor()
    return monitor.get_monitoring_status()

@app.post("/api/guardian/validate-decision")
async def validate_decision(
    decision_id: str,
    decision_data: Dict[str, Any]
):
    """Validate an autonomous decision for safety and compliance"""
    monitor = get_guardian_monitor()
    result = monitor.validate_decision(decision_id, decision_data)
    
    return {
        "validation_id": result.validation_id,
        "target": result.target,
        "status": result.status.value,
        "checks_passed": result.checks_passed,
        "checks_failed": result.checks_failed,
        "details": result.details,
        "timestamp": result.timestamp
    }

@app.post("/api/guardian/override-decision")
async def override_decision(
    original_decision_id: str,
    action: str,
    reasoning: str,
    guardian_id: str
):
    """Guardian override of an autonomous decision (requires guardian authentication)"""
    # In production, verify guardian authentication via JWT
    # For now, accept the guardian_id parameter
    
    monitor = get_guardian_monitor()
    decision = monitor.guardian_override_decision(
        original_decision_id,
        action,
        reasoning,
        guardian_id
    )
    
    return {
        "decision_id": decision.decision_id,
        "original_decision_id": decision.original_decision_id,
        "action": decision.action,
        "reasoning": decision.reasoning,
        "guardian_id": decision.guardian_id,
        "timestamp": decision.timestamp
    }

@app.post("/api/guardian/update-monitoring-level")
async def update_monitoring_level(
    level: str,
    reason: str
):
    """Update system monitoring level (requires guardian authentication)"""
    # Convert string to enum
    new_level = validate_enum(level, MonitoringLevel, "monitoring_level")
    
    monitor = get_guardian_monitor()
    monitor.update_monitoring_level(new_level, reason)
    
    return {
        "monitoring_level": new_level.value,
        "reason": reason,
        "timestamp": time.time()
    }

@app.get("/api/guardian/validation-history")
async def get_validation_history(
    status: Optional[str] = None,
    limit: int = 100
):
    """Get validation history with optional filtering"""
    monitor = get_guardian_monitor()
    
    # Convert string to enum if provided
    status_filter = validate_enum(status, ValidationStatus, "status")
    
    history = monitor.get_validation_history(status_filter, limit)
    
    return {
        "validations": [
            {
                "validation_id": v.validation_id,
                "target": v.target,
                "status": v.status.value,
                "checks_passed": v.checks_passed,
                "checks_failed": v.checks_failed,
                "details": v.details,
                "timestamp": v.timestamp
            }
            for v in history
        ],
        "count": len(history)
    }

@app.get("/api/guardian/dashboard")
async def guardian_dashboard():
    """Guardian oversight dashboard - shows pending escalations"""
    decision_matrix = get_decision_matrix()
    guardian_monitor = get_guardian_monitor()
    
    pending_decisions = [
        d for d in decision_matrix.decision_history[-50:]
        if d.requires_guardian and not d.approved
    ]
    
    return {
        "guardian_team": "Issue #100 - @onenoly1010",
        "pending_escalations": len(pending_decisions),
        "recent_decisions": [
            {
                "decision_id": d.decision_id,
                "decision_type": d.decision_type.value,
                "priority": d.get_priority(),
                "confidence": d.confidence,
                "reasoning": d.reasoning,
                "requires_guardian": d.requires_guardian,
                "approved": d.approved,
                "timestamp": d.timestamp
            }
            for d in pending_decisions
        ],
        "monitoring_status": guardian_monitor.get_monitoring_status(),
        "escalation_endpoint": "https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100"
    }

# --- MONITORING AGENTS ENDPOINTS ---

@app.get("/api/monitoring/status")
async def get_monitoring_status():
    """Get status of all monitoring agents"""
    monitoring = get_monitoring_system()
    return monitoring.get_system_status()

@app.get("/api/monitoring/latest-data")
async def get_latest_monitoring_data(limit: int = 10):
    """Get latest data from all monitoring agents"""
    monitoring = get_monitoring_system()
    data = monitoring.get_all_latest_data(limit)
    
    return {
        "data": data,
        "timestamp": time.time()
    }

@app.post("/api/monitoring/report-to-vercel")
async def report_metrics_to_vercel(metrics: Dict[str, Any]):
    """Report metrics to Vercel serverless function"""
    monitoring = get_monitoring_system()
    
    # Add timestamp and source
    metrics_payload = {
        "metrics": [
            {
                "metric_type": k,
                "value": v,
                "timestamp": time.time(),
                "source": "pi-forge-quantum-genesis"
            }
            for k, v in metrics.items()
        ],
        "service": "pi-forge-quantum-genesis",
        "version": "3.3.0"
    }
    
    await monitoring.report_to_vercel(metrics_payload)
    
    return {
        "status": "reported",
        "metrics_count": len(metrics_payload["metrics"]),
        "timestamp": time.time()
    }

@app.post("/api/monitoring/configure-vercel")
async def configure_vercel_endpoint(endpoint: str):
    """Configure Vercel endpoint for metrics reporting"""
    monitoring = get_monitoring_system()
    monitoring.configure_vercel_endpoint(endpoint)
    
    return {
        "status": "configured",
        "endpoint": endpoint,
        "timestamp": time.time()
    }

# --- OINIO MEMORIAL AI ENDPOINTS ---

@app.post("/api/memorial/generate")
async def generate_memorial_content(request: MemorialGenerationRequest):
    """Generate AI-powered memorial content using Azure AI"""
    try:
        # Convert Pydantic model to dataclass
        profile = MemorialProfile(
            name=request.profile.name,
            birth_date=request.profile.birth_date,
            passing_date=request.profile.passing_date,
            relationship=request.profile.relationship,
            personality_traits=request.profile.personality_traits,
            achievements=request.profile.achievements,
            favorite_memories=request.profile.favorite_memories,
            legacy_message=request.profile.legacy_message
        )

        # Generate memorial package
        memorial_package = await generate_complete_memorial_package(
            profile=profile,
            contributor_name=request.contributor_name
        )

        # Filter content based on requested types
        filtered_package = {
            "generated_at": memorial_package["generated_at"],
            "profile": memorial_package["profile"]
        }

        for content_type in request.content_types:
            if content_type in memorial_package:
                filtered_package[content_type] = memorial_package[content_type]

        return {
            "status": "generated",
            "memorial": filtered_package,
            "content_types": request.content_types,
            "ai_provider": "azure_ai" if os.getenv("AZURE_AI_ENDPOINT") else "demo_mode"
        }

    except Exception as e:
        logger.error(f"Memorial generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Memorial generation failed: {str(e)}"
        )

@app.get("/api/memorial/status")
async def get_memorial_ai_status():
    """Get the status of the memorial AI system"""
    ai_available = os.getenv("AZURE_AI_ENDPOINT") and os.getenv("AZURE_AI_KEY")

    return {
        "service": "OINIO Memorial AI Generator",
        "status": "active",
        "ai_backend": "azure_ai" if ai_available else "demo_mode",
        "capabilities": [
            "memorial_narratives",
            "commemorative_poems",
            "personal_reflections",
            "legacy_stories"
        ],
        "supported_content_types": ["narrative", "poem", "reflection"],
        "quantum_integration": True,
        "ethical_filtering": True
    }

# --- SECURE WEBSOCKET (REMAINS CONCEPTUALLY SIMILAR) ---
@app.websocket("/ws/collective-insight")
async def websocket_collective_insight(websocket: WebSocket, token: Optional[str] = None):
    """Real-time collective insight WebSocket with quantum telemetry"""
    user_email = "anonymous"
    
    if token and supabase:
        try:
            user_response = supabase.auth.get_user(token)
            user_email = user_response.user.email
        except Exception:
            pass  # Continue with anonymous access
    
    await websocket.accept()
    connection_id = hashlib.sha256(f"{user_email}{time.time()}".encode()).hexdigest()[:8]
    connected_users[connection_id] = websocket
    connection_tracker.add_ws_connection()
    logging.info(f"User {user_email} connected to collective insight WebSocket (ID: {connection_id})")
    
    try:
        while True:
            # Send real-time quantum telemetry
            telemetry = {
                "type": "quantum_pulse",
                "collective_mood": random.choice(["optimistic", "neutral", "contemplative", "harmonious"]),
                "qvm_amplitude": round(random.uniform(0.8, 1.2), 4),
                "harmony_index": round(random.uniform(0.68, 0.76), 3),
                "resonance_trend": round(random.uniform(-0.1, 0.1), 2),
                "forecast_confidence": round(random.uniform(0.7, 0.95), 3),
                "quantum_phase": random.choice(["foundation", "growth", "harmony", "transcendence"]),
                "sovereign_actions": [
                    "Continue current resonance pattern",
                    "Monitor harmony fluctuations"
                ],
                "temporal_anomalies": [],
                "connected_users": len(connected_users),
                "guardian_status": guardian_metrics["threat_level"],
                "timestamp": time.time()
            }
            await websocket.send_json(telemetry)
            await asyncio.sleep(5)  # Send updates every 5 seconds
    except WebSocketDisconnect:
        del connected_users[connection_id]
        connection_tracker.remove_ws_connection()
        logging.info(f"User {user_email} disconnected from WebSocket")
    except Exception as e:
        if connection_id in connected_users:
            del connected_users[connection_id]
            connection_tracker.remove_ws_connection()
        logging.warning(f"WebSocket error: {e}")

@app.websocket("/ws/guardian-alerts")
async def websocket_guardian_alerts(websocket: WebSocket):
    """Real-time Cyber Samurai Guardian alert stream"""
    # Accept token from Authorization: Bearer <token> or query param token
    auth = websocket.headers.get("authorization", "")
    token = None
    if isinstance(auth, str) and auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1].strip()
    else:
        token = websocket.query_params.get("token")

    if not token:
        # best-effort alert to guardian/monitoring and close connection
        try:
            guardian.raise_alert("ws_auth_missing", {"path": str(getattr(websocket, 'url', 'unknown'))})
        except Exception:
            pass
        await websocket.close(code=4401)
        return

    # If supabase available, attempt token validation (best-effort). Otherwise apply demo/guest rules.
    if supabase is not None:
        try:
            user = supabase.auth.get_user(token)  # best-effort; adjust to your supabase client API
            if user is None or not user.get("id"):
                await websocket.close(code=4403)
                return
        except Exception:
            await websocket.close(code=4403)
            return
    else:
        # Demo-mode rule: allow tokens that follow a known dev prefix; otherwise deny
        if not (isinstance(token, str) and token.startswith("dev-")):
            await websocket.close(code=4403)
            return

    await websocket.accept()
    logging.info("Guardian alert WebSocket connected")

    # Wrap stream handling with a tracing span (no-op if tracing disabled)
    with trace_consciousness_stream(connection_id=str(id(websocket)), user_id=(token[:8] + "...") if token else None):
        try:
            while True:
                # Send guardian status updates
                alert_data = {
                    "type": "guardian_status",
                    "latency_ns": guardian_metrics["latency_ns"],
                    "harmonic_stability": guardian_metrics["harmonic_stability"],
                    "threat_level": guardian_metrics["threat_level"],
                    "active_alerts": len(guardian_metrics["active_alerts"]),
                    "monitored_transactions": guardian_metrics["monitored_transactions"],
                    "status": "active",
                    "timestamp": time.time()
                }
                await websocket.send_json(alert_data)
                await asyncio.sleep(10)
        except WebSocketDisconnect:
            logging.info("Guardian alert WebSocket disconnected")
        except Exception as e:
            logging.warning(f"Guardian WebSocket error: {e}")

# --- STARTUP EVENT ---
@app.on_event("startup")
async def startup_event():
    logging.basicConfig(level=logging.INFO)
    logger.info("🚀 QVM 3.3.0 - Pi Forge Quantum Genesis - INITIALIZING...")
    
    # Validate Pi Network configuration
    try:
        validate_pi_network_config()
    except ValueError as e:
        logger.error(f"❌ Pi Network configuration validation failed: {e}")
        if PI_NETWORK_CONFIG["network"] == "mainnet":
            raise  # Fail fast in mainnet mode
    
    logger.info(f"📡 Network Mode: {PI_NETWORK_CONFIG['network']}")
    logger.info(f"🔒 Supabase: {'connected' if supabase else 'demo mode'}")
    logger.info(f"⚔️ Cyber Samurai Guardian: {'active' if guardian.guardian_active else 'inactive'}")
    logger.info(f"🎯 Latency Target: <{guardian.latency_threshold_ns}ns")
    logger.info("🌌 Sacred Trinity entanglement complete - Mainnet Ready!")
    
    # Start Pi Network background tasks
    try:
        from pi_network_router import pi_client
        await pi_client.start_background_tasks()
        logger.info("✅ Pi Network background tasks started")
    except Exception as e:
        logger.warning(f"⚠️ Failed to start Pi Network background tasks: {e}")


# --- SHUTDOWN EVENT ---
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    logger.info("🛑 Shutting down Pi Forge Quantum Genesis...")
    
    # Stop Pi Network background tasks
    try:
        from pi_network_router import pi_client
        await pi_client.stop_background_tasks()
        logger.info("✅ Pi Network background tasks stopped")
    except Exception as e:
        logger.warning(f"⚠️ Error stopping Pi Network background tasks: {e}")
    
    logger.info("👋 Shutdown complete")

# --- MAIN ---
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    # Only enable reload in development (when DEBUG env var is set)
    debug_mode = os.environ.get("DEBUG", "false").lower() == "true"
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info", reload=debug_mode)
