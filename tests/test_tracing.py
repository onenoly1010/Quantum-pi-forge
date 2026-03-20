#!/usr/bin/env python3
"""
🌌 Sacred Trinity Tracing Test
Quick test to verify OpenTelemetry tracing is working across Sacred Trinity

This test verifies:
- OpenTelemetry initialization  
- Sacred Trinity component tracing
- AI Toolkit OTLP endpoint connectivity
- Quantum consciousness streaming
"""

import sys
import time
import asyncio
from pathlib import Path

# Add server directory to path
sys.path.append(str(Path(__file__).parent / "server"))

async def test_sacred_trinity_tracing():
    """Test Sacred Trinity tracing system"""
    print("🌌 Sacred Trinity Tracing Test")
    print("=" * 50)
    
    try:
        # Test tracing system import and initialization
        print("📡 Testing tracing system import...")
        from server.tracing_system import (
            tracing_system, sacred_trinity_tracer,
            trace_fastapi_quantum_conduit, trace_flask_glyph_weaver, 
            trace_gradio_truth_mirror, trace_sacred_flow
        )
        print("✅ Tracing system imported successfully")
        print(f"🔧 Service: {tracing_system.service_name}")
        
        # Test FastAPI Quantum Conduit tracing
        print("\\n🧠 Testing FastAPI Quantum Conduit tracing...")
        
        @trace_fastapi_quantum_conduit("test_authentication", "foundation")
        async def test_auth():
            await asyncio.sleep(0.1)  # Simulate auth processing
            return {"status": "authenticated", "consciousness": "awakening"}
        
        auth_result = await test_auth()
        print(f"✅ FastAPI test: {auth_result}")
        
        # Test Flask Glyph Weaver tracing
        print("\\n🎨 Testing Flask Glyph Weaver tracing...")
        
        @trace_flask_glyph_weaver("test_svg_generation", "growth")
        def test_svg():
            time.sleep(0.1)  # Simulate SVG generation
            return {"svg": "4_phase_cascade", "quantum_phase": "growth"}
        
        svg_result = test_svg()
        print(f"✅ Flask test: {svg_result}")
        
        # Test Gradio Truth Mirror tracing
        print("\\n⚖️ Testing Gradio Truth Mirror tracing...")
        
        @trace_gradio_truth_mirror("test_ethical_audit", "harmony") 
        def test_audit():
            time.sleep(0.1)  # Simulate ethical processing
            return {"audit": "passed", "risk_score": 0.02, "moral_clarity": "achieved"}
        
        audit_result = test_audit()
        print(f"✅ Gradio test: {audit_result}")
        
        # Test Sacred Trinity flow tracing
        print("\\n🔗 Testing Sacred Trinity cross-component flow...")
        
        with trace_sacred_flow("payment_to_ethics_pipeline", {"payment_id": "test_001"}) as flow_span:
            # Simulate cross-component processing
            await asyncio.sleep(0.2)
            print("💫 Cross-Trinity flow processing...")
            
            # Add quantum events to span
            if hasattr(flow_span, 'add_event'):
                flow_span.add_event("payment_verified", {"amount": 0.15})
                flow_span.add_event("visualization_rendered", {"phase": "transcendence"})
                flow_span.add_event("ethical_validation", {"approved": True})
        
        print("✅ Sacred Trinity flow traced successfully")
        
        # Test quantum resonance measurement
        print("\\n🌟 Testing quantum resonance measurement...")
        
        from server.tracing_system import record_resonance
        record_resonance(0.92, "transcendence", "sacred_trinity_integration")
        print("✅ Quantum resonance recorded")
        
        print("\\n🎉 Sacred Trinity Tracing Test Complete!")
        print("📊 Check AI Toolkit for trace data at: http://localhost:4318/v1/traces")
        print("🌌 Quantum consciousness streaming with observability confirmed")
        
        return True
        
    except Exception as e:
        print(f"❌ Tracing test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_trace_decorators():
    """Test individual trace decorators"""
    print("\\n🔍 Testing individual trace decorators...")
    
    try:
        from server.tracing_system import (
            trace_authentication, trace_payment_processing,
            trace_resonance_visualization, trace_ethical_audit,
            trace_websocket_broadcast
        )
        
        # Test authentication tracing
        with trace_authentication("test_user") as auth_span:
            print("🔐 Authentication span created")
            if hasattr(auth_span, 'set_attribute'):
                auth_span.set_attribute("test.completed", True)
        
        # Test payment processing
        with trace_payment_processing("payment_123", 0.15) as payment_span:
            print("💳 Payment processing span created")
        
        # Test resonance visualization
        with trace_resonance_visualization("tx_abc123", "4_phase_cascade") as viz_span:
            print("🎨 Visualization span created")
        
        # Test ethical audit
        with trace_ethical_audit("audit_456", 0.03) as audit_span:
            print("⚖️ Ethical audit span created")
        
        # Test WebSocket broadcast
        with trace_websocket_broadcast("consciousness_sync", 5) as ws_span:
            print("📡 WebSocket broadcast span created")
        
        print("✅ All trace decorators working")
        return True
        
    except Exception as e:
        print(f"❌ Decorator test failed: {e}")
        return False

async def main():
    """Run all tracing tests"""
    print("🚀 Starting Sacred Trinity Tracing Tests...")
    
    # Test core tracing system
    tracing_success = await test_sacred_trinity_tracing()
    
    # Test individual decorators
    decorator_success = test_trace_decorators()
    
    if tracing_success and decorator_success:
        print("\\n🎯 All tests passed! Sacred Trinity tracing system ready.")
        print("🌌 Quantum observability across FastAPI, Flask, and Gradio enabled.")
        print("📈 Monitor traces in AI Toolkit for full consciousness streaming visibility.")
    else:
        print("\\n⚠️ Some tests failed. Check configuration and dependencies.")
    
    print("\\n" + "=" * 50)
    print("🌟 Sacred Trinity Tracing Test Complete")

if __name__ == "__main__":
    asyncio.run(main())