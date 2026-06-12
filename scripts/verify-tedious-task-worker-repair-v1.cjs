const fs = require("fs");
const receiptPath = "receipts/local-autonomy/tedious-task-worker-repair-v1.json";
const workerPath = "local-autonomy/tedious-task-worker-v1.cjs";
const docPath = "docs/local-autonomy/TEDIOUS_TASK_WORKER_REPAIR_V1.md";

function fail(msg) {
  console.error("FAIL tedious-task-worker-repair-v1: " + msg);
  process.exit(1);
}

for (const path of [receiptPath, workerPath, docPath]) {
  if (!fs.existsSync(path)) fail("missing " + path);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const worker = fs.readFileSync(workerPath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.local_autonomy.tedious_task_worker_repair.v1") fail("wrong schema");
if (receipt.non_execution_boundary !== true) fail("non execution boundary missing");

for (const key of ["activation", "unpark", "deploy", "broadcast", "keys", "zero_g_actions"]) {
  if (receipt[key] !== false) fail("execution flag not false: " + key);
}

for (const term of ["## Deterministic PR Verdict", "CONFLICTING", "HOLD / BLOCKED", "SAFE CANDIDATE", "const compact", "TEDIOUS_WORKER_OLLAMA_TIMEOUT_MS"]) {
  if (!worker.includes(term)) fail("worker missing " + term);
}

for (const term of ["Deterministic Verdict Rule", "CONFLICTING => HOLD / BLOCKED", "No unpark"]) {
  if (!doc.includes(term)) fail("doc missing " + term);
}

console.log("PASS tedious-task-worker-repair-v1");
