"""
Pytest configuration for pi-forge-quantum-genesis test suite.
Ensures the server package is discoverable during test execution.
"""

import sys
import os

# Add the parent directory (repo root) to Python path
# This makes 'server' package importable
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, repo_root)
