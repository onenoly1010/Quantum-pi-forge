const fs = require("fs");

const docPath = "docs/autonomous/SUPERVISED_ACTIVATION_RUNTIME_HYGIENE_V1.md";
const scriptPath = "scripts/supervised-autonomous-activation-v1.cjs";
const gitignorePath = ".gitignore";

function fail(message) {
  console.error("FAIL supervised-activation-runtime-hygiene-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(scriptPath)) fail("missing supervised activation command");
if (!fs.existsSync(gitignorePath)) fail("missing .gitignore");

const doc = fs.readFileSync(docPath, "utf8");
const script = fs.readFileSync(scriptPath, "utf8");
const gitignore = fs.readFileSync(gitignorePath, "utf8");

const checks = [
  ["doc reason", doc.includes("untracked files on main")],
  ["doc ignored runtime path", doc.includes("runtime/autonomous/runs/")],
  ["doc no live claim", doc.includes("This lane does not claim live activation.")],
  ["script runtime default", script.includes('path.join("runtime", "autonomous", "runs")')],
  ["script override supported", script.includes("QPF_AUTONOMOUS_RECEIPT_DIR")],
  ["script still refuses irreversible action", script.includes("irreversible_network_action_executed: false")],
  ["script still refuses private key", script.includes("private_key_access_refused: true")],
  ["gitignore runtime path", gitignore.split(/\r?\n/).includes("runtime/autonomous/runs/")]
];

for (const [name, ok] of checks) {
  if (!ok) fail("invalid field: " + name);
}

console.log("PASS supervised-activation-runtime-hygiene-v1");
