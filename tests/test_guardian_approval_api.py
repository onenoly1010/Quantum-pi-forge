"""
Tests for Guardian Approval API Endpoints
These tests verify the REST API endpoints for guardian approvals.
"""

import pytest
import os
import sys
import tempfile
import shutil

# Add parent directory to path


from server.guardian_approvals import GuardianApprovalSystem, get_approval_system
@pytest.fixture
def temp_storage():
    """Create a temporary storage directory for tests"""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    # Cleanup after test
    shutil.rmtree(temp_dir, ignore_errors=True)


def test_api_integration_flow(temp_storage):
    """Test the complete API flow for guardian approvals"""
    # Initialize approval system with temp storage
    approval_system = GuardianApprovalSystem(storage_dir=temp_storage)
    
    # Simulate POST /api/guardian/record-approval
    decision_id = "deployment_1734134400000"
    decision_type = "deployment"
    guardian_id = "onenoly1010"
    action = "approve"
    reasoning = "Perfect, Approved"
    priority = "high"
    confidence = 0.76
    
    approval = approval_system.record_approval(
        decision_id=decision_id,
        decision_type=decision_type,
        guardian_id=guardian_id,
        action=action,
        reasoning=reasoning,
        priority=priority,
        confidence=confidence,
        metadata={"test": True}
    )
    
    # Verify approval was recorded
    assert approval is not None
    assert approval.decision_id == decision_id
    assert approval.action == action
    
    # Simulate GET /api/guardian/check-approval/{decision_id}
    retrieved_approval = approval_system.get_approval(decision_id)
    is_approved = approval_system.is_approved(decision_id)
    
    assert retrieved_approval is not None
    assert is_approved is True
    assert retrieved_approval.approval_id == approval.approval_id
    
    # Simulate GET /api/guardian/approvals
    all_approvals = approval_system.get_all_approvals()
    assert len(all_approvals) == 1
    assert all_approvals[0].decision_id == decision_id
    
    # Simulate GET /api/guardian/approval-stats
    stats = approval_system.get_approval_stats()
    assert stats["total"] == 1
    assert stats["approved"] == 1
    assert stats["approval_rate"] == 1.0


def test_api_filtering(temp_storage):
    """Test API filtering capabilities"""
    approval_system = GuardianApprovalSystem(storage_dir=temp_storage)
    
    # Record multiple approvals of different types
    approval_system.record_approval(
        decision_id="deployment_1",
        decision_type="deployment",
        guardian_id="guardian1",
        action="approve",
        reasoning="Test 1"
    )
    approval_system.record_approval(
        decision_id="scaling_1",
        decision_type="scaling",
        guardian_id="guardian1",
        action="approve",
        reasoning="Test 2"
    )
    approval_system.record_approval(
        decision_id="deployment_2",
        decision_type="deployment",
        guardian_id="guardian2",
        action="reject",
        reasoning="Test 3"
    )
    
    # Test filtering by decision_type
    deployments = approval_system.get_all_approvals(decision_type="deployment")
    assert len(deployments) == 2
    
    # Test filtering by action
    approved = approval_system.get_all_approvals(action="approve")
    assert len(approved) == 2
    
    # Test combined filtering
    approved_deployments = approval_system.get_all_approvals(
        decision_type="deployment",
        action="approve"
    )
    assert len(approved_deployments) == 1
    assert approved_deployments[0].decision_id == "deployment_1"


def test_api_not_found(temp_storage):
    """Test API behavior when approval is not found"""
    approval_system = GuardianApprovalSystem(storage_dir=temp_storage)
    
    # Try to get non-existent approval
    approval = approval_system.get_approval("nonexistent_decision")
    assert approval is None
    
    # Check is_approved for non-existent decision
    is_approved = approval_system.is_approved("nonexistent_decision")
    assert is_approved is False


def test_api_stats_multiple_types(temp_storage):
    """Test API stats with multiple decision types"""
    approval_system = GuardianApprovalSystem(storage_dir=temp_storage)
    
    # Record approvals of different types and actions
    for i in range(3):
        approval_system.record_approval(
            decision_id=f"deployment_{i}",
            decision_type="deployment",
            guardian_id="guardian1",
            action="approve",
            reasoning=f"Test {i}"
        )
    
    for i in range(2):
        approval_system.record_approval(
            decision_id=f"scaling_{i}",
            decision_type="scaling",
            guardian_id="guardian1",
            action="reject",
            reasoning=f"Test {i}"
        )
    
    stats = approval_system.get_approval_stats()
    
    assert stats["total"] == 5
    assert stats["approved"] == 3
    assert stats["rejected"] == 2
    assert stats["approval_rate"] == 0.6
    
    # Check by_type breakdown
    assert "deployment" in stats["by_type"]
    assert stats["by_type"]["deployment"]["total"] == 3
    assert stats["by_type"]["deployment"]["approved"] == 3
    
    assert "scaling" in stats["by_type"]
    assert stats["by_type"]["scaling"]["total"] == 2
    assert stats["by_type"]["scaling"]["rejected"] == 2


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
