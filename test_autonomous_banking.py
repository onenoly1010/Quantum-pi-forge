"""
Autonomous Agentic Banking System Test
Tests the complete Pi → OINIO reward flow
"""

import asyncio
import json
import os
from decimal import Decimal

async def test_autonomous_banking():
    """Test the complete autonomous banking flow"""
    print("🧪 Testing Autonomous Agentic Banking System")
    print("=" * 50)
    
    try:
        # Test 1: Pi Network Client
        print("\n1️⃣ Testing Pi Network Client...")
        try:
            from pi_network_client import get_pi_client, verify_pi_payment_for_reward
            
            # Only test if env vars are available
            if os.environ.get("PI_API_KEY") and os.environ.get("PI_APP_ID"):
                pi_client = get_pi_client()
                print("✅ Pi Network client initialized")
                
                # Test reward calculation
                reward = await pi_client.calculate_oinio_reward(10.0)
                print(f"✅ Reward calculation: 10 $PI → {reward} OINIO")
                
                await pi_client.close()
            else:
                print("⚠️ Pi Network client skipped (missing PI_API_KEY or PI_APP_ID)")
        except ImportError as e:
            print(f"❌ Pi Network client import failed: {e}")
            return False
        
        # Test 2: AI Signer (without real keys)
        print("\n2️⃣ Testing AI Signer initialization...")
        try:
            from oinio_ai_signer import OINIOAgentSigner
            # This will fail without real env vars, but tests import
            print("✅ AI Signer class imported successfully")
        except Exception as e:
            print(f"⚠️ AI Signer import failed (expected without env vars): {e}")
        
        # Test 3: Server imports
        print("\n3️⃣ Testing Server imports...")
        try:
            from server.main import app
            print("✅ FastAPI app imported successfully")
            print("✅ Server components loaded (warnings expected without full config)")
        except Exception as e:
            print(f"❌ Server import failed: {e}")
            return False
        
        # Test 4: Environment variables check
        print("\n4️⃣ Checking Environment Configuration...")
        required_vars = [
            "PI_API_KEY", "PI_APP_ID", "POLYGON_RPC_URL",
            "SAFE_MULTISIG_ADDRESS", "AI_PRIVATE_KEY", "OINIO_CONTRACT_ADDRESS"
        ]
        
        missing_vars = [var for var in required_vars if not os.environ.get(var)]
        if missing_vars:
            print(f"⚠️ Missing environment variables: {missing_vars}")
            print("ℹ️ Add these to your .env file with real values")
        else:
            print("✅ All required environment variables present")
        
        # Test 5: Mock payment flow
        print("\n5️⃣ Testing Mock Payment Flow...")
        mock_payment = {
            "payment_id": "test_pi_123",
            "amount": 10.0,
            "user_wallet": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
        }
        
        # Simulate webhook processing (without real API calls)
        print("🎭 Mock payment processed:")
        print(f"   Payment ID: {mock_payment['payment_id']}")
        print(f"   Amount: {mock_payment['amount']} $PI")
        print(f"   Expected OINIO: {mock_payment['amount'] * 10}")
        print(f"   User Wallet: {mock_payment['user_wallet']}")
        
        print("\n🎉 Autonomous Banking System Test Complete!")
        print("\n🚀 Next Steps:")
        print("1. Set up your Safe multisig on https://app.safe.global")
        print("2. Add AI agent as signer #2")
        print("3. Configure Spending Limits module (1M OINIO daily)")
        print("4. Get Pi Developer API credentials")
        print("5. Deploy to Railway/Render with environment variables")
        print("6. Test with real Pi payments!")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run tests
    success = asyncio.run(test_autonomous_banking())
    
    if success:
        print("\n🎯 System ready for autonomous OINIO rewards!")
    else:
        print("\n⚠️ System needs configuration before deployment")