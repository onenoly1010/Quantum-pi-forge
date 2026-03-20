"""
Integration test for autonomous handover API endpoints
"""

import asyncio
import sys
import os

# Add server directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_autonomous_decision_endpoint():
    """Test autonomous decision API endpoint"""
    print("Testing autonomous decision endpoint...")
    
    response = client.post("/api/autonomous/decision", json={
        "decision_type": "deployment",
        "priority": "medium",
        "parameters": [
            {
                "name": "health_check",
                "value": True,
                "weight": 0.5
            },
            {
                "name": "test_coverage",
                "value": 0.85,
                "threshold": 0.8,
                "weight": 0.5
            }
        ],
        "source": "integration_test"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "decision_id" in data
    assert "approved" in data
    assert "confidence" in data
    assert "actions" in data
    print(f"✅ Decision endpoint: {data['decision_id']}, approved={data['approved']}, confidence={data['confidence']:.2f}")


def test_decision_history_endpoint():
    """Test decision history endpoint"""
    print("Testing decision history endpoint...")
    
    response = client.get("/api/autonomous/decision-history?limit=10")
    
    assert response.status_code == 200
    data = response.json()
    assert "decisions" in data
    assert "count" in data
    print(f"✅ Decision history: {data['count']} decisions retrieved")


def test_decision_metrics_endpoint():
    """Test decision metrics endpoint"""
    print("Testing decision metrics endpoint...")
    
    response = client.get("/api/autonomous/metrics")
    
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    print(f"✅ Decision metrics: {data['metrics']['total_decisions']} total decisions")


def test_health_diagnostics_endpoint():
    """Test health diagnostics endpoint"""
    print("Testing health diagnostics endpoint...")
    
    response = client.get("/api/health/diagnostics")
    
    assert response.status_code == 200
    data = response.json()
    assert "overall_status" in data
    assert "diagnostics" in data
    print(f"✅ Health diagnostics: {data['overall_status']} status")


def test_incident_reports_endpoint():
    """Test incident reports endpoint"""
    print("Testing incident reports endpoint...")
    
    response = client.get("/api/health/incidents?limit=10")
    
    assert response.status_code == 200
    data = response.json()
    assert "incidents" in data
    assert "count" in data
    print(f"✅ Incident reports: {data['count']} incidents")


def test_guardian_monitoring_status():
    """Test guardian monitoring status endpoint"""
    print("Testing guardian monitoring status endpoint...")
    
    response = client.get("/api/guardian/monitoring-status")
    
    assert response.status_code == 200
    data = response.json()
    assert "monitoring_level" in data
    assert "safety_metrics" in data
    print(f"✅ Guardian monitoring: {data['monitoring_level']} level")


def test_validate_decision_endpoint():
    """Test decision validation endpoint"""
    print("Testing decision validation endpoint...")
    
    response = client.post("/api/guardian/validate-decision", params={
        "decision_id": "test_decision_123"
    }, json={
        "decision_type": "deployment",
        "confidence": 0.9,
        "approved": True,
        "requires_guardian": False,
        "metadata": {
            "priority": "medium"
        }
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "validation_id" in data
    assert "status" in data
    assert "checks_passed" in data
    print(f"✅ Decision validation: {data['status']}, {data['checks_passed']} checks passed")


def test_monitoring_status_endpoint():
    """Test monitoring agents status endpoint"""
    print("Testing monitoring agents status endpoint...")
    
    response = client.get("/api/monitoring/status")
    
    assert response.status_code == 200
    data = response.json()
    assert "agents" in data
    assert "total_agents" in data
    print(f"✅ Monitoring status: {data['total_agents']} agents, {data['active_agents']} active")


def test_latest_monitoring_data():
    """Test latest monitoring data endpoint"""
    print("Testing latest monitoring data endpoint...")
    
    response = client.get("/api/monitoring/latest-data?limit=5")
    
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    print(f"✅ Latest monitoring data retrieved")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔍 Testing Autonomous Handover API Endpoints")
    print("="*60 + "\n")
    
    try:
        test_autonomous_decision_endpoint()
        test_decision_history_endpoint()
        test_decision_metrics_endpoint()
        test_health_diagnostics_endpoint()
        test_incident_reports_endpoint()
        test_guardian_monitoring_status()
        test_validate_decision_endpoint()
        test_monitoring_status_endpoint()
        test_latest_monitoring_data()
        
        print("\n" + "="*60)
        print("✅ All API endpoint tests passed!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
