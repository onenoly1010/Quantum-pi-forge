# Fully Autonomous Local AI Workspace - Linux Mint
## Layered Architecture Implementation Guide

---

## ✅ CURRENT STATUS
- Ollama 0.20.4 ✅ INSTALLED
- Python Agent Stack: OPEN INTERPRETER + CREWAI + LANGGRAPH + CHROMADB ✅ INSTALLING IN BACKGROUND
- Docker: PENDING (requires sudo password for apt installation)

---

## 🔧 LAYER 1: SYSTEM FOUNDATION (LINUX MINT OPTIMIZATIONS)

### 1.1 GPU DRIVER CONFIGURATION
```bash
# For NVIDIA (RECOMMENDED 580+ DRIVERS)
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update
sudo apt install nvidia-driver-580 nvidia-cuda-toolkit

# For AMD ROCm
echo "deb [arch=amd64] https://repo.radeon.com/rocm/apt/6.2 jammy main" | sudo tee /etc/apt/sources.list.d/rocm.list
```

### 1.2 PERFORMANCE MODE
```bash
# Install envycontrol for GPU switching
sudo apt install envycontrol
sudo envycontrol -s nvidia

# Verify dGPU is active
nvidia-smi
```

### 1.3 DOCKER & NVIDIA CONTAINER TOOLKIT
```bash
# Docker installation
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# NVIDIA Container Runtime
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
sudo apt install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

---

## 🧠 LAYER 2: INFERENCE ENGINE & MEMORY

### 2.1 OLLAMA CONFIGURATION
```bash
# Enable network access for agents
echo "OLLAMA_HOST=0.0.0.0" >> ~/.profile
echo "OLLAMA_NUM_PARALLEL=4" >> ~/.profile
source ~/.profile

# Pull recommended models
# Fast autonomy:
ollama pull llama3.2:3b
ollama pull phi3.5

# Advanced reasoning:
ollama pull deepseek-r1:14b
ollama pull mistral-nemo:12b
```

### 2.2 LOCAL VECTOR DATABASE (CHROMA DB)
```bash
# Run local persistent vector database
docker run -d -p 8000:8000 -v ./chroma:/chroma/chroma chromadb/chroma:latest
```

---

## 🤖 LAYER 3: AGENT FRAMEWORK

### 3.1 AGENT INSTALLATION
All packages are currently installing in the project virtual environment. Once complete:
```bash
# Activate workspace venv
source .venv/bin/activate

# Verify installation
interpreter --version
crewai version
```

### 3.2 OPEN INTERPRETER LOCAL MODE
```bash
# Start fully local system agent
interpreter --local --os --model ollama/llama3.2:3b
```

### 3.3 CREWAI MULTI-AGENT WORKFLOW
Create `agent_crew.py`:
```python
from crewai import Agent, Task, Crew
from langchain_ollama import ChatOllama

llm = ChatOllama(model="llama3.2:3b", base_url="http://localhost:11434")

# Define autonomous agents
architect = Agent(
    role="Senior System Architect",
    goal="Analyze and design optimal solutions",
    backstory="Expert at Linux system architecture and AI deployment",
    llm=llm,
    allow_delegation=True
)

executor = Agent(
    role="Execution Specialist",
    goal="Implement and run commands safely",
    backstory="Precise system operator with attention to security",
    llm=llm
)

auditor = Agent(
    role="Quality Assurance Auditor",
    goal="Verify results and correct errors",
    backstory="Detail oriented validator that catches mistakes",
    llm=llm
)
```

---

## 🔄 LAYER 4: SELF-CORRECTION LOOP (LANGGRAPH)

LangGraph provides the autonomous loop that allows agents to:
1.  ✅ Attempt action
2.  ✅ Read output/errors
3.  ✅ Self-correct approach
4.  ✅ Retry automatically
5.  ✅ Stop when successful

---

## 🚀 FINAL SYSTEM INTEGRATION

Add these aliases to `~/.bash_aliases`:
```bash
# Autonomous AI Workspace Commands
alias start-agent='source /home/kris/forge/Quantum-pi-forge/.venv/bin/activate && interpreter --local --os'
alias start-memory='docker start chromadb || docker run -d -p 8000:8000 -v /home/kris/forge/Quantum-pi-forge/chroma:/chroma/chroma --name chromadb chromadb/chroma'
alias ai-status='ollama ps && docker ps'
alias stop-ai='ollama stop --all && docker stop chromadb'
```

---

## 📋 OPERATION CHECKLIST

- [ ] Reboot after driver installation
- [ ] Logout/login after docker group change
- [ ] Verify `nvidia-smi` shows your GPU
- [ ] Test Ollama API: `curl http://localhost:11434/api/tags`
- [ ] Test Chroma: `curl http://localhost:8000/api/v1/heartbeat`
- [ ] Run first autonomous task: `start-agent` then ask "optimize this workspace"

---

## ⚡ PERFORMANCE PROFILES

| MODEL           | VRAM USE | SPEED | USE CASE                     |
|-----------------|----------|-------|------------------------------|
| Llama 3.2 3B    | ~2.1GB   | ✅ FAST | General autonomy, system tasks |
| Phi 3.5         | ~2.4GB   | ✅ EXTREMELY FAST | Code generation |
| DeepSeek R1 14B | ~8.5GB   | ⚡ GOOD | Advanced reasoning |
| Mistral Nemo 12B| ~7.2GB   | ⚡ GREAT | Complex problem solving |

---

### This workspace architecture provides:
✅ 100% local operation - no cloud dependencies
✅ Fully autonomous self-correcting execution loop
✅ Sandboxed container runtime
✅ Long term vector memory
✅ Multi-agent collaboration
✅ Optimized for Linux Mint stability