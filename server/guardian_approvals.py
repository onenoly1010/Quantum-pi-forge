"""
Guardian Approval System
Records and manages guardian approvals for autonomous decisions.
"""

import json
import os
import time
from typing import Dict, Any, List, Optional
from pathlib import Path
from pydantic import BaseModel, Field

import logging

logger = logging.getLogger(__name__)


class GuardianApproval(BaseModel):
    """Guardian approval record"""
    approval_id: str
    decision_id: str
    decision_type: str
    guardian_id: str
    action: str = Field(..., description="approve, reject, or modify")
    reasoning: str
    priority: str
    confidence: float
    timestamp: float = Field(default_factory=time.time)
    metadata: Optional[Dict[str, Any]] = Field(default=None)


class GuardianApprovalSystem:
    """
    System for recording and managing guardian approvals for deployment decisions
    """
    
    def __init__(self, storage_dir: str = ".guardian_approvals"):
        """
        Initialize the guardian approval system
        
        Args:
            storage_dir: Directory to store approval records
        """
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        self.approvals_file = self.storage_dir / "approvals.json"
        self.approvals: List[GuardianApproval] = []
        self._load_approvals()
        logger.info(f"✅ Guardian Approval System initialized (storage: {self.storage_dir})")
    
    def _load_approvals(self):
        """Load existing approvals from storage"""
        if self.approvals_file.exists():
            try:
                with open(self.approvals_file, 'r') as f:
                    data = json.load(f)
                    self.approvals = [GuardianApproval(**item) for item in data]
                logger.info(f"Loaded {len(self.approvals)} existing approvals")
            except Exception as e:
                logger.error(f"Failed to load approvals: {e}")
                self.approvals = []
        else:
            self.approvals = []
    
    def _save_approvals(self):
        """Save approvals to storage"""
        try:
            with open(self.approvals_file, 'w') as f:
                data = [approval.model_dump() for approval in self.approvals]
                json.dump(data, f, indent=2)
            logger.info(f"Saved {len(self.approvals)} approvals to storage")
        except Exception as e:
            logger.error(f"Failed to save approvals: {e}")
            raise
    def record_approval(
        self,
        decision_id: str,
        decision_type: str,
        guardian_id: str,
        action: str,
        reasoning: str,
        priority: str = "high",
        confidence: float = 0.0,
        metadata: Optional[Dict[str, Any]] = None
    ) -> GuardianApproval:
        """
        Record a guardian approval
        
        Args:
            decision_id: Original decision ID that requires approval
            decision_type: Type of decision (deployment, scaling, etc.)
            guardian_id: ID of the guardian approving
            action: approve, reject, or modify
            reasoning: Reasoning for the action
            priority: Priority level of the decision
            confidence: Confidence score of the original decision
            metadata: Additional metadata
            
        Returns:
            GuardianApproval record
        """
        approval_id = f"approval_{int(time.time()*1000)}"
        
        approval = GuardianApproval(
            approval_id=approval_id,
            decision_id=decision_id,
            decision_type=decision_type,
            guardian_id=guardian_id,
            action=action,
            reasoning=reasoning,
            priority=priority,
            confidence=confidence,
            metadata=metadata or {}
        )
        
        self.approvals.append(approval)
        self._save_approvals()
        
        logger.info(
            f"🛡️ Guardian approval recorded: {approval_id} - "
            f"{action} decision {decision_id} by {guardian_id}"
        )
        
        return approval
    
    def get_approval(self, decision_id: str) -> Optional[GuardianApproval]:
        """
        Get approval for a specific decision
        
        Args:
            decision_id: Decision ID to look up
            
        Returns:
            GuardianApproval if found, None otherwise
        """
        for approval in reversed(self.approvals):
            if approval.decision_id == decision_id:
                return approval
        return None
    
    def is_approved(self, decision_id: str) -> bool:
        """
        Check if a decision is approved
        
        Args:
            decision_id: Decision ID to check
            
        Returns:
            True if approved, False otherwise
        """
        approval = self.get_approval(decision_id)
        return approval is not None and approval.action == "approve"
    
    def get_all_approvals(
        self,
        decision_type: Optional[str] = None,
        action: Optional[str] = None,
        limit: int = 100
    ) -> List[GuardianApproval]:
        """
        Get all approvals with optional filtering
        
        Args:
            decision_type: Filter by decision type
            action: Filter by action (approve, reject, modify)
            limit: Maximum number of results
            
        Returns:
            List of GuardianApproval records
        """
        approvals = self.approvals
        
        if decision_type:
            approvals = [a for a in approvals if a.decision_type == decision_type]
        
        if action:
            approvals = [a for a in approvals if a.action == action]
        
        return approvals[-limit:]
    
    def get_approval_stats(self) -> Dict[str, Any]:
        """
        Get statistics about approvals
        
        Returns:
            Dictionary with approval statistics
        """
        if not self.approvals:
            return {
                "total": 0,
                "approved": 0,
                "rejected": 0,
                "modified": 0,
                "approval_rate": 0.0,
                "by_type": {}
            }
        
        total = len(self.approvals)
        approved = sum(1 for a in self.approvals if a.action == "approve")
        rejected = sum(1 for a in self.approvals if a.action == "reject")
        modified = sum(1 for a in self.approvals if a.action == "modify")
        
        # Group by decision type
        by_type = {}
        for approval in self.approvals:
            if approval.decision_type not in by_type:
                by_type[approval.decision_type] = {
                    "total": 0,
                    "approved": 0,
                    "rejected": 0,
                    "modified": 0
                }
            by_type[approval.decision_type]["total"] += 1
            if approval.action == "approve":
                by_type[approval.decision_type]["approved"] += 1
            elif approval.action == "reject":
                by_type[approval.decision_type]["rejected"] += 1
            elif approval.action == "modify":
                by_type[approval.decision_type]["modified"] += 1
        
        return {
            "total": total,
            "approved": approved,
            "rejected": rejected,
            "modified": modified,
            "approval_rate": approved / total if total > 0 else 0.0,
            "by_type": by_type
        }


# Global approval system instance
_approval_system: Optional[GuardianApprovalSystem] = None


def get_approval_system() -> GuardianApprovalSystem:
    """Get or create global approval system instance"""
    global _approval_system
    if _approval_system is None:
        _approval_system = GuardianApprovalSystem()
    return _approval_system
