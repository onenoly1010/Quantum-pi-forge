const fs = require('fs');
const { execSync } = require('child_process');

function checkOllama() {
  try {
    const output = execSync('ollama list', { stdio: 'pipe' }).toString();
    return output.includes('oinio') ? "model_present" : "ollama_running_no_model";
  } catch {
    return "not_available";
  }
}

function checkGit() {
  try {
    execSync('git status', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runHandshake() {
  const result = {
    system: "OINIO_SOUL_CORE",
    status: "initializing",
    checks: {
      filesystem: false,
      env: false,
      memory: false,
      git: false,
      ollama: "unknown"
    },
    timestamp: new Date().toISOString()
  };

  try {
    // Filesystem
    fs.accessSync('.', fs.constants.R_OK);
    result.checks.filesystem = true;

    // Environment
    result.checks.env = !!process.version;

    // Memory
    result.checks.memory = process.memoryUsage().heapUsed > 0;

    // Git
    result.checks.git = checkGit();

    // Ollama
    result.checks.ollama = checkOllama();

    result.status = "stable";
  } catch (err) {
    result.status = "error";
    result.error = err.message;
  }

  console.log(JSON.stringify(result, null, 2));
}

runHandshake();
