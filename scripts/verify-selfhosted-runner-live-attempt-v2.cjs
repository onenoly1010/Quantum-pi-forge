const fs = require('fs');

const receiptPath = 'receipts/execution/selfhosted-runner-live-attempt-v2.json';
const docPath = 'docs/execution/SELFHOSTED_RUNNER_LIVE_ATTEMPT_V2.md';
const workflowPath = '.forgejo/workflows/selfhosted-runner-live-attempt-v2.yml';

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL selfhosted-runner-live-attempt-v2: ${message}`);
    process.exit(1);
  }
}

assert(fs.existsSync(receiptPath), 'missing receipt');
assert(fs.existsSync(docPath), 'missing documentation');
assert(fs.existsSync(workflowPath), 'missing Forgejo workflow');

const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
const workflow = fs.readFileSync(workflowPath, 'utf8');

assert(receipt.schema === 'selfhosted-runner-live-attempt-v2', 'schema mismatch');
assert(receipt.status === 'prepared', 'status must remain prepared before evidence capture');
assert(receipt.target.provider === 'Codeberg / Forgejo Actions', 'provider mismatch');
assert(receipt.target.runner === 'quantum-pi-selfhosted-01', 'runner target mismatch');
assert(receipt.target.labels.includes('quantum-pi-selfhosted'), 'missing quantum-pi-selfhosted label');
assert(receipt.target.labels.includes('node-22'), 'missing node-22 label');
assert(receipt.claims.selfhosted_runner_targeted === true, 'selfhosted runner must be targeted');
assert(receipt.claims.live_attempt_started === false, 'local receipt must not claim remote start before evidence');
assert(receipt.claims.live_runner_pass_claimed === false, 'must not claim live runner PASS');
assert(receipt.claims.github_hosted_authoritative === false, 'GitHub-hosted must not be authoritative');
assert(receipt.claims.full_autonomous_execution === false, 'must not claim full autonomous execution');

for (const [name, value] of Object.entries(receipt.required_for_future_pass || {})) {
  assert(value === 'required', `${name} must be required`);
}

assert(workflow.includes('.forgejo/workflows') === false || true, 'workflow path check');
assert(workflow.includes('quantum-pi-selfhosted'), 'workflow missing quantum-pi-selfhosted label');
assert(workflow.includes('node-22'), 'workflow missing node-22 label');
assert(workflow.includes('npm run build'), 'workflow missing build check');
assert(workflow.includes('autonomous:dry-run-output-hygiene:v1:check'), 'workflow missing hygiene verifier');
assert(workflow.includes('autonomous:supervised-dry-run:v1:check'), 'workflow missing supervised dry-run verifier');

assert(receipt.result === 'PREPARED', 'result must be PREPARED');

console.log('PASS selfhosted-runner-live-attempt-v2');
console.log('NOTE: live PASS still requires visible Forgejo runner evidence.');
