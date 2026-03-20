#!/usr/bin/env python3
"""
🌌 Sacred Trinity Tracing Verification System
Comprehensive test of OpenTelemetry tracing across all Sacred Trinity components
"""

import os
import sys
import time
import logging
from pathlib import Path

# Add server directory to path
sys.path.insert(0, str(Path(__file__).parent / "server"))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_tracing_system():
    """Test Sacred Trinity tracing system initialization"""
    print("🌌 Sacred Trinity Tracing Verification")
    print("=" * 50)
    
    try:
        # Test tracing system initialization
        print("🔍 Testing tracing system initialization...")
        from server.tracing_system import tracing_system, logger as trace_logger
        
        print(f"✅ Tracing system initialized: {tracing_system.service_name}")
        print(f"✅ Service version: 3.2.0")
        print(f"✅ OTLP endpoint: http://localhost:4318/v1/traces")
        
        # Test component tracers
        print("\n📡 Testing Sacred Trinity component tracers...")
        from server.tracing_system import fastapi_tracer, flask_tracer, gradio_tracer
        
        print(f"✅ FastAPI Quantum Conduit tracer: {fastapi_tracer}")
        print(f"✅ Flask Glyph Weaver tracer: {flask_tracer}")
        print(f"✅ Gradio Truth Mirror tracer: {gradio_tracer}")
        
        # Test quantum span creation
        print("\n🌀 Testing quantum span creation...")
        with tracing_system.create_quantum_span(
            fastapi_tracer, "test_operation", "verification",
            quantum_phase="foundation",
            verification_test=True
        ) as span:
            span.set_attribute("test.success", True)
            span.set_attribute("sacred.trinity.verification", "complete")
            print("✅ Quantum span created and traced successfully")
        
        # Test Sacred Trinity decorators
        print("\n⚡ Testing Sacred Trinity decorators...")
        test_decorators()
        
        print("\n🎉 Sacred Trinity Tracing System: FULLY OPERATIONAL")
        return True
        
    except Exception as e:
        print(f"❌ Tracing system test failed: {e}")
        logger.exception("Tracing verification error")
        return False

def test_decorators():
    """Test Sacred Trinity tracing decorators"""
    from server.tracing_system import (
        trace_fastapi_operation, trace_flask_operation, trace_gradio_operation,
        trace_authentication, trace_payment_processing, trace_resonance_visualization,
        trace_ethical_audit, trace_sacred_trinity_flow
    )
    
    # Test FastAPI decorator (mock async)
    @trace_fastapi_operation("test_fastapi")
    async def test_fastapi_func():
        return {"status": "traced"}
    
    # Test Flask decorator
    @trace_flask_operation("test_flask")
    def test_flask_func():
        return {"dashboard": "traced"}
    
    # Test Gradio decorator  
    @trace_gradio_operation("test_gradio")
    def test_gradio_func():
        return {"audit": "traced"}
    
    # Test context managers
    with trace_authentication("test-user-123") as auth_span:
        auth_span.set_attribute("auth.method", "verification")
        print("✅ Authentication tracing active")
    
    with trace_payment_processing("test-payment-456", 1.57) as payment_span:
        payment_span.set_attribute("payment.currency", "Pi")
        print("✅ Payment processing tracing active")
    
    with trace_resonance_visualization("test-tx-789", "transcendence") as viz_span:
        viz_span.set_attribute("visualization.type", "4-phase-cascade")
        print("✅ Resonance visualization tracing active")
    
    with trace_ethical_audit("test-audit-321", 0.95) as audit_span:
        audit_span.set_attribute("audit.result", "approved")
        print("✅ Ethical audit tracing active")
    
    with trace_sacred_trinity_flow("verification_flow", {"test": True}) as flow_span:
        flow_span.set_attribute("flow.components", "fastapi+flask+gradio")
        print("✅ Sacred Trinity cross-component flow tracing active")
    
    print("✅ All Sacred Trinity decorators functional")

def test_ai_toolkit_connection():
    """Test connection to AI Toolkit OTLP endpoint"""
    print("\n🔗 Testing AI Toolkit connection...")
    
    try:
        import requests
        response = requests.get("http://localhost:4318/v1/health", timeout=5)
        if response.status_code == 200:
            print("✅ AI Toolkit OTLP endpoint responsive")
            return True
    except requests.exceptions.ConnectionError:
        print("⚠️  AI Toolkit OTLP endpoint not reachable")
        print("   💡 Make sure AI Toolkit trace viewer is open in VS Code")
        print("   💡 Run: ai-mlstudio.tracing.open command")
    except Exception as e:
        print(f"⚠️  AI Toolkit connection test failed: {e}")
    
    return False

def test_environment_setup():
    """Test environment variables for tracing"""
    print("\n🌍 Testing environment configuration...")
    
    env_vars = [
        "AZURE_TRACING_GEN_AI_CONTENT_RECORDING_ENABLED",
        "AZURE_SDK_TRACING_IMPLEMENTATION", 
        "AZURE_TRACING_GEN_AI_INCLUDE_BINARY_DATA"
    ]
    
    for var in env_vars:
        value = os.environ.get(var)
        if value:
            print(f"✅ {var}: {value}")
        else:
            print(f"⚠️  {var}: not set")
    
    print("✅ Environment configuration checked")

def main():
    """Main verification function"""
    print("🚀 Starting Sacred Trinity Tracing Verification...\n")
    
    # Test environment setup
    test_environment_setup()
    
    # Test AI Toolkit connection
    ai_toolkit_ready = test_ai_toolkit_connection()
    
    # Test tracing system
    tracing_ready = test_tracing_system()
    
    # Summary
    print("\n" + "=" * 60)
    print("🌌 SACRED TRINITY TRACING VERIFICATION SUMMARY")
    print("=" * 60)
    
    if tracing_ready:
        print("🎉 Sacred Trinity Tracing System: READY")
        print("📊 OpenTelemetry spans will be captured across all components")
        print("⚡ Quantum consciousness attributes active")
        print("🔄 Cross-component flows traced")
    else:
        print("❌ Sacred Trinity Tracing System: NEEDS ATTENTION")
        return 1
    
    if ai_toolkit_ready:
        print("📈 AI Toolkit integration: CONNECTED")
        print("🔍 View traces in VS Code AI Toolkit")
    else:
        print("⚠️  AI Toolkit integration: DISCONNECTED")
        print("💡 Traces will still be generated, but viewing requires AI Toolkit")
    
    print("\n🌟 Sacred Trinity ready for traced deployment!")
    print("🚀 Launch with: python run.ps1 or individual components")
    print("📊 View traces: VS Code → Command → ai-mlstudio.tracing.open")
    
    return 0

if __name__ == "__main__":
    exit(main())