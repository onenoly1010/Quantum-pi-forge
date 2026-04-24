#!/usr/bin/env python3
"""
Continuous Autonomous Task Execution Workflow
Runs the full task selection, execution, and memory feedback loop indefinitely
"""
import time
import json
import signal
import logging
from datetime import datetime
from pathlib import Path

from task_selector import select_next_task, get_task_execution_prompt, generate_aliveness_report
REPLACE

# Configuration
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    handlers=[
        logging.FileHandler(LOG_DIR / "autonomous_workflow.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

shutdown_requested = False

def signal_handler(signum, frame):
    global shutdown_requested
    logger.info("⛔ Shutdown signal received. Completing current task then exiting.")
    shutdown_requested = True

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

def run_continuous_cycle():
    """Main execution loop: select → execute → record → repeat"""
    
    cycle_count = 0
    
    logger.info("🚀 Continuous Autonomous Workflow started")
    logger.info("=" * 80)
    
    while not shutdown_requested:
        cycle_count += 1
        cycle_start = time.time()
        
        logger.info(f"\n🔄 Starting cycle #{cycle_count}")
        
        try:
            # 1. Self assessment & task selection
            logger.info("  🧠 Selecting next task...")
            task, health = select_next_task()
            
            logger.info(f"  ✅ Selected: {task['type']} (score: {task['score']})")
            logger.info(f"  📊 System health: {health['overall_health']}")
            
            # 2. Generate execution context
            prompt = get_task_execution_prompt(task)
            
            # 3. Execute task
            logger.info("  ⚡ Executing task...")
            start_time = time.time()
            outcome = execute_task(task, prompt)
            duration = round(time.time() - start_time, 2)
            
            success = outcome.get("success", False)
            logger.info(f"  {'✅ SUCCESS' if success else '❌ FAILURE'} in {duration}s")
            
            # 4. Record outcome to memory
            record_task_outcome(task, outcome, duration)
            logger.info("  💾 Outcome recorded to semantic memory")
            
            # 5. Generate aliveness report every 5 cycles
            if cycle_count % 5 == 0:
                report = generate_aliveness_report()
                logger.info(f"\n📋 ALIVENESS REPORT #{cycle_count//5}")
                logger.info(f"  Score: {report['aliveness_score']}")
                logger.info(f"  Status: {report['cycle_status']}")
                logger.info(f"  Autonomy: {report['autonomy_level']}")
                
                # Write report to disk
                report_path = LOG_DIR / f"aliveness_report_{int(time.time())}.json"
                with open(report_path, 'w') as f:
                    json.dump(report, f, indent=2)
            
            cycle_duration = round(time.time() - cycle_start, 2)
            logger.info(f"⏱️  Cycle complete in {cycle_duration}s")
            
            # Cooldown between cycles
            if not shutdown_requested:
                time.sleep(3)
                
        except Exception as e:
            logger.error(f"🔥 Cycle failure: {str(e)}", exc_info=True)
            time.sleep(10)
            continue
    
    logger.info("\n✅ Workflow shutdown complete")
    logger.info(f"Total cycles executed: {cycle_count}")

if __name__ == "__main__":
    run_continuous_cycle()