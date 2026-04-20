# Troubleshooting Guide

## Common Issues

---

### ❌ Ollama not found
**Fix:** Install Ollama first from https://ollama.com then re-run installer.

---

### ❌ Model pull fails
**Fix:**
```bash
ollama serve
# Wait 10 seconds then try again
```

---

### ❌ Python venv error
**Fix:** Install python3 venv package:
```bash
# Debian/Ubuntu
sudo apt install python3-venv

# Fedora/RHEL
sudo dnf install python3-virtualenv
```

---

### ❌ Low RAM warnings
This is normal. The 3B model runs perfectly on 8GB systems.

---

### 📞 Critical Issues Only
Email: support@quantumpi.io

**Note:** This is a sovereign product. There is no Discord. All necessary information is included in this package.