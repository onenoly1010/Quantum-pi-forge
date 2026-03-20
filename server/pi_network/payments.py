"""
Pi Network Payment Manager
Handles payment processing, verification, and tracking
"""

import time
import hashlib
import logging
from typing import Optional, Dict, Any, List
from enum import Enum
from dataclasses import dataclass, asdict
from datetime import datetime

from .config import PiNetworkConfig
from .exceptions import PiPaymentError

logger = logging.getLogger(__name__)


class PaymentStatus(str, Enum):
    """Payment status enumeration"""
    PENDING = "pending"
    APPROVED = "approved"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"


@dataclass
class PiPayment:
    """
    Pi Network payment record
    
    Attributes:
        payment_id: Unique payment identifier
        amount: Payment amount in Pi
        memo: Payment memo/description
        user_id: Pi Network user ID
        status: Current payment status
        tx_hash: Blockchain transaction hash (when completed)
        created_at: Payment creation timestamp
        updated_at: Last update timestamp
        metadata: Additional payment metadata
    """
    payment_id: str
    amount: float
    memo: str
    user_id: str
    status: PaymentStatus = PaymentStatus.PENDING
    tx_hash: Optional[str] = None
    created_at: float = None
    updated_at: float = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = time.time()
        if self.updated_at is None:
            self.updated_at = self.created_at
        if self.metadata is None:
            self.metadata = {}


class PiPaymentManager:
    """
    Manages Pi Network payment operations
    
    This class provides:
    - Payment creation and approval
    - Payment verification and completion
    - Payment status tracking
    - Transaction history
    """
    
    def __init__(self, config: PiNetworkConfig):
        """
        Initialize Pi Payment Manager
        
        Args:
            config: Pi Network configuration
        """
        self.config = config
        self._payments: Dict[str, PiPayment] = {}
        self._user_payments: Dict[str, List[str]] = {}
        logger.info(f"PiPaymentManager initialized for {config.network}")
    
    def create_payment(
        self,
        amount: float,
        memo: str,
        user_id: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> PiPayment:
        """
        Create a new payment request
        
        Args:
            amount: Payment amount in Pi
            memo: Payment description
            user_id: Pi Network user ID
            metadata: Additional payment metadata
            
        Returns:
            Created payment record
            
        Raises:
            PiPaymentError: If payment creation fails
        """
        # Validate amount
        if amount <= 0:
            raise PiPaymentError(
                "Invalid payment amount",
                details={"amount": amount}
            )
        
        # Round amount to 7 decimal places (Pi precision)
        amount = round(amount, 7)
        
        # Generate payment ID
        payment_id = self._generate_payment_id(user_id, amount)
        
        # Create payment record
        payment = PiPayment(
            payment_id=payment_id,
            amount=amount,
            memo=memo,
            user_id=user_id,
            metadata=metadata or {}
        )
        
        # Store payment
        self._payments[payment_id] = payment
        
        # Track user payments
        if user_id not in self._user_payments:
            self._user_payments[user_id] = []
        self._user_payments[user_id].append(payment_id)
        
        logger.info(f"Payment created: {payment_id} for {amount} Pi (user: {user_id})")
        
        return payment
    
    def approve_payment(self, payment_id: str) -> PiPayment:
        """
        Approve a payment for processing
        
        Args:
            payment_id: Payment identifier
            
        Returns:
            Updated payment record
            
        Raises:
            PiPaymentError: If payment not found or cannot be approved
        """
        payment = self._payments.get(payment_id)
        
        if not payment:
            raise PiPaymentError(
                f"Payment not found: {payment_id}",
                details={"payment_id": payment_id}
            )
        
        if payment.status != PaymentStatus.PENDING:
            raise PiPaymentError(
                f"Payment cannot be approved in {payment.status} status",
                details={"payment_id": payment_id, "status": payment.status}
            )
        
        payment.status = PaymentStatus.APPROVED
        payment.updated_at = time.time()
        
        logger.info(f"Payment approved: {payment_id}")
        
        return payment
    
    def complete_payment(
        self,
        payment_id: str,
        tx_hash: str
    ) -> PiPayment:
        """
        Mark payment as completed with transaction hash
        
        Args:
            payment_id: Payment identifier
            tx_hash: Blockchain transaction hash
            
        Returns:
            Updated payment record
            
        Raises:
            PiPaymentError: If payment cannot be completed
        """
        payment = self._payments.get(payment_id)
        
        if not payment:
            raise PiPaymentError(
                f"Payment not found: {payment_id}",
                details={"payment_id": payment_id}
            )
        
        if payment.status not in [PaymentStatus.PENDING, PaymentStatus.APPROVED]:
            raise PiPaymentError(
                f"Payment cannot be completed in {payment.status} status",
                details={"payment_id": payment_id, "status": payment.status}
            )
        
        payment.status = PaymentStatus.COMPLETED
        payment.tx_hash = tx_hash
        payment.updated_at = time.time()
        
        logger.info(f"Payment completed: {payment_id} (tx: {tx_hash})")
        
        return payment
    
    def cancel_payment(self, payment_id: str, reason: str = None) -> PiPayment:
        """
        Cancel a payment
        
        Args:
            payment_id: Payment identifier
            reason: Cancellation reason
            
        Returns:
            Updated payment record
            
        Raises:
            PiPaymentError: If payment cannot be cancelled
        """
        payment = self._payments.get(payment_id)
        
        if not payment:
            raise PiPaymentError(
                f"Payment not found: {payment_id}",
                details={"payment_id": payment_id}
            )
        
        if payment.status == PaymentStatus.COMPLETED:
            raise PiPaymentError(
                "Cannot cancel completed payment",
                details={"payment_id": payment_id}
            )
        
        payment.status = PaymentStatus.CANCELLED
        payment.updated_at = time.time()
        if reason:
            payment.metadata["cancellation_reason"] = reason
        
        logger.info(f"Payment cancelled: {payment_id}")
        
        return payment
    
    def get_payment(self, payment_id: str) -> Optional[PiPayment]:
        """
        Retrieve payment by ID
        
        Args:
            payment_id: Payment identifier
            
        Returns:
            Payment record if found, None otherwise
        """
        return self._payments.get(payment_id)
    
    def get_user_payments(
        self,
        user_id: str,
        status: Optional[PaymentStatus] = None,
        limit: int = 100
    ) -> List[PiPayment]:
        """
        Get payments for a specific user
        
        Args:
            user_id: Pi Network user ID
            status: Filter by payment status (optional)
            limit: Maximum number of payments to return
            
        Returns:
            List of payment records
        """
        payment_ids = self._user_payments.get(user_id, [])
        payments = [self._payments[pid] for pid in payment_ids if pid in self._payments]
        
        # Filter by status if specified
        if status:
            payments = [p for p in payments if p.status == status]
        
        # Sort by creation time (newest first) and limit
        payments.sort(key=lambda p: p.created_at, reverse=True)
        return payments[:limit]
    
    def verify_payment(self, payment_id: str, tx_hash: str) -> Dict[str, Any]:
        """
        Verify payment completion on blockchain
        
        Args:
            payment_id: Payment identifier
            tx_hash: Transaction hash to verify
            
        Returns:
            Verification result
            
        Note:
            In testnet/demo mode, this performs basic validation.
            In production, this should verify against Pi blockchain.
        """
        payment = self.get_payment(payment_id)
        
        if not payment:
            return {
                "verified": False,
                "reason": "Payment not found",
                "payment_id": payment_id
            }
        
        # In testnet mode, perform basic verification
        if self.config.is_testnet():
            logger.warning(
                f"Payment verification in testnet mode: {payment_id}. "
                "Production should verify against Pi blockchain."
            )
            
            return {
                "verified": True,
                "payment_id": payment_id,
                "tx_hash": tx_hash,
                "amount": payment.amount,
                "status": payment.status.value,
                "testnet_mode": True,
                "timestamp": time.time()
            }
        
        # Production verification would check Pi blockchain
        # For now, return verification structure
        return {
            "verified": False,
            "reason": "Production verification not implemented",
            "payment_id": payment_id,
            "note": "Implement Pi blockchain verification for production"
        }
    
    def get_payment_statistics(self) -> Dict[str, Any]:
        """
        Get payment statistics
        
        Returns:
            Payment statistics summary
        """
        total_payments = len(self._payments)
        
        status_counts = {}
        for status in PaymentStatus:
            status_counts[status.value] = sum(
                1 for p in self._payments.values() if p.status == status
            )
        
        total_volume = sum(
            p.amount for p in self._payments.values()
            if p.status == PaymentStatus.COMPLETED
        )
        
        return {
            "total_payments": total_payments,
            "status_breakdown": status_counts,
            "completed_volume_pi": round(total_volume, 7),
            "unique_users": len(self._user_payments),
            "timestamp": time.time()
        }
    
    def _generate_payment_id(self, user_id: str, amount: float) -> str:
        """
        Generate unique payment ID
        
        Args:
            user_id: Pi Network user ID
            amount: Payment amount
            
        Returns:
            Payment identifier
        """
        data = f"{user_id}{amount}{time.time()}{self.config.app_id}"
        hash_val = hashlib.sha256(data.encode()).hexdigest()
        return f"pi_pay_{hash_val[:16]}"
