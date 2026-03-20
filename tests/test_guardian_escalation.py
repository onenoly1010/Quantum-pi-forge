"""
Tests for Guardian Escalation System
Tests for guardian configuration, escalation functions, and dashboard endpoint.
"""

import pytest
import sys
import os

# Add server directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))


def test_guardian_config_import():
    """Test that guardian configuration can be imported"""
    from config.guardians import (
        GUARDIANS,
        get_primary_guardian,
        get_guardian_github_username,
        get_escalation_timing,
        GUARDIAN_TEAM_ISSUE_URL
    )
    
    assert GUARDIANS is not None
    assert "primary" in GUARDIANS
    assert GUARDIANS["primary"]["github_username"] == "onenoly1010"


def test_get_primary_guardian():
    """Test getting primary guardian configuration"""
    from config.guardians import get_primary_guardian
    
    guardian = get_primary_guardian()
    assert guardian is not None
    assert guardian["github_username"] == "onenoly1010"
    assert guardian["role"] == "lead"
    assert guardian["escalation_priority"] == 1


def test_get_guardian_github_username():
    """Test getting guardian GitHub username"""
    from config.guardians import get_guardian_github_username
    
    username = get_guardian_github_username()
    assert username == "onenoly1010"


def test_escalation_timing_rules():
    """Test escalation timing for different priorities"""
    from config.guardians import get_escalation_timing
    
    assert get_escalation_timing("critical") == "immediate"
    assert get_escalation_timing("high") == "immediate"
    assert get_escalation_timing("medium") == "batched"
    assert get_escalation_timing("low") == "daily_summary"
    
    # Test case insensitive
    assert get_escalation_timing("CRITICAL") == "immediate"
    assert get_escalation_timing("High") == "immediate"


def test_guardian_team_reference():
    """Test guardian team issue reference"""
    from config.guardians import GUARDIAN_TEAM_ISSUE_URL, GUARDIAN_TEAM_ISSUE_NUMBER
    
    assert GUARDIAN_TEAM_ISSUE_URL == "https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100"
    assert GUARDIAN_TEAM_ISSUE_NUMBER == 100


def test_create_guardian_escalation_issue():
    """Test creating guardian escalation issue"""
    from autonomous_decision import (
        create_guardian_escalation_issue,
        DecisionResult,
        DecisionType
    )
    
    # Create a mock decision that requires guardian approval
    decision = DecisionResult(
        decision_id="test_decision_123",
        decision_type=DecisionType.DEPLOYMENT,
        approved=False,
        confidence=0.75,
        reasoning="Test decision requiring guardian approval",
        actions=["Action 1", "Action 2"],
        requires_guardian=True,
        metadata={"priority": "high"}
    )
    
    # Create escalation issue
    result = create_guardian_escalation_issue(decision, "onenoly1010")
    
    assert result is not None
    assert result["decision_id"] == "test_decision_123"
    assert result["guardian_username"] == "onenoly1010"
    assert result["escalation_timing"] == "immediate"
    assert "issue_data" in result
    assert result["issue_data"]["assignees"] == ["onenoly1010"]


def test_notify_guardian():
    """Test guardian notification"""
    from autonomous_decision import (
        notify_guardian,
        DecisionResult,
        DecisionType
    )
    
    # Create a mock decision
    decision = DecisionResult(
        decision_id="test_decision_456",
        decision_type=DecisionType.ROLLBACK,
        approved=False,
        confidence=0.70,
        reasoning="Test rollback decision",
        actions=["Rollback action"],
        requires_guardian=True,
        metadata={"priority": "critical"}
    )
    
    escalation_data = {
        "escalation_id": "esc_test_decision_456",
        "decision_id": "test_decision_456"
    }
    
    # Trigger notification
    result = notify_guardian(decision, escalation_data)
    
    assert result is not None
    assert result["decision_id"] == "test_decision_456"
    assert "methods" in result
    assert result["status"] == "queued"


def test_link_to_guardian_team():
    """Test linking to guardian team"""
    from autonomous_decision import link_to_guardian_team
    
    result = link_to_guardian_team()
    
    assert result is not None
    assert result["guardian_team_issue"] == "https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100"
    assert result["issue_number"] == 100
    assert "primary_guardian" in result
    assert result["primary_guardian"]["github_username"] == "onenoly1010"


def test_handle_guardian_escalation_with_guardian_required():
    """Test complete guardian escalation flow"""
    from autonomous_decision import (
        handle_guardian_escalation,
        DecisionResult,
        DecisionType
    )
    
    # Create a decision that requires guardian approval
    decision = DecisionResult(
        decision_id="test_decision_789",
        decision_type=DecisionType.GUARDIAN_OVERRIDE,
        approved=False,
        confidence=0.80,
        reasoning="Test guardian override",
        actions=["Override action"],
        requires_guardian=True,
        metadata={"priority": "high"}
    )
    
    # Handle escalation
    result = handle_guardian_escalation(decision)
    
    assert result is not None
    assert result["escalated"] is True
    assert "escalation_data" in result
    assert "notification" in result
    assert "guardian_team" in result


def test_handle_guardian_escalation_without_guardian_required():
    """Test escalation flow when guardian not required"""
    from autonomous_decision import (
        handle_guardian_escalation,
        DecisionResult,
        DecisionType
    )
    
    # Create a decision that doesn't require guardian approval
    decision = DecisionResult(
        decision_id="test_decision_999",
        decision_type=DecisionType.MONITORING,
        approved=True,
        confidence=0.90,
        reasoning="Test monitoring decision",
        actions=["Monitor action"],
        requires_guardian=False,
        metadata={"priority": "low"}
    )
    
    # Handle escalation
    result = handle_guardian_escalation(decision)
    
    assert result is not None
    assert result["escalated"] is False
    assert "reason" in result


def test_guardian_monitor_log_escalation():
    """Test logging escalation to metrics"""
    from guardian_monitor import GuardianMonitor
    
    monitor = GuardianMonitor()
    
    escalation_data = {
        "escalation_id": "esc_test_123",
        "decision_id": "test_decision_123",
        "guardian_username": "onenoly1010",
        "escalation_timing": "immediate"
    }
    
    result = monitor.log_escalation_to_metrics(escalation_data)
    
    assert result is not None
    assert result["logged"] is True
    assert "log_entry" in result
    assert result["log_entry"]["type"] == "guardian_escalation"


def test_guardian_monitor_log_escalation_with_endpoint():
    """Test logging escalation with Vercel endpoint"""
    from guardian_monitor import GuardianMonitor
    
    monitor = GuardianMonitor()
    
    escalation_data = {
        "escalation_id": "esc_test_456",
        "decision_id": "test_decision_456",
        "guardian_username": "onenoly1010",
        "escalation_timing": "batched"
    }
    
    vercel_endpoint = "https://example.com/api/metrics"
    
    result = monitor.log_escalation_to_metrics(escalation_data, vercel_endpoint)
    
    assert result is not None
    assert result["logged"] is True
    assert result["endpoint"] == vercel_endpoint


def test_guardian_dashboard_endpoint():
    """Test guardian dashboard API endpoint"""
    # Skip if main module can't be imported (missing dependencies like supabase)
    pytest.importorskip("supabase")
    
    from fastapi.testclient import TestClient
    from main import app
    
    # TestClient handles async endpoints automatically, no need for async test
    client = TestClient(app)
    
    # Call guardian dashboard endpoint
    response = client.get("/api/guardian/dashboard")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "guardian_team" in data
    assert "pending_escalations" in data
    assert "recent_decisions" in data
    assert "monitoring_status" in data
    assert "escalation_endpoint" in data
    assert data["guardian_team"] == "Issue #100 - @onenoly1010"
    assert data["escalation_endpoint"] == "https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100"
