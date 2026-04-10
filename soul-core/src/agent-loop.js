// === IMPORTS ===
const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config();

// === CONFIG ===
const MODEL = process.env.DEFAULT_MODEL || 'oinio-soul-forge';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const LEDGER_PATH = 'soul-core/agent-ledger.json';

// === HELPERS ===
function getMemory() {
  return execSync('free -h').toString();
}

function getModels() {
  return execSync('ollama list').toString();
}

function runModel(memory, models) {
  const prompt = `
System memory:
${memory}

Installed models:
// === IMPORTS (ONLY ONCE) ===
const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config();

// === CONFIG ===
const LEDGER_PATH = 'soul-core/agent-ledger.json';
const MODEL = process.env.DEFAULT_MODEL || 'oinio-soul-forge';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

// === HELPERS ===
function getMemory() {
  return execSync('free -h').toString();
}

function getModels() {
  return execSync('ollama list').toString();
}

function runModel(memory, models) {
  const prompt = `
System memory:
${memory}

Installed models:
${models}

Respond ONLY in JSON:

{
  "action": "check_memory" | "list_models" | "none",
  "reason": "short explanation"
}
`;

  const cmd = `echo '${prompt.replace(/'/g, "'\\''")}' | ollama run ${MODEL}`;
  return execSync(cmd).toString();
}

function log(entry) {
  let data = [];

  if (fs.existsSync(LEDGER_PATH)) {
    try {
      data = JSON.parse(fs.readFileSync(LEDGER_PATH));
    } catch {
      data = [];
    }
  }

  data.push(entry);

  // keep last 100 entries
  if (data.length > 100) data = data.slice(-100);

  fs.writeFileSync(LEDGER_PATH, JSON.stringify(data, null, 2));
}

// === ACTION LAYER ===
function executeSafeAction(result) {
  console.log("\n=== ACTION LAYER ===\n");

  try {
    const parsed = JSON.parse(result);

    if (parsed.action === "check_memory") {
      console.log(execSync("free -h").toString());
    }

    else if (parsed.action === "list_models") {
      console.log(execSync("ollama list").toString());
    }

    else {
      console.log("No action taken.");
    }

  } catch (e) {
    console.log("Invalid JSON from model.");
  }
}

// === MAIN LOOP ===
function runAgentLoop() {
  try {
    console.log("OLLAMA_HOST =", process.env.OLLAMA_HOST);

    const memory = getMemory();
    const models = getModels();
    const output = runModel(memory, models);

    console.log("\n=== MODEL OUTPUT ===\n");
    console.log(output);

    executeSafeAction(output);

    const entry = {
      timestamp: new Date().toISOString(),
      system: {
        memory_summary: memory.split('\n')[1],
        models_summary: models.split('\n').slice(0, 4)
      },
      decision_raw: output.trim(),
      status: "ok"
    };

    log(entry);

  } catch (err) {
    console.error("ERROR:", err.message);

    log({
      timestamp: new Date().toISOString(),
      status: "error",
      error: err.message
    });
  }
}

// === RUN ===
runAgentLoop();${models}

You are a low-memory local AI agent.
ONLY suggest safe, lightweight actions.

What is the safest next step?
`;

  return execSync(
    `echo "${prompt.replace(/"/g, '\\"')}" | ollama run ${MODEL}`,
    { env: { ...process.env, OLLAMA_HOST } }
  ).toString();
}

// === LOGGING ===
function log(entry) {
  let data = [];

  if (fs.existsSync(LEDGER_PATH)) {
    data = JSON.parse(fs.readFileSync(LEDGER_PATH));
  }

  data.push(entry);

  if (data.length > 100) {
    data = data.slice(-100);
  }

  fs.writeFileSync(LEDGER_PATH, JSON.stringify(data, null, 2));
}

// === MAIN LOOP ===
function runAgentLoop() {
  try {
    const memory = getMemory();
    const models = getModels();
    const output = runModel(memory, models);

    const entry = {
      timestamp: new Date().toISOString(),
      system: {
        memory_summary: memory.split('\n')[1],
        models_summary: models.split('\n').slice(0, 4)
      },
      decision: output.trim(),
      status: "ok"
    };

    console.log("=== AGENT DECISION ===\n");
    console.log(output);

    log(entry);

  } catch (err) {
    console.error("ERROR:", err.message);

    log({
      timestamp: new Date().toISOString(),
      status: "error",
      error: err.message
    });
  }
}

// === RUN ===
runAgentLoop();
