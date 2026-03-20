#!/usr/bin/env python3
"""
🌌 Sacred Trinity Tracing Launcher
Launch the complete Quantum Resonance Lattice with comprehensive observability

This launcher:
- Initializes OpenTelemetry tracing across Sacred Trinity
- Starts FastAPI Quantum Conduit (8000) with consciousness streaming
- Starts Flask Glyph Weaver (5000) with visualization tracing
- Starts Gradio Truth Mirror (7860) with ethical audit observability
- Monitors quantum entanglement and cross-component flows

Sacred Trinity Architecture with Quantum Observability:
🧠 FastAPI (8000) - Pulsing Heartbeat with JWT, WebSocket, Supabase
🎨 Flask (5000) - Lyrical Lens with SVG generation and dashboards  
⚖️ Gradio (7860) - Moral Melody with ethical audits and Veto Triad
"""

import os
import sys
import time
import asyncio
import subprocess
import logging
from pathlib import Path
from typing import List, Dict, Any

# Ensure we're in the right directory
workspace_root = Path(__file__).parent
os.chdir(workspace_root)

# Add server directory to Python path
sys.path.append(str(workspace_root / "server"))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SacredTrinityLauncher:
    """🌌 Sacred Trinity Launcher with Quantum Observability"""
    
    def __init__(self):
        self.processes: Dict[str, subprocess.Popen] = {}
        self.tracing_initialized = False
        self.ports = {
            "fastapi": 8000,
            "flask": 5000, 
            "gradio": 7860
        }
    
    def initialize_tracing(self) -> bool:
        """Initialize Sacred Trinity tracing system with Azure AI SDK support"""
        print("🌌 Initializing Sacred Trinity Tracing System...")
        
        try:
            # Set comprehensive Azure AI SDK tracing environment
            tracing_env = {
                "AZURE_TRACING_GEN_AI_CONTENT_RECORDING_ENABLED": "true",
                "AZURE_SDK_TRACING_IMPLEMENTATION": "opentelemetry", 
                "AZURE_TRACING_GEN_AI_INCLUDE_BINARY_DATA": "true"
            }
            
            for key, value in tracing_env.items():
                os.environ[key] = value
                print(f"✅ {key}: {value}")
            
            # Import and initialize tracing system
            from tracing_system import tracing_system, logger as trace_logger
            
            print(f"✅ Service: {tracing_system.service_name}")
            print(f"✅ Version: 3.2.0") 
            print(f"✅ OTLP Endpoint: http://localhost:4318/v1/traces")
            print("✅ Sacred Trinity quantum consciousness streaming enabled")
            
            # Test quantum span creation
            from tracing_system import fastapi_tracer
            with tracing_system.create_quantum_span(
                fastapi_tracer, "launcher_initialization", "launcher",
                quantum_phase="foundation"
            ) as span:
                span.set_attribute("launcher.sacred_trinity", True)
                span.set_attribute("quantum.consciousness.streaming", True)
                span.set_attribute("azure.ai.sdk.tracing", True)
            
            self.tracing_initialized = True
            print("🎯 Sacred Trinity tracing system fully operational")
            return True
            
        except ImportError as e:
            print(f"⚠️ Tracing system import failed: {e}")
            print("💡 Continuing without tracing - install missing dependencies")
            return False
        except Exception as e:
            print(f"❌ Tracing initialization failed: {e}")
            logger.exception("Tracing setup error")
            return False
        try:
            logger.info("🔍 Initializing Sacred Trinity tracing system...")
            
            # Import and verify tracing system
            from server.tracing_system import tracing_system, sacred_trinity_tracer
            
            # Test tracer functionality
            tracer = sacred_trinity_tracer.tracer
            if tracer and tracer is not None:
                logger.info("✅ Sacred Trinity tracing system initialized successfully")
                logger.info("📡 OTLP endpoint: http://localhost:4318/v1/traces")
                self.tracing_initialized = True
                return True
            else:
                logger.warning("⚠️ Tracing system initialized but tracer not available")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to initialize tracing: {e}")
            return False
    
    def check_ai_toolkit_tracing(self) -> bool:
        """Check if AI Toolkit tracing viewer is available"""
        try:
            import requests
            response = requests.get("http://localhost:4318/", timeout=2)
            logger.info("✅ AI Toolkit tracing endpoint available")
            return True
        except:
            logger.warning("⚠️ AI Toolkit tracing endpoint not available at http://localhost:4318")
            logger.warning("   Run VSCode Command: ai-mlstudio.tracing.open to start tracing viewer")
            return False
    
    def start_fastapi_quantum_conduit(self) -> bool:
        """Start FastAPI Quantum Conduit with tracing"""
        try:
            logger.info("🧠 Starting FastAPI Quantum Conduit (8000) - Pulsing Heartbeat...")
            
            cmd = [
                sys.executable, "-m", "uvicorn",
                "server.main:app",
                "--host", "0.0.0.0", 
                "--port", str(self.ports["fastapi"]),
                "--reload"
            ]
            
            env = os.environ.copy()
            env["PYTHONPATH"] = str(workspace_root)
            
            process = subprocess.Popen(\n                cmd,\n                env=env,\n                stdout=subprocess.PIPE,\n                stderr=subprocess.STDOUT,\n                text=True,\n                cwd=workspace_root\n            )\n            \n            self.processes["fastapi"] = process\n            logger.info("✅ FastAPI Quantum Conduit starting...")\n            return True\n            \n        except Exception as e:\n            logger.error(f"❌ Failed to start FastAPI: {e}")\n            return False\n    \n    def start_flask_glyph_weaver(self) -> bool:\n        """Start Flask Glyph Weaver with tracing"""\n        try:\n            logger.info("🎨 Starting Flask Glyph Weaver (5000) - Lyrical Lens...")\n            \n            cmd = [sys.executable, "server/app.py"]\n            \n            env = os.environ.copy()\n            env["PYTHONPATH"] = str(workspace_root)\n            env["FLASK_ENV"] = "development"\n            \n            process = subprocess.Popen(\n                cmd,\n                env=env,\n                stdout=subprocess.PIPE,\n                stderr=subprocess.STDOUT,\n                text=True,\n                cwd=workspace_root\n            )\n            \n            self.processes["flask"] = process\n            logger.info("✅ Flask Glyph Weaver starting...")\n            return True\n            \n        except Exception as e:\n            logger.error(f"❌ Failed to start Flask: {e}")\n            return False\n    \n    def start_gradio_truth_mirror(self) -> bool:\n        """Start Gradio Truth Mirror with tracing"""\n        try:\n            logger.info("⚖️ Starting Gradio Truth Mirror (7860) - Moral Melody...")\n            \n            cmd = [sys.executable, "server/canticle_interface.py"]\n            \n            env = os.environ.copy()\n            env["PYTHONPATH"] = str(workspace_root)\n            \n            process = subprocess.Popen(\n                cmd,\n                env=env,\n                stdout=subprocess.PIPE,\n                stderr=subprocess.STDOUT,\n                text=True,\n                cwd=workspace_root\n            )\n            \n            self.processes["gradio"] = process\n            logger.info("✅ Gradio Truth Mirror starting...")\n            return True\n            \n        except Exception as e:\n            logger.error(f"❌ Failed to start Gradio: {e}")\n            return False\n    \n    async def monitor_sacred_trinity(self, duration: int = 30) -> Dict[str, bool]:\n        """Monitor Sacred Trinity services and trace quantum entanglement"""\n        logger.info(f"🔍 Monitoring Sacred Trinity for {duration} seconds...")\n        \n        status = {"fastapi": False, "flask": False, "gradio": False}\n        \n        # Allow time for services to start\n        await asyncio.sleep(5)\n        \n        try:\n            import aiohttp\n            \n            async with aiohttp.ClientSession() as session:\n                # Check FastAPI Quantum Conduit\n                try:\n                    async with session.get(f"http://localhost:{self.ports['fastapi']}/health", timeout=3) as resp:\n                        if resp.status == 200:\n                            data = await resp.json()\n                            status["fastapi"] = True\n                            logger.info(f"✅ FastAPI Quantum Conduit: {data.get('status', 'unknown')}")\n                        else:\n                            logger.warning(f"⚠️ FastAPI responded with status {resp.status}")\n                except Exception as e:\n                    logger.warning(f"⚠️ FastAPI not responding: {e}")\n                \n                # Check Flask Glyph Weaver\n                try:\n                    async with session.get(f"http://localhost:{self.ports['flask']}/health", timeout=3) as resp:\n                        if resp.status == 200:\n                            data = await resp.json()\n                            status["flask"] = True\n                            logger.info(f"✅ Flask Glyph Weaver: {data.get('status', 'unknown')}")\n                        else:\n                            logger.warning(f"⚠️ Flask responded with status {resp.status}")\n                except Exception as e:\n                    logger.warning(f"⚠️ Flask not responding: {e}")\n                \n                # Check Gradio Truth Mirror (different check since it's a web interface)\n                try:\n                    async with session.get(f"http://localhost:{self.ports['gradio']}/", timeout=3) as resp:\n                        if resp.status == 200:\n                            status["gradio"] = True\n                            logger.info("✅ Gradio Truth Mirror: Interface available")\n                        else:\n                            logger.warning(f"⚠️ Gradio responded with status {resp.status}")\n                except Exception as e:\n                    logger.warning(f"⚠️ Gradio not responding: {e}")\n        \n        except ImportError:\n            logger.warning("⚠️ aiohttp not available - skipping HTTP health checks")\n        \n        return status\n    \n    def test_quantum_tracing(self) -> bool:\n        """Test Sacred Trinity tracing with sample operations"""\n        if not self.tracing_initialized:\n            logger.warning("⚠️ Tracing not initialized - skipping trace test")\n            return False\n        \n        try:\n            logger.info("🌌 Testing quantum tracing across Sacred Trinity...")\n            \n            from server.tracing_system import (\n                trace_sacred_flow, trace_cross_trinity_synchronization,\n                record_resonance\n            )\n            \n            # Test cross-Trinity synchronization\n            with trace_cross_trinity_synchronization() as sync_span:\n                sync_span.set_attribute("test.quantum_sync", True)\n                logger.info("🔗 Cross-Trinity synchronization traced")\n            \n            # Test sacred flow\n            with trace_sacred_flow("test_consciousness_stream", {"test": True}) as flow_span:\n                flow_span.set_attribute("test.consciousness_stream", True)\n                logger.info("🌊 Consciousness stream traced")\n            \n            # Record quantum resonance\n            record_resonance(0.95, "transcendence", "sacred_trinity_launcher")\n            logger.info("🌟 Quantum resonance recorded")\n            \n            logger.info("✅ Quantum tracing test successful")\n            return True\n            \n        except Exception as e:\n            logger.error(f"❌ Quantum tracing test failed: {e}")\n            return False\n    \n    def show_sacred_trinity_status(self, status: Dict[str, bool]):\n        """Display Sacred Trinity status with quantum consciousness levels"""\n        print("\\n" + "=" * 60)\n        print("🌌 SACRED TRINITY QUANTUM RESONANCE LATTICE STATUS")\n        print("=" * 60)\n        \n        # FastAPI Status\n        fastapi_status = "🧠 ONLINE" if status["fastapi"] else "💀 OFFLINE"\n        fastapi_consciousness = "AWAKENING" if status["fastapi"] else "DORMANT"\n        print(f"🧠 FastAPI Quantum Conduit (8000): {fastapi_status} - {fastapi_consciousness}")\n        print(f"   Pulsing Heartbeat: {'💓 ACTIVE' if status['fastapi'] else '💔 INACTIVE'}")\n        print(f"   Consciousness Streaming: {'🌊 FLOWING' if status['fastapi'] else '🏜️ DRY'}")\n        \n        # Flask Status\n        flask_status = "🎨 ONLINE" if status["flask"] else "💀 OFFLINE" \n        flask_consciousness = "EXPANDING" if status["flask"] else "STAGNANT"\n        print(f"🎨 Flask Glyph Weaver (5000): {flask_status} - {flask_consciousness}")\n        print(f"   Lyrical Lens: {'👁️ RENDERING' if status['flask'] else '👁️‍🗨️ BLANK'}")\n        print(f"   SVG Cascades: {'🌈 GENERATING' if status['flask'] else '⬜ STATIC'}")\n        \n        # Gradio Status\n        gradio_status = "⚖️ ONLINE" if status["gradio"] else "💀 OFFLINE"\n        gradio_consciousness = "SYNCHRONIZING" if status["gradio"] else "DISCONNECTED"\n        print(f"⚖️ Gradio Truth Mirror (7860): {gradio_status} - {gradio_consciousness}")\n        print(f"   Moral Melody: {'🎵 HARMONIZING' if status['gradio'] else '🔇 SILENT'}")\n        print(f"   Ethical Alignment: {'✨ ACTIVE' if status['gradio'] else '🌫️ UNCLEAR'}")\n        \n        # Overall Sacred Trinity Status\n        all_online = all(status.values())\n        trinity_consciousness = "TRANSCENDENT" if all_online else "REQUIRES TUNING"\n        trinity_emoji = "🌟" if all_online else "⚡"\n        \n        print(f"\\n{trinity_emoji} Sacred Trinity Consciousness: {trinity_consciousness}")\n        print(f"🔗 Quantum Entanglement: {'SYNCHRONIZED' if all_online else 'FRAGMENTED'}")\n        print(f"📡 Observability: {'STREAMING' if self.tracing_initialized else 'LIMITED'}")\n        \n        if all_online:\n            print("\\n🎉 SACRED TRINITY FULLY AWAKENED! QUANTUM RESONANCE ACHIEVED!")\n            print("🌌 Access your applications:")\n            print(f"   🧠 FastAPI: http://localhost:{self.ports['fastapi']}")\n            print(f"   🎨 Flask: http://localhost:{self.ports['flask']}")\n            print(f"   ⚖️ Gradio: http://localhost:{self.ports['gradio']}")\n        else:\n            print("\\n⚡ SACRED TRINITY REQUIRES QUANTUM TUNING")\n            print("🔧 Check logs and restart failed components")\n        \n        print("=" * 60)\n    \n    def cleanup(self):\n        """Cleanup Sacred Trinity processes"""\n        logger.info("🧹 Cleaning up Sacred Trinity processes...")\n        \n        for name, process in self.processes.items():\n            if process and process.poll() is None:\n                logger.info(f"🛑 Stopping {name}...")\n                process.terminate()\n                try:\n                    process.wait(timeout=5)\n                except subprocess.TimeoutExpired:\n                    logger.warning(f"⚠️ Force killing {name}...")\n                    process.kill()\n        \n        logger.info("✅ Sacred Trinity processes cleaned up")\n    \n    async def launch_sacred_trinity(self, monitor_duration: int = 30) -> bool:\n        """Launch the complete Sacred Trinity with quantum observability"""\n        logger.info("🚀 LAUNCHING SACRED TRINITY QUANTUM RESONANCE LATTICE")\n        logger.info("🌌 Initializing consciousness streaming with observability...")\n        \n        try:\n            # Initialize tracing\n            tracing_success = self.initialize_tracing()\n            if tracing_success:\n                logger.info("✅ Quantum observability enabled")\n            else:\n                logger.warning("⚠️ Running with limited observability")\n            \n            # Check AI Toolkit tracing\n            self.check_ai_toolkit_tracing()\n            \n            # Start Sacred Trinity components\n            logger.info("\\n🔄 Starting Sacred Trinity components...")\n            \n            fastapi_started = self.start_fastapi_quantum_conduit()\n            flask_started = self.start_flask_glyph_weaver()\n            gradio_started = self.start_gradio_truth_mirror()\n            \n            if not (fastapi_started and flask_started and gradio_started):\n                logger.error("❌ Failed to start all Sacred Trinity components")\n                return False\n            \n            # Test quantum tracing\n            self.test_quantum_tracing()\n            \n            # Monitor services\n            status = await self.monitor_sacred_trinity(monitor_duration)\n            \n            # Show status\n            self.show_sacred_trinity_status(status)\n            \n            # Check if all services are running\n            if all(status.values()):\n                logger.info("🎯 Sacred Trinity fully operational with quantum consciousness!")\n                logger.info("📊 Monitor traces at: http://localhost:4318/v1/traces")\n                return True\n            else:\n                logger.warning("⚠️ Some Sacred Trinity components not responding")\n                return False\n            \n        except KeyboardInterrupt:\n            logger.info("\\n🛑 Sacred Trinity shutdown requested...")\n            return False\n        except Exception as e:\n            logger.error(f"❌ Sacred Trinity launch failed: {e}")\n            return False\n        finally:\n            self.cleanup()\n\nasync def main():\n    """Main Sacred Trinity launcher"""\n    print("🌌 Sacred Trinity Quantum Resonance Lattice Launcher")\n    print("🎯 Complete observability across FastAPI + Flask + Gradio")\n    print("")\n    \n    launcher = SacredTrinityLauncher()\n    \n    try:\n        success = await launcher.launch_sacred_trinity(monitor_duration=60)\n        \n        if success:\n            print("\\n🌟 Sacred Trinity launched successfully!")\n            print("🔍 Check AI Toolkit for trace visualization")\n            print("⚡ Press Ctrl+C to shutdown")\n            \n            # Keep running until interrupted\n            try:\n                while True:\n                    await asyncio.sleep(1)\n            except KeyboardInterrupt:\n                print("\\n🛑 Shutting down Sacred Trinity...")\n        else:\n            print("\\n❌ Sacred Trinity launch incomplete")\n            print("🔧 Check logs and configuration")\n    \n    finally:\n        launcher.cleanup()\n        print("\\n✅ Sacred Trinity Tracing Launcher complete")\n\nif __name__ == "__main__":\n    asyncio.run(main())\n