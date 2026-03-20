#!/usr/bin/env python3
"""
Debug script to test imports in main.py
"""

import os
import sys


def test_import(module_name, description):
    try:
        __import__(module_name)
        print(f"✅ {description}: {module_name}")
        return True
    except ImportError as e:
        print(f"❌ {description}: {module_name} - {e}")
        return False
    except Exception as e:
        print(f"⚠️  {description}: {module_name} - {e}")
        return False

print("🔍 Testing imports for main.py...")

# Test core FastAPI imports
test_import("fastapi", "FastAPI framework")
test_import("uvicorn", "Uvicorn server")
test_import("pydantic", "Pydantic models")

# Test custom modules
test_import("tracing_system", "Tracing system")
test_import("autonomous_decision", "Autonomous decision tools")
test_import("guardian_monitor", "Guardian monitoring")
test_import("monitoring_agents", "Monitoring agents")
test_import("guardian_approvals", "Guardian approvals")
test_import("self_healing", "Self-healing system")
test_import("pi_network_router", "Pi Network router")

print("🔍 Import testing complete.")