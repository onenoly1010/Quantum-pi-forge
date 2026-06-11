const { spawnSync } = require("child_process");
const fs = require("fs");

const docPath = "docs/autonomous/SUPERVISED_ACTIVATION_REFUSAL_TESTS_V1.md";

function fail(message) {
  console.error("FAIL supervised-activation-refusal-tests-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(docPath)) fail("missing document");

const doc = fs.readFileSync(docPath, "utf8");

for (const needle of [
  "must refuse live mode",
  "must refuse private-key context",
  "must not execute live deployment",
  "must not expose or require real secrets",
  "runner_implementation_frozen == true"
]) {
  if (!doc.includes(needle)) fail("document missing: " + needle);
}

function runRefusal(label, args, envExtra, expectedStatus) {
  const result = spawnSync(process.execPath, ["scripts/supervised-autonomous-activation-v1.cjs", ...args], {
    encoding: "utf8",
    env: { ...process.env, ...envExtra }
  });

  const output = `${result.stdout || ""}\n${result.stderr || ""}`;

  if (result.status !== 2) {
    fail(`${label}: expected exit code 2, got ${result.status}. Output:\n${output}`);
  }

  if (!output.includes(`SUPERVISED_ACTIVATION_V1_STATUS=${expectedStatus}`)) {
    fail(`${label}: missing expected status ${expectedStatus}. Output:\n${output}`);
  }

  if (!output.includes("SUPERVISED_ACTIVATION_V1_RECEIPT=runtime/autonomous/runs/")) {
    fail(`${label}: receipt did not use ignored runtime path. Output:\n${output}`);
  }

  return output;
}

const liveOutput = runRefusal("live refusal", ["--live"], {}, "refused_live_mode");
const keyOutput = runRefusal("private key refusal", [], { PRIVATE_KEY: "redacted-test-value-not-a-real-secret" }, "refused_private_key_context");

if (!liveOutput.includes("SUPERVISED_ACTIVATION_V1_SHA256=")) fail("live refusal missing sha");
if (!keyOutput.includes("SUPERVISED_ACTIVATION_V1_SHA256=")) fail("private key refusal missing sha");

console.log("PASS supervised-activation-refusal-tests-v1");
