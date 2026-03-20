#!/usr/bin/env python3
"""
Test Sacred Trinity Evaluation Suite
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from quantum_evaluation_launcher import SacredTrinityEvaluationSuite


async def test_evaluation_suite():
    print('🌌 Testing Sacred Trinity Evaluation Suite...')

    try:
        suite = SacredTrinityEvaluationSuite()
        print('✅ Evaluation suite initialized')

        # Test basic evaluation
        result = await suite.evaluate_sacred_trinity_quality('test query', 'test response')
        print('✅ Basic evaluation completed')
        print(f'📊 Result: {result}')

        print('🎉 Evaluation suite test successful!')

    except Exception as e:
        print(f'❌ Evaluation test failed: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_evaluation_suite())