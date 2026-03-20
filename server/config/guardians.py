"""
Guardian Team Configuration
Configuration for guardian escalation system referenced in Issue #100
"""

from enum import Enum
from typing import Dict, List, Any

# Guardian Team Configuration (from Issue #100)
GUARDIANS = {
    "primary": {
        "github_username": "onenoly1010",
        "role": "lead",
        "escalation_priority": 1,
        "notification_methods": ["github_issue", "workflow_dispatch"]
    }
}

# Escalation timing enumeration for determining notification urgency
class EscalationTiming(str, Enum):
    """Escalation timing types for guardian notifications"""
    IMMEDIATE = "immediate"
    BATCHED = "batched"
    DAILY_SUMMARY = "daily_summary"


# Escalation Rules - Maps decision priority to escalation timing
def get_escalation_timing(priority: str) -> str:
    """
    Get escalation timing based on decision priority
    
    Args:
        priority: Decision priority (critical, high, medium, low)
        
    Returns:
        Escalation timing string
    """
    ESCALATION_RULES = {
        "critical": EscalationTiming.IMMEDIATE,  # Create issue immediately
        "high": EscalationTiming.IMMEDIATE,
        "medium": EscalationTiming.BATCHED,  # Batch notifications
        "low": EscalationTiming.DAILY_SUMMARY
    }
    return ESCALATION_RULES.get(priority.lower(), EscalationTiming.BATCHED).value


def get_primary_guardian() -> Dict[str, Any]:
    """Get primary guardian configuration"""
    return GUARDIANS["primary"]


def get_guardian_github_username() -> str:
    """Get primary guardian's GitHub username"""
    return GUARDIANS["primary"]["github_username"]


def get_guardian_notification_methods() -> List[str]:
    """Get guardian notification methods"""
    return GUARDIANS["primary"]["notification_methods"]


# Guardian Team Issue Reference
GUARDIAN_TEAM_ISSUE_URL = "https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100"
GUARDIAN_TEAM_ISSUE_NUMBER = 100
