const fs = require("fs");
const cp = require("child_process");
function run(cmd) {
  try { return cp.execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
  catch (err) { return ((err.stdout || "") + (err.stderr || "")).trim(); }
}
const findings = {
  mode: "inspection_only",
  wrapper_executed: false,
  stash_applied: false,
  deployment_executed: false,
  broadcast_executed: false,
  state_changing_transaction_executed: false,
  wrapper_files: run("find docs receipts scripts runtime -type f \\( -iname '*wrapper*' -o -iname '*execute*' -o -iname '*execution*' -o -iname '*runtime*' \\) -print 2>/dev/null | sort").split(/\\n/).filter(Boolean),
  package_scripts: run("node -e \\\"const p=require('./package.json'); const s=p.scripts||{}; for (const [k,v] of Object.entries(s)) if (/wrapper|execution|execute/i.test(k+' '+v)) console.log(k+'='+v)\\\"").split(/\\n/).filter(Boolean),
  status_lines: run("grep -RInE '\\\"?(wrapper_status|status|exit_code|exitCode|code|executed|execution_executed|wrapper_executed|deployment_executed|broadcast_executed|state_changing_transaction_executed)\\\"?[[:space:]]*[:=]' docs receipts scripts runtime package.json 2>/dev/null || true").split(/\\n/).filter(Boolean)
};
console.log(JSON.stringify(findings, null, 2));
