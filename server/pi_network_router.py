"""
Enhanced Pi Network API Endpoints
Modular, production-ready Pi Network integration endpoints for FastAPI
"""

from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import logging
import time
import os
from dataclasses import asdict

from pi_network import (
    PiNetworkClient,
    PiNetworkConfig,
    PiNetworkError,
    PiAuthenticationError,
    PiPaymentError
)
from pi_network.payments import PaymentStatus
from pi_network.ethical_guardian import ethical_guardian

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/pi-network", tags=["Pi Network"])

# Initialize Pi Network client
pi_client = PiNetworkClient(PiNetworkConfig.from_env())

# Security helper
def sanitize_error_message(error: Exception, context: str = "Operation") -> str:
    """
    Sanitize error messages for production use
    
    In development/testnet: Return full error details for debugging
    In production: Return generic error message to prevent information disclosure
    
    Args:
        error: The exception that occurred
        context: Context of the operation (e.g., "Authentication", "Payment creation")
        
    Returns:
        Sanitized error message appropriate for the environment
    """
    is_production = os.environ.get("APP_ENVIRONMENT", "testnet") == "production"
    
    if is_production:
        # Production: Return generic error message
        return f"{context} failed. Please try again or contact support."
    else:
        # Development/Testnet: Return detailed error for debugging
        return str(error)



# --- REQUEST/RESPONSE MODELS ---

class PiAuthRequest(BaseModel):
    """Pi Network authentication request"""
    pi_uid: str = Field(..., description="Pi Network user ID")
    username: str = Field(..., description="Pi Network username")
    access_token: str = Field(..., description="Pi Network access token")
    session_data: Optional[Dict[str, Any]] = Field(default=None, description="Additional session data")


class PiAuthResponse(BaseModel):
    """Pi Network authentication response"""
    status: str
    session_id: str
    pi_uid: str
    username: str
    expires_at: float


class PiPaymentCreateRequest(BaseModel):
    """Create Pi Network payment request"""
    amount: float = Field(..., gt=0, description="Payment amount in Pi")
    memo: str = Field(..., min_length=1, max_length=500, description="Payment memo")
    user_id: str = Field(..., description="Pi Network user ID")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Payment metadata")


class PiPaymentResponse(BaseModel):
    """Pi Network payment response"""
    payment_id: str
    amount: float
    memo: str
    user_id: str
    status: str
    tx_hash: Optional[str] = None
    created_at: float
    metadata: Dict[str, Any]


class PiPaymentApprovalRequest(BaseModel):
    """Approve payment request"""
    payment_id: str = Field(..., description="Payment ID to approve")


class PiPaymentCompletionRequest(BaseModel):
    """Complete payment request"""
    payment_id: str = Field(..., description="Payment ID to complete")
    tx_hash: str = Field(..., description="Blockchain transaction hash")


class PiPaymentVerificationRequest(BaseModel):
    """Verify payment request"""
    payment_id: str = Field(..., description="Payment ID to verify")
    tx_hash: str = Field(..., description="Transaction hash to verify")


class PiSessionVerifyRequest(BaseModel):
    """Verify session request"""
    session_id: str = Field(..., description="Session ID to verify")


# --- API ENDPOINTS ---

@router.get("/status", summary="Get Pi Network integration status")
async def get_pi_network_status():
    """
    Get comprehensive Pi Network integration status
    
    Returns:
        - Network mode (mainnet/testnet)
        - Configuration status
        - Active sessions
        - Payment statistics
    """
    try:
        status = pi_client.get_status()
        return {
            "success": True,
            "data": status,
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Failed to get Pi Network status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Status retrieval")
        )


@router.get("/health", summary="Health check for Pi Network integration")
async def get_pi_network_health():
    """
    Health check endpoint for Pi Network integration
    
    Returns:
        Health status of all Pi Network components
    """
    try:
        health = pi_client.get_health()
        
        if not health["overall"]:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Pi Network integration is unhealthy"
            )
        
        return {
            "success": True,
            "health": health,
            "timestamp": time.time()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Health check")
        )


@router.post("/authenticate", response_model=PiAuthResponse, summary="Authenticate Pi Network user")
async def authenticate_pi_user(auth_request: PiAuthRequest, request: Request):
    """
    Authenticate user with Pi Network credentials
    
    Includes ethical audit for authentication patterns
    
    Args:
        auth_request: Authentication request with Pi Network credentials
        request: FastAPI request object for IP extraction
        
    Returns:
        Authentication result with session information
    """
    try:
        # Perform ethical audit of authentication
        client_ip = request.client.host if request.client else None
        auth_audit = ethical_guardian.audit_authentication(
            user_id=auth_request.pi_uid,
            ip_address=client_ip,
            metadata={"username": auth_request.username}
        )
        
        # Check compliance
        if auth_audit.compliance_status.value == "rejected":
            logger.warning(f"Authentication rejected by ethical guardian: {auth_audit.findings}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "Authentication rejected by ethical compliance review",
                    "audit": auth_audit.to_dict()
                }
            )
        
        # Proceed with authentication
        result = pi_client.authenticate_user(
            pi_uid=auth_request.pi_uid,
            username=auth_request.username,
            access_token=auth_request.access_token,
            session_data=auth_request.session_data
        )
        
        logger.info(
            f"User authenticated with ethical audit: {auth_request.username} | "
            f"Risk: {auth_audit.risk_level.value} | "
            f"UID: {auth_request.pi_uid}"
        )
        
        return PiAuthResponse(**result)
        
    except HTTPException:
        raise
    except PiAuthenticationError as e:
        logger.warning(f"Authentication failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Authentication")
        )


@router.post("/session/verify", summary="Verify Pi Network session")
async def verify_pi_session(verify_request: PiSessionVerifyRequest):
    """
    Verify active Pi Network session
    
    Args:
        verify_request: Session verification request
        
    Returns:
        Session information if valid
    """
    try:
        session = pi_client.verify_session(verify_request.session_id)
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session"
            )
        
        return {
            "success": True,
            "session": session,
            "timestamp": time.time()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Session verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Session verification")
        )


@router.post("/logout", summary="Logout Pi Network user")
async def logout_pi_user(session_id: str):
    """
    Logout user (invalidate session)
    
    Args:
        session_id: Session identifier
        
    Returns:
        Logout confirmation
    """
    try:
        success = pi_client.logout(session_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        
        return {
            "success": True,
            "message": "Logged out successfully",
            "timestamp": time.time()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Logout error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Logout")
        )


@router.post("/payments/create", response_model=PiPaymentResponse, summary="Create Pi Network payment")
async def create_pi_payment(payment_request: PiPaymentCreateRequest):
    """
    Create new Pi Network payment with ethical audit
    
    Args:
        payment_request: Payment creation request
        
    Returns:
        Created payment information
    """
    try:
        # Perform ethical audit BEFORE creating payment
        audit_result = ethical_guardian.audit_payment(
            payment_id=f"pre_audit_{int(time.time())}",
            amount=payment_request.amount,
            user_id=payment_request.user_id,
            metadata=payment_request.metadata
        )
        
        # Check compliance status
        if audit_result.compliance_status.value == "rejected":
            logger.warning(f"Payment rejected by ethical guardian: {audit_result.findings}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "Payment rejected by ethical compliance review",
                    "audit": audit_result.to_dict()
                }
            )
        
        # Create payment
        payment = pi_client.create_payment(
            amount=payment_request.amount,
            memo=payment_request.memo,
            user_id=payment_request.user_id,
            metadata=payment_request.metadata
        )
        
        # Audit the created payment
        final_audit = ethical_guardian.audit_payment(
            payment_id=payment.payment_id,
            amount=payment.amount,
            user_id=payment.user_id,
            metadata=payment.metadata
        )
        
        # Add audit info to metadata
        payment.metadata["ethical_audit"] = final_audit.to_dict()
        
        logger.info(
            f"Payment created with ethical audit: {payment.payment_id} | "
            f"Risk: {final_audit.risk_level.value} | "
            f"Status: {final_audit.compliance_status.value}"
        )
        
        return PiPaymentResponse(
            payment_id=payment.payment_id,
            amount=payment.amount,
            memo=payment.memo,
            user_id=payment.user_id,
            status=payment.status.value,
            tx_hash=payment.tx_hash,
            created_at=payment.created_at,
            metadata=payment.metadata
        )
        
    except HTTPException:
        raise
    except PiPaymentError as e:
        logger.warning(f"Payment creation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Payment creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Payment creation")
        )


@router.post("/payments/approve", response_model=PiPaymentResponse, summary="Approve Pi Network payment")
async def approve_pi_payment(approval_request: PiPaymentApprovalRequest):
    """
    Approve Pi Network payment for processing
    
    Args:
        approval_request: Payment approval request
        
    Returns:
        Updated payment information
    """
    try:
        payment = pi_client.approve_payment(approval_request.payment_id)
        
        logger.info(f"Payment approved: {payment.payment_id}")
        
        return PiPaymentResponse(
            payment_id=payment.payment_id,
            amount=payment.amount,
            memo=payment.memo,
            user_id=payment.user_id,
            status=payment.status.value,
            tx_hash=payment.tx_hash,
            created_at=payment.created_at,
            metadata=payment.metadata
        )
        
    except PiPaymentError as e:
        logger.warning(f"Payment approval failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Payment approval error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Payment approval")
        )


@router.post("/payments/complete", response_model=PiPaymentResponse, summary="Complete Pi Network payment")
async def complete_pi_payment(completion_request: PiPaymentCompletionRequest):
    """
    Complete Pi Network payment with transaction hash
    
    Args:
        completion_request: Payment completion request
        
    Returns:
        Completed payment information
    """
    try:
        payment = pi_client.complete_payment(
            completion_request.payment_id,
            completion_request.tx_hash
        )
        
        logger.info(f"Payment completed: {payment.payment_id} (tx: {payment.tx_hash})")
        
        return PiPaymentResponse(
            payment_id=payment.payment_id,
            amount=payment.amount,
            memo=payment.memo,
            user_id=payment.user_id,
            status=payment.status.value,
            tx_hash=payment.tx_hash,
            created_at=payment.created_at,
            metadata=payment.metadata
        )
        
    except PiPaymentError as e:
        logger.warning(f"Payment completion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Payment completion error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Payment completion")
        )


@router.post("/payments/verify", summary="Verify Pi Network payment")
async def verify_pi_payment(verification_request: PiPaymentVerificationRequest):
    """
    Verify Pi Network payment on blockchain
    
    Args:
        verification_request: Payment verification request
        
    Returns:
        Verification result
    """
    try:
        result = pi_client.verify_payment(
            verification_request.payment_id,
            verification_request.tx_hash
        )
        
        return {
            "success": True,
            "verification": result,
            "timestamp": time.time()
        }
        
    except Exception as e:
        logger.error(f"Payment verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Payment verification")
        )


@router.get("/payments/{payment_id}", response_model=PiPaymentResponse, summary="Get payment by ID")
async def get_pi_payment(payment_id: str):
    """
    Get payment information by ID
    
    Args:
        payment_id: Payment identifier
        
    Returns:
        Payment information
    """
    try:
        payment = pi_client.get_payment(payment_id)
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Payment not found: {payment_id}"
            )
        
        return PiPaymentResponse(
            payment_id=payment.payment_id,
            amount=payment.amount,
            memo=payment.memo,
            user_id=payment.user_id,
            status=payment.status.value,
            tx_hash=payment.tx_hash,
            created_at=payment.created_at,
            metadata=payment.metadata
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get payment error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Payment retrieval")
        )


@router.get("/payments/user/{user_id}", summary="Get user payment history")
async def get_user_pi_payments(
    user_id: str,
    status: Optional[str] = None,
    limit: int = 100
):
    """
    Get payment history for a user
    
    Args:
        user_id: Pi Network user ID
        status: Filter by payment status (optional)
        limit: Maximum number of payments to return
        
    Returns:
        List of user payments
    """
    try:
        # Convert status string to enum if provided
        status_filter = None
        if status:
            try:
                status_filter = PaymentStatus(status.lower())
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status: {status}"
                )
        
        payments = pi_client.get_user_payments(user_id, status_filter, limit)
        
        return {
            "success": True,
            "user_id": user_id,
            "count": len(payments),
            "payments": [
                {
                    "payment_id": p.payment_id,
                    "amount": p.amount,
                    "memo": p.memo,
                    "status": p.status.value,
                    "tx_hash": p.tx_hash,
                    "created_at": p.created_at,
                    "metadata": p.metadata
                }
                for p in payments
            ],
            "timestamp": time.time()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user payments error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "User payments retrieval")
        )


@router.get("/statistics", summary="Get Pi Network payment statistics")
async def get_payment_statistics():
    """
    Get comprehensive payment statistics
    
    Returns:
        Payment statistics including volume, counts, and status breakdown
    """
    try:
        stats = pi_client.payments.get_payment_statistics()
        
        return {
            "success": True,
            "statistics": stats,
            "timestamp": time.time()
        }
        
    except Exception as e:
        logger.error(f"Get statistics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Statistics retrieval")
        )


# --- ETHICAL GUARDIAN ENDPOINTS ---

@router.get("/ethics/audit-summary", summary="Get ethical audit summary")
async def get_ethical_audit_summary(limit: int = 100):
    """
    Get summary of ethical audits
    
    Args:
        limit: Maximum number of audits to include in summary
        
    Returns:
        Audit summary with risk distribution and statistics
    """
    try:
        summary = ethical_guardian.get_audit_summary(limit)
        
        return {
            "success": True,
            "summary": summary,
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Get audit summary error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Audit summary retrieval")
        )


@router.get("/ethics/high-risk-audits", summary="Get high-risk audit results")
async def get_high_risk_audits(limit: int = 20):
    """
    Get recent high-risk ethical audit results
    
    Args:
        limit: Maximum number of results
        
    Returns:
        List of high-risk audit results requiring attention
    """
    try:
        high_risk = ethical_guardian.get_high_risk_audits(limit)
        
        return {
            "success": True,
            "count": len(high_risk),
            "audits": high_risk,
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Get high-risk audits error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "High-risk audits retrieval")
        )


@router.post("/ethics/audit-payment", summary="Manually audit a payment")
async def manual_payment_audit(
    payment_id: str,
    amount: float,
    user_id: str,
    metadata: Optional[Dict[str, Any]] = None
):
    """
    Manually trigger ethical audit for a payment
    
    Args:
        payment_id: Payment identifier
        amount: Payment amount
        user_id: User making payment
        metadata: Additional metadata
        
    Returns:
        Audit result
    """
    try:
        audit_result = ethical_guardian.audit_payment(
            payment_id=payment_id,
            amount=amount,
            user_id=user_id,
            metadata=metadata
        )
        
        return {
            "success": True,
            "audit": audit_result.to_dict(),
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Manual payment audit error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=sanitize_error_message(e, "Manual audit")
        )
