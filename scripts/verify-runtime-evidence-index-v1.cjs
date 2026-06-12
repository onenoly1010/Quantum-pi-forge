const fs = require("fs");
const path = "receipts/local-autonomy/runtime-evidence-index-v1.json";
function fail(msg){ console.error("FAIL runtime-evidence-index-v1: " + msg); process.exit(1); }
if (!fs.existsSync(path)) fail("missing index");
const index = JSON.parse(fs.readFileSync(path, "utf8"));
if (index.schema !== "qpf.local_autonomy.runtime_evidence_index.v1") fail("wrong schema");
if (index.non_execution_boundary !== true) fail("non execution boundary missing");
if (index.raw_runtime_dir_committed !== false) fail("raw runtime dir must not be committed");
if (index.pid_files_committed !== false) fail("pid files must not be committed");
if (!Array.isArray(index.items)) fail("items missing");
if (index.items.length < 1) fail("items empty");
for (const item of index.items) {
  const p = item.path || "";
  const status = item.status || "";
  const isSupervised = item.schema === "qpf.autonomous.supervised_activation_run.v1";
  const isReadOnlyProbe = p.includes("readonly-live-probe") || status.includes("read") || status.includes("probe");
  if (isSupervised) {
    if (item.irreversible_network_action_executed !== false) fail("supervised execution not false for " + p);
    if (item.private_key_access_refused !== true) fail("supervised private key refusal not true for " + p);
  }
  if (!isSupervised && !isReadOnlyProbe) {
    if (item.irreversible_network_action_executed === true) fail("unsafe execution true for " + p);
  }
  if (item.private_key_present === true && item.private_key_access_refused !== true && isSupervised) fail("private key present without refusal for " + p);
}
console.log("PASS runtime-evidence-index-v1");
