"""
Tests for Guardian Approval System
"""

import pytest
import os
import tempfile
import shutil
from pathlib import Path

# Add parent directory to path
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

from guardian_approvals import GuardianApprovalSystem


@pytest.fixture
def temp_storage():
    """Create a temporary storage directory for tests"""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    # Cleanup after test
    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture
def approval_system(temp_storage):
    """Create a guardian approval system with temporary storage"""
    return GuardianApprovalSystem(storage_dir=temp_storage)


def test_approval_system_initialization(approval_system):
    """Test that the approval system initializes correctly"""
    assert approval_system is not None
    assert len(approval_system.approvals) == 0
    assert approval_system.storage_dir.exists()


def test_record_approval(approval_system):
    """Test recording a guardian approval"""
    approval = approval_system.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test approval",
        priority="high",
        confidence=0.85
    )
    
    assert approval is not None
    assert approval.decision_id == "deployment_1234567890000"
    assert approval.decision_type == "deployment"
    assert approval.guardian_id == "test_guardian"
    assert approval.action == "approve"
    assert approval.reasoning == "Test approval"
    assert approval.priority == "high"
    assert approval.confidence == 0.85
    assert len(approval_system.approvals) == 1


def test_get_approval(approval_system):
    """Test getting a specific approval"""
    # Record an approval
    approval_system.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test approval"
    )
    
    # Get the approval
    approval = approval_system.get_approval("deployment_1234567890000")
    
    assert approval is not None
    assert approval.decision_id == "deployment_1234567890000"
    assert approval.action == "approve"


def test_get_approval_not_found(approval_system):
    """Test getting an approval that doesn't exist"""
    approval = approval_system.get_approval("nonexistent_decision")
    assert approval is None


def test_is_approved(approval_system):
    """Test checking if a decision is approved"""
    # Record an approval
    approval_system.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test approval"
    )
    
    # Check if approved
    assert approval_system.is_approved("deployment_1234567890000") is True
    assert approval_system.is_approved("nonexistent_decision") is False


def test_is_approved_rejected(approval_system):
    """Test that rejected decisions are not considered approved"""
    approval_system.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="reject",
        reasoning="Test rejection"
    )
    
    assert approval_system.is_approved("deployment_1234567890000") is False


def test_get_all_approvals(approval_system):
    """Test getting all approvals"""
    # Record multiple approvals
    for i in range(5):
        approval_system.record_approval(
            decision_id=f"deployment_{i}",
            decision_type="deployment",
            guardian_id="test_guardian",
            action="approve",
            reasoning=f"Test approval {i}"
        )
    
    approvals = approval_system.get_all_approvals()
    assert len(approvals) == 5


def test_get_all_approvals_filtered_by_type(approval_system):
    """Test getting approvals filtered by decision type"""
    # Record approvals of different types
    approval_system.record_approval(
        decision_id="deployment_1",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test"
    )
    approval_system.record_approval(
        decision_id="scaling_1",
        decision_type="scaling",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test"
    )
    approval_system.record_approval(
        decision_id="deployment_2",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test"
    )
    
    deployments = approval_system.get_all_approvals(decision_type="deployment")
    assert len(deployments) == 2
    assert all(a.decision_type == "deployment" for a in deployments)


def test_get_all_approvals_filtered_by_action(approval_system):
    """Test getting approvals filtered by action"""
    # Record approvals with different actions
    approval_system.record_approval(
        decision_id="deployment_1",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test"
    )
    approval_system.record_approval(
        decision_id="deployment_2",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="reject",
        reasoning="Test"
    )
    approval_system.record_approval(
        decision_id="deployment_3",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test"
    )
    
    approved = approval_system.get_all_approvals(action="approve")
    assert len(approved) == 2
    assert all(a.action == "approve" for a in approved)


def test_get_approval_stats(approval_system):
    """Test getting approval statistics"""
    # Record various approvals
    approval_system.record_approval(
        decision_id="deployment_1",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test"
    )
    approval_system.record_approval(
        decision_id="deployment_2",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="reject",
        reasoning="Test"
    )
    approval_system.record_approval(
        decision_id="scaling_1",
        decision_type="scaling",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test"
    )
    
    stats = approval_system.get_approval_stats()
    
    assert stats["total"] == 3
    assert stats["approved"] == 2
    assert stats["rejected"] == 1
    assert stats["modified"] == 0
    assert stats["approval_rate"] == pytest.approx(2.0 / 3.0)
    assert "deployment" in stats["by_type"]
    assert "scaling" in stats["by_type"]


def test_get_approval_stats_empty(approval_system):
    """Test getting stats when no approvals exist"""
    stats = approval_system.get_approval_stats()
    
    assert stats["total"] == 0
    assert stats["approved"] == 0
    assert stats["rejected"] == 0
    assert stats["modified"] == 0
    assert stats["approval_rate"] == 0.0
    assert stats["by_type"] == {}


def test_persistence(temp_storage):
    """Test that approvals are persisted to disk"""
    # Create first system and record approval
    system1 = GuardianApprovalSystem(storage_dir=temp_storage)
    system1.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test approval"
    )
    
    # Create second system from same storage
    system2 = GuardianApprovalSystem(storage_dir=temp_storage)
    
    # Check that approval was loaded
    assert len(system2.approvals) == 1
    approval = system2.get_approval("deployment_1234567890000")
    assert approval is not None
    assert approval.action == "approve"


def test_multiple_approvals_same_decision(approval_system):
    """Test that multiple approvals can exist for same decision (latest wins)"""
    # Record first approval
    approval_system.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="guardian1",
        action="reject",
        reasoning="Initial rejection"
    )
    
    # Record second approval (override)
    approval_system.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="guardian2",
        action="approve",
        reasoning="Override approval"
    )
    
    # Should get the latest approval
    approval = approval_system.get_approval("deployment_1234567890000")
    assert approval.action == "approve"
    assert approval.guardian_id == "guardian2"
    assert approval.reasoning == "Override approval"


def test_approval_with_metadata(approval_system):
    """Test recording approval with additional metadata"""
    metadata = {
        "issue_number": 123,
        "commit_hash": "a1b2c3d",
        "files_changed": 12
    }
    
    approval = approval_system.record_approval(
        decision_id="deployment_1234567890000",
        decision_type="deployment",
        guardian_id="test_guardian",
        action="approve",
        reasoning="Test approval",
        metadata=metadata
    )
    
    assert approval.metadata is not None
    assert approval.metadata["issue_number"] == 123
    assert approval.metadata["commit_hash"] == "a1b2c3d"
    assert approval.metadata["files_changed"] == 12


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
