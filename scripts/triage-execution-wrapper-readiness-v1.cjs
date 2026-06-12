const cp = require("child_process");
function run(cmd) {
  try { return cp.execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
  catch (err) { return ((err.stdout || "") + (err.stderr || "")).trim(); }
}
const result = {
  mode: "triage_only",
  stash_applied: false,
  wrapper_executed: false,
  deployment_executed: false,
  broadcast_executed: false,
  state_changing_transaction_executed: false,
  wrapper_candidates: run("find . -path ./node_modules -prune -o -path ./.git -prune -o -type f \\( -iname '*wrapper*' -o -iname '*execute*' -o -iname '*execution*' -o -iname '*runtime*' -o -iname '*deploy*' \\) -print | sort").split(/\\n/).filter(Boolean),
  package_scripts: run("node -e \\\"const p=require('./package.json'); const s=p.scripts||{}; for (const [k,v] of Object.entries(s)) if (/wrapper|execution|execute|runtime|deploy|readiness|triage/i.test(k+' '+v)) console.log(k+'='+v)\\\"").split(/\\n/).filter(Boolean),
  failure_signatures: run("grep -RInE 'process\\.exit\\(|throw new Error|console\\.error|FAIL|failed_or_missing|exit_code|exitCode|wrapper_status|ENOENT|missing|required' scripts docs receipts package.json 2>/dev/null || true").split(/\\n/).filter(Boolean)
};
console.log(JSON.stringify(result, null, 2));
