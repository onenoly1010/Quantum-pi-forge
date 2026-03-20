"""
Autonomous Decision Tools for AI Agents
Provides direct decision-making capabilities based on predefined parameters and real-time data.
"""

import logging
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


class DecisionPriority(str, Enum):
    """Decision priority levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class DecisionType(str, Enum):
    """Types of autonomous decisions"""
    DEPLOYMENT = "deployment"
    SCALING = "scaling"
    ROLLBACK = "rollback"
    HEALING = "healing"
    MONITORING = "monitoring"
    GUARDIAN_OVERRIDE = "guardian_override"


class DecisionParameter(BaseModel):
    """Parameters for autonomous decision making"""
    name: str = Field(..., description="Parameter name")
    value: Any = Field(..., description="Parameter value")
    threshold: Optional[float] = Field(None, description="Decision threshold")
    weight: float = Field(1.0, ge=0.0, le=1.0, description="Parameter weight in decision")


class DecisionContext(BaseModel):
    """Context for making autonomous decisions"""
    decision_type: DecisionType
    priority: DecisionPriority
    parameters: List[DecisionParameter]
    timestamp: float = Field(default_factory=time.time)
    source: str = Field(default="autonomous_agent", description="Decision source")
    metadata: Optional[Dict[str, Any]] = Field(default=None)


class DecisionResult(BaseModel):
    """Result of autonomous decision"""
    decision_id: str
    decision_type: DecisionType
    approved: bool
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str
    actions: List[str]
    timestamp: float = Field(default_factory=time.time)
    requires_guardian: bool = Field(default=False)
    metadata: Optional[Dict[str, Any]] = Field(default=None)
    
    def get_priority(self) -> str:
        """
        Get decision priority from metadata with default fallback
        
        Returns:
            Priority string (critical, high, medium, low), defaults to "medium"
        """
        return self.metadata.get("priority", "medium") if self.metadata else "medium"


class AIDecisionMatrix:
    """
    AI Decision Matrix for autonomous decision-making
    Implements configurable decision logic based on predefined parameters
    """

    def __init__(self):
        self.decision_history: List[DecisionResult] = []
        self.decision_rules = self._initialize_decision_rules()
        logger.info("✅ AI Decision Matrix initialized")

    def _initialize_decision_rules(self) -> Dict[DecisionType, Dict[str, Any]]:
        """Initialize predefined decision rules for different types"""
        return {
            DecisionType.DEPLOYMENT: {
                "confidence_threshold": 0.8,
                "required_checks": ["health", "tests", "security"],
                "max_auto_approve": DecisionPriority.MEDIUM
            },
            DecisionType.SCALING: {
                "confidence_threshold": 0.7,
                "cpu_threshold": 0.75,
                "memory_threshold": 0.80,
                "max_auto_approve": DecisionPriority.HIGH
            },
            DecisionType.ROLLBACK: {
                "confidence_threshold": 0.9,
                "error_rate_threshold": 0.05,
                "max_auto_approve": DecisionPriority.CRITICAL
            },
            DecisionType.HEALING: {
                "confidence_threshold": 0.85,
                "retry_attempts": 3,
                "max_auto_approve": DecisionPriority.HIGH
            },
            DecisionType.MONITORING: {
                "confidence_threshold": 0.6,
                "alert_threshold": 0.8,
                "max_auto_approve": DecisionPriority.LOW
            },
            DecisionType.GUARDIAN_OVERRIDE: {
                "confidence_threshold": 0.95,
                "max_auto_approve": None,  # Always requires guardian
                "required_checks": ["security", "compliance", "validation"]
            }
        }

    def make_decision(self, context: DecisionContext) -> DecisionResult:
        """
        Make an autonomous decision based on context and decision matrix
        
        Args:
            context: Decision context with parameters and type
            
        Returns:
            DecisionResult with approval status and reasoning
        """
        logger.info(f"🤖 Making autonomous decision: {context.decision_type.value}")
        
        # Get rules for this decision type
        rules = self.decision_rules.get(context.decision_type, {})
        confidence_threshold = rules.get("confidence_threshold", 0.8)
        
        # Calculate confidence score based on parameters
        confidence = self._calculate_confidence(context, rules)
        
        # Determine if decision requires guardian approval
        requires_guardian = self._requires_guardian_approval(context, rules, confidence)
        
        # Generate reasoning
        reasoning = self._generate_reasoning(context, confidence, requires_guardian)
        
        # Determine approval
        approved = confidence >= confidence_threshold and not requires_guardian
        
        # Generate recommended actions
        actions = self._generate_actions(context, approved, requires_guardian)
        
        # Create decision result
        decision_id = f"{context.decision_type.value}_{int(time.time()*1000)}"
        result = DecisionResult(
            decision_id=decision_id,
            decision_type=context.decision_type,
            approved=approved,
            confidence=confidence,
            reasoning=reasoning,
            actions=actions,
            requires_guardian=requires_guardian,
            metadata={
                "parameters": [p.model_dump() for p in context.parameters],
                "priority": context.priority.value,
                "source": context.source
            }
        )
        
        # Store in history
        self.decision_history.append(result)
        
        # Keep only last 1000 decisions
        if len(self.decision_history) > 1000:
            self.decision_history = self.decision_history[-1000:]
        
        logger.info(f"✅ Decision made: {decision_id}, approved={approved}, confidence={confidence:.2f}")
        return result

    def _calculate_confidence(self, context: DecisionContext, rules: Dict[str, Any]) -> float:
        """Calculate confidence score based on parameters and rules"""
        if not context.parameters:
            return 0.5  # Default medium confidence
        
        # Weighted average of parameter values
        total_weight = sum(p.weight for p in context.parameters)
        if total_weight == 0:
            return 0.5
        
        weighted_sum = 0.0
        for param in context.parameters:
            # Normalize parameter value to 0-1 range if threshold is provided
            if param.threshold is not None and isinstance(param.value, (int, float)):
                # Avoid division by zero
                if param.threshold != 0:
                    normalized = min(1.0, float(param.value) / param.threshold)
                else:
                    normalized = 1.0 if param.value > 0 else 0.0
            elif isinstance(param.value, bool):
                normalized = 1.0 if param.value else 0.0
            elif isinstance(param.value, (int, float)):
                normalized = min(1.0, max(0.0, float(param.value)))
            else:
                normalized = 0.5  # Default for other types
            
            weighted_sum += normalized * param.weight
        
        confidence = weighted_sum / total_weight
        
        # Apply priority boost
        priority_boost = {
            DecisionPriority.CRITICAL: 0.1,
            DecisionPriority.HIGH: 0.05,
            DecisionPriority.MEDIUM: 0.0,
            DecisionPriority.LOW: -0.05
        }
        confidence = min(1.0, confidence + priority_boost.get(context.priority, 0.0))
        
        return confidence

    def _requires_guardian_approval(
        self, 
        context: DecisionContext, 
        rules: Dict[str, Any],
        confidence: float
    ) -> bool:
        """Determine if decision requires guardian approval"""
        # Guardian override always requires approval
        if context.decision_type == DecisionType.GUARDIAN_OVERRIDE:
            return True
        
        # Check if priority level exceeds auto-approval limit
        max_auto_approve = rules.get("max_auto_approve")
        if max_auto_approve is None:
            return True
        
        priority_levels = [
            DecisionPriority.LOW,
            DecisionPriority.MEDIUM,
            DecisionPriority.HIGH,
            DecisionPriority.CRITICAL
        ]
        
        current_level = priority_levels.index(context.priority)
        max_level = priority_levels.index(max_auto_approve)
        
        if current_level > max_level:
            return True
        
        # Low confidence requires guardian approval
        confidence_threshold = rules.get("confidence_threshold", 0.8)
        if confidence < confidence_threshold:
            return True
        
        return False

    def _generate_reasoning(
        self,
        context: DecisionContext,
        confidence: float,
        requires_guardian: bool
    ) -> str:
        """Generate human-readable reasoning for the decision"""
        reasoning_parts = []
        
        reasoning_parts.append(
            f"Decision type: {context.decision_type.value}, "
            f"Priority: {context.priority.value}, "
            f"Confidence: {confidence:.2%}"
        )
        
        if requires_guardian:
            reasoning_parts.append(
                "Guardian approval required due to high priority or low confidence"
            )
        else:
            reasoning_parts.append("Approved for autonomous execution")
        
        # Add parameter summary
        if context.parameters:
            param_summary = ", ".join([
                f"{p.name}={p.value}" for p in context.parameters[:3]
            ])
            reasoning_parts.append(f"Parameters: {param_summary}")
        
        return ". ".join(reasoning_parts)

    def _generate_actions(
        self,
        context: DecisionContext,
        approved: bool,
        requires_guardian: bool
    ) -> List[str]:
        """Generate recommended actions based on decision"""
        actions = []
        
        if requires_guardian:
            actions.append("Request guardian approval")
            actions.append("Queue decision for manual review")
            actions.append(f"Log decision to monitoring system")
        elif approved:
            actions.append(f"Execute {context.decision_type.value} autonomously")
            actions.append("Record metrics to Vercel service")
            actions.append("Update system state")
            actions.append("Notify monitoring agents")
        else:
            actions.append("Decision rejected - insufficient confidence")
            actions.append("Request additional parameters")
            actions.append("Log to incident report")
        
        return actions

    def get_decision_history(
        self,
        decision_type: Optional[DecisionType] = None,
        limit: int = 100
    ) -> List[DecisionResult]:
        """Get decision history, optionally filtered by type"""
        history = self.decision_history
        
        if decision_type:
            history = [d for d in history if d.decision_type == decision_type]
        
        return history[-limit:]

    def get_decision_metrics(self) -> Dict[str, Any]:
        """Get metrics about decision making"""
        if not self.decision_history:
            return {
                "total_decisions": 0,
                "approval_rate": 0.0,
                "average_confidence": 0.0,
                "guardian_required_rate": 0.0
            }
        
        total = len(self.decision_history)
        approved = sum(1 for d in self.decision_history if d.approved)
        guardian_required = sum(1 for d in self.decision_history if d.requires_guardian)
        avg_confidence = sum(d.confidence for d in self.decision_history) / total
        
        return {
            "total_decisions": total,
            "approval_rate": approved / total,
            "average_confidence": avg_confidence,
            "guardian_required_rate": guardian_required / total,
            "by_type": self._get_metrics_by_type()
        }

    def _get_metrics_by_type(self) -> Dict[str, Dict[str, Any]]:
        """Get metrics broken down by decision type"""
        metrics_by_type = {}
        
        for decision_type in DecisionType:
            type_decisions = [d for d in self.decision_history if d.decision_type == decision_type]
            if type_decisions:
                metrics_by_type[decision_type.value] = {
                    "count": len(type_decisions),
                    "approval_rate": sum(1 for d in type_decisions if d.approved) / len(type_decisions),
                    "avg_confidence": sum(d.confidence for d in type_decisions) / len(type_decisions)
                }
        
        return metrics_by_type


# Global decision matrix instance
_decision_matrix: Optional[AIDecisionMatrix] = None


def get_decision_matrix() -> AIDecisionMatrix:
    """Get or create global decision matrix instance"""
    global _decision_matrix
    if _decision_matrix is None:
        _decision_matrix = AIDecisionMatrix()
    return _decision_matrix


# ============================================================================
# GUARDIAN ESCALATION FUNCTIONS
# ============================================================================

def create_guardian_escalation_issue(
    decision: DecisionResult,
    guardian_username: str = "onenoly1010"
) -> Dict[str, Any]:
    """
    Create GitHub issue for guardian review
    
    Args:
        decision: Decision result requiring guardian approval
        guardian_username: GitHub username of guardian to assign
        
    Returns:
        Dictionary with escalation details
    """
    from config.guardians import (
        GUARDIAN_TEAM_ISSUE_URL,
        get_escalation_timing
    )
    
    # Get escalation timing based on priority
    priority = decision.get_priority()
    escalation_timing = get_escalation_timing(priority)
    
    # Create issue data structure (for actual GitHub API integration)
    issue_data = {
        "title": f"🛡️ Guardian Review Required: {decision.decision_type.value} (Priority: {priority})",
        "body": f"""## Guardian Escalation Required

**Decision ID**: `{decision.decision_id}`
**Decision Type**: {decision.decision_type.value}
**Priority**: {priority}
**Confidence**: {decision.confidence:.2%}
**Escalation Timing**: {escalation_timing}

### Decision Details

{decision.reasoning}

### Recommended Actions

{chr(10).join(f"- {action}" for action in decision.actions)}

### Guardian Team Reference

See Guardian Team configuration: {GUARDIAN_TEAM_ISSUE_URL}

---

**Assigned to**: @{guardian_username}
**Requires**: Guardian approval before execution
""",
        "assignees": [guardian_username],
        "labels": [
            "guardian-review",
            f"priority-{priority}",
            "autonomous-decision"
        ]
    }
    
    logger.info(
        f"🛡️ Guardian escalation issue created for decision {decision.decision_id} "
        f"(priority: {priority}, timing: {escalation_timing})"
    )
    
    return {
        "escalation_id": f"esc_{decision.decision_id}",
        "decision_id": decision.decision_id,
        "guardian_username": guardian_username,
        "escalation_timing": escalation_timing,
        "issue_data": issue_data,
        "timestamp": time.time()
    }


def notify_guardian(
    decision: DecisionResult,
    escalation_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Trigger guardian notification workflow
    
    Note: This is currently a placeholder implementation that logs notification
    intent but does not actually trigger GitHub workflow dispatch or create
    GitHub issues. To enable actual notifications, implement:
    - GitHub API calls to create issues
    - GitHub workflow_dispatch API calls
    - Or integrate with notification service
    
    Args:
        decision: Decision result requiring guardian approval
        escalation_data: Escalation data from create_guardian_escalation_issue
        
    Returns:
        Notification result with status "queued" (placeholder, not actually queued)
    """
    from config.guardians import get_guardian_notification_methods
    
    notification_methods = get_guardian_notification_methods()
    
    notification_result = {
        "notification_id": f"notify_{escalation_data['escalation_id']}",
        "decision_id": decision.decision_id,
        "methods": notification_methods,
        "status": "queued",  # Placeholder status - actual queuing not implemented
        "timestamp": time.time()
    }
    
    # Placeholder: Log intended notification methods (actual triggering not implemented)
    for method in notification_methods:
        logger.info(
            f"📢 Guardian notification intent logged via {method} "
            f"for decision {decision.decision_id} (actual notification not sent)"
        )
    
    return notification_result


def link_to_guardian_team() -> Dict[str, Any]:
    """
    Get Guardian Team Issue reference
    
    Returns:
        Dictionary with guardian team information
    """
    from config.guardians import (
        GUARDIAN_TEAM_ISSUE_URL,
        GUARDIAN_TEAM_ISSUE_NUMBER,
        get_primary_guardian
    )
    
    return {
        "guardian_team_issue": GUARDIAN_TEAM_ISSUE_URL,
        "issue_number": GUARDIAN_TEAM_ISSUE_NUMBER,
        "primary_guardian": get_primary_guardian()
    }


def handle_guardian_escalation(decision: DecisionResult) -> Dict[str, Any]:
    """
    Handle complete guardian escalation flow
    
    Args:
        decision: Decision result requiring guardian approval
        
    Returns:
        Complete escalation result
    """
    from config.guardians import get_guardian_github_username
    
    if not decision.requires_guardian:
        logger.warning(
            f"⚠️ Attempted to escalate decision {decision.decision_id} "
            "that doesn't require guardian approval"
        )
        return {
            "escalated": False,
            "reason": "Decision does not require guardian approval"
        }
    
    guardian_username = get_guardian_github_username()
    
    # Create escalation issue
    escalation_data = create_guardian_escalation_issue(decision, guardian_username)
    
    # Notify guardian
    notification_result = notify_guardian(decision, escalation_data)
    
    # Get guardian team reference
    team_info = link_to_guardian_team()
    
    logger.info(
        f"✅ Guardian escalation completed for decision {decision.decision_id}"
    )
    
    return {
        "escalated": True,
        "escalation_data": escalation_data,
        "notification": notification_result,
        "guardian_team": team_info,
        "timestamp": time.time()
    }
