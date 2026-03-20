"""
Guardian Monitoring System
Provides safety monitoring, validation, decision overwrites, and oversight controls.
"""

import logging
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


class ValidationStatus(str, Enum):
    """Validation status"""
    APPROVED = "approved"
    REJECTED = "rejected"
    PENDING = "pending"
    OVERRIDE = "override"


class MonitoringLevel(str, Enum):
    """Monitoring alert levels"""
    NORMAL = "normal"
    ELEVATED = "elevated"
    HIGH = "high"
    CRITICAL = "critical"


class GuardianDecision(BaseModel):
    """Guardian decision override"""
    decision_id: str
    original_decision_id: str
    action: str = Field(..., description="approve, reject, or modify")
    reasoning: str
    guardian_id: str
    timestamp: float = Field(default_factory=time.time)
    metadata: Optional[Dict[str, Any]] = Field(default=None)


class ValidationResult(BaseModel):
    """Result of validation check"""
    validation_id: str
    target: str
    status: ValidationStatus
    checks_passed: int
    checks_failed: int
    details: List[Dict[str, Any]]
    timestamp: float = Field(default_factory=time.time)


class SafetyMetric(BaseModel):
    """Safety monitoring metric"""
    metric_name: str
    value: float
    threshold: float
    status: str
    timestamp: float = Field(default_factory=time.time)


class GuardianMonitor:
    """
    Guardian monitoring system for safety oversight and decision validation
    """
    
    # Configuration constants
    DEFAULT_SAFETY_THRESHOLD = 0.8
    DEFAULT_ETHICAL_THRESHOLD = 0.9

    def __init__(self):
        self.guardian_decisions: List[GuardianDecision] = []
        self.validation_history: List[ValidationResult] = []
        self.safety_metrics: Dict[str, SafetyMetric] = {}
        self.monitoring_level = MonitoringLevel.NORMAL
        self._initialize_safety_metrics()
        logger.info("✅ Guardian Monitor initialized")

    def _initialize_safety_metrics(self):
        """Initialize safety monitoring metrics"""
        self.safety_metrics = {
            "transaction_safety": SafetyMetric(
                metric_name="transaction_safety",
                value=0.99,
                threshold=0.95,
                status="healthy"
            ),
            "ethical_compliance": SafetyMetric(
                metric_name="ethical_compliance",
                value=0.98,
                threshold=0.90,
                status="healthy"
            ),
            "security_score": SafetyMetric(
                metric_name="security_score",
                value=0.97,
                threshold=0.90,
                status="healthy"
            ),
            "system_stability": SafetyMetric(
                metric_name="system_stability",
                value=0.96,
                threshold=0.85,
                status="healthy"
            )
        }

    def validate_decision(
        self,
        decision_id: str,
        decision_data: Dict[str, Any]
    ) -> ValidationResult:
        """
        Validate an autonomous decision for safety and compliance
        
        Args:
            decision_id: ID of decision to validate
            decision_data: Decision data to validate
            
        Returns:
            ValidationResult with validation status
        """
        logger.info(f"🛡️ Validating decision: {decision_id}")
        
        validation_id = f"val_{decision_id}_{int(time.time()*1000)}"
        checks = []
        passed = 0
        failed = 0
        
        # Check 1: Safety threshold
        safety_check = self._check_safety_threshold(decision_data)
        checks.append(safety_check)
        if safety_check["passed"]:
            passed += 1
        else:
            failed += 1
        
        # Check 2: Ethical compliance
        ethical_check = self._check_ethical_compliance(decision_data)
        checks.append(ethical_check)
        if ethical_check["passed"]:
            passed += 1
        else:
            failed += 1
        
        # Check 3: Security validation
        security_check = self._check_security(decision_data)
        checks.append(security_check)
        if security_check["passed"]:
            passed += 1
        else:
            failed += 1
        
        # Check 4: Compliance with monitoring level
        monitoring_check = self._check_monitoring_compliance(decision_data)
        checks.append(monitoring_check)
        if monitoring_check["passed"]:
            passed += 1
        else:
            failed += 1
        
        # Determine overall status
        if failed == 0:
            status = ValidationStatus.APPROVED
        elif failed <= 1 and self.monitoring_level == MonitoringLevel.NORMAL:
            status = ValidationStatus.PENDING
        else:
            status = ValidationStatus.REJECTED
        
        result = ValidationResult(
            validation_id=validation_id,
            target=decision_id,
            status=status,
            checks_passed=passed,
            checks_failed=failed,
            details=checks
        )
        
        self.validation_history.append(result)
        
        # Keep only last 1000 validations
        if len(self.validation_history) > 1000:
            self.validation_history = self.validation_history[-1000:]
        
        logger.info(f"✅ Validation complete: {validation_id}, status={status.value}")
        return result

    def _check_safety_threshold(self, decision_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check if decision meets safety thresholds"""
        confidence = decision_data.get("confidence", 0.0)
        safety_threshold = self.DEFAULT_SAFETY_THRESHOLD
        
        passed = confidence >= safety_threshold
        
        return {
            "check": "safety_threshold",
            "passed": passed,
            "value": confidence,
            "threshold": safety_threshold,
            "message": f"Confidence {confidence:.2%} {'meets' if passed else 'below'} threshold {safety_threshold:.2%}"
        }

    def _check_ethical_compliance(self, decision_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check ethical compliance of decision"""
        # For demo, check if decision type is safe
        decision_type = decision_data.get("decision_type", "")
        
        # Guardian overrides always require ethical review
        if decision_type == "guardian_override":
            passed = False
            message = "Guardian override requires manual ethical review"
        else:
            passed = True
            message = "Ethical compliance verified"
        
        return {
            "check": "ethical_compliance",
            "passed": passed,
            "value": decision_type,
            "message": message
        }

    def _check_security(self, decision_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check security aspects of decision"""
        # Check if decision requires guardian approval
        requires_guardian = decision_data.get("requires_guardian", False)
        
        # High priority decisions without guardian are security risk
        priority = decision_data.get("metadata", {}).get("priority", "low")
        
        if priority in ["critical", "high"] and not requires_guardian:
            passed = False
            message = f"High priority ({priority}) decision must require guardian approval"
        else:
            passed = True
            message = "Security checks passed"
        
        return {
            "check": "security",
            "passed": passed,
            "value": {"priority": priority, "requires_guardian": requires_guardian},
            "message": message
        }

    def _check_monitoring_compliance(self, decision_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check if decision complies with current monitoring level"""
        approved = decision_data.get("approved", False)
        
        # In elevated monitoring, auto-approvals are restricted
        if self.monitoring_level in [MonitoringLevel.HIGH, MonitoringLevel.CRITICAL]:
            if approved and not decision_data.get("requires_guardian"):
                passed = False
                message = f"Monitoring level {self.monitoring_level.value} restricts auto-approvals"
            else:
                passed = True
                message = "Complies with monitoring level restrictions"
        else:
            passed = True
            message = "Monitoring level allows decision"
        
        return {
            "check": "monitoring_compliance",
            "passed": passed,
            "value": self.monitoring_level.value,
            "message": message
        }

    def guardian_override_decision(
        self,
        original_decision_id: str,
        action: str,
        reasoning: str,
        guardian_id: str
    ) -> GuardianDecision:
        """
        Record guardian override of an autonomous decision
        
        Args:
            original_decision_id: ID of original decision
            action: Override action (approve, reject, modify)
            reasoning: Reasoning for override
            guardian_id: ID of guardian making override
            
        Returns:
            GuardianDecision record
        """
        logger.info(f"🛡️ Guardian override: {action} decision {original_decision_id}")
        
        decision_id = f"guard_{int(time.time()*1000)}"
        
        decision = GuardianDecision(
            decision_id=decision_id,
            original_decision_id=original_decision_id,
            action=action,
            reasoning=reasoning,
            guardian_id=guardian_id
        )
        
        self.guardian_decisions.append(decision)
        
        # Keep only last 1000 decisions
        if len(self.guardian_decisions) > 1000:
            self.guardian_decisions = self.guardian_decisions[-1000:]
        
        logger.info(f"✅ Guardian override recorded: {decision_id}")
        return decision

    def update_monitoring_level(self, new_level: MonitoringLevel, reason: str):
        """
        Update system monitoring level
        
        Args:
            new_level: New monitoring level
            reason: Reason for level change
        """
        old_level = self.monitoring_level
        self.monitoring_level = new_level
        
        logger.warning(
            f"⚠️ Monitoring level changed: {old_level.value} → {new_level.value}. "
            f"Reason: {reason}"
        )

    def update_safety_metric(self, metric_name: str, value: float):
        """Update a safety monitoring metric"""
        if metric_name in self.safety_metrics:
            metric = self.safety_metrics[metric_name]
            metric.value = value
            metric.timestamp = time.time()
            
            # Update status based on threshold
            if value >= metric.threshold:
                metric.status = "healthy"
            elif value >= metric.threshold * 0.9:
                metric.status = "warning"
            else:
                metric.status = "critical"
            
            logger.info(f"📊 Safety metric updated: {metric_name}={value:.2%}, status={metric.status}")
            
            # Auto-adjust monitoring level based on metrics
            self._auto_adjust_monitoring_level()

    def _auto_adjust_monitoring_level(self):
        """Automatically adjust monitoring level based on safety metrics"""
        critical_count = sum(
            1 for m in self.safety_metrics.values() 
            if m.status == "critical"
        )
        warning_count = sum(
            1 for m in self.safety_metrics.values() 
            if m.status == "warning"
        )
        
        if critical_count >= 2:
            if self.monitoring_level != MonitoringLevel.CRITICAL:
                self.update_monitoring_level(
                    MonitoringLevel.CRITICAL,
                    f"{critical_count} critical safety metrics detected"
                )
        elif critical_count >= 1 or warning_count >= 2:
            if self.monitoring_level not in [MonitoringLevel.CRITICAL, MonitoringLevel.HIGH]:
                self.update_monitoring_level(
                    MonitoringLevel.HIGH,
                    f"{critical_count} critical, {warning_count} warning metrics"
                )
        elif warning_count >= 1:
            if self.monitoring_level == MonitoringLevel.NORMAL:
                self.update_monitoring_level(
                    MonitoringLevel.ELEVATED,
                    f"{warning_count} warning metrics detected"
                )
        else:
            if self.monitoring_level != MonitoringLevel.NORMAL:
                self.update_monitoring_level(
                    MonitoringLevel.NORMAL,
                    "All safety metrics healthy"
                )

    def get_monitoring_status(self) -> Dict[str, Any]:
        """Get comprehensive guardian monitoring status"""
        return {
            "monitoring_level": self.monitoring_level.value,
            "safety_metrics": {
                name: {
                    "value": metric.value,
                    "threshold": metric.threshold,
                    "status": metric.status,
                    "timestamp": metric.timestamp
                }
                for name, metric in self.safety_metrics.items()
            },
            "recent_validations": [
                {
                    "validation_id": v.validation_id,
                    "target": v.target,
                    "status": v.status.value,
                    "checks_passed": v.checks_passed,
                    "checks_failed": v.checks_failed,
                    "timestamp": v.timestamp
                }
                for v in self.validation_history[-10:]
            ],
            "recent_overrides": [
                {
                    "decision_id": d.decision_id,
                    "original_decision_id": d.original_decision_id,
                    "action": d.action,
                    "guardian_id": d.guardian_id,
                    "timestamp": d.timestamp
                }
                for d in self.guardian_decisions[-10:]
            ],
            "total_validations": len(self.validation_history),
            "total_overrides": len(self.guardian_decisions),
            "timestamp": time.time()
        }

    def get_validation_history(
        self,
        status: Optional[ValidationStatus] = None,
        limit: int = 100
    ) -> List[ValidationResult]:
        """Get validation history with optional filtering"""
        history = self.validation_history
        
        if status:
            history = [v for v in history if v.status == status]
        
        return history[-limit:]

    def log_escalation_to_metrics(
        self,
        escalation_data: Dict[str, Any],
        vercel_endpoint: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Log escalation to Vercel metrics endpoint
        
        Note: This is currently a placeholder implementation that logs escalation
        events locally. Actual HTTP transmission to the Vercel endpoint is not
        yet implemented. To enable actual transmission, implement HTTP POST to
        vercel_endpoint with the log_entry data.
        
        Args:
            escalation_data: Escalation data to log
            vercel_endpoint: Optional Vercel metrics endpoint URL (placeholder)
            
        Returns:
            Logging result with log_entry and endpoint information
        """
        log_entry = {
            "type": "guardian_escalation",
            "escalation_id": escalation_data.get("escalation_id"),
            "decision_id": escalation_data.get("decision_id"),
            "guardian": escalation_data.get("guardian_username"),
            "timing": escalation_data.get("escalation_timing"),
            "timestamp": time.time()
        }
        
        logger.info(
            f"📊 Escalation logged to metrics: {escalation_data.get('escalation_id')}"
        )
        
        # Placeholder: Actual HTTP transmission to Vercel endpoint not yet implemented
        if vercel_endpoint:
            logger.info(f"📡 Vercel endpoint configured (transmission not implemented): {vercel_endpoint}")
        
        return {
            "logged": True,
            "log_entry": log_entry,
            "endpoint": vercel_endpoint
        }


# Global guardian monitor instance
_guardian_monitor: Optional[GuardianMonitor] = None


def get_guardian_monitor() -> GuardianMonitor:
    """Get or create global guardian monitor instance"""
    global _guardian_monitor
    if _guardian_monitor is None:
        _guardian_monitor = GuardianMonitor()
    return _guardian_monitor
