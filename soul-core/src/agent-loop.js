const fs = require('fs');
const { execFileSync } = require('child_process');
require('dotenv').config();

const MODEL = process.env.DEFAULT_MODEL || 'qwen2.5:0.5b';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const LEDGER_PATH = 'soul-core/agent-ledger.json';
const TIMEOUT_MS = Number(process.env.AGENT_LOOP_TIMEOUT_MS || 30000);

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
    env: { ...process.env, OLLAMA_HOST },
    ...options,
  });
}

function getMemory() {
  return run('free', ['-h']);
}

function getResidentModels() {
  return run('ollama', ['ps']);
}

function runModel(memory, residentModels) {
  const prompt = [
    'You are a low-memory local guardian agent.',
    'Return ONLY compact JSON with keys action and reason.',
    'Allowed actions: check_memory, list_models, none.',
    '',
    'System memory:',
    memory.split('\n').slice(0, 3).join('\n'),
    '',
    'Resident models:',
    residentModels.trim() || 'none',
  ].join('\n');

  return run('ollama', ['run', MODEL], { input: prompt });
}

function readLedger() {
  if (!fs.existsSync(LEDGER_PATH)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function log(entry) {
  const data = readLedger();
  data.push(entry);
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(data.slice(-100), null, 2));
}

function executeSafeAction(result) {
  let parsed;

  try {
    parsed = JSON.parse(result);
  } catch {
    return 'invalid_json';
  }

  if (parsed.action === 'check_memory') {
    console.log(getMemory());
  } else if (parsed.action === 'list_models') {
    console.log(getResidentModels());
  }

  return parsed.action || 'none';
}

function runAgentLoop() {
  try {
    const memory = getMemory();
    const residentModels = getResidentModels();
    const output = runModel(memory, residentModels).trim();
    const action = executeSafeAction(output);

    console.log('=== AGENT DECISION ===\n');
    console.log(output);

    log({
      timestamp: new Date().toISOString(),
      system: {
        memory_summary: memory.split('\n')[1],
        resident_models_summary: residentModels.split('\n').slice(0, 4),
      },
      model: MODEL,
      decision_raw: output,
      action,
      status: 'ok',
    });
  } catch (err) {
    console.error('ERROR:', err.message);
    log({
      timestamp: new Date().toISOString(),
      model: MODEL,
      status: 'error',
      error: err.message,
    });
    process.exitCode = 1;
  }
}

runAgentLoop();
