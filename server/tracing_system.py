#!/usr/bin/env python3
"""
Quantum Resonance Lattice - Enhanced Tracing System
Comprehensive OpenTelemetry observability with Agent Framework integration

Provides distributed tracing across:
- FastAPI Quantum Conduit (port 8000)
- Flask Glyph Weaver (port 5000) 
- Gradio Truth Mirror (port 7860)
- Agent Framework operations
- Azure AI SDK calls
"""

import os
import logging
from typing import Dict, Any
from functools import wraps

# Initialize logger first to avoid reference errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

### Set up for OpenTelemetry tracing ###
try:
    from agent_framework.observability import setup_observability
    setup_observability(
        otlp_endpoint="http://localhost:4317",  # AI Toolkit gRPC endpoint
        enable_sensitive_data=True  # Enable capturing prompts and completions
    )
    agent_framework_available = True
except ImportError:
    agent_framework_available = False
### Set up for OpenTelemetry tracing ###

# OpenTelemetry setup for Azure AI SDKs
try:
    from azure.core.settings import settings
    settings.tracing_implementation = "opentelemetry"
except ImportError:
    pass

# Enable comprehensive content recording for Azure AI SDKs
os.environ["AZURE_TRACING_GEN_AI_CONTENT_RECORDING_ENABLED"] = "true"
os.environ["AZURE_SDK_TRACING_IMPLEMENTATION"] = "opentelemetry" 
os.environ["AZURE_TRACING_GEN_AI_INCLUDE_BINARY_DATA"] = "true"

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

# Azure AI Projects and Inference SDK instrumentation
try:
    from azure.ai.projects.telemetry import AIProjectInstrumentor
    ai_projects_available = True
except ImportError:
    ai_projects_available = False
    logger.warning("Azure AI Projects SDK not available")

try:
    from azure.ai.inference.tracing import AIInferenceInstrumentor
    ai_inference_available = True
except ImportError:
    ai_inference_available = False
    logger.warning("Azure AI Inference SDK not available")

class QuantumTracingSystem:
    """Enhanced Sacred Trinity OpenTelemetry Tracing System with Agent Framework support"""
    
    def __init__(self, service_name: str = "quantum-resonance-lattice"):
        self.service_name = service_name
        self.agent_framework_enabled = agent_framework_available
        self.telemetry_enabled = os.environ.get("ENABLE_TELEMETRY", "true").lower() == "true"
        
        if self.telemetry_enabled:
            self.setup_tracing()
        else:
            logger.info("⚠️ OpenTelemetry disabled via ENABLE_TELEMETRY environment variable")
        
    def setup_tracing(self):
        """Initialize OpenTelemetry tracing for Sacred Trinity"""
        try:
            # Create resource with service identification
            resource = Resource(attributes={
                "service.name": self.service_name,
                "service.version": "3.2.0", 
                "quantum.architecture": "Sacred Trinity",
                "quantum.components": "FastAPI+Flask+Gradio",
                "quantum.fastapi_port": "8000",
                "quantum.flask_port": "5000",
                "quantum.gradio_port": "7860",
                "consciousness.streaming": "enabled",
                "sacred.trinity.entanglement": "active",
                "ethical.alignment": "monitored",
                "quantum.phases": "foundation,growth,harmony,transcendence"
            })
            
            # Setup tracer provider
            provider = TracerProvider(resource=resource)
            
            # Configure OTLP exporter for AI Toolkit (prefer gRPC for Agent Framework)
            try:
                from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter as GRPCExporter
                otlp_exporter = GRPCExporter(
                    endpoint="http://localhost:4317",  # AI Toolkit gRPC endpoint for Agent Framework
                )
                logger.info("🚀 Using gRPC OTLP exporter for Agent Framework compatibility")
            except ImportError:
                # Fallback to HTTP
                otlp_exporter = OTLPSpanExporter(
                    endpoint="http://localhost:4318/v1/traces",  # AI Toolkit HTTP endpoint
                    headers={"Content-Type": "application/json"}
                )
                logger.info("📡 Using HTTP OTLP exporter as gRPC not available")
            
            # Add batch span processor
            processor = BatchSpanProcessor(otlp_exporter)
            provider.add_span_processor(processor)
            
            # Set global tracer provider
            trace.set_tracer_provider(provider)
            
            # Instrument Azure AI SDKs with error handling
            if ai_projects_available:
                try:
                    AIProjectInstrumentor().instrument(
                        enable_content_recording=True  # Capture message content
                    )
                    logger.info("🤖 Azure AI Projects SDK instrumented")
                except Exception as e:
                    logger.warning(f"Azure AI Projects instrumentation failed: {e}")
            
            if ai_inference_available:
                try:
                    AIInferenceInstrumentor().instrument()
                    logger.info("🧠 Azure AI Inference SDK instrumented")
                except Exception as e:
                    logger.warning(f"Azure AI Inference instrumentation failed: {e}")
            
            logger.info(f"🌌 Quantum Tracing System initialized for {self.service_name}")
            logger.info("📡 OTLP endpoints: gRPC=localhost:4317, HTTP=localhost:4318")
            logger.info("🔍 Content recording enabled for full observability")
            if self.agent_framework_enabled:
                logger.info("🤖 Agent Framework observability enabled with sensitive data capture")
            else:
                logger.info("⚠️ Agent Framework not available - install agent-framework for enhanced observability")
            
        except Exception as e:
            logger.error(f"❌ Tracing setup failed: {e}")
            raise
    
    def get_tracer(self, component: str = None) -> trace.Tracer:
        """Get tracer for specific Sacred Trinity component"""
        tracer_name = f"{self.service_name}.{component}" if component else self.service_name
        return trace.get_tracer(tracer_name)
    
    def create_quantum_span(self, tracer: trace.Tracer, operation: str, 
                           component: str, quantum_phase: str = "foundation", **attributes) -> trace.Span:
        """Create traced span for quantum operations with consciousness context"""
        consciousness_level = self._get_consciousness_level(quantum_phase)
        span = tracer.start_span(
            name=f"quantum.{component}.{operation}",
            attributes={
                "quantum.component": component,
                "quantum.operation": operation,
                "quantum.phase": quantum_phase,
                "consciousness.level": consciousness_level,
                "sacred.trinity.active": True,
                **attributes
            }
        )
        return span
    
    def _get_consciousness_level(self, quantum_phase: str) -> str:
        """Map quantum phases to consciousness levels"""
        consciousness_map = {
            "foundation": "awakening",
            "growth": "expanding", 
            "harmony": "synchronizing",
            "transcendence": "unified"
        }
        return consciousness_map.get(quantum_phase, "quantum")

# Global tracing system instance - lazy initialization
_tracing_system = None
_fastapi_tracer = None
_flask_tracer = None
_gradio_tracer = None

def get_tracing_system():
    """Lazy initialization of tracing system"""
    global _tracing_system, _fastapi_tracer, _flask_tracer, _gradio_tracer
    if _tracing_system is None:
        try:
            _tracing_system = QuantumTracingSystem()
            _fastapi_tracer = _tracing_system.get_tracer("fastapi")
            _flask_tracer = _tracing_system.get_tracer("flask")
            _gradio_tracer = _tracing_system.get_tracer("gradio")
        except Exception as e:
            logger.warning(f"⚠️ Tracing system initialization failed: {e}")
            # Create dummy tracers that do nothing
            _tracing_system = None
            _fastapi_tracer = None
            _flask_tracer = None
            _gradio_tracer = None
    return _tracing_system, _fastapi_tracer, _flask_tracer, _gradio_tracer

# Component-specific tracers - lazy loaded
def fastapi_tracer():
    _, tracer, _, _ = get_tracing_system()
    return tracer

def flask_tracer():
    _, _, tracer, _ = get_tracing_system()
    return tracer

def gradio_tracer():
    _, _, _, tracer = get_tracing_system()
    return tracer

def trace_fastapi_operation(operation: str):
    """Decorator for tracing FastAPI operations"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            system, tracer, _, _ = get_tracing_system()
            if system and tracer:
                with system.create_quantum_span(
                    tracer, operation, "fastapi",
                    **{"function": func.__name__}
                ) as span:
                    try:
                        result = await func(*args, **kwargs)
                        span.set_attribute("quantum.success", True)
                        return result
                    except Exception as e:
                        span.set_attribute("quantum.success", False)
                        span.set_attribute("quantum.error", str(e))
                        raise
            else:
                return await func(*args, **kwargs)
        return wrapper
    return decorator

def trace_flask_operation(operation: str):
    """Decorator for tracing Flask operations"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            system, _, tracer, _ = get_tracing_system()
            if system and tracer:
                with system.create_quantum_span(
                    tracer, operation, "flask",
                    **{"function": func.__name__}
                ) as span:
                    try:
                        result = func(*args, **kwargs)
                        span.set_attribute("quantum.success", True)
                        return result
                    except Exception as e:
                        span.set_attribute("quantum.success", False)
                        span.set_attribute("quantum.error", str(e))
                        raise
            else:
                return func(*args, **kwargs)
        return wrapper
    return decorator

def trace_gradio_operation(operation: str):
    """Decorator for tracing Gradio operations"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            system, _, _, tracer = get_tracing_system()
            if system and tracer:
                with system.create_quantum_span(
                    tracer, operation, "gradio",
                    **{"function": func.__name__}
                ) as span:
                    try:
                        result = func(*args, **kwargs)
                        span.set_attribute("quantum.success", True)
                        return result
                    except Exception as e:
                        span.set_attribute("quantum.success", False)
                        span.set_attribute("quantum.error", str(e))
                        raise
            else:
                return func(*args, **kwargs)
        return wrapper
    return decorator

# Quantum-specific span creation helpers
def trace_authentication(user_id: str = None):
    """Trace authentication operations"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "authentication", "fastapi",
            user_id=user_id or "anonymous"
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_payment_processing(payment_id: str, amount: float):
    """Trace payment processing operations"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "payment_processing", "fastapi",
            payment_id=payment_id,
            payment_amount=amount
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_resonance_visualization(tx_hash: str, phase: str = None):
    """Trace resonance visualization operations"""
    system, _, tracer, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "resonance_visualization", "flask",
            transaction_hash=tx_hash,
            visualization_phase=phase or "full_cascade"
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_ethical_audit(audit_id: str, risk_score: float = None):
    """Trace ethical audit operations"""
    system, _, _, tracer = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "ethical_audit", "gradio",
            audit_id=audit_id,
            risk_score=risk_score
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_websocket_broadcast(event_type: str, user_count: int = 0):
    """Trace WebSocket broadcast operations"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "websocket_broadcast", "fastapi",
            quantum_phase="harmony",
            event_type=event_type,
            connected_users=user_count
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_consciousness_stream(connection_id: str, user_id: str = None):
    """Trace WebSocket consciousness streaming"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "consciousness_stream", "fastapi",
            quantum_phase="transcendence",
            connection_id=connection_id,
            user_id=user_id or "anonymous",
            consciousness_streaming=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_supabase_operation(operation: str, table: str = None):
    """Trace Supabase database operations"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "supabase_operation", "fastapi",
            quantum_phase="foundation",
            database_operation=operation,
            database_table=table or "unknown",
            ethical_data_flow=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_payment_visualization_flow(payment_id: str, tx_hash: str = None):
    """Trace the sacred payment → visualization → ethics flow"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "payment_visualization_flow", "sacred_trinity_integration",
            quantum_phase="transcendence",
            payment_id=payment_id,
            transaction_hash=tx_hash or "unknown",
            cross_component_flow=True,
            sacred_trinity_pipeline=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_svg_cascade_generation(tx_hash: str, phase_count: int = 4):
    """Trace 4-phase SVG cascade generation"""
    system, _, tracer, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "svg_cascade_generation", "flask",
            quantum_phase="growth",
            transaction_hash=tx_hash,
            cascade_phases=phase_count,
            procedural_art=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_quantum_dashboard_data(archetype: str = None):
    """Trace quantum dashboard data processing"""
    system, _, tracer, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "quantum_dashboard_data", "flask", 
            quantum_phase="growth",
            archetype_distribution=archetype or "all",
            collective_wisdom=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_veto_triad_synthesis(verity_score: float = None, qualia_score: float = None):
    """Trace Veto Triad synthesis calculation"""
    system, _, _, tracer = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "veto_triad_synthesis", "gradio",
            quantum_phase="harmony",
            verity_score=verity_score or 0,
            qualia_score=qualia_score or 0,
            ethical_synthesis=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_canticle_processing(canticle_type: str, coherence_score: float = None):
    """Trace canticle interface processing"""
    system, _, _, tracer = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "canticle_processing", "gradio",
            quantum_phase="harmony", 
            canticle_type=canticle_type,
            coherence_score=coherence_score or 0,
            sovereign_wisdom=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_cross_trinity_synchronization():
    """Trace cross-Sacred Trinity component synchronization"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, "cross_trinity_sync", "sacred_trinity_integration",
            quantum_phase="transcendence",
            fastapi_status="active",
            flask_status="active", 
            gradio_status="active",
            quantum_entanglement=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_agent_framework_operation(operation: str, agent_type: str = "sacred_trinity"):
    """Trace Agent Framework operations across Sacred Trinity"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, f"agent_framework_{operation}", "agent_framework",
            quantum_phase="transcendence",
            agent_type=agent_type,
            agent_framework_enabled=agent_framework_available,
            sacred_trinity_integration=True
        )
    from contextlib import nullcontext
    return nullcontext()

def trace_ai_model_interaction(model_name: str, operation_type: str = "inference"):
    """Trace AI model interactions with enhanced content recording"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        return system.create_quantum_span(
            tracer, f"ai_model_{operation_type}", "ai_model",
            quantum_phase="harmony",
            model_name=model_name,
            operation_type=operation_type,
            content_recording_enabled=True,
            sensitive_data_capture=agent_framework_available
        )
    from contextlib import nullcontext
    return nullcontext()

# Context manager helpers for Sacred Trinity flows
from contextlib import contextmanager

@contextmanager
def trace_sacred_trinity_flow(flow_name: str, metadata: Dict[str, Any] = None):
    """Context manager for Sacred Trinity cross-component flows"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        with system.create_quantum_span(
            tracer, flow_name, "sacred_trinity_integration",
            quantum_phase="transcendence",
            cross_component_flow=True,
            **(metadata or {})
        ) as span:
            try:
                yield span
            except Exception as e:
                span.set_attribute("quantum.error", str(e))
                span.set_attribute("quantum.success", False)
                raise
            else:
                span.set_attribute("quantum.success", True)
    else:
        # No-op context manager when tracing is disabled
        class DummySpan:
            def set_attribute(self, *args): pass
        yield DummySpan()

@contextmanager 
def trace_quantum_phase_transition(from_phase: str, to_phase: str, component: str):
    """Trace quantum phase transitions in Sacred Trinity"""
    system, tracer, _, _ = get_tracing_system()
    if system and tracer:
        with system.create_quantum_span(
            tracer, "quantum_phase_transition", component,
            quantum_phase=to_phase,
            phase_transition=f"{from_phase}→{to_phase}",
            consciousness_evolution=True
        ) as span:
            yield span
    else:
        class DummySpan:
            def set_attribute(self, *args): pass
        yield DummySpan()

logger.info("🌌 Quantum Resonance Lattice Tracing System Ready")
logger.info("🎯 Sacred Trinity observability enabled across all components") 
logger.info("📊 Use VSCode Command: ai-mlstudio.tracing.open to view traces")
logger.info("🔍 Enhanced with consciousness streaming and cross-component flows")
logger.info("⚡ Sacred Trinity phase transitions and ethical alignment tracked")
if agent_framework_available:
    logger.info("🤖 Agent Framework observability active with prompt/completion capture")
else:
    logger.info("💡 Install agent-framework package for enhanced AI agent observability")