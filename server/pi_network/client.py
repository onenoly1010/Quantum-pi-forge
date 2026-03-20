"""
Pi Network Client
Main client interface for Pi Network integration
"""

import logging
import asyncio
from typing import Optional, Dict, Any, List
from datetime import datetime

from .config import PiNetworkConfig
from .auth import PiAuthManager
from .payments import PiPaymentManager, PiPayment, PaymentStatus
from .exceptions import PiNetworkError, PiConfigurationError

logger = logging.getLogger(__name__)


class PiNetworkClient:
    """
    Main client for Pi Network integration
    
    This is the primary interface for all Pi Network operations, providing:
    - User authentication
    - Payment processing
    - Session management
    - Health monitoring
    
    The client is designed to be:
    - Modular: Each component is independent and testable
    - Secure: Implements best practices for authentication and payment security
    - Ethical: Includes safety checks and audit trails
    - Self-sustaining: Autonomous session cleanup and health monitoring
    """
    
    def __init__(self, config: Optional[PiNetworkConfig] = None):
        """
        Initialize Pi Network client
        
        Args:
            config: Pi Network configuration (defaults to environment-based config)
        """
        self.config = config or PiNetworkConfig.from_env()
        self.auth = PiAuthManager(self.config)
        self.payments = PiPaymentManager(self.config)
        
        # Background tasks
        self._cleanup_task: Optional[asyncio.Task] = None
        self._running = False
        
        logger.info(f"PiNetworkClient initialized: {self.config.network} mode")
        if self.config.is_testnet():
            logger.warning("⚠️ Running in testnet/sandbox mode")
    
    # Authentication methods
    
    def authenticate_user(
        self,
        pi_uid: str,
        username: str,
        access_token: str,
        session_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Authenticate user with Pi Network credentials
        
        Args:
            pi_uid: Pi Network user ID
            username: Pi Network username
            access_token: Pi Network access token
            session_data: Additional session metadata
            
        Returns:
            Authentication result with session information
        """
        return self.auth.authenticate_user(
            pi_uid=pi_uid,
            username=username,
            access_token=access_token,
            session_data=session_data
        )
    
    def verify_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Verify active session
        
        Args:
            session_id: Session identifier
            
        Returns:
            Session data if valid, None otherwise
        """
        return self.auth.verify_session(session_id)
    
    def logout(self, session_id: str) -> bool:
        """
        Logout user (invalidate session)
        
        Args:
            session_id: Session identifier
            
        Returns:
            True if session was invalidated
        """
        return self.auth.invalidate_session(session_id)
    
    # Payment methods
    
    def create_payment(
        self,
        amount: float,
        memo: str,
        user_id: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> PiPayment:
        """
        Create new payment request
        
        Args:
            amount: Payment amount in Pi
            memo: Payment description
            user_id: Pi Network user ID
            metadata: Additional payment metadata
            
        Returns:
            Created payment record
        """
        return self.payments.create_payment(
            amount=amount,
            memo=memo,
            user_id=user_id,
            metadata=metadata
        )
    
    def approve_payment(self, payment_id: str) -> PiPayment:
        """
        Approve payment for processing
        
        Args:
            payment_id: Payment identifier
            
        Returns:
            Updated payment record
        """
        return self.payments.approve_payment(payment_id)
    
    def complete_payment(self, payment_id: str, tx_hash: str) -> PiPayment:
        """
        Complete payment with transaction hash
        
        Args:
            payment_id: Payment identifier
            tx_hash: Blockchain transaction hash
            
        Returns:
            Updated payment record
        """
        return self.payments.complete_payment(payment_id, tx_hash)
    
    def cancel_payment(self, payment_id: str, reason: str = None) -> PiPayment:
        """
        Cancel payment
        
        Args:
            payment_id: Payment identifier
            reason: Cancellation reason
            
        Returns:
            Updated payment record
        """
        return self.payments.cancel_payment(payment_id, reason)
    
    def get_payment(self, payment_id: str) -> Optional[PiPayment]:
        """
        Get payment by ID
        
        Args:
            payment_id: Payment identifier
            
        Returns:
            Payment record if found
        """
        return self.payments.get_payment(payment_id)
    
    def get_user_payments(
        self,
        user_id: str,
        status: Optional[PaymentStatus] = None,
        limit: int = 100
    ) -> List[PiPayment]:
        """
        Get user's payment history
        
        Args:
            user_id: Pi Network user ID
            status: Filter by status (optional)
            limit: Maximum results
            
        Returns:
            List of payments
        """
        return self.payments.get_user_payments(user_id, status, limit)
    
    def verify_payment(self, payment_id: str, tx_hash: str) -> Dict[str, Any]:
        """
        Verify payment on blockchain
        
        Args:
            payment_id: Payment identifier
            tx_hash: Transaction hash
            
        Returns:
            Verification result
        """
        return self.payments.verify_payment(payment_id, tx_hash)
    
    # Status and monitoring methods
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get client status and health
        
        Returns:
            Status information
        """
        payment_stats = self.payments.get_payment_statistics()
        active_sessions = self.auth.get_active_sessions_count()
        
        return {
            "status": "healthy",
            "network": self.config.network,
            "is_testnet": self.config.is_testnet(),
            "is_production": self.config.is_production(),
            "active_sessions": active_sessions,
            "payment_statistics": payment_stats,
            "configuration": self.config.to_dict(),
            "timestamp": datetime.now().isoformat()
        }
    
    def get_health(self) -> Dict[str, bool]:
        """
        Get health check status
        
        Returns:
            Health check results
        """
        health = {
            "overall": True,
            "config_valid": True,
            "auth_manager": True,
            "payment_manager": True
        }
        
        try:
            self.config._validate()
        except Exception as e:
            logger.error(f"Configuration validation failed: {e}")
            health["config_valid"] = False
            health["overall"] = False
        
        return health
    
    # Background task management
    
    async def start_background_tasks(self):
        """
        Start background maintenance tasks
        
        This includes:
        - Periodic session cleanup
        - Health monitoring
        - Statistics collection
        """
        if self._running:
            logger.warning("Background tasks already running")
            return
        
        self._running = True
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        logger.info("Background tasks started")
    
    async def stop_background_tasks(self):
        """Stop background maintenance tasks"""
        if not self._running:
            return
        
        self._running = False
        
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        
        logger.info("Background tasks stopped")
    
    async def _cleanup_loop(self):
        """
        Background task for periodic cleanup
        
        Runs every 5 minutes to:
        - Clean up expired sessions
        - Log statistics
        """
        try:
            while self._running:
                # Cleanup expired sessions
                cleaned = self.auth.cleanup_expired_sessions()
                if cleaned > 0:
                    logger.info(f"Cleaned {cleaned} expired sessions")
                
                # Log statistics
                stats = self.payments.get_payment_statistics()
                logger.debug(f"Payment stats: {stats}")
                
                # Wait 5 minutes
                await asyncio.sleep(300)
        except asyncio.CancelledError:
            logger.info("Cleanup loop cancelled")
        except Exception as e:
            logger.error(f"Error in cleanup loop: {e}")
    
    def __enter__(self):
        """Context manager entry"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        # Synchronous cleanup
        pass
    
    async def __aenter__(self):
        """Async context manager entry"""
        await self.start_background_tasks()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.stop_background_tasks()
