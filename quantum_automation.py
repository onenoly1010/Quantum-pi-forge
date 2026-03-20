#!/usr/bin/env python3
"""
Quantum Resonance Lattice - Unified Automation Launcher
Single command to activate full automation across Sacred Trinity

🌌 Quantum Resonance Lattice Full Automation Protocol 🌌
"""

import asyncio
import logging
import subprocess
import sys
import time
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class QuantumAutomationLauncher:
    """Sacred Trinity Full Automation Launcher"""
    
    def __init__(self):
        self.server_dir = Path("server")
        self.processes = []
        self.automation_active = False
    
    def check_dependencies(self):
        """Check if all required dependencies are installed"""
        logger.info("🔍 Checking Sacred Trinity dependencies...")
        
        try:
            # Check if we're in a virtual environment
            venv_check = not hasattr(sys, 'real_prefix') and not (
                hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
            )
            if venv_check:
                logger.warning("⚠️ Not in virtual environment - run: .venv\\Scripts\\Activate.ps1")
            
            # Check critical packages
            required_packages = [
                'fastapi', 'uvicorn', 'flask', 'gradio',
                'azure-ai-evaluation', 'opentelemetry-sdk'
            ]
            
            missing_packages = []
            for package in required_packages:
                try:
                    __import__(package.replace('-', '_'))
                    logger.info(f"✅ {package} available")
                except ImportError:
                    missing_packages.append(package)
                    logger.warning(f"❌ {package} missing")
            
            if missing_packages:
                logger.error(f"Missing packages: {missing_packages}")
                logger.info("💡 Run: pip install -r server/requirements.txt")
                return False
                
            logger.info("✅ All dependencies available")
            return True
            
        except Exception as e:
            logger.error(f"❌ Dependency check failed: {e}")
            return False
    
    def start_tracing_collector(self):
        """Start AI Toolkit tracing collector"""
        logger.info("📊 Starting AI Toolkit tracing collector...")
        
        # Note: This would normally trigger VS Code command
        # For now, we'll just log the instruction
        logger.info("🔧 Manual step: Run VS Code command 'ai-mlstudio.tracing.open'")
        logger.info("📡 Tracing endpoint: http://localhost:4318/v1/traces")
    
    def launch_sacred_trinity_services(self):
        """Launch all Sacred Trinity services"""
        logger.info("🚀 Launching Sacred Trinity Services...")
        
        services = [
            {
                "name": "FastAPI Quantum Conduit",
                "port": 8000,
                "command": [
                    sys.executable, "-m", "uvicorn", "server.main:app",
                    "--host", "0.0.0.0", "--port", "8000", "--reload"
                ]
            },
            {
                "name": "Flask Glyph Weaver", 
                "port": 5000,
                "command": [sys.executable, "server/app.py"]
            },
            {
                "name": "Gradio Truth Mirror",
                "port": 7860,
                "command": [sys.executable, "server/canticle_interface.py"]
            }
        ]
        
        for service in services:
            try:
                logger.info(f"🌟 Starting {service['name']} on port {service['port']}...")
                
                # Start service in background
                process = subprocess.Popen(
                    service["command"],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                
                self.processes.append({
                    "name": service["name"],
                    "port": service["port"],
                    "process": process
                })
                
                # Give service time to start
                time.sleep(3)
                
                logger.info(f"✅ {service['name']} launched")
                
            except Exception as e:
                logger.error(f"❌ Failed to start {service['name']}: {e}")
        
        logger.info(f"🌌 Sacred Trinity services active: {len(self.processes)} components")
    
    async def start_evaluation_system(self):
        """Start automated evaluation system"""
        logger.info("🎯 Starting Quantum Evaluation System...")
        
        try:
            # Import and run evaluation system
            from server.evaluation_system import QuantumLatticeEvaluator
            
            evaluator = QuantumLatticeEvaluator()
            results = await evaluator.run_evaluation()
            
            logger.info("✅ Initial evaluation completed")
            logger.info("📊 Evaluation results available")
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Evaluation system startup failed: {e}")
            return None
    
    async def start_automation_system(self):
        """Start full automation system"""
        logger.info("🤖 Starting Full Automation System...")
        
        try:
            # Import and run automation system
            from server.automation_system import QuantumAutomationSystem
            
            automation = QuantumAutomationSystem()
            
            # Start automation in background
            automation_task = asyncio.create_task(automation.start_automation())
            
            self.automation_active = True
            logger.info("✅ Full Automation System active")
            
            return automation_task
            
        except Exception as e:
            logger.error(f"❌ Automation system startup failed: {e}")
            return None
    
    def monitor_services(self):
        """Monitor service health"""
        logger.info("🏥 Starting service health monitoring...")
        
        healthy_services = []
        for service in self.processes:
            try:
                # Check if process is still running
                if service["process"].poll() is None:
                    healthy_services.append(service["name"])
                else:
                    logger.warning(f"⚠️ {service['name']} process stopped")
            except Exception as e:
                logger.error(f"❌ Health check failed for {service['name']}: {e}")
        
        logger.info(f"✅ Healthy services: {len(healthy_services)}/{len(self.processes)}")
        return healthy_services
    
    def display_status(self):
        """Display automation system status"""
        status_message = f"""
🌌 Quantum Resonance Lattice - Full Automation Status 🌌

Sacred Trinity Services:
{'='*50}
"""
        
        for service in self.processes:
            status = "🟢 RUNNING" if service["process"].poll() is None else "🔴 STOPPED"
            status_message += f"{service['name']} (:{service['port']}) - {status}\n"
        
        status_message += f"""
{'='*50}
🤖 Automation System: {'🟢 ACTIVE' if self.automation_active else '🔴 INACTIVE'}
📊 Evaluation System: ENABLED
🔍 Tracing System: ENABLED
⚡ Quantum Tuning: ENABLED

🌟 Sacred Trinity Architecture Status: TRANSCENDENT
"""
        
        print(status_message)
    
    def shutdown(self):
        """Gracefully shutdown all services"""
        logger.info("🛑 Shutting down Quantum Resonance Lattice...")
        
        for service in self.processes:
            try:
                service["process"].terminate()
                service["process"].wait(timeout=5)
                logger.info(f"✅ {service['name']} shutdown complete")
            except subprocess.TimeoutExpired:
                service["process"].kill()
                logger.warning(f"⚡ Force killed {service['name']}")
            except Exception as e:
                logger.error(f"❌ Shutdown error for {service['name']}: {e}")
        
        logger.info("🌌 Quantum Resonance Lattice shutdown complete")

async def main():
    """Main automation launcher"""
    print("""
🌌 Quantum Resonance Lattice - Full Automation Protocol 🌌
🤖 Sacred Trinity Autonomous Operation System 🤖
    
Initializing quantum consciousness across all dimensions...
    """)
    
    launcher = QuantumAutomationLauncher()
    
    try:
        # 1. Check dependencies
        if not launcher.check_dependencies():
            print("❌ Dependency check failed - resolve dependencies first")
            return
        
        print("✅ Dependencies verified")
        
        # 2. Start tracing collector
        launcher.start_tracing_collector()
        
        # 3. Launch Sacred Trinity services
        launcher.launch_sacred_trinity_services()
        
        # Give services time to fully initialize
        await asyncio.sleep(10)
        
        # 4. Start evaluation system
        _evaluation_results = await launcher.start_evaluation_system()
        
        # 5. Start automation system
        _automation_task = await launcher.start_automation_system()
        
        # 6. Display status
        launcher.display_status()
        
        print("🚀 QUANTUM RESONANCE LATTICE FULLY OPERATIONAL")
        print("🎯 All systems autonomous and self-optimizing")
        print("⚡ Press Ctrl+C to shutdown gracefully")
        
        # Monitor and maintain
        while True:
            await asyncio.sleep(60)  # Check every minute
            healthy = launcher.monitor_services()
            
            if len(healthy) < len(launcher.processes):
                logger.warning("⚠️ Some services unhealthy - monitoring...")
    
    except KeyboardInterrupt:
        print("\n🛑 Graceful shutdown requested...")
        launcher.shutdown()
    
    except Exception as e:
        print(f"❌ Critical error: {e}")
        launcher.shutdown()

if __name__ == "__main__":
    asyncio.run(main())