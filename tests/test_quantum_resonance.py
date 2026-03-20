#!/usr/bin/env python3
"""
🧪 QUANTUM RESONANCE LATTICE - TEST SUITE
Comprehensive testing for the Sacred Trinity Architecture
"""

import asyncio
import json
import requests
import websocket
import pytest
import time
from datetime import datetime
from typing import Dict, List

# Test configuration
BASE_URL = "http://localhost:8000"
FLASK_URL = "http://localhost:5000"
GRADIO_URL = "http://localhost:7860"

class QuantumTestSuite:
    """🧪 Sacred test suite for quantum lattice validation"""
    
    def __init__(self):
        self.test_results = []
        
    def log_test_result(self, test_name: str, status: str, details: str = ""):
        """Log test results with quantum ceremony"""
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{emoji} {test_name}: {status}")
        if details:
            print(f"   📋 {details}")
    
    def test_fastapi_quantum_conduit(self) -> bool:
        """Test FastAPI quantum conduit (Port 8000)"""
        try:
            # Test health endpoint
            response = requests.get(f"{BASE_URL}/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test_result("FastAPI Health Check", "PASS", f"Status: {data.get('status')}")
                    return True
                else:
                    self.log_test_result("FastAPI Health Check", "FAIL", "Invalid response format")
                    return False
            else:
                self.log_test_result("FastAPI Health Check", "FAIL", f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test_result("FastAPI Health Check", "FAIL", str(e))
            return False
    
    def test_flask_glyph_weaver(self) -> bool:
        """Test Flask glyph weaver (Port 5000)"""
        try:
            response = requests.get(f"{FLASK_URL}/health", timeout=5)
            if response.status_code == 200:
                self.log_test_result("Flask Health Check", "PASS", "Glyph Weaver operational")
                return True
            else:
                self.log_test_result("Flask Health Check", "FAIL", f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test_result("Flask Health Check", "FAIL", str(e))
            return False
    
    def test_gradio_truth_mirror(self) -> bool:
        """Test Gradio truth mirror (Port 7860)"""
        try:
            response = requests.get(f"{GRADIO_URL}/", timeout=5)
            if response.status_code == 200:
                self.log_test_result("Gradio Health Check", "PASS", "Truth Mirror accessible")
                return True
            else:
                self.log_test_result("Gradio Health Check", "FAIL", f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test_result("Gradio Health Check", "FAIL", str(e))
            return False
    
    def test_websocket_consciousness_stream(self) -> bool:
        """Test WebSocket consciousness streaming"""
        try:
            ws = websocket.WebSocket()
            ws.settimeout(10)
            ws.connect(f"ws://localhost:8000/ws/collective-insight")
            
            # Send test message
            test_message = {
                "type": "test_pulse",
                "timestamp": time.time(),
                "harmony_index": 0.75
            }
            ws.send(json.dumps(test_message))
            
            # Wait for response
            response = ws.recv()
            ws.close()
            
            if response:
                self.log_test_result("WebSocket Stream", "PASS", "Consciousness streaming active")
                return True
            else:
                self.log_test_result("WebSocket Stream", "FAIL", "No response received")
                return False
                
        except Exception as e:
            self.log_test_result("WebSocket Stream", "FAIL", str(e))
            return False
    
    def test_quantum_telemetry_api(self) -> bool:
        """Test quantum telemetry endpoints"""
        try:
            # Test telemetry endpoint
            response = requests.get(f"{BASE_URL}/api/quantum-telemetry", timeout=5)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["harmony_index", "timestamp"]
                
                if all(field in data for field in required_fields):
                    harmony = data.get("harmony_index", 0)
                    self.log_test_result("Quantum Telemetry", "PASS", f"Harmony: {harmony:.3f}")
                    return True
                else:
                    self.log_test_result("Quantum Telemetry", "FAIL", "Missing required fields")
                    return False
            else:
                self.log_test_result("Quantum Telemetry", "FAIL", f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test_result("Quantum Telemetry", "FAIL", str(e))
            return False
    
    def test_ethical_audit_simulation(self) -> bool:
        """Test ethical audit functionality"""
        try:
            # Simulate ethical audit request
            audit_data = {
                "transaction_id": "test_tx_001",
                "amount": 1.5,
                "user_context": "test_user"
            }
            
            response = requests.post(
                f"{BASE_URL}/api/ethical-audit", 
                json=audit_data,
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                if "risk_score" in result and "approved" in result:
                    risk_score = result.get("risk_score", 1.0)
                    approved = result.get("approved", False)
                    self.log_test_result("Ethical Audit", "PASS", f"Risk: {risk_score:.3f}, Approved: {approved}")
                    return True
                else:
                    self.log_test_result("Ethical Audit", "FAIL", "Invalid audit response")
                    return False
            else:
                self.log_test_result("Ethical Audit", "FAIL", f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test_result("Ethical Audit", "FAIL", str(e))
            return False
    
    def test_pi_payment_simulation(self) -> bool:
        """Test Pi Network payment simulation"""
        try:
            payment_data = {
                "payment_id": "test_payment_001",
                "amount": 0.15,
                "boost_percent": 25,
                "user_id": "test_user"
            }
            
            response = requests.post(
                f"{BASE_URL}/api/verify-payment",
                json=payment_data,
                timeout=5
            )
            
            if response.status_code == 200 or response.status_code == 400:  # 400 expected for test data
                self.log_test_result("Pi Payment Simulation", "PASS", "Payment endpoint responsive")
                return True
            else:
                self.log_test_result("Pi Payment Simulation", "FAIL", f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test_result("Pi Payment Simulation", "FAIL", str(e))
            return False
    
    async def run_full_test_suite(self) -> Dict:
        """Run the complete quantum test suite"""
        print("🧪 QUANTUM RESONANCE LATTICE - TEST SUITE EXECUTION")
        print("=" * 60)
        
        # Run all tests
        tests = [
            ("FastAPI Quantum Conduit", self.test_fastapi_quantum_conduit),
            ("Flask Glyph Weaver", self.test_flask_glyph_weaver),
            ("Gradio Truth Mirror", self.test_gradio_truth_mirror),
            ("WebSocket Stream", self.test_websocket_consciousness_stream),
            ("Quantum Telemetry", self.test_quantum_telemetry_api),
            ("Ethical Audit", self.test_ethical_audit_simulation),
            ("Pi Payment", self.test_pi_payment_simulation)
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed_tests += 1
            except Exception as e:
                self.log_test_result(test_name, "ERROR", str(e))
        
        # Generate test summary
        success_rate = (passed_tests / total_tests) * 100
        
        print("\n📊 TEST EXECUTION SUMMARY:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {total_tests - passed_tests}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 85:
            print("🎉 QUANTUM LATTICE: FULLY OPERATIONAL!")
            status = "OPERATIONAL"
        elif success_rate >= 60:
            print("⚠️  QUANTUM LATTICE: PARTIALLY OPERATIONAL")
            status = "PARTIAL"
        else:
            print("❌ QUANTUM LATTICE: REQUIRES ATTENTION")
            status = "DEGRADED"
        
        return {
            "status": status,
            "success_rate": success_rate,
            "passed_tests": passed_tests,
            "total_tests": total_tests,
            "test_results": self.test_results
        }

# Pytest integration
@pytest.mark.asyncio
async def test_quantum_lattice_health():
    """Pytest wrapper for quantum lattice tests"""
    test_suite = QuantumTestSuite()
    results = await test_suite.run_full_test_suite()
    assert results["success_rate"] >= 60, f"Quantum lattice health below threshold: {results['success_rate']}%"

def test_fastapi_individual():
    """Individual FastAPI test"""
    test_suite = QuantumTestSuite()
    assert test_suite.test_fastapi_quantum_conduit(), "FastAPI quantum conduit failed"

def test_flask_individual():
    """Individual Flask test"""
    test_suite = QuantumTestSuite()
    assert test_suite.test_flask_glyph_weaver(), "Flask glyph weaver failed"

def test_websocket_individual():
    """Individual WebSocket test"""
    test_suite = QuantumTestSuite()
    assert test_suite.test_websocket_consciousness_stream(), "WebSocket consciousness stream failed"

# Main execution
if __name__ == "__main__":
    # Run the full test suite
    test_suite = QuantumTestSuite()
    results = asyncio.run(test_suite.run_full_test_suite())
    
    print(f"\n🌌 Quantum Test Suite Complete - Status: {results['status']}")
    print("🚀 Use 'pytest test_quantum_resonance.py' for automated testing")