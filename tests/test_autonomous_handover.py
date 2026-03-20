"""
Tests for Autonomous Handover Capability
Tests for autonomous decision, self-healing, guardian monitoring, and monitoring agents systems.
"""

import pytest
import asyncio
import time
from unittest.mock import Mock, patch

# Test autonomous_decision module
def test_autonomous_decision_import():
    """Test that autonomous_decision module can be imported"""
    from server.autonomous_decision import (
        get_decision_matrix,
        DecisionContext,
        DecisionParameter,
        DecisionType,
        DecisionPriority,
        AIDecisionMatrix
    )
    assert get_decision_matrix is not None
    assert AIDecisionMatrix is not None


def test_decision_matrix_creation():
    """Test AI decision matrix creation"""
    from server.autonomous_decision import AIDecisionMatrix
    
    matrix = AIDecisionMatrix()
    assert matrix is not None
    assert len(matrix.decision_history) == 0
    assert len(matrix.decision_rules) > 0


def test_make_decision_deployment():
    """Test making a deployment decision"""
    from server.autonomous_decision import (
        AIDecisionMatrix,
        DecisionContext,
        DecisionParameter,
        DecisionType,
        DecisionPriority
    )
    
    matrix = AIDecisionMatrix()
    
    context = DecisionContext(
        decision_type=DecisionType.DEPLOYMENT,
        priority=DecisionPriority.MEDIUM,
        parameters=[
            DecisionParameter(name="health_check", value=True, weight=0.4),
            DecisionParameter(name="test_coverage", value=0.85, threshold=0.8, weight=0.3),
            DecisionParameter(name="security_scan", value=True, weight=0.3)
        ],
        source="test_suite"
    )
    
    result = matrix.make_decision(context)
    
    assert result is not None
    assert result.decision_type == DecisionType.DEPLOYMENT
    assert result.confidence >= 0.0 and result.confidence <= 1.0
    assert len(result.actions) > 0
    assert len(matrix.decision_history) == 1


def test_decision_requires_guardian():
    """Test that high priority decisions require guardian approval"""
    from server.autonomous_decision import (
        AIDecisionMatrix,
        DecisionContext,
        DecisionType,
        DecisionPriority
    )
    
    matrix = AIDecisionMatrix()
    
    context = DecisionContext(
        decision_type=DecisionType.ROLLBACK,
        priority=DecisionPriority.CRITICAL,
        parameters=[],
        source="test_suite"
    )
    
    result = matrix.make_decision(context)
    
    assert result.requires_guardian == True


def test_decision_metrics():
    """Test decision metrics calculation"""
    from server.autonomous_decision import (
        AIDecisionMatrix,
        DecisionContext,
        DecisionType,
        DecisionPriority
    )
    
    matrix = AIDecisionMatrix()
    
    # Make several decisions
    for i in range(5):
        context = DecisionContext(
            decision_type=DecisionType.MONITORING,
            priority=DecisionPriority.LOW,
            parameters=[],
            source="test_suite"
        )
        matrix.make_decision(context)
    
    metrics = matrix.get_decision_metrics()
    
    assert metrics["total_decisions"] == 5
    assert "approval_rate" in metrics
    assert "average_confidence" in metrics
    assert "by_type" in metrics


# Test self_healing module
def test_self_healing_import():
    """Test that self_healing module can be imported"""
    from server.self_healing import (
        get_healing_system,
        SelfHealingSystem,
        IncidentSeverity,
        HealthStatus
    )
    assert get_healing_system is not None
    assert SelfHealingSystem is not None


def test_healing_system_creation():
    """Test self-healing system creation"""
    from server.self_healing import SelfHealingSystem
    
    system = SelfHealingSystem()
    assert system is not None
    assert len(system.diagnostic_checks) > 0
    assert len(system.healing_actions) > 0


def test_run_diagnostics():
    """Test running system diagnostics"""
    from server.self_healing import SelfHealingSystem
    
    system = SelfHealingSystem()
    results = system.run_diagnostics()
    
    assert len(results) > 0
    for result in results:
        assert result.check_name is not None
        assert result.status is not None
        assert result.message is not None


def test_system_health():
    """Test getting system health status"""
    from server.self_healing import SelfHealingSystem
    
    system = SelfHealingSystem()
    health = system.get_system_health()
    
    assert "overall_status" in health
    assert "diagnostics" in health
    assert "recent_incidents" in health
    assert "total_incidents" in health


def test_incident_filtering():
    """Test incident report filtering"""
    from server.self_healing import SelfHealingSystem, IncidentSeverity
    
    system = SelfHealingSystem()
    
    # Run diagnostics to generate some incidents
    system.run_diagnostics()
    
    # Get all incidents
    all_incidents = system.get_incident_report()
    
    # Test filtering by severity
    critical = system.get_incident_report(severity=IncidentSeverity.CRITICAL)
    
    # Both should be lists
    assert isinstance(all_incidents, list)
    assert isinstance(critical, list)


# Test guardian_monitor module
def test_guardian_monitor_import():
    """Test that guardian_monitor module can be imported"""
    from server.guardian_monitor import (
        get_guardian_monitor,
        GuardianMonitor,
        ValidationStatus,
        MonitoringLevel
    )
    assert get_guardian_monitor is not None
    assert GuardianMonitor is not None


def test_guardian_monitor_creation():
    """Test guardian monitor creation"""
    from server.guardian_monitor import GuardianMonitor
    
    monitor = GuardianMonitor()
    assert monitor is not None
    assert len(monitor.safety_metrics) > 0
    assert monitor.monitoring_level is not None


def test_validate_decision():
    """Test decision validation"""
    from server.guardian_monitor import GuardianMonitor
    
    monitor = GuardianMonitor()
    
    decision_data = {
        "decision_type": "deployment",
        "confidence": 0.9,
        "approved": True,
        "requires_guardian": False,
        "metadata": {
            "priority": "medium"
        }
    }
    
    result = monitor.validate_decision("test_decision_1", decision_data)
    
    assert result is not None
    assert result.validation_id is not None
    assert result.checks_passed >= 0
    assert result.checks_failed >= 0
    assert len(result.details) > 0


def test_guardian_override():
    """Test guardian decision override"""
    from server.guardian_monitor import GuardianMonitor
    
    monitor = GuardianMonitor()
    
    decision = monitor.guardian_override_decision(
        original_decision_id="test_decision_1",
        action="approve",
        reasoning="Manual review completed",
        guardian_id="guardian_001"
    )
    
    assert decision is not None
    assert decision.action == "approve"
    assert decision.guardian_id == "guardian_001"
    assert len(monitor.guardian_decisions) == 1


def test_monitoring_level_update():
    """Test monitoring level update"""
    from server.guardian_monitor import GuardianMonitor, MonitoringLevel
    
    monitor = GuardianMonitor()
    
    initial_level = monitor.monitoring_level
    monitor.update_monitoring_level(MonitoringLevel.HIGH, "Test escalation")
    
    assert monitor.monitoring_level == MonitoringLevel.HIGH
    assert monitor.monitoring_level != initial_level


def test_safety_metric_update():
    """Test safety metric update"""
    from server.guardian_monitor import GuardianMonitor
    
    monitor = GuardianMonitor()
    
    monitor.update_safety_metric("transaction_safety", 0.85)
    
    metric = monitor.safety_metrics.get("transaction_safety")
    assert metric is not None
    assert metric.value == 0.85


# Test monitoring_agents module
def test_monitoring_agents_import():
    """Test that monitoring_agents module can be imported"""
    from server.monitoring_agents import (
        get_monitoring_system,
        MonitoringAgentSystem,
        AgentStatus,
        MetricType
    )
    assert get_monitoring_system is not None
    assert MonitoringAgentSystem is not None


def test_monitoring_system_creation():
    """Test monitoring agent system creation"""
    from server.monitoring_agents import MonitoringAgentSystem
    
    system = MonitoringAgentSystem()
    assert system is not None
    assert len(system.agents) > 0


def test_system_status():
    """Test getting monitoring system status"""
    from server.monitoring_agents import MonitoringAgentSystem
    
    system = MonitoringAgentSystem()
    status = system.get_system_status()
    
    assert "agents" in status
    assert "total_agents" in status
    assert "active_agents" in status
    assert status["total_agents"] > 0


def test_get_agent():
    """Test getting specific monitoring agent"""
    from server.monitoring_agents import MonitoringAgentSystem
    
    system = MonitoringAgentSystem()
    
    perf_agent = system.get_agent("performance")
    assert perf_agent is not None
    assert perf_agent.agent_id == "performance_monitor"


def test_vercel_endpoint_config():
    """Test Vercel endpoint configuration"""
    from server.monitoring_agents import MonitoringAgentSystem
    
    system = MonitoringAgentSystem()
    
    test_endpoint = "https://example.vercel.app/api/autonomous-metrics"
    system.configure_vercel_endpoint(test_endpoint)
    
    assert system.vercel_endpoint == test_endpoint


@pytest.mark.asyncio
async def test_report_to_vercel():
    """Test reporting metrics to Vercel"""
    from server.monitoring_agents import MonitoringAgentSystem
    
    system = MonitoringAgentSystem()
    
    # Mock the HTTP call
    with patch('aiohttp.ClientSession') as mock_session:
        mock_response = Mock()
        mock_response.status = 200
        mock_session.return_value.__aenter__.return_value.post.return_value.__aenter__.return_value = mock_response
        
        system.configure_vercel_endpoint("https://example.vercel.app/api/autonomous-metrics")
        
        test_metrics = {
            "test_metric": "value",
            "timestamp": time.time()
        }
        
        await system.report_to_vercel(test_metrics)
        
        # Verify no exceptions were raised
        assert True


# Integration tests
@pytest.mark.asyncio
async def test_full_autonomous_workflow():
    """Test full autonomous decision workflow with all systems"""
    from server.autonomous_decision import (
        AIDecisionMatrix,
        DecisionContext,
        DecisionParameter,
        DecisionType,
        DecisionPriority
    )
    from server.guardian_monitor import GuardianMonitor
    from server.self_healing import SelfHealingSystem
    
    # Create systems
    decision_matrix = AIDecisionMatrix()
    guardian = GuardianMonitor()
    healing = SelfHealingSystem()
    
    # Make a decision
    context = DecisionContext(
        decision_type=DecisionType.HEALING,
        priority=DecisionPriority.HIGH,
        parameters=[
            DecisionParameter(name="error_rate", value=0.02, threshold=0.05, weight=0.5),
            DecisionParameter(name="auto_heal_capable", value=True, weight=0.5)
        ],
        source="integration_test"
    )
    
    decision = decision_matrix.make_decision(context)
    assert decision is not None
    
    # Validate the decision
    decision_data = {
        "decision_type": decision.decision_type.value,
        "confidence": decision.confidence,
        "approved": decision.approved,
        "requires_guardian": decision.requires_guardian,
        "metadata": decision.metadata
    }
    
    validation = guardian.validate_decision(decision.decision_id, decision_data)
    assert validation is not None
    
    # Run diagnostics
    health = healing.get_system_health()
    assert health is not None
    assert "overall_status" in health


def test_decision_history_retrieval():
    """Test retrieving decision history"""
    from server.autonomous_decision import (
        AIDecisionMatrix,
        DecisionContext,
        DecisionType,
        DecisionPriority
    )
    
    matrix = AIDecisionMatrix()
    
    # Make several decisions of different types
    for decision_type in [DecisionType.DEPLOYMENT, DecisionType.SCALING, DecisionType.MONITORING]:
        context = DecisionContext(
            decision_type=decision_type,
            priority=DecisionPriority.MEDIUM,
            parameters=[],
            source="test_suite"
        )
        matrix.make_decision(context)
    
    # Get all history
    all_history = matrix.get_decision_history()
    assert len(all_history) == 3
    
    # Get filtered history
    deployment_history = matrix.get_decision_history(DecisionType.DEPLOYMENT)
    assert len(deployment_history) == 1
    assert deployment_history[0].decision_type == DecisionType.DEPLOYMENT


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
