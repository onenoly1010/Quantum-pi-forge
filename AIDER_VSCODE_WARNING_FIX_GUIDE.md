# Aider VS Code Terminal Warning Fix Guide

If you are seeing these warnings in your **VS Code terminal** when starting `aider`, it usually means the shell environment inside VS Code isn't seeing your API keys or the specific model name you provided isn't in aider's internal database.

---

## Warning Categories

### Model Recognition Warnings
These occur when aider is unfamiliar with the specific model identifier provided.

* **Unknown Window Size & Costs:** If a model is unrecognized, aider defaults to an **unlimited context window** and assumes the model is **free**.
    * *Impact:* Generally low; functionality is usually unaffected.
    * *Resolution:* Can be ignored or fixed via advanced model settings.
* **"Did You Mean?":** Aider performs fuzzy matching to suggest similar model names (e.g., suggesting `gpt-4o` if you typed `gpt-5o`) to catch typos.

### Environment Variable Warnings
Aider requires specific credentials and configurations to communicate with different LLM providers.

* **Missing Variables:** Explicitly lists required variables (e.g., `AZURE_API_KEY`) that must be set in your environment to avoid startup errors.
    * *Windows Note:* After using `setx`, a terminal restart is required.
* **Unknown Requirements:** Occurs when aider doesn't know which variables a specific model needs. 
    * *Action:* Users should consult aider’s LLM docs or the **LiteLLM documentation** to identify the necessary credentials.

---

## Fix Procedures

### **1. Fix "Missing Environment Variables"**
The most reliable way to fix this in VS Code is using a `.env` file.

* **Create a `.env` file** in your project's root directory.
* **Add your keys** like this:
    ```env
    OPENAI_API_KEY=your-key-here
    ANTHROPIC_API_KEY=your-key-here
    ```
* **Restart Aider:** Aider automatically looks for a `.env` file in the current directory and will stop complaining once it finds the keys.

### **2. Fix "Unknown Context Window"**
This happens if you use a brand-new model (like `gpt-5o` in your example) or a local provider (like Ollama) that isn't hardcoded into aider yet.

Aider will default to "sane defaults" (assuming an unlimited window and $0 cost). It won't break the code-editing functionality. To remove the warning and help aider manage tokens better, create a `.aider.model.metadata.json` file in your project root:
```json
{
  "your-model-name": {
    "max_input_tokens": 128000,
    "input_price_per_k": 0.01,
    "output_price_per_k": 0.03
  }
}
```

### **3. Check for Typos**
If you see the **"Did you mean?"** warning, double-check your startup command.
* **Incorrect:** `aider --model gpt-4-thub`
* **Correct:** `aider --model gpt-4-turbo`
* **VS Code Tip:** If you use a specific model frequently, you can add `model: your-model-name` to a `.aider.conf.yml` file in your project so you don't have to type it every time.

---

### **Quick Checklist for VS Code users:**
1.  **Terminal Refresh:** If you just set environment variables on your system, you **must** close and reopen the VS Code terminal for it to "see" them.
2.  **Inherit Env:** Ensure your VS Code setting `Terminal > Integrated: Inherit Env` is checked.
3.  **Pathing:** Make sure you are running `aider` from the root of your git repo so it finds your `.env` or config files.
