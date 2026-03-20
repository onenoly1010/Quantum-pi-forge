"""
Pi Network Ethical Guardian
Autonomous ethical compliance monitoring for Pi Network transactions

This module integrates with the Cyber Samurai Guardian to provide:
- Real-time ethical auditing of Pi Network transactions
- Automated compliance validation
- Risk scoring and alerting
- Audit trail generation
"""

import time
import logging
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger(__name__)


class RiskLevel(str, Enum):
    """Transaction risk level classification"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ComplianceStatus(str, Enum):
    """Compliance validation status"""
    COMPLIANT = "compliant"
    REVIEW_REQUIRED = "review_required"
    REJECTED = "rejected"


@dataclass
class EthicalAuditResult:
    """Result of ethical audit"""
    transaction_id: str
    risk_level: RiskLevel
    risk_score: float  # 0.0 to 1.0
    compliance_status: ComplianceStatus
    findings: List[str]
    recommendations: List[str]
    audited_at: float
    auditor: str = "Pi Network Ethical Guardian"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "transaction_id": self.transaction_id,
            "risk_level": self.risk_level.value,
            "risk_score": self.risk_score,
            "compliance_status": self.compliance_status.value,
            "findings": self.findings,
            "recommendations": self.recommendations,
            "audited_at": self.audited_at,
            "auditor": self.auditor
        }


class PiNetworkEthicalGuardian:
    """
    Ethical compliance guardian for Pi Network operations
    
    Provides autonomous monitoring and validation of:
    - Payment transactions
    - User authentication patterns
    - Session activity
    - Anomaly detection
    """
    
    def __init__(self):
        self.audit_history: List[EthicalAuditResult] = []
        self.risk_thresholds = {
            RiskLevel.LOW: 0.2,
            RiskLevel.MEDIUM: 0.5,
            RiskLevel.HIGH: 0.8,
            RiskLevel.CRITICAL: 1.0
        }
        logger.info("Pi Network Ethical Guardian initialized")
    
    def audit_payment(
        self,
        payment_id: str,
        amount: float,
        user_id: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> EthicalAuditResult:
        """
        Audit a Pi Network payment transaction
        
        Args:
            payment_id: Payment identifier
            amount: Payment amount in Pi
            user_id: User making the payment
            metadata: Additional payment metadata
            
        Returns:
            Ethical audit result
        """
        findings = []
        recommendations = []
        risk_factors = []
        
        # Amount-based risk assessment
        if amount > 100:
            risk_factors.append(0.3)
            findings.append("Large payment amount detected")
            recommendations.append("Verify user intent for large payment")
        elif amount > 10:
            risk_factors.append(0.1)
        
        # Frequency-based risk assessment
        user_recent_payments = self._get_user_recent_payment_count(user_id)
        if user_recent_payments > 10:
            risk_factors.append(0.2)
            findings.append("High payment frequency detected")
            recommendations.append("Review user payment patterns")
        
        # Metadata analysis
        if metadata:
            if metadata.get("type") == "mining_boost":
                # Mining boosts are expected, low risk
                risk_factors.append(0.05)
                findings.append("Standard mining boost transaction")
            
            if "suspicious" in str(metadata).lower():
                risk_factors.append(0.5)
                findings.append("Suspicious metadata detected")
                recommendations.append("Manual review required")
        
        # Calculate overall risk score
        base_risk = 0.02  # Baseline risk
        risk_score = min(base_risk + sum(risk_factors), 1.0)
        
        # Determine risk level
        risk_level = self._classify_risk_level(risk_score)
        
        # Determine compliance status
        if risk_level == RiskLevel.CRITICAL:
            compliance_status = ComplianceStatus.REJECTED
        elif risk_level == RiskLevel.HIGH:
            compliance_status = ComplianceStatus.REVIEW_REQUIRED
        else:
            compliance_status = ComplianceStatus.COMPLIANT
        
        # Add general recommendations
        if compliance_status == ComplianceStatus.COMPLIANT:
            recommendations.append("Transaction approved for processing")
        
        # Create audit result
        audit_result = EthicalAuditResult(
            transaction_id=payment_id,
            risk_level=risk_level,
            risk_score=round(risk_score, 4),
            compliance_status=compliance_status,
            findings=findings if findings else ["No issues detected"],
            recommendations=recommendations if recommendations else ["No actions required"],
            audited_at=time.time()
        )
        
        # Store in audit history
        self.audit_history.append(audit_result)
        
        logger.info(
            f"Payment audited: {payment_id} | "
            f"Risk: {risk_level.value} ({risk_score:.2%}) | "
            f"Status: {compliance_status.value}"
        )
        
        return audit_result
    
    def audit_authentication(
        self,
        user_id: str,
        ip_address: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> EthicalAuditResult:
        """
        Audit user authentication attempt
        
        Args:
            user_id: User attempting authentication
            ip_address: IP address of request
            metadata: Additional authentication metadata
            
        Returns:
            Ethical audit result
        """
        findings = []
        recommendations = []
        risk_factors = []
        
        # Frequency-based analysis
        recent_auths = self._get_user_recent_auth_count(user_id)
        if recent_auths > 20:
            risk_factors.append(0.3)
            findings.append("High authentication frequency")
            recommendations.append("Potential automated access - verify legitimacy")
        elif recent_auths > 5:
            risk_factors.append(0.1)
        
        # IP-based analysis (placeholder - would integrate with threat intelligence)
        if ip_address:
            # In production, check against threat databases
            pass
        
        # Calculate risk
        risk_score = min(0.05 + sum(risk_factors), 1.0)
        risk_level = self._classify_risk_level(risk_score)
        
        # Determine compliance
        if risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            compliance_status = ComplianceStatus.REVIEW_REQUIRED
        else:
            compliance_status = ComplianceStatus.COMPLIANT
        
        audit_result = EthicalAuditResult(
            transaction_id=f"auth_{user_id}_{int(time.time())}",
            risk_level=risk_level,
            risk_score=round(risk_score, 4),
            compliance_status=compliance_status,
            findings=findings if findings else ["Authentication appears normal"],
            recommendations=recommendations if recommendations else ["Proceed with authentication"],
            audited_at=time.time()
        )
        
        self.audit_history.append(audit_result)
        
        return audit_result
    
    def get_audit_summary(self, limit: int = 100) -> Dict[str, Any]:
        """
        Get summary of recent audits
        
        Args:
            limit: Maximum number of audits to include
            
        Returns:
            Audit summary statistics
        """
        recent_audits = self.audit_history[-limit:]
        
        if not recent_audits:
            return {
                "total_audits": 0,
                "risk_distribution": {},
                "compliance_distribution": {},
                "high_risk_count": 0
            }
        
        # Risk distribution
        risk_dist = {level.value: 0 for level in RiskLevel}
        for audit in recent_audits:
            risk_dist[audit.risk_level.value] += 1
        
        # Compliance distribution
        compliance_dist = {status.value: 0 for status in ComplianceStatus}
        for audit in recent_audits:
            compliance_dist[audit.compliance_status.value] += 1
        
        # High risk count
        high_risk_count = sum(
            1 for audit in recent_audits
            if audit.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]
        )
        
        return {
            "total_audits": len(recent_audits),
            "risk_distribution": risk_dist,
            "compliance_distribution": compliance_dist,
            "high_risk_count": high_risk_count,
            "average_risk_score": sum(a.risk_score for a in recent_audits) / len(recent_audits),
            "timestamp": time.time()
        }
    
    def get_high_risk_audits(self, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get recent high-risk audit results
        
        Args:
            limit: Maximum number of results
            
        Returns:
            List of high-risk audit results
        """
        high_risk = [
            audit for audit in self.audit_history
            if audit.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]
        ]
        
        # Sort by timestamp (newest first)
        high_risk.sort(key=lambda x: x.audited_at, reverse=True)
        
        return [audit.to_dict() for audit in high_risk[:limit]]
    
    def _classify_risk_level(self, risk_score: float) -> RiskLevel:
        """
        Classify risk score into risk level
        
        Args:
            risk_score: Risk score (0.0 to 1.0)
            
        Returns:
            Risk level classification
        """
        if risk_score >= 0.8:
            return RiskLevel.CRITICAL
        elif risk_score >= 0.5:
            return RiskLevel.HIGH
        elif risk_score >= 0.2:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW
    
    def _get_user_recent_payment_count(self, user_id: str) -> int:
        """
        Get count of recent payments for user
        
        Args:
            user_id: User identifier
            
        Returns:
            Count of recent payments
        """
        # In production, query actual payment database
        # For now, return simulated count based on audit history
        cutoff_time = time.time() - 3600  # Last hour
        
        count = sum(
            1 for audit in self.audit_history
            if audit.transaction_id.startswith("pi_pay_") and
            audit.audited_at > cutoff_time
        )
        
        return count
    
    def _get_user_recent_auth_count(self, user_id: str) -> int:
        """
        Get count of recent authentication attempts for user
        
        Args:
            user_id: User identifier
            
        Returns:
            Count of recent authentications
        """
        # In production, query actual auth database
        cutoff_time = time.time() - 3600  # Last hour
        
        count = sum(
            1 for audit in self.audit_history
            if f"auth_{user_id}" in audit.transaction_id and
            audit.audited_at > cutoff_time
        )
        
        return count


# Global instance for application use
ethical_guardian = PiNetworkEthicalGuardian()
