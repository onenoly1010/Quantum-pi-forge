const fs = require("fs");

const docPath = "docs/autonomous/SUPERVISED_AUTONOMOUS_ACTIVATION_COMMAND_V1.md";
const scriptPath = "scripts/supervised-autonomous-activation-v1.cjs";

function fail(message) {
  console.error("FAIL supervised-autonomous-activation-command-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(scriptPath)) fail("missing command script");

const doc = fs.readFileSync(docPath, "utf8");
const script = fs.readFileSync(scriptPath, "utf8");

const docNeedles = [
  "dry-run-only autonomous activation command",
  "default to dry-run mode",
  "refuse irreversible network action",
  "refuse private key access",
  "preserve operator override",
  "This lane does not claim full autonomous network operation.",
  "npm run autonomous:supervised-activation:v1"
];

for (const needle of docNeedles) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

const scriptNeedles = [
  "irreversible_network_action_executed: false",
  "irreversible_network_action_refused: true",
  "private_key_access_refused: true",
  "operator_override_preserved: true",
  "full_autonomy_claimed: false",
  "refused_live_mode",
  "refused_private_key_context"
];

for (const needle of scriptNeedles) {
  if (!script.includes(needle)) fail("script missing: " + needle);
}

console.log("PASS supervised-autonomous-activation-command-v1");
