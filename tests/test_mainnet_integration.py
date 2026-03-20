#!/usr/bin/env python3
"""
🌌 MAINNET INTEGRATION TEST SUITE
Comprehensive tests for Pi Forge Quantum Genesis mainnet features
"""

import pytest
import asyncio
import time
import sys
from pathlib import Path

# Add server directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "server"))


class TestMainnetIntegration:
    """Tests for Pi Network mainnet integration"""
    
    def test_pi_network_config_initialization(self):
        """Test Pi Network configuration loads correctly"""
        from main import PI_NETWORK_CONFIG
        
        assert PI_NETWORK_CONFIG is not None
        assert "network" in PI_NETWORK_CONFIG
        assert "api_key" in PI_NETWORK_CONFIG
        assert "app_id" in PI_NETWORK_CONFIG
        assert PI_NETWORK_CONFIG["network"] in ["mainnet", "testnet"]
    
    def test_mainnet_mode_default(self, monkeypatch):
        """Test that mainnet is the default network mode"""
        # Safely remove PI_NETWORK_MODE for this test
        monkeypatch.delenv("PI_NETWORK_MODE", raising=False)
        
        # Re-import to get fresh config
        import importlib
        import main
        importlib.reload(main)
        
        assert main.PI_NETWORK_CONFIG["network"] == "mainnet"


class TestCyberSamuraiGuardian:
    """Tests for Cyber Samurai Guardian monitoring system"""
    
    def test_guardian_initialization(self):
        """Test guardian initializes with correct defaults"""
        from main import CyberSamuraiGuardian
        
        guardian = CyberSamuraiGuardian()
        
        assert guardian.latency_threshold_ns == 5
        assert guardian.guardian_active is True
        assert guardian.harmonic_stability > 0
        assert len(guardian.alerts) == 0
    
    def test_guardian_latency_check(self):
        """Test guardian latency monitoring"""
        from main import CyberSamuraiGuardian
        
        guardian = CyberSamuraiGuardian()
        result = guardian.check_latency()
        
        assert "latency_ns" in result
        assert "threshold_ns" in result
        assert "within_threshold" in result
        assert "harmonic_stability" in result
        assert result["threshold_ns"] == 5
        assert isinstance(result["latency_ns"], float)
    
    def test_guardian_status(self):
        """Test guardian comprehensive status"""
        from main import CyberSamuraiGuardian
        
        guardian = CyberSamuraiGuardian()
        status = guardian.get_status()
        
        assert "guardian_active" in status
        assert "latency" in status
        assert "total_alerts" in status
        assert "quantum_coherence" in status
        assert status["guardian_active"] is True


class TestPaymentVerification:
    """Tests for payment verification functionality"""
    
    def test_payment_verification_model(self):
        """Test payment verification request model"""
        from main import PaymentVerification
        
        payment = PaymentVerification(
            payment_id="test_123",
            amount=0.15,
            metadata={"type": "mining_boost"}
        )
        
        assert payment.payment_id == "test_123"
        assert payment.amount == 0.15
        assert payment.metadata["type"] == "mining_boost"
    
    def test_payment_verification_amount_validation(self):
        """Test that payment amount must be positive"""
        from main import PaymentVerification
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            PaymentVerification(payment_id="test", amount=-1)


class TestEthicalAudit:
    """Tests for ethical audit functionality"""
    
    def test_ethical_audit_model(self):
        """Test ethical audit request model"""
        from main import EthicalAuditRequest
        
        audit = EthicalAuditRequest(
            transaction_id="tx_001",
            amount=100.0,
            user_context="test_user"
        )
        
        assert audit.transaction_id == "tx_001"
        assert audit.amount == 100.0
        assert audit.user_context == "test_user"
    
    def test_ethical_audit_with_contract(self):
        """Test ethical audit with smart contract code"""
        from main import EthicalAuditRequest
        
        audit = EthicalAuditRequest(
            transaction_id="tx_002",
            amount=50.0,
            contract_code="pragma solidity ^0.8.0;"
        )
        
        assert audit.contract_code is not None


class TestGovernance:
    """Tests for governance simulation functionality"""
    
    def test_governance_proposal_model(self):
        """Test governance proposal model validation"""
        from main import GovernanceProposal
        
        proposal = GovernanceProposal(
            title="Test Proposal",
            description="This is a test proposal with sufficient description",
            proposal_type="parameter_change",
            required_stake=100.0,
            voting_period_days=7
        )
        
        assert proposal.title == "Test Proposal"
        assert proposal.proposal_type == "parameter_change"
        assert proposal.voting_period_days == 7
    
    def test_governance_proposal_type_validation(self):
        """Test that proposal type must be valid"""
        from main import GovernanceProposal
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            GovernanceProposal(
                title="Test",
                description="This is a test proposal",
                proposal_type="invalid_type"
            )
    
    def test_governance_proposal_title_length(self):
        """Test proposal title minimum length"""
        from main import GovernanceProposal
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            GovernanceProposal(
                title="Hi",  # Too short
                description="Valid description here with enough text",
                proposal_type="parameter_change"
            )


class TestSmartContractAudit:
    """Tests for smart contract audit functionality"""
    
    def test_smart_contract_audit_model(self):
        """Test smart contract audit model"""
        from main import SmartContractAudit
        
        audit = SmartContractAudit(
            contract_code="pragma solidity ^0.8.0; contract Test {}",
            contract_name="TestContract",
            audit_depth="standard"
        )
        
        assert audit.contract_name == "TestContract"
        assert audit.audit_depth == "standard"
    
    def test_audit_depth_validation(self):
        """Test audit depth must be valid"""
        from main import SmartContractAudit
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            SmartContractAudit(
                contract_code="test code",
                contract_name="Test",
                audit_depth="invalid_depth"
            )


class TestFlaskVisualization:
    """Tests for Flask visualization engine"""
    
    def test_quantum_engine_initialization(self):
        """Test quantum engine initializes correctly"""
        from app import QuantumEngine
        
        engine = QuantumEngine()
        
        assert len(engine.collective_wisdom) == 0
        assert "sage" in engine.archetype_reservoirs
        assert "guardian" in engine.archetype_reservoirs
    
    def test_quantum_engine_process_engagement(self):
        """Test quantum engine processes engagement"""
        from app import QuantumEngine
        
        engine = QuantumEngine()
        result = engine.process_pioneer_engagement({"query": "test"})
        
        assert "timestamp" in result
        assert "resonance" in result
        assert "archetype" in result
        assert 0.5 <= result["resonance"] <= 1.0
        assert len(engine.collective_wisdom) == 1
    
    def test_veiled_vow_engine_initialization(self):
        """Test Veiled Vow engine initializes correctly"""
        from app import VeiledVowEngine
        
        engine = VeiledVowEngine()
        
        assert engine.coherence_score == 750
        assert engine.total_coherence == 1247891
        assert len(engine.ledger_entries) == 0
    
    def test_veiled_vow_archetype_distribution(self):
        """Test archetype distribution returns valid data"""
        from app import VeiledVowEngine
        
        engine = VeiledVowEngine()
        distribution = engine.distribute_archetypal_wisdom()
        
        assert "sage" in distribution
        assert "explorer" in distribution
        assert "creator" in distribution
        assert "guardian" in distribution
        assert all(v > 0 for v in distribution.values())


class TestTracingSystem:
    """Tests for tracing system functionality"""
    
    def test_tracing_system_lazy_initialization(self):
        """Test tracing system initializes lazily"""
        from tracing_system import get_tracing_system
        
        _, _, _, _ = get_tracing_system()
        
        # System should initialize (may be None if OTLP not available)
        # but function should not raise
        assert True
    
    def test_trace_decorators_exist(self):
        """Test trace decorators are importable"""
        from tracing_system import (
            trace_fastapi_operation,
            trace_flask_operation,
            trace_gradio_operation
        )
        
        assert callable(trace_fastapi_operation)
        assert callable(trace_flask_operation)
        assert callable(trace_gradio_operation)
    
    def test_trace_helpers_exist(self):
        """Test trace helper functions are importable"""
        from tracing_system import (
            trace_authentication,
            trace_payment_processing,
            trace_ethical_audit,
            trace_websocket_broadcast
        )
        
        assert callable(trace_authentication)
        assert callable(trace_payment_processing)
        assert callable(trace_ethical_audit)
        assert callable(trace_websocket_broadcast)


class TestFastAPIEndpoints:
    """Tests for FastAPI endpoint configurations"""
    
    def test_app_initialization(self):
        """Test FastAPI app initializes correctly"""
        from main import app
        
        assert app.title == "QVM 3.0 Supabase Resonance Bridge"
        assert app.version == "3.3.0"
    
    def test_app_routes_registered(self):
        """Test that key routes are registered"""
        from main import app
        
        route_paths = [route.path for route in app.routes]
        
        assert "/" in route_paths
        assert "/health" in route_paths
        assert "/api/guardian/status" in route_paths
        assert "/api/pi-network/status" in route_paths


# Performance Tests
class TestPerformance:
    """Tests for performance benchmarks"""
    
    def test_guardian_latency_check_performance(self):
        """Test guardian latency check is fast"""
        from main import CyberSamuraiGuardian
        
        guardian = CyberSamuraiGuardian()
        
        start = time.perf_counter_ns()
        for _ in range(1000):
            guardian.check_latency()
        elapsed_ns = time.perf_counter_ns() - start
        
        avg_ns_per_call = elapsed_ns / 1000
        # Should be less than 1ms per call
        assert avg_ns_per_call < 1_000_000


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
