# 🚀 Quick Start Guide - Pi Forge Quantum Genesis

Welcome to Pi Forge Quantum Genesis! This guide will help you get started based on your role.

---

## 👥 Choose Your Path

- [For Users](#for-users) - Explore and interact with the platform
- [For Contributors](#for-contributors) - Join the community and contribute
- [For Developers](#for-developers) - Build and extend the system
- [For Guardians](#for-guardians) - Oversee autonomous operations

---

## 🌟 For Contributors

### Welcome to the Community!

Pi Forge Quantum Genesis thrives through collaborative ownership. Whether you're contributing code, documentation, ideas, or support, you're valued here.

#### Getting Started

**1. Read the [Space Rituals](./SPACE_RITUALS.md)**
- Learn about our engagement ceremonies and protocols
- Understand handoff procedures and celebration practices
- See how we maintain non-hierarchical, transparent collaboration

**2. Check Out [CONTRIBUTORS.md](../CONTRIBUTORS.md)**
- See the community roster
- Learn different ways to contribute
- Understand recognition and appreciation practices

**3. Find Your First Contribution**
- Browse issues labeled `good first issue` or `help wanted`
- Read existing documentation and propose improvements
- Join discussions and ask questions
- Review pull requests and provide feedback

#### Your First Contribution

When you make your first contribution (issue, PR, or discussion), you'll receive the **Dawn Ritual** welcome:
- Links to key documentation
- Introduction to the community
- Guidance on next steps

No gatekeeping—all documentation is public, and autonomy is respected.

#### Canon Check

All contributions should reinforce:
- ✅ **Sovereignty** - Contributor autonomy and empowerment
- ✅ **Transparency** - Open documentation and decision-making
- ✅ **Collaborative Ownership** - Distributed power and value
- ✅ **Flexibility** - Rituals serve us, we don't serve them

---

## 👤 For Users

### Explore the Platform

> **Deployment Status:** See [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) for current endpoint status.

#### 1. View System Status

**Production API (Railway):** ✅ Live (Verified: Dec 21, 2025)
```bash
# Check overall health
curl https://pi-forge-quantum-genesis.railway.app/api/health

# View guardian dashboard
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .

# Check Pi Network integration
curl https://pi-forge-quantum-genesis.railway.app/api/pi-network/status | jq .
```

#### 2. Access Dashboards

**Production Dashboard** (Flask - Port 5000)
- Visit: `http://localhost:5000` (local) or deployed URL
- View: Quantum resonance visualizations
- Features: Real-time SVG animations, 4-phase cascade

**Gradio Interface** (Port 7860)
- Visit: `http://localhost:7860` (local) or deployed URL
- Use: Ethical AI audit tools
- Features: Model evaluation, bias detection

#### 3. Explore Smart Contracts

**OINIO Token (ERC-20)**
- View on Pi Network block explorer
- Check your balance: `token.balanceOf(yourAddress)`
- Transfer tokens: `token.transfer(recipient, amount)`

**Model Registry (ERC-721)**
- Browse registered AI models
- View model metadata
- Check creator information

### Authentication Flow

1. **Register/Login**
   ```bash
   # Register new account
   curl -X POST https://pi-forge-quantum-genesis.railway.app/api/register \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "secure_password"}'

   # Login
   curl -X POST https://pi-forge-quantum-genesis.railway.app/api/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "secure_password"}'
   ```

2. **Use JWT Token**
   - Receive JWT token in login response
   - Include in subsequent requests: `Authorization: Bearer <token>`

### Make a Payment (Pi Network)

1. **Initiate Payment** (Frontend via Pi SDK)
   ```javascript
   const payment = await Pi.createPayment({
     amount: 0.15,
     memo: "OINIO Model Access",
     metadata: { modelId: "123" }
   });
   ```

2. **Backend Verification**
   - System automatically verifies payment
   - Triggers resonance visualization
   - Records in database

3. **View Transaction**
   ```bash
   # Check payment status
   curl https://pi-forge-quantum-genesis.railway.app/api/payments/{payment_id}
   ```

### Need Help?

- **Documentation**: [docs/](https://github.com/onenoly1010/pi-forge-quantum-genesis/tree/main/docs)
- **Issues**: [Report a bug](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues)
- **Community**: [Discussions](https://github.com/onenoly1010/pi-forge-quantum-genesis/discussions)

---

## 💻 For Developers

### Prerequisites

- Python 3.11+
- Node.js 18+ (for Vercel functions)
- Git
- PostgreSQL (or Supabase account)
- Foundry (for smart contracts)

### Initial Setup

#### 1. Clone Repository

```bash
git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.git
cd pi-forge-quantum-genesis
```

#### 2. Environment Setup

**Create virtual environment**:
```bash
python3 -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

**Install dependencies**:
```bash
# Python dependencies
pip install -r server/requirements.txt

# Node dependencies (for Vercel)
npm install
```

#### 3. Configure Environment Variables

```bash
# Copy example
cp .env.example .env

# Edit .env with your values
```

**Required Variables**:
```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-secret-key

# Pi Network
PI_NETWORK_MODE=testnet  # or mainnet
PI_NETWORK_APP_ID=your-app-id
PI_NETWORK_API_KEY=your-api-key
PI_NETWORK_WEBHOOK_SECRET=your-webhook-secret

# Optional
PORT=8000
FLASK_PORT=5000
GRADIO_PORT=7860
```

#### 4. Database Setup

**Using Supabase**:
1. Create a Supabase project
2. Run migrations:
   ```bash
   # Copy SQL to Supabase SQL Editor
   cat supabase_migrations/001_payments_schema.sql
   ```

**Local PostgreSQL** (Alternative):
```bash
createdb pi_forge
psql pi_forge < supabase_migrations/001_payments_schema.sql
```

### Running Services

#### Option 1: All Services (PowerShell Script)

```powershell
# Windows
.\scripts\run.ps1
```

#### Option 2: Individual Services

**FastAPI (Port 8000)**:
```bash
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

**Flask (Port 5000)**:
```bash
python server/app.py
```

**Gradio (Port 7860)**:
```bash
python server/canticle_interface.py
```

### Development Workflow

#### 1. Make Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes to code
# ...

# Check status
git status
```

#### 2. Test Changes

**Run tests**:
```bash
# All tests
pytest server/ -v

# Specific test file
pytest server/test_main.py -v

# With coverage
pytest server/ --cov=server --cov-report=html
```

**Manual testing**:
```bash
# Test health endpoint
curl http://localhost:8000/

# Test authentication
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'
```

#### 3. Code Quality

**Linting** (if configured):
```bash
# Run linter
flake8 server/

# Format code
black server/
```

#### 4. Commit and Push

```bash
# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/your-feature-name
```

#### 5. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template
5. Request review

### Smart Contract Development

#### Setup

```bash
cd contracts

# Install dependencies
forge install

# Verify installation
forge --version
```

#### Development Cycle

**1. Write contracts** in `src/`:
```solidity
// src/MyContract.sol
pragma solidity ^0.8.20;

contract MyContract {
    // Your code here
}
```

**2. Write tests** in `test/`:
```solidity
// test/MyContract.t.sol
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyContract.sol";

contract MyContractTest is Test {
    function testExample() public {
        // Your test here
    }
}
```

**3. Compile**:
```bash
forge build
```

**4. Test**:
```bash
# Run all tests
forge test

# Run with verbosity
forge test -vv

# Run specific test
forge test --match-test testExample

# Gas report
forge test --gas-report
```

**5. Deploy to Testnet**:
```bash
# Configure .env
export PRIVATE_KEY=0x...
export RPC_URL_TESTNET=https://api.testnet.minepi.com/rpc

# Deploy
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_TESTNET \
  --private-key $PRIVATE_KEY \
  --broadcast
```

**6. Verify**:
```bash
# Test deployed contract
cast call <contract-address> "totalSupply()" --rpc-url $RPC_URL_TESTNET
```

### API Development

#### Add New Endpoint

**1. Define route in `server/main.py`**:
```python
@app.get("/api/my-endpoint")
async def my_endpoint():
    return {"message": "Hello, World!"}
```

**2. Add authentication** (if needed):
```python
from server.main import get_current_user

@app.get("/api/protected")
async def protected_endpoint(user = Depends(get_current_user)):
    return {"user_id": user.id}
```

**3. Test endpoint**:
```bash
curl http://localhost:8000/api/my-endpoint
```

**4. Add tests**:
```python
# server/test_main.py
def test_my_endpoint():
    response = client.get("/api/my-endpoint")
    assert response.status_code == 200
    assert response.json()["message"] == "Hello, World!"
```

### Debugging

#### FastAPI Debug Mode

```python
# server/main.py
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, log_level="debug")
```

#### Flask Debug Mode

```python
# server/app.py
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

#### Python Debugger

```python
# Add breakpoint in code
import pdb; pdb.set_trace()

# Or use Python 3.7+
breakpoint()
```

### Common Issues

**Issue**: `Module not found`
```bash
# Solution: Install dependencies
pip install -r server/requirements.txt
```

**Issue**: `Port already in use`
```bash
# Solution: Kill process on port
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Issue**: `Database connection failed`
```bash
# Solution: Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_KEY

# Verify Supabase connection
python -c "from supabase import create_client; import os; print(create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY')))"
```

### Resources

- **API Docs**: Auto-generated at `http://localhost:8000/docs`
- **Architecture**: [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
- **Pi Network Integration**: [docs/PI_NETWORK_INTEGRATION.md](./PI_NETWORK_INTEGRATION.md)
- **Smart Contracts**: [contracts/README.md](../contracts/README.md)

---

## 🛡️ For Guardians

### Overview

As a Guardian, you oversee autonomous operations and make critical decisions. The system is designed to operate autonomously with confidence-based decision-making, escalating only when human judgment is required.

### Prerequisites

- GitHub account with repository access
- Understanding of system architecture
- Familiarity with Pi Network ecosystem
- Communication channel access (email, Slack, etc.)

### Getting Started

#### 1. Access Guardian Dashboard

**Local**:
```bash
curl http://localhost:8000/api/guardian/dashboard | jq .
```

**Production**:
```bash
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .
```

**Dashboard Contents**:
- Current system status
- Pending decisions requiring approval
- Recent autonomous actions
- Safety metrics
- Active alerts

#### 2. Review Escalated Decisions

**Check GitHub Issues**:
- Go to [Issues](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues)
- Filter by label: `guardian-decision`
- Review pending decisions

**Decision Information**:
- Decision type (deployment, scaling, rollback, etc.)
- Confidence score
- Parameters and reasoning
- Recommended action
- Risk assessment

#### 3. Approve or Reject Decisions

**Via API**:
```bash
# Approve decision
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/approve/{decision_id} \
  -H "Authorization: Bearer <guardian-token>" \
  -H "Content-Type: application/json" \
  -d '{"approved": true, "comments": "Looks good"}'

# Reject decision
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/approve/{decision_id} \
  -H "Authorization: Bearer <guardian-token>" \
  -H "Content-Type: application/json" \
  -d '{"approved": false, "comments": "Needs more investigation"}'
```

**Via GitHub**:
- Comment on decision issue
- Use keywords: `@guardian approve` or `@guardian reject`
- System will process command

### Daily Operations

#### Morning Routine (5-10 minutes)

1. **Check Dashboard**
   ```bash
   curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .
   ```

2. **Review Health Report**
   - Check [Issue #76](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/76)
   - Verify all systems healthy

3. **Check Pending Decisions**
   - Review escalated decisions
   - Approve or schedule for detailed review

#### Throughout the Day

- Monitor alerts (email, Slack, etc.)
- Respond to critical escalations (< 1 hour)
- Review high-priority decisions (< 4 hours)
- Check dashboard periodically

#### End of Day (5 minutes)

1. **Final Dashboard Check**
2. **Review Day's Decisions**
   ```bash
   curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?limit=50 | jq .
   ```
3. **Check Metrics**
   ```bash
   curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/metrics | jq .
   ```

### Emergency Procedures

#### Level 1: Minor Issue (Self-Healing)

**System handles automatically**:
- Performance degradation
- Minor service disruptions
- Routine errors

**Your action**: Monitor only

#### Level 2: Moderate Issue (Guardian Approval)

**System escalates**:
- Significant configuration changes
- Major deployments
- Resource scaling decisions

**Your action**: Review and approve/reject

#### Level 3: Critical Issue (Immediate Action)

**Indicators**:
- Complete service outage
- Security breach
- Data integrity issues
- Financial anomalies

**Your action**:
1. **Assess severity** (1-5 scale)
2. **Emergency stop** (if needed):
   ```bash
   # Stop all autonomous operations
   curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/emergency-stop \
     -H "Authorization: Bearer <guardian-token>"
   ```
3. **Trigger rollback** (if needed):
   ```bash
   # See rollback/README.md for procedures
   ./rollback/scripts/emergency-rollback.sh --fast
   ```
4. **Notify team**
5. **Document incident**

### Decision Templates

#### Deployment Decision

**Review Checklist**:
- [ ] Tests passed?
- [ ] Code reviewed?
- [ ] No security vulnerabilities?
- [ ] Rollback plan ready?
- [ ] Impact assessment done?

**Approval Criteria**:
- Confidence >= 0.8 (auto-approved)
- Confidence 0.6-0.8 (guardian review)
- Confidence < 0.6 (rejected or detailed analysis)

#### Scaling Decision

**Review Checklist**:
- [ ] Resource metrics justify scaling?
- [ ] Cost impact acceptable?
- [ ] No ongoing incidents?
- [ ] Scaling pattern normal?

#### Rollback Decision

**Review Checklist**:
- [ ] Root cause identified?
- [ ] Data preserved?
- [ ] User impact assessed?
- [ ] Rollback tested?

### Monitoring & Alerts

#### Alert Channels

- **Email**: Critical alerts sent to guardian email
- **GitHub Issues**: Decision escalations
- **Dashboard**: Real-time status
- **Slack** (if configured): Team notifications

#### Alert Priorities

1. **Critical** (Immediate): Security, outages, data issues
2. **High** (< 1 hour): Major functionality, performance
3. **Medium** (< 4 hours): Minor issues, optimization
4. **Low** (< 24 hours): Informational, metrics

### Communication

#### With AI Assistant (@app/copilot-swe-agent)

**Issue #102**: AI assistant for 24/7 triage
- Responds to routine questions
- Provides initial analysis
- Escalates complex issues
- Suggests solutions

**How to interact**:
- Comment on issues: `@app/copilot-swe-agent <your question>`
- Tag in PRs for review
- Request analysis of metrics

#### With Team

- Document all major decisions
- Share context in issue comments
- Update guardian playbook with learnings
- Regular sync meetings (weekly recommended)

### Best Practices

1. **Trust but Verify**
   - System is designed for autonomy
   - Spot-check autonomous decisions
   - Verify critical actions

2. **Document Everything**
   - All approvals/rejections
   - Reasoning for decisions
   - Lessons learned

3. **Stay Informed**
   - Read system updates
   - Review architecture changes
   - Understand new features

4. **Be Responsive**
   - Check dashboard daily
   - Respond to critical alerts promptly
   - Set up reliable notifications

5. **Learn and Improve**
   - Analyze decision patterns
   - Adjust thresholds as needed
   - Share feedback with team

### Resources

- **Guardian Playbook**: [docs/GUARDIAN_PLAYBOOK.md](./GUARDIAN_PLAYBOOK.md) (detailed procedures)
- **Quick Reference**: [docs/GUARDIAN_QUICK_REFERENCE.md](./GUARDIAN_QUICK_REFERENCE.md)
- **Guardian HQ**: [Issue #100](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100)
- **AI Assistant**: [Issue #102](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/102)
- **Decision Templates**: [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/)

### Getting Help

- **Emergency**: Contact lead guardian (@onenoly1010)
- **Questions**: Use AI assistant or create issue
- **Feedback**: Comment on Guardian HQ issue
- **Training**: Review documentation and past decisions

---

## 🎉 You're Ready!

You now have the knowledge to get started with Pi Forge Quantum Genesis in your role. Remember:

- **Users**: Explore, interact, and provide feedback
- **Developers**: Build, test, and contribute
- **Guardians**: Oversee, approve, and ensure safety

### Next Steps

1. **Complete setup** for your role
2. **Explore the system** hands-on
3. **Read relevant documentation**
4. **Join the community**

### Community

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Pull Requests**: Contribute code and documentation

---

## 📚 Additional Resources

- [Main README](../README.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Pi Network Integration](./PI_NETWORK_INTEGRATION.md)
- [Smart Contracts](../contracts/README.md)
- [Autonomous Handover](./AUTONOMOUS_HANDOVER.md)
- [Succession Ceremony](./SUCCESSION_CEREMONY.md)

---

**Last Updated**: December 2025  
**Version**: 2.0  

**Welcome to the future of autonomous AI governance! 🌌**
