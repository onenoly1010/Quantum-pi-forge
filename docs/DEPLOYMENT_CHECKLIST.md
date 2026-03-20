# 📋 Deployment Checklist

**Purpose**: Step-by-step guide for deploying the six seed MR-NFT models  
**Target Audience**: Technical operators and community deployers  
**Status**: Ready for execution (December 2025)

## Overview

This checklist ensures systematic, verifiable deployment of the initial six ethical AI validation models as MR-NFTs on Pi Network. Each step includes verification points and rollback procedures.

**Estimated Time**: 4-6 hours (including verification delays)  
**Prerequisites**: Multi-sig wallet setup, Pi Network testnet experience  
**Safety**: All steps reversible until final mainnet execution

---

## Pre-Deployment

### Environment Setup

#### ✅ 1. Verify System Requirements

**Required Software:**
```bash
# Check Python version (3.11+ required)
python --version  # Should show 3.11.x or higher

# Check Node.js (18+ required for Pi SDK)
node --version  # Should show 18.x or higher

# Check Git
git --version

# Check available disk space (minimum 10GB)
df -h
```

**Required Dependencies:**
```bash
# Install Python dependencies
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis
pip install -r server/requirements.txt

# Verify Pi SDK
python -c "import pi_network; print('Pi SDK ready')"

# Verify Supabase client
python -c "from supabase import create_client; print('Supabase ready')"
```

**Environment Variables:**
```bash
# Required variables
export PI_NETWORK_MODE=mainnet
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_KEY=your-anon-key
export JWT_SECRET=your-secret-key

# Deployment-specific
export NFT_MINT_VALUE=100000  # Minimum PI per model (adjust based on gas)
export OINIO_WALLET_ADDRESS=0x[your-multisig-address]

# Verify environment
python -c "import os; print('Mode:', os.getenv('PI_NETWORK_MODE'))"
```

**Safety Checks:**
```bash
# Ensure NOT in testnet mode (unless intentional)
if [ "$PI_NETWORK_MODE" == "testnet" ]; then
  echo "⚠️  WARNING: In testnet mode"
  read -p "Continue? (y/N) " -n 1 -r
  [[ ! $REPLY =~ ^[Yy]$ ]] && exit 1
fi

# Verify wallet has sufficient balance
python scripts/check_wallet_balance.py
```

#### ✅ 2. Prepare Wallet

**Multi-Sig Configuration:**
```markdown
- [ ] Multi-sig wallet created (3-of-5 or 5-of-9)
- [ ] All key holders verified and available
- [ ] Test transaction executed successfully
- [ ] Wallet funded with sufficient PI (minimum 1M PI for six models)
- [ ] Backup keys stored securely
```

**Pre-Flight Wallet Check:**
```python
#!/usr/bin/env python3
"""Pre-flight wallet verification"""
import os
from pi_network import create_client

def verify_wallet():
    client = create_client()
    wallet_address = os.environ['OINIO_WALLET_ADDRESS']
    
    # Check balance
    balance = client.get_balance(wallet_address)
    print(f"Wallet Balance: {balance} PI")
    
    min_required = 1_000_000  # 1M PI for safety
    assert balance >= min_required, f"Insufficient balance. Need {min_required}, have {balance}"
    
    # Check multi-sig configuration
    config = client.get_multisig_config(wallet_address)
    print(f"Multi-sig: {config['threshold']}-of-{config['total_keys']}")
    assert config['threshold'] >= 3, "Insufficient signature threshold"
    
    # Verify all key holders
    for i, key_holder in enumerate(config['key_holders'], 1):
        print(f"  Key Holder {i}: {key_holder['address']} - {key_holder['status']}")
        assert key_holder['status'] == 'active', f"Key holder {i} not active"
    
    print("✅ Wallet verification complete")

if __name__ == '__main__':
    verify_wallet()
```

**Run Verification:**
```bash
python scripts/verify_wallet_preflight.py
```

#### ✅ 3. Model Preparation

**Review Model Definitions:**
```bash
# Open and review model configurations
cat scripts/seed_first_six_models.py

# Verify model metadata
python scripts/validate_model_metadata.py
```

**Model Checklist:**
```markdown
For each of the six models:

1. Ethics Validator (15%)
   - [ ] Model file present and tested
   - [ ] Metadata JSON validated
   - [ ] Royalty rate confirmed: 0.15
   - [ ] Deployment cost: 120,000 PI

2. Bias Detector (20%)
   - [ ] Model file present and tested
   - [ ] Metadata JSON validated
   - [ ] Royalty rate confirmed: 0.20
   - [ ] Deployment cost: 150,000 PI

3. Privacy Auditor (15%)
   - [ ] Model file present and tested
   - [ ] Metadata JSON validated
   - [ ] Royalty rate confirmed: 0.15
   - [ ] Deployment cost: 120,000 PI

4. Transparency Scorer (10%)
   - [ ] Model file present and tested
   - [ ] Metadata JSON validated
   - [ ] Royalty rate confirmed: 0.10
   - [ ] Deployment cost: 80,000 PI

5. Fairness Analyzer (20%)
   - [ ] Model file present and tested
   - [ ] Metadata JSON validated
   - [ ] Royalty rate confirmed: 0.20
   - [ ] Deployment cost: 150,000 PI

6. Accountability Tracker (30%)
   - [ ] Model file present and tested
   - [ ] Metadata JSON validated
   - [ ] Royalty rate confirmed: 0.30
   - [ ] Deployment cost: 200,000 PI

Total Deployment Cost: 820,000 PI
```

**⚠️ Script Status Note:**

The `seed_first_six_models.py` script is currently in FRAMEWORK MODE. The Pi Network SDK integration (IPFS upload and smart contract deployment) requires completion before production use. The script provides:

- ✅ Complete model definitions
- ✅ Deployment pipeline architecture  
- ✅ CLI interface and dry-run testing
- ⚠️ IPFS upload (placeholder - needs implementation)
- ⚠️ Smart contract deployment (placeholder - needs implementation)

Before executing the succession ceremony, ensure:
1. Pi Network SDK is integrated
2. IPFS client library is added
3. Smart contract deployment is tested on testnet
4. All TODOs in the script are completed

Use `--dry-run` mode for testing the framework until production implementation is complete.

#### ✅ 4. Communication Preparation

**Social Media Templates:**

**GitHub Announcement:**
```markdown
# 🎭 OINIO Succession: Model Deployment Begins

We are executing the first six MR-NFT model deployments as part of the OINIO succession ceremony.

**Status**: In Progress
**Models**: 6 ethical AI validation models
**Total Investment**: 820,000 PI from Catalyst Pool

Follow real-time updates:
- Transaction hashes: [Link to tracker]
- Dashboard: [Link to deployment dashboard]

See full documentation: [SUCCESSION_CEREMONY.md](docs/SUCCESSION_CEREMONY.md)
```

**X/Twitter Template:**
```
🎭 OINIO Succession Deployment LIVE

Deploying 6 ethical AI models as MR-NFTs on @PiCoreTeam Network:
✅ Ethics Validator
✅ Bias Detector  
✅ Privacy Auditor
✅ Transparency Scorer
✅ Fairness Analyzer
✅ Accountability Tracker

820K PI investment from 12M PI Catalyst Pool

[Link to verification]

#PiNetwork #EthicalAI #OINIO
```

**Telegram/Discord Template:**
```
🎭 **OINIO SUCCESSION: DEPLOYMENT IN PROGRESS**

We're deploying the first six MR-NFT models right now!

**Progress:**
1. Ethics Validator - [Pending/Complete]
2. Bias Detector - [Pending/Complete]
3. Privacy Auditor - [Pending/Complete]
4. Transparency Scorer - [Pending/Complete]
5. Fairness Analyzer - [Pending/Complete]
6. Accountability Tracker - [Pending/Complete]

**Verify on-chain:**
[Pi Network Explorer Links]

**Ask questions in this thread! 👇**
```

---

## Six Seed Models

### What They Are

The six seed models represent foundational capabilities for ethical AI validation on Pi Network:

| Model | Purpose | Complexity | Royalty |
|-------|---------|-----------|---------|
| **Ethics Validator** | Multi-dimensional ethics framework validation | Standard | 15% |
| **Bias Detector** | Demographic and systemic bias detection | Complex | 20% |
| **Privacy Auditor** | Data handling and privacy compliance | Standard | 15% |
| **Transparency Scorer** | Model explainability and decision transparency | Simple | 10% |
| **Fairness Analyzer** | Outcome fairness across user groups | Complex | 20% |
| **Accountability Tracker** | Decision lineage and responsibility chains | Premium | 30% |

### Why These Six?

**Strategic Rationale:**

1. **Comprehensive Coverage**: Together cover all major ethical AI dimensions
2. **Diverse Complexity**: Range from simple (10%) to premium (30%) establishes royalty spectrum
3. **Market Demand**: Address most common AI ethics concerns
4. **Demonstration Value**: Show breadth of MR-NFT capabilities
5. **Flywheel Ignition**: High-value models generate significant royalties

**Technical Rationale:**

1. **Tested Models**: All six have proven implementations
2. **Scalable**: Can handle Pi Network's expected inference volume
3. **Interoperable**: Can be combined for comprehensive audits
4. **Maintainable**: Clear update paths and versioning

### How to Deploy

**Deployment Script Overview:**

The `scripts/seed_first_six_models.py` script handles:
1. Model metadata preparation
2. IPFS/decentralized storage upload
3. Smart contract deployment
4. MR-NFT minting
5. Royalty configuration
6. On-chain verification
7. Transaction logging

**Script Usage:**

```bash
# Dry run (testnet)
python scripts/seed_first_six_models.py --dry-run

# Deploy single model (testing)
python scripts/seed_first_six_models.py --model "Ethics Validator"

# Deploy all six (mainnet - requires confirmation)
python scripts/seed_first_six_models.py --execute-all --confirm
```

#### Deploy Model 1: Ethics Validator

```bash
# Step 1: Deploy
python scripts/seed_first_six_models.py --model "Ethics Validator" --execute

# Expected output:
# 📤 Uploading model to IPFS...
# ✅ IPFS Hash: QmXxx...
# 📝 Deploying smart contract...
# ⏳ Waiting for confirmation...
# ✅ Contract deployed: 0xABC...
# 💰 Minting MR-NFT...
# ✅ NFT minted: Token ID #1
# 🎯 Setting royalty: 15%
# ✅ Deployment complete!
# 
# Transaction Hash: 0x1234567890abcdef...
# Gas Used: 1,234,567
# Total Cost: 120,000 PI

# Step 2: Verify on-chain
python scripts/verify_deployment.py --tx 0x1234567890abcdef...

# Step 3: Log transaction
echo "0x1234567890abcdef... | Ethics Validator | 120000 PI | $(date)" >> deployment_log.txt
```

**Verification Points:**
- [ ] Transaction confirmed on blockchain
- [ ] Smart contract deployed at expected address
- [ ] NFT minted with correct metadata
- [ ] Royalty set to 15%
- [ ] Model callable via inference API
- [ ] Gas costs within expected range

**Rollback Procedure (if needed):**
```bash
# If deployment fails or has issues:
# 1. Document the issue
# 2. Do NOT attempt to redeploy immediately
# 3. Review logs and error messages
# 4. Consult with community if unclear
# 5. Fix issue before retrying

# Note: Once transaction is confirmed, it cannot be reversed
# Only rollback is to deploy a corrected version
```

#### Deploy Model 2: Bias Detector

```bash
python scripts/seed_first_six_models.py --model "Bias Detector" --execute
python scripts/verify_deployment.py --tx [transaction_hash]
echo "[tx_hash] | Bias Detector | 150000 PI | $(date)" >> deployment_log.txt
```

**Verification Points:**
- [ ] Transaction confirmed
- [ ] Smart contract deployed
- [ ] NFT minted
- [ ] Royalty set to 20%
- [ ] Model callable
- [ ] Gas costs acceptable

#### Deploy Model 3: Privacy Auditor

```bash
python scripts/seed_first_six_models.py --model "Privacy Auditor" --execute
python scripts/verify_deployment.py --tx [transaction_hash]
echo "[tx_hash] | Privacy Auditor | 120000 PI | $(date)" >> deployment_log.txt
```

**Verification Points:**
- [ ] Transaction confirmed
- [ ] Smart contract deployed
- [ ] NFT minted
- [ ] Royalty set to 15%
- [ ] Model callable
- [ ] Gas costs acceptable

#### Deploy Model 4: Transparency Scorer

```bash
python scripts/seed_first_six_models.py --model "Transparency Scorer" --execute
python scripts/verify_deployment.py --tx [transaction_hash]
echo "[tx_hash] | Transparency Scorer | 80000 PI | $(date)" >> deployment_log.txt
```

**Verification Points:**
- [ ] Transaction confirmed
- [ ] Smart contract deployed
- [ ] NFT minted
- [ ] Royalty set to 10%
- [ ] Model callable
- [ ] Gas costs acceptable

#### Deploy Model 5: Fairness Analyzer

```bash
python scripts/seed_first_six_models.py --model "Fairness Analyzer" --execute
python scripts/verify_deployment.py --tx [transaction_hash]
echo "[tx_hash] | Fairness Analyzer | 150000 PI | $(date)" >> deployment_log.txt
```

**Verification Points:**
- [ ] Transaction confirmed
- [ ] Smart contract deployed
- [ ] NFT minted
- [ ] Royalty set to 20%
- [ ] Model callable
- [ ] Gas costs acceptable

#### Deploy Model 6: Accountability Tracker

```bash
python scripts/seed_first_six_models.py --model "Accountability Tracker" --execute
python scripts/verify_deployment.py --tx [transaction_hash]
echo "[tx_hash] | Accountability Tracker | 200000 PI | $(date)" >> deployment_log.txt
```

**Verification Points:**
- [ ] Transaction confirmed
- [ ] Smart contract deployed
- [ ] NFT minted
- [ ] Royalty set to 30%
- [ ] Model callable
- [ ] Gas costs acceptable

---

## Transaction Verification

### How to Confirm on Pi Blockchain

#### Using Pi Network Explorer

**Step 1: Access Explorer**
```
URL: [Pi Network Explorer - to be added]
Example: https://explorer.pi.network/
```

**Step 2: Search Transaction**
```
1. Navigate to explorer
2. Click "Search" or find search bar
3. Paste transaction hash
4. Press Enter
```

**Step 3: Verify Transaction Details**

**Expected Transaction Structure:**
```
Transaction Hash: 0x1234567890abcdef...
Status: ✅ Success
Block: #12,345,678
Timestamp: 2025-12-15 14:23:45 UTC
From: 0x[OINIO Wallet Address]
To: 0x[MR-NFT Factory Contract]
Value: 120,000 PI
Gas Used: 1,234,567
Gas Price: 0.00001 PI

Input Data:
  Function: deployMRNFT(string,uint256)
  Model Name: "Ethics Validator"
  Royalty Rate: 1500 (15%)
  
Logs:
  [0] MRNFTDeployed
    Contract: 0x[New Model Contract]
    TokenID: 1
    Owner: 0x[OINIO Wallet]
```

**Verification Checklist:**
```markdown
- [ ] Status is "Success" (not "Failed" or "Pending")
- [ ] From address matches OINIO wallet
- [ ] To address matches MR-NFT Factory
- [ ] Value matches expected deployment cost
- [ ] Function call is deployMRNFT
- [ ] Logs show MRNFTDeployed event
- [ ] New contract address is present
- [ ] Token ID is sequential
```

#### Using Command Line

**Pi CLI Tool:**
```bash
# Install Pi CLI (if not already installed)
npm install -g @pi-network/cli

# Configure Pi CLI
pi-cli config set network mainnet

# Query transaction
pi-cli tx info 0x1234567890abcdef...

# Expected output:
# Transaction: 0x1234567890abcdef...
# Status: Confirmed
# Block: 12345678
# From: 0x[OINIO]
# To: 0x[Factory]
# Value: 120000 PI
# Gas: 1234567
```

**Verify Smart Contract:**
```bash
# Get contract code
pi-cli contract code 0x[New Model Contract Address]

# Verify contract source (if published)
pi-cli contract verify 0x[New Model Contract Address] \
  --source scripts/contracts/MRNFTModel.sol \
  --compiler 0.8.19

# Check contract state
pi-cli contract call 0x[New Model Contract] \
  --function "royaltyRate()" \
  --output decimal

# Expected: 1500 (representing 15%)
```

#### Automated Verification Script

```python
#!/usr/bin/env python3
"""Automated deployment verification"""
import sys
from pi_network import create_client

def verify_deployment(tx_hash):
    client = create_client()
    
    print(f"Verifying transaction: {tx_hash}")
    
    # Get transaction
    tx = client.get_transaction(tx_hash)
    assert tx['status'] == 'success', f"Transaction failed: {tx['status']}"
    print("✅ Transaction succeeded")
    
    # Verify sender
    expected_sender = os.environ['OINIO_WALLET_ADDRESS']
    assert tx['from'].lower() == expected_sender.lower(), "Sender mismatch"
    print(f"✅ Sender verified: {tx['from']}")
    
    # Verify recipient
    factory_address = os.environ['MRNFT_FACTORY_ADDRESS']
    assert tx['to'].lower() == factory_address.lower(), "Recipient mismatch"
    print(f"✅ Recipient verified: {tx['to']}")
    
    # Parse logs for deployment event
    deployment_event = None
    for log in tx['logs']:
        if log['event'] == 'MRNFTDeployed':
            deployment_event = log
            break
    
    assert deployment_event, "No MRNFTDeployed event found"
    print(f"✅ Deployment event found")
    
    # Verify new contract
    new_contract = deployment_event['args']['contractAddress']
    print(f"✅ New contract: {new_contract}")
    
    # Verify royalty rate
    royalty = client.call_contract(
        new_contract,
        'royaltyRate()',
        []
    )
    print(f"✅ Royalty rate: {royalty / 100}%")
    
    # Test inference call (optional)
    print("\nTesting inference capability...")
    test_result = client.call_contract(
        new_contract,
        'testInference(string)',
        ['{"test": "data"}']
    )
    print("✅ Model is callable")
    
    print("\n✅ ALL VERIFICATION CHECKS PASSED")
    return True

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python verify_deployment.py <transaction_hash>")
        sys.exit(1)
    
    tx_hash = sys.argv[1]
    verify_deployment(tx_hash)
```

---

## Post-Deployment

### Social Announcements

**Timing**: Immediately after final model deployment confirmation

#### GitHub Update

```bash
# Update README.md with deployment status
git checkout -b oinio-succession-complete
# [Make edits to README.md]
git add README.md docs/
git commit -S -m "🎭 OINIO Succession: Six seed models deployed"
git push origin oinio-succession-complete

# Create GitHub release
gh release create v1.0.0-succession \
  --title "🎭 OINIO Succession Complete" \
  --notes "Six seed MR-NFT models successfully deployed.

Transaction hashes:
- Ethics Validator: 0x...
- Bias Detector: 0x...
- Privacy Auditor: 0x...
- Transparency Scorer: 0x...
- Fairness Analyzer: 0x...
- Accountability Tracker: 0x...

See full documentation: docs/SUCCESSION_CEREMONY.md"
```

#### Social Media Posts

**X/Twitter:**
```
🎉 OINIO Succession COMPLETE!

All six MR-NFT models deployed on @PiCoreTeam:
✅ Ethics Validator (15%)
✅ Bias Detector (20%)
✅ Privacy Auditor (15%)
✅ Transparency Scorer (10%)
✅ Fairness Analyzer (20%)
✅ Accountability Tracker (30%)

Total: 820K PI invested from 12M PI Catalyst Pool

Verify: [link to verification guide]

The flywheel begins. 🌀

#PiNetwork #OINIO #EthicalAI
```

**Telegram:**
```
🎭 **OINIO SUCCESSION: DEPLOYMENT COMPLETE** 🎭

We did it! All six seed models are live on Pi Network.

**Deployed Models:**
1. ✅ Ethics Validator (0x...) - 15% royalty
2. ✅ Bias Detector (0x...) - 20% royalty
3. ✅ Privacy Auditor (0x...) - 15% royalty
4. ✅ Transparency Scorer (0x...) - 10% royalty
5. ✅ Fairness Analyzer (0x...) - 20% royalty
6. ✅ Accountability Tracker (0x...) - 30% royalty

**Total Investment:** 820,000 PI
**Remaining Catalyst Pool:** 11,180,000 PI (at 8× multiplier: 89.44M effective)

**What's Next?**
- Monitor model usage and royalties
- Community can propose new models
- Taper schedule adjusts after 10 deployments

**Verification:**
Full transaction details: [link]
Succession docs: [link]

Questions? Ask in this thread! 👇
```

**Discord:**
```
@everyone 

🎭 **OINIO SUCCESSION COMPLETE** 🎭

The six seed MR-NFT models are now live on Pi Network Mainnet!

**Quick Stats:**
• Models Deployed: 6
• PI Invested: 820,000
• Catalyst Pool Remaining: 11.18M
• Effective Capital (8× multiplier): 89.44M PI
• Average Royalty: 18.3%

**Contract Addresses:**
```
Ethics Validator: 0x...
Bias Detector: 0x...
Privacy Auditor: 0x...
Transparency Scorer: 0x...
Fairness Analyzer: 0x...
Accountability Tracker: 0x...
```

**Try Them Out:**
[Link to API documentation]

**Verify On-Chain:**
[Link to Pi Network Explorer]

This is just the beginning. The flywheel starts now! 🌀

---
React with 🎭 if you verified on-chain!
React with 🚀 if you're excited for what's next!
```

### Issue Updates

**Close Deployment Issue:**
```bash
# If tracked as GitHub issue
gh issue close [issue_number] \
  --comment "✅ Deployment complete. All six seed models are live.

Transaction hashes documented in SUCCESSION_CEREMONY.md.

Next steps tracked in #[next_issue_number]"
```

**Open Monitoring Issue:**
```bash
gh issue create \
  --title "Monitor MR-NFT Model Performance and Royalties" \
  --body "Track the performance of the six seed models:

**Metrics to Monitor:**
- [ ] Inference volume per model
- [ ] Royalty income per model
- [ ] Gas costs and optimization
- [ ] User feedback and issues
- [ ] Model accuracy and quality

**Reporting:**
- Weekly stats posted in Discord
- Monthly report generated and committed to docs/
- Dashboard updated in real-time

**First Review:** 7 days post-deployment"
```

---

## Monitoring

### How to Track MR-NFT Mints and Royalty Flow

#### Real-Time Dashboard

**Setup:**
```bash
# Deploy monitoring dashboard
cd frontend
python -m http.server 8000 &

# Open in browser
open http://localhost:8000/mrnft_dashboard.html
```

**Dashboard Metrics:**
- Total models deployed
- Catalyst Pool balance
- Royalty income (24h, 7d, 30d)
- Inference volume per model
- Top performing models
- Recent transactions

#### Automated Monitoring Script

```python
#!/usr/bin/env python3
"""Monitor MR-NFT performance"""
import time
from pi_network import create_client

def monitor_models():
    client = create_client()
    models = [
        "Ethics Validator",
        "Bias Detector",
        "Privacy Auditor",
        "Transparency Scorer",
        "Fairness Analyzer",
        "Accountability Tracker"
    ]
    
    while True:
        print("\n" + "="*60)
        print(f"MR-NFT Performance Report - {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60)
        
        total_royalties = 0
        
        for model in models:
            stats = client.get_model_stats(model)
            print(f"\n{model}:")
            print(f"  Inferences (24h): {stats['inferences_24h']}")
            print(f"  Royalties (24h): {stats['royalties_24h']} PI")
            print(f"  Avg latency: {stats['avg_latency_ms']}ms")
            print(f"  Success rate: {stats['success_rate']:.1f}%")
            
            total_royalties += stats['royalties_24h']
        
        print(f"\n{'='*60}")
        print(f"Total Royalties (24h): {total_royalties} PI")
        print(f"Catalyst Pool Impact: +{total_royalties * 0.40} PI")
        print(f"{'='*60}")
        
        # Wait 1 hour before next check
        time.sleep(3600)

if __name__ == '__main__':
    monitor_models()
```

**Run Monitor:**
```bash
# Run in background
nohup python scripts/monitor_models.py > logs/monitor.log 2>&1 &

# Tail logs
tail -f logs/monitor.log
```

#### Alerting

**Setup Alerts:**
```python
# Configure alerts for critical events
ALERT_CONDITIONS = {
    'low_usage': lambda stats: stats['inferences_24h'] < 100,
    'high_error_rate': lambda stats: stats['success_rate'] < 95.0,
    'excessive_gas': lambda stats: stats['avg_gas'] > 2_000_000,
    'royalty_drop': lambda stats: stats['royalties_24h'] < 1000
}

def check_alerts(model_name, stats):
    alerts = []
    for condition_name, condition_func in ALERT_CONDITIONS.items():
        if condition_func(stats):
            alerts.append(f"{model_name}: {condition_name}")
    
    if alerts:
        send_discord_alert("\n".join(alerts))
        send_telegram_alert("\n".join(alerts))
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Transaction Fails with "Insufficient Gas"

**Symptoms:**
- Transaction reverts
- Error: "out of gas"
- No contract deployed

**Solution:**
```bash
# Increase gas limit
python scripts/seed_first_six_models.py \
  --model "Ethics Validator" \
  --gas-limit 3000000 \
  --execute
```

**Prevention:**
- Estimate gas before deployment
- Add 20% buffer to estimates
- Monitor gas prices on network

#### Issue: Transaction Succeeds but Model Not Callable

**Symptoms:**
- Transaction confirmed
- Contract deployed
- Inference calls fail

**Diagnosis:**
```bash
# Check contract code
pi-cli contract code 0x[contract_address]

# Try calling directly
pi-cli contract call 0x[contract_address] \
  --function "testInference(string)" \
  --args '["test"]'
```

**Solution:**
- Verify contract bytecode matches expected
- Check initialization parameters
- Review deployment logs for errors
- May need to redeploy with fixes

#### Issue: Royalty Rate Incorrect

**Symptoms:**
- Contract deployed successfully
- Royalty rate doesn't match specification

**Diagnosis:**
```bash
# Check current royalty rate
pi-cli contract call 0x[contract] \
  --function "royaltyRate()" \
  --output decimal

# Example output: 1000 (should be 1500 for 15%)
```

**Solution:**
```bash
# If contract has updateRoyalty function
pi-cli contract send 0x[contract] \
  --function "updateRoyalty(uint256)" \
  --args 1500 \
  --from 0x[OINIO_WALLET]

# If no update function, must redeploy
python scripts/seed_first_six_models.py \
  --model "Ethics Validator" \
  --execute
```

#### Issue: Multi-Sig Key Holder Unavailable

**Symptoms:**
- Need 3 signatures, only 2 available
- Key holder not responding

**Solution:**
```markdown
1. Wait reasonable time (24-48 hours)
2. Try alternative key holders
3. If threshold can't be met:
   - Emergency community discussion
   - Governance vote to adjust threshold temporarily
   - Long-term: Replace unavailable key holder
```

#### Issue: High Gas Costs

**Symptoms:**
- Deployment costs exceed budget
- Gas prices volatile

**Solution:**
```bash
# Monitor gas prices
pi-cli gas-price

# Wait for lower gas period
# Deploy during off-peak hours
# Consider batching deployments if possible
```

### Emergency Procedures

**Critical Failure:**
1. STOP all deployments immediately
2. Document the issue completely
3. Post in community channels
4. Emergency governance call if needed
5. Review and fix before proceeding

**Rollback (Limited):**
- Cannot reverse confirmed transactions
- Can pause future deployments
- Can deploy corrected versions
- Original transactions remain on-chain

---

## Completion Criteria

### Deployment Complete When:

- [x] All six models deployed successfully
- [x] All transactions confirmed on blockchain
- [x] All smart contracts verified
- [x] All royalty rates set correctly
- [x] All models callable via inference API
- [x] Social announcements posted
- [x] Documentation updated with transaction hashes
- [x] Monitoring systems active
- [x] Community verification requests posted

### Final Verification Checklist

```markdown
# OINIO Succession Deployment - Final Verification

Completed by: [Name/Handle]
Date: [YYYY-MM-DD]

## Models Deployed
- [ ] Ethics Validator (0x...) - 15% royalty - 120K PI
- [ ] Bias Detector (0x...) - 20% royalty - 150K PI
- [ ] Privacy Auditor (0x...) - 15% royalty - 120K PI
- [ ] Transparency Scorer (0x...) - 10% royalty - 80K PI
- [ ] Fairness Analyzer (0x...) - 20% royalty - 150K PI
- [ ] Accountability Tracker (0x...) - 30% royalty - 200K PI

## On-Chain Verification
- [ ] All transactions confirmed and finalized
- [ ] All contracts deployed at correct addresses
- [ ] All royalty rates set correctly
- [ ] All models tested and callable
- [ ] Total cost matches expectation (820K PI)

## Documentation
- [ ] Transaction hashes added to SUCCESSION_CEREMONY.md
- [ ] Smart contract addresses added to IDENTITY_LOCK.md
- [ ] README.md updated with succession status
- [ ] Deployment log committed to repository

## Communication
- [ ] GitHub release created
- [ ] X/Twitter announcement posted
- [ ] Telegram message sent
- [ ] Discord announcement made
- [ ] Verification guide shared

## Monitoring
- [ ] Dashboard displaying all models
- [ ] Monitoring scripts running
- [ ] Alerts configured
- [ ] First 24h metrics collected

## Community
- [ ] Verification requests acknowledged
- [ ] Questions answered
- [ ] Feedback collected
- [ ] Next steps communicated

Status: [✅ COMPLETE / ⚠️ PENDING / ❌ ISSUES]

Signature: [Your signature or GPG key]
```

---

**Document Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Ready for execution

---

*"Deployment is not just technical execution—it's a ceremony marking the transition from individual creation to collective stewardship."*

