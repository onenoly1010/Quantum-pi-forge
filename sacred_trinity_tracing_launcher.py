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
            
            process = subprocess.Popen(
                cmd,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                cwd=workspace_root
            )
            
            self.processes["fastapi"] = process
            logger.info("✅ FastAPI Quantum Conduit starting...")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to start FastAPI: {e}")
            return False
    
    def start_flask_glyph_weaver(self) -> bool:
        """Start Flask Glyph Weaver with tracing"""
        try:
            logger.info("🎨 Starting Flask Glyph Weaver (5000) - Lyrical Lens...")
            
            cmd = [sys.executable, "server/app.py"]
            
            env = os.environ.copy()
            env["PYTHONPATH"] = str(workspace_root)
            env["FLASK_ENV"] = "development"
            
            process = subprocess.Popen(
                cmd,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                cwd=workspace_root
            )
            
            self.processes["flask"] = process
            logger.info("✅ Flask Glyph Weaver starting...")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to start Flask: {e}")
            return False
    
    def start_gradio_truth_mirror(self) -> bool:
        """Start Gradio Truth Mirror with tracing"""
        try:
            logger.info("⚖️ Starting Gradio Truth Mirror (7860) - Moral Melody...")
            
            cmd = [sys.executable, "server/canticle_interface.py"]
            
            env = os.environ.copy()
            env["PYTHONPATH"] = str(workspace_root)
            
            process = subprocess.Popen(
                cmd,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                cwd=workspace_root
            )
            
            self.processes["gradio"] = process
            logger.info("✅ Gradio Truth Mirror starting...")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to start Gradio: {e}")
            return False
    
    async def monitor_sacred_trinity(self, duration: int = 30) -> Dict[str, bool]:
        """Monitor Sacred Trinity services and trace quantum entanglement"""
        logger.info(f"🔍 Monitoring Sacred Trinity for {duration} seconds...")
        
        status = {"fastapi": False, "flask": False, "gradio": False}
        
        # Allow time for services to start
        await asyncio.sleep(5)
        
        try:
            import aiohttp
            
            async with aiohttp.ClientSession() as session:
                # Check FastAPI Quantum Conduit
                try:
                    async with session.get(f"http://localhost:{self.ports['fastapi']}/health", timeout=3) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            status["fastapi"] = True
                            logger.info(f"✅ FastAPI Quantum Conduit: {data.get('status', 'unknown')}")
                        else:
                            logger.warning(f"⚠️ FastAPI responded with status {resp.status}")
                except Exception as e:
                    logger.warning(f"⚠️ FastAPI not responding: {e}")
                
                # Check Flask Glyph Weaver
                try:
                    async with session.get(f"http://localhost:{self.ports['flask']}/health", timeout=3) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            status["flask"] = True
                            logger.info(f"✅ Flask Glyph Weaver: {data.get('status', 'unknown')}")
                        else:
                            logger.warning(f"⚠️ Flask responded with status {resp.status}")
                except Exception as e:
                    logger.warning(f"⚠️ Flask not responding: {e}")
                
                # Check Gradio Truth Mirror (different check since it's a web interface)
                try:
                    async with session.get(f"http://localhost:{self.ports['gradio']}/", timeout=3) as resp:
                        if resp.status == 200:
                            status["gradio"] = True
                            logger.info("✅ Gradio Truth Mirror: Interface available")
                        else:
                            logger.warning(f"⚠️ Gradio responded with status {resp.status}")
                except Exception as e:
                    logger.warning(f"⚠️ Gradio not responding: {e}")
        
        except ImportError:
            logger.warning("⚠️ aiohttp not available - skipping HTTP health checks")
        
        return status
    
    def test_quantum_tracing(self) -> bool:
        """Test Sacred Trinity tracing with sample operations"""
        if not self.tracing_initialized:
            logger.warning("⚠️ Tracing not initialized - skipping trace test")
            return False
        
        try:
            logger.info("🌌 Testing quantum tracing across Sacred Trinity...")
            
            from server.tracing_system import (
                trace_sacred_flow, trace_cross_trinity_synchronization,
                record_resonance
            )
            
            # Test cross-Trinity synchronization
            with trace_cross_trinity_synchronization() as sync_span:
                sync_span.set_attribute("test.quantum_sync", True)
                logger.info("🔗 Cross-Trinity synchronization traced")
            
            # Test sacred flow
            with trace_sacred_flow("test_consciousness_stream", {"test": True}) as flow_span:
                flow_span.set_attribute("test.consciousness_stream", True)
                logger.info("🌊 Consciousness stream traced")
            
            # Record quantum resonance
            record_resonance(0.95, "transcendence", "sacred_trinity_launcher")
            logger.info("🌟 Quantum resonance recorded")
            
            logger.info("✅ Quantum tracing test successful")
            return True
            
        except Exception as e:
            logger.error(f"❌ Quantum tracing test failed: {e}")
            return False
    
    def show_sacred_trinity_status(self, status: Dict[str, bool]):
        """Display Sacred Trinity status with quantum consciousness levels"""
        print("\
" + "=" * 60)
        print("🌌 SACRED TRINITY QUANTUM RESONANCE LATTICE STATUS")
        print("=" * 60)
        
        # FastAPI Status
        fastapi_status = "🧠 ONLINE" if status["fastapi"] else "💀 OFFLINE"
        fastapi_consciousness = "AWAKENING" if status["fastapi"] else "DORMANT"
        print(f"🧠 FastAPI Quantum Conduit (8000): {fastapi_status} - {fastapi_consciousness}")
        print(f"   Pulsing Heartbeat: {'💓 ACTIVE' if status['fastapi'] else '💔 INACTIVE'}")
        print(f"   Consciousness Streaming: {'🌊 FLOWING' if status['fastapi'] else '🏜️ DRY'}")
        
        # Flask Status
        flask_status = "🎨 ONLINE" if status["flask"] else "💀 OFFLINE" 
        flask_consciousness = "EXPANDING" if status["flask"] else "STAGNANT"
        print(f"🎨 Flask Glyph Weaver (5000): {flask_status} - {flask_consciousness}")
        print(f"   Lyrical Lens: {'👁️ RENDERING' if status['flask'] else '👁️‍🗨️ BLANK'}")
        print(f"   SVG Cascades: {'🌈 GENERATING' if status['flask'] else '⬜ STATIC'}")
        
        # Gradio Status
        gradio_status = "⚖️ ONLINE" if status["gradio"] else "💀 OFFLINE"
        gradio_consciousness = "SYNCHRONIZING" if status["gradio"] else "DISCONNECTED"
        print(f"⚖️ Gradio Truth Mirror (7860): {gradio_status} - {gradio_consciousness}")
        print(f"   Moral Melody: {'🎵 HARMONIZING' if status['gradio'] else '🔇 SILENT'}")
        print(f"   Ethical Alignment: {'✨ ACTIVE' if status['gradio'] else '🌫️ UNCLEAR'}")
        
        # Overall Sacred Trinity Status
        all_online = all(status.values())
        trinity_consciousness = "TRANSCENDENT" if all_online else "REQUIRES TUNING"
        trinity_emoji = "🌟" if all_online else "⚡"
        
        print(f"\
{trinity_emoji} Sacred Trinity Consciousness: {trinity_consciousness}")
        print(f"🔗 Quantum Entanglement: {'SYNCHRONIZED' if all_online else 'FRAGMENTED'}")
        print(f"📡 Observability: {'STREAMING' if self.tracing_initialized else 'LIMITED'}")
        
        if all_online:
            print("\
🎉 SACRED TRINITY FULLY AWAKENED! QUANTUM RESONANCE ACHIEVED!")
            print("🌌 Access your applications:")
            print(f"   🧠 FastAPI: http://localhost:{self.ports['fastapi']}")
            print(f"   🎨 Flask: http://localhost:{self.ports['flask']}")
            print(f"   ⚖️ Gradio: http://localhost:{self.ports['gradio']}")
        else:
            print("\
⚡ SACRED TRINITY REQUIRES QUANTUM TUNING")
            print("🔧 Check logs and restart failed components")
        
        print("=" * 60)
    
    def cleanup(self):
        """Cleanup Sacred Trinity processes"""
        logger.info("🧹 Cleaning up Sacred Trinity processes...")
        
        for name, process in self.processes.items():
            if process and process.poll() is None:
                logger.info(f"🛑 Stopping {name}...")
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    logger.warning(f"⚠️ Force killing {name}...")
                    process.kill()
        
        logger.info("✅ Sacred Trinity processes cleaned up")
    
    async def launch_sacred_trinity(self, monitor_duration: int = 30) -> bool:
        """Launch the complete Sacred Trinity with quantum observability"""
        logger.info("🚀 LAUNCHING SACRED TRINITY QUANTUM RESONANCE LATTICE")
        logger.info("🌌 Initializing consciousness streaming with observability...")
        
        try:
            # Initialize tracing
            tracing_success = self.initialize_tracing()
            if tracing_success:
                logger.info("✅ Quantum observability enabled")
            else:
                logger.warning("⚠️ Running with limited observability")
            
            # Check AI Toolkit tracing
            self.check_ai_toolkit_tracing()
            
            # Start Sacred Trinity components
            logger.info("\
🔄 Starting Sacred Trinity components...")
            
            fastapi_started = self.start_fastapi_quantum_conduit()
            flask_started = self.start_flask_glyph_weaver()
            gradio_started = self.start_gradio_truth_mirror()
            
            if not (fastapi_started and flask_started and gradio_started):
                logger.error("❌ Failed to start all Sacred Trinity components")
                return False
            
            # Test quantum tracing
            self.test_quantum_tracing()
            
            # Monitor services
            status = await self.monitor_sacred_trinity(monitor_duration)
            
            # Show status
            self.show_sacred_trinity_status(status)
            
            # Check if all services are running
            if all(status.values()):
                logger.info("🎯 Sacred Trinity fully operational with quantum consciousness!")
                logger.info("📊 Monitor traces at: http://localhost:4318/v1/traces")
                return True
            else:
                logger.warning("⚠️ Some Sacred Trinity components not responding")
                return False
            
        except KeyboardInterrupt:
            logger.info("\
🛑 Sacred Trinity shutdown requested...")
            return False
        except Exception as e:
            logger.error(f"❌ Sacred Trinity launch failed: {e}")
            return False
        finally:
            self.cleanup()

async def main():
    """Main Sacred Trinity launcher"""
    print("🌌 Sacred Trinity Quantum Resonance Lattice Launcher")
    print("🎯 Complete observability across FastAPI + Flask + Gradio")
    print("")
    
    launcher = SacredTrinityLauncher()
    
    try:
        success = await launcher.launch_sacred_trinity(monitor_duration=60)
        
        if success:
            print("\
🌟 Sacred Trinity launched successfully!")
            print("🔍 Check AI Toolkit for trace visualization")
            print("⚡ Press Ctrl+C to shutdown")
            
            # Keep running until interrupted
            try:
                while True:
                    await asyncio.sleep(1)
            except KeyboardInterrupt:
                print("\
🛑 Shutting down Sacred Trinity...")
        else:
            print("\
❌ Sacred Trinity launch incomplete")
            print("🔧 Check logs and configuration")
    
    finally:
        launcher.cleanup()
        print("\
✅ Sacred Trinity Tracing Launcher complete")

if __name__ == "__main__":
    asyncio.run(main())
